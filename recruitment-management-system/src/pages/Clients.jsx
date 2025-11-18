// src/pages/Clients.jsx
import React, { useEffect, useState } from "react";
import { useApp } from "../contexts/AppContext";
import { clientsAPI } from "../services/api";
import ClientForm from "../components/clients/ClientForm";
import ClientCard from "../components/clients/ClientCard";
import { Plus, Search, Filter } from "lucide-react";

const Clients = () => {
  const { state, actions } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    industry: "",
    location: "",
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      actions.setLoading(true);
      const response = await clientsAPI.getAll();
      actions.setClients(response.data);
    } catch (error) {
      actions.addNotification({
        type: "error",
        message: "Failed to load clients",
      });
    } finally {
      actions.setLoading(false);
    }
  };

  const handleCreateClient = async (clientData) => {
    try {
      const response = await clientsAPI.create(clientData);
      actions.addClient(response.data);
      setShowForm(false);
      actions.addNotification({
        type: "success",
        message: "Client created successfully!",
      });
    } catch (error) {
      actions.addNotification({
        type: "error",
        message: "Failed to create client",
      });
    }
  };

  const filteredClients = state.clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesIndustry =
      !filters.industry || client.industry === filters.industry;
    const matchesLocation =
      !filters.location || client.location.includes(filters.location);

    return matchesSearch && matchesIndustry && matchesLocation;
  });

  const industries = [
    ...new Set(state.clients.map((client) => client.industry)),
  ];
  const locations = [
    ...new Set(state.clients.map((client) => client.location)),
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Client</span>
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
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Industry Filter */}
          <select
            value={filters.industry}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, industry: e.target.value }))
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Industries</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>

          {/* Location Filter */}
          <select
            value={filters.location}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, location: e.target.value }))
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm("");
              setFilters({ industry: "", location: "" });
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {/* Clients Grid */}
      {state.loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!state.loading && filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No clients</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new client.
          </p>
        </div>
      )}

      {/* Client Form Modal */}
      {showForm && (
        <ClientForm
          onSubmit={handleCreateClient}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Clients;
