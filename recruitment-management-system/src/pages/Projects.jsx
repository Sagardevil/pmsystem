// src/pages/Projects.jsx
import React, { useEffect, useState } from "react";
import { useApp } from "../contexts/AppContext";
import { projectsAPI, clientsAPI } from "../services/api";
import ProjectForm from "../components/projects/ProjectForm";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectDetails from "../components/projects/ProjectDetails";
import { Plus, Search, Filter, Users } from "lucide-react";

const Projects = () => {
  const { state, actions } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    clientId: "",
    status: "",
  });

  useEffect(() => {
    loadProjects();
    loadClients();
  }, []);

  const loadProjects = async () => {
    try {
      actions.setLoading(true);
      const response = await projectsAPI.getAll();
      actions.setProjects(response.data);
    } catch (error) {
      actions.addNotification({
        type: "error",
        message: "Failed to load projects",
      });
    } finally {
      actions.setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const response = await clientsAPI.getAll();
      actions.setClients(response.data);
    } catch (error) {
      console.error("Failed to load clients:", error);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const response = await projectsAPI.create(projectData);
      actions.addProject(response.data);
      setShowForm(false);
      actions.addNotification({
        type: "success",
        message: "Project created successfully!",
      });
    } catch (error) {
      actions.addNotification({
        type: "error",
        message: "Failed to create project",
      });
    }
  };

  const handleUpdateProgress = async (projectId, progress) => {
    try {
      await projectsAPI.updateProgress(projectId, {
        progressPercentage: progress,
      });
      await loadProjects(); // Reload to get updated data
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

  const filteredProjects = state.projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClient =
      !filters.clientId || project.clientId === parseInt(filters.clientId);
    const matchesStatus = !filters.status || project.status === filters.status;

    return matchesSearch && matchesClient && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Projects</h1>
          <p className="text-gray-600 mt-1">
            View and manage all projects across all clients
          </p>
        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          {/* Client Filter */}
          <select
            value={filters.clientId}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, clientId: e.target.value }))
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Clients</option>
            {state.clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.companyName}
              </option>
            ))}
          </select>

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
              setFilters({ clientId: "", status: "" });
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {state.loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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

      {/* Empty State */}
      {!state.loading && filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No projects
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new project.
          </p>
        </div>
      )}

      {/* Project Form Modal */}
      {showForm && (
        <ProjectForm
          clients={state.clients}
          users={state.users}
          onSubmit={handleCreateProject}
          onCancel={() => setShowForm(false)}
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

export default Projects;
