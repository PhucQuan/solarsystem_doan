// RAG Service - Enhanced Retrieval-Augmented Generation
// This service provides local RAG capabilities without relying solely on API calls

import fs from 'fs';
import path from 'path';

class RAGService {
  constructor() {
    this.documents = [];
    this.embeddings = null;
    this.vocabulary = new Map();
    this.idfScores = new Map();
    this.initialized = false;
    
    // Configuration constants for RAG behavior
    // SIMILARITY_THRESHOLD: Minimum cosine similarity score (0-1) for a document to be considered relevant
    // Lower values = more permissive (more results), Higher values = more strict (fewer, more relevant results)
    // 0.01 is deliberately low to ensure we don't miss relevant documents, especially with TF-IDF which can have low scores
    // For production, consider tuning this value based on your specific use case (typically 0.1-0.3 for stricter matching)
    this.SIMILARITY_THRESHOLD = 0.01;
    
    // DEFAULT_TOP_K: Default number of most relevant documents to retrieve
    // Can be overridden per query for flexibility
    this.DEFAULT_TOP_K = 5;
    
    // Vietnamese character regex for tokenization - includes all diacritics
    this.VIETNAMESE_CHARS = 'àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ';
  }

  // Initialize the RAG system with local data
  async initialize() {
    if (this.initialized) return;

    try {
      // Load planets data
      const planetsPath = './src/data/planets.json';
      if (fs.existsSync(planetsPath)) {
        const planetsData = JSON.parse(fs.readFileSync(planetsPath, 'utf8'));
        
        // Create documents from planets data
        planetsData.forEach(planet => {
          this.documents.push({
            id: `planet_${planet.id}`,
            type: 'planet',
            name: planet.name,
            nameVi: this.getPlanetNameVi(planet.name),
            text: this.createPlanetText(planet),
            data: planet
          });
        });
      }

      // Create additional knowledge base documents
      this.addKnowledgeBaseDocuments();

      // Build TF-IDF index
      this.buildTFIDFIndex();

      this.initialized = true;
      console.log(`[RAG Service] Initialized with ${this.documents.length} documents`);
    } catch (error) {
      console.error('[RAG Service] Initialization error:', error);
    }
  }

  // Convert planet data to searchable text
  createPlanetText(planet) {
    const nameVi = this.getPlanetNameVi(planet.name);
    return `
      ${planet.name} ${nameVi}
      Loại: ${planet.type}
      Đường kính: ${planet.diameter}
      Nhiệt độ: ${planet.temperature}
      Số mặt trăng: ${planet.moons}
      Trọng lực: ${planet.gravity}
      Độ dài ngày: ${planet.dayLength}
      Khoảng cách: ${planet.distance}
      Mô tả: ${planet.description}
    `.toLowerCase();
  }

  // Map English planet names to Vietnamese
  getPlanetNameVi(name) {
    const mapping = {
      'Mercury': 'Sao Thủy',
      'Venus': 'Sao Kim',
      'Earth': 'Trái Đất',
      'Mars': 'Sao Hỏa',
      'Jupiter': 'Sao Mộc',
      'Saturn': 'Sao Thổ',
      'Uranus': 'Sao Thiên Vương',
      'Neptune': 'Sao Hải Vương'
    };
    return mapping[name] || name;
  }

  // Add general knowledge base documents
  addKnowledgeBaseDocuments() {
    const knowledgeBase = [
      {
        id: 'solar_system',
        type: 'concept',
        name: 'Hệ Mặt Trời',
        text: `
          hệ mặt trời solar system bao gồm mặt trời và tất cả các thiên thể
          quay quanh nó gồm 8 hành tinh thiên thạch sao chổi tiểu hành tinh
          hệ mặt trời được hình thành cách đây khoảng 4.6 tỷ năm
          thủy kim địa hỏa mộc thổ thiên vương hải vương
        `,
        data: {
          description: 'Hệ Mặt Trời bao gồm Mặt Trời và tất cả các thiên thể quay quanh nó, gồm 8 hành tinh: Sao Thủy, Sao Kim, Trái Đất, Sao Hỏa, Sao Mộc, Sao Thổ, Sao Thiên Vương và Sao Hải Vương. Hệ Mặt Trời được hình thành cách đây khoảng 4.6 tỷ năm từ một đám mây khí và bụi vũ trụ.'
        }
      },
      {
        id: 'sun',
        type: 'concept',
        name: 'Mặt Trời',
        text: `
          mặt trời sun sao ngôi sao trung tâm hệ mặt trời
          là quả cầu khí nóng plasma năng lượng hạt nhân
          nhiệt độ bề mặt 5500 độ lõi 15 triệu độ
          ánh sáng mặt trời mất 8 phút đến trái đất
        `,
        data: {
          description: 'Mặt Trời là ngôi sao ở trung tâm Hệ Mặt Trời, là nguồn năng lượng chính cho Trái Đất. Mặt Trời là một quả cầu khí nóng gồm chủ yếu hydro và heli, với nhiệt độ bề mặt khoảng 5,500°C và lõi đạt 15 triệu°C. Ánh sáng từ Mặt Trời mất khoảng 8 phút để đến Trái Đất.'
        }
      },
      {
        id: 'moon',
        type: 'concept',
        name: 'Mặt Trăng',
        text: `
          mặt trăng moon vệ tinh tự nhiên trái đất
          quay quanh trái đất ảnh hưởng thủy triều
          có bề mặt đầy hố va đập thiên thạch
          con người đã đặt chân lên năm 1969 apollo 11
        `,
        data: {
          description: 'Mặt Trăng là vệ tinh tự nhiên duy nhất của Trái Đất. Nó quay quanh Trái Đất và ảnh hưởng đến thủy triều trên các đại dương. Bề mặt Mặt Trăng đầy các hố va đập do thiên thạch tạo ra. Con người đã đặt chân lên Mặt Trăng lần đầu tiên vào năm 1969 trong sứ mệnh Apollo 11.'
        }
      },
      {
        id: 'asteroid',
        type: 'concept',
        name: 'Thiên thạch',
        text: `
          thiên thạch asteroid tiểu hành tinh là các khối đá kim loại
          trong vũ trụ nhỏ hơn hành tinh chủ yếu nằm trong vành đai
          giữa sao hỏa và sao mộc sao băng meteorite
        `,
        data: {
          description: 'Thiên thạch (asteroid/tiểu hành tinh) là các khối đá và kim loại trong vũ trụ, nhỏ hơn hành tinh. Phần lớn thiên thạch nằm trong vành đai thiên thạch giữa Sao Hỏa và Sao Mộc. Khi thiên thạch đi vào khí quyển Trái Đất và cháy sáng, ta gọi là sao băng.'
        }
      },
      {
        id: 'comet',
        type: 'concept',
        name: 'Sao chổi',
        text: `
          sao chổi comet là các khối băng đá bụi bay quanh mặt trời
          khi đến gần mặt trời băng bay hơi tạo đuôi sáng dài
          halley sao chổi nổi tiếng xuất hiện 76 năm một lần
        `,
        data: {
          description: 'Sao chổi là các khối băng, đá và bụi bay quanh Mặt Trời theo quỹ đạo elip. Khi đến gần Mặt Trời, băng trên bề mặt sao chổi bay hơi, tạo thành đuôi sáng dài đặc trưng. Sao chổi Halley là sao chổi nổi tiếng nhất, xuất hiện khoảng 76 năm một lần.'
        }
      },
      {
        id: 'black_hole',
        type: 'concept',
        name: 'Hố đen',
        text: `
          hố đen black hole là vùng không gian có lực hấp dẫn cực mạnh
          không gì có thể thoát ra kể cả ánh sáng hình thành từ
          sao lớn sụp đổ chân trời sự kiện event horizon
        `,
        data: {
          description: 'Hố đen là vùng không gian có lực hấp dẫn cực mạnh, không gì có thể thoát ra, kể cả ánh sáng. Hố đen hình thành khi một ngôi sao rất lớn sụp đổ vào cuối vòng đời của nó. Ranh giới của hố đen gọi là "chân trời sự kiện" (event horizon).'
        }
      },
      {
        id: 'galaxy',
        type: 'concept',
        name: 'Thiên hà',
        text: `
          thiên hà galaxy là hệ thống khổng lồ gồm hàng tỷ ngôi sao
          hành tinh khí và bụi vũ trụ trái đất thuộc thiên hà ngân hà
          milky way xoắn ốc spiral hình elip elliptical bất thường irregular
        `,
        data: {
          description: 'Thiên hà là hệ thống khổng lồ gồm hàng tỷ ngôi sao, hành tinh, khí và bụi vũ trụ, được liên kết với nhau bởi lực hấp dẫn. Trái Đất thuộc thiên hà Ngân Hà (Milky Way), một thiên hà xoắn ốc có khoảng 200-400 tỷ ngôi sao. Thiên hà có nhiều dạng: xoắn ốc, elip, và bất thường.'
        }
      },
      {
        id: 'orbit',
        type: 'concept',
        name: 'Quỹ đạo',
        text: `
          quỹ đạo orbit là đường đi của thiên thể quanh vật thể khác
          hành tinh quay quanh mặt trời theo quỹ đạo elip
          lực hấp dẫn giữ thiên thể trên quỹ đạo chu kỳ
        `,
        data: {
          description: 'Quỹ đạo là đường đi của một thiên thể khi nó di chuyển quanh một thiên thể khác. Các hành tinh quay quanh Mặt Trời theo quỹ đạo hình elip. Lực hấp dẫn giữ các thiên thể trên quỹ đạo của chúng. Chu kỳ quỹ đạo là thời gian để hoàn thành một vòng quay.'
        }
      },
      {
        id: 'eclipse',
        type: 'concept',
        name: 'Nhật thực và Nguyệt thực',
        text: `
          nhật thực solar eclipse là hiện tượng mặt trăng che mặt trời
          nguyệt thực lunar eclipse là trái đất che mặt trăng
          toàn phần partial nhật thực vành khuyên annular
        `,
        data: {
          description: 'Nhật thực xảy ra khi Mặt Trăng đi vào giữa Trái Đất và Mặt Trời, che khuất Mặt Trời. Nguyệt thực xảy ra khi Trái Đất đi vào giữa Mặt Trời và Mặt Trăng, che khuất Mặt Trăng. Nhật thực có thể là toàn phần (total), một phần (partial), hoặc vành khuyên (annular).'
        }
      },
      {
        id: 'gravity',
        type: 'concept',
        name: 'Lực hấp dẫn',
        text: `
          lực hấp dẫn gravity là lực hút giữa các vật thể có khối lượng
          newton einstein tương đối rộng general relativity
          giữ hành tinh quay quanh mặt trời và chúng ta trên trái đất
        `,
        data: {
          description: 'Lực hấp dẫn là lực hút giữa các vật thể có khối lượng. Newton đã phát hiện ra định luật vạn vật hấp dẫn, sau đó Einstein mô tả chi tiết hơn qua thuyết tương đối rộng. Lực hấp dẫn giữ các hành tinh quay quanh Mặt Trời và giữ chúng ta trên bề mặt Trái Đất.'
        }
      }
    ];

    this.documents.push(...knowledgeBase);
  }

  // Build TF-IDF index for semantic search
  buildTFIDFIndex() {
    // Tokenize all documents and build vocabulary
    const docTermFreq = [];

    this.documents.forEach(doc => {
      const terms = this.tokenize(doc.text);
      const termFreq = new Map();

      terms.forEach(term => {
        termFreq.set(term, (termFreq.get(term) || 0) + 1);
        if (!this.vocabulary.has(term)) {
          this.vocabulary.set(term, this.vocabulary.size);
        }
      });

      docTermFreq.push(termFreq);
    });

    // Calculate IDF scores
    this.vocabulary.forEach((_, term) => {
      const docCount = docTermFreq.filter(tf => tf.has(term)).length;
      // IDF formula: log(N / df) where N is total docs, df is document frequency
      // Guard against division by zero (though shouldn't happen in practice)
      const idf = docCount > 0 ? Math.log(this.documents.length / docCount) : 0;
      this.idfScores.set(term, idf);
    });

    // Store TF-IDF vectors
    this.embeddings = docTermFreq.map(tf => {
      const vector = new Map();
      tf.forEach((freq, term) => {
        const tfidf = freq * this.idfScores.get(term);
        vector.set(term, tfidf);
      });
      return vector;
    });
  }

  // Tokenize text into terms
  tokenize(text) {
    const normalized = text.toLowerCase().trim();
    
    // Get Vietnamese tokens
    const vietnameseTokens = this._tokenizeVietnamese(normalized);
    
    // Get ASCII tokens for better matching
    const asciiTokens = this._tokenizeAscii(normalized);
    
    // Combine both versions and deduplicate
    return [...new Set([...vietnameseTokens, ...asciiTokens])];
  }

  // Tokenize Vietnamese text preserving diacritics
  _tokenizeVietnamese(text) {
    return text
      .replace(new RegExp(`[^\\w\\s${this.VIETNAMESE_CHARS}]`, 'g'), ' ')
      .split(/\s+/)
      .filter(term => term.length > 1);
  }

  // Tokenize with ASCII normalization
  _tokenizeAscii(text) {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/đ/g, 'd')
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(term => term.length > 1);
  }

  // Calculate cosine similarity between two vectors
  cosineSimilarity(vec1, vec2) {
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    const allTerms = new Set([...vec1.keys(), ...vec2.keys()]);

    allTerms.forEach(term => {
      const v1 = vec1.get(term) || 0;
      const v2 = vec2.get(term) || 0;
      dotProduct += v1 * v2;
      norm1 += v1 * v1;
      norm2 += v2 * v2;
    });

    if (norm1 === 0 || norm2 === 0) return 0;
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  // Retrieve relevant documents using semantic search
  retrieve(query, topK = 5) {
    if (!this.initialized) {
      console.warn('[RAG Service] Not initialized, returning empty results');
      return [];
    }

    // Tokenize query and create TF-IDF vector
    const queryTerms = this.tokenize(query);
    const queryTermFreq = new Map();
    queryTerms.forEach(term => {
      queryTermFreq.set(term, (queryTermFreq.get(term) || 0) + 1);
    });

    const queryVector = new Map();
    queryTermFreq.forEach((freq, term) => {
      const idf = this.idfScores.get(term) || 0;
      queryVector.set(term, freq * idf);
    });

    // Calculate similarity scores
    const scores = this.embeddings.map((docVector, index) => ({
      index,
      score: this.cosineSimilarity(queryVector, docVector),
      document: this.documents[index]
    }));

    // Sort by score and return top K
    return scores
      .filter(s => s.score > this.SIMILARITY_THRESHOLD)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(s => s.document);
  }

  // Generate response using templates (fallback when API is unavailable)
  generateTemplateResponse(query, retrievedDocs) {
    if (retrievedDocs.length === 0) {
      return {
        reply: 'Xin lỗi, mình không tìm thấy thông tin phù hợp trong cơ sở dữ liệu. Bạn có thể hỏi về các hành tinh trong hệ Mặt Trời, thiên thạch, sao chổi, hoặc các khái niệm thiên văn khác.',
        sources: [],
        method: 'template_fallback'
      };
    }

    // Build response from retrieved documents
    const doc = retrievedDocs[0];
    let reply = '';
    const sources = [];

    if (doc.type === 'planet') {
      const planet = doc.data;
      reply = `**${planet.name} (${doc.nameVi})**\n\n` +
        `${planet.description}\n\n` +
        `**Thông số kỹ thuật:**\n` +
        `• Loại: ${planet.type}\n` +
        `• Đường kính: ${planet.diameter}\n` +
        `• Nhiệt độ trung bình: ${planet.temperature}\n` +
        `• Số mặt trăng: ${planet.moons}\n` +
        `• Trọng lực so với Trái Đất: ${planet.gravity}g\n` +
        `• Độ dài một ngày: ${planet.dayLength}\n` +
        `• Khoảng cách từ Mặt Trời: ${planet.distance}`;
      
      sources.push({
        name: `${planet.name} (${doc.nameVi})`,
        source: 'Local Database'
      });
    } else if (doc.type === 'concept') {
      reply = `**${doc.name}**\n\n${doc.data.description}`;
      sources.push({
        name: doc.name,
        source: 'Knowledge Base'
      });
    }

    // Add information from additional documents
    if (retrievedDocs.length > 1) {
      reply += '\n\n**Thông tin liên quan:**\n';
      retrievedDocs.slice(1, 3).forEach(doc => {
        if (doc.type === 'planet') {
          reply += `\n• **${doc.data.name} (${doc.nameVi})**: ${doc.data.description}`;
          sources.push({
            name: `${doc.data.name} (${doc.nameVi})`,
            source: 'Local Database'
          });
        } else if (doc.type === 'concept') {
          reply += `\n• **${doc.name}**: ${doc.data.description}`;
          sources.push({
            name: doc.name,
            source: 'Knowledge Base'
          });
        }
      });
    }

    return {
      reply,
      sources,
      method: 'template'
    };
  }

  // Main RAG function: retrieve and generate
  async query(userQuery, topK = this.DEFAULT_TOP_K) {
    if (!this.initialized) {
      await this.initialize();
    }

    console.log('[RAG Service] Processing query:', userQuery);

    // Retrieve relevant documents
    const retrievedDocs = this.retrieve(userQuery, topK);
    
    console.log('[RAG Service] Retrieved', retrievedDocs.length, 'documents');
    
    if (retrievedDocs.length > 0) {
      console.log('[RAG Service] Top match:', retrievedDocs[0].name);
    }

    return {
      retrievedDocs,
      contexts: retrievedDocs.map(doc => {
        if (doc.type === 'planet') {
          return {
            name: `${doc.data.name} (${doc.nameVi})`,
            description: doc.text,
            source: 'Local RAG Database',
            data: doc.data
          };
        } else {
          return {
            name: doc.name,
            description: doc.data.description,
            source: 'Local RAG Knowledge Base'
          };
        }
      })
    };
  }
}

// Export singleton instance
const ragService = new RAGService();
export default ragService;
