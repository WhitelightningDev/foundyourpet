import { createContext, useState, useEffect } from "react";
import axios from "axios";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
    setLoading(false);

    // Set up Axios interceptor once on mount
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          // Token expired or unauthorized
          logout();
          window.location.href = "/login"; // Force redirect
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor); // Cleanup
    };
  }, []);

  const login = (token) => {
    localStorage.setItem("authToken", token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
