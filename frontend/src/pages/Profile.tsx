import React, { useEffect, useState } from "react";
import "../css/Profile.css";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faGlobe, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { useApi } from "../hooks/useApi";

const Profile: React.FC = () => {
  const { apiRequest } = useApi();
  const [user, setUser] = useState({} as any);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await apiRequest(`http://127.0.0.1:8000/api/profiles/${Cookies.get("userId")}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setUser(data);
      setIsLoading(false);
    };
    fetchProfile();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-header">Hello, {user.full_name}</h1>

      <div className="profile-info">
        <p><FontAwesomeIcon icon={faEnvelope} /> <a href={`mailto:${user.email}`}>{user.email}</a></p>
        <p><FontAwesomeIcon icon={faPhone} /> {user.phone}</p>
        <p><FontAwesomeIcon icon={faGlobe} /> <a href={user.website} target="_blank" rel="noopener noreferrer">{user.website}</a></p>
        <p><FontAwesomeIcon icon={faLinkedin} /> <a href={user.linkedin} target="_blank" rel="noopener noreferrer">{user.linkedin}</a></p>
      </div>

      <div className="profile-edu-info">
        <h2><FontAwesomeIcon icon={faGraduationCap} /> Education</h2>
        <p>{user.latest_edu_name}</p>
        <p>{user.latest_edu_from_date} to {user.latest_edu_to_date}</p>
        <p>{user.latest_edu_desc}</p>
      </div>
    </div>
  );
};

export default Profile;