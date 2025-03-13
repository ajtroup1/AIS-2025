import React, { useState } from "react";
import "../css/ResumeBuilder.css";
import Cookies from "js-cookie";

const ResumeBuilder: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>("");
  const [resumeName, setResumeName] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      setIsSearching(true);
      setTimeout(() => {
        const results = ["lll"];
        setIsSearching(false);
      }, 2000);
    }
  };

  const handleGenResume = async () => {
    setIsSearching(true);
    const response = await fetch("http://127.0.0.1:8000/api/generate-resume/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Cookies.get("accessToken")}`,
      },
      body: JSON.stringify({ position: jobDescription }),
    });

    const data = await response.json();

    if (response.status === 200) {
      alert(`Resume generated successfully at "${data.doc_url}"!`);
      setIsSearching(false);
      return;
    }

    alert(`Failed to generate resume: ${data.error}`);
    setIsSearching(false);
  };

  return (
    <div className="container">
      <div className="content">
        <div className="resumeBuilder">
          <h1>Resume Builder</h1>

          <div className="searchSection">
            <label htmlFor="jobDescription">Enter Job Description:</label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Paste the job description here and press Enter..."
              rows={10} // Adjust the number of rows as needed
            />
          </div>

          <div className="searchSection">
            <label htmlFor="resumeName">Resume Name:</label>
            <input
              id="resumeName"
              type="text"
              placeholder="Enter the name of the resume..."
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
            />
          </div>

          <button onClick={handleGenResume}>Create a resume</button>

          {isSearching && (
            <div className="loadingSpinner">
              <div className="spinner"></div>
              <p>Generating a resume for you...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;