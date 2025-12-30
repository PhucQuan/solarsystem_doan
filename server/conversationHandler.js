// Conversation Handler - Handle casual conversations and small talk
// This helps the bot respond naturally to greetings and general queries

export class ConversationHandler {
  constructor() {
    // Casual conversation patterns
    this.patterns = {
      greetings: {
        patterns: [
          /^(xin chào|chào|hello|hi|hey|chào bạn|xin chào bạn)/i,
          /^(good morning|good afternoon|good evening|buổi sáng|buổi chiều|buổi tối)/i
        ],
        responses: [
          "Xin chào! Mình là SolarBot 🤖 Mình có thể giúp bạn tìm hiểu về vũ trụ, hệ Mặt Trời, và cả chương trình vũ trụ Việt Nam! Bạn muốn hỏi gì nhé? 🚀",
          "Chào bạn! Mình rất vui được gặp bạn! Hãy hỏi mình về các hành tinh, thiên thạch, hoặc bất cứ điều gì về vũ trụ nhé! 🌟",
          "Hello! Mình là trợ lý AI chuyên về thiên văn học. Bạn có muốn khám phá vũ trụ cùng mình không? 🪐"
        ]
      },

      identity: {
        patterns: [
          /^(bạn là ai|you are|who are you|giới thiệu|tự giới thiệu|bạn tên gì)/i,
          /^(mình có thể gọi bạn|tên của bạn|what.*your name)/i
        ],
        responses: [
          "Mình là SolarBot! 🤖 Mình được tạo ra để giúp mọi người khám phá vũ trụ và hệ Mặt Trời. Mình có kiến thức về các hành tinh, thiên thạch, sao chổi, và đặc biệt là chương trình vũ trụ Việt Nam với phi hành gia Phạm Tuân! 🇻🇳🚀",
          "Mình là SolarBot - trợ lý AI thông minh về thiên văn học! Mình có thể trả lời câu hỏi về hệ Mặt Trời, vũ trụ, và cả những thành tựu vũ trụ của Việt Nam như VNREDSat-1, VINASAT. Hỏi mình bất cứ gì nhé! ✨",
          "Chào bạn! Mình là SolarBot 🌟 Mình được thiết kế để chia sẻ kiến thức về vũ trụ, từ các hành tinh trong hệ Mặt Trời đến những khám phá mới nhất của NASA, và cả lịch sử vũ trụ Việt Nam!"
        ]
      },

      capabilities: {
        patterns: [
          /^(bạn có thể làm gì|bạn biết gì|what can you do|help|giúp gì)/i,
          /^(bạn có thể giúp|hỗ trợ|support)/i
        ],
        responses: [
          "Mình có thể giúp bạn:\n\n🪐 **Khám phá hệ Mặt Trời**: Thông tin về 8 hành tinh, mặt trăng, thiên thạch\n🚀 **Vũ trụ Việt Nam**: Phạm Tuân, VNREDSat-1, VINASAT, lịch sử vũ trụ VN\n🌟 **Thiên văn học**: Hố đen, thiên hà, sao chổi, hiện tượng vũ trụ\n📡 **NASA Updates**: Dữ liệu thời gian thực từ NASA API\n🎓 **Giáo dục**: Giải thích khái niệm phức tạp một cách dễ hiểu\n\nHãy hỏi mình bất cứ điều gì về vũ trụ nhé!",
          "Mình chuyên về:\n\n✨ **Hệ Mặt Trời**: Từ Sao Thủy đến Sao Hải Vương\n🇻🇳 **Vũ trụ Việt Nam**: Phi hành gia Phạm Tuân, các vệ tinh VN\n🔭 **Thiên văn học**: Khám phá vũ trụ, các hiện tượng thiên văn\n🛰️ **Công nghệ vũ trụ**: Tàu vũ trụ, trạm không gian, vệ tinh\n📚 **Lịch sử vũ trụ**: Từ Apollo đến SpaceX\n\nBạn muốn tìm hiểu về chủ đề nào?"
        ]
      },

      thanks: {
        patterns: [
          /^(cảm ơn|thank you|thanks|cám ơn|tks|ty)/i,
          /^(cảm ơn bạn|thank you so much|cảm ơn nhiều)/i
        ],
        responses: [
          "Không có gì! Mình rất vui được giúp bạn khám phá vũ trụ! 😊 Nếu có câu hỏi gì khác về thiên văn học, cứ hỏi mình nhé! 🚀",
          "Rất vui được giúp đỡ! 🌟 Mình luôn sẵn sàng chia sẻ kiến thức về vũ trụ và hệ Mặt Trời. Hãy tiếp tục khám phá nhé! 🪐",
          "Không có chi! Đó là niềm vui của mình! ✨ Hy vọng bạn đã học được điều gì đó thú vị về vũ trụ. Còn gì muốn hỏi không? 🌌"
        ]
      },

      goodbye: {
        patterns: [
          /^(tạm biệt|bye|goodbye|see you|hẹn gặp lại|chào tạm biệt)/i,
          /^(mình đi đây|mình phải đi|good night|chúc ngủ ngon)/i
        ],
        responses: [
          "Tạm biệt! Chúc bạn có những giấc mơ đẹp về vũ trụ! 🌙✨ Hẹn gặp lại bạn sớm nhé! 🚀",
          "Bye bye! Hy vọng bạn đã có những phút giây thú vị khám phá vũ trụ cùng mình! 🌟 Hẹn gặp lại! 👋",
          "Chào tạm biệt! Đừng quên nhìn lên bầu trời đêm và nghĩ về những điều kỳ diệu của vũ trụ nhé! 🌌 See you! 🪐"
        ]
      },

      compliments: {
        patterns: [
          /^(bạn thông minh|giỏi quá|amazing|tuyệt vời|great|excellent)/i,
          /^(bạn biết nhiều|kiến thức rộng|impressive)/i
        ],
        responses: [
          "Cảm ơn bạn! 😊 Mình rất đam mê về vũ trụ và luôn cố gắng học hỏi để chia sẻ kiến thức hay nhất! Bạn cũng rất tuyệt khi có niềm đam mê khám phá vũ trụ! 🌟",
          "Aww, cảm ơn! 🥰 Mình chỉ muốn giúp mọi người yêu thích vũ trụ như mình thôi! Vũ trụ thật sự rất kỳ diệu và còn nhiều điều để khám phá! 🚀",
          "Bạn quá khen! 😄 Mình học được rất nhiều từ những câu hỏi của các bạn. Cùng nhau khám phá vũ trụ thì vui hơn nhiều! 🪐✨"
        ]
      },

      confusion: {
        patterns: [
          /^(không hiểu|confused|what|huh|gì|sao|tại sao)/i,
          /^(giải thích|explain|làm rõ|clarify)/i
        ],
        responses: [
          "Ồ, có vẻ mình chưa giải thích rõ ràng! 😅 Bạn có thể hỏi cụ thể hơn được không? Ví dụ: 'Sao Hỏa có gì đặc biệt?' hoặc 'Phạm Tuân là ai?' Mình sẽ trả lời chi tiết hơn! 🤔",
          "Xin lỗi nếu mình làm bạn bối rối! 😊 Hãy thử hỏi một câu hỏi cụ thể về vũ trụ, hành tinh, hoặc chương trình vũ trụ Việt Nam. Mình sẽ giải thích thật dễ hiểu! 🚀",
          "Không sao! Đôi khi vũ trụ thật sự phức tạp! 🌌 Bạn muốn mình giải thích về chủ đề nào? Mình có thể làm cho nó đơn giản và thú vị hơn! ✨"
        ]
      }
    };
  }

  // Check if message is casual conversation
  isCasualConversation(message) {
    const msg = message.toLowerCase().trim();
    
    // Very short messages are likely casual
    if (msg.length < 20) {
      for (const category of Object.values(this.patterns)) {
        for (const pattern of category.patterns) {
          if (pattern.test(msg)) {
            return true;
          }
        }
      }
    }
    
    return false;
  }

  // Handle casual conversation
  handleCasualConversation(message) {
    const msg = message.toLowerCase().trim();
    
    for (const [category, data] of Object.entries(this.patterns)) {
      for (const pattern of data.patterns) {
        if (pattern.test(msg)) {
          const responses = data.responses;
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          
          return {
            reply: randomResponse,
            sources: [{ name: 'SolarBot Personality', source: 'Conversation Handler' }],
            method: 'casual_conversation',
            category: category
          };
        }
      }
    }
    
    // Default casual response
    return {
      reply: "Mình không chắc hiểu ý bạn lắm 🤔 Nhưng mình rất sẵn lòng giúp bạn khám phá vũ trụ! Hãy hỏi mình về các hành tinh, thiên thạch, hoặc chương trình vũ trụ Việt Nam nhé! 🚀✨",
      sources: [{ name: 'SolarBot Default', source: 'Conversation Handler' }],
      method: 'casual_fallback',
      category: 'default'
    };
  }

  // Get conversation starter suggestions
  getConversationStarters() {
    return [
      "Hãy hỏi mình về Sao Hỏa! 🔴",
      "Bạn có biết về phi hành gia Phạm Tuân không? 🚀",
      "Thiên thạch có nguy hiểm không? ☄️",
      "Việt Nam có những vệ tinh nào? 🛰️",
      "Hố đen hoạt động như thế nào? 🕳️",
      "Tại sao Mặt Trời lại nóng? ☀️"
    ];
  }
}

// Export singleton
export const conversationHandler = new ConversationHandler();