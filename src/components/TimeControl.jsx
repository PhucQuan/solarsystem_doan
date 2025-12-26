import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Calendar } from 'lucide-react';

export default function TimeControl({
    isPlaying,
    timeSpeed,
    currentDate,
    onPlayPause,
    onSpeedChange,
    onDateChange
}) {
    const speedOptions = [
        { label: '1x', value: 1 },
        { label: '10x', value: 10 },
        { label: '100x', value: 100 },
        { label: '1000x', value: 1000 },
        { label: 'Real', value: 1 / (24 * 60 * 60) } // Real time (1 giây = 1 giây thực)
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                position: 'fixed',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            }}
        >
            {/* Play/Pause Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onPlayPause}
                style={{
                    background: isPlaying
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                }}
            >
                {isPlaying ? (
                    <Pause size={20} color="#fff" fill="#fff" />
                ) : (
                    <Play size={20} color="#fff" fill="#fff" style={{ marginLeft: '2px' }} />
                )}
            </motion.button>

            {/* Speed Control */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: '#888', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Tốc độ
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                    {speedOptions.map((option) => (
                        <motion.button
                            key={option.value}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSpeedChange(option.value)}
                            style={{
                                background: timeSpeed === option.value
                                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                    : 'rgba(255, 255, 255, 0.05)',
                                border: timeSpeed === option.value
                                    ? '1px solid rgba(102, 126, 234, 0.3)'
                                    : '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                color: '#fff',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: timeSpeed === option.value ? 'bold' : 'normal',
                            }}
                        >
                            {option.label}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Date Display */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
                <Calendar size={16} color="#667eea" />
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>
                    {currentDate.toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </span>
            </div>

            {/* Quick Navigation */}
            <div style={{ display: 'flex', gap: '8px' }}>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDateChange(-30)} // Lùi 30 ngày
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                    }}
                >
                    <SkipBack size={14} color="#fff" />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDateChange(30)} // Tiến 30 ngày
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                    }}
                >
                    <SkipForward size={14} color="#fff" />
                </motion.button>
            </div>
        </motion.div>
    );
}
