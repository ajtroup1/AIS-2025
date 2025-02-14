import React from "react";
import "../css/Sidebar.css";

type SidebarProps = {
  onUploadResume: () => void;
  onEditExperiences: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ onUploadResume, onEditExperiences }) => {
  return (
    <div className="sidebar">
      <button className="sidebar-button" onClick={onUploadResume}>
        Upload Resume
      </button>
      <button className="sidebar-button" onClick={onEditExperiences}>
        Edit Experiences
      </button>
    </div>
  );
};

export default Sidebar;