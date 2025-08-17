import React, { useState } from "react";
import { Settings, Users, Calendar, MessageCircle, Home } from "lucide-react";
import ClubMate from "./ClubMate";
import ClubManager from "./ClubManager";
import EventManager from "./EventManager";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("chat");

  const tabs = [
    { id: "chat", label: "ClubMate Chat", icon: MessageCircle, color: "blue" },
    { id: "clubs", label: "Manage Clubs", icon: Users, color: "green" },
    { id: "events", label: "Manage Events", icon: Calendar, color: "purple" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "chat":
        return <ClubMate />;
      case "clubs":
        return <ClubManager />;
      case "events":
        return <EventManager />;
      default:
        return <ClubMate />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">ClubSphere</h1>
                <p className="text-xs text-gray-600">
                  Campus Management System
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? `bg-${tab.color}-500 text-white shadow-md`
                      : "text-gray-600 hover:text-gray-800 hover:bg-white"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Settings */}
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Tab Indicator */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Current Page:</span>
            <span className="font-medium text-gray-800">
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </span>
            {activeTab === "chat" && (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs ml-2">
                AI Powered
              </span>
            )}
            {activeTab === "clubs" && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs ml-2">
                CRUD Operations
              </span>
            )}
            {activeTab === "events" && (
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs ml-2">
                Full Management
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <main className="transition-all duration-300">{renderContent()}</main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              © 2025 ClubSphere. Campus management system with AI integration.
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Features:</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                AI Chat
              </span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                Club CRUD
              </span>
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                Event CRUD
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
