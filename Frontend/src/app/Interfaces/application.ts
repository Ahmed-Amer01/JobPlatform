export interface Application {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    company: string;
    location: string;
    employmentType: string;
  };
  candidateId: string;
  resumeUrl: string;
  coverLetter: string;
}
