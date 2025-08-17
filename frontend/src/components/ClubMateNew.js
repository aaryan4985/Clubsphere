import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Calendar,
  Users,
  Clock,
  Star,
  Heart,
  Share2,
  Menu,
  X,
  Zap,
  Plus,
  Edit,
  Trash2,
  Lightbulb,
  TrendingUp,
  Mic,
  MicOff,
} from "lucide-react";
import "../styles/clubmate.css";

// Enhanced sample data with more clubs, events, and features
const sampleData = {
  clubs: [
    {
      id: 1,
      name: "Coding Club",
      description:
        "Learn programming, build projects, and participate in hackathons",
      leader: "Alex Johnson",
      members: 145,
      meetingTime: "Wednesdays 6:00 PM",
      location: "Computer Lab 101",
      category: "Technology",
      rating: 4.8,
      image: "🖥️",
      interests: [
        "programming",
        "coding",
        "software",
        "hackathons",
        "tech",
        "development",
        "javascript",
        "python",
        "react",
      ],
      upcomingMeetings: ["Aug 21", "Aug 28", "Sep 4"],
      achievements: [
        "Won Inter-College Hackathon 2024",
        "50+ projects completed",
        "Industry partnerships",
      ],
      socialLinks: { discord: "#coding-club", instagram: "@codingclub_campus" },
    },
    {
      id: 2,
      name: "Music Club",
      description:
        "Express creativity through various musical instruments and vocals",
      leader: "Sarah Chen",
      members: 89,
      meetingTime: "Fridays 4:00 PM",
      location: "Music Room 203",
      category: "Arts",
      rating: 4.7,
      image: "🎵",
      interests: [
        "music",
        "singing",
        "instruments",
        "band",
        "performance",
        "guitar",
        "piano",
        "drums",
        "vocals",
      ],
      upcomingMeetings: ["Aug 23", "Aug 30", "Sep 6"],
      achievements: [
        "Annual Concert 500+ audience",
        "Regional Music Competition Winners",
        "10+ bands formed",
      ],
      socialLinks: { youtube: "MusicClubCampus", instagram: "@campusmusic" },
    },
    {
      id: 3,
      name: "Robotics Club",
      description: "Design, build, and program robots for competitions",
      leader: "Mike Rodriguez",
      members: 67,
      meetingTime: "Tuesdays and Thursdays 5:30 PM",
      location: "Engineering Workshop",
      category: "Engineering",
      rating: 4.9,
      image: "🤖",
      interests: [
        "robotics",
        "engineering",
        "programming",
        "automation",
        "arduino",
        "sensors",
        "AI",
        "competitions",
      ],
      upcomingMeetings: ["Aug 20", "Aug 22", "Aug 27"],
      achievements: [
        "National Champions 2024",
        "15+ competition wins",
        "Patent filed for innovation",
      ],
      socialLinks: { discord: "#robotics-hub", instagram: "@campusrobotics" },
    },
    {
      id: 4,
      name: "Photography Club",
      description: "Capture moments and develop photography skills",
      leader: "Emma Davis",
      members: 78,
      meetingTime: "Saturdays 2:00 PM",
      location: "Art Studio B",
      category: "Arts",
      rating: 4.6,
      image: "📸",
      interests: [
        "photography",
        "art",
        "creativity",
        "portraits",
        "landscape",
        "editing",
        "photoshop",
        "exhibitions",
      ],
      upcomingMeetings: ["Aug 24", "Aug 31", "Sep 7"],
      achievements: [
        "Campus Photo Exhibition",
        "Photography Contest Winners",
        "Professional workshops",
      ],
      socialLinks: {
        instagram: "@campusphotography",
        flickr: "CampusPhotoClub",
      },
    },
    {
      id: 5,
      name: "Debate Society",
      description: "Enhance public speaking and critical thinking skills",
      leader: "David Park",
      members: 54,
      meetingTime: "Mondays 7:00 PM",
      location: "Debate Hall",
      category: "Academic",
      rating: 4.5,
      image: "🎤",
      interests: [
        "debate",
        "public speaking",
        "critical thinking",
        "argumentation",
        "politics",
        "current events",
        "rhetoric",
      ],
      upcomingMeetings: ["Aug 19", "Aug 26", "Sep 2"],
      achievements: [
        "Inter-College Debate Champions",
        "Model UN participation",
        "Leadership development",
      ],
      socialLinks: {
        discord: "#debate-society",
        linkedin: "Campus Debate Society",
      },
    },
    {
      id: 6,
      name: "Environmental Club",
      description: "Promote sustainability and environmental awareness",
      leader: "Luna Green",
      members: 92,
      meetingTime: "Wednesdays 5:00 PM",
      location: "Green Campus Center",
      category: "Social Impact",
      rating: 4.8,
      image: "🌱",
      interests: [
        "environment",
        "sustainability",
        "climate",
        "conservation",
        "recycling",
        "green energy",
        "activism",
      ],
      upcomingMeetings: ["Aug 21", "Aug 28", "Sep 4"],
      achievements: [
        "Campus Carbon Neutral Initiative",
        "Tree planting drives",
        "Waste reduction programs",
      ],
      socialLinks: { instagram: "@greencampus", twitter: "@EcoClubCampus" },
    },
    {
      id: 7,
      name: "Entrepreneurship Club",
      description: "Foster innovation and startup culture",
      leader: "James Wilson",
      members: 76,
      meetingTime: "Thursdays 6:30 PM",
      location: "Innovation Hub",
      category: "Business",
      rating: 4.7,
      image: "💡",
      interests: [
        "entrepreneurship",
        "startups",
        "innovation",
        "business",
        "pitch",
        "funding",
        "networking",
        "leadership",
      ],
      upcomingMeetings: ["Aug 22", "Aug 29", "Sep 5"],
      achievements: [
        "5 startups launched",
        "$50K funding secured",
        "Mentor network established",
      ],
      socialLinks: {
        linkedin: "Campus Entrepreneurs",
        discord: "#startup-hub",
      },
    },
    {
      id: 8,
      name: "Gaming Club",
      description: "Competitive gaming and game development",
      leader: "Ryan Kim",
      members: 134,
      meetingTime: "Daily 7:00 PM",
      location: "Gaming Lounge",
      category: "Gaming",
      rating: 4.9,
      image: "🎮",
      interests: [
        "gaming",
        "esports",
        "game development",
        "tournaments",
        "streaming",
        "competitive",
        "unity",
        "unreal",
      ],
      upcomingMeetings: ["Daily sessions", "Tournament prep", "Dev workshops"],
      achievements: [
        "Regional Esports Champions",
        "Game dev showcase",
        "Twitch partnership",
      ],
      socialLinks: { twitch: "CampusGamingClub", discord: "#gaming-central" },
    },
  ],
  events: [
    {
      id: 1,
      title: "Hackathon 2025: AI Revolution",
      description:
        "24-hour coding marathon focused on AI and machine learning solutions",
      club: "Coding Club",
      date: "2025-08-25",
      time: "9:00 AM - 9:00 PM",
      location: "Main Auditorium",
      category: "Competition",
      maxParticipants: 200,
      currentRegistrations: 156,
      difficulty: "Intermediate",
      prizes: [
        "$5000 First Prize",
        "Internship opportunities",
        "Mentorship programs",
      ],
      requirements: [
        "Laptop required",
        "Programming experience preferred",
        "Teams of 2-4",
      ],
      image: "💻",
      organizer: "Alex Johnson",
      registrationDeadline: "2025-08-20",
      tags: ["hackathon", "AI", "coding", "competition", "prizes"],
    },
    {
      id: 2,
      title: "Open Mic Night: Acoustic Vibes",
      description:
        "Showcase your musical talents in a cozy, supportive environment",
      club: "Music Club",
      date: "2025-08-22",
      time: "7:00 PM - 10:00 PM",
      location: "Student Center",
      category: "Performance",
      maxParticipants: 50,
      currentRegistrations: 32,
      difficulty: "All Levels",
      prizes: [
        "Audience Choice Award",
        "Recording studio session",
        "Performance opportunities",
      ],
      requirements: [
        "Bring your instrument",
        "2-song maximum",
        "Original content encouraged",
      ],
      image: "🎤",
      organizer: "Sarah Chen",
      registrationDeadline: "2025-08-21",
      tags: ["music", "performance", "acoustic", "talent show"],
    },
    {
      id: 3,
      title: "Robot Battle Championship",
      description: "Epic robot battles with custom-built fighting machines",
      club: "Robotics Club",
      date: "2025-08-30",
      time: "3:00 PM - 8:00 PM",
      location: "Engineering Workshop",
      category: "Competition",
      maxParticipants: 32,
      currentRegistrations: 28,
      difficulty: "Advanced",
      prizes: [
        "Championship trophy",
        "Arduino starter kits",
        "Tech industry visits",
      ],
      requirements: [
        "Self-built robot required",
        "Weight limit: 5kg",
        "Safety regulations apply",
      ],
      image: "⚔️",
      organizer: "Mike Rodriguez",
      registrationDeadline: "2025-08-25",
      tags: ["robotics", "battle", "competition", "engineering"],
    },
    {
      id: 4,
      title: "Photography Workshop: Portrait Mastery",
      description: "Professional techniques for stunning portrait photography",
      club: "Photography Club",
      date: "2025-08-20",
      time: "10:00 AM - 4:00 PM",
      location: "Art Studio B",
      category: "Workshop",
      maxParticipants: 25,
      currentRegistrations: 18,
      difficulty: "Beginner",
      prizes: [
        "Certificate of completion",
        "Photography portfolio review",
        "Equipment discounts",
      ],
      requirements: [
        "Camera (DSLR/Mirrorless preferred)",
        "Notebook for notes",
        "Enthusiasm to learn",
      ],
      image: "📷",
      organizer: "Emma Davis",
      registrationDeadline: "2025-08-18",
      tags: ["photography", "workshop", "portrait", "learning"],
    },
    {
      id: 5,
      title: "Startup Pitch Competition",
      description:
        "Present your startup ideas to real investors and industry experts",
      club: "Entrepreneurship Club",
      date: "2025-08-26",
      time: "5:00 PM - 9:00 PM",
      location: "Innovation Hub",
      category: "Competition",
      maxParticipants: 15,
      currentRegistrations: 12,
      difficulty: "Advanced",
      prizes: [
        "$10,000 seed funding",
        "Mentorship program",
        "Incubator placement",
      ],
      requirements: [
        "Business plan required",
        "5-minute pitch presentation",
        "Financial projections",
      ],
      image: "💼",
      organizer: "James Wilson",
      registrationDeadline: "2025-08-23",
      tags: ["startup", "pitch", "entrepreneurship", "funding"],
    },
    {
      id: 6,
      title: "Climate Action Summit",
      description:
        "Collaborative workshop on campus sustainability initiatives",
      club: "Environmental Club",
      date: "2025-08-28",
      time: "1:00 PM - 6:00 PM",
      location: "Green Campus Center",
      category: "Workshop",
      maxParticipants: 80,
      currentRegistrations: 45,
      difficulty: "All Levels",
      prizes: [
        "Sustainability certificate",
        "Eco-friendly starter kit",
        "Green project funding",
      ],
      requirements: [
        "Environmental passion",
        "Notebook for brainstorming",
        "Open mind for collaboration",
      ],
      image: "🌍",
      organizer: "Luna Green",
      registrationDeadline: "2025-08-24",
      tags: ["environment", "sustainability", "workshop", "climate"],
    },
    {
      id: 7,
      title: "Debate Championship: Future of Technology",
      description: "Formal debate tournament on technology's impact on society",
      club: "Debate Society",
      date: "2025-08-23",
      time: "2:00 PM - 7:00 PM",
      location: "Debate Hall",
      category: "Competition",
      maxParticipants: 32,
      currentRegistrations: 24,
      difficulty: "Intermediate",
      prizes: [
        "Championship trophy",
        "Public speaking certification",
        "Leadership workshop access",
      ],
      requirements: [
        "Research preparation",
        "Formal attire",
        "Respect for opposing views",
      ],
      image: "🏆",
      organizer: "David Park",
      registrationDeadline: "2025-08-20",
      tags: ["debate", "competition", "technology", "speaking"],
    },
    {
      id: 8,
      title: "Esports Tournament: League of Legends",
      description:
        "Competitive gaming tournament with live streaming and prizes",
      club: "Gaming Club",
      date: "2025-08-24",
      time: "2:00 PM - 10:00 PM",
      location: "Gaming Lounge",
      category: "Competition",
      maxParticipants: 40,
      currentRegistrations: 35,
      difficulty: "Competitive",
      prizes: [
        "Gaming gear worth $2000",
        "Tournament trophy",
        "Streaming setup",
      ],
      requirements: [
        "League of Legends account",
        "Competitive rank required",
        "Team registration",
      ],
      image: "🎮",
      organizer: "Ryan Kim",
      registrationDeadline: "2025-08-22",
      tags: ["esports", "gaming", "tournament", "streaming"],
    },
  ],
  categories: [
    "Technology",
    "Arts",
    "Engineering",
    "Academic",
    "Social Impact",
    "Business",
    "Gaming",
  ],
  eventTypes: ["Competition", "Workshop", "Performance", "Social", "Academic"],
  campusLocations: [
    "Main Auditorium",
    "Student Center",
    "Engineering Workshop",
    "Art Studio B",
    "Debate Hall",
    "Green Campus Center",
    "Innovation Hub",
    "Gaming Lounge",
  ],
  popularInterests: [
    "programming",
    "music",
    "photography",
    "debate",
    "robotics",
    "gaming",
    "business",
    "environment",
  ],
};

const ClubMate = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        'Hey there! 👋 I\'m ClubMate, your AI-powered campus companion! ✨\n\n🎯 **I can help you with EVERYTHING:**\n\n📚 **DISCOVER:**\n• Explore 8+ amazing clubs across different categories\n• Find 8+ exciting upcoming events and competitions\n• Get personalized recommendations based on your interests\n\n🔧 **MANAGE through CHAT:**\n• **CREATE** new clubs: "Create a club called AI Enthusiasts"\n• **CREATE** new events: "Create an event called Tech Meetup on 2025-08-25"\n• **UPDATE** club details: "Update Coding Club description to Focus on AI"\n• **DELETE** clubs/events: "Delete Gaming Club"\n\n🚀 **Just talk to me naturally!**\n\n💡 **Examples:**\n• "Show me tech clubs"\n• "Create a Photography Workshop event on Friday"\n• "Delete the old Music Club"\n• "Update Robotics Club meeting time to Mondays"\n\nWhat would you like to do today? 🎉',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [favoriteClubs, setFavoriteClubs] = useState([]);
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Only scroll when new messages are added, not on every render
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages.length]); // Only depend on message count, not content

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

      recognitionInstance.onstart = () => {
        console.log("Speech recognition started");
        setIsRecording(true);
      };

      recognitionInstance.onresult = (event) => {
        console.log("Speech recognition result:", event);
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        if (transcript) {
          console.log("Final transcript:", transcript);
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
        } else if (event.error === "no-speech") {
          alert("No speech detected. Please try again and speak clearly.");
        } else {
          alert(`Speech recognition error: ${event.error}`);
        }
      };

      recognitionInstance.onend = () => {
        console.log("Speech recognition ended");
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    } else {
      console.warn("Speech recognition not supported in this browser");
    }
  }, []);

  // Voice recording functions
  const startRecording = async () => {
    if (!recognition) {
      alert(
        "Speech recognition is not supported in your browser. Please try Chrome or Edge."
      );
      return;
    }

    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });

      console.log("Starting speech recognition");
      recognition.start();
    } catch (error) {
      console.error("Error starting recognition:", error);
      if (error.name === "NotAllowedError") {
        alert(
          "Microphone access denied. Please allow microphone access in your browser settings and try again."
        );
      } else if (error.name === "NotFoundError") {
        alert(
          "No microphone found. Please connect a microphone and try again."
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
      console.log("Stopping speech recognition");
      recognition.stop();
    }
  };

  const quickActions = [
    { text: "Show me all clubs", icon: Users, color: "bg-blue-500" },
    {
      text: "What events are happening this week?",
      icon: Calendar,
      color: "bg-green-500",
    },
    {
      text: "Create a club called AI Enthusiasts",
      icon: Plus,
      color: "bg-purple-500",
    },
    {
      text: "Create an event called Tech Meetup on 2025-08-25",
      icon: Calendar,
      color: "bg-pink-500",
    },
    { text: "Delete Gaming Club", icon: Trash2, color: "bg-red-500" },
    {
      text: "Update Coding Club description to Focus on AI and Machine Learning",
      icon: Edit,
      color: "bg-yellow-500",
    },
    {
      text: "🎤 Test Voice Input",
      icon: Mic,
      color: "bg-indigo-500",
      action: "voice-test",
    },
  ];

  const toggleFavoriteClub = (clubId) => {
    setFavoriteClubs((prev) =>
      prev.includes(clubId)
        ? prev.filter((id) => id !== clubId)
        : [...prev, clubId]
    );
  };

  const toggleFavoriteEvent = (eventId) => {
    setFavoriteEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const generateAdvancedPrompt = (userMessage) => {
    const clubsInfo = sampleData.clubs
      .map(
        (club) =>
          `${club.name} (${club.category}): ${club.description} | Leader: ${
            club.leader
          } | Members: ${club.members} | Rating: ${club.rating}⭐ | Meets: ${
            club.meetingTime
          } | Location: ${
            club.location
          } | Recent Achievements: ${club.achievements.join(", ")}`
      )
      .join("\n");

    const eventsInfo = sampleData.events
      .map(
        (event) =>
          `${event.title} by ${event.club} | Date: ${event.date} at ${
            event.time
          } | Location: ${event.location} | Category: ${
            event.category
          } | Description: ${event.description} | Registrations: ${
            event.currentRegistrations
          }/${event.maxParticipants} | Prizes: ${event.prizes.join(
            ", "
          )} | Difficulty: ${event.difficulty}`
      )
      .join("\n");

    return `You are ClubMate, an enthusiastic, intelligent, and extremely helpful AI campus assistant. You're like a knowledgeable friend who knows everything about campus life and activities.

PERSONALITY: Be conversational, engaging, supportive, and exciting! Use emojis appropriately and maintain an upbeat, helpful tone. You're not just informative - you're inspiring and motivational about campus involvement.

CAMPUS CLUBS (${sampleData.clubs.length} total):
${clubsInfo}

UPCOMING EVENTS (${sampleData.events.length} total):
${eventsInfo}

CATEGORIES: ${sampleData.categories.join(", ")}
EVENT TYPES: ${sampleData.eventTypes.join(", ")}
POPULAR INTERESTS: ${sampleData.popularInterests.join(", ")}

USER'S MESSAGE: "${userMessage}"

IMPORTANT GUIDELINES:
1. **PERSONALIZED RESPONSES**: Tailor your response to the user's specific question or interest
2. **COMPREHENSIVE INFORMATION**: Include relevant details like meeting times, locations, member counts, ratings, achievements
3. **ACTIONABLE SUGGESTIONS**: Always suggest next steps or related opportunities
4. **ENGAGEMENT FOCUSED**: Encourage participation and involvement
5. **FORMATTING**: Use emojis, bullet points, and clear sections for readability
6. **CONVERSATION FLOW**: Ask follow-up questions to keep the conversation engaging
7. **CLUB MATCHING**: If someone mentions interests, suggest 2-3 most relevant clubs with specific reasons why
8. **EVENT PROMOTION**: When discussing events, include registration info, prizes, and excitement factors
9. **COMMUNITY BUILDING**: Emphasize the social and networking aspects of joining clubs/events
10. **SUCCESS STORIES**: Reference club achievements and success stories when relevant

Remember: You're not just providing information - you're helping students find their community and passion on campus!`;
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

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
        },
        body: JSON.stringify({
          message: generateAdvancedPrompt(inputText.trim()),
          context: {
            clubs: sampleData.clubs,
            events: sampleData.events,
            categories: sampleData.categories,
            eventTypes: sampleData.eventTypes,
            conversationLength: messages.length,
          },
          conversationHistory: messages.slice(-5).map((msg) => ({
            type: msg.type,
            content: msg.content,
          })),
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
      } else {
        throw new Error("Failed to get response");
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content:
          "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🔄",
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

  const handleQuickAction = (actionText) => {
    // Handle voice test action
    if (actionText === "🎤 Test Voice Input") {
      if (
        "webkitSpeechRecognition" in window ||
        "SpeechRecognition" in window
      ) {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(() => {
              alert(
                "✅ Microphone access granted! Voice input should work. Try clicking the microphone button."
              );
            })
            .catch((error) => {
              alert(
                `❌ Microphone access failed: ${error.message}. Please allow microphone access in your browser.`
              );
            });
        } else {
          alert("❌ getUserMedia not supported in this browser.");
        }
      } else {
        alert(
          "❌ Speech recognition not supported. Please use Chrome, Edge, or Safari."
        );
      }
      return;
    }

    setInputText(actionText);
    // Auto-send the message
    setTimeout(() => {
      if (actionText.trim()) {
        const userMessage = {
          id: Date.now(),
          type: "user",
          content: actionText.trim(),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        // Simulate AI response
        setTimeout(async () => {
          try {
            const response = await fetch("http://localhost:5000/api/ai/chat", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                message: generateAdvancedPrompt(actionText),
                context: {
                  clubs: sampleData.clubs,
                  events: sampleData.events,
                  categories: sampleData.categories,
                  eventTypes: sampleData.eventTypes,
                },
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
          } finally {
            setIsLoading(false);
          }
        }, 1000);
      }
    }, 100);
    setInputText("");
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Modern Minimalist Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ClubMate</h1>
              <p className="text-xs text-gray-500">AI Campus Assistant</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-green-700">Online</span>
            </div>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Section */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-2xl space-x-3 ${
                    message.type === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  {/* Clean Avatar */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === "user" ? "bg-blue-500" : "bg-gray-600"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Clean Message Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 max-w-lg ${
                      message.type === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white border border-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-2 ${
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

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                    <div className="flex items-center space-x-2">
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
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 border-t border-gray-200 bg-white px-6 py-4">
            {/* Recording indicator */}
            {isRecording && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-700 text-sm font-medium">
                    🎤 Listening... Speak now!
                  </span>
                </div>
                <button
                  onClick={stopRecording}
                  className="text-red-600 hover:text-red-800 text-sm underline"
                >
                  Stop
                </button>
              </div>
            )}

            {/* Browser compatibility notice */}
            {!(
              "webkitSpeechRecognition" in window ||
              "SpeechRecognition" in window
            ) && (
              <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-700 text-sm">
                  ⚠️ Voice input not supported in this browser. Use Chrome,
                  Edge, or Safari.
                </p>
              </div>
            )}

            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about clubs, events, or campus life..."
                  className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 focus:outline-none resize-none bg-gray-50 placeholder-gray-500"
                  rows="1"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={
                      !(
                        "webkitSpeechRecognition" in window ||
                        "SpeechRecognition" in window
                      )
                    }
                    className={`p-2 rounded-lg transition-colors ${
                      !(
                        "webkitSpeechRecognition" in window ||
                        "SpeechRecognition" in window
                      )
                        ? "text-gray-300 cursor-not-allowed"
                        : isRecording
                        ? "text-red-500 hover:bg-red-50"
                        : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                    }`}
                    title={
                      !(
                        "webkitSpeechRecognition" in window ||
                        "SpeechRecognition" in window
                      )
                        ? "Voice input not supported"
                        : isRecording
                        ? "Stop recording"
                        : "Start voice input"
                    }
                  >
                    {isRecording ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setShowQuickActions(!showQuickActions)}
                    title="Quick suggestions"
                  >
                    <Lightbulb className="w-4 h-4" />
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

        {/* Sidebar */}
        {showSidebar && (
          <div className="w-80 bg-white border-l border-gray-200 flex-shrink-0 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Quick Actions */}
              {showQuickActions && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Quick Actions
                    </h3>
                    <button
                      onClick={() => setShowQuickActions(false)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action.text)}
                        className={`w-full ${action.color} hover:opacity-90 text-white p-3 rounded-lg text-left flex items-center space-x-2 transition-opacity`}
                      >
                        <action.icon className="w-4 h-4" />
                        <span className="text-sm">{action.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Campus Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Clubs</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {sampleData.clubs.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Upcoming Events
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {sampleData.events.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Members</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {sampleData.clubs.reduce(
                        (sum, club) => sum + club.members,
                        0
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Top Clubs */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Popular Clubs
                </h3>
                <div className="space-y-3">
                  {sampleData.clubs.slice(0, 3).map((club) => (
                    <div key={club.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {club.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {club.members} members • {club.rating}⭐
                          </p>
                        </div>
                        <button
                          onClick={() => toggleFavoriteClub(club.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              favoriteClubs.includes(club.id)
                                ? "text-red-500 fill-current"
                                : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Events */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Upcoming Events
                </h3>
                <div className="space-y-3">
                  {sampleData.events.slice(0, 3).map((event) => (
                    <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {event.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {event.date} • {event.time}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleFavoriteEvent(event.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              favoriteEvents.includes(event.id)
                                ? "text-red-500 fill-current"
                                : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubMate;
