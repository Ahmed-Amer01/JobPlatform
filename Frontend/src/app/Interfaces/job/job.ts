export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  employmentType: string;
  skills: string[];
  requirements: string;
  postedBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  views: number;
  createdAt: string;
}