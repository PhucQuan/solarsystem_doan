import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';

export default function FavoriteButton({ item, size = 'medium' }) {
    const { favorites, toast } = useApp();
    const isFav = favorites.isFavorite(item);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        favorites.toggleFavorite(item);

        if (isFav) {
            toast.info(`Removed ${item.name} from favorites`);
        } else {
            toast.success(`Added ${item.name} to favorites!`);
        }
    };

    const sizes = {
        small: { button: '32px', icon: '16px' },
        medium: { button: '40px', icon: '20px' },
        large: { button: '48px', icon: '24px' }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClick}
            style={{
                width: sizes[size].button,
                height: sizes[size].button,
                borderRadius: '50%',
                border: 'none',
                background: isFav
                    ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: sizes[size].icon,
                transition: 'all 0.3s ease',
                boxShadow: isFav ? '0 4px 12px rgba(245, 87, 108, 0.4)' : 'none'
            }}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
            <motion.span
                animate={{
                    scale: isFav ? [1, 1.3, 1] : 1,
                    rotate: isFav ? [0, -10, 10, 0] : 0
                }}
                transition={{ duration: 0.3 }}
            >
                {isFav ? '❤️' : '🤍'}
            </motion.span>
        </motion.button>
    );
}
