import React, { useState } from "react";
import "../css/ResumeArchive.css";

type ResumeEntry = {
  id: number;
  year: number;
  resumeFile: File | null;
};

const ResumeArchive: React.FC = () => {
  const [resumes, setResumes] = useState<ResumeEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeYear, setResumeYear] = useState<number>(new Date().getFullYear());
  const [editResumeId, setEditResumeId] = useState<number | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleResumeYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeYear(parseInt(e.target.value, 10));
  };

  const handleSaveResume = () => {
    if (!resumeFile) {
      alert("Please upload a resume file.");
      return;
    }

    if (editResumeId !== null) {
      const updatedResumes = resumes.map((resume) =>
        resume.id === editResumeId ? { ...resume, year: resumeYear, resumeFile } : resume
      );
      setResumes(updatedResumes);
      setEditResumeId(null);
    } else {
      const newResume: ResumeEntry = {
        id: resumes.length + 1,
        year: resumeYear,
        resumeFile: resumeFile,
      };
      setResumes([...resumes, newResume]);
    }

    setResumeFile(null);
    setResumeYear(new Date().getFullYear());
    setIsAddModalOpen(false);
  };

  const handleEditResume = (id: number) => {
    const resumeToEdit = resumes.find((resume) => resume.id === id);
    if (resumeToEdit) {
      setResumeFile(resumeToEdit.resumeFile);
      setResumeYear(resumeToEdit.year);
      setEditResumeId(id);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteResume = (id: number) => {
    setResumes(resumes.filter((resume) => resume.id !== id));
  };

  const handleDownloadResume = (resume: ResumeEntry) => {
    if (resume.resumeFile) {
      const url = URL.createObjectURL(resume.resumeFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = resume.resumeFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const filteredResumes = resumes.filter((resume) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      resume.year.toString().includes(searchLower) ||
      (resume.resumeFile && resume.resumeFile.name.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="container">
      <div className="content">
        <div className="resumeArchive">
          <h1>Resume Archive</h1>

          <div className="controls">
            <div className="searchBar">
              <input
                type="text"
                placeholder="Search by year or filename..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <button onClick={() => setIsAddModalOpen(true)}>Add Resume</button>
          </div>

          <table className="resumeTable">
            <thead>
              <tr>
                <th>Year</th>
                <th>Resume File</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResumes.map((resume) => (
                <tr key={resume.id}>
                  <td>{resume.year}</td>
                  <td>{resume.resumeFile ? resume.resumeFile.name : "No file uploaded"}</td>
                  <td className="actionButtons">
                    <button onClick={() => handleDownloadResume(resume)} className="downloadButton">
                      Download
                    </button>
                    <button onClick={() => handleEditResume(resume.id)} className="editButton">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteResume(resume.id)} className="deleteButton">
                      Delete
                    </button>
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
                <label>Resume File: </label>
                <input
                  type="file"
                  onChange={handleResumeFileChange}
                />
                {resumeFile && (
                  <div>
                    <p>Current file: {resumeFile.name}</p>
                  </div>
                )}
                <button onClick={handleSaveResume}>
                  {editResumeId !== null ? "Update" : "Save"}
                </button>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setResumeFile(null);
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
