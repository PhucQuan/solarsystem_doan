import { motion } from 'framer-motion';

export default function LoadingScreen() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(180deg, #0b0c12 0%, #0f1220 60%, #0b0c12 100%)',
            gap: '24px'
        }}>
            {/* Animated Solar System */}
            <motion.div
                style={{
                    position: 'relative',
                    width: '120px',
                    height: '120px'
                }}
            >
                {/* Sun */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.8, 1, 0.8]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, #FDB813, #FF8C00)',
                        boxShadow: '0 0 40px rgba(253, 184, 19, 0.6)'
                    }}
                />

                {/* Orbiting Planets */}
                {[0, 120, 240].map((angle, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            rotate: 360
                        }}
                        transition={{
                            duration: 3 + i,
                            repeat: Infinity,
                            ease: 'linear'
                        }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '100%',
                            height: '100%',
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: '0',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: ['#4A90E2', '#E27B58', '#C88B3A'][i],
                                boxShadow: `0 0 10px ${['#4A90E2', '#E27B58', '#C88B3A'][i]}`
                            }}
                        />
                    </motion.div>
                ))}
            </motion.div>

            {/* Loading Text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ textAlign: 'center' }}
            >
                <h2 style={{
                    color: '#fff',
                    fontSize: '24px',
                    marginBottom: '8px',
                    fontWeight: '600'
                }}>
                    Loading Solar System
                </h2>
                <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                        color: '#888',
                        fontSize: '14px'
                    }}
                >
                    Preparing your cosmic journey...
                </motion.p>
            </motion.div>

            {/* Loading Bar */}
            <div style={{
                width: '200px',
                height: '4px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '2px',
                overflow: 'hidden'
            }}>
                <motion.div
                    animate={{
                        x: ['-100%', '200%']
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                    style={{
                        width: '50%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, #667eea, transparent)',
                        borderRadius: '2px'
                    }}
                />
            </div>
        </div>
    );
}
