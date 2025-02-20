// THIS IS WHERE ALL DATA STRUCTURES IN THE APP WILL BE DEFINED

type User = {
  id: number;
  username: string;
  email: string;
  password: string;
}

type Experience = {
  id: number;
  title: string;
  company: string;
  jobType: "Internship" | "Co-op" | "Full-Time" | "Part-Time" | "Program";
  fromDate: string;
  toDate: string;
  location: string;
  desription: string;
  userId: number;
  user?: User;
}

type Application = {
  id: number;
  title: string;
  company: string;
  status: "Application Sent" | "Interview" | "Offer" | "Application Rejected" | "Response";
  jobType: "Internship" | "Co-op" | "Full-Time" | "Part-Time" | "Program";
  location: string;
  submittedDate: DateTime;
  description: string;
  userId?: number;
  resumeId?: number | null;
  user?: User;
}