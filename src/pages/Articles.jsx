import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ARTICLES, CATEGORIES } from "../data/articles";

export default function Articles() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const filteredArticles =
    selectedCategory === "All"
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === selectedCategory);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e27", padding: "40px 20px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: "center", marginBottom: "40px", maxWidth: "800px", margin: "0 auto 40px" }}
      >
        <h1 style={{ fontSize: "48px", color: "#fff", marginBottom: "12px" }}>
          Learn About Space
        </h1>
        <p style={{ color: "#888", fontSize: "18px" }}>
          Explore fascinating articles about our solar system and beyond
        </p>
      </motion.div>

      {/* Category Filter */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "48px",
          flexWrap: "wrap",
        }}
      >
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "10px 20px",
              background:
                selectedCategory === cat
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "rgba(255, 255, 255, 0.1)",
              border: selectedCategory === cat ? "2px solid #667eea" : "2px solid transparent",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "14px",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
            }}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Articles Grid */}
      <motion.div
        layout
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "24px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <AnimatePresence mode="popLayout">
          {filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onClick={() => setSelectedArticle(article)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <ArticleModal
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ArticleCard({ article, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        overflow: "hidden",
        border: "2px solid rgba(255, 255, 255, 0.1)",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
        <img
          src={article.image}
          alt={article.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: isHovered ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.3s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(10px)",
            padding: "6px 12px",
            borderRadius: "6px",
            color: "#fff",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {article.category}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px" }}>
        <h3
          style={{
            color: "#fff",
            fontSize: "20px",
            marginBottom: "8px",
            lineHeight: "1.4",
          }}
        >
          {article.title}
        </h3>
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "12px",
            fontSize: "12px",
            color: "#888",
          }}
        >
          <span>📅 {article.date}</span>
          <span>⏱️ {article.readTime}</span>
        </div>
        <p
          style={{
            color: "#aaa",
            fontSize: "14px",
            lineHeight: "1.6",
            marginBottom: "16px",
          }}
        >
          {article.excerpt}
        </p>
        <motion.div
          animate={{ x: isHovered ? 5 : 0 }}
          style={{
            color: "#667eea",
            fontSize: "14px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          Read more <span>→</span>
        </motion.div>
      </div>
    </motion.article>
  );
}

function ArticleModal({ article, onClose }) {
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
        background: "rgba(0, 0, 0, 0.9)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
        overflowY: "auto",
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(10, 14, 39, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          maxWidth: "800px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          border: "2px solid rgba(255, 255, 255, 0.1)",
          position: "relative",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "sticky",
            top: "20px",
            left: "calc(100% - 60px)",
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
            zIndex: 10,
          }}
        >
          ×
        </button>

        {/* Hero Image */}
        <img
          src={article.image}
          alt={article.title}
          style={{
            width: "100%",
            height: "300px",
            objectFit: "cover",
            borderRadius: "24px 24px 0 0",
          }}
        />

        {/* Content */}
        <div style={{ padding: "40px" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(102, 126, 234, 0.2)",
              padding: "6px 12px",
              borderRadius: "6px",
              color: "#667eea",
              fontSize: "12px",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            {article.category}
          </div>

          <h1 style={{ color: "#fff", fontSize: "36px", marginBottom: "16px", lineHeight: "1.2" }}>
            {article.title}
          </h1>

          <div
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: "32px",
              fontSize: "14px",
              color: "#888",
            }}
          >
            <span>📅 {article.date}</span>
            <span>⏱️ {article.readTime}</span>
          </div>

          <div
            style={{
              color: "#ccc",
              fontSize: "16px",
              lineHeight: "1.8",
              whiteSpace: "pre-line",
            }}
          >
            {article.content}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
