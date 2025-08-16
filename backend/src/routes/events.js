const express = require("express");
const { body, validationResult } = require("express-validator");
const { getDbConnection } = require("../database/init");
const { authenticateToken, requireClubMember } = require("../middleware/auth");
const calendarService = require("../services/calendarService");
const aiService = require("../services/aiService");

const router = express.Router();

// Get all events (with optional club filter)
router.get("/", async (req, res) => {
  try {
    const db = getDbConnection();
    const { club_id, upcoming } = req.query;

    let query = `
      SELECT 
        e.*,
        c.name as club_name,
        u.name as creator_name,
        COUNT(ea.user_id) as attendee_count
      FROM events e
      JOIN clubs c ON e.club_id = c.id
      JOIN users u ON e.creator_id = u.id
      LEFT JOIN event_attendees ea ON e.id = ea.event_id
    `;

    let params = [];
    let conditions = [];

    if (club_id) {
      conditions.push("e.club_id = ?");
      params.push(club_id);
    }

    if (upcoming === "true") {
      conditions.push('e.start_time > datetime("now")');
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " GROUP BY e.id ORDER BY e.start_time ASC";

    db.all(query, params, (err, events) => {
      db.close();

      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      res.json(events);
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get specific event
router.get("/:id", async (req, res) => {
  try {
    const db = getDbConnection();
    const eventId = req.params.id;

    db.get(
      `
      SELECT 
        e.*,
        c.name as club_name,
        u.name as creator_name,
        u.email as creator_email
      FROM events e
      JOIN clubs c ON e.club_id = c.id
      JOIN users u ON e.creator_id = u.id
      WHERE e.id = ?
    `,
      [eventId],
      (err, event) => {
        if (err) {
          db.close();
          return res.status(500).json({ message: "Database error" });
        }

        if (!event) {
          db.close();
          return res.status(404).json({ message: "Event not found" });
        }

        // Get attendees
        db.all(
          `
        SELECT 
          ea.status,
          ea.invite_sent,
          ea.responded_at,
          u.id,
          u.name,
          u.email
        FROM event_attendees ea
        JOIN users u ON ea.user_id = u.id
        WHERE ea.event_id = ?
        ORDER BY ea.id ASC
      `,
          [eventId],
          (err, attendees) => {
            db.close();

            if (err) {
              return res.status(500).json({ message: "Database error" });
            }

            res.json({
              ...event,
              attendees,
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create new event
router.post(
  "/",
  authenticateToken,
  requireClubMember,
  [
    body("title").trim().isLength({ min: 1 }),
    body("description").optional().trim(),
    body("start_time").isISO8601(),
    body("end_time").isISO8601(),
    body("location").optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, start_time, end_time, location } = req.body;
      const club_id = req.body.club_id || req.params.club_id;
      const creator_id = req.user.id;

      // Validate times
      const startDate = new Date(start_time);
      const endDate = new Date(end_time);

      if (startDate >= endDate) {
        return res
          .status(400)
          .json({ message: "End time must be after start time" });
      }

      if (startDate < new Date()) {
        return res.status(400).json({ message: "Event cannot be in the past" });
      }

      const db = getDbConnection();

      db.run(
        `INSERT INTO events (title, description, club_id, creator_id, start_time, end_time, location) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          description || "",
          club_id,
          creator_id,
          start_time,
          end_time,
          location || "",
        ],
        async function (err) {
          if (err) {
            db.close();
            return res.status(500).json({ message: "Error creating event" });
          }

          const eventId = this.lastID;

          try {
            // Create Google Calendar event if user has connected their calendar
            const calendarEventId = await calendarService.createEvent({
              title,
              description,
              start_time,
              end_time,
              location,
              creator_id,
            });

            if (calendarEventId) {
              db.run(
                "UPDATE events SET google_event_id = ?, calendar_sync_status = ? WHERE id = ?",
                [calendarEventId, "synced", eventId]
              );
            }

            // Add all club members as attendees
            db.all(
              "SELECT user_id FROM club_members WHERE club_id = ?",
              [club_id],
              async (err, members) => {
                if (!err && members.length > 0) {
                  const attendeeInserts = members.map(
                    (member) =>
                      new Promise((resolve, reject) => {
                        db.run(
                          "INSERT INTO event_attendees (event_id, user_id, status) VALUES (?, ?, ?)",
                          [
                            eventId,
                            member.user_id,
                            member.user_id === creator_id
                              ? "accepted"
                              : "pending",
                          ],
                          (err) => (err ? reject(err) : resolve())
                        );
                      })
                  );

                  await Promise.all(attendeeInserts);

                  // Generate AI invites for members (excluding creator)
                  const membersToInvite = members.filter(
                    (m) => m.user_id !== creator_id
                  );
                  if (membersToInvite.length > 0) {
                    aiService
                      .generateInvites(eventId, membersToInvite, {
                        title,
                        description,
                        start_time,
                        end_time,
                        location,
                      })
                      .catch(console.error);
                  }
                }

                db.close();
                res.status(201).json({
                  message: "Event created successfully",
                  event: {
                    id: eventId,
                    title,
                    description,
                    club_id,
                    creator_id,
                    start_time,
                    end_time,
                    location,
                    google_event_id: calendarEventId,
                    calendar_sync_status: calendarEventId
                      ? "synced"
                      : "pending",
                  },
                });
              }
            );
          } catch (calendarError) {
            console.error("Calendar sync error:", calendarError);
            db.close();
            res.status(201).json({
              message: "Event created successfully (calendar sync failed)",
              event: {
                id: eventId,
                title,
                description,
                club_id,
                creator_id,
                start_time,
                end_time,
                location,
                calendar_sync_status: "failed",
              },
            });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update event
router.put(
  "/:id",
  authenticateToken,
  [
    body("title").optional().trim().isLength({ min: 1 }),
    body("description").optional().trim(),
    body("start_time").optional().isISO8601(),
    body("end_time").optional().isISO8601(),
    body("location").optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const eventId = req.params.id;
      const userId = req.user.id;
      const db = getDbConnection();

      // Check if user can edit this event (creator or club leader)
      db.get(
        `
      SELECT e.*, c.leader_id 
      FROM events e 
      JOIN clubs c ON e.club_id = c.id 
      WHERE e.id = ?
    `,
        [eventId],
        async (err, event) => {
          if (err) {
            db.close();
            return res.status(500).json({ message: "Database error" });
          }

          if (!event) {
            db.close();
            return res.status(404).json({ message: "Event not found" });
          }

          if (event.creator_id !== userId && event.leader_id !== userId) {
            db.close();
            return res
              .status(403)
              .json({ message: "Not authorized to edit this event" });
          }

          // Build update query
          const updates = {};
          if (req.body.title) updates.title = req.body.title;
          if (req.body.description !== undefined)
            updates.description = req.body.description;
          if (req.body.start_time) updates.start_time = req.body.start_time;
          if (req.body.end_time) updates.end_time = req.body.end_time;
          if (req.body.location !== undefined)
            updates.location = req.body.location;

          if (Object.keys(updates).length === 0) {
            db.close();
            return res
              .status(400)
              .json({ message: "No valid updates provided" });
          }

          // Validate times if provided
          if (updates.start_time || updates.end_time) {
            const startTime = updates.start_time || event.start_time;
            const endTime = updates.end_time || event.end_time;

            if (new Date(startTime) >= new Date(endTime)) {
              db.close();
              return res
                .status(400)
                .json({ message: "End time must be after start time" });
            }
          }

          const setClause = Object.keys(updates)
            .map((key) => `${key} = ?`)
            .join(", ");
          const values = [...Object.values(updates), eventId];

          db.run(
            `UPDATE events SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            values,
            async function (err) {
              db.close();

              if (err) {
                return res
                  .status(500)
                  .json({ message: "Error updating event" });
              }

              // Update Google Calendar event if it exists
              if (event.google_event_id) {
                try {
                  await calendarService.updateEvent(event.google_event_id, {
                    ...updates,
                    creator_id: event.creator_id,
                  });
                } catch (calendarError) {
                  console.error("Calendar update error:", calendarError);
                }
              }

              res.json({ message: "Event updated successfully" });
            }
          );
        }
      );
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete event
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;
    const db = getDbConnection();

    // Check if user can delete this event
    db.get(
      `
      SELECT e.*, c.leader_id 
      FROM events e 
      JOIN clubs c ON e.club_id = c.id 
      WHERE e.id = ?
    `,
      [eventId],
      async (err, event) => {
        if (err) {
          db.close();
          return res.status(500).json({ message: "Database error" });
        }

        if (!event) {
          db.close();
          return res.status(404).json({ message: "Event not found" });
        }

        if (event.creator_id !== userId && event.leader_id !== userId) {
          db.close();
          return res
            .status(403)
            .json({ message: "Not authorized to delete this event" });
        }

        // Delete from Google Calendar if synced
        if (event.google_event_id) {
          try {
            await calendarService.deleteEvent(
              event.google_event_id,
              event.creator_id
            );
          } catch (calendarError) {
            console.error("Calendar delete error:", calendarError);
          }
        }

        db.run("DELETE FROM events WHERE id = ?", [eventId], function (err) {
          db.close();

          if (err) {
            return res.status(500).json({ message: "Error deleting event" });
          }

          res.json({ message: "Event deleted successfully" });
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// RSVP to event
router.post(
  "/:id/rsvp",
  authenticateToken,
  [body("status").isIn(["accepted", "declined", "maybe"])],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const eventId = req.params.id;
      const userId = req.user.id;
      const { status } = req.body;
      const db = getDbConnection();

      db.run(
        `UPDATE event_attendees 
       SET status = ?, responded_at = CURRENT_TIMESTAMP 
       WHERE event_id = ? AND user_id = ?`,
        [status, eventId, userId],
        function (err) {
          db.close();

          if (err) {
            return res.status(500).json({ message: "Error updating RSVP" });
          }

          if (this.changes === 0) {
            return res
              .status(404)
              .json({ message: "Event attendance record not found" });
          }

          res.json({ message: "RSVP updated successfully" });
        }
      );
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
