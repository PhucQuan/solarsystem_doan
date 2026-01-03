import React from 'react';
import '../styles/TourControls.css';

/**
 * Tour Controls - Playback controls và progress bar
 * Hiển thị ở dưới cùng màn hình
 */
const TourControls = ({
    tour,
    currentStopIndex,
    progress,
    isPlaying,
    isPaused,
    onPlay,
    onPause,
    onResume,
    onStop,
    onNext,
    onPrevious,
    canGoNext,
    canGoPrevious
}) => {
    if (!isPlaying) return null;

    const currentStop = tour?.stops[currentStopIndex];

    return (
        <div className="tour-controls">
            <div className="tour-controls-container">
                {/* Tour Info */}
                <div className="tour-info-section">
                    <div className="tour-icon">🚀</div>
                    <div className="tour-text-info">
                        <h4 className="tour-name">{tour.title}</h4>
                        <p className="tour-progress-text">
                            Điểm {currentStopIndex + 1} / {tour.stops.length}
                            {currentStop && `: ${currentStop.title}`}
                        </p>
                    </div>
                </div>

                {/* Playback Controls */}
                <div className="playback-controls">
                    <button
                        className="control-btn"
                        onClick={onPrevious}
                        disabled={!canGoPrevious}
                        title="Quay lại"
                    >
                        <span>⏮️</span>
                    </button>

                    {isPaused ? (
                        <button
                            className="control-btn play-btn"
                            onClick={onResume}
                            title="Tiếp tục"
                        >
                            <span>▶️</span>
                        </button>
                    ) : (
                        <button
                            className="control-btn pause-btn"
                            onClick={onPause}
                            title="Tạm dừng"
                        >
                            <span>⏸️</span>
                        </button>
                    )}

                    <button
                        className="control-btn"
                        onClick={onNext}
                        disabled={!canGoNext}
                        title="Tiếp theo"
                    >
                        <span>⏭️</span>
                    </button>

                    <button
                        className="control-btn stop-btn"
                        onClick={onStop}
                        title="Dừng tour"
                    >
                        <span>⏹️</span>
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="progress-section">
                    <div className="progress-bar-wrapper">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${progress}%` }}
                            />
                            <div className="progress-stops">
                                {tour.stops.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`progress-stop ${index <= currentStopIndex ? 'completed' : ''}`}
                                        style={{ left: `${(index / (tour.stops.length - 1)) * 100}%` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourControls;
