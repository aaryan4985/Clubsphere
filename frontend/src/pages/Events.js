import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import api from "../services/api";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      const params = {};
      if (filter === "upcoming") params.upcoming = "true";

      const response = await api.get("/api/events", { params });
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card h-24 bg-secondary-100"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Events</h1>
          <p className="text-secondary-600 mt-2">
            Discover and manage your events
          </p>
        </div>
        <Link to="/events/new" className="btn-primary">
          + Create Event
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-secondary-100 p-1 rounded-lg w-fit">
          {[
            { value: "all", label: "All Events" },
            { value: "upcoming", label: "Upcoming" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === tab.value
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-secondary-600 hover:text-secondary-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">📅</span>
          <h3 className="text-xl font-semibold text-secondary-900 mb-2">
            No events found
          </h3>
          <p className="text-secondary-600 mb-6">
            {filter === "upcoming"
              ? "No upcoming events scheduled"
              : "Get started by creating your first event"}
          </p>
          <Link to="/events/new" className="btn-primary">
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="card hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl">📅</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                        {event.title}
                      </h3>
                      <p className="text-secondary-600 mb-2">
                        {event.club_name}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-secondary-500">
                        <span>
                          📅{" "}
                          {format(new Date(event.start_time), "MMM dd, yyyy")}
                        </span>
                        <span>
                          🕒 {format(new Date(event.start_time), "h:mm a")} -{" "}
                          {format(new Date(event.end_time), "h:mm a")}
                        </span>
                        {event.location && <span>📍 {event.location}</span>}
                      </div>

                      <div className="flex items-center space-x-3 mt-3">
                        <span className="text-sm text-secondary-600">
                          👥 {event.attendee_count} attendees
                        </span>
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
                  </div>
                </div>

                <div className="flex-shrink-0 ml-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-secondary-900">
                      {format(new Date(event.start_time), "MMM")}
                    </p>
                    <p className="text-2xl font-bold text-primary-600">
                      {format(new Date(event.start_time), "dd")}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;
