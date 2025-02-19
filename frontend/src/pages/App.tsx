import React, { useEffect, useState } from "react";
import { Routes, Route, NavLink, useNavigate, Navigate } from "react-router-dom";
import "../css/App.css";
import ExperienceArchive from "./ExperienceArchive";
import JobFinder from "./JobFinder";
import ApplicationTracker from "./ApplicationTracker";
import LoginPage from "./LoginPage"; 
import ResumeArchive from "./ResumeArchive";
import ResumeBuilder from "./ResumeBuilder";

const App: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [username, setUsername] = useState(""); 


  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate, isLoggedIn]);


  const handleLogin = (username: string) => {
    setIsLoggedIn(true); 
    setUsername(username); 
    navigate("/"); 
  };

  return (
    <div className="container">
      {}
      {isLoggedIn && (
        <header className="navbar">
          <nav className="nav-links">
            <NavLink to="/"><button>Home Page</button></NavLink>
            <NavLink to="/experience"><button>Experience Archive</button></NavLink>
            <NavLink to="/job-finder"><button>Job Finder</button></NavLink>
            <NavLink to="/application-tracker"><button>Application Tracker</button></NavLink>
            <NavLink to="/resume-archive"><button>Resume Archive</button></NavLink>
            <NavLink to="/resume-builder"><button>Resume Builder</button></NavLink>
            
          </nav>
        </header>
      )}

      <main className="content">
        <Routes>
          <Route path="/" element={
            <div>
              <h1>Welcome to My Home Page!</h1>
              <p>This is the home page content.</p>
              {}
              {isLoggedIn && <p>Welcome, User {username}!</p>}
            </div>
          } />
          <Route path="/experience" element={<ExperienceArchive />} />
          <Route path="/job-finder" element={<JobFinder />} />
          <Route path="/application-tracker" element={<ApplicationTracker />} />
          <Route path="/resume-archive" element={<ResumeArchive />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          {}
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