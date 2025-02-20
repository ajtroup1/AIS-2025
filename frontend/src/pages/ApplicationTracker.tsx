import React, { useState, useEffect } from "react";
import "../css/ApplicationTracker.css";
import Cookies from "js-cookie";

interface ApplicationTrackerProps {
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
}

const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ applications = [], setApplications }) => {
  const [newApplication, setNewApplication] = useState<Application>({
    id: 0,
    title: "",
    company: "",
    status: "Application Sent",
    jobType: "Internship",
    location: "",
    submittedDate: "",
    description: "",
    userId: 0,
    resumeId: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      const header = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      }
      const response = await fetch("http://127.0.0.1:8000/api/applications/",
        {
          method: "GET",
          headers: header,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const normalized: Application[] = [];
        // Modify the data to match the Experience type
        data.map((entry: any) => {
          const obj: Application = {
            id: entry.id,
            title: entry.job_title,
            company: entry.company,
            status: entry.status,
            jobType: entry.job_type,
            location: entry.location,
            submittedDate: entry.submitted_date,
            description: entry.description,
            userId: entry.user,
            resumeId: entry.resume_id,
          }
          normalized.push(obj);
        });
        // console.log(data)
        setApplications(normalized);
      } else {
        alert("Failed to fetch experiences.");
      }
    }

    if (applications.length < 1) {
      // Fetch experiences from the API
      fetchApplications()
    }
  }, []);

  const handleAddApplication = () => {
    setIsModalOpen(true);
    setEditingId(null);
    setNewApplication({
      id: 0,
      title: "",
      company: "",
      status: "Application Sent",
      jobType: "Internship",
      location: "",
      submittedDate: "",
      description: "",
      userId: 0,
      resumeId: null,
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

  const APIEditApplication = async (id: number) => {
    const header = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    }
    const payload = {
      job_title: newApplication.title,
      company: newApplication.company,
      status: newApplication.status,
      job_type: newApplication.jobType,
      location: newApplication.location,
      submitted_date: newApplication.submittedDate,
      description: newApplication.description,
      user: Cookies.get("userId"),
      resume_id: null,
    }
    const response = await fetch(`http://127.0.0.1:8000/api/update-application/${id}/`, {
      method: "PUT",
      headers: header,
      body: JSON.stringify(payload),
    }
    );

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      alert("Failed to save application.");
      console.log(data)
      return null;
    }
  }

  const handleSaveApplication = async () => {
    if (!newApplication.title || !newApplication.company || !newApplication.location || !newApplication.submittedDate) {
      alert("Please fill in all required fields.");
      return;
    }

    if (editingId !== null) {
      const response = await APIEditApplication(editingId);
      if (!response) {
        return;
      }
      const updatedApplications = applications.map((app) =>
        app.id === editingId ? newApplication : app
      );
      setApplications(updatedApplications);
    } else {
      const response = await APISaveApplication();

      if (!response) {
        return;
      }

      const newApp: Application = {
        id: response.id,
        title: response.job_title,
        company: response.company,
        status: response.status,
        jobType: response.job_type,
        location: response.location,
        submittedDate: new Date(response.submitted_date).toISOString().split("T")[0],
        description: response.description,
        userId: response.user,
        resumeId: response.resume_id ?? null,
      };

      setApplications([...applications, newApp]);
    }

    setIsModalOpen(false);
  };

  const APISaveApplication = async () => {
    const header = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    }
    const payload = {
      job_title: newApplication.title,
      company: newApplication.company,
      status: newApplication.status,
      job_type: newApplication.jobType,
      location: newApplication.location,
      submitted_date: newApplication.submittedDate,
      description: newApplication.description,
      user: Cookies.get("userId"),
      resume_id: null,
    }
    const response = await fetch("http://127.0.0.1:8000/api/create-application/", {
      method: "POST",
      headers: header,
      body: JSON.stringify(payload),
    }
    );

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      alert("Failed to save application.");
      console.log(data)
      return null;
    }
  }

  const handleDeleteApplication = async (id: number) => {
    const response = await APIDeleteApplication(id);
    if (!response) {
      return;
    }
    const updatedApplications = applications.filter((app) => app.id !== id);
    setApplications(updatedApplications);
  };

  const APIDeleteApplication = async (id: number) => {
    const header = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    }
    const response = await fetch(`http://127.0.0.1:8000/api/delete-application/${id}/`, { headers: header, method: "DELETE" });

    if (response.ok) {
      return true;
    } else {
      alert("Failed to delete application.");
      const data = await response.json();
      console.log(data)
      return null;
    }
  }

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

  if (!applications) { <p>Loading</p> }

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
              <td>{app.title}</td>
              <td>{app.company}</td>
              <td>{app.location}</td>
              <td>{app.submittedDate.toLocaleDateString}</td>
              <td>{app.status}</td>
              <td>{app.description}</td>
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
            <input type="text" value={newApplication.title} onChange={(e) => setNewApplication({ ...newApplication, title: e.target.value })} />
            <label>Company:</label>
            <input type="text" value={newApplication.company} onChange={(e) => setNewApplication({ ...newApplication, company: e.target.value })} />
            <label>Location:</label>
            <input type="text" value={newApplication.location} onChange={(e) => setNewApplication({ ...newApplication, location: e.target.value })} />
            <label>Date Submitted:</label>
            <input type="date" value={newApplication.submittedDate} onChange={(e) => setNewApplication({ ...newApplication, submittedDate: e.target.value })} />
            <label>Status:</label>
            <select
              value={newApplication.status}
              onChange={(e) =>
                setNewApplication({
                  ...newApplication,
                  status: e.target.value as "Application Sent" | "Interview" | "Offer" | "Application Rejected" | "Response",
                })
              }
            >
              <option value="Application Sent">Applied</option>
              <option value="Application Rejected">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Interview">Rejected</option>
              <option value="Response">Response</option>
            </select>
            <label>Notes:</label>
            <textarea value={newApplication.description} onChange={(e) => setNewApplication({ ...newApplication, description: e.target.value })}></textarea>
            <button onClick={handleSaveApplication}>Save</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationTracker;