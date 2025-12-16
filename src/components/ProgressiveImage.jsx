import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ProgressiveImage({
    src,
    placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23333" width="400" height="400"/%3E%3C/svg%3E',
    alt = '',
    className = '',
    style = {},
    ...props
}) {
    const [imgSrc, setImgSrc] = useState(placeholder);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const img = new Image();
        img.src = src;

        img.onload = () => {
            setImgSrc(src);
            setIsLoading(false);
        };

        img.onerror = () => {
            setIsLoading(false);
            // eslint-disable-next-line no-console
            console.error(`Failed to load image: ${src}`);
        };
    }, [src]);

    return (
        <motion.img
            src={imgSrc}
            alt={alt}
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
                ...style,
                filter: isLoading ? 'blur(10px)' : 'blur(0px)',
                transition: 'filter 0.3s ease-out'
            }}
            {...props}
        />
    );
}
