import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Info } from 'lucide-react';
import { PLANET_DATA } from '../data/solarSystemData';

export default function PlanetSearch({ onSelect }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPlanets = PLANET_DATA.filter(planet =>
        !planet.isSun && planet.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (planet) => {
        onSelect(planet);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <>
            {/* Search Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 999,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '56px',
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                }}
            >
                <Search size={24} color="#fff" />
            </motion.button>

            {/* Search Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0, 0, 0, 0.8)',
                                backdropFilter: 'blur(10px)',
                                zIndex: 1000,
                            }}
                        />

                        {/* Search Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: -50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -50, scale: 0.9 }}
                            style={{
                                position: 'fixed',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '90%',
                                maxWidth: '600px',
                                background: 'rgba(10, 10, 30, 0.98)',
                                backdropFilter: 'blur(30px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '24px',
                                padding: '32px',
                                zIndex: 1001,
                                boxShadow: '0 20px 80px rgba(0, 0, 0, 0.8)',
                            }}
                        >
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{
                                    margin: 0,
                                    fontSize: '24px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: '700',
                                }}>
                                    🔍 Tìm kiếm hành tinh
                                </h2>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsOpen(false)}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '36px',
                                        height: '36px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <X size={18} color="#fff" />
                                </motion.button>
                            </div>

                            {/* Search Input */}
                            <div style={{ position: 'relative', marginBottom: '24px' }}>
                                <input
                                    type="text"
                                    placeholder="Nhập tên hành tinh..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                    style={{
                                        width: '100%',
                                        padding: '16px 48px 16px 20px',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '2px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '16px',
                                        color: '#fff',
                                        fontSize: '16px',
                                        outline: 'none',
                                        transition: 'all 0.3s ease',
                                        fontFamily: 'inherit',
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#667eea';
                                        e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                        e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                                    }}
                                />
                                <Search
                                    size={20}
                                    color="#888"
                                    style={{
                                        position: 'absolute',
                                        right: '20px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                    }}
                                />
                            </div>

                            {/* Results */}
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {filteredPlanets.length > 0 ? (
                                    <div style={{ display: 'grid', gap: '12px' }}>
                                        {filteredPlanets.map((planet) => (
                                            <motion.button
                                                key={planet.name}
                                                whileHover={{ scale: 1.02, x: 8 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleSelect(planet)}
                                                style={{
                                                    background: `linear-gradient(135deg, ${planet.color}20 0%, ${planet.color}05 100%)`,
                                                    border: `1px solid ${planet.color}30`,
                                                    borderRadius: '16px',
                                                    padding: '16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '16px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                {/* Planet Color Indicator */}
                                                <div
                                                    style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        borderRadius: '50%',
                                                        background: `radial-gradient(circle at 30% 30%, ${planet.color}, ${planet.color}80)`,
                                                        boxShadow: `0 4px 20px ${planet.color}40`,
                                                        flexShrink: 0,
                                                    }}
                                                />

                                                {/* Planet Info */}
                                                <div style={{ flex: 1 }}>
                                                    <h3 style={{
                                                        margin: '0 0 4px 0',
                                                        fontSize: '18px',
                                                        color: '#fff',
                                                        fontWeight: '600',
                                                    }}>
                                                        {planet.name}
                                                    </h3>
                                                    <p style={{
                                                        margin: 0,
                                                        fontSize: '13px',
                                                        color: '#888',
                                                    }}>
                                                        Khoảng cách: {planet.distance} AU • Kích thước: {planet.size}
                                                    </p>
                                                </div>

                                                {/* Arrow */}
                                                <Info size={20} color={planet.color} />
                                            </motion.button>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '60px 20px',
                                        color: '#666',
                                    }}>
                                        <Search size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                                        <p style={{ margin: 0, fontSize: '16px' }}>
                                            {searchTerm ? 'Không tìm thấy hành tinh phù hợp' : 'Nhập để tìm kiếm'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Footer Hint */}
                            <div style={{
                                marginTop: '24px',
                                paddingTop: '16px',
                                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '16px',
                            }}>
                                <span style={{ fontSize: '12px', color: '#666' }}>
                                    💡 Nhấp vào hành tinh để xem chi tiết
                                </span>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
