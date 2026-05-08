export interface Translations {
  nav: {
    impact: string;
    experiences: string;
    stack: string;
    projects: string;
    education: string;
    contact: string;
  };
  hero: {
    greeting: string;
  };
  sections: {
    impact: { label: string; title: string };
    experience: { label: string; title: string; present: string };
    skills: {
      label: string;
      title: string;
      filters: {
        all: string;
        frontend: string;
        backend: string;
        devops: string;
        tools: string;
        soft: string;
      };
      hint: string;
      levels: string[];
    };
    projects: { label: string; title: string };
    education: { label: string; title: string };
    contact: {
      label: string;
      titleLine1: string;
      titleLine2: string;
      sub: string;
      cta: string;
      linkedin: string;
    };
  };
  modal: {
    title: string;
    tabGithub: string;
    tabWhatsapp: string;
    subtitleGithub: string;
    subtitleWhatsapp: string;
    name: { label: string; placeholder: string };
    subject: { label: string; placeholder: string };
    message: { label: string; placeholder: string };
    submit: string;
    sending: string;
    whatsappCta: string;
    success: { title: string; body: string; open: string; back: string };
  };
  footer: { madeWith: string; source: string };
  theme: { switchToDark: string; switchToLight: string };
}
