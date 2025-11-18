// src/components/projects/ProjectDetails.jsx
import React, { useState, useEffect } from "react";
import { projectsAPI } from "../../services/api";
import {
  X,
  Users,
  Folder,
  Plus,
  Calendar,
  Code,
  RefreshCw,
} from "lucide-react";
import AddTeamMember from "./AddTeamMember";
import AddModule from "./AddModule";

const ProjectDetails = ({ project, onClose, onUpdateProgress }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [teamMembers, setTeamMembers] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddModule, setShowAddModule] = useState(false);

  useEffect(() => {
    loadProjectDetails();
  }, [project.id]);

  const loadProjectDetails = async () => {
    try {
      setLoading(true);
      const [teamRes, modulesRes] = await Promise.all([
        projectsAPI.getTeamMembers(project.id),
        projectsAPI.getModules(project.id),
      ]);
      setTeamMembers(teamRes.data || []);
      setModules(modulesRes.data || []);
    } catch (error) {
      console.error("Failed to load project details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberAdded = () => {
    loadProjectDetails(); // Refresh the team members list
  };

  const handleModuleAdded = () => {
    loadProjectDetails(); // Refresh the modules list
  };

  const TabButton = ({ tab, icon: Icon, children }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        activeTab === tab
          ? "bg-blue-100 text-blue-700"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="px-6 flex space-x-2">
            <TabButton tab="overview" icon={Folder}>
              Overview
            </TabButton>
            <TabButton tab="team" icon={Users}>
              Team ({teamMembers.length})
            </TabButton>
            <TabButton tab="modules" icon={Code}>
              Modules ({modules.length})
            </TabButton>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Project Details
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-medium">{project.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Progress:</span>
                          <span className="font-medium">
                            {project.progressPercentage}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Team Lead:</span>
                          <span className="font-medium">
                            {project.teamLeadName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Client ID:</span>
                          <span className="font-medium">
                            {project.clientId}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Timeline
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            Start:{" "}
                            {new Date(project.startDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            Expected End:{" "}
                            {new Date(
                              project.expectedEndDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {project.techStack && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Technology Stack
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.split(", ").map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "team" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Team Members
                    </h3>
                    <button
                      onClick={() => setShowAddMember(true)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Member</span>
                    </button>
                  </div>

                  {teamMembers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2">No team members added yet</p>
                      <button
                        onClick={() => setShowAddMember(true)}
                        className="mt-4 text-blue-600 hover:text-blue-700"
                      >
                        Add your first team member
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {teamMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {member.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {member.role} • {member.email}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              member.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {member.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "modules" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Project Modules
                    </h3>
                    <button
                      onClick={() => setShowAddModule(true)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Module</span>
                    </button>
                  </div>

                  {modules.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Folder className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2">No modules added yet</p>
                      <button
                        onClick={() => setShowAddModule(true)}
                        className="mt-4 text-blue-600 hover:text-blue-700"
                      >
                        Add your first module
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {modules.map((module) => (
                        <div
                          key={module.id}
                          className="p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">
                              {module.moduleName}
                            </h4>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                module.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : module.status === "InProgress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {module.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {module.description}
                          </p>
                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>Assigned to: {module.assignedToName}</span>
                            <span>Progress: {module.progressPercentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Team Member Modal */}
      {showAddMember && (
        <AddTeamMember
          projectId={project.id}
          onMemberAdded={handleMemberAdded}
          onClose={() => setShowAddMember(false)}
        />
      )}

      {/* Add Module Modal */}
      {showAddModule && (
        <AddModule
          projectId={project.id}
          teamMembers={teamMembers}
          onModuleAdded={handleModuleAdded}
          onClose={() => setShowAddModule(false)}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
