# Hướng dẫn NASA API Integration

## API Key đã cấu hình
API Key của bạn: `FI14Cor4vnM9HiYN27o9Xew8QzyoAe0nFmfvG54O`

Đã được lưu trong file `.env`:
```
VITE_NASA_API_KEY=FI14Cor4vnM9HiYN27o9Xew8QzyoAe0nFmfvG54O
```

## Các NASA API đã tích hợp

### 1. **APOD** - Astronomy Picture of the Day
Lấy ảnh thiên văn của ngày
- File: `src/services/nasa/apod.js`
- Ví dụ: "Cho mình xem ảnh hôm nay", "APOD"

### 2. **NEO** - Near Earth Objects
Thông tin về thiên thạch gần Trái Đất
- File: `src/services/nasa/neo.js`
- Ví dụ: "Có thiên thạch nào bay qua Trái Đất không?", "Asteroid hôm nay"

### 3. **Mars Rover Photos**
Ảnh từ các tàu thám hiểm sao Hỏa
- File: `src/services/nasa/mars.js`
- Ví dụ: "Ảnh từ Curiosity", "Mars rover Perseverance"

### 4. **Earth Imagery**
Ảnh vệ tinh Trái Đất
- File: `src/services/nasa/earth.js`
- Cần tọa độ lat/lon

### 5. **DONKI** - Space Weather
Thông tin về thời tiết vũ trụ, bão mặt trời
- File: `src/services/nasa/donki.js`
- Ví dụ: "Bão mặt trời", "Solar flare", "Space weather"

### 6. **NASA Images Search**
Tìm kiếm ảnh trong thư viện NASA
- Tự động kích hoạt khi không match keyword cụ thể
- Ví dụ: "Hình ảnh về sao Thổ", "Nebula"

## Cách hoạt động

### Server Side (`server/nasaService.js`)
1. Nhận câu hỏi từ user
2. Phân tích keywords để xác định loại data cần lấy
3. Gọi NASA API tương ứng
4. Trả về contexts cho Gemini AI

### Client Side (`src/services/nasa/`)
Các service có thể gọi trực tiếp từ React components:

```javascript
import { fetchApod } from './services/nasa/apod';
import { fetchNeoFeed } from './services/nasa/neo';
import { fetchMarsPhotos } from './services/nasa/mars';

// Lấy APOD
const apod = await fetchApod();

// Lấy thiên thạch hôm nay
const neos = await fetchNeoFeed();

// Lấy ảnh Mars
const photos = await fetchMarsPhotos({ rover: 'curiosity', sol: 1000 });
```

## Chatbot Integration

Chatbot tự động:
1. Gửi câu hỏi đến server
2. Server lấy data từ NASA API
3. Gemini AI xử lý và tạo câu trả lời bằng tiếng Việt
4. Hiển thị nguồn data (sources) bên dưới câu trả lời

## Ví dụ câu hỏi

- "Có thiên thạch nào bay qua Trái Đất hôm nay không?"
- "Cho mình xem ảnh từ Curiosity trên sao Hỏa"
- "Ảnh thiên văn hôm nay là gì?"
- "Có bão mặt trời nào gần đây không?"
- "Tìm ảnh về Hubble telescope"

## Khởi động

```bash
# Cài đặt dependencies
npm install

# Chạy dev server (Vite)
npm run dev

# Chạy backend server (trong terminal khác)
node server/index.js
```

Backend chạy trên: http://localhost:3001
Frontend chạy trên: http://localhost:5173
