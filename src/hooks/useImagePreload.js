import { useState, useEffect } from 'react';

/**
 * Hook to preload images and track loading state
 * @param {string[]} imageUrls - Array of image URLs to preload
 * @returns {Object} - { loaded: boolean, progress: number }
 */
export function useImagePreload(imageUrls) {
    const [loaded, setLoaded] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!imageUrls || imageUrls.length === 0) {
            setLoaded(true);
            return;
        }

        let loadedCount = 0;
        const totalImages = imageUrls.length;

        const promises = imageUrls.map((url) => {
            return new Promise((resolve, reject) => {
                const img = new Image();

                img.onload = () => {
                    loadedCount++;
                    setProgress((loadedCount / totalImages) * 100);
                    resolve(url);
                };

                img.onerror = () => {
                    loadedCount++;
                    setProgress((loadedCount / totalImages) * 100);
                    // eslint-disable-next-line no-console
                    console.warn(`Failed to preload image: ${url}`);
                    resolve(url); // Resolve anyway to not block other images
                };

                img.src = url;
            });
        });

        Promise.all(promises).then(() => {
            setLoaded(true);
        });
    }, [imageUrls]);

    return { loaded, progress };
}
