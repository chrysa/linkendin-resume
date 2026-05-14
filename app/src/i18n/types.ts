export interface Translations {
  nav: {
    impact: string;
    experiences: string;
    stack: string;
    projects: string;
    education: string;
    contact: string;
    ariaLabel: string;
  };
  hero: {
    greeting: string;
    photoAlt: string;
    newTab: string;
  };
  sections: {
    impact: { label: string; title: string; ariaMetrics: string };
    experience: { label: string; title: string; present: string; ariaTimeline: string };
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
      ariaCloud: string;
      ariaSkillsFilter: string;
    };
    projects: {
      label: string;
      title: string;
      githubLink: string;
      demoLink: string;
      liveTitle: string;
      contributionGraph: string;
    };
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
  a11y: {
    panelLabel: string;
    close: string;
    fontSize: string;
    increaseFontSize: string;
    decreaseFontSize: string;
    highContrast: string;
    dyslexiaFont: string;
    reducedMotion: string;
    reset: string;
  };
  palette: {
    label: string;
    placeholder: string;
    noResults: string;
    navigate: string;
    select: string;
    close: string;
    groupNav: string;
    groupActions: string;
    groupAppearance: string;
    print: string;
  };
  askme: {
    label: string;
    placeholder: string;
    send: string;
    typing: string;
  };
}
