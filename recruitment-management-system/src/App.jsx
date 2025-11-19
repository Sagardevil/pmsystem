// Update src/App.jsx to remove Sidebar
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Projects from "./pages/Projects";
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
