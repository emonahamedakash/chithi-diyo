import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi"; // Assuming useApi is defined in your hooks

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const api = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        // User not logged in
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password, rememberMe) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      setUser(response.data.user);
      setIsAuthenticated(true);

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post("/auth/register", {
        username,
        email,
        password,
      });
      setUser(response.data.user);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("rememberMe");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Logout failed");
    }
  };

  const refreshToken = async () => {
    try {
      const response = await api.get("/auth/refresh");
      return response.data;
    } catch (error) {
      await logout();
      navigate("/login");
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
