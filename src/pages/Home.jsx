import { Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, BookOpen, Globe, ChevronRight, Sparkles, Star, ArrowRight, Thermometer, Moon, Zap } from "lucide-react";
import ProgressiveImage from "../components/ProgressiveImage";
import { LESSONS_DATA } from "../data/lessonsData";

const API_BASE = "http://localhost:3001";

// Rotating facts data
const SPACE_FACTS = [
  {
    emoji: "☀️",
    highlight: "99.86%",
    text: "khối lượng hệ Mặt Trời nằm ở Mặt Trời",
    category: "Mặt Trời",
    link: "/learn"
  },
  {
    emoji: "🪐",
    highlight: "1,300",
    text: "Trái Đất có thể nằm gọn trong Sao Mộc",
    category: "Sao Mộc",
    link: "/learn"
  },
  {
    emoji: "🌡️",
    highlight: "460°C",
    text: "là nhiệt độ bề mặt Sao Kim - nóng nhất hệ Mặt Trời",
    category: "Sao Kim",
    link: "/learn"
  },
  {
    emoji: "💨",
    highlight: "2,100 km/h",
    text: "tốc độ gió trên Sao Hải Vương",
    category: "Sao Hải Vương",
    link: "/learn"
  },
  {
    emoji: "🌍",
    highlight: "4.6 tỷ năm",
    text: "tuổi của hệ Mặt Trời",
    category: "Hệ Mặt Trời",
    link: "/learn"
  },
  {
    emoji: "🛸",
    highlight: "95+",
    text: "mặt trăng của Sao Mộc đã được phát hiện",
    category: "Sao Mộc",
    link: "/learn"
  }
];

// Enhanced planet data with descriptions
const PLANET_DATA = [
  { name: "Mercury", vn: "Sao Thủy", image: "/textures/mercury.jpg", color: "#8C7853", tagline: "Tốc độ ánh sáng", temp: "430°C / -180°C", moons: 0 },
  { name: "Venus", vn: "Sao Kim", image: "/textures/venus.jpg", color: "#FFC649", tagline: "Địa ngục xinh đẹp", temp: "460°C", moons: 0 },
  { name: "Earth", vn: "Trái Đất", image: "/textures/earth.jpg", color: "#4A90E2", tagline: "Ngôi nhà của chúng ta", temp: "15°C", moons: 1 },
  { name: "Mars", vn: "Sao Hỏa", image: "/textures/mars.jpg", color: "#E27B58", tagline: "Hành tinh đỏ", temp: "-60°C", moons: 2 },
  { name: "Jupiter", vn: "Sao Mộc", image: "/textures/jupiter.jpg", color: "#C88B3A", tagline: "Vua hành tinh", temp: "-110°C", moons: 95 },
  { name: "Saturn", vn: "Sao Thổ", image: "/textures/saturn.jpg", color: "#FAD5A5", tagline: "Chúa nhẫn vũ trụ", temp: "-140°C", moons: 146 },
  { name: "Uranus", vn: "Sao Thiên Vương", image: "/textures/uranus.jpg", color: "#4FD0E7", tagline: "Kẻ nằm nghiêng", temp: "-195°C", moons: 28 },
  { name: "Neptune", vn: "Sao Hải Vương", image: "/textures/neptune.jpg", color: "#4166F5", tagline: "Thế giới bão tố", temp: "-200°C", moons: 16 },
];

export default function Home() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [apod, setApod] = useState(null);

  // Auto-rotate facts every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % SPACE_FACTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch APOD for hero background
  useEffect(() => {
    fetch(`${API_BASE}/api/articles`)
      .then((res) => res.json())
      .then((articles) => {
        const apodArticle = articles.find(a => a.source === "NASA APOD");
        if (apodArticle) setApod(apodArticle);
      })
      .catch(console.error);
  }, []);

  // Get featured lessons from Learn page
  const featuredLessons = useMemo(() => {
    const allLessons = LESSONS_DATA.flatMap(level =>
      level.lessons.map(lesson => ({ ...lesson, levelTitle: level.title, levelColor: level.color }))
    );
    return allLessons.slice(0, 3);
  }, []);

  return (
    <div className="home" style={{ background: "#000", minHeight: "100vh" }}>
      {/* ========== HERO SECTION ========== */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
      }}>
        {/* Animated Stars Background */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at 20% 80%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.8) 0%, #0a0a1a 100%)
          `,
          backgroundImage: apod?.image ? `url(${apod.image})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.4)"
        }} />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            style={{
              position: "absolute",
              width: 4 + Math.random() * 4,
              height: 4 + Math.random() * 4,
              borderRadius: "50%",
              background: "#fff",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              pointerEvents: "none"
            }}
          />
        ))}

        {/* Hero Content */}
        <div style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "0 20px",
          maxWidth: "900px"
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(102, 126, 234, 0.2)",
                border: "1px solid rgba(102, 126, 234, 0.4)",
                borderRadius: "30px",
                padding: "10px 20px",
                marginBottom: "24px",
                color: "#a5b4fc"
              }}
            >
              <Sparkles size={16} />
              <span style={{ fontSize: "14px", fontWeight: "500" }}>Hành trình khám phá vũ trụ bắt đầu từ đây</span>
            </motion.div>

            {/* Main Title */}
            <h1 style={{
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              fontWeight: "900",
              background: "linear-gradient(135deg, #fff 0%, #a5b4fc 50%, #667eea 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "20px",
              lineHeight: 1.1
            }}>
              Khám Phá Vũ Trụ<br />
              <span style={{ fontSize: "0.6em", opacity: 0.9 }}>Từ Phòng Của Bạn</span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
              color: "#94a3b8",
              maxWidth: "650px",
              margin: "0 auto 40px",
              lineHeight: 1.7
            }}>
              Từ Mặt Trời rực lửa đến những hố đen bí ẩn — học về vũ trụ theo cách chưa từng có với mô hình 3D tương tác và nội dung dễ hiểu.
            </p>

            {/* CTA Buttons */}
            <div style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/learn" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "16px 32px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "50px",
                  color: "#fff",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  textDecoration: "none",
                  boxShadow: "0 10px 40px rgba(102, 126, 234, 0.4)"
                }}>
                  <BookOpen size={20} />
                  Bắt Đầu Học
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/explore3d" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "16px 32px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "50px",
                  color: "#fff",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  textDecoration: "none",
                  backdropFilter: "blur(10px)"
                }}>
                  <Rocket size={20} />
                  Khám Phá 3D
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              position: "absolute",
              bottom: "-100px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "#64748b"
            }}
          >
            <ChevronRight size={32} style={{ transform: "rotate(90deg)" }} />
          </motion.div>
        </div>
      </section>

      {/* ========== START YOUR JOURNEY SECTION ========== */}
      <section style={{
        padding: "100px 20px",
        background: "linear-gradient(180deg, #0a0a1a 0%, #0f172a 100%)"
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <h2 style={{
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              fontWeight: "800",
              color: "#fff",
              marginBottom: "16px"
            }}>
              Lần Đầu Đến Đây?
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>
              Đừng lo, mình sẽ dẫn bạn từng bước
            </p>
          </motion.div>

          {/* 3 Steps */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
            position: "relative"
          }}>
            {[
              { step: 1, icon: <BookOpen size={32} />, title: "Học Kiến Thức Cơ Bản", desc: "Bắt đầu từ Hệ Mặt Trời là gì, tại sao có ngày đêm...", link: "/learn", color: "#4CAF50" },
              { step: 2, icon: <Globe size={32} />, title: "Khám Phá Các Hành Tinh", desc: "Tìm hiểu từng hành tinh với thông tin chi tiết và hình ảnh", link: "/planets", color: "#FF9800" },
              { step: 3, icon: <Rocket size={32} />, title: "Bay Vào Vũ Trụ 3D", desc: "Điều khiển camera, zoom vào từng hành tinh trong mô hình 3D", link: "/explore3d", color: "#2196F3" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                whileHover={{ y: -8, boxShadow: `0 20px 40px ${item.color}30` }}
              >
                <Link to={item.link} style={{ textDecoration: "none" }}>
                  <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "24px",
                    padding: "40px 30px",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden"
                  }}>
                    {/* Step number */}
                    <div style={{
                      position: "absolute",
                      top: "20px",
                      right: "20px",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: `${item.color}20`,
                      border: `2px solid ${item.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: item.color,
                      fontWeight: "bold",
                      fontSize: "14px"
                    }}>
                      {item.step}
                    </div>

                    {/* Icon */}
                    <div style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "20px",
                      background: `linear-gradient(135deg, ${item.color}30 0%, ${item.color}10 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 24px",
                      color: item.color
                    }}>
                      {item.icon}
                    </div>

                    <h3 style={{ color: "#fff", fontSize: "1.3rem", fontWeight: "700", marginBottom: "12px" }}>
                      {item.title}
                    </h3>
                    <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "20px" }}>
                      {item.desc}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: item.color, fontWeight: "600" }}>
                      Bắt đầu <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ROTATING FACTS SECTION ========== */}
      <section style={{
        padding: "80px 20px",
        background: "#0f172a"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#64748b",
              marginBottom: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px"
            }}>
              <Star size={20} /> Bạn Có Biết?
            </h2>

            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "24px",
              padding: "50px 40px",
              position: "relative",
              overflow: "hidden"
            }}>
              {/* Progress dots */}
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "30px" }}>
                {SPACE_FACTS.map((_, idx) => (
                  <motion.div
                    key={idx}
                    animate={{ scale: currentFactIndex === idx ? 1.3 : 1, opacity: currentFactIndex === idx ? 1 : 0.3 }}
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: currentFactIndex === idx ? "#667eea" : "#475569",
                      cursor: "pointer"
                    }}
                    onClick={() => setCurrentFactIndex(idx)}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFactIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div style={{ fontSize: "60px", marginBottom: "20px" }}>
                    {SPACE_FACTS[currentFactIndex].emoji}
                  </div>
                  <div style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: "900", color: "#667eea", marginBottom: "12px" }}>
                    {SPACE_FACTS[currentFactIndex].highlight}
                  </div>
                  <p style={{ color: "#e2e8f0", fontSize: "1.3rem", marginBottom: "24px" }}>
                    {SPACE_FACTS[currentFactIndex].text}
                  </p>
                  <Link to={SPACE_FACTS[currentFactIndex].link} style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#667eea",
                    fontSize: "1rem",
                    fontWeight: "600",
                    textDecoration: "none"
                  }}>
                    Tìm hiểu về {SPACE_FACTS[currentFactIndex].category} <ArrowRight size={18} />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== ENHANCED PLANET GRID ========== */}
      <section style={{
        padding: "100px 20px",
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: "800", color: "#fff", marginBottom: "16px" }}>
              8 Hành Tinh Trong Hệ Mặt Trời
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>
              Từ Sao Thủy gần Mặt Trời đến Sao Hải Vương xa xôi
            </p>
          </motion.div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "24px"
          }}>
            {PLANET_DATA.map((planet, idx) => (
              <motion.div
                key={planet.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <PlanetCard planet={planet} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURED LESSONS ========== */}
      <section style={{
        padding: "100px 20px",
        background: "#0a0e27"
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: "800", color: "#fff", marginBottom: "16px" }}>
              Bài Học Nổi Bật
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>
              Bắt đầu hành trình với những bài học này
            </p>
          </motion.div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px"
          }}>
            {featuredLessons.map((lesson, idx) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ y: -8 }}
              >
                <Link to="/learn" style={{ textDecoration: "none" }}>
                  <div style={{
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.08)"
                  }}>
                    <div style={{ height: "160px", overflow: "hidden", position: "relative" }}>
                      <img src={lesson.thumbnail} alt={lesson.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,14,39,0.9) 0%, transparent 60%)" }} />
                      <div style={{
                        position: "absolute",
                        bottom: "12px",
                        left: "12px",
                        background: lesson.levelColor,
                        padding: "4px 12px",
                        borderRadius: "15px",
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "#fff"
                      }}>
                        {lesson.levelTitle}
                      </div>
                    </div>
                    <div style={{ padding: "20px" }}>
                      <h3 style={{ color: "#fff", fontSize: "1.15rem", fontWeight: "700", marginBottom: "8px" }}>
                        {lesson.title}
                      </h3>
                      <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "16px" }}>
                        {lesson.summary}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#667eea", fontWeight: "600", fontSize: "0.9rem" }}>
                        Bắt đầu học <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link to="/learn" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 28px",
              background: "rgba(102, 126, 234, 0.2)",
              border: "1px solid rgba(102, 126, 234, 0.4)",
              borderRadius: "30px",
              color: "#a5b4fc",
              fontSize: "1rem",
              fontWeight: "600",
              textDecoration: "none"
            }}>
              Xem tất cả bài học <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== PARALLAX CTA SECTION ========== */}
      <section style={{
        padding: "120px 20px",
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Floating elements */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 30 - 15, 0],
              rotate: [0, 360]
            }}
            transition={{ duration: 8 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 2 }}
            style={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: "30px",
              opacity: 0.3,
              pointerEvents: "none"
            }}
          >
            {["🌟", "✨", "🚀", "🪐", "⭐"][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}

        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: "900",
              color: "#fff",
              marginBottom: "20px"
            }}>
              Sẵn Sàng Bay Vào Vũ Trụ?
            </h2>
            <p style={{ color: "#a5b4fc", fontSize: "1.2rem", marginBottom: "40px", lineHeight: 1.7 }}>
              Điều khiển camera, zoom vào từng hành tinh, và trải nghiệm hệ Mặt Trời như chưa từng thấy!
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/explore3d" style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                padding: "20px 40px",
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                borderRadius: "50px",
                color: "#fff",
                fontSize: "1.3rem",
                fontWeight: "700",
                textDecoration: "none",
                boxShadow: "0 15px 50px rgba(240, 147, 251, 0.4)",
                position: "relative",
                overflow: "hidden"
              }}>
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)"
                  }}
                />
                <Rocket size={28} />
                Khởi Động Tàu Vũ Trụ
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Enhanced Planet Card Component
function PlanetCard({ planet }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to="/planets" style={{ textDecoration: "none" }}>
      <motion.div
        whileHover={{ y: -10, scale: 1.02 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "24px",
          padding: "30px",
          border: `2px solid ${isHovered ? planet.color : "rgba(255,255,255,0.08)"}`,
          transition: "all 0.3s ease",
          textAlign: "center",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Glow effect on hover */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at center, ${planet.color}20 0%, transparent 70%)`,
            pointerEvents: "none"
          }}
        />

        {/* Planet Image */}
        <motion.div
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            width: "120px",
            height: "120px",
            margin: "0 auto 20px",
            position: "relative"
          }}
        >
          <ProgressiveImage
            src={planet.image}
            alt={planet.name}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: `0 0 30px ${planet.color}60`
            }}
          />
        </motion.div>

        {/* Planet Info */}
        <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: "700", marginBottom: "4px" }}>
          {planet.vn}
        </h3>
        <p style={{ color: planet.color, fontSize: "0.85rem", fontWeight: "500", marginBottom: "16px" }}>
          {planet.tagline}
        </p>

        {/* Stats */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                marginTop: "16px",
                paddingTop: "16px",
                borderTop: "1px solid rgba(255,255,255,0.1)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#94a3b8", fontSize: "0.85rem" }}>
                <Thermometer size={14} />
                {planet.temp}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#94a3b8", fontSize: "0.85rem" }}>
                <Moon size={14} />
                {planet.moons} mặt trăng
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}
