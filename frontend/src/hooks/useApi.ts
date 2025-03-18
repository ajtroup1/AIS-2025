import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export const useApi = () => {
  const nav = useNavigate();

  const refreshToken = async () => {
    const refreshToken = Cookies.get("refreshToken");

    if (!refreshToken || refreshToken === "") {
      console.log("No refresh token found. Redirecting to login...");
      nav("/login");
      return null;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      Cookies.set("accessToken", data.access);
      return data.access;
    } catch (error) {
      console.error("Error refreshing token:", error);
      nav("/login");
      return null;
    }
  };

  const apiRequest = async (url: string, options: RequestInit) => {
    try {
      const response = await fetch(url, options);

      if (response.status === 401) {
        const newAccessToken = await refreshToken();

        if (newAccessToken) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${newAccessToken}`,
          };

          const retryResponse = await fetch(url, options);
          return retryResponse;
        }
      }

      return response;
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  };

  return { apiRequest };
};