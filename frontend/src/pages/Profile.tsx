import React, { ProfilerProps, useEffect, useState } from "react";
import "../css/Profile.css";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faGlobe, faGraduationCap, faContactCard } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { useApi } from "../hooks/useApi";

const Profile: React.FC = () => {
  const { apiRequest } = useApi();
  const [user, setUser] = useState({} as any);
  const [profile, setProfile] = useState({
    "user": -1,
    "full_name": "",
    "email": "",
    "phone": "",
    "website": "",
    "linkedin": "",
    "latest_edu_name": "",
    "latest_edu_from_date": "",
    "latest_edu_to_date": "",
    "latest_edu_desc": ""
});
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await apiRequest(`http://127.0.0.1:8000/api/get-current-user/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
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
  
        if (!userId || !accessToken) {
          throw new Error("Missing userId or accessToken.");
        }
  
        const fetchProfileResponse = await apiRequest(`http://127.0.0.1:8000/api/profiles/${userId}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
        });
        // if status get call =404, create a profile
        if (fetchProfileResponse.status === 404) {
          console.warn("No profile found. Creating a new one...");
  
          //post call
          const createProfileResponse = await apiRequest(`http://127.0.0.1:8000/api/create-profile/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              user: parseInt(userId!),
              full_name: "Enter full name here",
              email: user.email ? user.email : "N/A",
              phone: "N/A",
              website: "N/A",
              linkedin: "N/A",
              latest_edu_name: "N/A",
              latest_edu_from_date: "1999-01-01",
              latest_edu_to_date: "1999-01-01",
              latest_edu_desc: "N/A"
            }),
          });
          //if post call failed, throw error
          if (!createProfileResponse.ok) {
            const data = await createProfileResponse.json()
            console.log(data)
            throw new Error("Failed to create a profile");
          }
          // else, profile created & set profile with the newly created
          console.log("Profile created successfully.");
          const createdData = await createProfileResponse.json();
          setProfile(createdData);
        // if original get call succeeds, just set profile with the data fetched
        } else if (fetchProfileResponse.ok) {
          const data = await fetchProfileResponse.json();
          setProfile(data);
        // error get call different than 404, throw error
        } else {
          throw new Error("Failed to fetch profile.");
        }
      } catch (error) {
        console.error("Error fetching or creating profile:", error);
      }
    };
  
    const fetchData = async () => {
      await fetchCurrentUser();
      await fetchProfile();
      setIsLoading(false);
    };
  
    fetchData();
  }, []);
  
  
  //edit
  const handleEditProfile = async () => {
    setEditMode((prev) => !prev);
    console.log("edit mode", !editMode); // Log the correct state change
  }

  // dynamically handle the changes in input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    console.log("Profile after edit: ", profile);
  
    try {
      const userId = Cookies.get("userId");
      const accessToken = Cookies.get("accessToken");
  
      if (!userId || !accessToken) {
        throw new Error("User ID or Access Token is missing");
      }
  
      const response = await apiRequest(`http://127.0.0.1:8000/api/update-profile/${userId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(profile),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating profile", errorData);
      } else {
        console.log("Profile updated successfully:", await response.json());
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      handleEditProfile();
    }
  };  
  


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <h1 className="profile-header">Hello, {user.username}!</h1>
        <h2>Please create your profile</h2>
      </div>
    );
  }
  
  return (
    <div className="profile-container">
      <h1 className="profile-header">Hello, {user.username}</h1>
      <div className="profile-info">
        <p><FontAwesomeIcon icon={faContactCard} />
        <input className="profile-input-field"
          type="text"
          name="full_name"
          value={profile.full_name || ''}
          onChange={handleChange}
          disabled={!editMode}
          placeholder="Enter your full name"
        /></p>
        <p><FontAwesomeIcon icon={faEnvelope} /><a href={`mailto:${user.email}`}>{user.email}</a></p>
        <p><FontAwesomeIcon icon={faPhone} />
        <input className="profile-input-field"
          type="text"
          name="phone"
          value={profile.phone || ''}
          onChange={handleChange}
          disabled={!editMode}
          placeholder="Enter your phone number"
        /></p>
        <p><FontAwesomeIcon icon={faGlobe} /><a target="_blank" rel="noopener noreferrer">
          <input className="profile-input-field"
            type="text"
            name="website"
            value={profile.website || ''}
            onChange={handleChange}
            disabled={!editMode}
            placeholder="Enter your link to your website/ GitHub (if any)"
          /></a></p>
        <p><FontAwesomeIcon icon={faLinkedin} /><a target="_blank" rel="noopener noreferrer">
          <input className="profile-input-field"
            type="text"
            name="linkedin"
            value={profile.linkedin || ''}
            onChange={handleChange}
            disabled={!editMode}
            placeholder="Enter your LinkedIn account"
          /></a></p>
      </div>

      <div className="profile-edu-info">
        <h2><FontAwesomeIcon icon={faGraduationCap} />Education</h2>
        <p style={{ fontWeight: 'bold' }}><input className="profile-input-field"
            type="text"
            name="latest_edu_name"
            value={profile.latest_edu_name || ''}
            onChange={handleChange}
            disabled={!editMode}
            placeholder="Enter your latest education"
          /></p>
          <p><p>Start Date: </p>
          <input className="profile-input-field"
            type="date"
            name="latest_edu_from_date"
            value={profile.latest_edu_from_date || ''}
            onChange={handleChange}
            disabled={!editMode}
            placeholder="yyyy-mm-dd"/></p>
          <p>
          <p>End Date: </p><input className="profile-input-field"
            type="date"
            name="latest_edu_to_date"
            value={profile.latest_edu_to_date || ''}
            onChange={handleChange}
            disabled={!editMode}
            placeholder="yyyy-mm-dd"/></p>

        <p>Summary:</p>
        <textarea
          className="profile-input-field"
          name="latest_edu_desc"
          value={profile.latest_edu_desc || ''}
          onChange={handleChange}
          disabled={!editMode}
          placeholder="Enter your latest education description"
          rows={6}  // Adjust number of visible rows
          cols={50}  // Adjust the width
        ></textarea>
      </div>
      {!editMode ? 
      <div className="profile-buttons">
        <button className="profile-button-edit" onClick={handleEditProfile}>Edit Profile</button>
      </div> :
      
      <div className="profile-editing-buttons">
        <button className="profile-button-save" onClick={handleSave}>Save</button>
        <button className="profile-button-cancel" onClick={handleEditProfile}>Cancel</button>
      </div>
    }
      
    </div>
  );
};

export default Profile;