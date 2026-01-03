import React, { useState, useEffect } from 'react';
import { useTourPlayer } from '../hooks/useTourPlayer';
import TourSelector from './TourSelector';
import AIGuidePanel from './AIGuidePanel';
import TourControls from './TourControls';
import cameraController from '../utils/cameraController';

/**
 * Tour Manager - Main orchestrator cho tour system
 * @param {THREE.Camera} camera - Three.js camera reference
 * @param {Object} planetRefs - References đến planet meshes
 * @param {Function} onTourStateChange - Callback khi tour state thay đổi
 * @param {Function} onPlanetFocus - Callback khi tour focus vào một hành tinh
 */
const TourManager = ({ camera, planetRefs, onTourStateChange, onPlanetFocus }) => {
    const [selectedTour, setSelectedTour] = useState(null);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    // Use tour player hook - Pass .current values, not refs
    const {
        currentStop,
        currentStopIndex,
        isPlaying,
        isPaused,
        progress,
        autoAdvanceProgress,
        totalStops,
        startTour,
        pauseTour,
        resumeTour,
        stopTour,
        goToNextStop,
        goToPreviousStop,
        canGoNext,
        canGoPrevious
    } = useTourPlayer(selectedTour, camera?.current, planetRefs?.current, onPlanetFocus);

    // Notify parent về tour state changes
    useEffect(() => {
        if (onTourStateChange) {
            onTourStateChange({
                isActive: isPlaying,
                isPaused,
                currentTour: selectedTour,
                currentStop
            });
        }
    }, [isPlaying, isPaused, selectedTour, currentStop, onTourStateChange]);

    const handleSelectTour = (tour) => {
        setSelectedTour(tour);
        // Bắt đầu tour ngay sau khi chọn
        setTimeout(() => {
            startTour();
        }, 100);
    };

    const handleStopTour = () => {
        stopTour();
        setSelectedTour(null);
    };

    return (
        <>
            {/* Tour Selector Modal */}
            <TourSelector
                isOpen={isSelectorOpen}
                onClose={() => setIsSelectorOpen(false)}
                onSelectTour={handleSelectTour}
            />

            {/* AI Guide Panel */}
            {isPlaying && currentStop && (
                <AIGuidePanel
                    currentStop={currentStop}
                    isPlaying={isPlaying}
                    isPaused={isPaused}
                    autoAdvanceProgress={autoAdvanceProgress}
                    onNext={goToNextStop}
                    onPause={pauseTour}
                    onResume={resumeTour}
                />
            )}

            {/* Tour Controls */}
            {isPlaying && selectedTour && (
                <TourControls
                    tour={selectedTour}
                    currentStopIndex={currentStopIndex}
                    progress={progress}
                    isPlaying={isPlaying}
                    isPaused={isPaused}
                    onPlay={startTour}
                    onPause={pauseTour}
                    onResume={resumeTour}
                    onStop={handleStopTour}
                    onNext={goToNextStop}
                    onPrevious={goToPreviousStop}
                    canGoNext={canGoNext}
                    canGoPrevious={canGoPrevious}
                />
            )}

            {/* Tour Launch Button - Hiện khi không có tour active */}
            {!isPlaying && (
                <button
                    className="tour-launch-btn"
                    onClick={() => setIsSelectorOpen(true)}
                    title="Bắt đầu tour với AI Guide"
                >
                    <span className="tour-launch-icon">🚀</span>
                    <span className="tour-launch-text">AI Tour Guide</span>
                </button>
            )}
        </>
    );
};

export default TourManager;
