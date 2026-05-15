export interface Position {
  title: string;
  company: string;
  location: string;
  startDate: { month: number; year: number };
  endDate?: { month: number; year: number };
  description: string;
  technologies?: string[];
}

export interface Education {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
}

export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  headline: string;
  summary: string;
  photoUrl: string;
  location: string;
  profileUrl: string;
  githubUrl?: string;
  email?: string;
  positions: Position[];
  educations: Education[];
  skills: string[];
}
