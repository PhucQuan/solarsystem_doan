import React from 'react';
import { TOURS } from '../data/tourLibrary';
import '../styles/TourSelector.css';

/**
 * Tour Selector - Modal để chọn tour
 */
const TourSelector = ({ isOpen, onClose, onSelectTour }) => {
    if (!isOpen) return null;

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner':
                return '#10b981';
            case 'intermediate':
                return '#f59e0b';
            case 'advanced':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    const getDifficultyLabel = (difficulty) => {
        switch (difficulty) {
            case 'beginner':
                return 'Người mới';
            case 'intermediate':
                return 'Trung cấp';
            case 'advanced':
                return 'Nâng cao';
            default:
                return difficulty;
        }
    };

    return (
        <div className="tour-selector-overlay" onClick={onClose}>
            <div className="tour-selector-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="tour-selector-header">
                    <div>
                        <h2 className="tour-selector-title">🚀 Chọn Hành Trình Khám Phá</h2>
                        <p className="tour-selector-subtitle">
                            Để AI Guide dẫn bạn khám phá vũ trụ
                        </p>
                    </div>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                {/* Tours Grid */}
                <div className="tours-grid">
                    {TOURS.map((tour) => (
                        <div
                            key={tour.id}
                            className="tour-card"
                            onClick={() => {
                                onSelectTour(tour);
                                onClose();
                            }}
                        >
                            {/* Gradient Border */}
                            <div className="tour-card-border" style={{
                                background: `linear-gradient(135deg, ${tour.color}40, ${tour.color}20)`
                            }}></div>

                            {/* Content */}
                            <div className="tour-card-content">
                                {/* Badge */}
                                <div className="tour-badges">
                                    <span
                                        className="difficulty-badge"
                                        style={{
                                            background: `${getDifficultyColor(tour.difficulty)}20`,
                                            color: getDifficultyColor(tour.difficulty),
                                            border: `1px solid ${getDifficultyColor(tour.difficulty)}50`
                                        }}
                                    >
                                        {getDifficultyLabel(tour.difficulty)}
                                    </span>
                                    <span className="duration-badge">
                                        ⏱️ {tour.duration}
                                    </span>
                                </div>

                                {/* Title & Description */}
                                <h3 className="tour-card-title">{tour.title}</h3>
                                <p className="tour-card-description">{tour.description}</p>

                                {/* Stats */}
                                <div className="tour-stats">
                                    <div className="stat-item">
                                        <span className="stat-icon">📍</span>
                                        <span className="stat-text">{tour.stops.length} điểm dừng</span>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <button
                                    className="start-tour-btn"
                                    style={{
                                        background: `linear-gradient(135deg, ${tour.color}, ${tour.color}dd)`
                                    }}
                                >
                                    <span>Bắt đầu tour</span>
                                    <span className="arrow">→</span>
                                </button>
                            </div>

                            {/* Hover Effect */}
                            <div className="tour-card-glow" style={{
                                background: `radial-gradient(circle at 50% 50%, ${tour.color}20, transparent 70%)`
                            }}></div>
                        </div>
                    ))}
                </div>

                {/* Footer Info */}
                <div className="tour-selector-footer">
                    <p className="footer-text">
                        💡 Bạn có thể tạm dừng, bỏ qua, hoặc thoát tour bất cứ lúc nào
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TourSelector;
