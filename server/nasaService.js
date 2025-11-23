// NASA Data Service for Chatbot RAG
import dotenv from "dotenv";
dotenv.config();

const NASA_API_KEY = process.env.VITE_NASA_API_KEY || "DEMO_KEY";
const NASA_BASE = "https://api.nasa.gov";

// Fetch NASA data với retry logic
async function nasaFetch(url, params = {}, retries = 2) {
  const urlObj = new URL(url);
  urlObj.searchParams.set("api_key", NASA_API_KEY);
  
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      urlObj.searchParams.set(k, String(v));
    }
  });

  let attempt = 0;
  while (attempt <= retries) {
    try {
      const response = await fetch(urlObj.toString(), { 
        signal: AbortSignal.timeout(10000) 
      });
      
      if (!response.ok) {
        if ([502, 503, 504].includes(response.status) && attempt < retries) {
          attempt++;
          await new Promise(r => setTimeout(r, 1000 * attempt));
          continue;
        }
        throw new Error(`NASA API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      if (attempt < retries) {
        attempt++;
        await new Promise(r => setTimeout(r, 1000 * attempt));
        continue;
      }
      throw err;
    }
  }
}

// Lấy thông tin thiên thạch gần Trái Đất
export async function getNeoData(query) {
  try {
    const today = new Date().toISOString().split('T')[0];
    console.log('[NASA NEO] Fetching data for:', today);
    
    const data = await nasaFetch(
      `${NASA_BASE}/neo/rest/v1/feed`,
      { start_date: today, end_date: today }
    );
    
    const contexts = [];
    const neos = data.near_earth_objects?.[today] || [];
    console.log('[NASA NEO] Found', neos.length, 'asteroids');
    
    if (neos.length === 0) {
      // Nếu không có hôm nay, lấy 7 ngày gần đây
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const weekData = await nasaFetch(
        `${NASA_BASE}/neo/rest/v1/feed`,
        { start_date: weekAgo, end_date: today }
      );
      
      // Lấy tất cả NEO trong tuần
      const allNeos = [];
      for (const date in weekData.near_earth_objects) {
        allNeos.push(...weekData.near_earth_objects[date]);
      }
      
      console.log('[NASA NEO] Found', allNeos.length, 'asteroids in last 7 days');
      
      for (const neo of allNeos.slice(0, 5)) {
        const approach = neo.close_approach_data?.[0];
        contexts.push({
          name: neo.name,
          description: `Thiên thạch ${neo.name} có đường kính khoảng ${Math.round(neo.estimated_diameter?.meters?.estimated_diameter_max || 0)}m, ` +
            `${neo.is_potentially_hazardous_asteroid ? 'có khả năng nguy hiểm' : 'không nguy hiểm'}, ` +
            `bay qua Trái Đất với vận tốc ${Math.round(approach?.relative_velocity?.kilometers_per_hour || 0)} km/h ` +
            `vào khoảng cách ${Math.round(approach?.miss_distance?.kilometers || 0)} km vào ngày ${approach?.close_approach_date || 'không rõ'}.`,
          source: 'NASA NEO'
        });
      }
    } else {
      for (const neo of neos.slice(0, 5)) {
        const approach = neo.close_approach_data?.[0];
        contexts.push({
          name: neo.name,
          description: `Thiên thạch ${neo.name} có đường kính khoảng ${Math.round(neo.estimated_diameter?.meters?.estimated_diameter_max || 0)}m, ` +
            `${neo.is_potentially_hazardous_asteroid ? 'có khả năng nguy hiểm' : 'không nguy hiểm'}, ` +
            `bay qua Trái Đất với vận tốc ${Math.round(approach?.relative_velocity?.kilometers_per_hour || 0)} km/h ` +
            `vào khoảng cách ${Math.round(approach?.miss_distance?.kilometers || 0)} km hôm nay.`,
          source: 'NASA NEO'
        });
      }
    }
    
    console.log('[NASA NEO] Returning', contexts.length, 'contexts');
    return contexts;
  } catch (err) {
    console.error('[NASA NEO] Error:', err.message);
    return [];
  }
}

// Lấy ảnh từ Mars Rover
export async function getMarsPhotos(query) {
  try {
    // Xác định rover từ query
    let rover = 'curiosity';
    if (query.toLowerCase().includes('perseverance')) rover = 'perseverance';
    if (query.toLowerCase().includes('opportunity')) rover = 'opportunity';
    if (query.toLowerCase().includes('spirit')) rover = 'spirit';
    
    const data = await nasaFetch(
      `${NASA_BASE}/mars-photos/api/v1/rovers/${rover}/photos`,
      { sol: 1000, page: 1 }
    );
    
    const contexts = [];
    const photos = data.photos || [];
    
    for (const photo of photos.slice(0, 3)) {
      contexts.push({
        name: `Ảnh từ ${rover} - ${photo.camera.full_name}`,
        description: `Ảnh chụp bởi camera ${photo.camera.full_name} trên sao Hỏa vào ngày ${photo.earth_date}, sol ${photo.sol}. URL: ${photo.img_src}`,
        imageUrl: photo.img_src,
        source: 'NASA Mars Rover'
      });
    }
    
    return contexts;
  } catch (err) {
    console.error('getMarsPhotos error:', err.message);
    return [];
  }
}

// Lấy Astronomy Picture of the Day
export async function getApodData(date) {
  try {
    const params = {};
    if (date) params.date = date;
    
    const data = await nasaFetch(`${NASA_BASE}/planetary/apod`, params);
    
    return [{
      name: data.title,
      description: `${data.explanation} (Ngày: ${data.date})`,
      imageUrl: data.url,
      source: 'NASA APOD'
    }];
  } catch (err) {
    console.error('getApodData error:', err.message);
    return [];
  }
}

// Lấy thông tin Space Weather (DONKI)
export async function getSpaceWeather(query) {
  try {
    const end = new Date().toISOString().split('T')[0];
    const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const data = await nasaFetch(
      `${NASA_BASE}/DONKI/FLR`,
      { startDate: start, endDate: end }
    );
    
    const contexts = [];
    const flares = data || [];
    
    for (const flare of flares.slice(0, 3)) {
      contexts.push({
        name: `Solar Flare ${flare.flrID}`,
        description: `Bùng phát mặt trời cấp độ ${flare.classType} xảy ra vào ${flare.beginTime}, ` +
          `đỉnh điểm lúc ${flare.peakTime}, kết thúc ${flare.endTime}. ` +
          `Vị trí: ${flare.sourceLocation || 'không xác định'}.`,
        source: 'NASA DONKI'
      });
    }
    
    return contexts;
  } catch (err) {
    console.error('getSpaceWeather error:', err.message);
    return [];
  }
}

// Tìm kiếm ảnh NASA
export async function searchNasaImages(query, limit = 3) {
  try {
    const encoded = encodeURIComponent(query);
    const response = await fetch(
      `https://images-api.nasa.gov/search?q=${encoded}&media_type=image`,
      { signal: AbortSignal.timeout(8000) }
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    const items = data.collection?.items || [];
    const contexts = [];
    
    for (const item of items.slice(0, limit)) {
      const d = item.data?.[0];
      if (!d) continue;
      
      contexts.push({
        name: d.title || 'NASA Image',
        description: d.description || 'Không có mô tả',
        imageUrl: item.links?.[0]?.href,
        source: 'NASA Images'
      });
    }
    
    return contexts;
  } catch (err) {
    console.error('searchNasaImages error:', err.message);
    return [];
  }
}

// Hàm chính: lấy context từ NASA dựa trên query
export async function fetchNasaContext(query) {
  const q = query.toLowerCase();
  const contexts = [];
  
  console.log('[NASA Service] Query:', query);
  
  // Xác định loại data cần lấy dựa trên keywords
  if (q.includes('thiên thạch') || q.includes('asteroid') || q.includes('neo') || q.includes('tiểu hành tinh')) {
    console.log('[NASA Service] Fetching NEO data...');
    const neoData = await getNeoData(query);
    contexts.push(...neoData);
  }
  
  if (q.includes('sao hỏa') || q.includes('mars') || q.includes('rover') || q.includes('hỏa tinh')) {
    console.log('[NASA Service] Fetching Mars data...');
    const marsData = await getMarsPhotos(query);
    contexts.push(...marsData);
  }
  
  if (q.includes('ảnh hôm nay') || q.includes('apod') || q.includes('astronomy picture') || q.includes('ảnh thiên văn')) {
    console.log('[NASA Service] Fetching APOD data...');
    const apodData = await getApodData();
    contexts.push(...apodData);
  }
  
  if (q.includes('bão') || q.includes('mặt trời') || q.includes('solar') || q.includes('space weather') || q.includes('flare')) {
    console.log('[NASA Service] Fetching space weather data...');
    const weatherData = await getSpaceWeather(query);
    contexts.push(...weatherData);
  }
  
  // Nếu không match keyword cụ thể, tìm kiếm ảnh chung
  if (contexts.length === 0) {
    console.log('[NASA Service] No specific match, searching images...');
    const imageData = await searchNasaImages(query, 5);
    contexts.push(...imageData);
  }
  
  console.log('[NASA Service] Total contexts:', contexts.length);
  return contexts;
}
