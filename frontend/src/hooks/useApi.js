import axios from "axios";
import { useMemo } from "react";

export function useApi() {
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: "http://localhost:5050/api",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return instance;
  }, []);

  return api;
}
