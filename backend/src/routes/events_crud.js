const express = require('express');
const router = express.Router();

// In-memory storage for events (for MVP - replace with database later)
let events = [
  {
    id: 1,
    title: "Hackathon 2025: AI Revolution",
    description: "24-hour coding marathon focusing on AI/ML innovations with $5000 prizes and internship opportunities",
    organizer: "Coding Club",
    date: "2025-08-25",
    time: "9:00 AM - 9:00 PM",
    location: "Main Auditorium",
    category: "Competition",
    maxAttendees: 200,
    registeredAttendees: 156,
    image: "🏆",
    tags: ["hackathon", "ai", "ml", "coding", "competition", "prizes"],
    requirements: ["Laptop", "Programming Knowledge", "Team of 2-4"],
    prizes: ["$5000 First Prize", "Internship Opportunities", "Industry Mentorship"],
    schedule: [
      { time: "9:00 AM", activity: "Registration & Breakfast" },
      { time: "10:00 AM", activity: "Opening Ceremony" },
      { time: "11:00 AM", activity: "Coding Begins" },
      { time: "12:30 PM", activity: "Lunch Break" },
      { time: "6:00 PM", activity: "Dinner Break" },
      { time: "9:00 PM", activity: "Final Presentations" }
    ],
    registrationOpen: true
  },
  {
    id: 2,
    title: "Open Mic Night: Acoustic Vibes",
    description: "Showcase your musical talents in an intimate acoustic setting with live audience",
    organizer: "Music Club",
    date: "2025-08-22",
    time: "7:00 PM - 10:00 PM",
    location: "Student Center",
    category: "Performance",
    maxAttendees: 100,
    registeredAttendees: 0, // Drop-in event
    image: "🎤",
    tags: ["music", "acoustic", "open mic", "performance", "singing"],
    requirements: ["Bring your instrument", "Original or cover songs welcome"],
    prizes: ["Audience Choice Award", "Recording Studio Session"],
    schedule: [
      { time: "7:00 PM", activity: "Setup & Sound Check" },
      { time: "7:30 PM", activity: "Welcome & First Performances" },
      { time: "8:30 PM", activity: "Intermission & Refreshments" },
      { time: "9:00 PM", activity: "Second Round Performances" },
      { time: "10:00 PM", activity: "Awards & Closing" }
    ],
    registrationOpen: false // No registration required
  },
  {
    id: 3,
    title: "Robot Battle Championship",
    description: "Epic robot combat tournament with custom-built fighting robots",
    organizer: "Robotics Club",
    date: "2025-08-30",
    time: "3:00 PM - 8:00 PM",
    location: "Engineering Workshop",
    category: "Competition",
    maxAttendees: 32,
    registeredAttendees: 28,
    image: "⚔️",
    tags: ["robotics", "competition", "engineering", "battle", "automation"],
    requirements: ["Custom Robot (weight limit 5kg)", "Safety gear", "Remote control"],
    prizes: ["Championship Trophy", "Tech Gear Worth $2000", "Internship Opportunities"],
    schedule: [
      { time: "3:00 PM", activity: "Robot Inspection & Registration" },
      { time: "4:00 PM", activity: "Practice Rounds" },
      { time: "5:00 PM", activity: "Tournament Brackets Begin" },
      { time: "6:30 PM", activity: "Semi-Finals" },
      { time: "7:30 PM", activity: "Championship Final" },
      { time: "8:00 PM", activity: "Awards Ceremony" }
    ],
    registrationOpen: true
  },
  {
    id: 4,
    title: "Photography Workshop: Portrait Mastery",
    description: "Learn professional portrait photography techniques from industry experts",
    organizer: "Photography Club",
    date: "2025-08-20",
    time: "10:00 AM - 4:00 PM",
    location: "Art Studio B",
    category: "Workshop",
    maxAttendees: 25,
    registeredAttendees: 18,
    image: "📷",
    tags: ["photography", "portrait", "workshop", "professional", "lighting"],
    requirements: ["DSLR Camera", "Notebook", "Portfolio (optional)"],
    prizes: ["Certificate of Completion", "Portfolio Review", "Exhibition Opportunity"],
    schedule: [
      { time: "10:00 AM", activity: "Introduction to Portrait Photography" },
      { time: "11:00 AM", activity: "Lighting Techniques" },
      { time: "12:30 PM", activity: "Lunch Break" },
      { time: "1:30 PM", activity: "Hands-on Practice Session" },
      { time: "3:00 PM", activity: "Portfolio Review & Feedback" },
      { time: "4:00 PM", activity: "Wrap-up & Next Steps" }
    ],
    registrationOpen: true
  },
  {
    id: 5,
    title: "Startup Pitch Competition",
    description: "Present your business ideas to real investors for seed funding opportunities",
    organizer: "Entrepreneurship Club",
    date: "2025-08-26",
    time: "5:00 PM - 9:00 PM",
    location: "Innovation Hub",
    category: "Competition",
    maxAttendees: 15,
    registeredAttendees: 12,
    image: "💼",
    tags: ["startup", "pitch", "funding", "business", "entrepreneurship", "investors"],
    requirements: ["Business Plan", "Pitch Deck", "Financial Projections"],
    prizes: ["$10,000 Seed Funding", "Mentorship Program", "Incubator Access"],
    schedule: [
      { time: "5:00 PM", activity: "Registration & Networking" },
      { time: "5:30 PM", activity: "Investor Panel Introduction" },
      { time: "6:00 PM", activity: "First Round Pitches" },
      { time: "7:30 PM", activity: "Break & Feedback Session" },
      { time: "8:00 PM", activity: "Final Presentations" },
      { time: "9:00 PM", activity: "Winner Announcement" }
    ],
    registrationOpen: true
  },
  {
    id: 6,
    title: "Esports Tournament: League of Legends",
    description: "Competitive LoL tournament with live streaming and gaming gear prizes",
    organizer: "Gaming Club",
    date: "2025-08-24",
    time: "2:00 PM - 10:00 PM",
    location: "Gaming Lounge",
    category: "Competition",
    maxAttendees: 40,
    registeredAttendees: 35,
    image: "🎮",
    tags: ["esports", "gaming", "league of legends", "tournament", "streaming"],
    requirements: ["League of Legends Account (Gold+ Rank)", "Gaming Setup", "Team of 5"],
    prizes: ["Gaming Gear Worth $3000", "Tournament Trophy", "Streaming Equipment"],
    schedule: [
      { time: "2:00 PM", activity: "Team Registration & Setup" },
      { time: "3:00 PM", activity: "Group Stage Matches" },
      { time: "5:00 PM", activity: "Break & Refreshments" },
      { time: "6:00 PM", activity: "Knockout Stage" },
      { time: "8:00 PM", activity: "Semi-Finals" },
      { time: "9:00 PM", activity: "Grand Final (Live Stream)" },
      { time: "10:00 PM", activity: "Awards & Closing" }
    ],
    registrationOpen: true
  },
  {
    id: 7,
    title: "Climate Action Summit",
    description: "Discuss environmental challenges and develop sustainable campus solutions",
    organizer: "Environmental Club",
    date: "2025-08-23",
    time: "1:00 PM - 6:00 PM",
    location: "Green Campus Center",
    category: "Conference",
    maxAttendees: 80,
    registeredAttendees: 65,
    image: "🌍",
    tags: ["climate", "environment", "sustainability", "conference", "action"],
    requirements: ["None - Open to All", "Notebook for Ideas"],
    prizes: ["Sustainability Certificate", "Eco-Friendly Goodie Bag", "Project Funding"],
    schedule: [
      { time: "1:00 PM", activity: "Welcome & Keynote Speech" },
      { time: "2:00 PM", activity: "Panel Discussion" },
      { time: "3:00 PM", activity: "Workshop Sessions" },
      { time: "4:00 PM", activity: "Break & Networking" },
      { time: "4:30 PM", activity: "Action Planning Groups" },
      { time: "5:30 PM", activity: "Presentation of Solutions" },
      { time: "6:00 PM", activity: "Commitment Ceremony" }
    ],
    registrationOpen: true
  },
  {
    id: 8,
    title: "Debate Championship Finals",
    description: "Inter-college debate championship with topics on contemporary global issues",
    organizer: "Debate Society",
    date: "2025-08-27",
    time: "4:00 PM - 8:00 PM",
    location: "Debate Hall",
    category: "Competition",
    maxAttendees: 50,
    registeredAttendees: 24,
    image: "🎯",
    tags: ["debate", "championship", "public speaking", "argumentation", "competition"],
    requirements: ["Debate Experience", "Partner for Team Debates", "Formal Attire"],
    prizes: ["Championship Trophy", "Scholarship Opportunity", "Public Speaking Course"],
    schedule: [
      { time: "4:00 PM", activity: "Registration & Topic Announcement" },
      { time: "4:30 PM", activity: "Preparation Time" },
      { time: "5:00 PM", activity: "Preliminary Rounds" },
      { time: "6:30 PM", activity: "Semi-Final Debates" },
      { time: "7:30 PM", activity: "Championship Final" },
      { time: "8:00 PM", activity: "Awards & Closing" }
    ],
    registrationOpen: true
  }
];

// GET /api/events - Get all events
router.get('/', (req, res) => {
  try {
    const { category, organizer, upcoming, search } = req.query;
    
    let filteredEvents = [...events];
    
    // Filter by category
    if (category && category !== 'all') {
      filteredEvents = filteredEvents.filter(event => 
        event.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by organizer
    if (organizer) {
      filteredEvents = filteredEvents.filter(event =>
        event.organizer.toLowerCase().includes(organizer.toLowerCase())
      );
    }
    
    // Filter upcoming events
    if (upcoming === 'true') {
      const currentDate = new Date().toISOString().split('T')[0];
      filteredEvents = filteredEvents.filter(event => event.date >= currentDate);
    }
    
    // Search functionality
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredEvents = filteredEvents.filter(event =>
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Sort by date
    filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    res.json({
      success: true,
      data: filteredEvents,
      total: filteredEvents.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
});

// GET /api/events/:id - Get single event
router.get('/:id', (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
});

// POST /api/events - Create new event
router.post('/', (req, res) => {
  try {
    const {
      title,
      description,
      organizer,
      date,
      time,
      location,
      category,
      maxAttendees,
      image,
      tags = [],
      requirements = [],
      prizes = [],
      schedule = []
    } = req.body;
    
    // Validation
    if (!title || !description || !organizer || !date || !time || !location || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, description, organizer, date, time, location, category'
      });
    }
    
    // Check if event title already exists on the same date
    const existingEvent = events.find(e => 
      e.title.toLowerCase() === title.toLowerCase() && e.date === date
    );
    if (existingEvent) {
      return res.status(409).json({
        success: false,
        message: 'Event with this title already exists on the same date'
      });
    }
    
    // Generate new ID
    const newId = Math.max(...events.map(e => e.id)) + 1;
    
    // Create new event
    const newEvent = {
      id: newId,
      title,
      description,
      organizer,
      date,
      time,
      location,
      category,
      maxAttendees: maxAttendees || 50,
      registeredAttendees: 0,
      image: image || '🎯',
      tags: Array.isArray(tags) ? tags : [],
      requirements: Array.isArray(requirements) ? requirements : [],
      prizes: Array.isArray(prizes) ? prizes : [],
      schedule: Array.isArray(schedule) ? schedule : [],
      registrationOpen: true
    };
    
    events.push(newEvent);
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
});

// PUT /api/events/:id - Update event
router.put('/:id', (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const eventIndex = events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    const {
      title,
      description,
      organizer,
      date,
      time,
      location,
      category,
      maxAttendees,
      image,
      tags,
      requirements,
      prizes,
      schedule,
      registrationOpen
    } = req.body;
    
    // Update event (only update provided fields)
    const updatedEvent = {
      ...events[eventIndex],
      ...(title && { title }),
      ...(description && { description }),
      ...(organizer && { organizer }),
      ...(date && { date }),
      ...(time && { time }),
      ...(location && { location }),
      ...(category && { category }),
      ...(maxAttendees && { maxAttendees }),
      ...(image && { image }),
      ...(tags && { tags }),
      ...(requirements && { requirements }),
      ...(prizes && { prizes }),
      ...(schedule && { schedule }),
      ...(registrationOpen !== undefined && { registrationOpen })
    };
    
    events[eventIndex] = updatedEvent;
    
    res.json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
});

// DELETE /api/events/:id - Delete event
router.delete('/:id', (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const eventIndex = events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    const deletedEvent = events[eventIndex];
    events.splice(eventIndex, 1);
    
    res.json({
      success: true,
      message: 'Event deleted successfully',
      data: deletedEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
});

// POST /api/events/:id/register - Register for event
router.post('/:id/register', (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if registration is open
    if (!event.registrationOpen) {
      return res.status(400).json({
        success: false,
        message: 'Registration is closed for this event'
      });
    }
    
    // Check if event is full
    if (event.registeredAttendees >= event.maxAttendees) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }
    
    // Increment registered attendees
    event.registeredAttendees += 1;
    
    res.json({
      success: true,
      message: `Successfully registered for ${event.title}!`,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering for event',
      error: error.message
    });
  }
});

// POST /api/events/:id/unregister - Unregister from event
router.post('/:id/unregister', (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Decrement registered attendees (minimum 0)
    if (event.registeredAttendees > 0) {
      event.registeredAttendees -= 1;
    }
    
    res.json({
      success: true,
      message: `Successfully unregistered from ${event.title}`,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unregistering from event',
      error: error.message
    });
  }
});

// GET /api/events/category/:category - Get events by category
router.get('/category/:category', (req, res) => {
  try {
    const { category } = req.params;
    const filteredEvents = events.filter(event => 
      event.category.toLowerCase() === category.toLowerCase()
    );
    
    res.json({
      success: true,
      data: filteredEvents,
      total: filteredEvents.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events by category',
      error: error.message
    });
  }
});

module.exports = router;
