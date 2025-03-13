import React, { useEffect, useState } from "react";
import { Routes, Route, NavLink, useNavigate, Navigate } from "react-router-dom";
import "../css/App.css";
import ExperienceArchive from "./ExperienceArchive";
import JobFinder from "./JobFinder";
import ApplicationTracker from "./ApplicationTracker";
import LoginPage from "./LoginPage";
import Cookies from "js-cookie";
import Profile from "./Profile";
import ResumeArchive from "./ResumeArchive";
import ResumeBuilder from "./ResumeBuilder";
import HomePage from "./HomePage";
import Navbar from "../components/Navbar";

const App: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [profile, setProfile] = useState<User>({} as User);
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);


  useEffect(() => {
    if (!isLoggedIn && Cookies.get("loggedIn") !== "true") {
      navigate("/login");
    }
    if (Cookies.get("loggedIn") === "true") {
      setIsLoggedIn(true);
    }
  }, [navigate, isLoggedIn]);


  const handleLogin = async (username: string, password: string) => {
    // Call the API to log in the user
    const data = {
      email: username,
      password: password
    }
    console.log("logging in with data: ", data);
    const response = await fetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status !== 200) {
      alert("Invalid login attempt. Please try again.");
      return;
    }

    const responsePayload = await response.json();
    setAccessToken(responsePayload.access);
    setRefreshToken(responsePayload.refresh);

    setIsLoggedIn(true);
    // Update the session state
    Cookies.set("accessToken", responsePayload.access, { expires: 7 });
    Cookies.set("refreshToken", responsePayload.refresh, { expires: 7 });
    Cookies.set("loggedIn", "true", { expires: 7 });
    Cookies.set("username", username, { expires: 7 });
    Cookies.set("userId", responsePayload.userId, { expires: 7 });
    setUsername(username);
    navigate("/");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAccessToken("");
    setRefreshToken("");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("loggedIn");
    Cookies.remove("username");
    Cookies.remove("userId");
    navigate("/login");
  }

  const handleRegister = (username: string, password: string) => {
    alert(`User ${username} registered successfully!`);
    handleLogin(username, password);
  };

  return (
    <div className="container">
      { }
      {isLoggedIn && (
        <Navbar onLogout={handleLogout} />
      )}

      <main className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/experience" element={<ExperienceArchive experiences={experiences} setExperiences={setExperiences} />} />
          <Route path="/job-finder" element={<JobFinder />} />
          <Route path="/application-tracker" element={<ApplicationTracker applications={applications} setApplications={setApplications} />} />
          { }
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/" />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/resume-archive" element={<ResumeArchive />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;