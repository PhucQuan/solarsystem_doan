import { useState, useEffect, useCallback, useRef } from 'react';
import cameraController from '../utils/cameraController';

/**
 * Custom hook quản lý tour playback logic
 * @param {Object} tour - Tour object từ tourLibrary
 * @param {THREE.Camera} camera - Three.js camera reference
 * @param {Object} planetRefs - References đến các hành tinh trong scene
 * @param {Function} onPlanetFocus - Callback khi tour focus vào một hành tinh
 */
export const useTourPlayer = (tour, camera, planetRefs, onPlanetFocus) => {
    const [currentStopIndex, setCurrentStopIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [autoAdvanceProgress, setAutoAdvanceProgress] = useState(0);

    const autoAdvanceTimerRef = useRef(null);
    const progressIntervalRef = useRef(null);

    const currentStop = tour?.stops[currentStopIndex];

    // Tính tổng progress của tour (%)
    const calculateTotalProgress = useCallback(() => {
        if (!tour) return 0;
        return ((currentStopIndex + 1) / tour.stops.length) * 100;
    }, [tour, currentStopIndex]);

    const goToNextStopRef = useRef();

    /**
     * Bắt đầu auto-advance countdown (10s progress bar)
     */
    const startAutoAdvance = useCallback(() => {
        const AUTO_ADVANCE_DURATION = 10000; // 10 seconds
        const INTERVAL = 100; // Update mỗi 100ms

        setAutoAdvanceProgress(0);

        let elapsed = 0;

        autoAdvanceTimerRef.current = setInterval(() => {
            elapsed += INTERVAL;
            const newProgress = (elapsed / AUTO_ADVANCE_DURATION) * 100;

            setAutoAdvanceProgress(newProgress);

            if (elapsed >= AUTO_ADVANCE_DURATION) {
                // Auto advance đến stop tiếp theo - use ref to avoid circular dep
                if (goToNextStopRef.current) {
                    goToNextStopRef.current();
                }
            }
        }, INTERVAL);
    }, []);

    /**
     * Stop auto-advance countdown
     */
    const stopAutoAdvance = useCallback(() => {
        if (autoAdvanceTimerRef.current) {
            clearInterval(autoAdvanceTimerRef.current);
            autoAdvanceTimerRef.current = null;
        }
        setAutoAdvanceProgress(0);
    }, []);

    /**
     * Animate camera đến một stop
     */
    const animateToStop = useCallback((stop) => {
        console.log('🎥 animateToStop called:', {
            stopTitle: stop?.title,
            hasCamera: !!camera,
            hasPlanetRefs: !!planetRefs,
            planetRefsKeys: planetRefs ? Object.keys(planetRefs) : []
        });

        if (!camera || !stop) {
            console.warn('⚠️ Missing camera or stop:', { camera: !!camera, stop: !!stop });
            return;
        }

        // Lấy vị trí target (planet position hoặc custom position)
        let targetLookAt = stop.lookAt || { x: 0, y: 0, z: 0 };

        // Nếu stop có target planet, lấy vị trí của planet đó
        if (stop.target && planetRefs && planetRefs[stop.target.toLowerCase()]) {
            const planetMesh = planetRefs[stop.target.toLowerCase()];
            targetLookAt = {
                x: planetMesh.position.x,
                y: planetMesh.position.y,
                z: planetMesh.position.z
            };
            console.log('📍 Target planet found:', stop.target, targetLookAt);
        }

        console.log('✈️ Flying camera to:', {
            from: { x: camera.position.x, y: camera.position.y, z: camera.position.z },
            to: stop.cameraPos,
            lookAt: targetLookAt,
            duration: stop.flyDuration || 3000
        });

        // Fly camera đến vị trí
        cameraController.flyTo(
            camera,
            stop.cameraPos,
            targetLookAt,
            stop.flyDuration || 3000,
            () => {
                console.log('✅ Camera animation complete');

                // Trigger planet focus để mở info panel
                if (stop.target && onPlanetFocus) {
                    console.log('🎯 Triggering planet focus:', stop.target);
                    onPlanetFocus(stop.target);
                } else if (!stop.target && onPlanetFocus) {
                    // Close panel if no target (overview shots)
                    console.log('🔒 Closing planet panel (no target)');
                    onPlanetFocus(null);
                }

                // Khi animation camera xong, bắt đầu countdown auto-advance
                if (isPlaying && !isPaused) {
                    startAutoAdvance();
                }
            }
        );
    }, [camera, planetRefs, isPlaying, isPaused, startAutoAdvance, onPlanetFocus]);

    /**
   * Bắt đầu tour
   */
    const startTour = useCallback(() => {
        setIsPlaying(true);
        setIsPaused(false);
        setCurrentStopIndex(0);
        setProgress(0);

        // Delay một chút để đảm bảo refs đã ready
        setTimeout(() => {
            if (tour && tour.stops[0]) {
                console.log('Starting tour animation to first stop:', tour.stops[0].title);
                animateToStop(tour.stops[0]);
            }
        }, 100);
    }, [tour, animateToStop]);

    /**
     * Pause tour
     */
    const pauseTour = useCallback(() => {
        setIsPaused(true);
        stopAutoAdvance();
        cameraController.pauseAllAnimations();
    }, [stopAutoAdvance]);

    /**
     * Resume tour
     */
    const resumeTour = useCallback(() => {
        setIsPaused(false);
        cameraController.resumeAllAnimations();

        // Resume auto-advance nếu camera không đang animate
        if (!cameraController.getIsAnimating()) {
            startAutoAdvance();
        }
    }, [startAutoAdvance]);

    /**
     * Stop tour
     */
    const stopTour = useCallback(() => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentStopIndex(0);
        setProgress(0);
        stopAutoAdvance();
        cameraController.stopAllAnimations();
    }, [stopAutoAdvance]);

    /**
     * Đến stop tiếp theo
     */
    const goToNextStop = useCallback(() => {
        stopAutoAdvance();

        if (!tour) return;

        if (currentStopIndex < tour.stops.length - 1) {
            const nextIndex = currentStopIndex + 1;
            setCurrentStopIndex(nextIndex);
            animateToStop(tour.stops[nextIndex]);
        } else {
            // Tour kết thúc
            stopTour();
        }
    }, [tour, currentStopIndex, animateToStop, stopTour, stopAutoAdvance]);

    // Sync goToNextStop ref cho auto-advance
    useEffect(() => {
        goToNextStopRef.current = goToNextStop;
    }, [goToNextStop]);

    /**
     * Quay lại stop trước
     */
    const goToPreviousStop = useCallback(() => {
        stopAutoAdvance();

        if (currentStopIndex > 0) {
            const prevIndex = currentStopIndex - 1;
            setCurrentStopIndex(prevIndex);
            animateToStop(tour.stops[prevIndex]);
        }
    }, [currentStopIndex, animateToStop, tour, stopAutoAdvance]);

    /**
     * Skip đến stop cụ thể
     */
    const goToStop = useCallback((stopIndex) => {
        stopAutoAdvance();

        if (tour && stopIndex >= 0 && stopIndex < tour.stops.length) {
            setCurrentStopIndex(stopIndex);
            animateToStop(tour.stops[stopIndex]);
        }
    }, [tour, animateToStop, stopAutoAdvance]);

    // Update progress khi currentStop thay đổi
    useEffect(() => {
        setProgress(calculateTotalProgress());
    }, [currentStopIndex, calculateTotalProgress]);

    // Cleanup khi unmount
    useEffect(() => {
        return () => {
            stopAutoAdvance();
            cameraController.stopAllAnimations();
        };
    }, [stopAutoAdvance]);

    return {
        // State
        currentStop,
        currentStopIndex,
        isPlaying,
        isPaused,
        progress,
        autoAdvanceProgress,
        totalStops: tour?.stops.length || 0,

        // Actions
        startTour,
        pauseTour,
        resumeTour,
        stopTour,
        goToNextStop,
        goToPreviousStop,
        goToStop,

        // Utilities
        isFirstStop: currentStopIndex === 0,
        isLastStop: currentStopIndex === (tour?.stops.length - 1),
        canGoNext: currentStopIndex < (tour?.stops.length - 1),
        canGoPrevious: currentStopIndex > 0
    };
};
