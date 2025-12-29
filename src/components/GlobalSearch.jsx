import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PLANETS } from '../data/solarSystemData';
import { ARTICLES } from '../data/articles';

export default function GlobalSearch() {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    // Search across planets and articles
    const results = useMemo(() => {
        if (query.length < 2) return [];

        const lowerQuery = query.toLowerCase();
        const planetResults = PLANETS
            .filter(p =>
                p.name.toLowerCase().includes(lowerQuery) ||
                p.description.toLowerCase().includes(lowerQuery) ||
                p.type.toLowerCase().includes(lowerQuery)
            )
            .map(p => ({ ...p, type: 'planet' }))
            .slice(0, 3);

        const articleResults = ARTICLES
            .filter(a =>
                a.title.toLowerCase().includes(lowerQuery) ||
                a.excerpt.toLowerCase().includes(lowerQuery) ||
                a.category.toLowerCase().includes(lowerQuery)
            )
            .map(a => ({ ...a, type: 'article' }))
            .slice(0, 3);

        return [...planetResults, ...articleResults];
    }, [query]);

    const handleSelect = useCallback((result) => {
        if (result.type === 'planet') {
            navigate('/planets');
        } else if (result.type === 'article') {
            navigate('/articles');
        }
        setQuery('');
        setIsOpen(false);
    }, [navigate]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard shortcut: Ctrl/Cmd + K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
                inputRef.current?.blur();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div ref={containerRef} className="navbar__search" style={{ position: 'relative' }}>
            <input
                ref={inputRef}
                type="text"
                className="navbar__searchInput"
                placeholder="Search... (Ctrl+K)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsOpen(true)}
            />
            <button className="navbar__searchButton" onClick={() => inputRef.current?.focus()}>
                🔍
            </button>

            <AnimatePresence>
                {isOpen && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            left: 0,
                            right: 0,
                            background: 'rgba(0, 0, 0, 0.95)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                            maxHeight: '400px',
                            overflowY: 'auto',
                            zIndex: 1000
                        }}
                    >
                        {results.map((result, index) => (
                            <motion.div
                                key={`${result.type}-${result.id}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handleSelect(result)}
                                style={{
                                    padding: '12px 16px',
                                    cursor: 'pointer',
                                    borderBottom: index < results.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '20px' }}>
                                        {result.type === 'planet' ? '🪐' : '📄'}
                                    </span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            color: '#fff',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            marginBottom: '4px'
                                        }}>
                                            {result.name || result.title}
                                        </div>
                                        <div style={{
                                            color: '#888',
                                            fontSize: '12px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {result.type === 'planet' ? result.description : result.excerpt}
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: '10px',
                                        color: '#667eea',
                                        background: 'rgba(102, 126, 234, 0.2)',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        textTransform: 'uppercase',
                                        fontWeight: '600'
                                    }}>
                                        {result.type}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
