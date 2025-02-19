import React, { useState } from "react";
import "../css/ResumeArchive.css";

type ResumeEntry = {
  id: number;
  year: number;
  resumeText: string;
};

const ResumeArchive: React.FC = () => {
  const [resumes, setResumes] = useState<ResumeEntry[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [resumeText, setResumeText] = useState<string>("");
  const [resumeYear, setResumeYear] = useState<number>(new Date().getFullYear()); // New state for year
  const [editResumeId, setEditResumeId] = useState<number | null>(null);


  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  const handleResumeTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(e.target.value);
  };

  const handleResumeYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeYear(parseInt(e.target.value, 10));
  };

  const handleSaveResume = () => {
    if (!resumeText.trim()) {
      alert("Please enter resume text.");
      return;
    }

    if (editResumeId !== null) {
      const updatedResumes = resumes.map((resume) =>
        resume.id === editResumeId ? { ...resume, year: resumeYear, resumeText } : resume
      );
      setResumes(updatedResumes);
      setEditResumeId(null);
    } else {
      const newResume: ResumeEntry = {
        id: resumes.length + 1,
        year: resumeYear,
        resumeText,
      };
      setResumes([...resumes, newResume]);
    }

    setResumeText("");
    setResumeYear(new Date().getFullYear());
    setIsAddModalOpen(false);
  };

  const handleEditResume = (id: number) => {
    const resumeToEdit = resumes.find((resume) => resume.id === id);
    if (resumeToEdit) {
      setResumeText(resumeToEdit.resumeText);
      setResumeYear(resumeToEdit.year);
      setEditResumeId(id);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteResume = (id: number) => {
    setResumes(resumes.filter((resume) => resume.id !== id));
  };

  const filteredResumes = resumes.filter((resume) => resume.year === selectedYear);

  return (
    <div className="container">
      <div className="content">
        <div className="resumeArchive">
          <h1>Resume Archive</h1>

          <div className="controls">
            <label htmlFor="yearSelect">Select Year: </label>
            <select id="yearSelect" value={selectedYear} onChange={handleYearChange}>
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <button onClick={() => setIsAddModalOpen(true)}>Add Resume</button>
          </div>

          <table className="resumeTable">
            <thead>
              <tr>
                <th>Year</th>
                <th>Resume Text</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResumes.map((resume) => (
                <tr key={resume.id}>
                  <td>{resume.year}</td>
                  <td>{resume.resumeText}</td>
                  <td>
                    <button onClick={() => handleEditResume(resume.id)}>Edit</button>
                    <button onClick={() => handleDeleteResume(resume.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isAddModalOpen && (
            <div className="modal">
              <div className="modalContent">
                <h2>{editResumeId !== null ? "Edit Resume" : "Add Resume"}</h2>
                <label>Year: </label>
                <input
                  type="number"
                  value={resumeYear}
                  onChange={handleResumeYearChange}
                  min={2000}
                  max={new Date().getFullYear()}
                />
                <label>Resume Text: </label>
                <textarea
                  value={resumeText}
                  onChange={handleResumeTextChange}
                  placeholder="Enter resume text..."
                  rows={5}
                />
                <button onClick={handleSaveResume}>
                  {editResumeId !== null ? "Update" : "Save"}
                </button>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setResumeText("");
                    setResumeYear(new Date().getFullYear());
                    setEditResumeId(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeArchive;