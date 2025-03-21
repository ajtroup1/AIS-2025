import React, { useEffect, useState } from "react";
import "../css/Profile.css";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faGlobe, faGraduationCap, faContactCard } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { useApi } from "../hooks/useApi";

const Profile: React.FC = () => {
  const { apiRequest } = useApi();
  const [user, setUser] = useState({} as any);
  const [profile, setProfile] = useState({} as any);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await apiRequest(`http://127.0.0.1:8000/api/get-current-user/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchProfile = async () => {
      try {
        const userId = Cookies.get("userId");
        const accessToken = Cookies.get("accessToken");

        const response = await apiRequest(`http://127.0.0.1:8000/api/profiles/${userId}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchData = async () => {
      await fetchCurrentUser();
      await fetchProfile();
      setIsLoading(false);
    };

    fetchData();
  }, []);
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-header">Hello, {user.username}</h1>

      <div className="profile-info">
      <p><FontAwesomeIcon icon={faContactCard} />{profile.full_name? profile.full_name : "Please enter full name"}</p>
        <p><FontAwesomeIcon icon={faEnvelope} /> <a href={`mailto:${user.email}`}>{user.email}</a></p>
        <p><FontAwesomeIcon icon={faPhone} />{profile.phone? profile.phone : "N/A"}</p>
        <p><FontAwesomeIcon icon={faGlobe} /> <a target="_blank" rel="noopener noreferrer">{profile.website? profile.website : "N/A"}</a></p>
        <p><FontAwesomeIcon icon={faLinkedin} /> <a target="_blank" rel="noopener noreferrer">{profile.linkedin? profile.linkedin : "N/A"}</a></p>
      </div>

      <div className="profile-edu-info">
        <h2><FontAwesomeIcon icon={faGraduationCap} /> Education</h2>
        <p>{user.latest_edu_name}</p>
        <p>{user.latest_edu_from_date} to {user.latest_edu_to_date}</p>
        <p>{user.latest_edu_desc}</p>
      </div>

      <button>Edit Profile</button>
    </div>
  );
};

export default Profile;