export interface ExperienceEntry {
  isTechRelated: boolean;
  duration: ReactNode;
  location: string;
  responsibilities?: string[];
  title: string;
  company: string;
}

export interface EducationEntry {
  duration: ReactNode;
  location: any;
  specialization?: any;
  courses?: string[] | { [key: string]: string[] };
  degree: string;
  major?: string;
  institution: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface Project {
  name: string;
  description: string;
  date?: string;
  link?: string;
  sourceUrl?: string;
}

export interface Certification {
  name: string;
  issuingBody?: string;
  date: string;
  link?: string | null;
}

export interface Article {
  name: ReactNode;
  platform: ReactNode;
  summary: any;
  title?: string;
  link: string;
  date: string;
  description?: string;
}

export interface PortfolioData {
  about: {
    name: string;
    title: string;
    description: string;
    contact: {
      email: string;
      phone?: string;
      linkedin?: string;
      github?: string;
      twitter?: string;
      website?: string;
    };
  };
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    databases: string[];
    platforms: string[];
  };
  projects: Project[];
  articles: Article[];
  interests: string[];
  certifications: Certification[];
}