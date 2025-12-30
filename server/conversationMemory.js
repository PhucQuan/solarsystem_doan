// Conversation Memory - Track conversation context for follow-up questions
export class ConversationMemory {
  constructor() {
    // Store conversations by session ID (could use user ID in production)
    this.sessions = new Map();
    this.maxHistoryLength = 10; // Keep last 10 exchanges
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    
    // Clean up expired sessions every 5 minutes
    setInterval(() => this.cleanupExpiredSessions(), 5 * 60 * 1000);
  }

  // Generate or get session ID
  getSessionId(req) {
    // In production, use user authentication
    // For now, use IP + User-Agent as simple session identifier
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || '';
    return Buffer.from(ip + userAgent).toString('base64').substring(0, 16);
  }

  // Add message to conversation history
  addToHistory(sessionId, userMessage, botResponse, contexts = []) {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        history: [],
        lastActivity: Date.now(),
        entities: new Map(), // Track mentioned entities
        topics: new Set() // Track discussed topics
      });
    }

    const session = this.sessions.get(sessionId);
    
    // Add to history
    session.history.push({
      timestamp: Date.now(),
      user: userMessage,
      bot: botResponse.reply || botResponse,
      contexts: contexts,
      method: botResponse.method || 'unknown'
    });

    // Extract and store entities (planets, people, concepts)
    this.extractEntities(userMessage, botResponse, session);
    
    // Track topics
    this.extractTopics(contexts, session);

    // Keep only recent history
    if (session.history.length > this.maxHistoryLength) {
      session.history = session.history.slice(-this.maxHistoryLength);
    }

    session.lastActivity = Date.now();
  }

  // Extract entities from conversation
  extractEntities(userMessage, botResponse, session) {
    const text = (userMessage + ' ' + (botResponse.reply || botResponse)).toLowerCase();
    
    // Planet entities
    const planets = {
      'sao thủy': 'Mercury', 'mercury': 'Mercury',
      'sao kim': 'Venus', 'venus': 'Venus', 'sao mai': 'Venus', 'sao hôm': 'Venus',
      'trái đất': 'Earth', 'earth': 'Earth', 'địa cầu': 'Earth',
      'sao hỏa': 'Mars', 'mars': 'Mars', 'hỏa tinh': 'Mars',
      'sao mộc': 'Jupiter', 'jupiter': 'Jupiter', 'mộc tinh': 'Jupiter',
      'sao thổ': 'Saturn', 'saturn': 'Saturn', 'thổ tinh': 'Saturn',
      'sao thiên vương': 'Uranus', 'uranus': 'Uranus',
      'sao hải vương': 'Neptune', 'neptune': 'Neptune'
    };

    // Vietnam entities
    const vietnamEntities = {
      'phạm tuân': 'Phạm Tuân',
      'vnredsat': 'VNREDSat-1',
      'vinasat': 'VINASAT',
      'nanodragon': 'NanoDragon',
      'việt nam': 'Vietnam'
    };

    // Space entities
    const spaceEntities = {
      'mặt trời': 'Sun', 'sun': 'Sun',
      'mặt trăng': 'Moon', 'moon': 'Moon',
      'thiên thạch': 'Asteroid', 'asteroid': 'Asteroid',
      'sao chổi': 'Comet', 'comet': 'Comet',
      'hố đen': 'Black Hole', 'black hole': 'Black Hole'
    };

    const allEntities = { ...planets, ...vietnamEntities, ...spaceEntities };

    for (const [key, entity] of Object.entries(allEntities)) {
      if (text.includes(key)) {
        session.entities.set(entity, {
          lastMentioned: Date.now(),
          mentions: (session.entities.get(entity)?.mentions || 0) + 1,
          context: key
        });
      }
    }
  }

  // Extract topics from contexts
  extractTopics(contexts, session) {
    contexts.forEach(context => {
      if (context.source) {
        session.topics.add(context.source);
      }
      if (context.name) {
        // Extract topic from context name
        const topic = this.categorizeContext(context.name);
        if (topic) session.topics.add(topic);
      }
    });
  }

  // Categorize context into topics
  categorizeContext(name) {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('vietnam') || nameLower.includes('việt nam')) return 'Vietnam Space';
    if (nameLower.includes('planet') || nameLower.includes('hành tinh')) return 'Planets';
    if (nameLower.includes('nasa')) return 'NASA';
    if (nameLower.includes('asteroid') || nameLower.includes('thiên thạch')) return 'Asteroids';
    return 'General Space';
  }

  // Resolve pronouns and references in current message
  resolveReferences(sessionId, currentMessage) {
    if (!this.sessions.has(sessionId)) {
      return { resolvedMessage: currentMessage, referencedEntity: null };
    }

    const session = this.sessions.get(sessionId);
    const messageLower = currentMessage.toLowerCase();
    
    // Common pronouns and references
    const pronouns = ['nó', 'it', 'đó', 'that', 'này', 'this', 'chúng', 'they'];
    const hasPronouns = pronouns.some(pronoun => messageLower.includes(pronoun));
    
    if (!hasPronouns) {
      return { resolvedMessage: currentMessage, referencedEntity: null };
    }

    // Find most recently mentioned entity
    let mostRecentEntity = null;
    let mostRecentTime = 0;

    for (const [entity, data] of session.entities.entries()) {
      if (data.lastMentioned > mostRecentTime) {
        mostRecentTime = data.lastMentioned;
        mostRecentEntity = entity;
      }
    }

    if (mostRecentEntity) {
      // Replace pronouns with entity name
      let resolvedMessage = currentMessage;
      pronouns.forEach(pronoun => {
        const regex = new RegExp(`\\b${pronoun}\\b`, 'gi');
        resolvedMessage = resolvedMessage.replace(regex, mostRecentEntity);
      });

      return { 
        resolvedMessage, 
        referencedEntity: mostRecentEntity,
        originalMessage: currentMessage
      };
    }

    return { resolvedMessage: currentMessage, referencedEntity: null };
  }

  // Get conversation context for current query
  getConversationContext(sessionId) {
    if (!this.sessions.has(sessionId)) {
      return { history: [], entities: [], topics: [] };
    }

    const session = this.sessions.get(sessionId);
    
    return {
      history: session.history.slice(-3), // Last 3 exchanges
      entities: Array.from(session.entities.entries()).map(([name, data]) => ({
        name,
        mentions: data.mentions,
        lastMentioned: data.lastMentioned,
        context: data.context
      })),
      topics: Array.from(session.topics),
      sessionAge: Date.now() - (session.history[0]?.timestamp || Date.now())
    };
  }

  // Build context-aware prompt
  buildContextualPrompt(basePrompt, sessionId, currentMessage) {
    const context = this.getConversationContext(sessionId);
    
    if (context.history.length === 0) {
      return basePrompt; // No conversation history
    }

    // Add conversation context to prompt
    let contextualPrompt = basePrompt;
    
    // Add recent conversation history
    if (context.history.length > 0) {
      contextualPrompt += '\n\n=== LỊCH SỬ HỘI THOẠI GẦN ĐÂY ===\n';
      context.history.forEach((exchange, i) => {
        contextualPrompt += `[${i + 1}] User: ${exchange.user}\n`;
        contextualPrompt += `[${i + 1}] Bot: ${exchange.bot.substring(0, 100)}...\n`;
      });
    }

    // Add mentioned entities
    if (context.entities.length > 0) {
      contextualPrompt += '\n=== CÁC CHỦ ĐỀ ĐÃ THẢO LUẬN ===\n';
      context.entities
        .sort((a, b) => b.lastMentioned - a.lastMentioned)
        .slice(0, 3)
        .forEach(entity => {
          contextualPrompt += `- ${entity.name} (đã nhắc ${entity.mentions} lần)\n`;
        });
    }

    contextualPrompt += '\n=== LƯU Ý ===\n';
    contextualPrompt += 'Hãy tham khảo lịch sử hội thoại để trả lời câu hỏi hiện tại một cách liên kết và tự nhiên.\n';
    contextualPrompt += 'Nếu user dùng đại từ như "nó", "đó", "này", hãy hiểu là đang nói về chủ đề vừa thảo luận.\n';

    return contextualPrompt;
  }

  // Clean up expired sessions
  cleanupExpiredSessions() {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastActivity > this.sessionTimeout) {
        this.sessions.delete(sessionId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`[ConversationMemory] Cleaned up ${cleanedCount} expired sessions`);
    }
  }

  // Get session statistics
  getSessionStats(sessionId) {
    if (!this.sessions.has(sessionId)) {
      return null;
    }

    const session = this.sessions.get(sessionId);
    return {
      messageCount: session.history.length,
      entitiesDiscussed: session.entities.size,
      topicsExplored: session.topics.size,
      sessionDuration: Date.now() - (session.history[0]?.timestamp || Date.now()),
      lastActivity: session.lastActivity
    };
  }

  // Get all sessions summary (for analytics)
  getAllSessionsStats() {
    const stats = {
      totalSessions: this.sessions.size,
      activeSessions: 0,
      totalMessages: 0,
      popularEntities: new Map(),
      popularTopics: new Map()
    };

    const now = Date.now();
    const activeThreshold = 10 * 60 * 1000; // 10 minutes

    for (const session of this.sessions.values()) {
      if (now - session.lastActivity < activeThreshold) {
        stats.activeSessions++;
      }
      
      stats.totalMessages += session.history.length;
      
      // Count entity popularity
      for (const [entity, data] of session.entities.entries()) {
        stats.popularEntities.set(entity, (stats.popularEntities.get(entity) || 0) + data.mentions);
      }
      
      // Count topic popularity
      for (const topic of session.topics) {
        stats.popularTopics.set(topic, (stats.popularTopics.get(topic) || 0) + 1);
      }
    }

    return stats;
  }
}

// Export singleton
export const conversationMemory = new ConversationMemory();