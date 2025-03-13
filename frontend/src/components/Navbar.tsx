import React from "react";
import "../css/Navbar.css";

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  return (
    <header className="navbar">
      <nav className="nav-links">
        <div className="nav-icon-container">
          <img src="https://cdn-icons-png.freepik.com/512/4474/4474378.png" className="nav-icon" alt="Logo" />
        </div>
        <div className="nav-left">
          <div className="nav-link">
            <a href="/" className="nav-link-a">Home Page</a>
          </div>
          <div className="nav-link">
            <a href="/experience" className="nav-link-a">Experience Archive</a>
          </div>
          <div className="nav-link">
            <a href="/application-tracker" className="nav-link-a">Application Tracker</a>
          </div>
          <div className="nav-link">
            <a href="/resume-archive" className="nav-link-a">Resume Archive</a>
          </div>
          <div className="nav-link">
            <a href="/resume-builder" className="nav-link-a">Resume Builder</a>
          </div>
        </div>

        <div className="nav-right">
          <div className="nav-link">
            <a href="/profile" className="nav-link-a">My Profile</a>
          </div>
          <div className="nav-link">
            <a href="/login" className="nav-link-a" onClick={onLogout}>Logout</a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;