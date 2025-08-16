import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Calendar,
  Users,
  Plus,
  List,
  Bot,
  User,
  Clock,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import api from "../services/api";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Welcome to ClubSphere! 🎉 I can help you manage events and clubs. Here are some things you can ask me:",
      suggestions: [
        "Show all clubs",
        "Create a new club",
        "Show upcoming events",
        "Create an event",
        "List all events",
      ],
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
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

  const addMessage = (
    content,
    type = "user",
    data = null,
    suggestions = null
  ) => {
    const newMessage = {
      id: Date.now(),
      type,
      content,
      data,
      suggestions,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleCreateClub = async (clubData) => {
    try {
      const response = await api.post("/api/clubs", clubData);
      await loadClubs();
      addMessage(`✅ Club "${clubData.name}" created successfully!`, "bot");
      toast.success("Club created successfully!");
    } catch (error) {
      addMessage(
        `❌ Error creating club: ${
          error.response?.data?.message || "Unknown error"
        }`,
        "bot"
      );
      toast.error("Failed to create club");
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      const response = await api.post("/api/events", eventData);
      await loadEvents();
      addMessage(`✅ Event "${eventData.title}" created successfully!`, "bot");
      toast.success("Event created successfully!");
    } catch (error) {
      addMessage(
        `❌ Error creating event: ${
          error.response?.data?.message || "Unknown error"
        }`,
        "bot"
      );
      toast.error("Failed to create event");
    }
  };

  const processMessage = async (message) => {
    const lowerMessage = message.toLowerCase();

    // Show clubs
    if (
      lowerMessage.includes("show clubs") ||
      lowerMessage.includes("list clubs") ||
      lowerMessage.includes("all clubs")
    ) {
      if (clubs.length === 0) {
        addMessage(
          "No clubs available yet. Would you like to create one?",
          "bot",
          null,
          ["Create a new club"]
        );
      } else {
        addMessage(`Found ${clubs.length} clubs:`, "bot", {
          type: "clubs",
          items: clubs,
        });
      }
      return;
    }

    // Show events
    if (
      lowerMessage.includes("show events") ||
      lowerMessage.includes("list events") ||
      lowerMessage.includes("all events") ||
      lowerMessage.includes("upcoming events")
    ) {
      const upcomingEvents = events.filter(
        (event) => new Date(event.start_time) > new Date()
      );
      if (upcomingEvents.length === 0) {
        addMessage(
          "No upcoming events found. Would you like to create one?",
          "bot",
          null,
          ["Create an event"]
        );
      } else {
        addMessage(`Found ${upcomingEvents.length} upcoming events:`, "bot", {
          type: "events",
          items: upcomingEvents,
        });
      }
      return;
    }

    // Create club
    if (
      lowerMessage.includes("create club") ||
      lowerMessage.includes("new club")
    ) {
      addMessage(
        "I'll help you create a new club! Please provide the club details:",
        "bot",
        { type: "createClub" }
      );
      return;
    }

    // Create event
    if (
      lowerMessage.includes("create event") ||
      lowerMessage.includes("new event")
    ) {
      if (clubs.length === 0) {
        addMessage(
          "You need to create a club first before creating events. Would you like to create a club?",
          "bot",
          null,
          ["Create a new club"]
        );
      } else {
        addMessage(
          "I'll help you create a new event! Please provide the event details:",
          "bot",
          { type: "createEvent", clubs }
        );
      }
      return;
    }

    // Help or default response
    addMessage("I can help you with:", "bot", null, [
      "Show all clubs",
      "Create a new club",
      "Show upcoming events",
      "Create an event",
      "List all events",
    ]);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    addMessage(userMessage, "user");

    setIsTyping(true);

    // Simulate typing delay
    setTimeout(async () => {
      await processMessage(userMessage);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    handleSendMessage();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const ClubCard = ({ club }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-2">
      <h3 className="font-semibold text-gray-900">{club.name}</h3>
      <p className="text-gray-600 text-sm mt-1">
        {club.description || "No description"}
      </p>
      <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
        <span>👤 {club.leader_name}</span>
        <span>👥 {club.member_count} members</span>
      </div>
    </div>
  );

  const EventCard = ({ event }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-2">
      <h3 className="font-semibold text-gray-900">{event.title}</h3>
      <p className="text-gray-600 text-sm mt-1">{event.club_name}</p>
      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
        <span className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          {format(new Date(event.start_time), "MMM dd, yyyy")}
        </span>
        <span className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {format(new Date(event.start_time), "h:mm a")}
        </span>
        {event.location && (
          <span className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {event.location}
          </span>
        )}
      </div>
    </div>
  );

  const CreateClubForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({ name: "", description: "" });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (formData.name.trim()) {
        onSubmit(formData);
      }
    };

    return (
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg border border-gray-200 space-y-3"
      >
        <h3 className="font-semibold text-gray-900">Create New Club</h3>
        <input
          type="text"
          placeholder="Club name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
        <textarea
          placeholder="Club description (optional)"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={3}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Create Club
        </button>
      </form>
    );
  };

  const CreateEventForm = ({ onSubmit, clubs }) => {
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      club_id: "",
      start_time: "",
      end_time: "",
      location: "",
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (
        formData.title.trim() &&
        formData.club_id &&
        formData.start_time &&
        formData.end_time
      ) {
        onSubmit(formData);
      }
    };

    return (
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg border border-gray-200 space-y-3"
      >
        <h3 className="font-semibold text-gray-900">Create New Event</h3>

        <select
          value={formData.club_id}
          onChange={(e) =>
            setFormData({ ...formData, club_id: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select a club</option>
          {clubs.map((club) => (
            <option key={club.id} value={club.id}>
              {club.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Event title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />

        <textarea
          placeholder="Event description (optional)"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={2}
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            type="datetime-local"
            value={formData.start_time}
            onChange={(e) =>
              setFormData({ ...formData, start_time: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md"
            min={new Date().toISOString().slice(0, 16)}
            required
          />
          <input
            type="datetime-local"
            value={formData.end_time}
            onChange={(e) =>
              setFormData({ ...formData, end_time: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md"
            min={formData.start_time || new Date().toISOString().slice(0, 16)}
            required
          />
        </div>

        <input
          type="text"
          placeholder="Location (optional)"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-md"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Create Event
        </button>
      </form>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <Bot className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              ClubSphere AI Assistant
            </h1>
            <p className="text-sm text-gray-600">
              Your personal event and club management helper
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start space-x-2 max-w-xs lg:max-w-2xl ${
                  message.type === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === "user" ? "bg-blue-600" : "bg-gray-600"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    message.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-900 border border-gray-200"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>

                  {/* Render data based on type */}
                  {message.data && (
                    <div className="mt-3">
                      {message.data.type === "clubs" && (
                        <div className="space-y-2">
                          {message.data.items.map((club) => (
                            <ClubCard key={club.id} club={club} />
                          ))}
                        </div>
                      )}

                      {message.data.type === "events" && (
                        <div className="space-y-2">
                          {message.data.items.map((event) => (
                            <EventCard key={event.id} event={event} />
                          ))}
                        </div>
                      )}

                      {message.data.type === "createClub" && (
                        <CreateClubForm onSubmit={handleCreateClub} />
                      )}

                      {message.data.type === "createEvent" && (
                        <CreateEventForm
                          onSubmit={handleCreateEvent}
                          clubs={message.data.clubs}
                        />
                      )}
                    </div>
                  )}

                  {/* Suggestions */}
                  {message.suggestions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="text-xs opacity-70 mt-2">
                    {format(message.timestamp, "HH:mm")}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white text-gray-900 border border-gray-200 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about clubs and events..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
