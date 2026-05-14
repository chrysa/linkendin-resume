import type { Translations } from './types';

const en: Translations = {
  nav: {
    impact: 'Impact',
    experiences: 'Experience',
    stack: 'Stack',
    projects: 'Projects',
    education: 'Education',
    contact: 'Contact',
    ariaLabel: 'Main navigation',
  },
  hero: {
    greeting: 'Hi, I am',
    photoAlt: 'Profile picture of {{firstName}} {{lastName}}',
    newTab: 'opens in new tab',
  },
  sections: {
    impact: {
      label: 'By the numbers',
      title: 'Impact, not just titles.',
      ariaMetrics: 'Career key metrics',
    },
    experience: {
      label: 'Career',
      title: "What I've built.",
      present: 'present',
      ariaTimeline: 'Professional experience timeline',
    },
    skills: {
      label: 'Tech stack',
      title: 'My arsenal.',
      filters: {
        all: 'All',
        frontend: 'Frontend',
        backend: 'Backend',
        devops: 'DevOps',
        tools: 'Tools',
        soft: 'Soft skills',
      },
      hint: 'Hover a skill to see where I used it',
      levels: ['', 'Learning', 'Familiar', 'Proficient', 'Advanced', 'Expert'],
      ariaCloud: 'Technical skills list',
      ariaSkillsFilter: 'Filter skills by category',
    },
    projects: {
      label: 'Projects',
      title: 'Shipped and used.',
      githubLink: 'View {{title}} on GitHub (new tab)',
      demoLink: 'View {{title}} demo (new tab)',
    },
    education: {
      label: 'Education',
      title: 'Strong foundations.',
    },
    contact: {
      label: 'Work together?',
      titleLine1: 'A project in mind?',
      titleLine2: "Let's talk.",
      sub: 'I reply to every message. Your request opens a GitHub conversation — trackable and transparent.',
      cta: 'Start a conversation',
      linkedin: 'LinkedIn profile',
    },
  },
  modal: {
    title: "Let's talk.",
    tabGithub: 'Via GitHub',
    tabWhatsapp: 'Via WhatsApp',
    subtitleGithub: 'Your message will open a GitHub Issue — trackable and transparent.',
    subtitleWhatsapp: 'Direct WhatsApp message — fast reply guaranteed.',
    name: { label: 'Your name', placeholder: 'Jane Doe' },
    subject: { label: 'Subject', placeholder: 'Freelance project proposal' },
    message: { label: 'Message', placeholder: 'Tell me about your project...' },
    submit: 'Send message',
    sending: 'Preparing...',
    whatsappCta: 'Open WhatsApp',
    success: {
      title: 'Ready to send!',
      body: 'Your message is ready. Click below to send it via GitHub (GitHub login required).',
      open: 'Open on GitHub',
      back: 'Back',
    },
  },
  footer: {
    madeWith: 'Built with React &',
    source: 'Source',
  },
  theme: {
    switchToDark: 'Dark mode',
    switchToLight: 'Light mode',
  },
};

export default en;
