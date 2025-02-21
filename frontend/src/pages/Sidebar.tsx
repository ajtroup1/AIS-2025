import React from "react";
import "../css/Sidebar.css";

type SidebarProps = {
  onUploadResume: () => void;
  onEditExperiences: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ onUploadResume}) => {
  return (
    <div className="sidebar">
      <button className="sidebar-button" onClick={onUploadResume}>
        Upload Resume
      </button>
    </div>
  );
};

export default Sidebar;