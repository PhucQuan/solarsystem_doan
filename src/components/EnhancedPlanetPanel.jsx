import { motion, AnimatePresence } from 'framer-motion';
import { X, Orbit, Calendar, Thermometer, Weight, Satellite } from 'lucide-react';

export default function EnhancedPlanetPanel({
    planet,
    planetData,
    loading,
    onClose
}) {
    if (!planet) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: 'spring', damping: 25 }}
                style={{
                    position: 'fixed',
                    bottom: '120px',
                    left: '20px',
                    width: '400px',
                    maxHeight: '600px',
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 20, 40, 0.95) 100%)',
                    backdropFilter: 'blur(30px)',
                    border: `2px solid ${planet.data.color}40`,
                    borderRadius: '24px',
                    padding: '0',
                    color: '#fff',
                    zIndex: 10,
                    boxShadow: `0 20px 60px ${planet.data.color}20, 0 0 100px ${planet.data.color}10`,
                    overflow: 'hidden',
                }}
            >
                {/* Header with gradient */}
                <div style={{
                    background: `linear-gradient(135deg, ${planet.data.color}30 0%, ${planet.data.color}10 100%)`,
                    padding: '24px',
                    borderBottom: `1px solid ${planet.data.color}20`,
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{
                                margin: '0',
                                fontSize: '36px',
                                background: `linear-gradient(135deg, ${planet.data.color} 0%, #fff 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontFamily: "'Orbitron', sans-serif",
                                fontWeight: '800',
                            }}>
                                {planet.name}
                            </h2>
                            {planetData && (
                                <p style={{
                                    margin: '4px 0 0 0',
                                    color: '#888',
                                    fontSize: '12px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px',
                                    fontWeight: '600'
                                }}>
                                    {planetData.isPlanet ? '🪐 Planet' : '⭐ Celestial Body'}
                                </p>
                            )}
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <X size={20} color="#fff" />
                        </motion.button>
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '24px', maxHeight: '480px', overflowY: 'auto' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    border: `4px solid ${planet.data.color}20`,
                                    borderTop: `4px solid ${planet.data.color}`,
                                    borderRadius: '50%',
                                    margin: '0 auto 16px',
                                }}
                            />
                            <p style={{ color: '#888', fontSize: '14px' }}>Đang tải dữ liệu...</p>
                        </div>
                    ) : planetData ? (
                        <>
                            {/* Main Stats Grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '12px',
                                marginBottom: '20px'
                            }}>
                                <DataCard
                                    icon={<Weight size={16} />}
                                    label="Khối lượng"
                                    value={planetData.mass || "N/A"}
                                    color={planet.data.color}
                                />
                                <DataCard
                                    icon={<Orbit size={16} />}
                                    label="Trọng lực"
                                    value={planetData.gravity ? `${planetData.gravity} m/s²` : "N/A"}
                                    color={planet.data.color}
                                />
                                <DataCard
                                    icon={<Calendar size={16} />}
                                    label="Bán kính"
                                    value={planetData.meanRadius ? `${planetData.meanRadius.toLocaleString()} km` : "N/A"}
                                    color={planet.data.color}
                                />
                                <DataCard
                                    icon={<Thermometer size={16} />}
                                    label="Nhiệt độ TB"
                                    value={planetData.avgTemp ? `${planetData.avgTemp} K` : "N/A"}
                                    color={planet.data.color}
                                />
                            </div>

                            {/* Moons Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                style={{
                                    background: `linear-gradient(135deg, ${planet.data.color}15 0%, ${planet.data.color}05 100%)`,
                                    padding: '20px',
                                    borderRadius: '16px',
                                    border: `1px solid ${planet.data.color}20`,
                                    marginBottom: '16px',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <Satellite size={20} color={planet.data.color} />
                                    <span style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        Vệ tinh tự nhiên
                                    </span>
                                </div>
                                <p style={{
                                    margin: '0',
                                    fontSize: '32px',
                                    fontWeight: 'bold',
                                    color: planet.data.color,
                                    fontFamily: "'Orbitron', sans-serif"
                                }}>
                                    {planetData.moons || 0}
                                </p>
                            </motion.div>

                            {/* Additional Info */}
                            {planetData.discoveredBy && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        marginBottom: '16px',
                                    }}
                                >
                                    <p style={{ margin: '0 0 4px 0', color: '#888', fontSize: '11px' }}>
                                        Phát hiện bởi
                                    </p>
                                    <p style={{ margin: '0', color: '#fff', fontSize: '14px' }}>
                                        {planetData.discoveredBy} ({planetData.discoveryDate || 'Unknown'})
                                    </p>
                                </motion.div>
                            )}

                            {/* Data Source Badge */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '12px',
                                background: `${planet.data.color}10`,
                                borderRadius: '12px',
                                marginTop: '20px',
                            }}>
                                <span style={{ fontSize: '16px' }}>✨</span>
                                <span style={{ color: '#aaa', fontSize: '11px', fontWeight: '500' }}>
                                    Data from Solar System OpenData API
                                </span>
                            </div>
                        </>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '16px',
                            padding: '20px 0'
                        }}>
                            <div>
                                <p style={{ margin: '0 0 8px 0', color: '#888', fontSize: '12px' }}>Kích thước</p>
                                <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold' }}>
                                    {planet.data.size} units
                                </p>
                            </div>
                            <div>
                                <p style={{ margin: '0 0 8px 0', color: '#888', fontSize: '12px' }}>Khoảng cách</p>
                                <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold' }}>
                                    {planet.data.distance} AU
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Animated border glow */}
                <motion.div
                    animate={{
                        boxShadow: [
                            `0 0 20px ${planet.data.color}40`,
                            `0 0 60px ${planet.data.color}60`,
                            `0 0 20px ${planet.data.color}40`,
                        ],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '24px',
                        pointerEvents: 'none',
                    }}
                />
            </motion.div>
        </AnimatePresence>
    );
}

// Data Card Component
function DataCard({ icon, label, value, color }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Gradient overlay on hover */}
            <motion.div
                whileHover={{ opacity: 0.1 }}
                initial={{ opacity: 0 }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, ${color} 0%, transparent 100%)`,
                }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ color: color }}>{icon}</span>
                    <span style={{ color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {label}
                    </span>
                </div>
                <p style={{
                    margin: '0',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: color,
                    wordBreak: 'break-word',
                }}>
                    {value}
                </p>
            </div>
        </motion.div>
    );
}
