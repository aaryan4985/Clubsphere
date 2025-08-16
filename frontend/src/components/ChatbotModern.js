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
  Crown,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import api from "../services/api";

const Chatbot = () => {
  const [userRole, setUserRole] = useState(null); // null, 'student', 'organizer'
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Welcome to ClubSphere! ✨ I'm your AI assistant powered by Gemini. Are you a Student looking to join clubs and events, or an Organizer managing activities?",
      suggestions: [
        "I'm a Student 🎓",
        "I'm an Organizer 👑", 
        "Show all clubs",
        "Tell me about ClubSphere",
        "What can you do?",
      ],
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [showCreateClub, setShowCreateClub] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
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

  // Initialize chat when role is selected
  useEffect(() => {
    if (userRole) {
      initializeRoleBasedChat();
    }
  }, [userRole]);

  const initializeRoleBasedChat = () => {
    const welcomeMessages = {
      student: {
        content: "Welcome, Student! 🎓 I'm here to help you discover amazing clubs and events. You can explore clubs, view events, and register for activities that interest you!",
        suggestions: ["Show all clubs", "View upcoming events", "Find clubs by interest", "What's happening this week?"]
      },
      organizer: {
        content: "Welcome, Event Organizer! 👑 I'm your assistant for managing clubs and creating amazing events. You have full access to create, edit, and manage all club activities!",
        suggestions: ["Create a new club", "Create an event", "Manage my clubs", "View all events"]
      }
    };

    const roleData = welcomeMessages[userRole];
    setMessages([{
      id: 1,
      type: "bot",
      content: roleData.content,
      suggestions: roleData.suggestions,
      timestamp: new Date(),
    }]);
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
Current clubs: ${clubs.length} clubs (${clubs.map(c => c.name).join(', ')})
Upcoming events: ${events.length} events
      `;
      
      const response = await api.post("/api/ai/chat", {
        message,
        context,
      });
      
      return response.data.response;
    } catch (error) {
      console.error("AI Error:", error);
      return "I'm having trouble connecting to my AI brain right now, but I can still help you with basic club and event management! 🤖";
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
      suggestions = ["Create a new club", "Show events", "Join a club"];
    } else if (lowerInput.includes("create") && lowerInput.includes("club")) {
      setShowCreateClub(true);
      botResponse = "I'll help you create a new club! Please fill out the form below.";
      suggestions = ["Cancel", "Show existing clubs"];
    } else if (lowerInput.includes("show") && lowerInput.includes("event")) {
      botResponse = await handleShowEvents();
      suggestions = ["Create an event", "Show clubs", "What's next week?"];
    } else if (lowerInput.includes("create") && lowerInput.includes("event")) {
      setShowCreateEvent(true);
      botResponse = "Let's create an amazing event! Please fill out the details below.";
      suggestions = ["Cancel", "Show existing events"];
    } else {
      // Send to AI for general questions
      botResponse = await sendToAI(input);
      suggestions = [
        "Show my clubs",
        "Create something new",
        "What can you do?",
        "Tell me more",
      ];
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
      return "No clubs found yet! Why don't you create the first one? 🚀";
    }
    return `Here are all ${clubs.length} clubs:\n\n${clubs
      .map(
        (club) =>
          `🏛️ **${club.name}**\n${club.description || "No description"}\n👥 ${
            club.member_count || 0
          } members\n`
      )
      .join("\n")}`;
  };

  const handleShowEvents = async () => {
    await loadEvents();
    if (events.length === 0) {
      return "No events scheduled yet! Ready to create the first one? 🎉";
    }
    return `Upcoming events (${events.length}):\n\n${events
      .map(
        (event) =>
          `📅 **${event.title}**\n🏛️ ${event.club_name}\n📍 ${
            event.location || "Location TBD"
          }\n⏰ ${format(new Date(event.date), "PPP")}\n`
      )
      .join("\n")}`;
  };

  const handleSuggestionClick = async (suggestion) => {
    setInput(suggestion);
    await handleSend();
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
        suggestions: ["Create an event", "Show all clubs", "Invite members"],
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
        content: `🎊 Perfect! "${eventData.title}" has been scheduled! I can help you with more events or other tasks.`,
        suggestions: ["Show all events", "Create another event", "Show clubs"],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMessage]);
      toast.success("Event created successfully!");
    } catch (error) {
      toast.error("Error creating event");
    }
  };

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
          <div className="flex items-center justify-center space-x-3">
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
              className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl"
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ClubSphere AI
              </h1>
              <p className="text-gray-600 text-sm">Powered by Gemini AI ✨</p>
            </div>
          </div>
        </motion.div>

        {/* Chat Messages */}
        <div className="flex-1 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
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
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "bg-white shadow-md border border-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {message.type === "user" ? (
                        <User className="h-4 w-4" />
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
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs hover:bg-purple-200 transition-colors"
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
                placeholder="Ask me anything about clubs and events..."
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
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              <Send className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Create Club Modal */}
      <AnimatePresence>
        {showCreateClub && (
          <CreateClubModal
            onClose={() => setShowCreateClub(false)}
            onSubmit={handleCreateClub}
          />
        )}
      </AnimatePresence>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateEvent && (
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

// Create Club Modal Component
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

// Create Event Modal Component
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

export default Chatbot;
