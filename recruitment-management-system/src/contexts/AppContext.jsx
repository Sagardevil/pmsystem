// src/contexts/AppContext.jsx
import React, { createContext, useContext, useReducer } from "react";

const AppContext = createContext();

const initialState = {
  clients: [],
  projects: [],
  users: [],
  loading: false,
  notifications: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_CLIENTS":
      return { ...state, clients: action.payload };
    case "SET_PROJECTS":
      return { ...state, projects: action.payload };
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "ADD_CLIENT":
      return { ...state, clients: [...state.clients, action.payload] };
    case "ADD_PROJECT":
      return { ...state, projects: [...state.projects, action.payload] };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    setLoading: (loading) =>
      dispatch({ type: "SET_LOADING", payload: loading }),
    setClients: (clients) =>
      dispatch({ type: "SET_CLIENTS", payload: clients }),
    setProjects: (projects) =>
      dispatch({ type: "SET_PROJECTS", payload: projects }),
    setUsers: (users) => dispatch({ type: "SET_USERS", payload: users }),
    addClient: (client) => dispatch({ type: "ADD_CLIENT", payload: client }),
    addProject: (project) =>
      dispatch({ type: "ADD_PROJECT", payload: project }),
    addNotification: (notification) =>
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: { ...notification, id: Date.now() },
      }),
    removeNotification: (id) =>
      dispatch({ type: "REMOVE_NOTIFICATION", payload: id }),
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
