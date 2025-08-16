const express = require("express");
const { body, validationResult } = require("express-validator");
const { getDbConnection } = require("../database/init");

const router = express.Router();
express = require("express");
const { body, validationResult } = require("express-validator");
const { getDbConnection } = require("../database/init");
const { authenticateToken, requireClubLeader } = require("../middleware/auth");

const router = express.Router();

// Get all clubs (public)
router.get("/", async (req, res) => {
  try {
    const db = getDbConnection();

    db.all(
      `
      SELECT 
        c.*,
        u.name as leader_name,
        COUNT(cm.user_id) as member_count
      FROM clubs c
      JOIN users u ON c.leader_id = u.id
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
        u.name as leader_name,
        u.email as leader_email
      FROM clubs c
      JOIN users u ON c.leader_id = u.id
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

        // Get members
        db.all(
          `
        SELECT 
          cm.role,
          cm.joined_at,
          u.id,
          u.name,
          u.email
        FROM club_members cm
        JOIN users u ON cm.user_id = u.id
        WHERE cm.club_id = ?
        ORDER BY cm.joined_at ASC
      `,
          [clubId],
          (err, members) => {
            db.close();

            if (err) {
              return res.status(500).json({ message: "Database error" });
            }

            res.json({
              ...club,
              members,
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create new club
router.post(
  "/",
  authenticateToken,
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
      const leaderId = req.user.id;
      const db = getDbConnection();

      db.run(
        "INSERT INTO clubs (name, description, leader_id) VALUES (?, ?, ?)",
        [name, description || "", leaderId],
        function (err) {
          if (err) {
            db.close();
            return res.status(500).json({ message: "Error creating club" });
          }

          const clubId = this.lastID;

          // Add leader as member
          db.run(
            "INSERT INTO club_members (club_id, user_id, role) VALUES (?, ?, ?)",
            [clubId, leaderId, "leader"],
            (err) => {
              db.close();

              if (err) {
                return res
                  .status(500)
                  .json({ message: "Error adding leader as member" });
              }

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
        }
      );
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update club
router.put(
  "/:id",
  authenticateToken,
  requireClubLeader,
  [
    body("name").optional().trim().isLength({ min: 1 }),
    body("description").optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const clubId = req.params.id;
      const updates = {};

      if (req.body.name) updates.name = req.body.name;
      if (req.body.description !== undefined)
        updates.description = req.body.description;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No valid updates provided" });
      }

      const db = getDbConnection();
      const setClause = Object.keys(updates)
        .map((key) => `${key} = ?`)
        .join(", ");
      const values = [...Object.values(updates), clubId];

      db.run(
        `UPDATE clubs SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        values,
        function (err) {
          db.close();

          if (err) {
            return res.status(500).json({ message: "Error updating club" });
          }

          if (this.changes === 0) {
            return res.status(404).json({ message: "Club not found" });
          }

          res.json({ message: "Club updated successfully" });
        }
      );
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete club
router.delete(
  "/:id",
  authenticateToken,
  requireClubLeader,
  async (req, res) => {
    try {
      const clubId = req.params.id;
      const db = getDbConnection();

      db.run("DELETE FROM clubs WHERE id = ?", [clubId], function (err) {
        db.close();

        if (err) {
          return res.status(500).json({ message: "Error deleting club" });
        }

        if (this.changes === 0) {
          return res.status(404).json({ message: "Club not found" });
        }

        res.json({ message: "Club deleted successfully" });
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get clubs where user is a member
router.get("/user/memberships", authenticateToken, async (req, res) => {
  try {
    const db = getDbConnection();
    const userId = req.user.id;

    db.all(
      `
      SELECT 
        c.*,
        cm.role as member_role,
        cm.joined_at,
        u.name as leader_name,
        COUNT(cm2.user_id) as member_count
      FROM clubs c
      JOIN club_members cm ON c.id = cm.club_id
      JOIN users u ON c.leader_id = u.id
      LEFT JOIN club_members cm2 ON c.id = cm2.club_id
      WHERE cm.user_id = ?
      GROUP BY c.id
      ORDER BY cm.joined_at DESC
    `,
      [userId],
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

module.exports = router;
