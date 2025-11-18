// src/components/projects/AddModule.jsx
import React, { useState } from "react";
import { projectsAPI } from "../../services/api";
import { X, FolderPlus } from "lucide-react";
import { useApp } from "../../contexts/AppContext";

const AddModule = ({ projectId, teamMembers, onModuleAdded, onClose }) => {
  const { actions } = useApp();
  const [formData, setFormData] = useState({
    moduleName: "",
    description: "",
    assignedToId: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const assignedMember = teamMembers.find(
        (member) => member.id === parseInt(formData.assignedToId)
      );

      const moduleData = {
        moduleName: formData.moduleName,
        description: formData.description,
        assignedToId: formData.assignedToId
          ? parseInt(formData.assignedToId)
          : 1, // Default to user 1
        assignedToName: assignedMember ? assignedMember.name : "manager1",
      };

      console.log("Adding module with data:", moduleData);

      const response = await projectsAPI.addModule(projectId, moduleData);
      console.log("Module added successfully:", response.data);

      actions.addNotification({
        type: "success",
        message: "Module added successfully!",
      });

      onModuleAdded();
      onClose();
    } catch (error) {
      console.error("Failed to add module:", error);

      if (error.response) {
        console.error("Response data:", error.response.data);
        actions.addNotification({
          type: "error",
          message: `Failed to add module: ${
            error.response.data?.message || error.response.statusText
          }`,
        });
      } else {
        actions.addNotification({
          type: "error",
          message: `Failed to add module: ${error.message}`,
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
            <FolderPlus className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Add Module</h2>
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
              Module Name *
            </label>
            <input
              type="text"
              name="moduleName"
              value={formData.moduleName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter module name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the module..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign To
            </label>
            <select
              name="assignedToId"
              value={formData.assignedToId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Team Member (Optional)</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.role})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Will default to manager1 if not selected
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
                  <FolderPlus className="h-4 w-4" />
                  <span>Add Module</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModule;
