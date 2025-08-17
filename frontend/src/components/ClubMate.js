import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Menu, X, Mic, MicOff } from 'lucide-react';

// Sample data
const sampleData = {
  clubs: [
    { id: 1, name: "Coding Club", description: "Learn programming, build projects, and participate in hackathons", leader: "Alex Johnson", members: 145, category: "Technology", rating: 4.8, image: "🖥️" },
    { id: 2, name: "Music Club", description: "Express creativity through various musical instruments and vocals", leader: "Sarah Chen", members: 89, category: "Arts", rating: 4.7, image: "🎵" },
    { id: 3, name: "Robotics Club", description: "Design, build, and program robots for competitions", leader: "Mike Rodriguez", members: 67, category: "Engineering", rating: 4.9, image: "🤖" },
    { id: 4, name: "Photography Club", description: "Capture moments and express creativity through photography", leader: "Emma Davis", members: 78, category: "Arts", rating: 4.6, image: "📸" },
    { id: 5, name: "Debate Society", description: "Sharpen critical thinking and public speaking skills", leader: "David Park", members: 54, category: "Academic", rating: 4.5, image: "🎤" },
    { id: 6, name: "Environmental Club", description: "Promote sustainability and environmental awareness on campus", leader: "Luna Green", members: 92, category: "Social Impact", rating: 4.8, image: "🌱" },
    { id: 7, name: "Entrepreneurship Club", description: "Foster innovation and startup culture among students", leader: "James Wilson", members: 76, category: "Business", rating: 4.7, image: "💡" },
    { id: 8, name: "Gaming Club", description: "Unite gamers for tournaments, game development, and fun", leader: "Ryan Kim", members: 134, category: "Entertainment", rating: 4.9, image: "🎮" }
  ],
  events: [
    { id: 1, title: "Hackathon 2025: AI Revolution", club: "Coding Club", date: "2025-08-25", time: "9:00 AM - 9:00 PM", location: "Main Auditorium", category: "Competition", maxParticipants: 200, currentRegistrations: 156, image: "🏆" },
    { id: 2, title: "Open Mic Night: Acoustic Vibes", club: "Music Club", date: "2025-08-22", time: "7:00 PM - 10:00 PM", location: "Student Center", category: "Performance", maxParticipants: 50, currentRegistrations: 23, image: "🎵" },
    { id: 3, title: "Robot Battle Championship", club: "Robotics Club", date: "2025-08-30", time: "3:00 PM - 8:00 PM", location: "Engineering Workshop", category: "Competition", maxParticipants: 32, currentRegistrations: 28, image: "⚔️" },
    { id: 4, title: "Photography Workshop: Portrait Mastery", club: "Photography Club", date: "2025-08-20", time: "10:00 AM - 4:00 PM", location: "Art Studio B", category: "Workshop", maxParticipants: 25, currentRegistrations: 18, image: "📷" },
    { id: 5, title: "Debate Championship: Future of AI", club: "Debate Society", date: "2025-08-27", time: "6:00 PM - 9:00 PM", location: "Conference Room A", category: "Competition", maxParticipants: 16, currentRegistrations: 14, image: "🏛️" },
    { id: 6, title: "Climate Action Summit", club: "Environmental Club", date: "2025-08-21", time: "2:00 PM - 6:00 PM", location: "Biology Lab", category: "Conference", maxParticipants: 100, currentRegistrations: 67, image: "🌍" },
    { id: 7, title: "Startup Pitch Competition", club: "Entrepreneurship Club", date: "2025-08-26", time: "5:00 PM - 9:00 PM", location: "Innovation Hub", category: "Competition", maxParticipants: 15, currentRegistrations: 12, image: "💼" },
    { id: 8, title: "Esports Tournament: League of Legends", club: "Gaming Club", date: "2025-08-24", time: "2:00 PM - 10:00 PM", location: "Gaming Lounge", category: "Competition", maxParticipants: 40, currentRegistrations: 35, image: "🏆" }
  ]
};

const ClubMate = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hey there! 👋 I'm ClubMate, your AI campus companion!\n\n🎯 **I can help you:**\n• Explore 8+ amazing clubs and events\n• Create clubs: \"Create a club called AI Enthusiasts\"\n• Create events: \"Create an event called Tech Meetup\"\n• Delete clubs: \"Delete Gaming Club\"\n• Update details: \"Update Coding Club description\"\n\n🚀 Just talk to me naturally!\n\nWhat would you like to do today? 🎉",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.maxAlternatives = 1;
      
      recognitionInstance.onstart = () => setIsRecording(true);
      
      recognitionInstance.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        if (transcript) {
          setInputText(prev => prev + transcript);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access and try again.');
        }
      };
      
      recognitionInstance.onend = () => setIsRecording(false);
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const startRecording = async () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      if (error.name === 'NotAllowedError') {
        alert('Microphone access denied. Please allow microphone access in your browser settings and try again.');
      } else {
        alert('Failed to start voice recording. Please check your microphone and try again.');
      }
    }
  };

  const stopRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: { clubs: sampleData.clubs, events: sampleData.events }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "Sorry, I'm having trouble connecting right now. Please try again! 🔄",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex overflow-hidden">
      {/* Minimalistic Sidebar */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col overflow-hidden`}>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Campus Stats</h3>
            <button onClick={() => setShowSidebar(false)} className="p-1 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-4 space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-600">Active Clubs</span><span className="font-medium">8</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Upcoming Events</span><span className="font-medium">8</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Total Members</span><span className="font-medium">750+</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Average Rating</span><span className="font-medium">4.7⭐</span></div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Clean Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">ClubMate</h1>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-2xl space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}>
                    {message.type === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          {/* Recording indicator */}
          {isRecording && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-700 text-sm">🎤 Listening...</span>
              </div>
              <button onClick={stopRecording} className="text-red-600 text-sm underline">Stop</button>
            </div>
          )}

          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about clubs, events, or campus life..."
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 focus:outline-none resize-none bg-white"
                rows="1"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)}
                  className={`p-2 rounded-lg transition-colors ${
                    !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
                      ? 'text-gray-300 cursor-not-allowed'
                      : isRecording 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-400 hover:text-blue-500 hover:bg-gray-50'
                  }`}
                  title={isRecording ? 'Stop recording' : 'Start voice input'}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl transition-colors disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubMate;
