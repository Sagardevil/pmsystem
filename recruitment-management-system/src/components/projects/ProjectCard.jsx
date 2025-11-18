// src/components/projects/ProjectCard.jsx
import React, { useState } from "react";
import {
  Calendar,
  User,
  Building,
  TrendingUp,
  MoreVertical,
} from "lucide-react";

const ProjectCard = ({ project, onViewDetails, onUpdateProgress }) => {
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [newProgress, setNewProgress] = useState(project.progressPercentage);

  const handleProgressUpdate = () => {
    onUpdateProgress(project.id, newProgress);
    setShowProgressModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Ongoing":
        return "bg-blue-100 text-blue-800";
      case "OnHold":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {project.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {project.description}
              </p>
            </div>
          </div>

          {/* Project Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Building className="h-4 w-4 mr-2" />
              <span>Client ID: {project.clientId}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <span>Team Lead: {project.teamLeadName}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Ends: {formatDate(project.expectedEndDate)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">
                Progress
              </span>
              <span className="text-sm text-gray-600">
                {project.progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${project.progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center">
            <span
              className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                project.status
              )}`}
            >
              {project.status}
            </span>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowProgressModal(true)}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="Update Progress"
              >
                <TrendingUp className="h-4 w-4" />
              </button>
              <button
                onClick={onViewDetails}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Update Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Update Progress
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progress: {newProgress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newProgress}
                  onChange={(e) => setNewProgress(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowProgressModal(false)}
                  className="px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProgressUpdate}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectCard;
