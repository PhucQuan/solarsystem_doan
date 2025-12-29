import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';

export default function ThemeToggle() {
    const { theme } = useApp();

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={theme.toggleTheme}
            className="navbar__button"
            title={`Switch to ${theme.theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <motion.span
                key={theme.theme}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                    display: 'inline-block',
                    fontSize: '20px'
                }}
            >
                {theme.theme === 'dark' ? '🌙' : '☀️'}
            </motion.span>
        </motion.button>
    );
}
