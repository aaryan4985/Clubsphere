const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getDbConnection } = require("../database/init");

class AIService {
  constructor() {
    if (process.env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    }
  }

  async generatePersonalizedInvite(eventDetails, recipientInfo) {
    try {
      if (!this.model) {
        console.log("Gemini API not configured, using default invite");
        return this.getDefaultInvite(eventDetails, recipientInfo);
      }

      const prompt = `
        Create a personalized, friendly event invitation for the following:
        
        Event: ${eventDetails.title}
        Description: ${eventDetails.description || "No description provided"}
        Date & Time: ${new Date(
          eventDetails.start_time
        ).toLocaleString()} - ${new Date(
        eventDetails.end_time
      ).toLocaleString()}
        Location: ${eventDetails.location || "Location TBD"}
        
        Recipient: ${recipientInfo.name}
        
        Requirements:
        - Keep it conversational and engaging
        - Maximum 150 words
        - Include why they might be interested
        - End with a clear call-to-action to RSVP
        - Make it feel personal, not like a mass email
        - Use a friendly, enthusiastic tone
        
        Format as plain text (no markdown or HTML).
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text.trim();
    } catch (error) {
      console.error("Error generating AI invite:", error);
      return this.getDefaultInvite(eventDetails, recipientInfo);
    }
  }

  getDefaultInvite(eventDetails, recipientInfo) {
    const startTime = new Date(eventDetails.start_time).toLocaleString();
    const endTime = new Date(eventDetails.end_time).toLocaleString();

    return `Hi ${recipientInfo.name}!

You're invited to: ${eventDetails.title}

📅 When: ${startTime} - ${endTime}
📍 Where: ${eventDetails.location || "Location TBD"}

${eventDetails.description ? `\n${eventDetails.description}\n` : ""}
We'd love to have you join us for this event! Please let us know if you can make it by responding with your RSVP.

Looking forward to seeing you there!`;
  }

  async generateInvites(eventId, recipients, eventDetails) {
    try {
      const db = getDbConnection();

      for (const recipient of recipients) {
        try {
          // Get recipient details
          const recipientInfo = await new Promise((resolve, reject) => {
            db.get(
              "SELECT name, email FROM users WHERE id = ?",
              [recipient.user_id],
              (err, user) => {
                if (err) reject(err);
                else resolve(user);
              }
            );
          });

          if (!recipientInfo) continue;

          // Generate personalized invite
          const inviteContent = await this.generatePersonalizedInvite(
            eventDetails,
            recipientInfo
          );

          // Store the generated invite
          db.run(
            "INSERT INTO ai_invites (event_id, recipient_id, invite_content) VALUES (?, ?, ?)",
            [eventId, recipient.user_id, inviteContent],
            (err) => {
              if (err) {
                console.error("Error storing AI invite:", err);
              }
            }
          );
        } catch (error) {
          console.error(
            `Error generating invite for recipient ${recipient.user_id}:`,
            error
          );
        }
      }

      // Mark event as having AI invites generated
      db.run(
        "UPDATE events SET ai_invite_generated = TRUE WHERE id = ?",
        [eventId],
        () => db.close()
      );
    } catch (error) {
      console.error("Error in generateInvites:", error);
    }
  }

  async getEventInvite(eventId, userId) {
    return new Promise((resolve, reject) => {
      const db = getDbConnection();
      db.get(
        "SELECT invite_content, generated_at FROM ai_invites WHERE event_id = ? AND recipient_id = ?",
        [eventId, userId],
        (err, invite) => {
          db.close();
          if (err) reject(err);
          else resolve(invite);
        }
      );
    });
  }

  async generateEventSummary(eventDetails, attendees) {
    try {
      if (!this.model) {
        return this.getDefaultSummary(eventDetails, attendees);
      }

      const prompt = `
        Create a brief event summary for the following:
        
        Event: ${eventDetails.title}
        Description: ${eventDetails.description || "No description provided"}
        Date: ${new Date(eventDetails.start_time).toLocaleDateString()}
        Time: ${new Date(
          eventDetails.start_time
        ).toLocaleTimeString()} - ${new Date(
        eventDetails.end_time
      ).toLocaleTimeString()}
        Location: ${eventDetails.location || "Location TBD"}
        Expected Attendees: ${attendees.length}
        
        Create a 2-3 sentence summary that highlights:
        - What the event is about
        - Key details participants should know
        - The value or benefit of attending
        
        Keep it concise and engaging.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text.trim();
    } catch (error) {
      console.error("Error generating event summary:", error);
      return this.getDefaultSummary(eventDetails, attendees);
    }
  }

  getDefaultSummary(eventDetails, attendees) {
    return `${eventDetails.title} is scheduled for ${new Date(
      eventDetails.start_time
    ).toLocaleDateString()} at ${
      eventDetails.location || "the specified location"
    }. ${attendees.length} people are expected to attend. ${
      eventDetails.description || "Join us for this exciting event!"
    }`;
  }

  async generateClubDescription(clubName, clubPurpose) {
    try {
      if (!this.model) {
        return `Welcome to ${clubName}! ${
          clubPurpose ||
          "A community where members connect, learn, and grow together."
        }`;
      }

      const prompt = `
        Generate a welcoming club description for:
        
        Club Name: ${clubName}
        Purpose/Focus: ${clubPurpose || "General community club"}
        
        Create a 2-3 sentence description that:
        - Welcomes new members
        - Explains what the club is about
        - Encourages participation
        
        Keep it friendly and inclusive.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text.trim();
    } catch (error) {
      console.error("Error generating club description:", error);
      return `Welcome to ${clubName}! ${
        clubPurpose ||
        "A community where members connect, learn, and grow together."
      }`;
    }
  }
}

module.exports = new AIService();
