const express = require("express");
const { body, validationResult } = require("express-validator");
const { getDbConnection } = require("../database/init");
const { authenticateToken, requireClubLeader } = require("../middleware/auth");

const router = express.Router();

// Get club members
router.get("/clubs/:id/members", async (req, res) => {
  try {
    const db = getDbConnection();
    const clubId = req.params.id;

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
      ORDER BY 
        CASE cm.role 
          WHEN 'leader' THEN 1 
          WHEN 'admin' THEN 2 
          ELSE 3 
        END,
        cm.joined_at ASC
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

// Add member to club
router.post(
  "/clubs/:id/members",
  authenticateToken,
  requireClubLeader,
  [
    body("email").isEmail().normalizeEmail(),
    body("role").optional().isIn(["member", "admin"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const clubId = req.params.id;
      const { email, role = "member" } = req.body;
      const db = getDbConnection();

      // Find user by email
      db.get(
        "SELECT id, name FROM users WHERE email = ?",
        [email],
        (err, user) => {
          if (err) {
            db.close();
            return res.status(500).json({ message: "Database error" });
          }

          if (!user) {
            db.close();
            return res.status(404).json({ message: "User not found" });
          }

          // Check if user is already a member
          db.get(
            "SELECT id FROM club_members WHERE club_id = ? AND user_id = ?",
            [clubId, user.id],
            (err, existingMember) => {
              if (err) {
                db.close();
                return res.status(500).json({ message: "Database error" });
              }

              if (existingMember) {
                db.close();
                return res
                  .status(400)
                  .json({ message: "User is already a member of this club" });
              }

              // Add user as member
              db.run(
                "INSERT INTO club_members (club_id, user_id, role) VALUES (?, ?, ?)",
                [clubId, user.id, role],
                function (err) {
                  db.close();

                  if (err) {
                    return res
                      .status(500)
                      .json({ message: "Error adding member to club" });
                  }

                  res.status(201).json({
                    message: "Member added successfully",
                    member: {
                      id: user.id,
                      name: user.name,
                      email,
                      role,
                      joined_at: new Date().toISOString(),
                    },
                  });
                }
              );
            }
          );
        }
      );
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update member role
router.put(
  "/clubs/:id/members/:memberId",
  authenticateToken,
  requireClubLeader,
  [body("role").isIn(["member", "admin"])],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const clubId = req.params.id;
      const memberId = req.params.memberId;
      const { role } = req.body;
      const db = getDbConnection();

      // Cannot change leader role
      db.get(
        "SELECT leader_id FROM clubs WHERE id = ?",
        [clubId],
        (err, club) => {
          if (err) {
            db.close();
            return res.status(500).json({ message: "Database error" });
          }

          if (club.leader_id == memberId) {
            db.close();
            return res
              .status(400)
              .json({ message: "Cannot change leader role" });
          }

          db.run(
            "UPDATE club_members SET role = ? WHERE club_id = ? AND user_id = ?",
            [role, clubId, memberId],
            function (err) {
              db.close();

              if (err) {
                return res
                  .status(500)
                  .json({ message: "Error updating member role" });
              }

              if (this.changes === 0) {
                return res.status(404).json({ message: "Member not found" });
              }

              res.json({ message: "Member role updated successfully" });
            }
          );
        }
      );
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Remove member from club
router.delete(
  "/clubs/:id/members/:memberId",
  authenticateToken,
  requireClubLeader,
  async (req, res) => {
    try {
      const clubId = req.params.id;
      const memberId = req.params.memberId;
      const db = getDbConnection();

      // Cannot remove leader
      db.get(
        "SELECT leader_id FROM clubs WHERE id = ?",
        [clubId],
        (err, club) => {
          if (err) {
            db.close();
            return res.status(500).json({ message: "Database error" });
          }

          if (club.leader_id == memberId) {
            db.close();
            return res
              .status(400)
              .json({ message: "Cannot remove club leader" });
          }

          db.run(
            "DELETE FROM club_members WHERE club_id = ? AND user_id = ?",
            [clubId, memberId],
            function (err) {
              db.close();

              if (err) {
                return res
                  .status(500)
                  .json({ message: "Error removing member" });
              }

              if (this.changes === 0) {
                return res.status(404).json({ message: "Member not found" });
              }

              res.json({ message: "Member removed successfully" });
            }
          );
        }
      );
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Join club (self-service)
router.post("/clubs/:id/join", authenticateToken, async (req, res) => {
  try {
    const clubId = req.params.id;
    const userId = req.user.id;
    const db = getDbConnection();

    // Check if club exists
    db.get("SELECT id, name FROM clubs WHERE id = ?", [clubId], (err, club) => {
      if (err) {
        db.close();
        return res.status(500).json({ message: "Database error" });
      }

      if (!club) {
        db.close();
        return res.status(404).json({ message: "Club not found" });
      }

      // Check if already a member
      db.get(
        "SELECT id FROM club_members WHERE club_id = ? AND user_id = ?",
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
              .json({ message: "You are already a member of this club" });
          }

          // Add as member
          db.run(
            "INSERT INTO club_members (club_id, user_id, role) VALUES (?, ?, ?)",
            [clubId, userId, "member"],
            function (err) {
              db.close();

              if (err) {
                return res.status(500).json({ message: "Error joining club" });
              }

              res.status(201).json({
                message: `Successfully joined ${club.name}`,
                membership: {
                  club_id: clubId,
                  user_id: userId,
                  role: "member",
                  joined_at: new Date().toISOString(),
                },
              });
            }
          );
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Leave club (self-service)
router.post("/clubs/:id/leave", authenticateToken, async (req, res) => {
  try {
    const clubId = req.params.id;
    const userId = req.user.id;
    const db = getDbConnection();

    // Check if user is the leader
    db.get(
      "SELECT leader_id FROM clubs WHERE id = ?",
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

        if (club.leader_id == userId) {
          db.close();
          return res.status(400).json({
            message:
              "Club leaders cannot leave their club. Transfer leadership first or delete the club.",
          });
        }

        db.run(
          "DELETE FROM club_members WHERE club_id = ? AND user_id = ?",
          [clubId, userId],
          function (err) {
            db.close();

            if (err) {
              return res.status(500).json({ message: "Error leaving club" });
            }

            if (this.changes === 0) {
              return res
                .status(404)
                .json({ message: "You are not a member of this club" });
            }

            res.json({ message: "Successfully left the club" });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
