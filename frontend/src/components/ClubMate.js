import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Calendar, Users, Clock, Star, Heart, Share2, Menu, X, Zap, Plus, Edit, Trash2, Lightbulb, TrendingUp, Mic, MicOff } from 'lucide-react';
import '../styles/clubmate.css';

// Enhanced sample data with more clubs, events, and features
const sampleData = {
  clubs: [
    {
      id: 1,
      name: "Coding Club",
      description: "Learn programming, build projects, and participate in hackathons",
      leader: "Alex Johnson",
      members: 145,
      meetingTime: "Wednesdays 6:00 PM",
      location: "Computer Lab 101",
      category: "Technology",
      rating: 4.8,
      image: "🖥️",
      interests: ["programming", "coding", "software", "hackathons", "tech", "development", "javascript", "python", "react"],
      upcomingMeetings: ["Aug 21", "Aug 28", "Sep 4"],
      achievements: ["Won Inter-College Hackathon 2024", "50+ projects completed", "Industry partnerships"],
      socialLinks: { discord: "#coding-club", instagram: "@codingclub_campus" }
    },
    {
      id: 2,
      name: "Music Club",
      description: "Express creativity through various musical instruments and vocals",
      leader: "Sarah Chen",
      members: 89,
      meetingTime: "Fridays 4:00 PM",
      location: "Music Room 203",
      category: "Arts",
      rating: 4.7,
      image: "🎵",
      interests: ["music", "singing", "instruments", "band", "performance", "guitar", "piano", "drums", "vocals"],
      upcomingMeetings: ["Aug 23", "Aug 30", "Sep 6"],
      achievements: ["Annual Concert 500+ audience", "Regional Music Competition Winners", "10+ bands formed"],
      socialLinks: { youtube: "MusicClubCampus", instagram: "@campusmusic" }
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
      interests: ["robotics", "engineering", "programming", "building", "competitions", "arduino", "ai", "automation"],
      upcomingMeetings: ["Aug 20", "Aug 22", "Aug 27"],
      achievements: ["National Robotics Championship 2024", "15+ robots built", "Industry mentorship program"],
      socialLinks: { github: "campus-robotics", linkedin: "Campus Robotics Club" }
    },
    {
      id: 4,
      name: "Photography Club",
      description: "Capture moments and learn advanced photography techniques",
      leader: "Emma Davis",
      members: 78,
      meetingTime: "Saturdays 2:00 PM",
      location: "Art Studio B",
      category: "Arts",
      rating: 4.6,
      image: "📸",
      interests: ["photography", "art", "visual", "creative", "camera", "editing", "portraits", "landscape"],
      upcomingMeetings: ["Aug 24", "Aug 31", "Sep 7"],
      achievements: ["Campus Magazine featured", "Photo exhibition 2024", "Professional workshops"],
      socialLinks: { instagram: "@campusphotography", flickr: "Campus Photo Club" }
    },
    {
      id: 5,
      name: "Debate Society",
      description: "Enhance public speaking and critical thinking skills",
      leader: "David Park",
      members: 54,
      meetingTime: "Mondays 7:00 PM",
      location: "Conference Room A",
      category: "Academic",
      rating: 4.5,
      image: "🎤",
      interests: ["debate", "speaking", "arguments", "discussion", "communication", "public speaking", "critical thinking"],
      upcomingMeetings: ["Aug 19", "Aug 26", "Sep 2"],
      achievements: ["Inter-University Debate Champions", "TED Talk speakers", "Leadership development"],
      socialLinks: { twitter: "@CampusDebate", linkedin: "Campus Debate Society" }
    },
    {
      id: 6,
      name: "Environmental Club",
      description: "Promoting sustainability and environmental awareness on campus",
      leader: "Luna Green",
      members: 92,
      meetingTime: "Wednesdays 5:00 PM",
      location: "Science Building 205",
      category: "Social Impact",
      rating: 4.8,
      image: "🌱",
      interests: ["environment", "sustainability", "climate", "green", "nature", "conservation", "recycling"],
      upcomingMeetings: ["Aug 21", "Aug 28", "Sep 4"],
      achievements: ["Campus carbon neutral initiative", "Tree planting drives", "Waste reduction 40%"],
      socialLinks: { instagram: "@greencampus", website: "greencampus.edu" }
    },
    {
      id: 7,
      name: "Entrepreneurship Club",
      description: "Foster innovation and startup culture among students",
      leader: "James Wilson",
      members: 76,
      meetingTime: "Thursdays 6:30 PM",
      location: "Innovation Hub",
      category: "Business",
      rating: 4.7,
      image: "💡",
      interests: ["business", "startup", "innovation", "entrepreneurship", "leadership", "marketing", "finance"],
      upcomingMeetings: ["Aug 22", "Aug 29", "Sep 5"],
      achievements: ["5 successful startups launched", "Investor pitch competitions", "$50k+ funding raised"],
      socialLinks: { linkedin: "Campus Entrepreneurs", website: "campusstartups.com" }
    },
    {
      id: 8,
      name: "Gaming Club",
      description: "Competitive gaming, game development, and esports tournaments",
      leader: "Ryan Kim",
      members: 134,
      meetingTime: "Daily 7:00 PM",
      location: "Gaming Lounge",
      category: "Gaming",
      rating: 4.9,
      image: "🎮",
      interests: ["gaming", "esports", "game development", "tournaments", "streaming", "unity", "competitive"],
      upcomingMeetings: ["Daily sessions", "Tournament Aug 25"],
      achievements: ["Regional Esports Champions", "Game jam winners", "Twitch streaming partnership"],
      socialLinks: { twitch: "CampusGaming", discord: "Campus Gaming Hub" }
    }
  ],
  events: [
    {
      id: 1,
      title: "Hackathon 2025: AI Revolution",
      club: "Coding Club",
      date: "2025-08-25",
      time: "9:00 AM - 9:00 PM",
      location: "Main Auditorium",
      description: "24-hour coding competition focused on AI and machine learning solutions",
      registrationRequired: true,
      category: "Competition",
      maxParticipants: 200,
      currentRegistrations: 156,
      prizes: ["$5000 First Prize", "Internship opportunities", "Mentorship programs"],
      sponsors: ["TechCorp", "AI Innovations", "StartupX"],
      difficulty: "All levels",
      tags: ["AI", "ML", "Programming", "Competition"]
    },
    {
      id: 2,
      title: "Open Mic Night: Acoustic Vibes",
      club: "Music Club",
      date: "2025-08-22",
      time: "7:00 PM - 10:00 PM",
      location: "Student Center Amphitheater",
      description: "Showcase your musical talents in front of a live audience",
      registrationRequired: false,
      category: "Performance",
      maxParticipants: 50,
      currentRegistrations: 23,
      prizes: ["Audience Choice Award", "Recording Studio Session"],
      difficulty: "All levels",
      tags: ["Music", "Performance", "Open Mic", "Acoustic"]
    },
    {
      id: 3,
      title: "Robot Battle Championship",
      club: "Robotics Club",
      date: "2025-08-30",
      time: "3:00 PM - 8:00 PM",
      location: "Engineering Workshop Arena",
      description: "Epic robot battles with combat bots and sumo competitions",
      registrationRequired: true,
      category: "Competition",
      maxParticipants: 32,
      currentRegistrations: 28,
      prizes: ["Championship Trophy", "Arduino Starter Kits", "Industry Mentorship"],
      difficulty: "Intermediate to Advanced",
      tags: ["Robotics", "Competition", "Engineering", "Battle"]
    },
    {
      id: 4,
      title: "Photography Workshop: Portrait Mastery",
      club: "Photography Club",
      date: "2025-08-20",
      time: "10:00 AM - 4:00 PM",
      location: "Art Studio B & Campus Gardens",
      description: "Learn professional portrait techniques with hands-on practice",
      registrationRequired: true,
      category: "Workshop",
      maxParticipants: 25,
      currentRegistrations: 18,
      prizes: ["Certificate of Completion", "Photo Contest Entry"],
      difficulty: "Beginner to Intermediate",
      tags: ["Photography", "Workshop", "Portraits", "Learning"]
    },
    {
      id: 5,
      title: "Startup Pitch Competition",
      club: "Entrepreneurship Club",
      date: "2025-08-26",
      time: "5:00 PM - 9:00 PM",
      location: "Innovation Hub",
      description: "Present your startup ideas to real investors and win funding",
      registrationRequired: true,
      category: "Competition",
      maxParticipants: 15,
      currentRegistrations: 12,
      prizes: ["$10,000 Seed Funding", "Mentorship Program", "Incubator Access"],
      difficulty: "All levels",
      tags: ["Business", "Startup", "Pitch", "Investment"]
    },
    {
      id: 6,
      title: "Esports Tournament: League of Legends",
      club: "Gaming Club",
      date: "2025-08-24",
      time: "2:00 PM - 10:00 PM",
      location: "Gaming Lounge",
      description: "Competitive League of Legends tournament with live streaming",
      registrationRequired: true,
      category: "Competition",
      maxParticipants: 40,
      currentRegistrations: 35,
      prizes: ["Gaming Gear", "Streaming Setup", "Tournament Trophy"],
      difficulty: "All ranks",
      tags: ["Esports", "Gaming", "LoL", "Competition"]
    },
    {
      id: 7,
      title: "Climate Action Summit",
      club: "Environmental Club",
      date: "2025-08-23",
      time: "1:00 PM - 6:00 PM",
      location: "Green Auditorium",
      description: "Join environmental leaders discussing campus sustainability initiatives",
      registrationRequired: false,
      category: "Summit",
      maxParticipants: 300,
      currentRegistrations: 189,
      prizes: ["Eco-friendly Merchandise", "Volunteer Opportunities"],
      difficulty: "All levels",
      tags: ["Environment", "Sustainability", "Climate", "Summit"]
    },
    {
      id: 8,
      title: "Parliamentary Debate Championship",
      club: "Debate Society",
      date: "2025-08-27",
      time: "9:00 AM - 6:00 PM",
      location: "Conference Hall A",
      description: "Annual inter-college parliamentary debate championship",
      registrationRequired: true,
      category: "Competition",
      maxParticipants: 24,
      currentRegistrations: 20,
      prizes: ["Championship Cup", "Public Speaking Scholarship", "Leadership Program"],
      difficulty: "Intermediate to Advanced",
      tags: ["Debate", "Public Speaking", "Competition", "Parliamentary"]
    }
  ],
  categories: ["Technology", "Arts", "Engineering", "Academic", "Social Impact", "Business", "Gaming"],
  eventTypes: ["Competition", "Workshop", "Performance", "Summit", "Social"],
  popularInterests: ["programming", "music", "photography", "debate", "robotics", "gaming", "business", "environment"]
};

const ClubMate = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hey there! 👋 I'm ClubMate, your AI-powered campus companion! ✨\n\n🎯 **I can help you with EVERYTHING:**\n\n📚 **DISCOVER:**\n• Explore 8+ amazing clubs across different categories\n• Find 8+ exciting upcoming events and competitions\n• Get personalized recommendations based on your interests\n\n🔧 **MANAGE through CHAT:**\n• **CREATE** new clubs: \"Create a club called AI Enthusiasts\"\n• **CREATE** new events: \"Create an event called Tech Meetup on 2025-08-25\"\n• **UPDATE** club details: \"Update Coding Club description to Focus on AI\"\n• **DELETE** clubs/events: \"Delete Gaming Club\"\n\n🚀 **Just talk to me naturally!**\n\n� **Examples:**\n• \"Show me tech clubs\"\n• \"Create a Photography Workshop event on Friday\"\n• \"Delete the old Music Club\"\n• \"Update Robotics Club meeting time to Mondays\"\n\nWhat would you like to do today? 🎉",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [favoriteClubs, setFavoriteClubs] = useState([]);
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.maxAlternatives = 1;
      
      recognitionInstance.onstart = () => {
        console.log('Speech recognition started');
        setIsRecording(true);
      };
      
      recognitionInstance.onresult = (event) => {
        console.log('Speech recognition result:', event);
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        if (transcript) {
          console.log('Final transcript:', transcript);
          setInputText(prev => prev + transcript);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access and try again.');
        } else if (event.error === 'no-speech') {
          alert('No speech detected. Please try again and speak clearly.');
        } else {
          alert(`Speech recognition error: ${event.error}`);
        }
      };
      
      recognitionInstance.onend = () => {
        console.log('Speech recognition ended');
        setIsRecording(false);
      };
      
      setRecognition(recognitionInstance);
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }, []);

  // Voice recording functions
  const startRecording = async () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      console.log('Starting speech recognition');
      recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      if (error.name === 'NotAllowedError') {
        alert('Microphone access denied. Please allow microphone access in your browser settings and try again.');
      } else if (error.name === 'NotFoundError') {
        alert('No microphone found. Please connect a microphone and try again.');
      } else {
        alert('Failed to start voice recording. Please check your microphone and try again.');
      }
    }
  };

  const stopRecording = () => {
    if (recognition && isRecording) {
      console.log('Stopping speech recognition');
      recognition.stop();
    }
  };

  const quickActions = [
    { text: "Show me all clubs", icon: Users, color: "bg-blue-500" },
    { text: "What events are happening this week?", icon: Calendar, color: "bg-green-500" },
    { text: "Create a club called AI Enthusiasts", icon: Plus, color: "bg-purple-500" },
    { text: "Create an event called Tech Meetup on 2025-08-25", icon: Calendar, color: "bg-pink-500" },
    { text: "Delete Gaming Club", icon: Trash2, color: "bg-red-500" },
    { text: "Update Coding Club description to Focus on AI and Machine Learning", icon: Edit, color: "bg-yellow-500" },
    { text: "🎤 Test Voice Input", icon: Mic, color: "bg-indigo-500", action: "voice-test" }
  ];

  const toggleFavoriteClub = (clubId) => {
    setFavoriteClubs(prev => 
      prev.includes(clubId) 
        ? prev.filter(id => id !== clubId)
        : [...prev, clubId]
    );
  };

  const toggleFavoriteEvent = (eventId) => {
    setFavoriteEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const generateAdvancedPrompt = (userMessage) => {
    const clubsInfo = sampleData.clubs.map(club => 
      `${club.name} (${club.category}): ${club.description} | Leader: ${club.leader} | Members: ${club.members} | Rating: ${club.rating}⭐ | Meets: ${club.meetingTime} | Location: ${club.location} | Recent Achievements: ${club.achievements.join(', ')}`
    ).join('\n');

    const eventsInfo = sampleData.events.map(event => 
      `${event.title} by ${event.club} | Date: ${event.date} at ${event.time} | Location: ${event.location} | Category: ${event.category} | Description: ${event.description} | Registrations: ${event.currentRegistrations}/${event.maxParticipants} | Prizes: ${event.prizes.join(', ')} | Difficulty: ${event.difficulty}`
    ).join('\n');

    return `You are ClubMate, an enthusiastic, intelligent, and extremely helpful AI campus assistant. You're like a knowledgeable friend who knows everything about campus life and activities.

IMPORTANT: You are an INFORMATION and DISCOVERY assistant, NOT a club/event creation tool. You help students:
- DISCOVER existing clubs and events
- LEARN about club meetings, leaders, and activities  
- GET RECOMMENDATIONS based on interests
- FIND OUT how to JOIN existing clubs and REGISTER for events
- CREATE PROMOTIONS for existing events

AVAILABLE CLUBS (${sampleData.clubs.length} total):
${clubsInfo}

UPCOMING EVENTS (${sampleData.events.length} total):
${eventsInfo}

CATEGORIES: ${sampleData.categories.join(', ')}
EVENT TYPES: ${sampleData.eventTypes.join(', ')}

User's question: "${userMessage}"

RESPONSE GUIDELINES:
🎯 Be conversational, enthusiastic, and incredibly helpful
📊 Provide specific details (dates, times, locations, registration info)
🌟 Use emojis appropriately to make responses engaging and fun
🔍 For interest-based queries, suggest multiple relevant clubs/events
🎨 For promotion requests, create catchy, modern event descriptions
📈 Include registration status, difficulty levels, and achievements
🎪 Mention prizes, sponsors, and special features when relevant
💡 Offer related suggestions and follow-up actions
🚀 Be creative and comprehensive in your responses

IMPORTANT REDIRECTS:
- If asked to "create club/event" → redirect to discovering existing ones
- If asked about "joining" → explain how to attend meetings/register
- If asked about "management" → redirect to information about existing activities
- Always keep conversations focused on DISCOVERY and PARTICIPATION

SPECIAL FEATURES TO MENTION:
- Club ratings and member counts
- Event registration status and capacity
- Prizes and achievements
- Meeting times and locations
- How to get involved and participate
- Upcoming meeting dates
- Different difficulty levels
- Categories and filters available

Respond in an enthusiastic, helpful manner with rich details and actionable information:`;
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
      // Get recent conversation history for context
      const recentMessages = messages.slice(-4).map(msg => ({
        type: msg.type,
        content: msg.content
      }));

      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: recentMessages,
          context: {
            clubs: sampleData.clubs,
            events: sampleData.events,
            categories: sampleData.categories,
            eventTypes: sampleData.eventTypes,
            userFavorites: {
              clubs: favoriteClubs,
              events: favoriteEvents
            },
            conversationLength: messages.length
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from ClubMate');
      }

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "🔧 I'm having trouble connecting to my AI brain right now, but I can still help you explore our amazing campus activities!\n\n📚 **Available Resources:**\n• 8 diverse clubs across Technology, Arts, Engineering, Business, Gaming, and more\n• 8 exciting upcoming events and competitions\n• Registration info and event details\n• Club meeting schedules and locations\n\n💬 Try asking me about specific clubs like \"Tell me about the Gaming Club\" or \"What events are happening this weekend?\" - I'll do my best to help! 😊",
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

  const handleQuickAction = (actionText) => {
    // Handle voice test action
    if (actionText === "🎤 Test Voice Input") {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => {
              alert('✅ Microphone access granted! Voice input should work. Try clicking the microphone button.');
            })
            .catch((error) => {
              alert(`❌ Microphone access failed: ${error.message}. Please allow microphone access in your browser.`);
            });
        } else {
          alert('❌ getUserMedia not supported in this browser.');
        }
      } else {
        alert('❌ Speech recognition not supported. Please use Chrome, Edge, or Safari.');
      }
      return;
    }

    setInputText(actionText);
    // Auto-send the message
    setTimeout(() => {
      if (actionText.trim()) {
        const userMessage = {
          id: Date.now(),
          type: 'user',
          content: actionText.trim(),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        
        // Simulate AI response
        setTimeout(async () => {
          try {
            const response = await fetch('http://localhost:5000/api/ai/chat', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                message: generateAdvancedPrompt(actionText),
                context: {
                  clubs: sampleData.clubs,
                  events: sampleData.events,
                  categories: sampleData.categories,
                  eventTypes: sampleData.eventTypes
                }
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
          } finally {
            setIsLoading(false);
          }
        }, 1000);
      }
    }, 100);
    setInputText('');
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Enhanced Header */}
      <div className="relative bg-white/80 backdrop-blur-xl shadow-2xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300">
                  <Bot className="w-8 h-8 text-white animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-white animate-bounce"></div>
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                  ClubMate
                </h1>
                <p className="text-sm text-gray-600 font-medium">Your AI Campus Companion • 8 Clubs • 8 Events</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">AI Online</span>
              </div>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Enhanced Chat Container */}
          <div className="lg:col-span-3">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
              {/* Chat Messages Area */}
              <div className="h-[500px] overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white/50 chat-scrollbar">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                  >
                    <div className={`flex max-w-2xl space-x-4 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {/* Enhanced Avatar */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500' 
                          : 'bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-6 h-6 text-white" />
                        ) : (
                          <Bot className="w-6 h-6 text-white animate-pulse" />
                        )}
                      </div>
                      
                      {/* Enhanced Message Bubble */}
                      <div className={`rounded-3xl px-6 py-4 shadow-xl message-bubble backdrop-blur-sm border ${
                        message.type === 'user'
                          ? 'bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 text-white border-white/20'
                          : 'bg-white/90 border-gray-200/50 text-gray-800'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
                        <div className="flex items-center justify-between mt-3">
                          <p className={`text-xs ${
                            message.type === 'user' ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            {formatTimestamp(message.timestamp)}
                          </p>
                          {message.type === 'bot' && (
                            <div className="flex space-x-2">
                              <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                                <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                              </button>
                              <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                                <Share2 className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Enhanced Loading Indicator */}
                {isLoading && (
                  <div className="flex justify-start animate-fadeIn">
                    <div className="flex space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Bot className="w-6 h-6 text-white animate-pulse" />
                      </div>
                      <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-3xl px-6 py-4 shadow-xl">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-gray-600 font-medium">ClubMate is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Input Area */}
              <div className="border-t border-gray-200/50 p-6 bg-white/80 backdrop-blur-sm">
                {/* Recording indicator */}
                {isRecording && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-700 font-medium">🎤 Listening... Speak now!</span>
                      <span className="text-red-500 text-sm">(Make sure your microphone is enabled)</span>
                    </div>
                    <button
                      onClick={stopRecording}
                      className="text-red-600 hover:text-red-800 text-sm underline font-medium"
                    >
                      Stop Recording
                    </button>
                  </div>
                )}

                {/* Browser compatibility notice */}
                {!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-700 font-medium">⚠️ Voice input not supported</span>
                    </div>
                    <p className="text-yellow-600 text-sm mt-1">
                      Please use Chrome, Edge, or Safari for voice input functionality.
                    </p>
                  </div>
                )}
                
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about clubs, events, or campus life..."
                      className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-2xl px-6 py-4 focus:outline-none transition-all duration-200 resize-none bg-white/70 backdrop-blur-sm shadow-lg placeholder-gray-500 font-medium"
                      rows="1"
                      disabled={isLoading}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-2">
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)}
                        className={`voice-button p-2 rounded-full transition-all duration-200 ${
                          !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
                            ? 'text-gray-300 cursor-not-allowed bg-gray-100'
                            : isRecording 
                              ? 'text-red-500 bg-red-50 hover:bg-red-100 recording-animation recording-indicator' 
                              : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                        }`}
                        title={
                          !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
                            ? 'Voice input not supported in this browser'
                            : isRecording 
                              ? 'Stop recording (click to stop)' 
                              : 'Start voice input (click to speak)'
                        }
                      >
                        {isRecording ? (
                          <MicOff className="w-5 h-5" />
                        ) : (
                          <Mic className="w-5 h-5" />
                        )}
                      </button>
                      <button 
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                        title="Quick suggestions"
                      >
                        <Lightbulb className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!inputText.trim() || isLoading}
                    className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 text-white px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-xl glow-on-hover flex items-center space-x-2 font-medium"
                  >
                    <Send className="w-5 h-5" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Quick Actions */}
            {showQuickActions && (
              <div className="mt-6 bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span>Quick Actions</span>
                  </h3>
                  <button
                    onClick={() => setShowQuickActions(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.text)}
                      className={`${action.color} hover:scale-105 transform transition-all duration-200 text-white p-4 rounded-xl shadow-lg flex items-center space-x-3 glow-on-hover`}
                    >
                      <action.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{action.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Stats Card */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span>Campus Stats</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Clubs</span>
                    <span className="font-bold text-blue-600">{sampleData.clubs.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Upcoming Events</span>
                    <span className="font-bold text-purple-600">{sampleData.events.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Members</span>
                    <span className="font-bold text-green-600">{sampleData.clubs.reduce((sum, club) => sum + club.members, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Categories</span>
                    <span className="font-bold text-orange-600">{sampleData.categories.length}</span>
                  </div>
                </div>
              </div>

              {/* Popular Clubs */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>Top Clubs</span>
                </h3>
                <div className="space-y-3">
                  {sampleData.clubs
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 4)
                    .map((club) => (
                      <div key={club.id} className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                        <div className="text-2xl">{club.image}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{club.name}</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs text-gray-600">{club.rating}</span>
                            </div>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-600">{club.members} members</span>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFavoriteClub(club.id)}
                          className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${favoriteClubs.includes(club.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span>This Week</span>
                </h3>
                <div className="space-y-3">
                  {sampleData.events
                    .slice(0, 3)
                    .map((event) => (
                      <div key={event.id} className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
                        <p className="text-sm font-semibold text-gray-800 mb-1">{event.title}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{event.time.split(' - ')[0]}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            event.category === 'Competition' ? 'bg-red-100 text-red-700' :
                            event.category === 'Workshop' ? 'bg-green-100 text-green-700' :
                            event.category === 'Performance' ? 'bg-purple-100 text-purple-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {event.category}
                          </span>
                          <button
                            onClick={() => toggleFavoriteEvent(event.id)}
                            className="p-1 rounded-lg hover:bg-white/50 transition-colors"
                          >
                            <Heart className={`w-4 h-4 ${favoriteEvents.includes(event.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubMate;
