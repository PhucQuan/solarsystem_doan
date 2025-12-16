import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';

export default function Toast() {
    const { toast } = useApp();

    const getIcon = (type) => {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'info': return 'ℹ️';
            default: return '📢';
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'success': return '#10b981';
            case 'error': return '#ef4444';
            case 'warning': return '#f59e0b';
            case 'info': return '#3b82f6';
            default: return '#6b7280';
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            pointerEvents: 'none'
        }}>
            <AnimatePresence>
                {toast.toasts.map((t) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, x: 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        style={{
                            background: 'rgba(0, 0, 0, 0.9)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '12px',
                            padding: '16px 20px',
                            minWidth: '300px',
                            maxWidth: '400px',
                            border: `2px solid ${getColor(t.type)}`,
                            boxShadow: `0 8px 32px ${getColor(t.type)}33`,
                            pointerEvents: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}
                    >
                        <span style={{ fontSize: '24px' }}>{getIcon(t.type)}</span>
                        <p style={{
                            margin: 0,
                            color: '#fff',
                            fontSize: '14px',
                            flex: 1,
                            lineHeight: '1.5'
                        }}>
                            {t.message}
                        </p>
                        <button
                            onClick={() => toast.removeToast(t.id)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#888',
                                fontSize: '20px',
                                cursor: 'pointer',
                                padding: '4px',
                                lineHeight: 1,
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#fff'}
                            onMouseLeave={(e) => e.target.style.color = '#888'}
                        >
                            ×
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
