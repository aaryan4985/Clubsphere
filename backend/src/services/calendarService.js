const { google } = require("googleapis");
const { getDbConnection } = require("../database/init");

class CalendarService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    this.calendar = google.calendar({ version: "v3", auth: this.oauth2Client });
  }

  getAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
      ],
      prompt: "consent",
    });
  }

  async getTokensFromCode(code) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      return tokens;
    } catch (error) {
      console.error("Error getting tokens:", error);
      return null;
    }
  }

  async getUserTokens(userId) {
    return new Promise((resolve, reject) => {
      const db = getDbConnection();
      db.get(
        "SELECT google_access_token, google_refresh_token FROM users WHERE id = ?",
        [userId],
        (err, user) => {
          db.close();
          if (err) reject(err);
          else resolve(user);
        }
      );
    });
  }

  async setUserCredentials(userId) {
    try {
      const user = await this.getUserTokens(userId);
      if (!user || !user.google_access_token) {
        return false;
      }

      this.oauth2Client.setCredentials({
        access_token: user.google_access_token,
        refresh_token: user.google_refresh_token,
      });

      // Handle token refresh
      this.oauth2Client.on("tokens", (tokens) => {
        if (tokens.refresh_token) {
          // Update stored tokens
          const db = getDbConnection();
          db.run(
            "UPDATE users SET google_access_token = ?, google_refresh_token = ? WHERE id = ?",
            [tokens.access_token, tokens.refresh_token, userId],
            () => db.close()
          );
        }
      });

      return true;
    } catch (error) {
      console.error("Error setting credentials:", error);
      return false;
    }
  }

  async createEvent(eventData) {
    try {
      const { title, description, start_time, end_time, location, creator_id } =
        eventData;

      const hasCredentials = await this.setUserCredentials(creator_id);
      if (!hasCredentials) {
        console.log("No Google Calendar credentials for user:", creator_id);
        return null;
      }

      const event = {
        summary: title,
        description: description || "",
        location: location || "",
        start: {
          dateTime: new Date(start_time).toISOString(),
          timeZone: "UTC",
        },
        end: {
          dateTime: new Date(end_time).toISOString(),
          timeZone: "UTC",
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 }, // 1 day before
            { method: "popup", minutes: 30 }, // 30 minutes before
          ],
        },
      };

      const response = await this.calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });

      return response.data.id;
    } catch (error) {
      console.error("Error creating calendar event:", error);
      throw error;
    }
  }

  async updateEvent(eventId, eventData, userId) {
    try {
      const hasCredentials = await this.setUserCredentials(userId);
      if (!hasCredentials) {
        return null;
      }

      const { title, description, start_time, end_time, location } = eventData;

      const updateData = {};
      if (title) updateData.summary = title;
      if (description !== undefined) updateData.description = description;
      if (location !== undefined) updateData.location = location;

      if (start_time) {
        updateData.start = {
          dateTime: new Date(start_time).toISOString(),
          timeZone: "UTC",
        };
      }

      if (end_time) {
        updateData.end = {
          dateTime: new Date(end_time).toISOString(),
          timeZone: "UTC",
        };
      }

      const response = await this.calendar.events.patch({
        calendarId: "primary",
        eventId: eventId,
        resource: updateData,
      });

      return response.data.id;
    } catch (error) {
      console.error("Error updating calendar event:", error);
      throw error;
    }
  }

  async deleteEvent(eventId, userId) {
    try {
      const hasCredentials = await this.setUserCredentials(userId);
      if (!hasCredentials) {
        return false;
      }

      await this.calendar.events.delete({
        calendarId: "primary",
        eventId: eventId,
      });

      return true;
    } catch (error) {
      console.error("Error deleting calendar event:", error);
      throw error;
    }
  }

  async getUpcomingEvents(userId, maxResults = 10) {
    try {
      const hasCredentials = await this.setUserCredentials(userId);
      if (!hasCredentials) {
        return [];
      }

      const response = await this.calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: maxResults,
        singleEvents: true,
        orderBy: "startTime",
      });

      return response.data.items || [];
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      throw error;
    }
  }

  async createEventWithAttendees(eventData, attendeeEmails) {
    try {
      const { title, description, start_time, end_time, location, creator_id } =
        eventData;

      const hasCredentials = await this.setUserCredentials(creator_id);
      if (!hasCredentials) {
        return null;
      }

      const attendees = attendeeEmails.map((email) => ({ email }));

      const event = {
        summary: title,
        description: description || "",
        location: location || "",
        start: {
          dateTime: new Date(start_time).toISOString(),
          timeZone: "UTC",
        },
        end: {
          dateTime: new Date(end_time).toISOString(),
          timeZone: "UTC",
        },
        attendees: attendees,
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 },
            { method: "popup", minutes: 30 },
          ],
        },
        guestsCanModify: false,
        guestsCanInviteOthers: false,
        guestsCanSeeOtherGuests: true,
      };

      const response = await this.calendar.events.insert({
        calendarId: "primary",
        resource: event,
        sendUpdates: "all", // Send email invitations
      });

      return response.data.id;
    } catch (error) {
      console.error("Error creating calendar event with attendees:", error);
      throw error;
    }
  }
}

module.exports = new CalendarService();
