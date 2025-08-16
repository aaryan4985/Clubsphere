const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const router = express.Router();

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Chat with AI endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, context = '', conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // If no API key, return helpful response
    if (!genAI || !process.env.GEMINI_API_KEY) {
      const fallbackResponse = getFallbackResponse(message);
      return res.json({ response: fallbackResponse });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Build conversation context
    let conversationContext = '';
    if (conversationHistory.length > 0) {
      conversationContext = '\n\nRecent conversation:\n' + 
        conversationHistory.map(msg => `${msg.type}: ${msg.content}`).join('\n');
    }

    // Determine conversation state
    const isFirstMessage = conversationHistory.length === 0;
    const isFollowUp = conversationHistory.length > 0;

    // Create context-aware prompt
    const prompt = `
You are ClubMate, an enthusiastic AI assistant for campus club and event discovery. You're conversational, engaging, and adapt your responses based on what users ask.

IMPORTANT CONVERSATION RULES:
- Always respond differently to follow-up questions
- Build on previous context naturally
- Ask engaging follow-up questions
- Don't repeat the same information unless specifically asked
- Be dynamic and conversational, not scripted
- Adapt your tone to match the user's interest level
- Keep responses fresh and varied

CAMPUS DATA:
${typeof context === 'string' ? context : JSON.stringify(context, null, 2)}

CONVERSATION STATE:
- Is first message: ${isFirstMessage}
- Is follow-up: ${isFollowUp}
- Messages in conversation: ${context.conversationLength || 0}

${conversationContext}

CONVERSATION GUIDELINES:
- For first-time users: Give overview and suggestions
- For specific interests: Provide targeted recommendations  
- For follow-ups: Ask clarifying questions or dive deeper
- For general questions: Offer multiple paths to explore
- Always end with an engaging question or next step
- Vary your response style to keep things interesting

Current user message: "${message}"

Respond naturally and conversationally. If this is a follow-up, build on what was discussed before. Make each response unique and engaging. Avoid repeating the exact same information patterns.
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    res.json({ response: text });

  } catch (error) {
    console.error('Gemini AI Error:', error);
    
    // Fallback response
    const fallbackResponse = getFallbackResponse(req.body.message);
    res.json({ response: fallbackResponse });
  }
});

// Fallback responses when API is not available
function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Handle club creation requests - redirect to information browsing
  if (lowerMessage.includes('create') && lowerMessage.includes('club')) {
    return "🎯 **I'd love to help you explore clubs!**\n\nRight now, I can help you discover and learn about our amazing existing clubs on campus! We have 8 fantastic clubs across different categories:\n\n🖥️ **Technology** - Coding Club, Robotics Club\n🎨 **Arts** - Music Club, Photography Club\n💼 **Business** - Entrepreneurship Club\n🎮 **Gaming** - Gaming Club\n🌱 **Social Impact** - Environmental Club\n🎤 **Academic** - Debate Society\n\n💡 **Try asking:**\n• \"Show me all clubs\"\n• \"I'm interested in [your interest]\"\n• \"Tell me about the [Club Name]\"\n• \"What clubs match my interests?\"\n\nWhat type of activities interest you most? I can recommend the perfect club! 😊";
  }
  
  // Handle event creation requests - redirect to event discovery
  if (lowerMessage.includes('create') && lowerMessage.includes('event')) {
    return "📅 **Let's explore our exciting events!**\n\nI can help you discover amazing upcoming events happening on campus! We have 8 fantastic events coming up:\n\n🏆 **Competitions** - Hackathon, Robot Battles, Debate Championships\n🎨 **Workshops** - Photography, Portrait Mastery\n🎤 **Performances** - Open Mic Night, Music Showcases\n💼 **Professional** - Startup Pitch Competitions\n🌍 **Social Impact** - Climate Action Summit\n\n💡 **Try asking:**\n• \"What events are happening this week?\"\n• \"Show me competitive events\"\n• \"I want to participate in [type] events\"\n• \"Tell me about the [Event Name]\"\n\nWhat kind of events interest you? I can help you find the perfect match! 🎯";
  }
  
  if (lowerMessage.includes('club') && (lowerMessage.includes('show') || lowerMessage.includes('list') || lowerMessage.includes('all'))) {
    return "🎯 **Available Clubs on Campus:**\n\n🖥️ **Coding Club** - 145 members, Rating: 4.8⭐\nLeader: Alex Johnson | Meets: Wednesdays 6:00 PM\nFocus: Programming, hackathons, software development\n\n🎵 **Music Club** - 89 members, Rating: 4.7⭐\nLeader: Sarah Chen | Meets: Fridays 4:00 PM\nFocus: Instruments, vocals, live performances\n\n🤖 **Robotics Club** - 67 members, Rating: 4.9⭐\nLeader: Mike Rodriguez | Meets: Tuesdays & Thursdays 5:30 PM\nFocus: Robot building, competitions, automation\n\n📸 **Photography Club** - 78 members, Rating: 4.6⭐\nLeader: Emma Davis | Meets: Saturdays 2:00 PM\nFocus: Photo techniques, exhibitions, workshops\n\n🎤 **Debate Society** - 54 members, Rating: 4.5⭐\nLeader: David Park | Meets: Mondays 7:00 PM\nFocus: Public speaking, critical thinking\n\n🌱 **Environmental Club** - 92 members, Rating: 4.8⭐\nLeader: Luna Green | Meets: Wednesdays 5:00 PM\nFocus: Sustainability, climate action, conservation\n\n💡 **Entrepreneurship Club** - 76 members, Rating: 4.7⭐\nLeader: James Wilson | Meets: Thursdays 6:30 PM\nFocus: Startups, innovation, business development\n\n🎮 **Gaming Club** - 134 members, Rating: 4.9⭐\nLeader: Ryan Kim | Meets: Daily 7:00 PM\nFocus: Esports, game development, tournaments\n\nWhich club interests you most? I can provide more details! 😊";
  }
  
  if (lowerMessage.includes('event') && (lowerMessage.includes('show') || lowerMessage.includes('list') || lowerMessage.includes('upcoming') || lowerMessage.includes('week'))) {
    return "🗓️ **Exciting Upcoming Events:**\n\n🏆 **Hackathon 2025: AI Revolution** - Aug 25\nBy Coding Club | 9:00 AM - 9:00 PM | Main Auditorium\n$5000 prizes + internship opportunities! 156/200 registered\n\n🎤 **Open Mic Night: Acoustic Vibes** - Aug 22\nBy Music Club | 7:00 PM - 10:00 PM | Student Center\nShowcase your talents! No registration required\n\n⚔️ **Robot Battle Championship** - Aug 30\nBy Robotics Club | 3:00 PM - 8:00 PM | Engineering Workshop\nEpic robot battles! 28/32 teams registered\n\n📷 **Photography Workshop: Portrait Mastery** - Aug 20\nBy Photography Club | 10:00 AM - 4:00 PM | Art Studio B\nLearn pro techniques! 18/25 spots filled\n\n💼 **Startup Pitch Competition** - Aug 26\nBy Entrepreneurship Club | 5:00 PM - 9:00 PM | Innovation Hub\n$10,000 seed funding prizes! 12/15 teams registered\n\n🎮 **Esports Tournament: League of Legends** - Aug 24\nBy Gaming Club | 2:00 PM - 10:00 PM | Gaming Lounge\nLive streaming + gaming gear prizes! 35/40 spots filled\n\nWhich event catches your eye? Want registration details? 🎯";
  }
  
  if (lowerMessage.includes('tech') || lowerMessage.includes('programming') || lowerMessage.includes('coding')) {
    return "🖥️ **Perfect for Tech Enthusiasts!**\n\n**Coding Club** is your best match! 🚀\n• 145 active members with 4.8⭐ rating\n• Weekly meetings Wednesdays 6:00 PM\n• Focus: Programming, hackathons, software projects\n• Recent wins: Inter-College Hackathon 2024\n• Active projects: 50+ completed, industry partnerships\n\n**Upcoming:** Hackathon 2025 (Aug 25) - AI/ML focus with $5000 prizes!\n\n**Robotics Club** is also great for programming!\n• Arduino, AI, automation projects\n• National champions 2024\n• Meets Tuesdays & Thursdays 5:30 PM\n\nWant to know how to join? Ask me about meeting times or upcoming events! 🎯";
  }
  
  if (lowerMessage.includes('music') || lowerMessage.includes('singing') || lowerMessage.includes('instrument')) {
    return "🎵 **Music Lovers Unite!**\n\n**Music Club** is calling your name! 🎤\n• 89 talented members with 4.7⭐ rating\n• Fridays 4:00 PM in Music Room 203\n• Leader: Sarah Chen (amazing vocalist!)\n• Instruments: Guitar, piano, drums, vocals & more\n• Achievements: Annual concerts with 500+ audience\n\n**Coming Up:** Open Mic Night (Aug 22) 🎤\n• 7:00 PM - 10:00 PM at Student Center\n• No registration needed - just bring your talent!\n• Audience Choice Award + recording studio session prizes\n\n**10+ bands formed** through our club connections!\nWant to learn more about joining or upcoming events? 🎼✨";
  }
  
  if (lowerMessage.includes('gaming') || lowerMessage.includes('esports') || lowerMessage.includes('game')) {
    return "🎮 **Gaming Paradise Found!**\n\n**Gaming Club** - Your ultimate gaming hub! 🏆\n• 134 active gamers with 4.9⭐ rating\n• Daily sessions at 7:00 PM in Gaming Lounge\n• Leader: Ryan Kim (esports champion)\n• Focus: Competitive gaming, game dev, tournaments\n• Achievements: Regional Esports Champions, Twitch partnership\n\n**Epic Event:** Esports Tournament - League of Legends (Aug 24)\n• 2:00 PM - 10:00 PM with live streaming\n• Gaming gear prizes + tournament trophy\n• 35/40 spots filled - register now!\n\n**Daily gaming sessions** + game development workshops\nReady to join the gaming community? 🚀🎯";
  }
  
  if (lowerMessage.includes('join') || lowerMessage.includes('how to') || lowerMessage.includes('register')) {
    return "🎯 **Ready to Join Campus Life?**\n\nGreat question! Here's how you can get involved:\n\n📋 **For Clubs:**\n• Attend their weekly meetings (I can tell you when/where!)\n• Talk to club leaders during meetings\n• Most clubs welcome new members anytime\n• Some clubs have specific recruitment periods\n\n🎫 **For Events:**\n• Some events require registration (I'll tell you which ones!)\n• Others are drop-in friendly\n• Check registration deadlines and capacity\n• Many events offer prizes and certificates\n\n💡 **Next Steps:**\n• Ask me \"Tell me about [Club Name]\" for meeting details\n• Ask \"How do I register for [Event Name]?\" for event info\n• Ask \"What clubs meet this week?\" for immediate opportunities\n\nWhich club or event interests you most? I can give you specific details! �";
  }
  
  if (lowerMessage.includes('create') && lowerMessage.includes('promotion')) {
    return "🎨 **Event Promotion Generator Activated!**\n\n✨ I can create amazing promotions for any event! Here's a sample:\n\n🚀 **\"HACKATHON 2025: WHERE CODE MEETS GENIUS!\"**\n💡 *24 hours. Infinite possibilities. AI Revolution starts HERE.*\n\n🏆 **MASSIVE PRIZES AWAIT:**\n• $5000 First Prize 💰\n• Exclusive internship opportunities 🚀\n• Industry mentorship programs 🌟\n\n📅 August 25 | Main Auditorium\n⏰ 9:00 AM - 9:00 PM\n\n*\"Transform your wildest AI dreams into reality. Join 200 brilliant minds. Make history.\"*\n\n🎯 **Register NOW - Only 44 spots left!**\n\nWant me to create a custom promotion for another event? Just tell me which one! ✨";
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('what can')) {
    return "🤖 **I'm ClubMate - Your AI Campus Companion!**\n\n🎯 **What I can help you with:**\n• Discover 8+ amazing clubs across all categories\n• Find exciting upcoming events and competitions\n• Get personalized recommendations based on interests\n• Learn about club leaders, meetings, and achievements\n• Find out how to join clubs and register for events\n• Create stunning event promotions\n• Track registration status and event details\n• Connect you with like-minded students\n\n💬 **Try asking:**\n• \"Show me tech clubs\"\n• \"What's happening this weekend?\"\n• \"I love music\" \n• \"How do I join the Coding Club?\"\n• \"Tell me about the Gaming Club\"\n• \"Create a promotion for the hackathon\"\n\n✨ Ready to explore campus life? What interests you most?";
  }
  
  return "👋 **Hey there! I'm ClubMate, your AI campus companion!**\n\n🎯 I'm here to help you discover amazing clubs and events on campus! With 8+ active clubs and tons of exciting events, there's something for everyone.\n\n💡 **Quick suggestions:**\n• Ask about specific interests (\"I like technology\")\n• See what's happening (\"Show me events this week\")\n• Learn about clubs (\"Tell me about the Music Club\")\n• Find out how to get involved (\"How do I join clubs?\")\n• Get personalized recommendations\n\n✨ What would you like to explore today?";
}

module.exports = router;
