// src/components/projects/AddTeamMember.jsx
import React, { useState } from "react";
import { projectsAPI } from "../../services/api";
import { X, UserPlus } from "lucide-react";
import { useApp } from "../../contexts/AppContext";

const AddTeamMember = ({ projectId, onMemberAdded, onClose }) => {
  const { state, actions } = useApp();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    userId: "", // Add userId field
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Adding team member with data:", formData);
      console.log("Available users:", state.users);

      // Prepare the data for the backend
      const requestData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        userId: formData.userId ? parseInt(formData.userId) : 1, // Default to user 1 if not selected
      };

      console.log("Sending data to backend:", requestData);

      const response = await projectsAPI.addTeamMember(projectId, requestData);
      console.log("Team member added successfully:", response.data);

      actions.addNotification({
        type: "success",
        message: "Team member added successfully!",
      });

      onMemberAdded();
      onClose();
    } catch (error) {
      console.error("Failed to add team member:", error);

      if (error.response) {
        console.error("Response data:", error.response.data);
        actions.addNotification({
          type: "error",
          message: `Failed to add team member: ${
            error.response.data?.message || error.response.statusText
          }`,
        });
      } else {
        actions.addNotification({
          type: "error",
          message: `Failed to add team member: ${error.message}`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Add Team Member
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter team member name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter role (e.g., Frontend Developer)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign to User
            </label>
            <select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select User (Optional)</option>
              {state.users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username} ({user.role})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Select an existing user or leave blank to use default
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Add Member</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeamMember;
