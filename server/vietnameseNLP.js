// Vietnamese NLP - Enhanced tokenization and processing for Vietnamese text
export class VietnameseNLP {
  constructor() {
    // Vietnamese stopwords
    this.stopwords = new Set([
      'là', 'của', 'và', 'có', 'được', 'trong', 'với', 'để', 'cho', 'từ', 'về',
      'như', 'khi', 'nếu', 'mà', 'hay', 'hoặc', 'nhưng', 'vì', 'do', 'bởi',
      'theo', 'trên', 'dưới', 'giữa', 'sau', 'trước', 'bên', 'cạnh', 'gần',
      'xa', 'nhiều', 'ít', 'lớn', 'nhỏ', 'cao', 'thấp', 'mới', 'cũ', 'tốt',
      'xấu', 'đẹp', 'rất', 'khá', 'hơi', 'quá', 'cực', 'siêu', 'đã', 'sẽ',
      'đang', 'vừa', 'mới', 'sắp', 'cần', 'phải', 'nên', 'có thể', 'không',
      'chưa', 'đã', 'rồi', 'này', 'đó', 'kia', 'nào', 'gì', 'ai', 'đâu',
      'sao', 'thế', 'thì', 'mà', 'à', 'ạ', 'ơi', 'nhé', 'nha', 'ha'
    ]);

    // Vietnamese compound words (từ ghép) - important for space/astronomy domain
    this.compoundWords = new Map([
      // Space terms
      ['hệ mặt trời', 'hệ_mặt_trời'],
      ['mặt trời', 'mặt_trời'],
      ['mặt trăng', 'mặt_trăng'],
      ['thiên thạch', 'thiên_thạch'],
      ['sao chổi', 'sao_chổi'],
      ['hố đen', 'hố_đen'],
      ['thiên hà', 'thiên_hà'],
      ['vũ trụ', 'vũ_trụ'],
      ['không gian', 'không_gian'],
      ['tàu vũ trụ', 'tàu_vũ_trụ'],
      ['trạm vũ trụ', 'trạm_vũ_trụ'],
      ['phi hành gia', 'phi_hành_gia'],
      ['nhật thực', 'nhật_thực'],
      ['nguyệt thực', 'nguyệt_thực'],
      ['lực hấp dẫn', 'lực_hấp_dẫn'],
      ['quỹ đạo', 'quỹ_đạo'],
      
      // Planets
      ['sao thủy', 'sao_thủy'],
      ['sao kim', 'sao_kim'],
      ['trái đất', 'trái_đất'],
      ['sao hỏa', 'sao_hỏa'],
      ['sao mộc', 'sao_mộc'],
      ['sao thổ', 'sao_thổ'],
      ['sao thiên vương', 'sao_thiên_vương'],
      ['sao hải vương', 'sao_hải_vương'],
      
      // Vietnam space terms
      ['việt nam', 'việt_nam'],
      ['phạm tuân', 'phạm_tuân'],
      ['vnredsat', 'vnredsat'],
      ['vinasat', 'vinasat'],
      ['nanodragon', 'nanodragon'],
      ['microdragon', 'microdragon'],
      ['lotosat', 'lotosat'],
      
      // Traditional astronomy
      ['sao mai', 'sao_mai'],
      ['sao hôm', 'sao_hôm'],
      ['lịch âm', 'lịch_âm'],
      ['con giáp', 'con_giáp'],
      ['thiên văn học', 'thiên_văn_học'],
      
      // General terms
      ['có thể', 'có_thể'],
      ['không thể', 'không_thể'],
      ['tại sao', 'tại_sao'],
      ['vì sao', 'vì_sao'],
      ['như thế nào', 'như_thế_nào'],
      ['ra sao', 'ra_sao'],
      ['bao nhiêu', 'bao_nhiêu'],
      ['bao lâu', 'bao_lâu'],
      ['bao xa', 'bao_xa'],
      ['bao giờ', 'bao_giờ']
    ]);

    // Vietnamese diacritics mapping for normalization
    this.diacriticsMap = new Map([
      ['à', 'a'], ['á', 'a'], ['ả', 'a'], ['ã', 'a'], ['ạ', 'a'],
      ['ă', 'a'], ['ằ', 'a'], ['ắ', 'a'], ['ẳ', 'a'], ['ẵ', 'a'], ['ặ', 'a'],
      ['â', 'a'], ['ầ', 'a'], ['ấ', 'a'], ['ẩ', 'a'], ['ẫ', 'a'], ['ậ', 'a'],
      ['è', 'e'], ['é', 'e'], ['ẻ', 'e'], ['ẽ', 'e'], ['ẹ', 'e'],
      ['ê', 'e'], ['ề', 'e'], ['ế', 'e'], ['ể', 'e'], ['ễ', 'e'], ['ệ', 'e'],
      ['ì', 'i'], ['í', 'i'], ['ỉ', 'i'], ['ĩ', 'i'], ['ị', 'i'],
      ['ò', 'o'], ['ó', 'o'], ['ỏ', 'o'], ['õ', 'o'], ['ọ', 'o'],
      ['ô', 'o'], ['ồ', 'o'], ['ố', 'o'], ['ổ', 'o'], ['ỗ', 'o'], ['ộ', 'o'],
      ['ơ', 'o'], ['ờ', 'o'], ['ớ', 'o'], ['ở', 'o'], ['ỡ', 'o'], ['ợ', 'o'],
      ['ù', 'u'], ['ú', 'u'], ['ủ', 'u'], ['ũ', 'u'], ['ụ', 'u'],
      ['ư', 'u'], ['ừ', 'u'], ['ứ', 'u'], ['ử', 'u'], ['ữ', 'u'], ['ự', 'u'],
      ['ỳ', 'y'], ['ý', 'y'], ['ỷ', 'y'], ['ỹ', 'y'], ['ỵ', 'y'],
      ['đ', 'd']
    ]);

    // Question words and patterns
    this.questionPatterns = {
      what: ['gì', 'cái gì', 'điều gì', 'thứ gì', 'là gì', 'định nghĩa'],
      how: ['như thế nào', 'ra sao', 'thế nào', 'cách nào', 'làm sao'],
      why: ['tại sao', 'vì sao', 'do đâu', 'lý do', 'nguyên nhân'],
      when: ['khi nào', 'lúc nào', 'bao giờ', 'thời gian'],
      where: ['ở đâu', 'nơi nào', 'chỗ nào', 'vị trí'],
      who: ['ai', 'người nào', 'nhân vật'],
      how_much: ['bao nhiêu', 'bao xa', 'bao lâu', 'bao lớn'],
      comparison: ['khác nhau', 'giống nhau', 'so sánh', 'khác biệt'],
      list: ['liệt kê', 'danh sách', 'những', 'các', 'có những']
    };
  }

  // Enhanced tokenization with compound word detection
  tokenize(text) {
    if (!text || typeof text !== 'string') return [];

    let processedText = text.toLowerCase().trim();
    
    // Step 1: Replace compound words with single tokens
    for (const [compound, token] of this.compoundWords.entries()) {
      const regex = new RegExp(compound.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      processedText = processedText.replace(regex, token);
    }

    // Step 2: Basic tokenization
    let tokens = processedText
      .replace(/[^\w\sàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ_]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 0);

    // Step 3: Remove stopwords (but keep compound tokens)
    tokens = tokens.filter(token => {
      if (token.includes('_')) return true; // Keep compound words
      return !this.stopwords.has(token);
    });

    // Step 4: Add normalized versions for better matching
    const normalizedTokens = tokens.map(token => this.removeDiacritics(token));
    
    // Step 5: Combine original and normalized, remove duplicates
    const allTokens = [...new Set([...tokens, ...normalizedTokens])];
    
    return allTokens.filter(token => token.length > 1);
  }

  // Remove Vietnamese diacritics
  removeDiacritics(text) {
    let result = text;
    for (const [accented, base] of this.diacriticsMap.entries()) {
      result = result.replace(new RegExp(accented, 'g'), base);
    }
    return result;
  }

  // Detect question intent with Vietnamese patterns
  detectIntent(text) {
    const lowerText = text.toLowerCase();
    
    for (const [intent, patterns] of Object.entries(this.questionPatterns)) {
      for (const pattern of patterns) {
        if (lowerText.includes(pattern)) {
          return {
            intent,
            confidence: this.calculateIntentConfidence(lowerText, pattern),
            pattern
          };
        }
      }
    }
    
    return { intent: 'general', confidence: 0.5, pattern: null };
  }

  // Calculate confidence score for intent detection
  calculateIntentConfidence(text, pattern) {
    const words = text.split(/\s+/);
    const patternWords = pattern.split(/\s+/);
    
    // Higher confidence for longer, more specific patterns
    let confidence = 0.6 + (patternWords.length * 0.1);
    
    // Boost confidence if pattern appears early in the question
    const patternIndex = text.indexOf(pattern);
    if (patternIndex < text.length * 0.3) {
      confidence += 0.2;
    }
    
    return Math.min(confidence, 1.0);
  }

  // Extract named entities (planets, people, concepts)
  extractEntities(text) {
    const entities = {
      planets: [],
      people: [],
      concepts: [],
      vietnam_terms: [],
      space_objects: []
    };

    const lowerText = text.toLowerCase();

    // Planet entities
    const planetMap = {
      'sao thủy': 'Mercury', 'mercury': 'Mercury', 'thủy tinh': 'Mercury',
      'sao kim': 'Venus', 'venus': 'Venus', 'sao mai': 'Venus', 'sao hôm': 'Venus',
      'trái đất': 'Earth', 'earth': 'Earth', 'địa cầu': 'Earth',
      'sao hỏa': 'Mars', 'mars': 'Mars', 'hỏa tinh': 'Mars',
      'sao mộc': 'Jupiter', 'jupiter': 'Jupiter', 'mộc tinh': 'Jupiter',
      'sao thổ': 'Saturn', 'saturn': 'Saturn', 'thổ tinh': 'Saturn',
      'sao thiên vương': 'Uranus', 'uranus': 'Uranus',
      'sao hải vương': 'Neptune', 'neptune': 'Neptune'
    };

    // People entities
    const peopleMap = {
      'phạm tuân': 'Phạm Tuân',
      'ngô bảo châu': 'Ngô Bảo Châu',
      'tạ quang bửu': 'Tạ Quang Bửu',
      'galileo': 'Galileo Galilei',
      'newton': 'Isaac Newton',
      'einstein': 'Albert Einstein'
    };

    // Vietnam space terms
    const vietnamMap = {
      'việt nam': 'Vietnam',
      'vnredsat': 'VNREDSat-1',
      'vinasat': 'VINASAT',
      'nanodragon': 'NanoDragon',
      'microdragon': 'MicroDragon',
      'lotosat': 'LOTUSat-1'
    };

    // Space objects
    const spaceMap = {
      'mặt trời': 'Sun', 'sun': 'Sun',
      'mặt trăng': 'Moon', 'moon': 'Moon',
      'thiên thạch': 'Asteroid', 'asteroid': 'Asteroid',
      'sao chổi': 'Comet', 'comet': 'Comet',
      'hố đen': 'Black Hole', 'black hole': 'Black Hole',
      'thiên hà': 'Galaxy', 'galaxy': 'Galaxy'
    };

    // Extract entities
    for (const [key, value] of Object.entries(planetMap)) {
      if (lowerText.includes(key)) {
        entities.planets.push({ original: key, normalized: value });
      }
    }

    for (const [key, value] of Object.entries(peopleMap)) {
      if (lowerText.includes(key)) {
        entities.people.push({ original: key, normalized: value });
      }
    }

    for (const [key, value] of Object.entries(vietnamMap)) {
      if (lowerText.includes(key)) {
        entities.vietnam_terms.push({ original: key, normalized: value });
      }
    }

    for (const [key, value] of Object.entries(spaceMap)) {
      if (lowerText.includes(key)) {
        entities.space_objects.push({ original: key, normalized: value });
      }
    }

    return entities;
  }

  // Calculate semantic similarity between two texts
  calculateSimilarity(text1, text2) {
    const tokens1 = new Set(this.tokenize(text1));
    const tokens2 = new Set(this.tokenize(text2));
    
    const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
    const union = new Set([...tokens1, ...tokens2]);
    
    // Jaccard similarity
    const jaccard = intersection.size / union.size;
    
    // Boost similarity for compound word matches
    let compoundBoost = 0;
    for (const token of intersection) {
      if (token.includes('_')) {
        compoundBoost += 0.1;
      }
    }
    
    return Math.min(jaccard + compoundBoost, 1.0);
  }

  // Normalize query for better matching
  normalizeQuery(query) {
    let normalized = query.toLowerCase().trim();
    
    // Replace compound words
    for (const [compound, token] of this.compoundWords.entries()) {
      const regex = new RegExp(compound.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      normalized = normalized.replace(regex, token);
    }
    
    // Remove extra spaces
    normalized = normalized.replace(/\s+/g, ' ');
    
    return normalized;
  }

  // Get word importance score (for TF-IDF weighting)
  getWordImportance(word) {
    // Compound words are more important
    if (word.includes('_')) return 2.0;
    
    // Named entities are important
    if (this.isNamedEntity(word)) return 1.5;
    
    // Question words are important
    for (const patterns of Object.values(this.questionPatterns)) {
      if (patterns.includes(word)) return 1.3;
    }
    
    // Regular words
    return 1.0;
  }

  // Check if word is a named entity
  isNamedEntity(word) {
    const allEntities = [
      ...Array.from(this.compoundWords.values()),
      'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune',
      'phạm_tuân', 'ngô_bảo_châu', 'vnredsat', 'vinasat'
    ];
    
    return allEntities.includes(word.toLowerCase());
  }

  // Get statistics about tokenization
  getTokenizationStats(text) {
    const originalTokens = text.toLowerCase().split(/\s+/);
    const processedTokens = this.tokenize(text);
    const entities = this.extractEntities(text);
    const intent = this.detectIntent(text);
    
    return {
      originalTokenCount: originalTokens.length,
      processedTokenCount: processedTokens.length,
      stopwordsRemoved: originalTokens.length - processedTokens.length,
      compoundWordsFound: processedTokens.filter(t => t.includes('_')).length,
      entitiesFound: Object.values(entities).flat().length,
      intent: intent.intent,
      intentConfidence: intent.confidence,
      tokens: processedTokens
    };
  }
}

// Export singleton
export const vietnameseNLP = new VietnameseNLP();