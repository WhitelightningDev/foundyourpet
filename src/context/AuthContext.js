import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem("authToken"))
  );

  const isLoggedIn = useMemo(() => Boolean(token), [token]);

  const updateUser = useCallback((nextUser) => {
    if (nextUser) {
      localStorage.setItem("user", JSON.stringify(nextUser));
      setUser(nextUser);
      return;
    }
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setToken(null);
    updateUser(null);
  }, [updateUser]);

  const refreshUser = useCallback(
    async (providedToken) => {
      const tokenToUse = providedToken || token;
      if (!tokenToUse) return null;
      const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${tokenToUse}` },
      });
      const freshUser = response.data?.user || null;
      updateUser(freshUser);
      return freshUser;
    },
    [token, updateUser]
  );

  const login = useCallback(
    (newToken, newUser) => {
      localStorage.setItem("authToken", newToken);
      setToken(newToken);
      updateUser(newUser || null);
    },
    [updateUser]
  );

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        if (!token) return;
        await refreshUser(token);
      } catch (error) {
        if (!isMounted) return;
        if (error?.response?.status === 401) {
          logout();
        }
      }
    };

    if (!token) {
      if (isMounted) setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setLoading(true);
    bootstrap().finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [token, refreshUser, logout]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          const hasToken = Boolean(localStorage.getItem("authToken"));
          if (hasToken) {
            logout();
            if (window.location.pathname !== "/login") {
              window.location.href = "/login";
            }
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, token, user, login, logout, loading, refreshUser, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
