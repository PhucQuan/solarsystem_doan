import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PlanetInfoModal({ planetName, onClose, color }) {
    const [planetData, setPlanetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!planetName) return;

        setLoading(true);
        fetch(`http://localhost:3001/api/planet/${planetName}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch planet data");
                return res.json();
            })
            .then((data) => {
                setPlanetData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, [planetName]);

    if (!planetName) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0, 0, 0, 0.9)",
                    backdropFilter: "blur(10px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                    padding: "20px",
                }}
            >
                <motion.div
                    initial={{ scale: 0.8, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, y: 50 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: "linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(20, 24, 49, 0.95) 100%)",
                        backdropFilter: "blur(20px)",
                        borderRadius: "24px",
                        maxWidth: "600px",
                        width: "100%",
                        maxHeight: "80vh",
                        overflowY: "auto",
                        border: `2px solid ${color || "#667eea"}`,
                        boxShadow: `0 0 40px ${color || "#667eea"}40`,
                        position: "relative",
                    }}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        style={{
                            position: "absolute",
                            top: "20px",
                            right: "20px",
                            background: "rgba(255, 255, 255, 0.1)",
                            border: "none",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            color: "#fff",
                            fontSize: "24px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.3s ease",
                            zIndex: 10,
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = `${color}40`;
                            e.target.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = "rgba(255, 255, 255, 0.1)";
                            e.target.style.transform = "scale(1)";
                        }}
                    >
                        ×
                    </button>

                    <div style={{ padding: "40px" }}>
                        {loading && (
                            <div style={{ textAlign: "center", color: "#fff" }}>
                                <div
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        border: `4px solid ${color}40`,
                                        borderTop: `4px solid ${color}`,
                                        borderRadius: "50%",
                                        animation: "spin 1s linear infinite",
                                        margin: "0 auto 20px",
                                    }}
                                />
                                <p>Loading planet data...</p>
                                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
                            </div>
                        )}

                        {error && (
                            <div style={{ textAlign: "center", color: "#ff6b6b" }}>
                                <p>❌ {error}</p>
                                <p style={{ fontSize: "14px", color: "#888" }}>Could not load planet data</p>
                            </div>
                        )}

                        {planetData && (
                            <>
                                {/* Header */}
                                <h1
                                    style={{
                                        margin: "0 0 8px 0",
                                        fontSize: "42px",
                                        color: color || "#667eea",
                                        fontFamily: "'Orbitron', sans-serif",
                                    }}
                                >
                                    {planetData.name}
                                </h1>
                                <p
                                    style={{
                                        margin: "0 0 24px 0",
                                        color: "#888",
                                        fontSize: "14px",
                                        textTransform: "uppercase",
                                        letterSpacing: "2px",
                                    }}
                                >
                                    {planetData.isPlanet ? "PLANET" : "CELESTIAL BODY"}
                                </p>

                                {/* Stats Grid */}
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                        gap: "16px",
                                        marginBottom: "24px",
                                    }}
                                >
                                    <StatCard
                                        icon="⚖️"
                                        label="Mass"
                                        value={planetData.mass}
                                        color={color}
                                    />
                                    <StatCard
                                        icon="🌍"
                                        label="Gravity"
                                        value={`${planetData.gravity} m/s²`}
                                        color={color}
                                    />
                                    <StatCard
                                        icon="📏"
                                        label="Mean Radius"
                                        value={`${planetData.meanRadius?.toLocaleString() || 'N/A'} km`}
                                        color={color}
                                    />
                                    <StatCard
                                        icon="🌡️"
                                        label="Avg Temperature"
                                        value={`${planetData.avgTemp || 'N/A'} K`}
                                        color={color}
                                    />
                                    <StatCard
                                        icon="💨"
                                        label="Escape Velocity"
                                        value={`${planetData.escape?.toLocaleString() || 'N/A'} m/s`}
                                        color={color}
                                    />
                                    <StatCard
                                        icon="🌙"
                                        label="Moons"
                                        value={planetData.moons || 0}
                                        color={color}
                                    />
                                </div>

                                {/* Discovery Info */}
                                {planetData.discoveredBy && (
                                    <div
                                        style={{
                                            background: "rgba(255, 255, 255, 0.05)",
                                            borderRadius: "12px",
                                            padding: "16px",
                                            marginTop: "16px",
                                        }}
                                    >
                                        <h3 style={{ margin: "0 0 8px 0", color: "#fff", fontSize: "16px" }}>
                                            🔭 Discovery
                                        </h3>
                                        <p style={{ margin: "0", color: "#aaa", fontSize: "14px" }}>
                                            Discovered by <strong style={{ color: "#fff" }}>{planetData.discoveredBy}</strong>
                                            {planetData.discoveryDate && ` in ${planetData.discoveryDate}`}
                                        </p>
                                    </div>
                                )}

                                {/* Data Source Badge */}
                                <div style={{ marginTop: "24px", textAlign: "center" }}>
                                    <span
                                        style={{
                                            display: "inline-block",
                                            background: `${color}20`,
                                            color: color,
                                            padding: "8px 16px",
                                            borderRadius: "20px",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            border: `1px solid ${color}40`,
                                        }}
                                    >
                                        ✨ Data from Solar System OpenData API
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function StatCard({ icon, label, value, color }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            style={{
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                padding: "16px",
                border: `1px solid rgba(255, 255, 255, 0.1)`,
                transition: "all 0.3s ease",
            }}
        >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>{icon}</div>
            <p style={{ margin: "0 0 4px 0", color: "#888", fontSize: "12px", textTransform: "uppercase" }}>
                {label}
            </p>
            <p style={{ margin: 0, color: color, fontSize: "18px", fontWeight: "bold" }}>
                {value}
            </p>
        </motion.div>
    );
}
