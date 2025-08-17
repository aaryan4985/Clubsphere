import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Mic, MicOff } from "lucide-react";

// Sample data
const sampleData = {
  clubs: [
    {
      id: 1,
      name: "Coding Club",
      description:
        "Learn programming, build projects, and participate in hackathons",
      leader: "Alex Johnson",
      members: 145,
      category: "Technology",
      rating: 4.8,
      image: "🖥️",
    },
    {
      id: 2,
      name: "Music Club",
      description:
        "Express creativity through various musical instruments and vocals",
      leader: "Sarah Chen",
      members: 89,
      category: "Arts",
      rating: 4.7,
      image: "🎵",
    },
    {
      id: 3,
      name: "Robotics Club",
      description: "Design, build, and program robots for competitions",
      leader: "Mike Rodriguez",
      members: 67,
      category: "Engineering",
      rating: 4.9,
      image: "🤖",
    },
    {
      id: 4,
      name: "Photography Club",
      description: "Capture moments and express creativity through photography",
      leader: "Emma Davis",
      members: 78,
      category: "Arts",
      rating: 4.6,
      image: "📸",
    },
    {
      id: 5,
      name: "Debate Society",
      description: "Sharpen critical thinking and public speaking skills",
      leader: "David Park",
      members: 54,
      category: "Academic",
      rating: 4.5,
      image: "🎤",
    },
    {
      id: 6,
      name: "Environmental Club",
      description:
        "Promote sustainability and environmental awareness on campus",
      leader: "Luna Green",
      members: 92,
      category: "Social Impact",
      rating: 4.8,
      image: "🌱",
    },
    {
      id: 7,
      name: "Entrepreneurship Club",
      description: "Foster innovation and startup culture among students",
      leader: "James Wilson",
      members: 76,
      category: "Business",
      rating: 4.7,
      image: "💡",
    },
    {
      id: 8,
      name: "Gaming Club",
      description: "Unite gamers for tournaments, game development, and fun",
      leader: "Ryan Kim",
      members: 134,
      category: "Entertainment",
      rating: 4.9,
      image: "🎮",
    },
  ],
  events: [
    {
      id: 1,
      title: "Hackathon 2025: AI Revolution",
      club: "Coding Club",
      date: "2025-08-25",
      time: "9:00 AM - 9:00 PM",
      location: "Main Auditorium",
      category: "Competition",
      maxParticipants: 200,
      currentRegistrations: 156,
      image: "🏆",
    },
    {
      id: 2,
      title: "Open Mic Night: Acoustic Vibes",
      club: "Music Club",
      date: "2025-08-22",
      time: "7:00 PM - 10:00 PM",
      location: "Student Center",
      category: "Performance",
      maxParticipants: 50,
      currentRegistrations: 23,
      image: "🎵",
    },
    {
      id: 3,
      title: "Robot Battle Championship",
      club: "Robotics Club",
      date: "2025-08-30",
      time: "3:00 PM - 8:00 PM",
      location: "Engineering Workshop",
      category: "Competition",
      maxParticipants: 32,
      currentRegistrations: 28,
      image: "⚔️",
    },
    {
      id: 4,
      title: "Photography Workshop: Portrait Mastery",
      club: "Photography Club",
      date: "2025-08-20",
      time: "10:00 AM - 4:00 PM",
      location: "Art Studio B",
      category: "Workshop",
      maxParticipants: 25,
      currentRegistrations: 18,
      image: "📷",
    },
    {
      id: 5,
      title: "Debate Championship: Future of AI",
      club: "Debate Society",
      date: "2025-08-27",
      time: "6:00 PM - 9:00 PM",
      location: "Conference Room A",
      category: "Competition",
      maxParticipants: 16,
      currentRegistrations: 14,
      image: "🏛️",
    },
    {
      id: 6,
      title: "Climate Action Summit",
      club: "Environmental Club",
      date: "2025-08-21",
      time: "2:00 PM - 6:00 PM",
      location: "Biology Lab",
      category: "Conference",
      maxParticipants: 100,
      currentRegistrations: 67,
      image: "🌍",
    },
    {
      id: 7,
      title: "Startup Pitch Competition",
      club: "Entrepreneurship Club",
      date: "2025-08-26",
      time: "5:00 PM - 9:00 PM",
      location: "Innovation Hub",
      category: "Competition",
      maxParticipants: 15,
      currentRegistrations: 12,
      image: "💼",
    },
    {
      id: 8,
      title: "Esports Tournament: League of Legends",
      club: "Gaming Club",
      date: "2025-08-24",
      time: "2:00 PM - 10:00 PM",
      location: "Gaming Lounge",
      category: "Competition",
      maxParticipants: 40,
      currentRegistrations: 35,
      image: "🏆",
    },
  ],
};

const ClubMate = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        '👋 **Welcome to ClubMate!** Your AI-powered campus companion\n\n✨ **What I can help you with:**\n\n🎯 **Explore & Discover**\n• Browse 8+ amazing clubs and upcoming events\n• Get personalized recommendations\n\n🚀 **Create & Manage**\n• "Create a club called AI Enthusiasts"\n• "Create an event called Tech Meetup on Friday"\n• "Update Coding Club description"\n• "Delete Gaming Club"\n\n🎤 **Voice Commands**\n• Click the microphone button and speak naturally\n• "Show me all programming clubs"\n• "What events are happening this week?"\n\n� **Just chat with me naturally!** I understand context and can help with anything campus-related.\n\nWhat would you like to explore today? 🎉',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onstart = () => setIsRecording(true);

      recognitionInstance.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        if (transcript) {
          setInputText((prev) => prev + transcript);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        if (event.error === "not-allowed") {
          alert(
            "Microphone access denied. Please allow microphone access and try again."
          );
        }
      };

      recognitionInstance.onend = () => setIsRecording(false);

      setRecognition(recognitionInstance);
    }
  }, []);

  const startRecording = async () => {
    if (!recognition) {
      alert(
        "Speech recognition is not supported in your browser. Please try Chrome or Edge."
      );
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognition.start();
    } catch (error) {
      console.error("Error starting recognition:", error);
      if (error.name === "NotAllowedError") {
        alert(
          "Microphone access denied. Please allow microphone access in your browser settings and try again."
        );
      } else {
        alert(
          "Failed to start voice recording. Please check your microphone and try again."
        );
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
      type: "user",
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: { clubs: sampleData.clubs, events: sampleData.events },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage = {
          id: Date.now() + 1,
          type: "bot",
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content:
          "Sorry, I'm having trouble connecting right now. Please try again! 🔄",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex overflow-hidden">
      {/* Fixed Enhanced Sidebar with Cool Stats */}
      <div className="w-80 bg-white/95 backdrop-blur-sm border-r border-gray-200/50 flex flex-col overflow-hidden shadow-xl">
        <div className="p-6 border-b border-gray-100/80 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-lg">📊 Campus Hub</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/90 text-xs font-medium">LIVE</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">🎯 Active Clubs</span>
              <span className="font-bold text-blue-600 text-xl">8</span>
            </div>
            <div className="text-xs text-blue-600 mt-1">+2 this month</div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">
                📅 Upcoming Events
              </span>
              <span className="font-bold text-green-600 text-xl">8</span>
            </div>
            <div className="text-xs text-green-600 mt-1">
              Next: Tomorrow 9AM
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">
                👥 Total Members
              </span>
              <span className="font-bold text-purple-600 text-xl">750+</span>
            </div>
            <div className="text-xs text-purple-600 mt-1">
              +23 new this week
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">
                ⭐ Average Rating
              </span>
              <span className="font-bold text-amber-600 text-xl">4.7</span>
            </div>
            <div className="text-xs text-amber-600 mt-1">↗️ Trending up</div>
          </div>

          {/* Cool Activity Feed */}
          <div className="mt-6">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center">
              🔥 Live Activity
              <div className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </h4>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border-l-4 border-blue-400">
                <div className="text-sm font-medium text-gray-800">
                  🎮 Gaming Club
                </div>
                <div className="text-xs text-gray-600">
                  New tournament starting
                </div>
                <div className="text-xs text-blue-600 mt-1">2 min ago</div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-teal-50 p-3 rounded-lg border-l-4 border-green-400">
                <div className="text-sm font-medium text-gray-800">
                  🖥️ Coding Club
                </div>
                <div className="text-xs text-gray-600">
                  Hackathon prep meeting
                </div>
                <div className="text-xs text-green-600 mt-1">5 min ago</div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border-l-4 border-purple-400">
                <div className="text-sm font-medium text-gray-800">
                  🎵 Music Club
                </div>
                <div className="text-xs text-gray-600">
                  Open mic registration
                </div>
                <div className="text-xs text-purple-600 mt-1">12 min ago</div>
              </div>
            </div>
          </div>

          {/* Top Clubs This Week */}
          <div className="mt-6">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center">
              🏆 Trending Clubs
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <span className="text-sm font-medium">🎮 Gaming Club</span>
                </div>
                <span className="text-xs text-orange-600 font-medium">
                  134 members
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    2
                  </div>
                  <span className="text-sm font-medium">🖥️ Coding Club</span>
                </div>
                <span className="text-xs text-gray-600 font-medium">
                  145 members
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    3
                  </div>
                  <span className="text-sm font-medium">
                    🌱 Environmental Club
                  </span>
                </div>
                <span className="text-xs text-amber-600 font-medium">
                  92 members
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6">
            <h4 className="font-bold text-gray-800 mb-3">⚡ Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg hover:from-blue-200 hover:to-blue-300 transition-all text-center">
                <div className="text-lg">📝</div>
                <div className="text-xs font-medium text-blue-800">
                  Create Club
                </div>
              </button>
              <button className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-lg hover:from-green-200 hover:to-green-300 transition-all text-center">
                <div className="text-lg">📅</div>
                <div className="text-xs font-medium text-green-800">
                  New Event
                </div>
              </button>
              <button className="p-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg hover:from-purple-200 hover:to-purple-300 transition-all text-center">
                <div className="text-lg">🔍</div>
                <div className="text-xs font-medium text-purple-800">
                  Search
                </div>
              </button>
              <button className="p-3 bg-gradient-to-r from-pink-100 to-pink-200 rounded-lg hover:from-pink-200 hover:to-pink-300 transition-all text-center">
                <div className="text-lg">⭐</div>
                <div className="text-xs font-medium text-pink-800">
                  Favorites
                </div>
              </button>
            </div>
          </div>

          {/* Campus Weather/Time */}
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl border border-indigo-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-indigo-800">🌤️ Campus Today</span>
              <span className="text-sm text-indigo-600">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold text-indigo-800">72°F</div>
                <div className="text-xs text-indigo-600">Partly Cloudy</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-indigo-800">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="text-xs text-indigo-600">
                  Perfect for events!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-xl">
                ClubMate AI Assistant
              </h1>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 font-medium">
                  Ready to help • Voice enabled
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              🌟 Enhanced UI
            </div>
            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              🎤 Voice Ready
            </div>
          </div>
        </div>

        {/* Enhanced Messages Container */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-2xl space-x-4 ${
                    message.type === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                      message.type === "user"
                        ? "bg-gradient-to-br from-blue-500 to-purple-600"
                        : "bg-gradient-to-br from-gray-600 to-gray-800"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-5 py-4 shadow-lg transition-all duration-200 hover:shadow-xl ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : "bg-white border border-gray-200/50 text-gray-800 backdrop-blur-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-3 ${
                        message.type === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex space-x-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200/50 rounded-2xl px-5 py-4 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Enhanced Input Area */}
        <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200/50 p-6 shadow-lg">
          {/* Enhanced Recording indicator */}
          {isRecording && (
            <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
                <span className="text-red-700 font-medium">
                  🎤 Listening to your voice...
                </span>
              </div>
              <button
                onClick={stopRecording}
                className="text-red-600 font-medium hover:text-red-800 transition-colors px-3 py-1 rounded-lg hover:bg-red-100"
              >
                Stop Recording
              </button>
            </div>
          )}

          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about clubs, events, or campus life... 💬"
                className="w-full border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-2xl px-6 py-4 focus:outline-none resize-none bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200 placeholder:text-gray-400"
                rows="1"
                disabled={isLoading}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={
                    !(
                      "webkitSpeechRecognition" in window ||
                      "SpeechRecognition" in window
                    )
                  }
                  className={`p-3 rounded-xl transition-all duration-200 shadow-sm ${
                    !(
                      "webkitSpeechRecognition" in window ||
                      "SpeechRecognition" in window
                    )
                      ? "text-gray-300 cursor-not-allowed"
                      : isRecording
                      ? "text-red-500 bg-red-50 hover:bg-red-100 shadow-md"
                      : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                  }`}
                  title={isRecording ? "Stop recording" : "Start voice input"}
                >
                  {isRecording ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-8 py-4 rounded-2xl transition-all duration-200 disabled:cursor-not-allowed flex items-center space-x-3 shadow-lg hover:shadow-xl disabled:shadow-sm"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubMate;
