import { motion } from 'framer-motion';
import { Eye, Focus, Globe2 } from 'lucide-react';

export default function ViewModeControl({ viewMode, onViewModeChange, showOrbits, onToggleOrbits }) {
    const viewModes = [
        { id: 'heliocentric', label: 'Heliocentric', icon: Focus, description: 'Nhìn từ Mặt Trời' },
        { id: 'geocentric', label: 'Geocentric', icon: Globe2, description: 'Nhìn từ Trái Đất' },
        { id: 'free', label: 'Free View', icon: Eye, description: 'Tự do' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
                position: 'fixed',
                top: '100px',
                right: '20px',
                zIndex: 1000,
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '16px',
                minWidth: '200px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            }}
        >
            <h3 style={{
                margin: '0 0 12px 0',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px'
            }}>
                Chế độ xem
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {viewModes.map((mode) => {
                    const Icon = mode.icon;
                    const isActive = viewMode === mode.id;

                    return (
                        <motion.button
                            key={mode.id}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onViewModeChange(mode.id)}
                            style={{
                                background: isActive
                                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                    : 'rgba(255, 255, 255, 0.05)',
                                border: isActive
                                    ? '1px solid rgba(102, 126, 234, 0.3)'
                                    : '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                padding: '12px',
                                color: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <Icon size={18} color={isActive ? '#fff' : '#888'} />
                            <div style={{ textAlign: 'left', flex: 1 }}>
                                <div style={{ fontSize: '13px', fontWeight: isActive ? '600' : '400' }}>
                                    {mode.label}
                                </div>
                                <div style={{ fontSize: '10px', color: isActive ? '#ddd' : '#666', marginTop: '2px' }}>
                                    {mode.description}
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Orbital Paths Toggle */}
            <div style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onToggleOrbits}
                    style={{
                        background: showOrbits
                            ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                            : 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '12px',
                        color: '#fff',
                        cursor: 'pointer',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '13px',
                        fontWeight: '500',
                    }}
                >
                    <span>Hiển thị quỹ đạo</span>
                    <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '4px',
                        background: showOrbits ? '#fff' : 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {showOrbits && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{ color: '#f5576c', fontSize: '12px' }}
                            >
                                ✓
                            </motion.div>
                        )}
                    </div>
                </motion.button>
            </div>
        </motion.div>
    );
}
