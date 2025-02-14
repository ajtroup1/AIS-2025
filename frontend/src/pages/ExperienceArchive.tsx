import React, { useState } from "react";
import "../css/ExperienceArchive.css";
import Sidebar from "./Sidebar";

// Define the type for an experience entry
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
      // Add new entry
      const updatedEntries = [];
      for (let i = 0; i < entries.length; i++) {
        updatedEntries.push(entries[i]);
      }
      updatedEntries.push({ ...newEntry, id: entries.length + 1 });
      setEntries(updatedEntries);
    } else {
      // Update existing entry
      const updatedEntries = [];
      for (let i = 0; i < entries.length; i++) {
        if (entries[i].id === newEntry.id) {
          updatedEntries.push(newEntry);
        } else {
          updatedEntries.push(entries[i]);
        }
      }
      setEntries(updatedEntries);
    }

    setIsExperienceModalOpen(false);
  };

  const handleEdit = (id: number) => {
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].id === id) {
        setNewEntry(entries[i]);
        setIsExperienceModalOpen(true);
        break;
      }
    }
  };

  const handleDelete = (id: number) => {
    const updatedEntries = [];
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].id !== id) {
        updatedEntries.push(entries[i]);
      }
    }
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
    <div className="experience-archive">
      {/* Sidebar with buttons for uploading resume and editing experiences */}
      <Sidebar onUploadResume={handleUploadResume} onEditExperiences={handleAddNew} />

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Job Title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleAddNew}>Add New</button>
      </div>

      {/* Table to display experience entries */}
      <table className="experience-table">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Firm</th>
            <th>Duration</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(() => {
            const rows = [];
            for (let i = 0; i < entries.length; i++) {
              const entry = entries[i];
              rows.push(
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
              );
            }
            return rows;
          })()}
        </tbody>
      </table>

      {/* Modal for adding/editing experience entries */}
      {isExperienceModalOpen && (
        <div className="modal">
          <div className="modal-content">
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

      {/* Modal for uploading a resume */}
      {isResumeModalOpen && (
        <div className="modal">
          <div className="modal-content">
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