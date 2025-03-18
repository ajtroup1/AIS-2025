import React, { useEffect, useState } from "react";
import "../css/ExperienceArchive.css";
import Sidebar from "./Sidebar";
import Cookies from "js-cookie";
import SkillInput from "../components/InputSkills";
import { useApi } from "../hooks/useApi";

interface ExperienceArchiveProps {
  experiences: Experience[];
  setExperiences: (experiences: Experience[]) => void;
}

const ExperienceArchive: React.FC<ExperienceArchiveProps> = ({ experiences, setExperiences }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState<Experience>({
    id: 0,
    title: "",
    company: "",
    jobType: "Internship",
    fromDate: "",
    toDate: "",
    location: "",
    desription: "",
    skills: [],
    userId: 0,
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const { apiRequest } = useApi();

  useEffect(() => {
    const fetchExperiences = async () => {
      const header = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      };
      const response = await apiRequest("http://127.0.0.1:8000/api/experiences/", {
        method: "GET",
        headers: header,
      });

      if (response.ok) {
        const data = await response.json();
        const normalized: Experience[] = [];
        data.map((entry: any) => {
          const obj: Experience = {
            id: entry.id,
            title: entry.job_title,
            company: entry.company,
            jobType: entry.job_type,
            fromDate: entry.from_date,
            toDate: entry.to_date,
            desription: entry.description,
            location: entry.location,
            userId: entry.user,
            skills: entry.skills
          }
          normalized.push(obj);
        });
        setExperiences(normalized);
      } else {
        alert("Failed to fetch experiences.");
      }
    };

    if (experiences.length < 1) {
      fetchExperiences();
    }
  }, [experiences, setExperiences, apiRequest]);

  const handleSearch = () => {
    console.log("Search term:", searchTerm);
  };

  const handleAddNew = () => {
    setIsExperienceModalOpen(true);
    setNewEntry({
      id: 0,
      title: "",
      company: "",
      jobType: "Internship",
      fromDate: "",
      toDate: "",
      location: "",
      desription: "",
      skills: [],
      userId: 0
    });
  };

  const handleSaveNewEntry = async () => {
    if (!newEntry.title || !newEntry.company || !newEntry.jobType || !newEntry.fromDate || !newEntry.toDate || !newEntry.location || !newEntry.desription) {
      alert("Please fill in all fields.");
      return;
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(newEntry.fromDate) || !datePattern.test(newEntry.toDate)) {
      alert("Please enter the dates in 'YYYY-MM-DD' format.");
      return;
    }

    const fromDate = new Date(newEntry.fromDate);
    const toDate = new Date(newEntry.toDate);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      alert("Please enter valid dates.");
      return;
    }

    if (fromDate > toDate) {
      alert("The 'from' date must be before the 'to' date.");
      return;
    }

    console.log(newEntry);

    let data;
    if (newEntry.id === 0) {
      data = await APISaveExperience();
    } else {
      data = await APIEditExperience(newEntry.id);
    }

    if (data === null) {
      alert("Failed to save experience.");
      return;
    }

    newEntry.id = data.id;

    console.log(newEntry);

    const updatedEntries = experiences.some(exp => exp.id === newEntry.id)
      ? experiences.map(exp => (exp.id === newEntry.id ? newEntry : exp))
      : [...experiences, newEntry];

    setExperiences(updatedEntries);
    setIsExperienceModalOpen(false);
  };

  const APISaveExperience = async () => {
    const header = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    };
    const payload = {
      job_title: newEntry.title,
      company: newEntry.company,
      job_type: newEntry.jobType,
      from_date: newEntry.fromDate,
      to_date: newEntry.toDate,
      location: newEntry.location,
      description: newEntry.desription,
      skills: newEntry.skills,
      user: Cookies.get("userId"),
    };
    console.log("api", payload)
    const response = await apiRequest("http://127.0.0.1:8000/api/create-experience/", {
      method: "POST",
      headers: header,
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return await response.json();
    } else {
      const data = await response.json();
      console.log(data)
    }

    return null;
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toISOString();
  };

  const normalizeDateTime = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      timeZone: "UTC",
    });
  };

  const handleEdit = async (id: number) => {
    const entryToEdit = experiences.find((entry) => entry.id === id);
    if (entryToEdit) {
      setNewEntry(entryToEdit);
      setIsExperienceModalOpen(true);
    }
  };

  const APIEditExperience = async (id: number) => {
    const header = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    };
    const payload = {
      job_title: newEntry.title,
      company: newEntry.company,
      from_date: formatDateTime(newEntry.fromDate),
      to_date: formatDateTime(newEntry.toDate),
      location: newEntry.location,
      skills: newEntry.skills,
      description: newEntry.desription,
      user: Cookies.get("userId"),
    };
    const response = await apiRequest(`http://127.0.0.1:8000/api/edit-experience/${id}/`, {
      method: "PUT",
      headers: header,
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return await response.json();
    }

    return null;
  };

  const handleDelete = async (id: number) => {
    const err = await APIDeleteExperience(id);
    if (err !== null) {
      alert(`Failed to delete experience: ${err}`);
      return;
    }

    const updatedEntries = experiences.filter((entry) => entry.id !== id);
    setExperiences(updatedEntries);
  };

  const APIDeleteExperience = async (id: number) => {
    const header = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    };
    const response = await apiRequest(`http://127.0.0.1:8000/api/delete-experience/${id}/`, {
      method: "DELETE",
      headers: header,
    });

    if (response.ok) {
      return null;
    }

    const data = await response.json();
    return data.detail;
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
      <p className="expArchHeaderText">Experience Archive</p>
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
            <th>Job Type</th>
            <th>Location</th>
            <th>Description</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {experiences.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.title}</td>
              <td>{entry.company}</td>
              <td>{entry.jobType}</td>
              <td>{entry.location}</td>
              <td>{entry.desription}</td>
              <td><em>{normalizeDateTime(entry.fromDate)}</em> → <em>{normalizeDateTime(entry.toDate)}</em></td>
              <td>
                <div className="experienceActions">
                  <button onClick={() => handleEdit(entry.id)}>Edit</button>
                  <button onClick={() => handleDelete(entry.id)}>Delete</button>
                </div>
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
              value={newEntry.title}
              onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
            />
            <label>Firm:</label>
            <input
              type="text"
              value={newEntry.company}
              onChange={(e) => setNewEntry({ ...newEntry, company: e.target.value })}
            />
            <label>Job Type:</label>
            <select className="option-dropdown"
              value={newEntry.jobType}
              onChange={(e) => setNewEntry({ ...newEntry, jobType: e.target.value as "Internship" | "Co-op" | "Full-Time" | "Part-Time" | "Program" })}
            >
              <option value="Internship">Internship</option>
              <option value="Co-op">Co-op</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Program">Program</option>
            </select>
            <label>From (YYYY-MM-DD):</label>
            <input
              type="text"
              value={newEntry.fromDate}
              onChange={(e) => setNewEntry({ ...newEntry, fromDate: e.target.value })}
            />
            <label>To (YYYY-MM-DD):</label>
            <input
              type="text"
              value={newEntry.toDate}
              onChange={(e) => setNewEntry({ ...newEntry, toDate: e.target.value })}
            />
            <label>Location:</label>
            <input
              type="text"
              value={newEntry.location}
              onChange={(e) => setNewEntry({ ...newEntry, location: e.target.value })}
            />
            <label>Skills:</label>
            <SkillInput
              value={newEntry.skills}
              onChange={(skills) => setNewEntry({ ...newEntry, skills })}
            />
            <label>Description:</label>
            <input
              type="text"
              value={newEntry.desription}
              onChange={(e) => setNewEntry({ ...newEntry, desription: e.target.value })}
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