import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PLANETS } from "../data/solarSystemData";

const categories = ["All", "Rocky Planets", "Gas Giants", "Ice Giants"];

export default function Planets() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  const filteredPlanets =
    selectedCategory === "All"
      ? PLANETS
      : PLANETS.filter((p) => p.category === selectedCategory);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e27", padding: "40px 20px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: "center", marginBottom: "40px" }}
      >
        <h1 style={{ fontSize: "48px", color: "#fff", marginBottom: "12px" }}>
          Planetary Dashboard
        </h1>
        <p style={{ color: "#888", fontSize: "18px" }}>
          Explore the wonders of our solar system
        </p>
      </motion.div>

      {/* Filter Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          marginBottom: "48px",
          flexWrap: "wrap",
        }}
      >
        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "12px 24px",
              background:
                selectedCategory === cat
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "rgba(255, 255, 255, 0.1)",
              border: selectedCategory === cat ? "2px solid #667eea" : "2px solid transparent",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
            }}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Planets Grid */}
      <motion.div
        layout
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "32px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <AnimatePresence mode="popLayout">
          {filteredPlanets.map((planet) => (
            <PlanetCard
              key={planet.id}
              planet={planet}
              onClick={() => setSelectedPlanet(planet)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selectedPlanet && (
          <PlanetModal
            planet={selectedPlanet}
            onClose={() => setSelectedPlanet(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PlanetCard({ planet, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        borderRadius: "20px",
        padding: "24px",
        border: `2px solid ${isHovered ? planet.color : "rgba(255, 255, 255, 0.1)"}`,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}
    >
      {/* Glow Effect */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at center, ${planet.color}, transparent)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Planet Image */}
      <motion.div
        animate={{ y: isHovered ? -10 : [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: "180px",
          height: "180px",
          margin: "0 auto 20px",
          position: "relative",
        }}
      >
        <img
          src={planet.image}
          alt={planet.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "50%",
            filter: "drop-shadow(0 0 20px " + planet.color + ")",
            transform: isHovered ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.3s ease",
          }}
        />
      </motion.div>

      {/* Planet Info */}
      <h3
        style={{
          color: "#fff",
          fontSize: "24px",
          marginBottom: "8px",
          textAlign: "center",
        }}
      >
        {planet.name}
      </h3>
      <p
        style={{
          color: planet.color,
          fontSize: "14px",
          marginBottom: "16px",
          textAlign: "center",
        }}
      >
        {planet.type}
      </p>

      {/* Quick Stats */}
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "16px" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#888", fontSize: "12px" }}>Diameter</p>
          <p style={{ color: "#fff", fontSize: "14px", fontWeight: "bold" }}>
            {planet.diameter}
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#888", fontSize: "12px" }}>Moons</p>
          <p style={{ color: "#fff", fontSize: "14px", fontWeight: "bold" }}>
            {planet.moons}
          </p>
        </div>
      </div>

      {/* Temperature Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "8px",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "8px",
        }}
      >
        <span style={{ fontSize: "20px" }}>🌡️</span>
        <span style={{ color: "#fff", fontSize: "14px" }}>{planet.temperature}</span>
      </div>

      {/* View Button */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: "16px",
            padding: "12px",
            background: planet.color,
            borderRadius: "8px",
            textAlign: "center",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          View Details →
        </motion.div>
      )}
    </motion.div>
  );
}

function PlanetModal({ planet, onClose }) {
  return (
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
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(10, 14, 39, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          padding: "40px",
          maxWidth: "900px",
          width: "100%",
          border: `2px solid ${planet.color}`,
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
          }}
        >
          ×
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          {/* Left: Image */}
          <div>
            <motion.img
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              src={planet.image}
              alt={planet.name}
              style={{
                width: "100%",
                borderRadius: "50%",
                filter: `drop-shadow(0 0 40px ${planet.color})`,
              }}
            />
          </div>

          {/* Right: Details */}
          <div>
            <h2 style={{ color: "#fff", fontSize: "36px", marginBottom: "8px" }}>
              {planet.name}
            </h2>
            <p style={{ color: planet.color, fontSize: "18px", marginBottom: "20px" }}>
              {planet.type}
            </p>
            <p style={{ color: "#ccc", lineHeight: "1.6", marginBottom: "24px" }}>
              {planet.description}
            </p>

            {/* Stats */}
            <div style={{ marginBottom: "16px" }}>
              <StatBar label="Gravity" value={planet.gravity} max={3} color={planet.color} />
              <StatBar
                label="Day Length"
                value={parseFloat(planet.dayLength)}
                max={250}
                color={planet.color}
              />
            </div>

            {/* Info Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginTop: "24px",
              }}
            >
              <InfoBox label="Diameter" value={planet.diameter} />
              <InfoBox label="Temperature" value={planet.temperature} />
              <InfoBox label="Moons" value={planet.moons} />
              <InfoBox label="Day Length" value={planet.dayLength} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatBar({ label, value, max, color }) {
  const percentage = (value / max) * 100;
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ color: "#888", fontSize: "14px" }}>{label}</span>
        <span style={{ color: "#fff", fontSize: "14px" }}>{value}</span>
      </div>
      <div
        style={{
          width: "100%",
          height: "8px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            height: "100%",
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
          }}
        />
      </div>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        padding: "16px",
        borderRadius: "12px",
        textAlign: "center",
      }}
    >
      <p style={{ color: "#888", fontSize: "12px", marginBottom: "4px" }}>{label}</p>
      <p style={{ color: "#fff", fontSize: "18px", fontWeight: "bold" }}>{value}</p>
    </div>
  );
}
