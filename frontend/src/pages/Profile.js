import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

function Profile() {
  const { user } = useAuth();
  const [calendarStatus, setCalendarStatus] = useState({ connected: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendarStatus();
  }, []);

  const fetchCalendarStatus = async () => {
    try {
      const response = await api.get("/api/calendar/status");
      setCalendarStatus(response.data);
    } catch (error) {
      console.error("Error fetching calendar status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectCalendar = async () => {
    try {
      const response = await api.get("/api/calendar/auth-url");
      window.open(response.data.authUrl, "_blank", "width=500,height=600");
      // You would implement OAuth callback handling here
    } catch (error) {
      toast.error("Failed to get calendar authorization URL");
    }
  };

  const handleDisconnectCalendar = async () => {
    try {
      await api.post("/api/calendar/disconnect");
      setCalendarStatus({ connected: false });
      toast.success("Google Calendar disconnected");
    } catch (error) {
      toast.error("Failed to disconnect calendar");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="card h-32 bg-secondary-100"></div>
          <div className="card h-48 bg-secondary-100"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900">
          Profile Settings
        </h1>
        <p className="text-secondary-600 mt-2">
          Manage your account and integrations
        </p>
      </div>

      {/* User Info */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">
          Account Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="form-label">Name</label>
            <p className="text-secondary-900">{user?.name}</p>
          </div>
          <div>
            <label className="form-label">Email</label>
            <p className="text-secondary-900">{user?.email}</p>
          </div>
          <div>
            <label className="form-label">Role</label>
            <p className="text-secondary-900 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Google Calendar Integration */}
      <div className="card">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">
          Google Calendar Integration
        </h2>

        <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${
                calendarStatus.connected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <div>
              <p className="font-medium text-secondary-900">
                Google Calendar{" "}
                {calendarStatus.connected ? "Connected" : "Not Connected"}
              </p>
              <p className="text-sm text-secondary-600">
                {calendarStatus.connected
                  ? "Events will sync automatically with your Google Calendar"
                  : "Connect to sync events and send calendar invites"}
              </p>
            </div>
          </div>

          {calendarStatus.connected ? (
            <button
              onClick={handleDisconnectCalendar}
              className="btn-secondary"
            >
              Disconnect
            </button>
          ) : (
            <button onClick={handleConnectCalendar} className="btn-primary">
              Connect Calendar
            </button>
          )}
        </div>

        {calendarStatus.connected && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">
              ✅ Calendar Features Enabled:
            </h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Events automatically sync to your Google Calendar</li>
              <li>• Calendar invites sent to event attendees</li>
              <li>• Two-way sync for event updates</li>
              <li>• Automatic reminders and notifications</li>
            </ul>
          </div>
        )}

        {!calendarStatus.connected && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-medium text-yellow-900 mb-2">
              ⚠️ Missing Calendar Integration:
            </h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Events won't sync to your calendar</li>
              <li>• No automatic calendar invites for attendees</li>
              <li>• Manual scheduling required</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
