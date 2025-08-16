import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../services/api";

function CreateEvent() {
  const [loading, setLoading] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  React.useEffect(() => {
    fetchUserClubs();
  }, []);

  const fetchUserClubs = async () => {
    try {
      const response = await api.get("/api/clubs/user/memberships");
      setClubs(response.data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
      toast.error("Failed to load your clubs");
    } finally {
      setLoadingClubs(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const eventData = {
        ...data,
        start_time: new Date(data.start_time).toISOString(),
        end_time: new Date(data.end_time).toISOString(),
      };

      const response = await api.post("/api/events", eventData);
      toast.success("Event created successfully!");
      navigate(`/events/${response.data.event.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const startTime = watch("start_time");
  const endTime = watch("end_time");

  // Validate end time is after start time
  const validateEndTime = (value) => {
    if (!startTime || !value) return true;
    return (
      new Date(value) > new Date(startTime) ||
      "End time must be after start time"
    );
  };

  if (loadingClubs) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse card h-96 bg-secondary-100"></div>
      </div>
    );
  }

  if (clubs.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">👥</span>
          <h3 className="text-xl font-semibold text-secondary-900 mb-2">
            No clubs available
          </h3>
          <p className="text-secondary-600 mb-6">
            You need to be a member of at least one club to create events.
          </p>
          <div className="space-x-3">
            <button onClick={() => navigate("/clubs")} className="btn-outline">
              Browse Clubs
            </button>
            <button
              onClick={() => navigate("/clubs/new")}
              className="btn-primary"
            >
              Create Club
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900">Create Event</h1>
        <p className="text-secondary-600 mt-2">
          Schedule a new event for your club members
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
        <div className="form-group">
          <label htmlFor="club_id" className="form-label">
            Club *
          </label>
          <select
            id="club_id"
            className={`input-field ${errors.club_id ? "border-red-500" : ""}`}
            {...register("club_id", { required: "Please select a club" })}
          >
            <option value="">Select a club</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name} ({club.member_role})
              </option>
            ))}
          </select>
          {errors.club_id && (
            <p className="mt-1 text-sm text-red-600">
              {errors.club_id.message}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Event Title *
          </label>
          <input
            id="title"
            type="text"
            className={`input-field ${errors.title ? "border-red-500" : ""}`}
            placeholder="Enter event title"
            {...register("title", {
              required: "Event title is required",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters",
              },
            })}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="input-field"
            placeholder="Describe your event..."
            {...register("description")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="start_time" className="form-label">
              Start Date & Time *
            </label>
            <input
              id="start_time"
              type="datetime-local"
              className={`input-field ${
                errors.start_time ? "border-red-500" : ""
              }`}
              min={new Date().toISOString().slice(0, 16)}
              {...register("start_time", {
                required: "Start time is required",
                validate: (value) => {
                  const selectedDate = new Date(value);
                  const now = new Date();
                  return selectedDate > now || "Event cannot be in the past";
                },
              })}
            />
            {errors.start_time && (
              <p className="mt-1 text-sm text-red-600">
                {errors.start_time.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="end_time" className="form-label">
              End Date & Time *
            </label>
            <input
              id="end_time"
              type="datetime-local"
              className={`input-field ${
                errors.end_time ? "border-red-500" : ""
              }`}
              min={startTime || new Date().toISOString().slice(0, 16)}
              {...register("end_time", {
                required: "End time is required",
                validate: validateEndTime,
              })}
            />
            {errors.end_time && (
              <p className="mt-1 text-sm text-red-600">
                {errors.end_time.message}
              </p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="location" className="form-label">
            Location
          </label>
          <input
            id="location"
            type="text"
            className="input-field"
            placeholder="Event location (optional)"
            {...register("location")}
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">
            🤖 AI-Powered Features
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Personalized invites will be generated for each member</li>
            <li>• Events will sync automatically with Google Calendar</li>
            <li>• Members will receive calendar invitations via email</li>
          </ul>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </div>
            ) : (
              "Create Event"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;
