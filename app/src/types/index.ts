export type { LinkedInProfile, Position, Education } from './linkedin';
export type { ContactFormData, GitHubIssuePayload } from './github';

export interface MetricItem {
  value: string;
  label: string;
  sublabel?: string;
}

export interface Project {
  title: string;
  description: string;
  url?: string;
  githubUrl?: string;
  technologies: string[];
  impact?: string;
  stars?: number;
}

export interface Skill {
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  category: 'frontend' | 'backend' | 'devops' | 'tools' | 'soft';
}

export interface NavItem {
  label: string;
  href: string;
}
