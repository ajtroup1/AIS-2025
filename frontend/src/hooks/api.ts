import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export function refreshToken() {
  const nav = useNavigate();
  const refreshToken = Cookies.get("refreshToken");

  if (!refreshToken || refreshToken === "") {
    console.log("No refresh token found. Redirecting to login...");
    nav("/login");
  }

  const response = fetch("http://127.0.0.1:8000/api/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("New access token:", data.access);
      Cookies.set("accessToken", data.access);
    })
    .catch((error) => {
      console.error("Error refreshing token:", error);
      nav("/login");
    });
}
