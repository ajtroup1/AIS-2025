import React, { useEffect, useState } from "react";
import "../css/Profile.css";
import Cookies from "js-cookie";

const Profile: React.FC = () => {
  const [user, setUser] = useState({} as any);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch(`http://127.0.0.1:8000/api/profiles/${Cookies.get("userId")}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      const data = await response.json();
      setUser(data);
      // console.log(data)
      setIsLoading(false);
    }
    fetchProfile();
  }, []);

  return (
    <div className="job-finder">
      <h1>Hello, {user.full_name}</h1>

      <div className="profile-info">
        <p>{user.email}</p>
        <p>{user.phone}</p>
        <p>{user.website}</p>
        <p>{user.linkedin}</p>
      </div>

      <div className="profile-edu-info">
        <h2>Education</h2>
        <p>{user.latest_edu_name}</p>
        <p>{user.latest_edu_from_date} to {user.latest_edu_to_date}</p>
        <p>{user.latest_edu_desc}</p>
      </div>
    </div>
  );
};

export default Profile;