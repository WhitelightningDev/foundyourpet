import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token); // Set on first render
  }, []);

  const login = (token) => {
    localStorage.setItem("authToken", token);
    setIsLoggedIn(true); // triggers re-render
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false); // triggers re-render
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
