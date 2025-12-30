// Intelligent Response Generator
// Generates natural responses from RAG contexts without relying on API

export class IntelligentGenerator {
  constructor() {
    // Response templates for different types of content
    this.templates = {
      planet: {
        intro: [
          "Về {name}, đây là những thông tin thú vị:",
          "{name} là một hành tinh rất đặc biệt:",
          "Hãy cùng tìm hiểu về {name}:",
          "Mình có thể chia sẻ về {name} như sau:"
        ],
        structure: [
          "\n\n🪐 **Thông tin cơ bản:**\n{basic_info}",
          "\n\n📊 **Đặc điểm nổi bật:**\n{features}",
          "\n\n🔍 **Chi tiết kỹ thuật:**\n{technical}",
          "\n\n✨ **Điều thú vị:**\n{interesting}"
        ]
      },
      
      vietnam: {
        intro: [
          "Về chương trình vũ trụ Việt Nam, mình rất tự hào chia sẻ:",
          "Việt Nam có những thành tựu đáng tự hào trong lĩnh vực vũ trụ:",
          "Đây là những điều thú vị về vũ trụ Việt Nam:",
          "Mình rất vui được kể về thành tựu vũ trụ của Việt Nam:"
        ],
        pride: [
          "🇻🇳 Việt Nam thật sự tuyệt vời!",
          "🚀 Chúng ta có lý do để tự hào!",
          "✨ Thành tựu đáng ngưỡng mộ của Việt Nam!",
          "🌟 Việt Nam đã và đang làm nên lịch sử!"
        ]
      },

      concept: {
        intro: [
          "Đây là một chủ đề rất thú vị! Để mình giải thích:",
          "Mình sẽ giúp bạn hiểu rõ về vấn đề này:",
          "Đây là kiến thức mà mình muốn chia sẻ:",
          "Hãy cùng khám phá chủ đề này:"
        ],
        explanation: [
          "\n\n💡 **Giải thích đơn giản:**\n{simple}",
          "\n\n🔬 **Chi tiết khoa học:**\n{detailed}",
          "\n\n🌟 **Tại sao điều này quan trọng:**\n{importance}",
          "\n\n🤔 **Điều thú vị:**\n{fun_fact}"
        ]
      }
    };

    // Question type detection patterns
    this.questionTypes = {
      what: /^(.*là gì|what is|gì là|định nghĩa)/i,
      how: /^(làm thế nào|how|như thế nào|cách nào)/i,
      why: /^(tại sao|why|vì sao|lý do)/i,
      when: /^(khi nào|when|lúc nào)/i,
      where: /^(ở đâu|where|nơi nào)/i,
      who: /^(ai|who|người nào)/i,
      comparison: /(khác nhau|so sánh|compare|difference)/i,
      list: /(liệt kê|danh sách|list|những|các)/i
    };
  }

  // Analyze user intent from question
  analyzeIntent(question) {
    const q = question.toLowerCase();
    
    for (const [type, pattern] of Object.entries(this.questionTypes)) {
      if (pattern.test(q)) {
        return type;
      }
    }
    
    return 'general';
  }

  // Generate natural response from contexts
  generateResponse(question, contexts) {
    if (!contexts || contexts.length === 0) {
      return this.generateNoContextResponse(question);
    }

    const intent = this.analyzeIntent(question);
    const primaryContext = contexts[0];
    
    // Determine content type
    let contentType = 'concept';
    if (primaryContext.name && primaryContext.name.includes('(')) {
      contentType = 'planet';
    } else if (this.isVietnamContent(primaryContext)) {
      contentType = 'vietnam';
    }

    return this.buildResponse(question, contexts, contentType, intent);
  }

  // Check if content is Vietnam-related
  isVietnamContent(context) {
    const text = (context.name + ' ' + context.description).toLowerCase();
    const vietnamKeywords = ['việt nam', 'vietnam', 'phạm tuân', 'vnredsat', 'vinasat'];
    return vietnamKeywords.some(keyword => text.includes(keyword));
  }

  // Build comprehensive response
  buildResponse(question, contexts, contentType, intent) {
    const primary = contexts[0];
    const template = this.templates[contentType];
    
    // Choose intro based on content type
    const intro = this.getRandomItem(template.intro).replace('{name}', primary.name);
    
    let response = intro;
    
    // Add main content based on type
    if (contentType === 'planet') {
      response += this.buildPlanetResponse(primary, intent);
    } else if (contentType === 'vietnam') {
      response += this.buildVietnamResponse(primary, intent);
      response += '\n\n' + this.getRandomItem(template.pride);
    } else {
      response += this.buildConceptResponse(primary, intent);
    }

    // Add related information if available
    if (contexts.length > 1) {
      response += this.buildRelatedInfo(contexts.slice(1));
    }

    // Add contextual ending based on intent
    response += this.buildContextualEnding(intent, contentType);

    return {
      reply: response,
      sources: contexts.map(c => ({ name: c.name, source: c.source })),
      method: 'intelligent_generation',
      intent: intent,
      contentType: contentType
    };
  }

  // Build planet-specific response
  buildPlanetResponse(context, intent) {
    let response = '\n\n';
    
    if (intent === 'what') {
      response += `🪐 **${context.name}** là ${context.description}`;
    } else if (intent === 'how') {
      response += `🔍 **Cách thức hoạt động của ${context.name}:**\n${context.description}`;
    } else {
      response += `📊 **Về ${context.name}:**\n${context.description}`;
    }

    // Add technical details if available
    if (context.data) {
      response += '\n\n📋 **Thông số kỹ thuật:**';
      const data = context.data;
      if (data.diameter) response += `\n• Đường kính: ${data.diameter}`;
      if (data.temperature) response += `\n• Nhiệt độ: ${data.temperature}`;
      if (data.moons) response += `\n• Số mặt trăng: ${data.moons}`;
      if (data.distance) response += `\n• Khoảng cách từ Mặt Trời: ${data.distance}`;
    }

    return response;
  }

  // Build Vietnam-specific response
  buildVietnamResponse(context, intent) {
    let response = '\n\n';
    
    if (intent === 'who') {
      response += `👨‍🚀 **${context.name}:**\n${context.description}`;
    } else if (intent === 'what') {
      response += `🛰️ **${context.name}:**\n${context.description}`;
    } else {
      response += `🇻🇳 **${context.name}:**\n${context.description}`;
    }

    // Add achievements if available
    if (context.data && context.data.achievements) {
      response += '\n\n🏆 **Thành tựu nổi bật:**';
      context.data.achievements.forEach(achievement => {
        response += `\n• ${achievement}`;
      });
    }

    return response;
  }

  // Build concept response
  buildConceptResponse(context, intent) {
    let response = '\n\n';
    
    if (intent === 'what') {
      response += `💡 **${context.name}** là: ${context.description}`;
    } else if (intent === 'how') {
      response += `⚙️ **Cách hoạt động:** ${context.description}`;
    } else if (intent === 'why') {
      response += `🤔 **Lý do:** ${context.description}`;
    } else {
      response += `📚 **${context.name}:** ${context.description}`;
    }

    return response;
  }

  // Build related information section
  buildRelatedInfo(relatedContexts) {
    let response = '\n\n🔗 **Thông tin liên quan:**';
    
    relatedContexts.slice(0, 2).forEach(context => {
      response += `\n\n• **${context.name}:** ${context.description.substring(0, 150)}${context.description.length > 150 ? '...' : ''}`;
    });

    return response;
  }

  // Build contextual ending
  buildContextualEnding(intent, contentType) {
    const endings = {
      what: [
        '\n\n🤔 Bạn có muốn tìm hiểu thêm về chủ đề này không?',
        '\n\n✨ Còn điều gì khác bạn muốn biết?',
        '\n\n🚀 Hy vọng thông tin này hữu ích cho bạn!'
      ],
      how: [
        '\n\n🔍 Bạn có muốn mình giải thích chi tiết hơn không?',
        '\n\n⚙️ Còn cơ chế nào khác bạn tò mò?',
        '\n\n💡 Mình có thể giải thích thêm nếu bạn cần!'
      ],
      vietnam: [
        '\n\n🇻🇳 Bạn có muốn biết thêm về thành tựu vũ trụ Việt Nam?',
        '\n\n🚀 Mình rất tự hào về chương trình vũ trụ nước nhà!',
        '\n\n✨ Việt Nam còn nhiều điều đáng tự hào trong lĩnh vực này!'
      ]
    };

    const endingType = contentType === 'vietnam' ? 'vietnam' : intent;
    const options = endings[endingType] || endings.what;
    
    return this.getRandomItem(options);
  }

  // Generate response when no context available
  generateNoContextResponse(question) {
    const intent = this.analyzeIntent(question);
    
    const responses = {
      what: "Hmm, mình chưa có thông tin cụ thể về điều bạn hỏi trong cơ sở dữ liệu. Bạn có thể hỏi về các hành tinh trong hệ Mặt Trời, thiên thạch, sao chổi, hoặc chương trình vũ trụ Việt Nam không? 🤔🚀",
      how: "Mình chưa có đủ thông tin để giải thích cách thức này. Thử hỏi về cách các hành tinh quay quanh Mặt Trời, hoặc cách thiên thạch hình thành nhé! 🌟",
      why: "Đây là câu hỏi hay! Nhưng mình cần thêm thông tin để trả lời chính xác. Bạn có thể hỏi về lý do tại sao Sao Hỏa có màu đỏ, hoặc tại sao Việt Nam phát triển chương trình vũ trụ không? 🔍",
      who: "Mình chưa có thông tin về người này trong cơ sở dữ liệu. Nhưng mình có thể kể về phi hành gia Phạm Tuân - người Việt Nam đầu tiên bay vào vũ trụ! 👨‍🚀",
      default: "Mình chưa tìm thấy thông tin phù hợp trong cơ sở dữ liệu. Hãy thử hỏi về:\n\n🪐 Các hành tinh: Sao Hỏa, Sao Kim, Trái Đất...\n🇻🇳 Vũ trụ Việt Nam: Phạm Tuân, VNREDSat-1, VINASAT\n🌟 Hiện tượng vũ trụ: Hố đen, thiên thạch, sao chổi\n🚀 Công nghệ vũ trụ: Tàu vũ trụ, trạm không gian"
    };

    return {
      reply: responses[intent] || responses.default,
      sources: [],
      method: 'no_context_fallback',
      intent: intent
    };
  }

  // Utility: Get random item from array
  getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Generate follow-up questions
  generateFollowUpQuestions(contentType, context) {
    const followUps = {
      planet: [
        `${context.name} có mặt trăng nào thú vị?`,
        `Có thể sống được trên ${context.name} không?`,
        `${context.name} khác với Trái Đất như thế nào?`
      ],
      vietnam: [
        'Việt Nam có kế hoạch vũ trụ nào trong tương lai?',
        'Phạm Tuân đã làm gì trên trạm vũ trụ?',
        'VNREDSat-1 chụp được những ảnh gì?'
      ],
      concept: [
        'Điều này ảnh hưởng đến Trái Đất như thế nào?',
        'Con người đã khám phá ra điều này khi nào?',
        'Có hiện tượng tương tự nào khác không?'
      ]
    };

    return followUps[contentType] || followUps.concept;
  }
}

// Export singleton
export const intelligentGenerator = new IntelligentGenerator();