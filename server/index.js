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
import ragService from "./ragService.js";
import { analytics } from "./analytics.js";
import { conversationHandler } from "./conversationHandler.js";
import { intelligentGenerator } from "./intelligentGenerator.js";
import { conversationMemory } from "./conversationMemory.js";
import { responseCache } from "./responseCache.js";
import { rateLimiter } from "./rateLimiter.js";
import { vietnameseNLP } from "./vietnameseNLP.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Apply rate limiting middleware
app.use(rateLimiter.middleware());

// Initialize RAG service
ragService.initialize().catch(err => {
  console.error('[Server] RAG initialization error:', err);
});

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

// API endpoint chính - Enhanced RAG
app.post("/api/chat", async (req, res) => {
  const startTime = Date.now();
  let success = true;
  let method = 'unknown';
  let contextsUsed = 0;
  
  try {
    const { message, sessionId: clientSessionId } = req.body;
    if (!message) return res.status(400).json({ error: "Missing message" });

    console.log('[Chat API] Processing message:', message);

    // Generate session ID
    const sessionId = clientSessionId || conversationMemory.getSessionId(req);

    // STEP 1: Check cache first
    const cachedResponse = responseCache.get(message);
    if (cachedResponse) {
      console.log('[Chat API] Cache HIT - returning cached response');
      
      // Track analytics for cached response
      const responseTime = Date.now() - startTime;
      analytics.trackQuery(message, responseTime, cachedResponse.method, cachedResponse.contextsUsed, true);
      
      return res.json({
        ...cachedResponse,
        sessionId,
        responseTime
      });
    }

    // STEP 2: Resolve references using conversation memory
    const { resolvedMessage, referencedEntity } = conversationMemory.resolveReferences(sessionId, message);
    const queryToProcess = resolvedMessage;
    
    if (referencedEntity) {
      console.log(`[Chat API] Resolved reference: "${message}" → "${resolvedMessage}" (entity: ${referencedEntity})`);
    }

    // STEP 3: Check for casual conversation first
    if (conversationHandler.isCasualConversation(queryToProcess)) {
      console.log('[Chat API] Detected casual conversation');
      const casualResponse = conversationHandler.handleCasualConversation(queryToProcess);
      
      // Add to conversation memory
      conversationMemory.addToHistory(sessionId, message, casualResponse, []);
      
      // Track analytics
      const responseTime = Date.now() - startTime;
      analytics.trackQuery(message, responseTime, casualResponse.method, 0, true);
      
      return res.json({
        reply: casualResponse.reply,
        sources: casualResponse.sources,
        method: casualResponse.method,
        contextsUsed: 0,
        category: casualResponse.category,
        sessionId,
        responseTime,
        referencedEntity
      });
    }

    // STEP 4: Enhanced query processing with Vietnamese NLP
    const nlpStats = vietnameseNLP.getTokenizationStats(queryToProcess);
    const entities = vietnameseNLP.extractEntities(queryToProcess);
    const intentDetection = vietnameseNLP.detectIntent(queryToProcess);
    
    console.log(`[Chat API] NLP Analysis - Intent: ${intentDetection.intent}, Entities: ${Object.values(entities).flat().length}`);

    // STEP 5: Use local RAG service for semantic search
    const ragResults = await ragService.query(queryToProcess);
    let contexts = ragResults.contexts || [];
    console.log('[Chat API] Local RAG found', contexts.length, 'contexts');

    // STEP 6: Enhance with NASA API data
    try {
      const nasaCtx = await fetchNasaContext(queryToProcess);
      if (nasaCtx && nasaCtx.length > 0) {
        console.log('[Chat API] NASA API found', nasaCtx.length, 'additional contexts');
        contexts.push(...nasaCtx);
      }
    } catch (err) {
      console.warn('[Chat API] NASA API error (continuing with RAG):', err.message);
    }

    // STEP 7: Try Solar System OpenData API
    try {
      const solarData = await fetchSolarData(queryToProcess);
      if (solarData) {
        console.log('[Chat API] Solar System API found data for', solarData.name);
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
    } catch (err) {
      console.warn('[Chat API] Solar System API error (continuing with RAG):', err.message);
    }

    // STEP 8: Try Wikipedia for concept questions
    const isConceptQuestion = intentDetection.intent === 'what' || 
                              queryToProcess.length < 50 || 
                              queryToProcess.toLowerCase().includes("là gì") || 
                              queryToProcess.toLowerCase().includes("ai là");

    if (isConceptQuestion && contexts.length < 3) {
      try {
        const wikiData = await fetchWikiSummary(queryToProcess);
        if (wikiData) {
          console.log('[Chat API] Wikipedia found:', wikiData.title);
          contexts.push({
            name: wikiData.title,
            description: wikiData.summary,
            source: "Wikipedia Tiếng Việt"
          });
        }
      } catch (err) {
        console.warn('[Chat API] Wikipedia error (continuing with RAG):', err.message);
      }
    }

    console.log('[Chat API] Total contexts collected:', contexts.length);
    contextsUsed = contexts.length;

    // STEP 9: Generate response with multiple fallback strategies
    let reply = null;
    let generationMethod = 'unknown';
    let responseData = null;

    // Strategy 1: Try Gemini API first
    try {
      const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
      
      // Build context-aware prompt using conversation memory
      const basePrompt = buildPrompt(queryToProcess, contexts);
      const contextualPrompt = conversationMemory.buildContextualPrompt(basePrompt, sessionId, queryToProcess);

      const result = await model.generateContent(contextualPrompt);
      reply = result.response.text();
      generationMethod = 'gemini_api_contextual';
      method = generationMethod;
      console.log('[Chat API] Response generated via Gemini API with conversation context');
      
    } catch (geminiErr) {
      console.error("[Chat API] Gemini API error:", geminiErr.message);
      
      // Strategy 2: Use Intelligent Generator (Enhanced with NLP)
      if (contexts.length > 0) {
        console.log('[Chat API] Using Enhanced Intelligent Generator');
        const intelligentResponse = intelligentGenerator.generateResponse(queryToProcess, contexts);
        
        // Enhance with NLP insights
        intelligentResponse.nlpInsights = {
          intent: intentDetection.intent,
          confidence: intentDetection.confidence,
          entities: entities,
          tokenStats: nlpStats
        };
        
        reply = intelligentResponse.reply;
        generationMethod = intelligentResponse.method + '_enhanced';
        method = generationMethod;
        responseData = intelligentResponse;
        console.log('[Chat API] Generated enhanced intelligent response with intent:', intentDetection.intent);
        
      } else {
        // Strategy 3: Use Intelligent Generator for no-context scenarios
        console.log('[Chat API] Using Intelligent Generator (no context)');
        const noContextResponse = intelligentGenerator.generateNoContextResponse(queryToProcess);
        reply = noContextResponse.reply;
        generationMethod = noContextResponse.method;
        method = generationMethod;
        responseData = noContextResponse;
      }
    }

    // Final fallback if everything fails
    if (!reply) {
      reply = "Xin lỗi, mình đang gặp sự cố kỹ thuật. Vui lòng thử lại sau hoặc hỏi một câu hỏi khác về hệ Mặt Trời! 🤖💫";
      generationMethod = 'final_fallback';
      method = generationMethod;
      success = false;
    }

    // STEP 10: Prepare final response
    const finalResponse = {
      reply,
      sources: contexts.map((c) => ({ name: c.name, source: c.source })),
      method: generationMethod,
      contextsUsed: contexts.length,
      sessionId,
      responseTime: Date.now() - startTime,
      referencedEntity,
      nlpInsights: responseData?.nlpInsights || {
        intent: intentDetection.intent,
        confidence: intentDetection.confidence,
        entities: entities
      }
    };

    // STEP 11: Cache the response (if successful)
    if (success && generationMethod !== 'casual_conversation') {
      responseCache.set(message, contexts, finalResponse);
    }

    // STEP 12: Add to conversation memory
    conversationMemory.addToHistory(sessionId, message, finalResponse, contexts);

    // STEP 13: Track analytics
    analytics.trackQuery(message, finalResponse.responseTime, method, contextsUsed, success);

    return res.json(finalResponse);
    
  } catch (err) {
    console.error('[Chat API] Server error:', err);
    
    // Track error
    const responseTime = Date.now() - startTime;
    analytics.trackQuery(message || 'unknown', responseTime, 'server_error', 0, false);
    
    res.status(500).json({ 
      error: "Server error", 
      details: err.message,
      responseTime
    });
  }
});

// Analytics endpoint
app.get("/api/analytics", (req, res) => {
  try {
    const stats = analytics.getStats();
    res.json(stats);
  } catch (err) {
    console.error('[Analytics API] Error:', err);
    res.status(500).json({ error: "Analytics error" });
  }
});

// Recent queries endpoint  
app.get("/api/analytics/queries", (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const queries = analytics.getRecentQueries(limit);
    res.json(queries);
  } catch (err) {
    console.error('[Analytics API] Error:', err);
    res.status(500).json({ error: "Analytics error" });
  }
});

// Cache statistics endpoint
app.get("/api/cache/stats", (req, res) => {
  try {
    const stats = responseCache.getStats();
    res.json(stats);
  } catch (err) {
    console.error('[Cache API] Error:', err);
    res.status(500).json({ error: "Cache error" });
  }
});

// Cache entries endpoint (for debugging)
app.get("/api/cache/entries", (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const entries = responseCache.getEntries(limit);
    res.json(entries);
  } catch (err) {
    console.error('[Cache API] Error:', err);
    res.status(500).json({ error: "Cache error" });
  }
});

// Clear cache endpoint (admin only)
app.post("/api/cache/clear", (req, res) => {
  try {
    responseCache.clear();
    res.json({ message: "Cache cleared successfully" });
  } catch (err) {
    console.error('[Cache API] Error:', err);
    res.status(500).json({ error: "Cache error" });
  }
});

// Rate limiter statistics endpoint
app.get("/api/ratelimit/stats", (req, res) => {
  try {
    const stats = rateLimiter.getStats();
    res.json(stats);
  } catch (err) {
    console.error('[RateLimit API] Error:', err);
    res.status(500).json({ error: "Rate limit error" });
  }
});

// Conversation memory statistics endpoint
app.get("/api/memory/stats", (req, res) => {
  try {
    const stats = conversationMemory.getAllSessionsStats();
    res.json(stats);
  } catch (err) {
    console.error('[Memory API] Error:', err);
    res.status(500).json({ error: "Memory error" });
  }
});

// Session status endpoint
app.get("/api/memory/session", (req, res) => {
  try {
    const sessionId = conversationMemory.getSessionId(req);
    const stats = conversationMemory.getSessionStats(sessionId);
    const context = conversationMemory.getConversationContext(sessionId);
    
    res.json({
      sessionId,
      stats,
      context
    });
  } catch (err) {
    console.error('[Memory API] Error:', err);
    res.status(500).json({ error: "Memory error" });
  }
});

// Vietnamese NLP test endpoint
app.post("/api/nlp/analyze", (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Missing text" });
    
    const stats = vietnameseNLP.getTokenizationStats(text);
    const entities = vietnameseNLP.extractEntities(text);
    const intent = vietnameseNLP.detectIntent(text);
    
    res.json({
      text,
      tokenization: stats,
      entities,
      intent
    });
  } catch (err) {
    console.error('[NLP API] Error:', err);
    res.status(500).json({ error: "NLP error" });
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
