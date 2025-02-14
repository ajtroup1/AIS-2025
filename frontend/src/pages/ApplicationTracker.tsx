import React, { useState } from "react";
import "../css/ApplicationTracker.css";

// Define the type for an application
type Application = {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  applicationDate: string;
  status: string;
  notes: string;
};

const ApplicationTracker: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [newApplication, setNewApplication] = useState<Application>({
    id: 0,
    jobTitle: "",
    company: "",
    location: "",
    applicationDate: "",
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
      applicationDate: "",
      status: "Applied",
      notes: "",
    });
  };

  const handleEditApplication = (id: number) => {
    for (let i = 0; i < applications.length; i++) {
      if (applications[i].id === id) {
        setIsModalOpen(true);
        setEditingId(id);
        setNewApplication(applications[i]);
        break;
      }
    }
  };

  const handleSaveApplication = () => {
    if (!newApplication.jobTitle || !newApplication.company || !newApplication.location || !newApplication.applicationDate) {
      alert("Please fill in all required fields.");
      return;
    }

    if (editingId !== null) {
      const updatedApplications = [];
      for (let i = 0; i < applications.length; i++) {
        if (applications[i].id === editingId) {
          updatedApplications.push(newApplication);
        } else {
          updatedApplications.push(applications[i]);
        }
      }
      setApplications(updatedApplications);
    } else {
      const newApp = { ...newApplication, id: applications.length + 1 };
      const updatedApplications = [];
      for (let i = 0; i < applications.length; i++) {
        updatedApplications.push(applications[i]);
      }
      updatedApplications.push(newApp);
      setApplications(updatedApplications);
    }

    setIsModalOpen(false);
  };

  const handleDeleteApplication = (id: number) => {
    const updatedApplications = [];
    for (let i = 0; i < applications.length; i++) {
      if (applications[i].id !== id) {
        updatedApplications.push(applications[i]);
      }
    }
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
    <div className="application-tracker">
      <h1>Job Application Tracker</h1>

      <div className="button-group">
        <button className="add-button" onClick={handleAddApplication}>+ Add Application</button>
        <button className="upload-button" onClick={handleUploadApplication}>Upload Application</button>
      </div>

      <table className="application-table">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Company</th>
            <th>Location</th>
            <th>Application Date</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(() => {
            const rows = [];
            for (let i = 0; i < applications.length; i++) {
              const app = applications[i];
              rows.push(
                <tr key={app.id}>
                  <td>{app.jobTitle}</td>
                  <td>{app.company}</td>
                  <td>{app.location}</td>
                  <td>{app.applicationDate}</td>
                  <td>{app.status}</td>
                  <td>{app.notes}</td>
                  <td>
                    <button className="edit" onClick={() => handleEditApplication(app.id)}>Edit</button>
                    <button className="delete" onClick={() => handleDeleteApplication(app.id)}>Delete</button>
                  </td>
                </tr>
              );
            }
            return rows;
          })()}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingId !== null ? "Edit Application" : "Add Application"}</h2>
            <label>Job Title:</label>
            <input type="text" value={newApplication.jobTitle} onChange={(e) => setNewApplication({ ...newApplication, jobTitle: e.target.value })} />
            <label>Company:</label>
            <input type="text" value={newApplication.company} onChange={(e) => setNewApplication({ ...newApplication, company: e.target.value })} />
            <label>Location:</label>
            <input type="text" value={newApplication.location} onChange={(e) => setNewApplication({ ...newApplication, location: e.target.value })} />
            <label>Application Date:</label>
            <input type="date" value={newApplication.applicationDate} onChange={(e) => setNewApplication({ ...newApplication, applicationDate: e.target.value })} />
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