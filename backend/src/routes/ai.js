const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const router = express.Router();

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Chat with AI endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, context = '' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // If no API key, return helpful response
    if (!genAI || !process.env.GEMINI_API_KEY) {
      const fallbackResponse = getFallbackResponse(message);
      return res.json({ response: fallbackResponse });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create context-aware prompt
    const prompt = `
You are ClubSphere AI, a helpful assistant for club and event management. 
You help users manage clubs, events, and memberships in a friendly, conversational way.

Context about the current system:
${context}

User message: ${message}

Please provide a helpful, friendly response. If the user is asking about creating clubs, events, or managing memberships, guide them through the process. Keep responses concise but informative.
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
  
  if (lowerMessage.includes('club') && lowerMessage.includes('create')) {
    return "I can help you create a new club! Just click on 'Create Club' or tell me the club name and description you'd like to use.";
  }
  
  if (lowerMessage.includes('event') && lowerMessage.includes('create')) {
    return "Let's create a new event! I'll need the event title, date, location, and which club it's for. You can use the 'Create Event' option.";
  }
  
  if (lowerMessage.includes('show') && lowerMessage.includes('club')) {
    return "I can show you all the clubs! Let me fetch the current club list for you.";
  }
  
  if (lowerMessage.includes('event') && lowerMessage.includes('list')) {
    return "I'll get the upcoming events for you! You can see all scheduled events and their details.";
  }
  
  if (lowerMessage.includes('help')) {
    return "I'm here to help with ClubSphere! You can ask me to:\n• Create new clubs\n• Organize events\n• Show club listings\n• Manage memberships\n• Get upcoming events\n\nWhat would you like to do?";
  }
  
  return "I'm ClubSphere AI! I can help you manage clubs and events. Try asking me to create a club, show events, or help with memberships. What would you like to do?";
}

module.exports = router;
