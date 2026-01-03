import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LESSONS_DATA, getLessonById } from "../data/lessonsData";
import LoadingScreen from "../components/LoadingScreen";
import { BookOpen, Compass, Rocket, Star, ChevronRight, ExternalLink, Sparkles } from "lucide-react";

const API_BASE = "http://localhost:3001";

// Categories for Library tab
const CATEGORIES = ["All", "Science", "Planets", "Phenomena", "Featured"];

export default function Learn() {
    const [activeTab, setActiveTab] = useState("curriculum"); // 'curriculum' | 'library'
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [lessonContent, setLessonContent] = useState(null);
    const [lessonLoading, setLessonLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch articles for Library tab
    useEffect(() => {
        fetch(`${API_BASE}/api/articles`)
            .then((res) => res.json())
            .then((data) => {
                setArticles(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load articles:", err);
                setLoading(false);
            });
    }, []);

    // Fetch Wikipedia content when lesson is selected
    const openLesson = useCallback(async (lesson) => {
        setSelectedLesson(lesson);
        setLessonLoading(true);
        setLessonContent(null);

        try {
            const res = await fetch(`${API_BASE}/api/wiki/${encodeURIComponent(lesson.wikiTopic)}`);
            const data = await res.json();
            setLessonContent(data);
        } catch (err) {
            console.error("Failed to fetch lesson content:", err);
            setLessonContent({ error: true, summary: "Không thể tải nội dung. Vui lòng thử lại sau." });
        } finally {
            setLessonLoading(false);
        }
    }, []);

    const closeLesson = useCallback(() => {
        setSelectedLesson(null);
        setLessonContent(null);
    }, []);

    const goTo3D = useCallback((target) => {
        navigate('/explore3d', { state: { focusTarget: target } });
    }, [navigate]);

    const filteredArticles = selectedCategory === "All"
        ? articles
        : articles.filter((a) => a.category === selectedCategory);

    if (loading && activeTab === 'library') return <LoadingScreen />;

    return (
        <div className="learn-page" style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0a0e27 0%, #1a1e3f 50%, #0d1b2a 100%)",
            padding: "100px 20px 60px",
            position: "relative",
            overflow: "hidden"
        }}>
            {/* Animated background stars */}
            <div className="stars-bg" style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "radial-gradient(ellipse at center, rgba(102, 126, 234, 0.1) 0%, transparent 70%)",
                pointerEvents: "none"
            }} />

            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ textAlign: "center", marginBottom: "40px", position: "relative", zIndex: 1 }}
            >
                <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ fontSize: "60px", marginBottom: "16px" }}
                >
                    🚀
                </motion.div>
                <h1 style={{
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    fontWeight: "800",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: "12px",
                    fontFamily: "'Orbitron', sans-serif"
                }}>
                    Khám Phá Vũ Trụ
                </h1>
                <p style={{ color: "#a0aec0", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
                    Hành trình từ những bước đầu tiên đến những bí ẩn xa xôi nhất
                </p>
            </motion.header>

            {/* Tab Navigation */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "48px",
                position: "relative",
                zIndex: 1
            }}>
                <TabButton
                    active={activeTab === "curriculum"}
                    onClick={() => setActiveTab("curriculum")}
                    icon={<BookOpen size={18} />}
                    label="Lộ Trình Học"
                />
                <TabButton
                    active={activeTab === "library"}
                    onClick={() => setActiveTab("library")}
                    icon={<Compass size={18} />}
                    label="Thư Viện"
                />
            </div>

            {/* Content */}
            <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
                <AnimatePresence mode="wait">
                    {activeTab === "curriculum" ? (
                        <CurriculumTab key="curriculum" onOpenLesson={openLesson} />
                    ) : (
                        <LibraryTab
                            key="library"
                            articles={filteredArticles}
                            categories={CATEGORIES}
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                            onArticleClick={setSelectedArticle}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Lesson Modal */}
            <AnimatePresence>
                {selectedLesson && (
                    <LessonModal
                        lesson={selectedLesson}
                        content={lessonContent}
                        loading={lessonLoading}
                        onClose={closeLesson}
                        onExplore3D={goTo3D}
                    />
                )}
            </AnimatePresence>

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

// Tab Button Component
function TabButton({ active, onClick, icon, label }) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 28px",
                background: active
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "rgba(255, 255, 255, 0.05)",
                border: active ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "50px",
                color: "#fff",
                fontSize: "15px",
                fontWeight: active ? "600" : "400",
                cursor: "pointer",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
                boxShadow: active ? "0 8px 32px rgba(102, 126, 234, 0.3)" : "none"
            }}
        >
            {icon}
            {label}
        </motion.button>
    );
}

// Curriculum Tab Component
function CurriculumTab({ onOpenLesson }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            {LESSONS_DATA.map((level, levelIndex) => (
                <motion.section
                    key={level.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: levelIndex * 0.1 }}
                    style={{ marginBottom: "48px" }}
                >
                    {/* Level Header */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        marginBottom: "24px",
                        padding: "16px 20px",
                        background: `linear-gradient(90deg, ${level.color}20 0%, transparent 100%)`,
                        borderLeft: `4px solid ${level.color}`,
                        borderRadius: "0 12px 12px 0"
                    }}>
                        <span style={{ fontSize: "32px" }}>{level.icon}</span>
                        <div>
                            <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>
                                {level.title}
                            </h2>
                            <p style={{ color: "#a0aec0", fontSize: "0.9rem", margin: "4px 0 0" }}>
                                {level.description}
                            </p>
                        </div>
                    </div>

                    {/* Lessons Grid */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                        gap: "20px"
                    }}>
                        {level.lessons.map((lesson, lessonIndex) => (
                            <LessonCard
                                key={lesson.id}
                                lesson={lesson}
                                color={level.color}
                                index={lessonIndex}
                                onClick={() => onOpenLesson(lesson)}
                            />
                        ))}
                    </div>
                </motion.section>
            ))}
        </motion.div>
    );
}

// Lesson Card Component (Premium Design)
function LessonCard({ lesson, color, index, onClick }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{
                y: -8,
                rotateX: 2,
                rotateY: -2,
                transition: { duration: 0.2 }
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={onClick}
            style={{
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(20px)",
                borderRadius: "20px",
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                cursor: "pointer",
                transformStyle: "preserve-3d",
                perspective: "1000px"
            }}
        >
            {/* Thumbnail */}
            <div style={{ position: "relative", height: "160px", overflow: "hidden" }}>
                <motion.img
                    src={lesson.thumbnail}
                    alt={lesson.title}
                    animate={{ scale: isHovered ? 1.1 : 1 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                    }}
                />
                <div style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(to top, rgba(10,14,39,0.9) 0%, transparent 60%)`
                }} />

                {/* Duration Badge */}
                <div style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(8px)",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                }}>
                    <BookOpen size={12} />
                    {lesson.duration}
                </div>

                {/* 3D Badge */}
                {lesson.related3D && (
                    <motion.div
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                        style={{
                            position: "absolute",
                            bottom: "12px",
                            left: "12px",
                            background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`,
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: "600",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            boxShadow: `0 4px 15px ${color}40`
                        }}
                    >
                        <Rocket size={12} />
                        Có mô hình 3D
                    </motion.div>
                )}
            </div>

            {/* Content */}
            <div style={{ padding: "20px" }}>
                <h3 style={{
                    color: "#fff",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    marginBottom: "8px",
                    lineHeight: "1.4"
                }}>
                    {lesson.title}
                </h3>
                <p style={{
                    color: "#8892b0",
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                    marginBottom: "16px"
                }}>
                    {lesson.summary}
                </p>

                {/* CTA */}
                <motion.div
                    animate={{ x: isHovered ? 8 : 0 }}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: color,
                        fontSize: "0.9rem",
                        fontWeight: "600"
                    }}
                >
                    Bắt đầu học <ChevronRight size={16} />
                </motion.div>
            </div>
        </motion.div>
    );
}

// Lesson Modal (Wikipedia Content + 3D Link) - ENHANCED VERSION
function LessonModal({ lesson, content, loading, onClose, onExplore3D }) {
    const lessonMeta = getLessonById(lesson.id);
    const [readProgress, setReadProgress] = useState(0);
    const contentRef = useRef(null);

    // Track reading progress
    useEffect(() => {
        const handleScroll = () => {
            if (contentRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
                const progress = Math.min((scrollTop / (scrollHeight - clientHeight)) * 100, 100);
                setReadProgress(progress || 0);
            }
        };

        const el = contentRef.current;
        if (el) {
            el.addEventListener('scroll', handleScroll);
            return () => el.removeEventListener('scroll', handleScroll);
        }
    }, [loading]);

    // Extract key facts from content (first 2-3 sentences as summary)
    const extractKeyFacts = (text) => {
        if (!text) return [];
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
        // Get some interesting sentences (skip first intro, get varied ones)
        const facts = [];
        for (let i = 0; i < sentences.length && facts.length < 4; i++) {
            const sentence = sentences[i].trim();
            // Pick sentences with numbers or interesting keywords
            if (sentence.length > 30 && sentence.length < 200) {
                if (/\d+/.test(sentence) || /nhất|lớn|cao|nóng|lạnh|xa|gần|tỷ|triệu/.test(sentence)) {
                    facts.push(sentence);
                }
            }
        }
        return facts.slice(0, 3);
    };

    // Format paragraphs with visual breaks
    const formatContent = (text) => {
        if (!text) return [];
        const paragraphs = text.split('\n').filter(p => p.trim());

        // Group into sections (every 2-3 paragraphs)
        const sections = [];
        let currentSection = [];

        paragraphs.forEach((p, idx) => {
            currentSection.push(p);
            if (currentSection.length >= 2 || idx === paragraphs.length - 1) {
                sections.push([...currentSection]);
                currentSection = [];
            }
        });

        return sections;
    };

    const keyFacts = content?.summary ? extractKeyFacts(content.summary) : [];
    const contentSections = content?.summary ? formatContent(content.summary) : [];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.9)",
                backdropFilter: "blur(12px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "20px"
            }}
        >
            <motion.div
                ref={contentRef}
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
                    borderRadius: "24px",
                    maxWidth: "900px",
                    width: "100%",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    position: "relative"
                }}
            >
                {/* Reading Progress Bar */}
                <div style={{
                    position: "sticky",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: "rgba(255,255,255,0.1)",
                    zIndex: 20
                }}>
                    <motion.div
                        animate={{ width: `${readProgress}%` }}
                        style={{
                            height: "100%",
                            background: "linear-gradient(90deg, #667eea, #764ba2, #f093fb)",
                            borderRadius: "2px"
                        }}
                    />
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                        background: "rgba(0, 0, 0, 0.6)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "50%",
                        width: "48px",
                        height: "48px",
                        color: "#fff",
                        fontSize: "24px",
                        cursor: "pointer",
                        zIndex: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s"
                    }}
                >
                    ×
                </button>

                {/* Hero Section with Wikipedia Image */}
                <div style={{ position: "relative", minHeight: "300px", overflow: "hidden" }}>
                    <img
                        src={content?.image || lesson.thumbnail}
                        alt={lesson.title}
                        style={{
                            width: "100%",
                            height: "300px",
                            objectFit: "cover",
                            opacity: 0.8
                        }}
                    />
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, #0f172a 0%, rgba(15,23,42,0.7) 40%, transparent 100%)"
                    }} />

                    <div style={{ position: "absolute", bottom: "30px", left: "40px", right: "40px" }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                background: lessonMeta?.levelColor || "#667eea",
                                padding: "8px 16px",
                                borderRadius: "25px",
                                fontSize: "13px",
                                fontWeight: "600",
                                marginBottom: "16px"
                            }}>
                                <Star size={14} fill="white" />
                                {lessonMeta?.levelTitle || "Bài học"}
                            </div>
                            <h1 style={{
                                color: "#fff",
                                fontSize: "2.2rem",
                                fontWeight: "800",
                                margin: 0,
                                lineHeight: 1.2,
                                textShadow: "0 2px 20px rgba(0,0,0,0.5)"
                            }}>
                                {content?.title || lesson.title}
                            </h1>
                        </motion.div>
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: "40px" }}>
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "60px" }}>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                style={{ fontSize: "50px", marginBottom: "20px" }}
                            >
                                🌍
                            </motion.div>
                            <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Đang tải nội dung từ Wikipedia...</p>
                        </div>
                    ) : content?.error ? (
                        <div style={{ textAlign: "center", padding: "60px" }}>
                            <div style={{ fontSize: "50px", marginBottom: "20px" }}>😕</div>
                            <p style={{ color: "#f87171", fontSize: "1.1rem" }}>{content.summary}</p>
                        </div>
                    ) : (
                        <>
                            {/* Quick Facts Box */}
                            {keyFacts.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    style={{
                                        background: "linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%)",
                                        border: "1px solid rgba(102, 126, 234, 0.3)",
                                        borderRadius: "16px",
                                        padding: "24px",
                                        marginBottom: "32px"
                                    }}
                                >
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        marginBottom: "16px",
                                        color: "#a78bfa"
                                    }}>
                                        <Sparkles size={20} />
                                        <span style={{ fontWeight: "700", fontSize: "1rem" }}>Điểm Nổi Bật</span>
                                    </div>
                                    <ul style={{
                                        margin: 0,
                                        paddingLeft: "20px",
                                        color: "#e2e8f0"
                                    }}>
                                        {keyFacts.map((fact, idx) => (
                                            <li key={idx} style={{
                                                marginBottom: "12px",
                                                lineHeight: "1.7",
                                                fontSize: "0.95rem"
                                            }}>
                                                {fact}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}

                            {/* Main Content - Sectioned */}
                            <div style={{ marginBottom: "40px" }}>
                                {contentSections.map((section, sectionIdx) => (
                                    <motion.div
                                        key={sectionIdx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + sectionIdx * 0.1 }}
                                        style={{ marginBottom: "32px" }}
                                    >
                                        {section.map((paragraph, pIdx) => (
                                            <p key={pIdx} style={{
                                                color: "#cbd5e1",
                                                fontSize: "1.1rem",
                                                lineHeight: "2",
                                                marginBottom: "20px",
                                                textAlign: "justify",
                                                hyphens: "auto"
                                            }}>
                                                {/* Highlight first letter of first paragraph in section */}
                                                {pIdx === 0 && sectionIdx === 0 ? (
                                                    <>
                                                        <span style={{
                                                            float: "left",
                                                            fontSize: "3.5rem",
                                                            fontWeight: "800",
                                                            lineHeight: "1",
                                                            marginRight: "12px",
                                                            marginTop: "4px",
                                                            color: "#667eea"
                                                        }}>
                                                            {paragraph.charAt(0)}
                                                        </span>
                                                        {paragraph.slice(1)}
                                                    </>
                                                ) : paragraph}
                                            </p>
                                        ))}

                                        {/* Visual separator between sections (not after last) */}
                                        {sectionIdx < contentSections.length - 1 && (
                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "16px",
                                                margin: "32px 0",
                                                opacity: 0.4
                                            }}>
                                                <div style={{ height: "1px", width: "60px", background: "#64748b" }} />
                                                <Star size={12} />
                                                <div style={{ height: "1px", width: "60px", background: "#64748b" }} />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Wikipedia Source Link */}
                            {content?.url && (
                                <a
                                    href={content.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        color: "#94a3b8",
                                        fontSize: "0.9rem",
                                        textDecoration: "none",
                                        padding: "12px 20px",
                                        background: "rgba(255,255,255,0.05)",
                                        borderRadius: "12px",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        marginBottom: "32px",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    <ExternalLink size={16} />
                                    Đọc bài viết đầy đủ trên Wikipedia
                                </a>
                            )}

                            {/* 3D Experience Button */}
                            {lesson.related3D && (
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => onExplore3D(lesson.related3D.target)}
                                    style={{
                                        width: "100%",
                                        padding: "24px",
                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                                        border: "none",
                                        borderRadius: "20px",
                                        color: "#fff",
                                        fontSize: "1.2rem",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "16px",
                                        boxShadow: "0 15px 50px rgba(102, 126, 234, 0.4)",
                                        position: "relative",
                                        overflow: "hidden"
                                    }}
                                >
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.3, 0.6, 0.3]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            background: "radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)",
                                            pointerEvents: "none"
                                        }}
                                    />
                                    <Rocket size={28} />
                                    <span>Khám phá {lesson.related3D.label} trong 3D</span>
                                    <Sparkles size={24} />
                                </motion.button>
                            )}
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

// Library Tab Component
function LibraryTab({ articles, categories, selectedCategory, onCategoryChange, onArticleClick }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
            {/* Category Filter */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginBottom: "36px",
                flexWrap: "wrap"
            }}>
                {categories.map((cat) => (
                    <motion.button
                        key={cat}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onCategoryChange(cat)}
                        style={{
                            padding: "10px 20px",
                            background: selectedCategory === cat
                                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                : "rgba(255, 255, 255, 0.05)",
                            border: selectedCategory === cat ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "25px",
                            color: "#fff",
                            fontSize: "14px",
                            cursor: "pointer",
                            transition: "all 0.3s ease"
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
                    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                    gap: "24px"
                }}
            >
                <AnimatePresence mode="popLayout">
                    {articles.map((article) => (
                        <ArticleCard
                            key={article.id}
                            article={article}
                            onClick={() => onArticleClick(article)}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            {articles.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
                    <Star size={48} style={{ marginBottom: "16px", opacity: 0.5 }} />
                    <p>Không có bài viết nào trong danh mục này.</p>
                </div>
            )}
        </motion.div>
    );
}

// Article Card Component
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
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                cursor: "pointer"
            }}
        >
            <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
                <motion.img
                    src={article.image}
                    alt={article.title}
                    animate={{ scale: isHovered ? 1.1 : 1 }}
                    transition={{ duration: 0.4 }}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "rgba(0, 0, 0, 0.6)",
                    backdropFilter: "blur(8px)",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "bold"
                }}>
                    {article.category}
                </div>
            </div>

            <div style={{ padding: "20px" }}>
                <h3 style={{ color: "#fff", fontSize: "1.15rem", marginBottom: "8px", lineHeight: "1.4" }}>
                    {article.title}
                </h3>
                <div style={{ display: "flex", gap: "12px", marginBottom: "12px", fontSize: "12px", color: "#64748b" }}>
                    <span>📅 {article.date}</span>
                    <span>⏱️ {article.readTime}</span>
                </div>
                <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
                    {article.excerpt}
                </p>
                <motion.div
                    animate={{ x: isHovered ? 5 : 0 }}
                    style={{ color: "#667eea", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}
                >
                    Đọc thêm <ChevronRight size={16} />
                </motion.div>
            </div>
        </motion.article>
    );
}

// Article Modal Component
function ArticleModal({ article, onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.9)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "20px"
            }}
        >
            <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "rgba(15, 23, 42, 0.98)",
                    borderRadius: "24px",
                    maxWidth: "800px",
                    width: "100%",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    border: "1px solid rgba(255, 255, 255, 0.1)"
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: "sticky",
                        top: "20px",
                        left: "calc(100% - 60px)",
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "none",
                        borderRadius: "50%",
                        width: "44px",
                        height: "44px",
                        color: "#fff",
                        fontSize: "24px",
                        cursor: "pointer",
                        zIndex: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    ×
                </button>

                <img
                    src={article.image}
                    alt={article.title}
                    style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "24px 24px 0 0", marginTop: "-60px" }}
                />

                <div style={{ padding: "40px" }}>
                    <div style={{
                        display: "inline-block",
                        background: "rgba(102, 126, 234, 0.2)",
                        padding: "6px 14px",
                        borderRadius: "6px",
                        color: "#667eea",
                        fontSize: "12px",
                        fontWeight: "bold",
                        marginBottom: "16px"
                    }}>
                        {article.category}
                    </div>

                    <h1 style={{ color: "#fff", fontSize: "2rem", marginBottom: "16px", lineHeight: "1.3" }}>
                        {article.title}
                    </h1>

                    <div style={{ display: "flex", gap: "16px", marginBottom: "32px", fontSize: "14px", color: "#64748b" }}>
                        <span>📅 {article.date}</span>
                        <span>⏱️ {article.readTime}</span>
                    </div>

                    <div style={{ color: "#cbd5e1", fontSize: "1.05rem", lineHeight: "1.9", whiteSpace: "pre-line" }}>
                        {article.content}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
