// src/components/clients/ClientCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Building, User, ArrowRight } from "lucide-react";

const ClientCard = ({ client }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/client/${client.id}/projects`);
  };

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
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300 group"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  {client.name}
                </h3>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <Building className="h-4 w-4 mr-1" />
                  <span>{client.companyName}</span>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-transform" />
            </div>
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
          <div className="flex space-x-2">
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

          <div className="text-right">
            <div className="text-sm text-gray-500">
              {new Date(
                client.onboardedDate || client.dateAdded
              ).toLocaleDateString()}
            </div>
            {client.totalProjects !== undefined && (
              <div className="text-xs text-gray-400 mt-1">
                {client.totalProjects} project(s)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;
