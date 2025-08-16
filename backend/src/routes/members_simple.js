const express = require("express");
const { body, validationResult } = require("express-validator");
const { getDbConnection } = require("../database/init");

const router = express.Router();

// Get members of a club
router.get("/club/:clubId", async (req, res) => {
  try {
    const db = getDbConnection();
    const clubId = req.params.clubId;

    db.all(
      `
      SELECT 
        cm.*,
        'User' as name,
        'user@example.com' as email
      FROM club_members cm
      WHERE cm.club_id = ?
      ORDER BY cm.joined_at DESC
    `,
      [clubId],
      (err, members) => {
        db.close();

        if (err) {
          return res.status(500).json({ message: "Database error" });
        }

        res.json(members);
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Join a club (simplified)
router.post("/:clubId/join", async (req, res) => {
  try {
    const clubId = req.params.clubId;
    const userId = 1; // Default user
    const db = getDbConnection();

    // Check if already a member
    db.get(
      "SELECT * FROM club_members WHERE club_id = ? AND user_id = ?",
      [clubId, userId],
      (err, existingMember) => {
        if (err) {
          db.close();
          return res.status(500).json({ message: "Database error" });
        }

        if (existingMember) {
          db.close();
          return res
            .status(400)
            .json({ message: "Already a member of this club" });
        }

        // Add member
        db.run(
          "INSERT INTO club_members (club_id, user_id) VALUES (?, ?)",
          [clubId, userId],
          function (err) {
            db.close();

            if (err) {
              return res.status(500).json({ message: "Error joining club" });
            }

            res.json({ message: "Successfully joined club" });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
