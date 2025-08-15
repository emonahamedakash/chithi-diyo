import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi"; // Assuming useApi is defined in your hooks
import axios from "axios";
import { baseUrl } from "../../baseUrl";
import { errorMsg } from "../helpers/notificationMessage";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const api = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (!JSON.parse(sessionStorage.getItem("user_auth"))) {
        return console.log("Not logged in");
      }
      const { id, token } = JSON.parse(sessionStorage.getItem("user_auth"));
      try {
        const response = await axios({
          method: "get",
          url: `${baseUrl}/user/check-login-state`,
          params: {
            id: id,
            token: token,
          },
        });
        console.log("Response: ", response);
        if (response.data.flag === "FAIL") {
          return errorMsg(response.data.message);
        }
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
      const response = await api.post("/user/login", { email, password });
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
