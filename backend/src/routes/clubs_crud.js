const express = require('express');
const router = express.Router();

// In-memory storage for clubs (for MVP - replace with database later)
let clubs = [
  {
    id: 1,
    name: "Coding Club",
    description: "Learn programming, participate in hackathons, and build amazing software projects together",
    leader: "Alex Johnson",
    members: 145,
    meetingTime: "Wednesdays 6:00 PM",
    location: "Computer Lab 101",
    category: "Technology",
    rating: 4.8,
    image: "🖥️",
    interests: ["programming", "coding", "software", "hackathon", "tech", "development", "javascript", "python", "react"],
    upcomingMeetings: ["Aug 21", "Aug 28", "Sep 4"],
    achievements: ["Inter-College Hackathon Winners 2024", "50+ Projects Completed", "Industry Partnership Program"],
    socialLinks: { github: "CodingClubCampus", linkedin: "campus-coding-club" }
  },
  {
    id: 2,
    name: "Music Club",
    description: "Express yourself through music - instruments, vocals, and live performances",
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
    interests: ["robotics", "engineering", "arduino", "programming", "automation", "ai", "sensors", "mechanics"],
    upcomingMeetings: ["Aug 20", "Aug 22", "Aug 27"],
    achievements: ["National Robotics Championship 2024", "Best Innovation Award", "Industry Collaboration Projects"],
    socialLinks: { youtube: "RoboticsClubTech", github: "CampusRobotics" }
  },
  {
    id: 4,
    name: "Photography Club",
    description: "Capture moments, learn techniques, and showcase your artistic vision",
    leader: "Emma Davis",
    members: 78,
    meetingTime: "Saturdays 2:00 PM",
    location: "Art Studio B",
    category: "Arts",
    rating: 4.6,
    image: "📸",
    interests: ["photography", "camera", "editing", "portraits", "landscape", "digital", "art", "photoshop"],
    upcomingMeetings: ["Aug 24", "Aug 31", "Sep 7"],
    achievements: ["Campus Photography Exhibition", "Professional Workshop Series", "Social Media Collaboration"],
    socialLinks: { instagram: "@campusphotography", flickr: "CampusPhotoClub" }
  },
  {
    id: 5,
    name: "Debate Society",
    description: "Develop critical thinking and public speaking skills through structured debates",
    leader: "David Park",
    members: 54,
    meetingTime: "Mondays 7:00 PM",
    location: "Debate Hall",
    category: "Academic",
    rating: 4.5,
    image: "🎤",
    interests: ["debate", "public speaking", "argumentation", "critical thinking", "rhetoric", "politics", "discussion"],
    upcomingMeetings: ["Aug 19", "Aug 26", "Sep 2"],
    achievements: ["Inter-University Debate Champions", "Model UN Best Delegation", "Public Speaking Workshops"],
    socialLinks: { linkedin: "campus-debate-society", youtube: "DebateSocietyCampus" }
  },
  {
    id: 6,
    name: "Environmental Club",
    description: "Promote sustainability and environmental awareness on campus",
    leader: "Luna Green",
    members: 92,
    meetingTime: "Wednesdays 5:00 PM",
    location: "Green Campus Center",
    category: "Social Impact",
    rating: 4.8,
    image: "🌱",
    interests: ["environment", "sustainability", "climate", "conservation", "green", "ecology", "renewable", "nature"],
    upcomingMeetings: ["Aug 21", "Aug 28", "Sep 4"],
    achievements: ["Campus Carbon Neutral Initiative", "Tree Planting 500+ trees", "Waste Reduction Program"],
    socialLinks: { instagram: "@campusgreen", twitter: "@EcoClubCampus" }
  },
  {
    id: 7,
    name: "Entrepreneurship Club",
    description: "Turn your business ideas into reality with mentorship and resources",
    leader: "James Wilson",
    members: 76,
    meetingTime: "Thursdays 6:30 PM",
    location: "Innovation Hub",
    category: "Business",
    rating: 4.7,
    image: "💡",
    interests: ["entrepreneurship", "startup", "business", "innovation", "funding", "pitching", "marketing", "leadership"],
    upcomingMeetings: ["Aug 22", "Aug 29", "Sep 5"],
    achievements: ["5 Successful Startups Launched", "$50K Funding Secured", "Industry Mentor Network"],
    socialLinks: { linkedin: "campus-entrepreneurs", twitter: "@StartupClubCampus" }
  },
  {
    id: 8,
    name: "Gaming Club",
    description: "Competitive gaming, esports tournaments, and game development",
    leader: "Ryan Kim",
    members: 134,
    meetingTime: "Daily 7:00 PM",
    location: "Gaming Lounge",
    category: "Entertainment",
    rating: 4.9,
    image: "🎮",
    interests: ["gaming", "esports", "tournaments", "streaming", "game development", "unity", "competitive"],
    upcomingMeetings: ["Aug 17", "Aug 18", "Aug 19"],
    achievements: ["Regional Esports Champions", "Twitch Partnership Program", "Game Development Projects"],
    socialLinks: { twitch: "CampusGamingClub", youtube: "GameClubCampus" }
  }
];

// GET /api/clubs - Get all clubs
router.get('/', (req, res) => {
  try {
    const { category, search } = req.query;
    
    let filteredClubs = [...clubs];
    
    // Filter by category
    if (category && category !== 'all') {
      filteredClubs = filteredClubs.filter(club => 
        club.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Search functionality
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredClubs = filteredClubs.filter(club =>
        club.name.toLowerCase().includes(searchTerm) ||
        club.description.toLowerCase().includes(searchTerm) ||
        club.interests.some(interest => interest.toLowerCase().includes(searchTerm))
      );
    }
    
    res.json({
      success: true,
      data: filteredClubs,
      total: filteredClubs.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching clubs',
      error: error.message
    });
  }
});

// GET /api/clubs/:id - Get single club
router.get('/:id', (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    const club = clubs.find(c => c.id === clubId);
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }
    
    res.json({
      success: true,
      data: club
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching club',
      error: error.message
    });
  }
});

// POST /api/clubs - Create new club
router.post('/', (req, res) => {
  try {
    const {
      name,
      description,
      leader,
      meetingTime,
      location,
      category,
      image,
      interests = [],
      socialLinks = {}
    } = req.body;
    
    // Validation
    if (!name || !description || !leader || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, description, leader, category'
      });
    }
    
    // Check if club name already exists
    const existingClub = clubs.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (existingClub) {
      return res.status(409).json({
        success: false,
        message: 'Club with this name already exists'
      });
    }
    
    // Generate new ID
    const newId = Math.max(...clubs.map(c => c.id)) + 1;
    
    // Create new club
    const newClub = {
      id: newId,
      name,
      description,
      leader,
      members: 1, // Start with leader as first member
      meetingTime: meetingTime || 'TBD',
      location: location || 'TBD',
      category,
      rating: 0, // New clubs start with no rating
      image: image || '🎯',
      interests: Array.isArray(interests) ? interests : [],
      upcomingMeetings: [],
      achievements: [],
      socialLinks: socialLinks || {}
    };
    
    clubs.push(newClub);
    
    res.status(201).json({
      success: true,
      message: 'Club created successfully',
      data: newClub
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating club',
      error: error.message
    });
  }
});

// PUT /api/clubs/:id - Update club
router.put('/:id', (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    const clubIndex = clubs.findIndex(c => c.id === clubId);
    
    if (clubIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }
    
    const {
      name,
      description,
      leader,
      meetingTime,
      location,
      category,
      image,
      interests,
      socialLinks,
      achievements
    } = req.body;
    
    // Update club (only update provided fields)
    const updatedClub = {
      ...clubs[clubIndex],
      ...(name && { name }),
      ...(description && { description }),
      ...(leader && { leader }),
      ...(meetingTime && { meetingTime }),
      ...(location && { location }),
      ...(category && { category }),
      ...(image && { image }),
      ...(interests && { interests }),
      ...(socialLinks && { socialLinks }),
      ...(achievements && { achievements })
    };
    
    clubs[clubIndex] = updatedClub;
    
    res.json({
      success: true,
      message: 'Club updated successfully',
      data: updatedClub
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating club',
      error: error.message
    });
  }
});

// DELETE /api/clubs/:id - Delete club
router.delete('/:id', (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    const clubIndex = clubs.findIndex(c => c.id === clubId);
    
    if (clubIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }
    
    const deletedClub = clubs[clubIndex];
    clubs.splice(clubIndex, 1);
    
    res.json({
      success: true,
      message: 'Club deleted successfully',
      data: deletedClub
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting club',
      error: error.message
    });
  }
});

// POST /api/clubs/:id/join - Join a club
router.post('/:id/join', (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    const club = clubs.find(c => c.id === clubId);
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }
    
    // Increment member count
    club.members += 1;
    
    res.json({
      success: true,
      message: `Successfully joined ${club.name}!`,
      data: club
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error joining club',
      error: error.message
    });
  }
});

// POST /api/clubs/:id/leave - Leave a club
router.post('/:id/leave', (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    const club = clubs.find(c => c.id === clubId);
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }
    
    // Decrement member count (minimum 1 for leader)
    if (club.members > 1) {
      club.members -= 1;
    }
    
    res.json({
      success: true,
      message: `Successfully left ${club.name}`,
      data: club
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error leaving club',
      error: error.message
    });
  }
});

module.exports = router;
