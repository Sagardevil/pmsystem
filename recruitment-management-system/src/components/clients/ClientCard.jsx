// src/components/clients/ClientCard.jsx
import React from "react";
import { Mail, Phone, MapPin, Building, User } from "lucide-react";

const ClientCard = ({ client }) => {
  const getStatusColor = (status) => {
    return status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const getIndustryColor = (industry) => {
    const colors = {
      IT: "bg-blue-100 text-blue-800",
      Legal: "bg-purple-100 text-purple-800",
      Payroll: "bg-orange-100 text-orange-800",
      Healthcare: "bg-green-100 text-green-800",
      Finance: "bg-yellow-100 text-yellow-800",
    };
    return colors[industry] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {client.name}
            </h3>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <Building className="h-4 w-4 mr-1" />
              <span>{client.companyName}</span>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <span
              className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                client.status
              )}`}
            >
              {client.status}
            </span>
            <span
              className={`px-2 py-1 text-xs rounded-full ${getIndustryColor(
                client.industry
              )}`}
            >
              {client.industry}
            </span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            <span className="truncate">{client.email}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            <span>{client.phone}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{client.location}</span>
          </div>
          {client.assignedRecruiterName && (
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <span>Recruiter: {client.assignedRecruiterName}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-500">
            {new Date(
              client.onboardedDate || client.dateAdded
            ).toLocaleDateString()}
          </span>
          <div className="flex space-x-2">
            {client.totalProjects !== undefined && (
              <span className="text-sm text-gray-600">
                {client.totalProjects} project(s)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;
