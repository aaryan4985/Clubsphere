# ClubMate - Campus Activity Chatbot MVP

ClubMate is a simple, intelligent chatbot designed to help students discover clubs and events on campus. Built with React frontend and Node.js backend, integrated with Google's Gemini AI for dynamic conversations.

## 🌟 Features

- **Intelligent Chat Interface**: Powered by Google Gemini AI for natural conversations
- **Pre-loaded Club Data**: 5 sample clubs (Coding, Music, Robotics, Photography, Debate)
- **Event Discovery**: Information about upcoming campus events
- **Interest-based Recommendations**: Get club suggestions based on your interests
- **Event Promotion Generator**: AI-powered catchy event descriptions
- **Modern UI**: Beautiful chat interface with animations and gradients
- **No Authentication Required**: Direct access to the chatbot

## 🏗️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **React Router** - Navigation
- **React Hot Toast** - Notifications

### Backend

- **Node.js & Express** - Server framework
- **Google Gemini AI** - Natural language processing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Rate Limiting** - API protection

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd codesphere
   ```

2. **Set up the backend**

   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**

   - Copy `.env.example` to `.env`
   - Add your Google Gemini API key:
     ```
     GEMINI_API_KEY=your_gemini_api_key_here
     PORT=5000
     NODE_ENV=development
     ```

4. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**

   ```bash
   cd backend
   npm start
   ```

   Server will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```
   Application will open in browser at `http://localhost:3000`

## 💬 Sample Conversations

Try asking ClubMate:

- **"What events are coming up?"** - Get a list of upcoming campus events
- **"I like music, what clubs should I join?"** - Get personalized club recommendations
- **"Tell me about the Coding Club"** - Learn about specific clubs
- **"Create a promotion for the hackathon"** - Generate catchy event descriptions
- **"Who leads the Robotics Club?"** - Get information about club leaders
- **"When does the Music Club meet?"** - Find meeting times and locations

## 📊 Pre-loaded Data

### Clubs

- **Coding Club** - Programming, hackathons, tech projects
- **Music Club** - Instruments, vocals, performances
- **Robotics Club** - Engineering, programming, competitions
- **Photography Club** - Visual arts, camera techniques
- **Debate Society** - Public speaking, critical thinking

### Events

- **Hackathon 2025** - 24-hour coding competition
- **Open Mic Night** - Musical talent showcase
- **Robot Battle Championship** - Competitive robotics
- **Nature Photography Walk** - Outdoor photography session
- **Parliamentary Debate Workshop** - Advanced debating techniques

## 🎨 UI Features

- **Gradient Backgrounds** - Beautiful color transitions
- **Chat Animations** - Smooth message animations
- **Custom Scrollbar** - Styled chat scroll area
- **Responsive Design** - Works on all device sizes
- **Loading Indicators** - Animated typing indicators
- **Quick Suggestions** - Pre-made question buttons

## 🔧 API Endpoints

### Chat Endpoint

- **POST** `/api/ai/chat`
- **Body**: `{ message: "user question", context: { clubs, events } }`
- **Response**: `{ response: "AI generated response" }`

### Health Check

- **GET** `/api/health`
- **Response**: Server status and timestamp

## 🛡️ Security Features

- **Helmet.js** - Security headers
- **CORS Protection** - Configured origins
- **Rate Limiting** - 100 requests per 15 minutes
- **Input Validation** - Message requirements
- **Environment Variables** - Secure API key storage

## 📁 Project Structure

```
codesphere/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ClubMate.js          # Main chatbot component
│   │   ├── styles/
│   │   │   └── clubmate.css         # Custom animations
│   │   ├── App.js                   # Main app component
│   │   └── index.js                 # React entry point
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── ai.js                # Gemini AI integration
│   │   └── index.js                 # Express server
│   └── package.json
└── README.md
```

## 🔮 Future Enhancements

- **Real Database Integration** - Replace sample data with SQLite/PostgreSQL
- **User Preferences** - Save favorite clubs and interests
- **Event Registration** - Allow students to sign up for events
- **Push Notifications** - Remind users about upcoming events
- **Multi-language Support** - Support for different languages
- **Voice Input** - Speech-to-text functionality
- **Calendar Integration** - Google Calendar sync
- **Admin Panel** - Manage clubs and events

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. **Check the console** - Look for error messages in browser dev tools
2. **Verify API key** - Ensure your Gemini API key is correctly set
3. **Check network** - Ensure both servers are running
4. **Review logs** - Check terminal output for error messages

## 🎯 MVP Goals Achieved

✅ **Simple Chat Interface** - Clean, modern chat UI  
✅ **No Authentication** - Direct access to chatbot  
✅ **Pre-loaded Data** - Sample clubs and events  
✅ **Gemini AI Integration** - Dynamic, intelligent responses  
✅ **Interest-based Suggestions** - Personalized recommendations  
✅ **Event Promotions** - AI-generated marketing content  
✅ **Modern Styling** - Tailwind CSS with animations  
✅ **Modular Code** - Clean, maintainable architecture

---

**ClubMate** - Making campus life discovery fun and intelligent! 🎓✨
