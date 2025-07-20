import axios from "axios";
import { useMemo } from "react";

export function useApi() {
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: "http://localhost:5000/api", // 🔁 Replace with your actual API base URL
      withCredentials: true, // ⬅️ Send cookies (if using sessions or refresh tokens)
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Optional: handle global errors or add interceptors here
    // instance.interceptors.response.use(
    //   response => response,
    //   error => {
    //     // Log or handle global errors
    //     return Promise.reject(error);
    //   }
    // );

    return instance;
  }, []);

  return api;
}
