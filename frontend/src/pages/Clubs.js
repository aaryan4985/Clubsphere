import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [myClubs, setMyClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("all"); // 'all' or 'my'

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const [allClubsRes, myClubsRes] = await Promise.all([
        api.get("/api/clubs"),
        api.get("/api/clubs/user/memberships"),
      ]);

      setClubs(allClubsRes.data);
      setMyClubs(myClubsRes.data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = async (clubId) => {
    try {
      await api.post(`/api/members/clubs/${clubId}/join`);
      fetchClubs(); // Refresh data
    } catch (error) {
      console.error("Error joining club:", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="card h-48 bg-secondary-100 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  const displayClubs = view === "my" ? myClubs : clubs;
  const isUserMember = (clubId) => myClubs.some((club) => club.id === clubId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Clubs</h1>
          <p className="text-secondary-600 mt-2">
            Join communities and connect with others
          </p>
        </div>
        <Link to="/clubs/new" className="btn-primary">
          + Create Club
        </Link>
      </div>

      {/* View Toggle */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-secondary-100 p-1 rounded-lg w-fit">
          {[
            { value: "all", label: "All Clubs" },
            { value: "my", label: "My Clubs" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setView(tab.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                view === tab.value
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-secondary-600 hover:text-secondary-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {displayClubs.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">👥</span>
          <h3 className="text-xl font-semibold text-secondary-900 mb-2">
            {view === "my" ? "No clubs joined yet" : "No clubs available"}
          </h3>
          <p className="text-secondary-600 mb-6">
            {view === "my"
              ? "Join some clubs to get started and connect with communities"
              : "Be the first to create a club and build your community"}
          </p>
          <Link to="/clubs/new" className="btn-primary">
            Create Your First Club
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayClubs.map((club) => (
            <div
              key={club.id}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    {club.name}
                  </h3>
                  <p className="text-secondary-600 text-sm mb-3 line-clamp-2">
                    {club.description || "No description available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-secondary-500 mb-4">
                <span>👤 {club.leader_name}</span>
                <span>👥 {club.member_count} members</span>
              </div>

              {view === "my" && club.member_role && (
                <div className="mb-4">
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
              )}

              <div className="flex space-x-2">
                <Link
                  to={`/clubs/${club.id}`}
                  className="flex-1 btn-outline text-center"
                >
                  View Details
                </Link>

                {view === "all" && !isUserMember(club.id) && (
                  <button
                    onClick={() => handleJoinClub(club.id)}
                    className="flex-1 btn-primary"
                  >
                    Join Club
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Clubs;
