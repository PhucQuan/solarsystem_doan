# 🌌 Solar System 3D Explorer

Ứng dụng khám phá hệ mặt trời 3D tương tác với AI Chatbot và Tour Guide tự động, được xây dựng bằng React, Three.js và Google Gemini AI.

## ✨ Tính năng chính

### 🚀 3D Interactive Solar System
- Mô phỏng hệ mặt trời 3D với 8 hành tinh tỷ lệ thực tế
- Quỹ đạo động, tốc độ tự quay và công quay tuỳ chỉnh
- Textures chất lượng cao cho từng hành tinh
- Hiệu ứng đặc biệt: lớp mây Trái Đất, vành đai Sao Thổ, Mặt Trời phát sáng

### 🤖 AI-Powered Features
- **Chatbot thông minh**: Hỏi đáp về thiên văn với Gemini AI (RAG architecture)
- **AI Tour Guide**: Tự động dẫn camera bay qua các hành tinh với thuyết minh bằng giọng nói
- **Smart Search**: Tìm kiếm nhanh thông tin hành tinh, bài viết, hình ảnh

### 📚 Educational Content
- Thư viện bài viết về thiên văn học
- Bộ sưu tập hình ảnh NASA (Gallery)
- Quiz kiểm tra kiến thức về hệ mặt trời
- Thông tin chi tiết về từng hành tinh

### 🎨 User Experience
- Dark/Light mode
- Responsive design
- Camera controls (zoom, rotate, pan)
- Time controls (tăng/giảm tốc độ mô phỏng)
- Favorites system để lưu hành tinh yêu thích

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **React Three Fiber** - Three.js wrapper cho React
- **@react-three/drei** - Helpers cho 3D scenes
- **React Router** - Navigation
- **Framer Motion** - Animations
- **GSAP** - Advanced animations
- **Lucide React** - Icons

### Backend
- **Express.js** - API server
- **Google Gemini AI** - RAG chatbot
- **NASA APIs** - Astronomy data

### AI Architecture
- **RAG (Retrieval-Augmented Generation)**: Kết hợp Wikipedia crawler với Gemini để cung cấp thông tin chính xác
- **Vector embeddings**: Tìm kiếm thông tin liên quan thông minh
- **Groq SDK**: Tối ưu inference tốc độ cao

## 📦 Cài đặt

### Yêu cầu
- Node.js 18+
- npm hoặc yarn

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd solarsystem_project
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Cấu hình môi trường
Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

Thêm API keys vào `.env`:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_NASA_API_KEY=your_nasa_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

### Bước 4: Chạy ứng dụng
```bash
# Terminal 1: Frontend dev server
npm run dev

# Terminal 2: Backend API server
npm run server
```

Truy cập: http://localhost:5173

## 🌍 Thêm Textures cho hành tinh

Để có trải nghiệm tốt nhất, bạn cần tải textures chất lượng cao:

### Nguồn khuyên dùng
**Solar System Scope**: https://www.solarsystemscope.com/textures/

### Hướng dẫn
1. Tải các file textures 2K (2048x1024)
2. Đặt vào thư mục `public/textures/`
3. Đổi tên theo format: `sun.jpg`, `earth.jpg`, `mars.jpg`, v.v.

Chi tiết xem [TEXTURE_GUIDE.md](./TEXTURE_GUIDE.md)

## 🏗️ Cấu trúc dự án

```
solarsystem_project/
├── src/
│   ├── components/      # React components
│   │   ├── SolarSystem.jsx
│   │   ├── Planet.jsx
│   │   ├── EnhancedSun.jsx
│   │   └── ...
│   ├── features/        # Feature modules
│   │   └── tours/       # AI Tour Guide
│   ├── pages/           # Route pages
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom hooks
│   ├── data/            # Static data
│   └── ChatBot.jsx      # AI Chatbot
├── server/
│   ├── index.js         # Express server
│   ├── ragService.js    # RAG implementation
│   ├── nasaService.js   # NASA API integration
│   └── solarService.js  # Solar system data
└── public/
    └── textures/        # Planet textures
```

## 🎯 Sử dụng

### Khám phá 3D
1. Vào trang **Explore 3D**
2. Dùng chuột để xoay, zoom camera
3. Click vào hành tinh để xem thông tin chi tiết
4. Dùng Time Controls để điều chỉnh tốc độ

### AI Tour Guide
1. Click nút "🎭 AI Guide" ở góc phải
2. Chọn tour từ thư viện (hoặc tạo tour custom)
3. Ngồi lại và thưởng thức - AI sẽ tự dẫn bạn đi!

### Chatbot
1. Click icon chat ở góc dưới phải
2. Hỏi bất kỳ câu hỏi nào về thiên văn
3. AI sẽ trả lời dựa trên database Wikipedia và NASA

## 📊 AI Chatbot Architecture

### RAG (Retrieval-Augmented Generation)
1. **Wikipedia Crawler**: Thu thập dữ liệu từ Wikipedia tiếng Việt
2. **Vector Database**: Lưu trữ embeddings của articles
3. **Semantic Search**: Tìm context liên quan cho câu hỏi
4. **Gemini Integration**: Generate câu trả lời từ context + LLM

### Lợi ích
- ✅ Độ chính xác cao hơn so với pure LLM
- ✅ Giảm hallucination
- ✅ Có thể trích dẫn nguồn
- ✅ Tiết kiệm token costs

## 🚀 Build Production

```bash
npm run build
```

Output trong thư mục `dist/`

## 🤝 Contributing

Mọi đóng góp đều được chào đón! Vui lòng:
1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## 📄 License

MIT License

## 🙏 Credits

- **Textures**: [Solar System Scope](https://www.solarsystemscope.com/)
- **Data**: NASA Open APIs
- **AI**: Google Gemini, Groq
- **3D Engine**: Three.js
