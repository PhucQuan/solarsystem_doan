import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QUIZ_QUESTIONS } from "../data/quizData";

// localStorage keys
const STORAGE_KEYS = {
    HIGH_SCORE: "solar_quiz_high_score",
    TOTAL_GAMES: "solar_quiz_total_games",
    LAST_PLAYED: "solar_quiz_last_played",
};

export default function Quiz() {
    const [gameState, setGameState] = useState("start"); // 'start', 'playing', 'results'
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFunFact, setShowFunFact] = useState(false);
    const [userAnswers, setUserAnswers] = useState([]);
    const [stats, setStats] = useState({
        highScore: 0,
        totalGames: 0,
        lastPlayed: null,
    });

    // Load stats from localStorage
    useEffect(() => {
        const highScore = parseInt(localStorage.getItem(STORAGE_KEYS.HIGH_SCORE) || "0");
        const totalGames = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_GAMES) || "0");
        const lastPlayed = localStorage.getItem(STORAGE_KEYS.LAST_PLAYED);
        setStats({ highScore, totalGames, lastPlayed });
    }, []);

    const startQuiz = () => {
        setGameState("playing");
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowFunFact(false);
        setUserAnswers([]);
    };

    const selectAnswer = (answerIndex) => {
        if (selectedAnswer !== null) return; // Already answered

        setSelectedAnswer(answerIndex);
        const isCorrect = answerIndex === QUIZ_QUESTIONS[currentQuestion].correctAnswer;

        if (isCorrect) {
            setScore(score + 1);
        }

        setUserAnswers([...userAnswers, { questionId: QUIZ_QUESTIONS[currentQuestion].id, userAnswer: answerIndex, isCorrect }]);
        setShowFunFact(true);
    };

    const nextQuestion = () => {
        if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowFunFact(false);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        const finalScore = score;
        const totalGames = stats.totalGames + 1;
        const highScore = Math.max(finalScore, stats.highScore);
        const lastPlayed = new Date().toISOString();

        localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, highScore.toString());
        localStorage.setItem(STORAGE_KEYS.TOTAL_GAMES, totalGames.toString());
        localStorage.setItem(STORAGE_KEYS.LAST_PLAYED, lastPlayed);

        setStats({ highScore, totalGames, lastPlayed });
        setGameState("results");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #0a0e27 0%, #1a1e3f 100%)",
                padding: "40px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <AnimatePresence mode="wait">
                {gameState === "start" && (
                    <StartScreen onStart={startQuiz} stats={stats} key="start" />
                )}
                {gameState === "playing" && (
                    <QuizScreen
                        question={QUIZ_QUESTIONS[currentQuestion]}
                        questionNumber={currentQuestion + 1}
                        totalQuestions={QUIZ_QUESTIONS.length}
                        selectedAnswer={selectedAnswer}
                        onSelectAnswer={selectAnswer}
                        onNext={nextQuestion}
                        showFunFact={showFunFact}
                        score={score}
                        key={`q-${currentQuestion}`}
                    />
                )}
                {gameState === "results" && (
                    <ResultsScreen
                        score={score}
                        totalQuestions={QUIZ_QUESTIONS.length}
                        userAnswers={userAnswers}
                        stats={stats}
                        onRestart={startQuiz}
                        key="results"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function StartScreen({ onStart, stats }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            style={{
                maxWidth: "600px",
                width: "100%",
                textAlign: "center",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                borderRadius: "24px",
                padding: "60px 40px",
                border: "2px solid rgba(255, 255, 255, 0.1)",
            }}
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ fontSize: "80px", marginBottom: "20px" }}
            >
                🚀
            </motion.div>
            <h1 style={{ color: "#fff", fontSize: "48px", margin: "0 0 16px 0", fontFamily: "'Orbitron', sans-serif" }}>
                Space Quiz
            </h1>
            <p style={{ color: "#888", fontSize: "18px", marginBottom: "40px" }}>
                Kiểm tra kiến thức của bạn về vũ trụ và hệ Mặt Trời!
            </p>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginBottom: "40px" }}>
                <div style={{ background: "rgba(102, 126, 234, 0.1)", borderRadius: "12px", padding: "20px" }}>
                    <div style={{ fontSize: "32px", color: "#667eea", fontWeight: "bold" }}>{stats.highScore}</div>
                    <div style={{ fontSize: "14px", color: "#888", marginTop: "8px" }}>High Score</div>
                </div>
                <div style={{ background: "rgba(102, 126, 234, 0.1)", borderRadius: "12px", padding: "20px" }}>
                    <div style={{ fontSize: "32px", color: "#667eea", fontWeight: "bold" }}>{stats.totalGames}</div>
                    <div style={{ fontSize: "14px", color: "#888", marginTop: "8px" }}>Games Played</div>
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    borderRadius: "12px",
                    padding: "18px 48px",
                    color: "#fff",
                    fontSize: "20px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
                }}
            >
                Bắt đầu Quiz 🌟
            </motion.button>

            <p style={{ color: "#666", fontSize: "14px", marginTop: "30px" }}>
                {QUIZ_QUESTIONS.length} câu hỏi • Thời gian không giới hạn
            </p>
        </motion.div>
    );
}

function QuizScreen({ question, questionNumber, totalQuestions, selectedAnswer, onSelectAnswer, onNext, showFunFact, score }) {
    const progress = (questionNumber / totalQuestions) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            style={{
                maxWidth: "800px",
                width: "100%",
            }}
        >
            {/* Progress Bar */}
            <div style={{ marginBottom: "30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#888", fontSize: "14px" }}>
                        Câu {questionNumber}/{totalQuestions}
                    </span>
                    <span style={{ color: "#667eea", fontSize: "14px", fontWeight: "bold" }}>
                        Điểm: {score}/{totalQuestions}
                    </span>
                </div>
                <div style={{ background: "rgba(255, 255, 255, 0.1)", borderRadius: "10px", height: "8px", overflow: "hidden" }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        style={{
                            background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                            height: "100%",
                            borderRadius: "10px",
                        }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <div
                style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "24px",
                    padding: "40px",
                    border: "2px solid rgba(255, 255, 255, 0.1)",
                }}
            >
                <div
                    style={{
                        display: "inline-block",
                        background: "rgba(102, 126, 234, 0.2)",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        color: "#667eea",
                        fontSize: "12px",
                        fontWeight: "bold",
                        marginBottom: "20px",
                    }}
                >
                    {question.category}
                </div>

                <h2 style={{ color: "#fff", fontSize: "28px", marginBottom: "30px", lineHeight: "1.4" }}>
                    {question.question}
                </h2>

                {/* Options */}
                <div style={{ display: "grid", gap: "16px" }}>
                    {question.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrect = index === question.correctAnswer;
                        const showResult = selectedAnswer !== null;

                        let backgroundColor = "rgba(255, 255, 255, 0.05)";
                        let borderColor = "rgba(255, 255, 255, 0.1)";

                        if (showResult) {
                            if (isCorrect) {
                                backgroundColor = "rgba(76, 175, 80, 0.2)";
                                borderColor = "#4CAF50";
                            } else if (isSelected && !isCorrect) {
                                backgroundColor = "rgba(244, 67, 54, 0.2)";
                                borderColor = "#F44336";
                            }
                        }

                        return (
                            <motion.button
                                key={index}
                                whileHover={selectedAnswer === null ? { scale: 1.02, x: 10 } : {}}
                                whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                                onClick={() => onSelectAnswer(index)}
                                disabled={selectedAnswer !== null}
                                style={{
                                    background: backgroundColor,
                                    border: `2px solid ${borderColor}`,
                                    borderRadius: "12px",
                                    padding: "20px",
                                    color: "#fff",
                                    fontSize: "16px",
                                    textAlign: "left",
                                    cursor: selectedAnswer === null ? "pointer" : "default",
                                    transition: "all 0.3s ease",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "50%",
                                        background: showResult && isCorrect ? "#4CAF50" : "rgba(255, 255, 255, 0.1)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        flexShrink: 0,
                                    }}
                                >
                                    {showResult && isCorrect ? "✓" : String.fromCharCode(65 + index)}
                                </div>
                                <span>{option}</span>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Fun Fact */}
                <AnimatePresence>
                    {showFunFact && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                                marginTop: "24px",
                                background: "rgba(102, 126, 234, 0.1)",
                                borderLeft: "4px solid #667eea",
                                borderRadius: "8px",
                                padding: "20px",
                            }}
                        >
                            <div style={{ fontSize: "18px", marginBottom: "8px" }}>💡 Fun Fact!</div>
                            <p style={{ color: "#ccc", fontSize: "14px", margin: 0, lineHeight: "1.6" }}>
                                {question.funFact}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Next Button */}
                {showFunFact && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onNext}
                        style={{
                            marginTop: "24px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            border: "none",
                            borderRadius: "12px",
                            padding: "14px 32px",
                            color: "#fff",
                            fontSize: "16px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            width: "100%",
                        }}
                    >
                        {questionNumber < totalQuestions ? "Câu tiếp theo →" : "Xem kết quả 🎉"}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}

function ResultsScreen({ score, totalQuestions, stats, onRestart }) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const isNewHighScore = score > stats.highScore;

    let message = "";
    let emoji = "";
    if (percentage === 100) {
        message = "Hoàn hảo! Bạn là chuyên gia vũ trụ!";
        emoji = "🏆";
    } else if (percentage >= 80) {
        message = "Xuất sắc! Bạn hiểu biết rất nhiều!";
        emoji = "🌟";
    } else if (percentage >= 60) {
        message = "Tốt lắm! Tiếp tục học hỏi nhé!";
        emoji = "👍";
    } else if (percentage >= 40) {
        message = "Bình thường! Hãy thử lại nhé!";
        emoji = "📚";
    } else {
        message = "Cần cố gắng hơn! Đừng bỏ cuộc!";
        emoji = "💪";
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                maxWidth: "600px",
                width: "100%",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                borderRadius: "24px",
                padding: "60px 40px",
                border: "2px solid rgba(255, 255, 255, 0.1)",
                textAlign: "center",
            }}
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                style={{ fontSize: "100px", marginBottom: "20px" }}
            >
                {emoji}
            </motion.div>

            <h1 style={{ color: "#fff", fontSize: "42px", margin: "0 0 16px 0" }}>
                {message}
            </h1>

            {isNewHighScore && score > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                        color: "#000",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        display: "inline-block",
                        fontSize: "14px",
                        fontWeight: "bold",
                        marginBottom: "30px",
                    }}
                >
                    🎉 ĐIỂM CAO MỚI!
                </motion.div>
            )}

            {/* Score Circle */}
            <div style={{ margin: "40px 0" }}>
                <div
                    style={{
                        width: "200px",
                        height: "200px",
                        borderRadius: "50%",
                        background: `conic-gradient(#667eea ${percentage * 3.6}deg, rgba(255, 255, 255, 0.1) 0deg)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto",
                        position: "relative",
                    }}
                >
                    <div
                        style={{
                            width: "170px",
                            height: "170px",
                            borderRadius: "50%",
                            background: "rgba(10, 14, 39, 0.95)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                        }}
                    >
                        <div style={{ fontSize: "48px", color: "#667eea", fontWeight: "bold" }}>
                            {score}/{totalQuestions}
                        </div>
                        <div style={{ fontSize: "14px", color: "#888", marginTop: "4px" }}>
                            {percentage}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "40px" }}>
                <div style={{ background: "rgba(255, 255, 255, 0.05)", borderRadius: "12px", padding: "16px" }}>
                    <div style={{ fontSize: "24px", color: "#667eea", fontWeight: "bold" }}>{stats.highScore}</div>
                    <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>Your Best</div>
                </div>
                <div style={{ background: "rgba(255, 255, 255, 0.05)", borderRadius: "12px", padding: "16px" }}>
                    <div style={{ fontSize: "24px", color: "#667eea", fontWeight: "bold" }}>{stats.totalGames}</div>
                    <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>Total Games</div>
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRestart}
                style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    borderRadius: "12px",
                    padding: "18px 48px",
                    color: "#fff",
                    fontSize: "18px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
                }}
            >
                Chơi lại 🔄
            </motion.button>
        </motion.div>
    );
}
