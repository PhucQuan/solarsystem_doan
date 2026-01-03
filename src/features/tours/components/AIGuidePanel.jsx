import React, { useState, useEffect } from 'react';
import '../styles/AIGuidePanel.css';

/**
 * AI Guide Panel - Hiển thị narration và facts trong tour
 * Đặt ở bên phải màn hình (side panel)
 */
const AIGuidePanel = ({
    currentStop,
    isPlaying,
    autoAdvanceProgress,
    onNext,
    onPause,
    onResume,
    isPaused
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentFactIndex, setCurrentFactIndex] = useState(0);

    // Typewriter effect cho narration
    useEffect(() => {
        if (!currentStop || !isPlaying) {
            setDisplayedText('');
            return;
        }

        setIsTyping(true);
        setDisplayedText('');

        const text = currentStop.narration;
        let index = 0;

        const typingSpeed = 30; // ms per character

        const typeInterval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText(text.substring(0, index + 1));
                index++;
            } else {
                setIsTyping(false);
                clearInterval(typeInterval);
            }
        }, typingSpeed);

        return () => clearInterval(typeInterval);
    }, [currentStop, isPlaying]);

    // Rotate facts every 4 seconds
    useEffect(() => {
        if (!currentStop?.facts || currentStop.facts.length === 0) return;

        const factInterval = setInterval(() => {
            setCurrentFactIndex((prev) =>
                (prev + 1) % currentStop.facts.length
            );
        }, 4000);

        return () => clearInterval(factInterval);
    }, [currentStop]);

    if (!isPlaying || !currentStop) return null;

    return (
        <div className="ai-guide-panel">
            {/* Header với AI Avatar */}
            <div className="ai-guide-header">
                <div className="ai-avatar">
                    <span className="ai-icon">🤖</span>
                    <div className="ai-pulse"></div>
                </div>
                <div className="ai-info">
                    <h3>AI Tour Guide</h3>
                    <p className="ai-status">
                        {isTyping ? 'Đang kể chuyện...' : 'Sẵn sàng'}
                    </p>
                </div>
            </div>

            {/* Stop Title */}
            <div className="stop-title-section">
                <h2 className="stop-title">{currentStop.title}</h2>
                {currentStop.target && (
                    <span className="target-badge">{currentStop.target}</span>
                )}
            </div>

            {/* Narration với Typewriter Effect */}
            <div className="narration-section">
                <div className="narration-text">
                    {displayedText}
                    {isTyping && <span className="typing-cursor">|</span>}
                </div>
            </div>

            {/* Facts Section */}
            {currentStop.facts && currentStop.facts.length > 0 && (
                <div className="facts-section">
                    <div className="facts-header">
                        <span className="bulb-icon">💡</span>
                        <h4>Bạn có biết?</h4>
                    </div>
                    <div className="facts-carousel">
                        <div className="fact-item" key={currentFactIndex}>
                            {currentStop.facts[currentFactIndex]}
                        </div>
                        <div className="fact-indicators">
                            {currentStop.facts.map((_, index) => (
                                <span
                                    key={index}
                                    className={`indicator ${index === currentFactIndex ? 'active' : ''}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Auto-Advance Progress Bar */}
            {!isPaused && autoAdvanceProgress > 0 && (
                <div className="auto-advance-section">
                    <div className="auto-advance-label">
                        Điểm tiếp theo trong: {Math.ceil((100 - autoAdvanceProgress) / 10)}s
                    </div>
                    <div className="auto-advance-bar">
                        <div
                            className="auto-advance-fill"
                            style={{ width: `${autoAdvanceProgress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="quick-actions">
                {isPaused ? (
                    <button className="action-btn resume-btn" onClick={onResume}>
                        <span>▶️</span> Tiếp tục
                    </button>
                ) : (
                    <button className="action-btn pause-btn" onClick={onPause}>
                        <span>⏸️</span> Tạm dừng
                    </button>
                )}
                <button className="action-btn next-btn" onClick={onNext}>
                    <span>⏭️</span> Tiếp theo
                </button>
            </div>
        </div>
    );
};

export default AIGuidePanel;
