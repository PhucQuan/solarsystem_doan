// Analytics & Logging Service for ChatBot
export class AnalyticsService {
  constructor() {
    this.analytics = {
      totalQueries: 0,
      popularTopics: new Map(),
      averageResponseTime: 0,
      methodUsage: new Map(), // RAG vs NASA API vs Gemini
      vietnamQueries: 0,
      spaceQueries: 0,
      errorCount: 0,
      startTime: Date.now()
    };
    
    this.queryHistory = [];
    this.maxHistorySize = 1000;
  }

  // Track a query and its response
  trackQuery(query, responseTime, method, contextsUsed, success = true) {
    this.analytics.totalQueries++;
    
    // Update average response time
    this.analytics.averageResponseTime = 
      (this.analytics.averageResponseTime * (this.analytics.totalQueries - 1) + responseTime) / 
      this.analytics.totalQueries;
    
    // Track method usage
    const currentCount = this.analytics.methodUsage.get(method) || 0;
    this.analytics.methodUsage.set(method, currentCount + 1);
    
    // Extract and track topics
    const topics = this.extractTopics(query);
    topics.forEach(topic => {
      const count = this.analytics.popularTopics.get(topic) || 0;
      this.analytics.popularTopics.set(topic, count + 1);
    });
    
    // Track Vietnam vs Space queries
    if (this.isVietnamQuery(query)) {
      this.analytics.vietnamQueries++;
    }
    if (this.isSpaceQuery(query)) {
      this.analytics.spaceQueries++;
    }
    
    // Track errors
    if (!success) {
      this.analytics.errorCount++;
    }
    
    // Store query history
    this.queryHistory.push({
      timestamp: Date.now(),
      query: query.substring(0, 100), // Truncate for privacy
      responseTime,
      method,
      contextsUsed,
      success
    });
    
    // Limit history size
    if (this.queryHistory.length > this.maxHistorySize) {
      this.queryHistory = this.queryHistory.slice(-this.maxHistorySize);
    }
    
    // Log every 10 queries
    if (this.analytics.totalQueries % 10 === 0) {
      this.logStats();
    }
  }

  // Extract main topics from query
  extractTopics(query) {
    const q = query.toLowerCase();
    const topics = [];
    
    // Vietnam-related topics
    if (q.includes('việt nam') || q.includes('vietnam') || q.includes('phạm tuân') || 
        q.includes('vnredsat') || q.includes('vinasat')) {
      topics.push('vietnam');
    }
    
    // Planet topics
    const planets = ['thủy', 'kim', 'trái đất', 'hỏa', 'mộc', 'thổ', 'thiên vương', 'hải vương',
                    'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
    planets.forEach(planet => {
      if (q.includes(planet)) topics.push('planets');
    });
    
    // Space phenomena
    if (q.includes('thiên thạch') || q.includes('asteroid') || q.includes('sao băng')) {
      topics.push('asteroids');
    }
    if (q.includes('hố đen') || q.includes('black hole')) {
      topics.push('black_holes');
    }
    if (q.includes('mặt trời') || q.includes('sun') || q.includes('bão mặt trời')) {
      topics.push('sun');
    }
    
    return topics.length > 0 ? topics : ['general'];
  }

  // Check if query is Vietnam-related
  isVietnamQuery(query) {
    const vietnamKeywords = [
      'việt nam', 'vietnam', 'phạm tuân', 'vnredsat', 'vinasat', 'lotosat',
      'sao mai', 'sao hôm', 'lịch âm', 'tết', 'con giáp', 'thiên văn việt nam'
    ];
    const q = query.toLowerCase();
    return vietnamKeywords.some(keyword => q.includes(keyword));
  }

  // Check if query is space-related
  isSpaceQuery(query) {
    const spaceKeywords = [
      'hành tinh', 'planet', 'vũ trụ', 'space', 'thiên thạch', 'asteroid',
      'mặt trời', 'sun', 'mặt trăng', 'moon', 'hố đen', 'black hole'
    ];
    const q = query.toLowerCase();
    return spaceKeywords.some(keyword => q.includes(keyword));
  }

  // Get analytics summary
  getStats() {
    const uptime = Date.now() - this.analytics.startTime;
    const uptimeHours = Math.round(uptime / (1000 * 60 * 60) * 100) / 100;
    
    return {
      ...this.analytics,
      uptime: uptimeHours,
      popularTopics: Array.from(this.analytics.popularTopics.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
      methodUsage: Array.from(this.analytics.methodUsage.entries()),
      queriesPerHour: uptimeHours > 0 ? Math.round(this.analytics.totalQueries / uptimeHours) : 0,
      errorRate: this.analytics.totalQueries > 0 ? 
        Math.round((this.analytics.errorCount / this.analytics.totalQueries) * 100) : 0,
      vietnamQueryRate: this.analytics.totalQueries > 0 ?
        Math.round((this.analytics.vietnamQueries / this.analytics.totalQueries) * 100) : 0
    };
  }

  // Log current statistics
  logStats() {
    const stats = this.getStats();
    console.log('\n📊 [Analytics] Current Stats:');
    console.log(`   Total Queries: ${stats.totalQueries}`);
    console.log(`   Avg Response Time: ${Math.round(stats.averageResponseTime)}ms`);
    console.log(`   Vietnam Queries: ${stats.vietnamQueries} (${stats.vietnamQueryRate}%)`);
    console.log(`   Error Rate: ${stats.errorRate}%`);
    console.log(`   Uptime: ${stats.uptime}h`);
    
    if (stats.popularTopics.length > 0) {
      console.log('   Popular Topics:', stats.popularTopics.slice(0, 3).map(([topic, count]) => `${topic}(${count})`).join(', '));
    }
  }

  // Get recent query history
  getRecentQueries(limit = 10) {
    return this.queryHistory.slice(-limit).reverse();
  }
}

// Singleton instance
export const analytics = new AnalyticsService();