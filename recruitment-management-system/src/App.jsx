// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Projects from "./pages/Projects";
import ClientProjects from "./pages/ClientProjects"; // Make sure this import exists
import Users from "./pages/Users";
import Notification from "./components/ui/Notification";
import { AppProvider } from "./contexts/AppContext";
import "./index.css";

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col h-screen bg-gray-50">
          <Navbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/projects" element={<Projects />} />
              {/* Add this route for client-specific projects */}
              <Route
                path="/client/:clientId/projects"
                element={<ClientProjects />}
              />
              <Route path="/users" element={<Users />} />
            </Routes>
          </main>
        </div>
        <Notification />
      </Router>
    </AppProvider>
  );
}

export default App;
