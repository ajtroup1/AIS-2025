import React, { useState, useEffect } from "react";
import "../css/ResumeArchive.css";
import { useApi } from "../hooks/useApi";
import Cookies from "js-cookie";

const ResumeArchive: React.FC = () => {
  const { apiRequest } = useApi();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeYear, setResumeYear] = useState<number>(new Date().getFullYear());
  const [editResumeId, setEditResumeId] = useState<number | null>(null);

  const fetchResumes = async () => {
    const response = await apiRequest("http://127.0.0.1:8000/api/resumes/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      const fetchedResumes: Resume[] = data.map((resume: any) => ({
        id: resume.id,
        createdAt: resume.created_at,
        filePath: resume.file_path,
        name: resume.resume_name,
        userId: resume.user_id,
      }));
      console.log(fetchedResumes);
      setResumes(fetchedResumes);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

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
        resume.id === editResumeId ? { ...resume, createdAt: resumeYear, name: resumeFile.name, filePath: resumeFile.webkitRelativePath } : resume
      );
      setResumes(updatedResumes);
      setEditResumeId(null);
    } else {
      const newResume: Resume = {
        id: resumes.length + 1,
        createdAt: new Date().toISOString(),
        name: resumeFile.name,
        filePath: resumeFile.webkitRelativePath,
        userId: 1,
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
      const f: File = new File([resumeToEdit.filePath], resumeToEdit.name, { type: "application/pdf" });
      setResumeFile(f);
      setResumeYear(new Date(resumeToEdit.createdAt).getFullYear());
      setEditResumeId(id);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteResume = (id: number) => {
    setResumes(resumes.filter((resume) => resume.id !== id));
  };

  const handleDownloadResume = (resume: Resume) => {
    const url = resume.filePath;
    const a = document.createElement('a');
    a.href = url;
    a.download = resume.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredResumes = resumes.filter((resume) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      resume.createdAt.toString().includes(searchLower) ||
      resume.name.toLowerCase().includes(searchLower)
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
                <th>Resume Name</th>
                <th>Full path</th>
                <th>Created at</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResumes.map((resume) => (
                <tr key={resume.id}>
                  <td>{new Date(resume.createdAt).getFullYear()}</td>
                  <td>{resume.name}</td>
                  <td>{resume.filePath}</td>
                  <td>{new Date(resume.createdAt).toLocaleDateString()}</td>
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
