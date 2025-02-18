import React, { useState, useEffect } from "react";
import "../css/JobFinder.css";

type JobEntry = {
  id: number;
  title: string;
  company: string;
  location: string;
  experience: string;
  jobType: string;
};

const JobFinder: React.FC = () => {
  const [filters, setFilters] = useState({
    title: "",
    location: "",
    experience: "",
    jobType: "",
  });

  const [jobs, setJobs] = useState<JobEntry[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobEntry[]>([]);

  // Initialize jobs and filteredJobs
  useEffect(() => {
    if (jobs.length === 0) {
      setJobs([]);
      setFilteredJobs([]);
    }
  }, []);

  
  useEffect(() => {
    const filtered = jobs.filter((job) => {
      return Object.keys(filters).every((key) => {
        const filterValue = filters[key as keyof typeof filters];
        const jobValue = job[key as keyof JobEntry];
        return !filterValue || String(jobValue).toLowerCase().includes(String(filterValue).toLowerCase());
      });
    });
    setFilteredJobs(filtered);
  }, [filters, jobs]);


  const handleApply = (id: number) => {
    alert(`Apply for job with ID: ${id}`);
  };

  return (
    <div className="job-finder">
      <h1>Find Your Next Job</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Job Title"
          value={filters.title}
          style={{ color: filters.experience ? "#333" : "#777" }}
          onChange={(e) => setFilters({ ...filters, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          style={{ color: filters.experience ? "#333" : "#777" }}
        />
        <select
          value={filters.experience}
          onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
          style={{ color: filters.experience ? "#333" : "#777" }}
        >
          <option value="">Experience Level</option>
          <option value="Entry-Level">Entry-Level</option>
          <option value="Mid-Level">Mid-Level</option>
          <option value="Senior">Senior</option>
        </select>
        <select
          value={filters.jobType}
          onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
          style={{ color: filters.experience ? "#333" : "#777" }}
        >
          <option value="">Job Type</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Contract">Contract</option>
          <option value="Remote">Remote</option>
        </select>
      </div>

      <div className="job-list">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <h2>{job.title}</h2>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Experience:</strong> {job.experience}</p>
              <p><strong>Type:</strong> {job.jobType}</p>
              <button onClick={() => handleApply(job.id)}>Apply Now</button>
            </div>
          ))
        ) : (
          <p className="no-jobs">No jobs found. Try adjusting your filters.</p>
        )}
      </div>
    </div>
  );
};

export default JobFinder;