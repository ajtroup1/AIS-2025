import React, { useState } from "react";
import "../css/Profile.css";



const Profile: React.FC = () => {
  const user: User = {
    id: 1,
    username: "testuser",
    email: "email@site.com",
    password: "password",
  }

  return (
    <div className="job-finder">
      <h1>Hello, {user.username}</h1>

      <div className="filters">
        <p>render more</p>
      </div>
    </div>
  );
};

export default Profile;