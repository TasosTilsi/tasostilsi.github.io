export interface ExperienceEntry {
  isTechRelated: boolean;
  duration: string;
  location: string;
  responsibilities?: string[];
  title: string;
  company: string;
}

export interface EducationEntry {
  duration: string;
  location: string;
  specialization?: string;
  courses?: string[] | { [key: string]: string[] };
  degree: string;
  institution: string;
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
  date: string;
  link?: string | null;
}

export interface Article {
  name: string;
  platform: string;
  summary: string;
  link: string;
  date: string;
}

export interface Presentation {
  name: string;
  description: string;
  framework: string;
  link: string;
  sourceUrl?: string;
  date: string;
}

export interface PortfolioData {
  meta: {
    charset: string;
    viewport: string;
    description: string;
    keywords: string;
    author: string;
  };
  about: {
    name: string;
    title: string;
    location: string;
    dob: string;
    email: string;
    description: string;
    contact: {
      email: string;
      linkedin: string;
      github: string;
      medium: string;
      facebook: string;
      instagram: string;
      twitter: string;
      twitch: string;
    };
    profileImageUrl: string;
  };
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: {
    soft_skills: string[];
    hard_skills: {
      [category: string]: string[];
    };
    languages: string[];
  };
  interests: string[];
  favorite_games: {
    simulation_games: string[];
    strategy_games: string[];
    single_player_games: string[];
    racing_games: string[];
  };
  projects: Project[];
  certifications: Certification[];
  presentations: Presentation[];
  articles: Article[];
}