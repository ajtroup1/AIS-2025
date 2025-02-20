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