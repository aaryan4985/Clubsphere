const express = require("express");
const { getDbConnection } = require("../database/init");
const { authenticateToken } = require("../middleware/auth");
const calendarService = require("../services/calendarService");

const router = express.Router();

// Get Google Calendar auth URL
router.get("/auth-url", authenticateToken, async (req, res) => {
  try {
    const authUrl = calendarService.getAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    res.status(500).json({ message: "Error generating auth URL" });
  }
});

// Handle Google OAuth callback
router.post("/callback", authenticateToken, async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    if (!code) {
      return res.status(400).json({ message: "Authorization code required" });
    }

    const tokens = await calendarService.getTokensFromCode(code);

    if (!tokens) {
      return res
        .status(400)
        .json({ message: "Failed to exchange code for tokens" });
    }

    // Store tokens in database
    const db = getDbConnection();
    db.run(
      "UPDATE users SET google_access_token = ?, google_refresh_token = ? WHERE id = ?",
      [tokens.access_token, tokens.refresh_token, userId],
      function (err) {
        db.close();

        if (err) {
          return res
            .status(500)
            .json({ message: "Error storing calendar tokens" });
        }

        res.json({
          message: "Google Calendar connected successfully",
          connected: true,
        });
      }
    );
  } catch (error) {
    console.error("Calendar callback error:", error);
    res.status(500).json({ message: "Error connecting to Google Calendar" });
  }
});

// Get calendar connection status
router.get("/status", authenticateToken, async (req, res) => {
  try {
    const db = getDbConnection();
    const userId = req.user.id;

    db.get(
      "SELECT google_access_token FROM users WHERE id = ?",
      [userId],
      (err, user) => {
        db.close();

        if (err) {
          return res.status(500).json({ message: "Database error" });
        }

        const connected = !!(user && user.google_access_token);
        res.json({ connected });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Disconnect Google Calendar
router.post("/disconnect", authenticateToken, async (req, res) => {
  try {
    const db = getDbConnection();
    const userId = req.user.id;

    db.run(
      "UPDATE users SET google_access_token = NULL, google_refresh_token = NULL WHERE id = ?",
      [userId],
      function (err) {
        db.close();

        if (err) {
          return res
            .status(500)
            .json({ message: "Error disconnecting calendar" });
        }

        res.json({
          message: "Google Calendar disconnected successfully",
          connected: false,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Sync events with Google Calendar
router.post("/sync", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const db = getDbConnection();

    // Get user's events that need syncing
    db.all(
      `
      SELECT e.* 
      FROM events e
      JOIN clubs c ON e.club_id = c.id
      WHERE (e.creator_id = ? OR c.leader_id = ?)
        AND e.calendar_sync_status IN ('pending', 'failed')
        AND e.start_time > datetime('now')
    `,
      [userId, userId],
      async (err, events) => {
        if (err) {
          db.close();
          return res.status(500).json({ message: "Database error" });
        }

        let synced = 0;
        let failed = 0;

        for (const event of events) {
          try {
            const calendarEventId = await calendarService.createEvent({
              title: event.title,
              description: event.description,
              start_time: event.start_time,
              end_time: event.end_time,
              location: event.location,
              creator_id: userId,
            });

            if (calendarEventId) {
              db.run(
                "UPDATE events SET google_event_id = ?, calendar_sync_status = ? WHERE id = ?",
                [calendarEventId, "synced", event.id]
              );
              synced++;
            } else {
              failed++;
            }
          } catch (syncError) {
            console.error(`Sync error for event ${event.id}:`, syncError);
            db.run("UPDATE events SET calendar_sync_status = ? WHERE id = ?", [
              "failed",
              event.id,
            ]);
            failed++;
          }
        }

        db.close();
        res.json({
          message: `Sync complete: ${synced} synced, ${failed} failed`,
          synced,
          failed,
          total: events.length,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get upcoming events from Google Calendar
router.get("/upcoming", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await calendarService.getUpcomingEvents(userId);
    res.json(events || []);
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    res.status(500).json({ message: "Error fetching calendar events" });
  }
});

module.exports = router;
