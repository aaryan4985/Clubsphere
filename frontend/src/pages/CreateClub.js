import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../services/api";

function CreateClub() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post("/api/clubs", data);
      toast.success("Club created successfully!");
      navigate(`/clubs/${response.data.club.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create club");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900">Create Club</h1>
        <p className="text-secondary-600 mt-2">
          Start a new community and invite members to join
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Club Name *
          </label>
          <input
            id="name"
            type="text"
            className={`input-field ${errors.name ? "border-red-500" : ""}`}
            placeholder="Enter club name"
            {...register("name", {
              required: "Club name is required",
              minLength: {
                value: 3,
                message: "Club name must be at least 3 characters",
              },
              maxLength: {
                value: 50,
                message: "Club name must be less than 50 characters",
              },
            })}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
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
            placeholder="Describe your club's purpose, activities, and what members can expect..."
            {...register("description", {
              maxLength: {
                value: 500,
                message: "Description must be less than 500 characters",
              },
            })}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
          <p className="mt-1 text-sm text-secondary-500">
            A good description helps people understand what your club is about
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-900 mb-2">
            🎉 What you get as a club leader:
          </h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Ability to create and manage events</li>
            <li>• Add and manage club members</li>
            <li>• Google Calendar integration for events</li>
            <li>• AI-generated personalized event invitations</li>
            <li>• Member management and communication tools</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">
            💡 Tips for a successful club:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Choose a clear, descriptive name</li>
            <li>• Write a compelling description of your club's purpose</li>
            <li>• Plan regular events to keep members engaged</li>
            <li>• Be welcoming to new members</li>
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
              "Create Club"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateClub;
