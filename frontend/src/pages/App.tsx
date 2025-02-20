import React, { useEffect, useState } from "react";
import { Routes, Route, NavLink, useNavigate, Navigate } from "react-router-dom";
import "../css/App.css";
import ExperienceArchive from "./ExperienceArchive";
import JobFinder from "./JobFinder";
import ApplicationTracker from "./ApplicationTracker";
import LoginPage from "./LoginPage";
import Cookies from "js-cookie";

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
    const ping = async () => {
      const response = await fetch("http://127.0.0.1:8000/api/ping/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });
      if (response.status === 401) {
        alert("Session expired. Please log in again.");
        handleLogout();
      }
    }
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login"); // Redirect to login if no token
    }

  }, []);

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

  return (
    <div className="container">
      { }
      {isLoggedIn && (
        <header className="navbar">
          <nav className="nav-links">
            <NavLink to="/"><button>My Home Page</button></NavLink>
            <NavLink to="/experience"><button>My Experience Archive</button></NavLink>
            <NavLink to="/job-finder"><button>My Job Finder</button></NavLink>
            <NavLink to="/application-tracker"><button>My Application Tracker</button></NavLink>
            <NavLink to="/login" onClick={handleLogout}><button>Logout</button></NavLink>
          </nav>
        </header>
      )}

      <main className="content">
        <Routes>
          <Route path="/" element={
            <div>
              <h1>Welcome to My Home Page!</h1>
              <p>This is the home page content.</p>
              { }
              {isLoggedIn && <p>Welcome, User {username}!</p>}
            </div>
          } />
          <Route path="/experience" element={<ExperienceArchive experiences={experiences} setExperiences={setExperiences} />} />
          <Route path="/job-finder" element={<JobFinder />} />
          <Route path="/application-tracker" element={<ApplicationTracker applications={applications} setApplications={setApplications}/>} />
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
        </Routes>
      </main>
    </div>
  );
};

export default App;