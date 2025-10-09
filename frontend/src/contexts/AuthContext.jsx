import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  // Initialize from session storage on component mount
  useEffect(() => {
    const userAuth = sessionStorage.getItem("user_auth");
    if (userAuth) {
      const parsedData = JSON.parse(userAuth);
      setUserId(parsedData.id);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};