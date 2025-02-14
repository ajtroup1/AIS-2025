import React, { useState, useEffect } from "react";
import "../css/JobFinder.css";

// Define the type for a job entry
type JobEntry = {
  id: number;
  title: string;
  company: string;
  location: string;
  experience: string;
  jobType: string;
};

const JobFinder: React.FC = () => {
  // State to manage filter inputs
  const [filters, setFilters] = useState({
    title: "",
    location: "",
    experience: "",
    jobType: "",
  });

  // State to manage the list of jobs (initially empty, to be populated via API)
  const [jobs, setJobs] = useState<JobEntry[]>([]);

  // State to manage filtered jobs
  const [filteredJobs, setFilteredJobs] = useState<JobEntry[]>([]);

  // Fetch jobs from the API (replace with actual API call)
  useEffect(() => {
    // Example: Fetch jobs from an API
    // fetch("/api/jobs")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setJobs(data);
    //     setFilteredJobs(data);
    //   })
    //   .catch((error) => console.error("Error fetching jobs:", error));

    // For now, set jobs to an empty array
    setJobs([]);
    setFilteredJobs([]);
  }, []);

  // Update filtered jobs whenever filters or jobs change
  useEffect(() => {
    const filtered = [];
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      let includeJob = true;

      for (const key in filters) {
        const filterValue = filters[key as keyof typeof filters];
        const jobValue = job[key as keyof JobEntry];

        if (filterValue && !String(jobValue).toLowerCase().includes(String(filterValue).toLowerCase())) {
          includeJob = false;
          break;
        }
      }

      if (includeJob) {
        filtered.push(job);
      }
    }
    setFilteredJobs(filtered);
  }, [filters, jobs]);

  // Function to handle applying for a job (replace with actual logic)
  const handleApply = (id: number) => {
    alert(`Apply for job with ID: ${id}`);
  };

  return (
    <div className="job-finder">
      <h1>Find Your Next Job</h1>

      {/* Filter Inputs */}
      <div className="filters">
        <input
          type="text"
          placeholder="Job Title"
          value={filters.title}
          onChange={(e) => setFilters({ ...filters, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <select
          value={filters.experience}
          onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
        >
          <option value="">Experience Level</option>
          <option value="Entry-Level">Entry-Level</option>
          <option value="Mid-Level">Mid-Level</option>
          <option value="Senior">Senior</option>
        </select>
        <select
          value={filters.jobType}
          onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
        >
          <option value="">Job Type</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Contract">Contract</option>
          <option value="Remote">Remote</option>
        </select>
      </div>

      {/* Job Listings */}
      <div className="job-list">
        {filteredJobs.length > 0 ? (
          (() => {
            const jobCards = [];
            for (let i = 0; i < filteredJobs.length; i++) {
              const job = filteredJobs[i];
              jobCards.push(
                <div key={job.id} className="job-card">
                  <h2>{job.title}</h2>
                  <p><strong>Company:</strong> {job.company}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Experience:</strong> {job.experience}</p>
                  <p><strong>Type:</strong> {job.jobType}</p>
                  <button onClick={() => handleApply(job.id)}>Apply Now</button>
                </div>
              );
            }
            return jobCards;
          })()
        ) : (
          <p className="no-jobs">No jobs found. Try adjusting your filters.</p>
        )}
      </div>
    </div>
  );
};

export default JobFinder;