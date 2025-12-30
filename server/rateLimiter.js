// Rate Limiter - Prevent API abuse
export class RateLimiter {
  constructor() {
    this.requests = new Map(); // IP -> [{timestamp, endpoint}]
    this.maxRequests = 30; // Max 30 requests per window
    this.windowMs = 15 * 60 * 1000; // 15 minutes
    this.blockDuration = 60 * 60 * 1000; // 1 hour block for abuse
    this.blockedIPs = new Map(); // IP -> blockUntil timestamp
    
    // Different limits for different endpoints
    this.endpointLimits = {
      '/api/chat': { max: 20, window: 15 * 60 * 1000 }, // 20 per 15 min
      '/api/analytics': { max: 60, window: 15 * 60 * 1000 }, // 60 per 15 min
      '/api/articles': { max: 100, window: 15 * 60 * 1000 } // 100 per 15 min
    };
    
    // Clean up old requests every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  // Get client identifier (IP + User-Agent hash)
  getClientId(req) {
    const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const userAgent = req.get('User-Agent') || '';
    
    // Create a simple hash of User-Agent for better client identification
    const uaHash = this.simpleHash(userAgent).substring(0, 8);
    
    return `${ip}:${uaHash}`;
  }

  // Simple hash function
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  // Check if request is allowed
  isAllowed(req) {
    const clientId = this.getClientId(req);
    const endpoint = req.path;
    const now = Date.now();

    // Check if IP is blocked
    if (this.blockedIPs.has(clientId)) {
      const blockUntil = this.blockedIPs.get(clientId);
      if (now < blockUntil) {
        return {
          allowed: false,
          reason: 'IP_BLOCKED',
          retryAfter: Math.ceil((blockUntil - now) / 1000), // seconds
          message: 'IP blocked due to abuse. Please try again later.'
        };
      } else {
        // Unblock expired blocks
        this.blockedIPs.delete(clientId);
      }
    }

    // Get endpoint-specific limits or use default
    const limits = this.endpointLimits[endpoint] || {
      max: this.maxRequests,
      window: this.windowMs
    };

    // Get or create request history for this client
    if (!this.requests.has(clientId)) {
      this.requests.set(clientId, []);
    }

    const clientRequests = this.requests.get(clientId);
    
    // Remove old requests outside the window
    const windowStart = now - limits.window;
    const recentRequests = clientRequests.filter(req => req.timestamp > windowStart);
    
    // Update the client's request history
    this.requests.set(clientId, recentRequests);

    // Check if limit exceeded
    if (recentRequests.length >= limits.max) {
      // Check for potential abuse (too many requests in short time)
      const veryRecentRequests = recentRequests.filter(req => 
        req.timestamp > now - (60 * 1000) // Last minute
      );
      
      if (veryRecentRequests.length > limits.max / 3) {
        // Block IP for abuse
        this.blockedIPs.set(clientId, now + this.blockDuration);
        console.log(`[RateLimiter] Blocked IP ${clientId} for abuse (${veryRecentRequests.length} requests in 1 minute)`);
        
        return {
          allowed: false,
          reason: 'ABUSE_DETECTED',
          retryAfter: Math.ceil(this.blockDuration / 1000),
          message: 'Too many requests. IP blocked for 1 hour.'
        };
      }

      const oldestRequest = Math.min(...recentRequests.map(r => r.timestamp));
      const retryAfter = Math.ceil((oldestRequest + limits.window - now) / 1000);

      return {
        allowed: false,
        reason: 'RATE_LIMITED',
        retryAfter: retryAfter,
        limit: limits.max,
        window: Math.ceil(limits.window / 1000),
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`
      };
    }

    // Add current request to history
    recentRequests.push({
      timestamp: now,
      endpoint: endpoint,
      userAgent: req.get('User-Agent') || 'unknown'
    });

    return {
      allowed: true,
      remaining: limits.max - recentRequests.length,
      resetTime: windowStart + limits.window,
      limit: limits.max
    };
  }

  // Express middleware
  middleware() {
    return (req, res, next) => {
      const result = this.isAllowed(req);
      
      // Add rate limit headers
      if (result.allowed) {
        res.set({
          'X-RateLimit-Limit': result.limit,
          'X-RateLimit-Remaining': result.remaining,
          'X-RateLimit-Reset': new Date(result.resetTime).toISOString()
        });
        next();
      } else {
        res.set({
          'X-RateLimit-Limit': result.limit || this.maxRequests,
          'X-RateLimit-Remaining': 0,
          'Retry-After': result.retryAfter
        });

        const statusCode = result.reason === 'IP_BLOCKED' || result.reason === 'ABUSE_DETECTED' ? 429 : 429;
        
        res.status(statusCode).json({
          error: 'Rate limit exceeded',
          message: result.message,
          retryAfter: result.retryAfter,
          reason: result.reason
        });
      }
    };
  }

  // Clean up old requests and expired blocks
  cleanup() {
    const now = Date.now();
    let cleanedRequests = 0;
    let cleanedBlocks = 0;

    // Clean up old requests
    for (const [clientId, requests] of this.requests.entries()) {
      const recentRequests = requests.filter(req => 
        req.timestamp > now - Math.max(...Object.values(this.endpointLimits).map(l => l.window))
      );
      
      if (recentRequests.length === 0) {
        this.requests.delete(clientId);
        cleanedRequests++;
      } else {
        this.requests.set(clientId, recentRequests);
      }
    }

    // Clean up expired blocks
    for (const [clientId, blockUntil] of this.blockedIPs.entries()) {
      if (now >= blockUntil) {
        this.blockedIPs.delete(clientId);
        cleanedBlocks++;
      }
    }

    if (cleanedRequests > 0 || cleanedBlocks > 0) {
      console.log(`[RateLimiter] Cleaned up ${cleanedRequests} request histories and ${cleanedBlocks} expired blocks`);
    }
  }

  // Get statistics
  getStats() {
    const now = Date.now();
    const stats = {
      totalClients: this.requests.size,
      blockedIPs: this.blockedIPs.size,
      totalRequests: 0,
      requestsLast15Min: 0,
      requestsLastHour: 0,
      topClients: [],
      endpointStats: new Map(),
      blockedClientsInfo: []
    };

    // Analyze requests
    const clientStats = new Map();
    
    for (const [clientId, requests] of this.requests.entries()) {
      stats.totalRequests += requests.length;
      
      const last15Min = requests.filter(r => r.timestamp > now - 15 * 60 * 1000).length;
      const lastHour = requests.filter(r => r.timestamp > now - 60 * 60 * 1000).length;
      
      stats.requestsLast15Min += last15Min;
      stats.requestsLastHour += lastHour;
      
      clientStats.set(clientId, {
        total: requests.length,
        last15Min,
        lastHour,
        firstRequest: Math.min(...requests.map(r => r.timestamp)),
        lastRequest: Math.max(...requests.map(r => r.timestamp))
      });

      // Count endpoint usage
      requests.forEach(req => {
        const count = stats.endpointStats.get(req.endpoint) || 0;
        stats.endpointStats.set(req.endpoint, count + 1);
      });
    }

    // Get top clients by request count
    stats.topClients = Array.from(clientStats.entries())
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 10)
      .map(([clientId, data]) => ({
        clientId: clientId.substring(0, 20) + '...', // Truncate for privacy
        ...data,
        firstRequest: new Date(data.firstRequest).toISOString(),
        lastRequest: new Date(data.lastRequest).toISOString()
      }));

    // Get blocked clients info
    for (const [clientId, blockUntil] of this.blockedIPs.entries()) {
      stats.blockedClientsInfo.push({
        clientId: clientId.substring(0, 20) + '...',
        blockedUntil: new Date(blockUntil).toISOString(),
        remainingTime: Math.max(0, Math.ceil((blockUntil - now) / 1000))
      });
    }

    return stats;
  }

  // Manually block an IP
  blockIP(clientId, duration = this.blockDuration, reason = 'Manual block') {
    const blockUntil = Date.now() + duration;
    this.blockedIPs.set(clientId, blockUntil);
    console.log(`[RateLimiter] Manually blocked ${clientId} until ${new Date(blockUntil).toISOString()} - ${reason}`);
  }

  // Unblock an IP
  unblockIP(clientId) {
    if (this.blockedIPs.delete(clientId)) {
      console.log(`[RateLimiter] Unblocked ${clientId}`);
      return true;
    }
    return false;
  }

  // Reset rate limit for a client
  resetClient(clientId) {
    this.requests.delete(clientId);
    this.blockedIPs.delete(clientId);
    console.log(`[RateLimiter] Reset rate limit for ${clientId}`);
  }

  // Get current status for a client
  getClientStatus(req) {
    const clientId = this.getClientId(req);
    const now = Date.now();

    if (this.blockedIPs.has(clientId)) {
      const blockUntil = this.blockedIPs.get(clientId);
      return {
        blocked: true,
        blockUntil: new Date(blockUntil).toISOString(),
        remainingTime: Math.max(0, Math.ceil((blockUntil - now) / 1000))
      };
    }

    const requests = this.requests.get(clientId) || [];
    const limits = this.endpointLimits[req.path] || { max: this.maxRequests, window: this.windowMs };
    const windowStart = now - limits.window;
    const recentRequests = requests.filter(r => r.timestamp > windowStart);

    return {
      blocked: false,
      requests: recentRequests.length,
      limit: limits.max,
      remaining: limits.max - recentRequests.length,
      resetTime: new Date(windowStart + limits.window).toISOString()
    };
  }
}

// Export singleton
export const rateLimiter = new RateLimiter();