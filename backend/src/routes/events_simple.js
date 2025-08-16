const express = require("express");
const { body, validationResult } = require("express-validator");
const { getDbConnection } = require("../database/init");

const router = express.Router();

// Get events for a club
router.get("/club/:clubId", async (req, res) => {
  try {
    const db = getDbConnection();
    const clubId = req.params.clubId;

    db.all(
      `
      SELECT 
        e.*,
        c.name as club_name
      FROM events e
      JOIN clubs c ON e.club_id = c.id
      WHERE e.club_id = ?
      ORDER BY e.date ASC
    `,
      [clubId],
      (err, events) => {
        db.close();

        if (err) {
          return res.status(500).json({ message: "Database error" });
        }

        res.json(events);
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all events
router.get("/", async (req, res) => {
  try {
    const db = getDbConnection();

    db.all(
      `
      SELECT 
        e.*,
        c.name as club_name
      FROM events e
      JOIN clubs c ON e.club_id = c.id
      ORDER BY e.date ASC
    `,
      (err, events) => {
        db.close();

        if (err) {
          return res.status(500).json({ message: "Database error" });
        }

        res.json(events);
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create new event
router.post(
  "/",
  [
    body("title").trim().isLength({ min: 1 }),
    body("description").optional().trim(),
    body("date").isISO8601(),
    body("location").optional().trim(),
    body("club_id").isInt(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, date, location, club_id } = req.body;
      const db = getDbConnection();

      db.run(
        "INSERT INTO events (title, description, date, location, club_id, creator_id) VALUES (?, ?, ?, ?, ?, ?)",
        [title, description || "", date, location || "", club_id, 1],
        function (err) {
          db.close();

          if (err) {
            return res.status(500).json({ message: "Error creating event" });
          }

          const eventId = this.lastID;

          res.status(201).json({
            message: "Event created successfully",
            event: {
              id: eventId,
              title,
              description,
              date,
              location,
              club_id,
              creator_id: 1,
            },
          });
        }
      );
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
