import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Calendar,
  Users,
  Sparkles,
  Bot,
  User,
  Zap,
  GraduationCap,
  UserCheck,
  Plus,
  Eye,
  Settings,
  UserPlus,
  Crown,
  BookOpen,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import api from "../services/api";

const ChatbotModern = () => {
  const [userRole, setUserRole] = useState(null); // null, 'student', 'organizer'
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [showCreateClub, setShowCreateClub] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Load data on component mount
  useEffect(() => {
    loadClubs();
    loadEvents();
  }, []);

  // Initialize chat based on role
  useEffect(() => {
    if (userRole) {
      initializeChat();
    }
  }, [userRole]);

  const initializeChat = () => {
    const roleMessages = {
      student: {
        welcome: `Welcome, Student! 🎓 I'm here to help you discover amazing clubs and events at your institution. You can explore clubs, view events, and register for activities that interest you!`,
        suggestions: [
          "Show all clubs",
          "View upcoming events", 
          "Find clubs by interest",
          "Show my registrations",
          "What's happening this week?"
        ]
      },
      organizer: {
        welcome: `Welcome, Event Organizer! 👑 I'm your assistant for managing clubs and creating amazing events. You have full access to create, edit, and manage all club activities!`,
        suggestions: [
          "Create a new club",
          "Create an event",
          "Manage my clubs",
          "View all events",
          "Club analytics"
        ]
      }
    };

    const roleData = roleMessages[userRole];
    setMessages([
      {
        id: 1,
        type: "bot",
        content: roleData.welcome,
        suggestions: roleData.suggestions,
        timestamp: new Date(),
      }
    ]);
  };

  const loadClubs = async () => {
    try {
      const response = await api.get("/api/clubs");
      setClubs(response.data);
    } catch (error) {
      console.error("Error loading clubs:", error);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await api.get("/api/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  const sendToAI = async (message) => {
    try {
      const context = `
User Role: ${userRole}
Current clubs: ${clubs.length} clubs (${clubs.map(c => c.name).join(', ')})
Upcoming events: ${events.length} events
User capabilities: ${userRole === 'organizer' ? 'Can create/manage clubs and events' : 'Can view and register for events'}
      `;
      
      const response = await api.post("/api/ai/chat", {
        message,
        context,
      });
      
      return response.data.response;
    } catch (error) {
      console.error("AI Error:", error);
      return `I'm having trouble connecting to my AI brain right now, but I can still help you with ${userRole === 'organizer' ? 'club and event management' : 'finding clubs and events'}! 🤖`;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Check for specific commands
    const lowerInput = input.toLowerCase();
    let botResponse;
    let suggestions = [];

    if (lowerInput.includes("show") && lowerInput.includes("club")) {
      botResponse = await handleShowClubs();
      suggestions = userRole === 'organizer' 
        ? ["Create a new club", "Manage clubs", "Create event"]
        : ["View club details", "Find similar clubs", "Show events"];
    } else if (lowerInput.includes("create") && lowerInput.includes("club")) {
      if (userRole === 'organizer') {
        setShowCreateClub(true);
        botResponse = "I'll help you create a new club! Please fill out the form below.";
        suggestions = ["Cancel", "Show existing clubs"];
      } else {
        botResponse = "I'm sorry, but only organizers can create clubs. However, I can help you find existing clubs to join!";
        suggestions = ["Show all clubs", "Find clubs by interest", "Contact organizers"];
      }
    } else if (lowerInput.includes("show") && lowerInput.includes("event")) {
      botResponse = await handleShowEvents();
      suggestions = userRole === 'organizer'
        ? ["Create an event", "Manage events", "Event analytics"]
        : ["Register for event", "View event details", "Find more events"];
    } else if (lowerInput.includes("create") && lowerInput.includes("event")) {
      if (userRole === 'organizer') {
        setShowCreateEvent(true);
        botResponse = "Let's create an amazing event! Please fill out the details below.";
        suggestions = ["Cancel", "Show existing events"];
      } else {
        botResponse = "Only organizers can create events, but I can help you discover exciting events to attend!";
        suggestions = ["Show upcoming events", "Find events by category", "Contact organizers"];
      }
    } else if (lowerInput.includes("register") || lowerInput.includes("join")) {
      if (userRole === 'student') {
        botResponse = await handleRegistration(lowerInput);
        suggestions = ["View my registrations", "Find more events", "Show club details"];
      } else {
        botResponse = "As an organizer, you can manage registrations for your events. Would you like to see registration data?";
        suggestions = ["View registrations", "Manage events", "Create new event"];
      }
    } else {
      // Send to AI for general questions
      botResponse = await sendToAI(input);
      suggestions = userRole === 'organizer'
        ? ["Create something new", "Manage my content", "View analytics", "Help"]
        : ["Explore clubs", "Find events", "Get recommendations", "Help"];
    }

    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: botResponse,
        suggestions,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleShowClubs = async () => {
    await loadClubs();
    if (clubs.length === 0) {
      return userRole === 'organizer' 
        ? "No clubs found yet! Why don't you create the first one? 🚀"
        : "No clubs available yet. Check back soon for new clubs to join! 🏛️";
    }
    
    const clubsList = clubs.map((club) => 
      `🏛️ **${club.name}**\n${club.description || "No description"}\n👥 ${club.member_count || 0} members\n`
    ).join("\n");

    return userRole === 'organizer'
      ? `Here are all ${clubs.length} clubs you can manage:\n\n${clubsList}`
      : `Discover ${clubs.length} amazing clubs you can join:\n\n${clubsList}`;
  };

  const handleShowEvents = async () => {
    await loadEvents();
    if (events.length === 0) {
      return userRole === 'organizer'
        ? "No events scheduled yet! Ready to create the first one? 🎉"
        : "No events available yet. Stay tuned for exciting events! 📅";
    }

    const eventsList = events.map((event) =>
      `📅 **${event.title}**\n🏛️ ${event.club_name}\n📍 ${event.location || "Location TBD"}\n⏰ ${format(new Date(event.date), "PPP")}\n`
    ).join("\n");

    return userRole === 'organizer'
      ? `Events you can manage (${events.length}):\n\n${eventsList}`
      : `Upcoming events you can attend (${events.length}):\n\n${eventsList}`;
  };

  const handleRegistration = async (input) => {
    // Simulate registration logic
    return "I've noted your interest! In a full system, this would register you for the event and send confirmation details. 🎊";
  };

  const handleSuggestionClick = async (suggestion) => {
    setInput(suggestion);
    // Simulate typing the suggestion
    const event = { preventDefault: () => {}, key: "Enter" };
    setTimeout(() => handleSend(), 100);
  };

  const handleCreateClub = async (clubData) => {
    try {
      await api.post("/api/clubs", clubData);
      setShowCreateClub(false);
      await loadClubs();
      
      const successMessage = {
        id: Date.now(),
        type: "bot",
        content: `🎉 Awesome! "${clubData.name}" has been created successfully! Ready to invite members or create events?`,
        suggestions: ["Create an event", "Invite members", "Manage club settings"],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMessage]);
      toast.success("Club created successfully!");
    } catch (error) {
      toast.error("Error creating club");
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      await api.post("/api/events", eventData);
      setShowCreateEvent(false);
      await loadEvents();
      
      const successMessage = {
        id: Date.now(),
        type: "bot",
        content: `🎊 Perfect! "${eventData.title}" has been scheduled! Members can now register for this event.`,
        suggestions: ["View registrations", "Create another event", "Promote event"],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMessage]);
      toast.success("Event created successfully!");
    } catch (error) {
      toast.error("Error creating event");
    }
  };

  // Role Selection Component
  const RoleSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full opacity-20 blur-xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-flex p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6"
          >
            <Sparkles className="h-12 w-12 text-white" />
          </motion.div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Welcome to ClubSphere
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your role to get started with personalized features and capabilities tailored just for you!
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Student Card */}
          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setUserRole('student')}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 cursor-pointer hover:shadow-2xl transition-all duration-300"
          >
            <div className="text-center">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="inline-flex p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-6"
              >
                <GraduationCap className="h-12 w-12 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Student</h2>
              <p className="text-gray-600 mb-6">
                Discover clubs, attend events, and connect with your community
              </p>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-700">Browse and explore clubs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-700">View and register for events</span>
                </div>
                <div className="flex items-center space-x-3">
                  <UserPlus className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-700">Join clubs and communities</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-700">Access learning resources</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all"
              >
                Continue as Student
              </motion.button>
            </div>
          </motion.div>

          {/* Organizer Card */}
          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setUserRole('organizer')}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 cursor-pointer hover:shadow-2xl transition-all duration-300"
          >
            <div className="text-center">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="inline-flex p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6"
              >
                <Crown className="h-12 w-12 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Organizer</h2>
              <p className="text-gray-600 mb-6">
                Create and manage clubs, organize events, and build communities
              </p>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <Plus className="h-5 w-5 text-purple-500" />
                  <span className="text-sm text-gray-700">Create and manage clubs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <span className="text-sm text-gray-700">Organize events and activities</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-purple-500" />
                  <span className="text-sm text-gray-700">Manage member registrations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5 text-purple-500" />
                  <span className="text-sm text-gray-700">Access admin tools and analytics</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Continue as Organizer
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-sm">
            You can always switch roles later in your profile settings
          </p>
        </motion.div>
      </motion.div>
    </div>
  );

  // Show role selection if no role is chosen
  if (!userRole) {
    return <RoleSelection />;
  }

  // Main Chat Interface (same as before but with role-based modifications)
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-green-300 to-teal-300 rounded-full opacity-15 blur-lg"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-4 h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 mb-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`p-3 rounded-xl ${
                  userRole === 'student' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}
              >
                {userRole === 'student' ? (
                  <GraduationCap className="h-8 w-8 text-white" />
                ) : (
                  <Crown className="h-8 w-8 text-white" />
                )}
              </motion.div>
              <div>
                <h1 className={`text-3xl font-bold bg-gradient-to-r ${
                  userRole === 'student' 
                    ? 'from-blue-600 to-cyan-600'
                    : 'from-purple-600 to-pink-600'
                } bg-clip-text text-transparent`}>
                  ClubSphere AI
                </h1>
                <p className="text-gray-600 text-sm">
                  {userRole === 'student' ? '🎓 Student Mode' : '👑 Organizer Mode'} • Powered by Gemini AI
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setUserRole(null)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-600 transition-colors"
            >
              Switch Role
            </motion.button>
          </div>
        </motion.div>

        {/* Chat Messages */}
        <div className="flex-1 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.type === "user"
                        ? userRole === 'student'
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                          : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "bg-white shadow-md border border-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {message.type === "user" ? (
                        userRole === 'student' ? (
                          <GraduationCap className="h-4 w-4" />
                        ) : (
                          <Crown className="h-4 w-4" />
                        )
                      ) : (
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Bot className="h-4 w-4 text-purple-500" />
                        </motion.div>
                      )}
                      <span className="text-xs opacity-75">
                        {format(message.timestamp, "HH:mm")}
                      </span>
                    </div>
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>
                    {message.suggestions && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`px-3 py-1 rounded-full text-xs hover:shadow-md transition-all ${
                              userRole === 'student'
                                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                            }`}
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white shadow-md border border-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Bot className="h-4 w-4 text-purple-500" />
                    </motion.div>
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                          className="w-2 h-2 bg-purple-400 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 flex space-x-3"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder={`Ask me about ${userRole === 'student' ? 'clubs and events to join' : 'creating and managing activities'}...`}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              />
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <Zap className="h-4 w-4 text-purple-400" />
              </motion.div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`px-6 py-3 text-white rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                userRole === 'student'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
              }`}
            >
              <Send className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Create Club Modal (Only for Organizers) */}
      <AnimatePresence>
        {showCreateClub && userRole === 'organizer' && (
          <CreateClubModal
            onClose={() => setShowCreateClub(false)}
            onSubmit={handleCreateClub}
          />
        )}
      </AnimatePresence>

      {/* Create Event Modal (Only for Organizers) */}
      <AnimatePresence>
        {showCreateEvent && userRole === 'organizer' && (
          <CreateEventModal
            clubs={clubs}
            onClose={() => setShowCreateEvent(false)}
            onSubmit={handleCreateEvent}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Create Club Modal Component (for Organizers)
const CreateClubModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Create New Club</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Club Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter club name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Describe your club"
              rows="3"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Create Club
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Create Event Modal Component (for Organizers)
const CreateEventModal = ({ clubs, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    club_id: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date || !formData.club_id) return;
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-pink-100 rounded-lg">
            <Calendar className="h-6 w-6 text-pink-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Create New Event</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter event title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Club
            </label>
            <select
              value={formData.club_id}
              onChange={(e) =>
                setFormData({ ...formData, club_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            >
              <option value="">Select a club</option>
              {clubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter event location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Describe your event"
              rows="3"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            >
              Create Event
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ChatbotModern;
