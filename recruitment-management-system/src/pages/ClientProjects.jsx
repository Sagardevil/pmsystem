// src/pages/ClientProjects.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { clientsAPI, projectsAPI } from "../services/api";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectDetails from "../components/projects/ProjectDetails";
import ProjectForm from "../components/projects/ProjectForm";
import {
  ArrowLeft,
  Building,
  Users,
  Briefcase,
  Plus,
  Search,
  Filter,
} from "lucide-react";

const ClientProjects = () => {
  const [showForm, setShowForm] = useState(false);
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useApp();

  const [client, setClient] = useState(null);
  const [clientProjects, setClientProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClientAndProjects();
  }, [clientId]);

  const loadClientAndProjects = async () => {
    try {
      setLoading(true);

      // Load client details
      const clientResponse = await clientsAPI.getById(clientId);
      setClient(clientResponse.data);

      // Load all projects and filter by clientId
      const projectsResponse = await projectsAPI.getAll();
      const filteredProjects = projectsResponse.data.filter(
        (project) => project.clientId === parseInt(clientId)
      );
      setClientProjects(filteredProjects);
    } catch (error) {
      console.error("Failed to load client projects:", error);
      actions.addNotification({
        type: "error",
        message: "Failed to load client projects",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async (projectId, progress) => {
    try {
      await projectsAPI.updateProgress(projectId, {
        progressPercentage: progress,
      });
      await loadClientAndProjects(); // Reload to get updated data
      actions.addNotification({
        type: "success",
        message: "Project progress updated!",
      });
    } catch (error) {
      actions.addNotification({
        type: "error",
        message: "Failed to update progress",
      });
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      // Ensure the project is created for this specific client
      const projectWithClient = {
        ...projectData,
        clientId: parseInt(clientId), // Force the current client ID
      };

      const response = await projectsAPI.create(projectWithClient);
      await loadClientAndProjects(); // Reload the projects list
      setShowForm(false);
      actions.addNotification({
        type: "success",
        message: "Project created successfully!",
      });
    } catch (error) {
      console.error("Failed to create project:", error);
      actions.addNotification({
        type: "error",
        message: `Failed to create project: ${
          error.response?.data?.message || error.message
        }`,
      });
    }
  };

  const filteredProjects = clientProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filters.status || project.status === filters.status;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Client not found
        </h3>
        <button
          onClick={() => navigate("/clients")}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Back to Clients
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/clients")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Clients</span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {client.companyName}
              </h1>
              <p className="text-gray-600">Projects for {client.name}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Projects</p>
            <p className="text-2xl font-bold text-gray-900">
              {clientProjects.length}
            </p>
          </div>
        </div>
      </div>

      {/* Client Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Contact Info
            </h3>
            <p className="text-gray-900">{client.email}</p>
            <p className="text-gray-600">{client.phone}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Location</h3>
            <p className="text-gray-900">{client.location}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Industry</h3>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                client.industry === "IT"
                  ? "bg-blue-100 text-blue-800"
                  : client.industry === "Legal"
                  ? "bg-purple-100 text-purple-800"
                  : client.industry === "Payroll"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {client.industry}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Recruiter
            </h3>
            <p className="text-gray-900">{client.assignedRecruiterName}</p>
          </div>
        </div>
      </div>

      {/* Projects Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <Briefcase className="h-5 w-5" />
          <span>Projects ({clientProjects.length})</span>
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="NotStarted">Not Started</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="OnHold">On Hold</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm("");
              setFilters({ status: "" });
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No projects found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {clientProjects.length === 0
              ? "This client has no projects yet."
              : "No projects match your search criteria."}
          </p>
          {clientProjects.length === 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onViewDetails={() => setSelectedProject(project)}
              onUpdateProgress={handleUpdateProgress}
            />
          ))}
        </div>
      )}

      {/* Project Form Modal */}
      {showForm && (
        <ProjectForm
          clients={[client]} // Only show the current client
          users={state.users}
          onSubmit={handleCreateProject}
          onCancel={() => setShowForm(false)}
          preselectedClientId={clientId}
        />
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetails
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdateProgress={handleUpdateProgress}
        />
      )}
    </div>
  );
};

export default ClientProjects;
