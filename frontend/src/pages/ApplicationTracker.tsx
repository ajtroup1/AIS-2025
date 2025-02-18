import React, { useState } from "react";
import "../css/ApplicationTracker.css";

type Application = {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  submittedDate: string;
  status: string;
  notes: string;
};

const ApplicationTracker: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      jobTitle: "Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      submittedDate: "2023-10-01",
      status: "Applied",
      notes: "Waiting for response.",
    },
  ]);

  const [newApplication, setNewApplication] = useState<Application>({
    id: 0,
    jobTitle: "",
    company: "",
    location: "",
    submittedDate: "",
    status: "Applied",
    notes: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAddApplication = () => {
    setIsModalOpen(true);
    setEditingId(null);
    setNewApplication({
      id: 0,
      jobTitle: "",
      company: "",
      location: "",
      submittedDate: "",
      status: "Applied",
      notes: "",
    });
  };

  const handleEditApplication = (id: number) => {
    const appToEdit = applications.find((app) => app.id === id);
    if (appToEdit) {
      setIsModalOpen(true);
      setEditingId(id);
      setNewApplication(appToEdit);
    }
  };

  const handleSaveApplication = () => {
    if (!newApplication.jobTitle || !newApplication.company || !newApplication.location || !newApplication.submittedDate) {
      alert("Please fill in all required fields.");
      return;
    }

    if (editingId !== null) {
      const updatedApplications = applications.map((app) =>
        app.id === editingId ? newApplication : app
      );
      setApplications(updatedApplications);
    } else {
      const newApp = { ...newApplication, id: applications.length + 1 };
      setApplications([...applications, newApp]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteApplication = (id: number) => {
    const updatedApplications = applications.filter((app) => app.id !== id);
    setApplications(updatedApplications);
  };

  const handleUploadApplication = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.doc,.docx";

    fileInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        console.log("Selected file:", file);
        alert(`File "${file.name}" selected. Upload logic can be implemented here.`);
      }
    };

    fileInput.click();
  };

  return (
    <div className="applicationTracker">
      <h1>Job Application Tracker</h1>

      <div className="buttonGroup">
        <button className="addButton" onClick={handleAddApplication}>+ Add Application</button>
        <button className="uploadButton" onClick={handleUploadApplication}>Upload Application</button>
      </div>

      <table className="applicationTable">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Company</th>
            <th>Location</th>
            <th>Date Submitted</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>{app.jobTitle}</td>
              <td>{app.company}</td>
              <td>{app.location}</td>
              <td>{app.submittedDate}</td>
              <td>{app.status}</td>
              <td>{app.notes}</td>
              <td>
                <button className="edit" onClick={() => handleEditApplication(app.id)}>Edit</button>
                <button className="delete" onClick={() => handleDeleteApplication(app.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modalContent">
            <h2>{editingId !== null ? "Edit Application" : "Add Application"}</h2>
            <label>Job Title:</label>
            <input type="text" value={newApplication.jobTitle} onChange={(e) => setNewApplication({ ...newApplication, jobTitle: e.target.value })} />
            <label>Company:</label>
            <input type="text" value={newApplication.company} onChange={(e) => setNewApplication({ ...newApplication, company: e.target.value })} />
            <label>Location:</label>
            <input type="text" value={newApplication.location} onChange={(e) => setNewApplication({ ...newApplication, location: e.target.value })} />
            <label>Date Submitted:</label>
            <input type="date" value={newApplication.submittedDate} onChange={(e) => setNewApplication({ ...newApplication, submittedDate: e.target.value })} />
            <label>Status:</label>
            <select value={newApplication.status} onChange={(e) => setNewApplication({ ...newApplication, status: e.target.value })}>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
            <label>Notes:</label>
            <textarea value={newApplication.notes} onChange={(e) => setNewApplication({ ...newApplication, notes: e.target.value })}></textarea>
            <button onClick={handleSaveApplication}>Save</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationTracker;