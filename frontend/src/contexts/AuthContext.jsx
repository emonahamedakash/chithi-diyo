import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize directly from sessionStorage to avoid null on first render
  const [userId, setUserId] = useState(() => {
    const userAuth = sessionStorage.getItem("user_auth");
    if (userAuth) {
      const parsedData = JSON.parse(userAuth);
      return parsedData.id;
    }
    return null;
  });

  return (
    <AuthContext.Provider value={{ userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};