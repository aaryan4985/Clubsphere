const express = require("express");
const { body, validationResult } = require("express-validator");
const { getDbConnection } = require("../database/init");

const router = express.Router();

// Get all clubs (public)
router.get("/", async (req, res) => {
  try {
    const db = getDbConnection();

    db.all(
      `
      SELECT 
        c.*,
        'Admin' as leader_name,
        COUNT(cm.user_id) as member_count
      FROM clubs c
      LEFT JOIN club_members cm ON c.id = cm.club_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `,
      (err, clubs) => {
        db.close();

        if (err) {
          return res.status(500).json({ message: "Database error" });
        }

        res.json(clubs);
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get specific club
router.get("/:id", async (req, res) => {
  try {
    const db = getDbConnection();
    const clubId = req.params.id;

    db.get(
      `
      SELECT 
        c.*,
        'Admin' as leader_name,
        'admin@clubsphere.com' as leader_email
      FROM clubs c
      WHERE c.id = ?
    `,
      [clubId],
      (err, club) => {
        if (err) {
          db.close();
          return res.status(500).json({ message: "Database error" });
        }

        if (!club) {
          db.close();
          return res.status(404).json({ message: "Club not found" });
        }

        db.close();
        res.json({
          ...club,
          members: [],
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create new club
router.post(
  "/",
  [
    body("name").trim().isLength({ min: 1 }),
    body("description").optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description } = req.body;
      const leaderId = 1; // Default user
      const db = getDbConnection();

      db.run(
        "INSERT INTO clubs (name, description, leader_id) VALUES (?, ?, ?)",
        [name, description || "", leaderId],
        function (err) {
          db.close();

          if (err) {
            return res.status(500).json({ message: "Error creating club" });
          }

          const clubId = this.lastID;

          res.status(201).json({
            message: "Club created successfully",
            club: {
              id: clubId,
              name,
              description,
              leader_id: leaderId,
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
