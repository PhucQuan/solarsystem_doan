// Comprehensive educational content with Wikipedia keywords for dynamic fetching
export const LESSONS_DATA = [
    {
        id: "level-1",
        title: "Level 1: Khởi Đầu Hành Trình",
        description: "Những kiến thức nền tảng cho người mới bắt đầu",
        color: "#4CAF50",
        icon: "🌱",
        lessons: [
            {
                id: "solar-system-intro",
                title: "Hệ Mặt Trời Là Gì?",
                wikiTopic: "Hệ Mặt Trời",
                thumbnail: "/textures/sun.jpg",
                duration: "5 phút",
                summary: "Tìm hiểu về ngôi nhà vũ trụ của chúng ta - nơi có 8 hành tinh và vô số thiên thể khác.",
                related3D: { target: "Sun", label: "Mặt Trời" }
            },
            {
                id: "earth-home",
                title: "Trái Đất - Hành Tinh Xanh",
                wikiTopic: "Trái Đất",
                thumbnail: "/textures/earth.jpg",
                duration: "6 phút",
                summary: "Khám phá hành tinh duy nhất được biết đến có sự sống trong vũ trụ.",
                related3D: { target: "Earth", label: "Trái Đất" }
            },
            {
                id: "moon-satellite",
                title: "Mặt Trăng - Người Bạn Đồng Hành",
                wikiTopic: "Mặt Trăng",
                thumbnail: "/textures/earth.jpg",
                duration: "4 phút",
                summary: "Vệ tinh tự nhiên duy nhất của Trái Đất và ảnh hưởng của nó đến cuộc sống.",
                related3D: { target: "Earth", label: "Trái Đất" }
            }
        ]
    },
    {
        id: "level-2",
        title: "Level 2: Các Hành Tinh Đất Đá",
        description: "Khám phá 4 hành tinh gần Mặt Trời nhất",
        color: "#FF9800",
        icon: "🪨",
        lessons: [
            {
                id: "mercury-speed",
                title: "Sao Thủy - Tốc Độ Ánh Sáng",
                wikiTopic: "Sao Thủy",
                thumbnail: "/textures/mercury.jpg",
                duration: "5 phút",
                summary: "Hành tinh nhỏ nhất và nhanh nhất trong hệ Mặt Trời.",
                related3D: { target: "Mercury", label: "Sao Thủy" }
            },
            {
                id: "venus-hell",
                title: "Sao Kim - Địa Ngục Xinh Đẹp",
                wikiTopic: "Sao Kim",
                thumbnail: "/textures/venus.jpg",
                duration: "6 phút",
                summary: "Hành tinh nóng nhất với bầu khí quyển chết chóc.",
                related3D: { target: "Venus", label: "Sao Kim" }
            },
            {
                id: "mars-red",
                title: "Sao Hỏa - Hành Tinh Đỏ",
                wikiTopic: "Sao Hỏa",
                thumbnail: "/textures/mars.jpg",
                duration: "7 phút",
                summary: "Mục tiêu tiếp theo của loài người trong việc khám phá vũ trụ.",
                related3D: { target: "Mars", label: "Sao Hỏa" }
            }
        ]
    },
    {
        id: "level-3",
        title: "Level 3: Những Gã Khổng Lồ",
        description: "Hành tinh khí và băng khổng lồ",
        color: "#2196F3",
        icon: "🌀",
        lessons: [
            {
                id: "jupiter-king",
                title: "Sao Mộc - Vua Hành Tinh",
                wikiTopic: "Sao Mộc",
                thumbnail: "/textures/jupiter.jpg",
                duration: "8 phút",
                summary: "Hành tinh lớn nhất với cơn bão 300 năm tuổi.",
                related3D: { target: "Jupiter", label: "Sao Mộc" }
            },
            {
                id: "saturn-rings",
                title: "Sao Thổ - Chúa Nhẫn Vũ Trụ",
                wikiTopic: "Sao Thổ",
                thumbnail: "/textures/saturn.jpg",
                duration: "7 phút",
                summary: "Vành đai tuyệt đẹp nhất trong hệ Mặt Trời.",
                related3D: { target: "Saturn", label: "Sao Thổ" }
            },
            {
                id: "uranus-tilt",
                title: "Sao Thiên Vương - Kẻ Nằm Nghiêng",
                wikiTopic: "Sao Thiên Vương",
                thumbnail: "/textures/uranus.jpg",
                duration: "5 phút",
                summary: "Hành tinh quay nghiêng 98 độ kỳ lạ.",
                related3D: { target: "Uranus", label: "Sao Thiên Vương" }
            },
            {
                id: "neptune-winds",
                title: "Sao Hải Vương - Thế Giới Bão Tố",
                wikiTopic: "Sao Hải Vương",
                thumbnail: "/textures/neptune.jpg",
                duration: "5 phút",
                summary: "Gió mạnh nhất hệ Mặt Trời, lên đến 2100 km/h.",
                related3D: { target: "Neptune", label: "Sao Hải Vương" }
            }
        ]
    },
    {
        id: "level-4",
        title: "Level 4: Bí Ẩn Vũ Trụ",
        description: "Những hiện tượng kỳ diệu vượt ra ngoài hệ Mặt Trời",
        color: "#9C27B0",
        icon: "🌌",
        lessons: [
            {
                id: "black-holes",
                title: "Hố Đen - Quái Vật Vô Hình",
                wikiTopic: "Lỗ đen",
                thumbnail: "/textures/sun.jpg",
                duration: "10 phút",
                summary: "Nơi cong vênh không-thời gian đến mức ánh sáng cũng không thoát được.",
                related3D: null
            },
            {
                id: "galaxies",
                title: "Thiên Hà - Đảo Vũ Trụ",
                wikiTopic: "Thiên hà",
                thumbnail: "/textures/sun.jpg",
                duration: "8 phút",
                summary: "Hàng trăm tỷ ngôi sao tụ họp tạo thành những cấu trúc khổng lồ.",
                related3D: null
            },
            {
                id: "big-bang",
                title: "Big Bang - Khởi Nguyên Vũ Trụ",
                wikiTopic: "Vụ Nổ Lớn",
                thumbnail: "/textures/sun.jpg",
                duration: "12 phút",
                summary: "Câu chuyện về sự ra đời của không gian, thời gian và tất cả.",
                related3D: null
            }
        ]
    }
];

// Helper to get all lessons flattened
export const getAllLessons = () => {
    return LESSONS_DATA.flatMap(level =>
        level.lessons.map(lesson => ({ ...lesson, levelId: level.id, levelTitle: level.title }))
    );
};

// Helper to find lesson by ID
export const getLessonById = (lessonId) => {
    for (const level of LESSONS_DATA) {
        const lesson = level.lessons.find(l => l.id === lessonId);
        if (lesson) return { ...lesson, levelId: level.id, levelTitle: level.title, levelColor: level.color };
    }
    return null;
};
