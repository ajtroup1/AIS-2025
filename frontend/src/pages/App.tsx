import React, { useEffect, useState } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import "../css/App.css";
import ExperienceArchive from "./ExperienceArchive";
import JobFinder from "./JobFinder";
import ApplicationTracker from "./ApplicationTracker";
import LoginPage from "./LoginPage";
import Cookies from "js-cookie";
import Profile from "./Profile";
import ResumeArchive from "./ResumeArchive";
import ResumeBuilder from "./ResumeBuilder";
import Navbar from "../components/Navbar";
import HomePage from "./HomePage";

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
    const checkLoginStatus = () => {
      const loggedIn = Cookies.get("loggedIn") === "true";
      const storedUsername = Cookies.get("username");
      const storedAccessToken = Cookies.get("accessToken");
      const storedRefreshToken = Cookies.get("refreshToken");

      if (loggedIn && storedUsername && storedAccessToken && storedRefreshToken) {
        setIsLoggedIn(true);
        setUsername(storedUsername);
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
      } else {
        setIsLoggedIn(false);
        setUsername("");
        setAccessToken("");
        setRefreshToken("");
        navigate("/login");
      }
    };

    checkLoginStatus();
  }, [navigate]);

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
      {isLoggedIn && (
        <Navbar onLogout={handleLogout} />
      )}

      <main className="content">
        <Routes>
          <Route path="/" element={
            isLoggedIn ? (
              <HomePage />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          } />
          <Route path="/experience" element={isLoggedIn ? <ExperienceArchive experiences={experiences} setExperiences={setExperiences} /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/job-finder" element={isLoggedIn ? <JobFinder /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/application-tracker" element={isLoggedIn ? <ApplicationTracker applications={applications} setApplications={setApplications} /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/resume-archive" element={isLoggedIn ? <ResumeArchive /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/resume-builder" element={isLoggedIn ? <ResumeBuilder /> : <LoginPage onLogin={handleLogin} />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;