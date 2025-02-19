import React, { useState } from "react";
import "../css/ExperienceArchive.css";
import Sidebar from "./Sidebar";

type ExperienceEntry = {
  id: number;
  jobTitle: string;
  firm: string;
  duration: string;
  location: string;
};

const ExperienceArchive: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entries, setEntries] = useState<ExperienceEntry[]>([]);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState<ExperienceEntry>({
    id: 0,
    jobTitle: "",
    firm: "",
    duration: "",
    location: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleSearch = () => {
    console.log("Search term:", searchTerm);
  };

  const handleAddNew = () => {
    setIsExperienceModalOpen(true);
    setNewEntry({
      id: 0,
      jobTitle: "",
      firm: "",
      duration: "",
      location: "",
    });
  };

  const handleSaveNewEntry = () => {
    if (!newEntry.jobTitle || !newEntry.firm || !newEntry.duration || !newEntry.location) {
      alert("Please fill in all fields.");
      return;
    }

    if (newEntry.id === 0) {
      const updatedEntries = [...entries, { ...newEntry, id: entries.length + 1 }];
      setEntries(updatedEntries);
    } else {
      const updatedEntries = entries.map((entry) =>
        entry.id === newEntry.id ? newEntry : entry
      );
      setEntries(updatedEntries);
    }

    setIsExperienceModalOpen(false);
  };

  const handleEdit = (id: number) => {
    const entryToEdit = entries.find((entry) => entry.id === id);
    if (entryToEdit) {
      setNewEntry(entryToEdit);
      setIsExperienceModalOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id);
    setEntries(updatedEntries);
  };

  const handleUploadResume = () => {
    setIsResumeModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSaveResume = () => {
    if (resumeFile) {
      console.log("Resume file:", resumeFile);
      alert(`Resume "${resumeFile.name}" uploaded. Replace with API call.`);
      setIsResumeModalOpen(false);
      setResumeFile(null);
    } else {
      alert("Please select a file.");
    }
  };

  return (
    <div className="experienceArchive">
      <Sidebar onUploadResume={handleUploadResume} onEditExperiences={handleAddNew} />

      <div className="searchBar">
        <input
          type="text"
          placeholder="Search by Job Title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleAddNew}>Add New</button>
      </div>

      <table className="experienceTable">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Company</th>
            <th>Duration</th>
            <th>Location</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.jobTitle}</td>
              <td>{entry.firm}</td>
              <td>{entry.duration}</td>
              <td>{entry.location}</td>
              <td>
                <button onClick={() => handleEdit(entry.id)}>Edit</button>
                <button onClick={() => handleDelete(entry.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isExperienceModalOpen && (
        <div className="modal">
          <div className="modalContent">
            <h2>{newEntry.id === 0 ? "Add New Experience" : "Edit Experience"}</h2>
            <label>Job Title:</label>
            <input
              type="text"
              value={newEntry.jobTitle}
              onChange={(e) => setNewEntry({ ...newEntry, jobTitle: e.target.value })}
            />
            <label>Firm:</label>
            <input
              type="text"
              value={newEntry.firm}
              onChange={(e) => setNewEntry({ ...newEntry, firm: e.target.value })}
            />
            <label>Duration:</label>
            <input
              type="text"
              value={newEntry.duration}
              onChange={(e) => setNewEntry({ ...newEntry, duration: e.target.value })}
            />
            <label>Location:</label>
            <input
              type="text"
              value={newEntry.location}
              onChange={(e) => setNewEntry({ ...newEntry, location: e.target.value })}
            />
            <button onClick={handleSaveNewEntry}>Save</button>
            <button onClick={() => setIsExperienceModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {isResumeModalOpen && (
        <div className="modal">
          <div className="modalContent">
            <h2>Upload Resume</h2>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            <button onClick={handleSaveResume}>Upload</button>
            <button onClick={() => setIsResumeModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceArchive;