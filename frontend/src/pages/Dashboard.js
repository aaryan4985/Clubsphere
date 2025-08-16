import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({
    upcomingEvents: [],
    myClubs: [],
    calendarStatus: { connected: false },
    stats: {
      totalClubs: 0,
      totalEvents: 0,
      upcomingEvents: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [eventsRes, clubsRes, calendarRes] = await Promise.all([
        api.get("/api/events?upcoming=true"),
        api.get("/api/clubs/user/memberships"),
        api.get("/api/calendar/status"),
      ]);

      setData({
        upcomingEvents: eventsRes.data.slice(0, 5),
        myClubs: clubsRes.data.slice(0, 4),
        calendarStatus: calendarRes.data,
        stats: {
          totalClubs: clubsRes.data.length,
          totalEvents: eventsRes.data.length,
          upcomingEvents: eventsRes.data.length,
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-secondary-600 mt-2">
          Here's what's happening with your clubs and events
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">My Clubs</p>
              <p className="text-2xl font-bold text-secondary-900">
                {data.stats.totalClubs}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">
                Upcoming Events
              </p>
              <p className="text-2xl font-bold text-secondary-900">
                {data.stats.upcomingEvents}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">🔗</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">
                Calendar Status
              </p>
              <p
                className={`text-lg font-semibold ${
                  data.calendarStatus.connected
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {data.calendarStatus.connected ? "Connected" : "Not Connected"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Connection Alert */}
      {!data.calendarStatus.connected && (
        <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-yellow-600 text-xl mr-3">⚠️</span>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                Connect Google Calendar
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Connect your Google Calendar to automatically sync events and
                send invites to members.
              </p>
            </div>
            <Link to="/profile" className="btn-primary text-sm">
              Connect Now
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-900">
              Upcoming Events
            </h2>
            <Link
              to="/events"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all →
            </Link>
          </div>

          {data.upcomingEvents.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl mb-4 block">📅</span>
              <p className="text-secondary-600 mb-4">No upcoming events</p>
              <Link to="/events/new" className="btn-primary">
                Create Your First Event
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {data.upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="block p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-secondary-900">
                        {event.title}
                      </h3>
                      <p className="text-sm text-secondary-600 mt-1">
                        {event.club_name}
                      </p>
                      <div className="flex items-center mt-2 text-sm text-secondary-500">
                        <span>
                          📅{" "}
                          {format(new Date(event.start_time), "MMM dd, yyyy")}
                        </span>
                        <span className="mx-2">•</span>
                        <span>
                          🕒 {format(new Date(event.start_time), "h:mm a")}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span
                        className={`status-badge ${
                          event.calendar_sync_status === "synced"
                            ? "status-synced"
                            : event.calendar_sync_status === "failed"
                            ? "status-failed"
                            : "status-pending"
                        }`}
                      >
                        {event.calendar_sync_status === "synced"
                          ? "✓ Synced"
                          : event.calendar_sync_status === "failed"
                          ? "✗ Failed"
                          : "⏳ Pending"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* My Clubs */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-900">
              My Clubs
            </h2>
            <Link
              to="/clubs"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all →
            </Link>
          </div>

          {data.myClubs.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl mb-4 block">👥</span>
              <p className="text-secondary-600 mb-4">
                You're not a member of any clubs yet
              </p>
              <div className="space-x-3">
                <Link to="/clubs" className="btn-outline">
                  Browse Clubs
                </Link>
                <Link to="/clubs/new" className="btn-primary">
                  Create Club
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.myClubs.map((club) => (
                <Link
                  key={club.id}
                  to={`/clubs/${club.id}`}
                  className="block p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all"
                >
                  <h3 className="font-medium text-secondary-900 mb-2">
                    {club.name}
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-600">
                      {club.member_count} members
                    </span>
                    <span
                      className={`status-badge ${
                        club.member_role === "leader"
                          ? "bg-purple-100 text-purple-800"
                          : club.member_role === "admin"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {club.member_role}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/events/new"
          className="card hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-200 transition-colors">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="font-medium text-secondary-900">Create Event</h3>
            <p className="text-sm text-secondary-600 mt-1">
              Schedule a new event for your club
            </p>
          </div>
        </Link>

        <Link
          to="/clubs/new"
          className="card hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="font-medium text-secondary-900">Create Club</h3>
            <p className="text-sm text-secondary-600 mt-1">
              Start a new club and invite members
            </p>
          </div>
        </Link>

        <Link
          to="/clubs"
          className="card hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="font-medium text-secondary-900">Browse Clubs</h3>
            <p className="text-sm text-secondary-600 mt-1">
              Discover and join existing clubs
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
