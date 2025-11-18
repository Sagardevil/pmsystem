// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useApp } from "../contexts/AppContext";
import { authAPI, clientsAPI, projectsAPI } from "../services/api";
import {
  Users,
  Briefcase,
  TrendingUp,
  Activity,
  UserCheck,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const Dashboard = () => {
  const { state, actions } = useApp();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalProjects: 0,
    activeUsers: 0,
    ongoingProjects: 0,
  });
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setConnectionError(false);
      actions.setLoading(true);

      console.log("Attempting to connect to backend API...");

      // Create test users first
      await authAPI.createTestUsers();

      // Load all data
      const [usersRes, clientsRes, projectsRes] = await Promise.all([
        authAPI.getActiveUsers(),
        clientsAPI.getAll(),
        projectsAPI.getAll(),
      ]);

      actions.setUsers(usersRes.data);
      actions.setClients(clientsRes.data);
      actions.setProjects(projectsRes.data);

      setStats({
        totalClients: clientsRes.data.length,
        totalProjects: projectsRes.data.length,
        activeUsers: usersRes.data.length,
        ongoingProjects: projectsRes.data.filter((p) => p.status === "Ongoing")
          .length,
      });

      actions.addNotification({
        type: "success",
        message: "Dashboard data loaded successfully!",
      });
    } catch (error) {
      console.error("Dashboard loading error:", error);
      setConnectionError(true);

      let errorMessage = "Failed to load dashboard data";

      if (error.code === "NETWORK_ERROR" || error.message === "Network Error") {
        errorMessage =
          "Cannot connect to backend server. Please make sure the API is running on http://localhost:5051";
      } else if (error.response) {
        errorMessage = `Server error: ${error.response.status} - ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = "No response from server. Check if backend is running.";
      }

      actions.addNotification({
        type: "error",
        message: errorMessage,
      });
    } finally {
      actions.setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={loadDashboardData}
          disabled={state.loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          {state.loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Connection Error Banner */}
      {connectionError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Backend Connection Issue
              </h3>
              <p className="text-sm text-red-700 mt-1">
                Cannot connect to the backend API. Please ensure:
              </p>
              <ul className="text-sm text-red-700 list-disc list-inside mt-1">
                <li>Your backend server is running on http://localhost:5051</li>
                <li>There are no firewall blocks</li>
                <li>The API endpoints are accessible</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Total Clients"
          value={stats.totalClients}
          color="text-blue-600"
        />
        <StatCard
          icon={Briefcase}
          label="Total Projects"
          value={stats.totalProjects}
          color="text-green-600"
        />
        <StatCard
          icon={UserCheck}
          label="Active Users"
          value={stats.activeUsers}
          color="text-purple-600"
        />
        <StatCard
          icon={Activity}
          label="Ongoing Projects"
          value={stats.ongoingProjects}
          color="text-orange-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Clients */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Clients
          </h3>
          <div className="space-y-3">
            {state.clients.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No clients found</p>
            ) : (
              state.clients.slice(0, 5).map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-500">
                      {client.companyName}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      client.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {client.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Projects
          </h3>
          <div className="space-y-3">
            {state.projects.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No projects found
              </p>
            ) : (
              state.projects.slice(0, 5).map((project) => (
                <div key={project.id} className="p-3 hover:bg-gray-50 rounded">
                  <p className="font-medium text-gray-900">{project.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-500">
                      Progress: {project.progressPercentage}%
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        project.status === "Ongoing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
