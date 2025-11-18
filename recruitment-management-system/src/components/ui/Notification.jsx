// src/components/ui/Notification.jsx
import React, { useEffect } from "react";
import { useApp } from "../../contexts/AppContext";
import { CheckCircle, XCircle, X } from "lucide-react";

const Notification = () => {
  const { state, actions } = useApp();

  useEffect(() => {
    if (state.notifications.length > 0) {
      const timer = setTimeout(() => {
        actions.removeNotification(state.notifications[0].id);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [state.notifications]);

  if (state.notifications.length === 0) return null;

  const notification = state.notifications[0];

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return null;
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg border shadow-lg ${getBackgroundColor(
          notification.type
        )}`}
      >
        {getIcon(notification.type)}
        <span className="text-sm font-medium text-gray-900">
          {notification.message}
        </span>
        <button
          onClick={() => actions.removeNotification(notification.id)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Notification;
