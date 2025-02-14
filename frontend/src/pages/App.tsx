import React from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom"; 
import "../css/App.css"; 
import ExperienceArchive from "./ExperienceArchive";
import JobFinder from "./JobFinder";
import ApplicationTracker from "./ApplicationTracker";

const App: React.FC = () => {
  const navigate = useNavigate(); // ✅ Hook for programmatic navigation

  return (
    <div className="container">
      <header className="navbar">
        <div className="logo">Logo</div>
        <nav className="nav-links">
          <NavLink to="/"><button>My Home Page</button></NavLink>
          <NavLink to="/experience"><button>My Experience Archive</button></NavLink>
          <NavLink to="/job-finder"><button>My Job Finder</button></NavLink>
          <NavLink to="/application-tracker"><button>My Application Tracker</button></NavLink>
        </nav>
      </header>
      <main className="content">
        <Routes>
          <Route path="/" element={
            <div>
              <h1>Welcome to My Home Page!</h1>
              <p>This is the home page content.</p>
            </div>
          }/>
          <Route path="/experience" element={<ExperienceArchive />} />
          <Route path="/job-finder" element={<JobFinder />} />
          <Route path="/application-tracker" element={<ApplicationTracker />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
