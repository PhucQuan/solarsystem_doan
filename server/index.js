// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import path from "path";
import { fetchNasaContext, getApodData } from "./nasaService.js";
import { fetchSolarData } from "./solarService.js";
import { fetchWikiSummary } from "./wikiService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Groq client
let groqClient = null;
if (GROQ_API_KEY) {
  groqClient = new Groq({ apiKey: GROQ_API_KEY });
}

// Load planets.json (bạn đã upload)
const PLANETS_PATH = "/mnt/data/planets.json";
let planetsData = [];

function tryLoad(path) {
  try {
    const raw = fs.readFileSync(path, "utf8");
    const data = JSON.parse(raw);
    console.log(`Loaded planets.json from ${path}:`, data.length);
    return data;
  } catch (err) {
    // console.error(`Không thể load ${path}:`, err.message);
    return null;
  }
}

planetsData = tryLoad(PLANETS_PATH) || tryLoad("./src/data/planets.json") || tryLoad("./data/planets.json") || [];

if (planetsData.length === 0) {
  console.warn("Warning: planets.json not found in /mnt/data or project data folders. RAG will be empty.");
}

// Tìm facts liên quan từ file planets.json
function retrieveContext(query, k = 3) {
  const q = query.toLowerCase();
  const scored = planetsData.map((p) => {
    const name = p.name?.toLowerCase() ?? "";
    const desc = p.description?.toLowerCase() ?? "";
    let score = 0;

    if (q.includes(name)) score += 10;

    const words = q.split(/\W+/).filter(Boolean);
    for (const w of words) {
      if (name.includes(w)) score += 3;
      if (desc.includes(w)) score += 1;
    }

    return { score, planet: p };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((s) => s.planet);
}

function buildPrompt(userMsg, contexts) {
  // If we have contexts, instruct the model to use those facts.
  if (contexts && contexts.length > 0) {
    const intro =
      `Bạn là SolarBot - trợ lý AI về vũ trụ và hệ Mặt Trời. ` +
      `Dưới đây là dữ liệu thực từ NASA, Wikipedia Tiếng Việt và Solar System OpenData. ` +
      `Hãy sử dụng những thông tin này để trả lời câu hỏi của người dùng một cách chi tiết và dễ hiểu, ưu tiên tiếng Việt. ` +
      `Nếu người dùng hỏi về thông tin không có trong dữ liệu (ví dụ: năm cụ thể khác), hãy giải thích rằng bạn chỉ có dữ liệu hiện tại từ NASA.`;

    const ctx = contexts
      .map((c, i) => `[Nguồn ${i + 1}] ${c.name}:\n${JSON.stringify(c, null, 2)}`)
      .join("\n\n");

    return `${intro}\n\n=== DỮ LIỆU TỪ NASA ===\n${ctx}\n\n=== CÂU HỎI ===\n${userMsg}\n\n=== TRẢ LỜI (bằng tiếng Việt, chi tiết và thân thiện) ===`;
  }

  // If no contexts, allow the model to answer from general knowledge but ask it to mention uncertainty.
  const fallbackIntro =
    `Bạn là SolarBot - trợ lý AI về vũ trụ và hệ Mặt Trời. ` +
    `Người dùng đã hỏi một câu hỏi nhưng không có dữ liệu từ NASA API. ` +
    `Hãy trả lời dựa trên kiến thức chung của bạn. Nếu không chắc chắn, hãy nói rõ.`;

  return `${fallbackIntro}\n\nCâu hỏi: ${userMsg}\n\nTrả lời bằng tiếng Việt:`;
}

// fetchNasaContext đã được import từ nasaService.js

// API endpoint chính
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Missing message" });

    // Lấy data từ NASA API dựa trên câu hỏi
    const nasaCtx = await fetchNasaContext(message);
    const contexts = nasaCtx || [];

    // Lấy data từ Solar System OpenData API (ưu tiên cho các câu hỏi về thông số hành tinh)
    const solarData = await fetchSolarData(message);
    if (solarData) {
      contexts.unshift({
        name: `Dữ liệu chi tiết về ${solarData.name}`,
        description: `Thông số vật lý và quỹ đạo:
      - Khối lượng: ${solarData.mass}
      - Trọng lực: ${solarData.gravity} m/s²
      - Bán kính trung bình: ${solarData.meanRadius} km
      - Nhiệt độ TB: ${solarData.avgTemp} K
      - Chu kỳ quỹ đạo: ${solarData.sideralOrbit} ngày
      - Số lượng mặt trăng: ${solarData.moons}
      - Phát hiện bởi: ${solarData.discoveredBy || "Không rõ"} (${solarData.discoveryDate || "Cổ đại"})
      `,
        source: "Solar System OpenData"
      });
    }

    // Lấy data từ Wikipedia VN (ưu tiên cho các câu hỏi định nghĩa, kiến thức chung)
    // Chỉ gọi Wiki nếu câu hỏi ngắn gọn (tên 1 khái niệm) hoặc hỏi "là gì", "nghĩa là gì"
    const isConceptQuestion = message.length < 50 || message.toLowerCase().includes("là gì") || message.toLowerCase().includes("ai là");

    if (isConceptQuestion) {
      const wikiData = await fetchWikiSummary(message);
      if (wikiData) {
        contexts.push({
          name: wikiData.title,
          description: wikiData.summary,
          source: "Wikipedia Tiếng Việt"
        });
      }
    }

    console.log('[Chat API] Contexts received:', contexts.length);
    if (contexts.length > 0) {
      console.log('[Chat API] First context:', contexts[0].name);
    }

    // Build prompt
    const prompt = buildPrompt(message, contexts);
    console.log('[Chat API] Prompt length:', prompt.length);

    // Only use Gemini to generate the answer (no Groq)
    try {
      const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

      const result = await model.generateContent(prompt);
      const reply = result.response.text();

      return res.json({
        reply,
        sources: contexts.map((c) => ({ name: c.name, source: c.source })),
      });
    } catch (innerErr) {
      console.error("Gemini API error:", innerErr.message || innerErr);
      // Fallback: build a simple RAG-based Vietnamese reply from contexts
      if (contexts.length > 0) {
        const lines = contexts.map((c) => `- ${c.name}: ${c.description || "Không có mô tả."}`);
        const reply = `Mình tìm được một số thông tin liên quan:\n${lines.join("\n")}\n\nNếu bạn muốn chi tiết hơn, mình có thể trả lời thêm dựa trên những nguồn trên.`;
        return res.json({ reply, sources: contexts.map((c) => ({ name: c.name })) });
      } else {
        return res.status(502).json({ error: "Gemini unavailable and no local context available." });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Danh sách chủ đề mặc định cho blog
const BLOG_TOPICS = [
  { term: "Vụ nổ Big Bang", category: "Science" },
  { term: "Hố đen", category: "Phenomena" },
  { term: "Hệ Mặt Trời", category: "Planets" },
  { term: "Sao chổi", category: "Phenomena" },
  { term: "Thiên hà", category: "Science" },
  { term: "Sao Hỏa", category: "Planets" },
  { term: "Mặt Trăng", category: "Planets" },
  { term: "Nhật thực", category: "Phenomena" }
];

// Cache simple: lưu kết quả blog để đỡ gọi nhiều
let blogCache = null;
let lastCacheTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 tiếng

app.get("/api/articles", async (req, res) => {
  try {
    const now = Date.now();
    if (blogCache && (now - lastCacheTime < CACHE_DURATION)) {
      return res.json(blogCache);
    }

    const articles = [];

    // 1. Lấy APOD (Ảnh thiên văn trong ngày)
    try {
      const apod = await getApodData(); // Lấy ảnh hôm nay
      if (apod && apod.length > 0) {
        articles.push({
          id: 'apod-' + now,
          title: apod[0].name, // Title từ NASA
          category: "Featured",
          date: new Date().toISOString().split('T')[0],
          readTime: "3 min read",
          image: apod[0].imageUrl,
          excerpt: apod[0].description.substring(0, 150) + "...",
          content: apod[0].description,
          source: "NASA APOD"
        });
      }
    } catch (e) {
      console.error("APOD Error", e);
    }

    // 2. Lấy bài từ Wikipedia
    // Để nhanh, ta lấy ngẫu nhiên 3-4 topics mỗi lần hoặc lấy hết (với promise.all)
    // Ở đây lấy hết nhưng giới hạn số lượng request đồng thời nếu cần
    const wikiPromises = BLOG_TOPICS.map(async (topic, index) => {
      const data = await fetchWikiSummary(topic.term);
      if (data) {
        return {
          id: 'wiki-' + index,
          title: data.title,
          category: topic.category,
          date: new Date().toISOString().split('T')[0],
          readTime: "5 min read",
          image: data.image || "/textures/default_space.jpg", // Fallback image
          excerpt: data.summary.substring(0, 120) + "...",
          content: data.summary + `\n\nNguồn: Wikipedia Tiếng Việt\nLink: ${data.url}`,
          source: "Wikipedia VN"
        };
      }
      return null;
    });

    const wikiArticles = (await Promise.all(wikiPromises)).filter(a => a !== null);
    articles.push(...wikiArticles);

    blogCache = articles;
    lastCacheTime = now;

    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

// API endpoint for planet details (used by 3D Explorer)
app.get("/api/planet/:name", async (req, res) => {
  try {
    const planetName = req.params.name;
    console.log(`[API] Fetching planet data for: ${planetName}`);

    const planetData = await fetchSolarData(planetName);

    if (!planetData) {
      return res.status(404).json({ error: "Planet not found" });
    }

    res.json(planetData);
  } catch (err) {
    console.error("[API] Planet fetch error:", err);
    res.status(500).json({ error: "Failed to fetch planet data" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
