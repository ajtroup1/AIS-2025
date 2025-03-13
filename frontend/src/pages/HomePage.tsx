import React from 'react';
import '../css/HomePage.css'; // Import the new CSS file

const HomePage: React.FC = () => {
  const homeContentOptions = [
    {
      title: "Archive your work experience",
      description: "Keep track of your work experience and achievements in one place.",
    },
    {
      title: "Track your job applications",
      description: "Organize and manage your job applications with ease.",
    },
    {
      title: "Archive previous resumes",
      description: "Store and access your past resumes for reference.",
    },
    {
      title: "Build and store your resume",
      description: "Create and save your resume for future use.",
    },
  ];

  return (
    <div className="home-page">
      <div className="home-banner">
        <img src="https://www.techvoltcoimbatore.com/images/techvolt-career.jpg" className="home-banner-img" alt="Home Banner" />
        <div className="home-banner-text">
          <h1>My Application Portal</h1>
        </div>
      </div>
      <div className="home-content">
        <div className="home-content-header">
          <p>Organize your job search and career development with ease.</p>
        </div>
        <div className="home-content-grid">
          {homeContentOptions.map((option, index) => (
            <div key={index} className="home-content-option">
              <h2>{option.title}</h2>
              <p>{option.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;