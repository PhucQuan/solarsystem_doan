# Nguồn gốc nội dung và hình ảnh trong trang Learn

## ✅ ĐANG HOẠT ĐỘNG

Hệ thống hiện đã **tự động lấy dữ liệu** từ Internet mỗi giờ (có cache 1 tiếng).

---

## 📚 Nguồn dữ liệu

### 1. **Wikipedia Tiếng Việt** (8 bài viết)

| Chủ đề | Nguồn API |
|--------|-----------|
| Vụ nổ Big Bang | https://vi.wikipedia.org/wiki/Vụ_Nổ_Lớn |
| Hố đen | https://vi.wikipedia.org/wiki/Lỗ_đen |
| Hệ Mặt Trời | https://vi.wikipedia.org/wiki/Hệ_Mặt_Trời |
| Sao chổi | https://vi.wikipedia.org/wiki/Sao_chổi |
| Thiên hà | https://vi.wikipedia.org/wiki/Thiên_hà |
| Sao Hỏa | https://vi.wikipedia.org/wiki/Sao_Hỏa |
| Mặt Trăng | https://vi.wikipedia.org/wiki/Mặt_Trăng |
| Nhật thực | https://vi.wikipedia.org/wiki/Nhật_thực |

**Lấy được:**
- Tiêu đề bài viết
- Tóm tắt đầu bài (Introduction)
- Hình ảnh thumbnail

**API Endpoint**: `https://vi.wikipedia.org/w/api.php`

---

### 2. **NASA APOD** (Astronomy Picture of the Day)

- **Nguồn**: NASA chính thức
- **Nội dung**: Ảnh thiên văn trong ngày + giải thích của nhà thiên văn học
- **API Endpoint**: `https://api.nasa.gov/planetary/apod`
- **Cập nhật**: Mỗi ngày 1 ảnh mới

---

## 🔄 Cách hoạt động

```
User vào trang Learn
        ↓
Frontend gọi: http://localhost:3001/api/articles
        ↓
Server kiểm tra cache (1 tiếng)
        ↓
Nếu hết hạn → Gọi Wikipedia API + NASA API
        ↓
Trả về danh sách bài viết (JSON)
        ↓
Frontend hiển thị dưới dạng cards xinh xẻo
```

---

## 📋 Ví dụ dữ liệu trả về

```json
[
  {
    "id": "apod-1234567890",
    "title": "Saturn's Ribbons",
    "category": "Featured",
    "image": "https://apod.nasa.gov/apod/image/...",
    "content": "What causes the bright streaks on Saturn?",
    "source": "NASA APOD"
  },
  {
    "id": "wiki-0",
    "title": "Vụ Nổ Lớn",
    "category": "Science",
    "image": "https://upload.wikimedia.org/wikipedia/commons/...",
    "content": "Vụ Nổ Lớn là lý thuyết vũ trụ học...",
    "source": "Wikipedia VN"
  }
]
```

---

## 🎨 Kết quả cuối cùng

Người dùng thấy một trang blog đẹp mắt với các bài viết:
- ✅ Nội dungtiếng Việt từ Wikipedia
- ✅ Hình ảnh chất lượng cao
- ✅ Cập nhật tự động
- ✅ Không cần database

**Bạn có thể xem ngay tại:** http://localhost:5173/ → Click "Learn"
