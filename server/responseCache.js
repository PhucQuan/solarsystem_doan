// Response Cache Service - Cache responses to reduce API calls
export class ResponseCache {
  constructor() {
    this.cache = new Map();
    this.maxCacheSize = 100;
    this.cacheTimeout = 60 * 60 * 1000; // 1 hour
    this.hitCount = 0;
    this.missCount = 0;
    
    // Clean up expired cache entries every 10 minutes
    setInterval(() => this.cleanupExpiredEntries(), 10 * 60 * 1000);
  }

  // Generate cache key from message and contexts
  generateCacheKey(message, contexts = []) {
    // Normalize message for better cache hits
    const normalizedMessage = this.normalizeMessage(message);
    
    // Create context signature
    const contextSignature = contexts
      .map(c => c.name + ':' + (c.source || ''))
      .sort()
      .join('|');
    
    // Combine message and context for unique key
    const keyString = normalizedMessage + '::' + contextSignature;
    
    // Create hash for shorter key
    return this.simpleHash(keyString);
  }

  // Normalize message for better cache matching
  normalizeMessage(message) {
    return message
      .toLowerCase()
      .trim()
      // Remove extra spaces
      .replace(/\s+/g, ' ')
      // Remove punctuation that doesn't affect meaning
      .replace(/[?!.,;:]/g, '')
      // Normalize Vietnamese variations
      .replace(/sao hoả/g, 'sao hỏa')
      .replace(/sao kim/g, 'sao kim')
      .replace(/việt nam/g, 'vietnam')
      .replace(/viet nam/g, 'vietnam');
  }

  // Simple hash function for cache keys
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Check if response is cached
  get(message, contexts = []) {
    const key = this.generateCacheKey(message, contexts);
    const cached = this.cache.get(key);
    
    if (!cached) {
      this.missCount++;
      return null;
    }

    // Check if expired
    if (Date.now() - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      this.missCount++;
      return null;
    }

    this.hitCount++;
    console.log(`[ResponseCache] Cache HIT for key: ${key}`);
    
    // Update access time for LRU
    cached.lastAccessed = Date.now();
    
    return {
      ...cached.response,
      fromCache: true,
      cacheAge: Date.now() - cached.timestamp
    };
  }

  // Store response in cache
  set(message, contexts, response) {
    const key = this.generateCacheKey(message, contexts);
    
    // Don't cache error responses or casual conversations
    if (response.method === 'server_error' || 
        response.method === 'casual_conversation' ||
        response.method === 'error_fallback') {
      return;
    }

    // Ensure cache size limit
    if (this.cache.size >= this.maxCacheSize) {
      this.evictOldestEntry();
    }

    const cacheEntry = {
      response: {
        reply: response.reply,
        sources: response.sources,
        method: response.method + '_cached',
        contextsUsed: response.contextsUsed
      },
      timestamp: Date.now(),
      lastAccessed: Date.now(),
      accessCount: 1,
      originalMessage: message,
      contextCount: contexts.length
    };

    this.cache.set(key, cacheEntry);
    console.log(`[ResponseCache] Cached response for key: ${key}`);
  }

  // Evict oldest entry (LRU)
  evictOldestEntry() {
    let oldestKey = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      console.log(`[ResponseCache] Evicted oldest entry: ${oldestKey}`);
    }
  }

  // Clean up expired entries
  cleanupExpiredEntries() {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.cacheTimeout) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`[ResponseCache] Cleaned up ${cleanedCount} expired cache entries`);
    }
  }

  // Check if message is semantically similar to cached ones
  findSimilarCached(message, contexts = [], threshold = 0.8) {
    const normalizedMessage = this.normalizeMessage(message);
    const messageWords = new Set(normalizedMessage.split(' '));
    
    for (const [key, entry] of this.cache.entries()) {
      // Skip expired entries
      if (Date.now() - entry.timestamp > this.cacheTimeout) {
        continue;
      }

      const cachedWords = new Set(this.normalizeMessage(entry.originalMessage).split(' '));
      const similarity = this.calculateSimilarity(messageWords, cachedWords);
      
      if (similarity >= threshold) {
        console.log(`[ResponseCache] Found similar cached response (${Math.round(similarity * 100)}% match)`);
        entry.lastAccessed = Date.now();
        entry.accessCount++;
        
        return {
          ...entry.response,
          fromCache: true,
          similarity: similarity,
          cacheAge: Date.now() - entry.timestamp
        };
      }
    }

    return null;
  }

  // Calculate Jaccard similarity between two sets of words
  calculateSimilarity(set1, set2) {
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let totalAge = 0;
    let totalAccess = 0;
    const methodCounts = new Map();

    for (const entry of this.cache.values()) {
      totalAge += now - entry.timestamp;
      totalAccess += entry.accessCount;
      
      const method = entry.response.method.replace('_cached', '');
      methodCounts.set(method, (methodCounts.get(method) || 0) + 1);
    }

    const totalRequests = this.hitCount + this.missCount;
    
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: totalRequests > 0 ? Math.round((this.hitCount / totalRequests) * 100) : 0,
      averageAge: this.cache.size > 0 ? Math.round(totalAge / this.cache.size / 1000) : 0, // seconds
      averageAccess: this.cache.size > 0 ? Math.round(totalAccess / this.cache.size) : 0,
      methodDistribution: Array.from(methodCounts.entries()),
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  // Estimate memory usage (rough calculation)
  estimateMemoryUsage() {
    let totalSize = 0;
    
    for (const entry of this.cache.values()) {
      // Rough estimation: JSON string length * 2 (for Unicode)
      totalSize += JSON.stringify(entry).length * 2;
    }
    
    return {
      bytes: totalSize,
      kb: Math.round(totalSize / 1024),
      mb: Math.round(totalSize / (1024 * 1024) * 100) / 100
    };
  }

  // Clear cache
  clear() {
    const size = this.cache.size;
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
    console.log(`[ResponseCache] Cleared ${size} cache entries`);
  }

  // Get cache entries for debugging
  getEntries(limit = 10) {
    const entries = [];
    let count = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (count >= limit) break;
      
      entries.push({
        key,
        message: entry.originalMessage,
        method: entry.response.method,
        age: Math.round((Date.now() - entry.timestamp) / 1000), // seconds
        accessCount: entry.accessCount,
        contextCount: entry.contextCount
      });
      
      count++;
    }
    
    return entries;
  }

  // Preload common responses (could be called on server startup)
  async preloadCommonResponses() {
    const commonQuestions = [
      'Sao Hỏa là gì?',
      'Phạm Tuân là ai?',
      'Việt Nam có vệ tinh nào?',
      'Hệ Mặt Trời có bao nhiêu hành tinh?',
      'Thiên thạch có nguy hiểm không?'
    ];

    console.log('[ResponseCache] Preloading common responses...');
    
    // This would require access to the main query function
    // Implementation would depend on how the cache is integrated
    // For now, just log the intent
    console.log(`[ResponseCache] Would preload ${commonQuestions.length} common questions`);
  }
}

// Export singleton
export const responseCache = new ResponseCache();