const express = require("express");
const { getDbConnection } = require("../database/init");

const router = express.Router();

// Simple calendar endpoints without Google integration
router.get("/events", async (req, res) => {
  try {
    const db = getDbConnection();

    db.all(
      `
      SELECT 
        e.*,
        c.name as club_name,
        'calendar' as source
      FROM events e
      JOIN clubs c ON e.club_id = c.id
      ORDER BY e.date ASC
    `,
      (err, events) => {
        db.close();

        if (err) {
          return res.status(500).json({ message: "Database error" });
        }

        // Format events for calendar display
        const calendarEvents = events.map((event) => ({
          id: event.id,
          title: event.title,
          start: event.date,
          end: event.date,
          description: event.description,
          location: event.location,
          club: event.club_name,
        }));

        res.json(calendarEvents);
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Simple sync endpoint (placeholder)
router.post("/sync", async (req, res) => {
  res.json({
    message: "Calendar sync not implemented in simplified version",
    events_synced: 0,
  });
});

module.exports = router;
