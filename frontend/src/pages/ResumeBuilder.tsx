import React, { useState } from "react";
import "../css/ResumeBuilder.css";

const ResumeBuilder: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [topResults, setTopResults] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobDescription(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsSearching(true);
      setTimeout(() => {
        const results = [
          "lll"
        ];
        setTopResults(results);
        setIsSearching(false);
      }, 2000);
    }
  };

  return (
    <div className="container">
      <div className="content">
        <div className="resumeBuilder">
          <h1>Resume Builder</h1>

          <div className="searchSection">
            <label htmlFor="jobDescription">Enter Job Description: </label>
            <input
              id="jobDescription"
              type="text"
              value={jobDescription}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Paste the job description here and press Enter..."
            />
          </div>

          {isSearching && (
            <div className="loadingSpinner">
              <div className="spinner"></div>
              <p>Searching for the best resume tips...</p>
            </div>
          )}
          {topResults.length > 0 && (
            <div className="resultsSection">
              <h2>Top 3 Experiences for This Job:</h2>
              <ul>
                {topResults.map((result, index) => (
                  <li key={index}>{result}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;