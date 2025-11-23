# 🌍 Hướng dẫn thêm Textures cho Solar System 3D

## ✅ Đã hoàn thành
- ✅ Code đã được cập nhật để hỗ trợ textures
- ✅ Hệ thống tự động fallback về màu sắc nếu không có texture
- ✅ Thêm lớp mây cho Trái Đất
- ✅ Mặt Trời có hiệu ứng phát sáng (emissive)

## 📥 Bước 1: Tải Textures

### Nguồn khuyên dùng: Solar System Scope
**Link:** https://www.solarsystemscope.com/textures/

1. Truy cập website
2. Chọn độ phân giải **2K** (2048x1024) - đủ đẹp và không quá nặng
3. Tải các file sau:

| Hành tinh | File cần tải | Đổi tên thành |
|-----------|--------------|---------------|
| Mặt Trời | `2k_sun.jpg` | `sun.jpg` |
| Sao Thủy | `2k_mercury.jpg` | `mercury.jpg` |
| Sao Kim | `2k_venus_surface.jpg` | `venus.jpg` |
| Trái Đất | `2k_earth_daymap.jpg` | `earth.jpg` |
| Mây Trái Đất | `2k_earth_clouds.jpg` | `earth_clouds.jpg` |
| Sao Hỏa | `2k_mars.jpg` | `mars.jpg` |
| Sao Mộc | `2k_jupiter.jpg` | `jupiter.jpg` |
| Sao Thổ | `2k_saturn.jpg` | `saturn.jpg` |
| Sao Thiên Vương | `2k_uranus.jpg` | `uranus.jpg` |
| Sao Hải Vương | `2k_neptune.jpg` | `neptune.jpg` |

### Nguồn thay thế: Planet Pixel Emporium
**Link:** http://planetpixelemporium.com/planets.html
- Chất lượng cao, nhiều lựa chọn
- Có cả normal maps và specular maps (nâng cao)

## 📁 Bước 2: Đặt file vào đúng thư mục

Sau khi tải xong, đặt tất cả file `.jpg` vào:
```
webvutru/solarsystem_project/public/textures/
```

Cấu trúc thư mục cuối cùng:
```
public/
└── textures/
    ├── sun.jpg
    ├── mercury.jpg
    ├── venus.jpg
    ├── earth.jpg
    ├── earth_clouds.jpg
    ├── mars.jpg
    ├── jupiter.jpg
    ├── saturn.jpg
    ├── uranus.jpg
    └── neptune.jpg
```

## 🚀 Bước 3: Khởi động lại dev server

```bash
# Dừng server hiện tại (Ctrl + C)
# Sau đó chạy lại:
npm run dev
```

## 🎨 Kết quả mong đợi

Sau khi thêm textures:
- ✨ Mặt Trời sẽ có bề mặt dung nham rực rỡ
- 🌍 Trái Đất có đại dương xanh, lục địa nâu, và lớp mây trắng
- 🔴 Sao Hỏa có bề mặt đỏ đặc trưng
- 🌀 Sao Mộc có các vệt khí khổng lồ
- 💍 Sao Thổ có màu vàng nhạt đẹp mắt

## ⚠️ Lưu ý

1. **Nếu không có texture:** Hệ thống tự động dùng màu placeholder
2. **File size:** Mỗi ảnh 2K khoảng 500KB - 2MB
3. **Performance:** Nếu web chạy chậm, có thể giảm xuống 1K
4. **Browser cache:** Nếu thay đổi ảnh mà không thấy update, nhấn Ctrl + F5

## 🎯 Bước tiếp theo (Optional)

Sau khi có textures, bạn có thể nâng cấp thêm:

### 1. Thêm Bloom Effect (Mặt Trời phát sáng)
```bash
npm install @react-three/postprocessing
```

### 2. Thêm vành đai cho Sao Thổ
- Tải texture vành đai từ Solar System Scope
- Tạo component `SaturnRings.jsx`

### 3. Thêm Normal Maps (Bề mặt 3D chi tiết hơn)
- Tải normal maps từ Planet Pixel Emporium
- Thêm `normalMap` vào material

## 🆘 Troubleshooting

### Lỗi: "Failed to load texture"
- Kiểm tra tên file có đúng không (phân biệt hoa thường)
- Kiểm tra file có trong thư mục `public/textures/` không
- Khởi động lại dev server

### Hành tinh vẫn là màu đơn sắc
- Mở Console (F12) xem có lỗi không
- Kiểm tra đường dẫn file trong `solarSystemData.js`
- Clear cache trình duyệt (Ctrl + Shift + Delete)

### Web chạy chậm sau khi thêm textures
- Giảm độ phân giải xuống 1K
- Giảm số lượng segments trong sphereGeometry (từ 64 xuống 32)
- Tối ưu hóa ảnh bằng tools như TinyPNG

## 📚 Tài nguyên thêm

- [Three.js Texture Documentation](https://threejs.org/docs/#api/en/textures/Texture)
- [React Three Fiber Examples](https://docs.pmnd.rs/react-three-fiber/getting-started/examples)
- [NASA Image Gallery](https://images.nasa.gov/)
