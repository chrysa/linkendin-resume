import type { Translations } from './types';

const fr: Translations = {
  nav: {
    impact: 'Impact',
    experiences: 'Expériences',
    stack: 'Stack',
    projects: 'Projets',
    education: 'Formation',
    contact: 'Contact',
  },
  hero: {
    greeting: 'Bonjour, je suis',
  },
  sections: {
    impact: {
      label: 'En chiffres',
      title: "L'impact, pas les titres.",
    },
    experience: {
      label: 'Parcours',
      title: "Ce que j'ai construit.",
      present: "aujourd'hui",
    },
    skills: {
      label: 'Stack technique',
      title: 'Mon arsenal.',
      filters: {
        all: 'Tout',
        frontend: 'Frontend',
        backend: 'Backend',
        devops: 'DevOps',
        tools: 'Outils',
        soft: 'Soft skills',
      },
      hint: 'Survolez une compétence pour voir les projets associés',
      levels: ['', 'Découverte', 'Familier', 'Opérationnel', 'Avancé', 'Expert'],
    },
    projects: {
      label: 'Projets',
      title: 'Concret, livré, utilisé.',
    },
    education: {
      label: 'Formation',
      title: 'Les bases solides.',
    },
    contact: {
      label: 'On travaille ensemble ?',
      titleLine1: 'Une idée ? Un projet ?',
      titleLine2: 'Parlons-en.',
      sub: 'Je réponds à chaque message. Votre demande ouvre une conversation GitHub — traçable et transparente.',
      cta: 'Ouvrir une conversation',
      linkedin: 'Profil LinkedIn',
    },
  },
  modal: {
    title: 'Parlons-en.',
    tabGithub: 'Via GitHub',
    tabWhatsapp: 'Via WhatsApp',
    subtitleGithub: 'Votre message ouvrira une conversation GitHub — traçable et transparente.',
    subtitleWhatsapp: 'Message direct sur WhatsApp — réponse rapide garantie.',
    name: { label: 'Votre nom', placeholder: 'Jean Dupont' },
    subject: { label: 'Sujet', placeholder: 'Proposition de mission freelance' },
    message: { label: 'Message', placeholder: 'Décrivez votre projet ou votre demande...' },
    submit: 'Envoyer le message',
    sending: 'Préparation...',
    whatsappCta: 'Ouvrir WhatsApp',
    success: {
      title: 'Prêt à envoyer !',
      body: "Votre message a été préparé. Cliquez ci-dessous pour l'envoyer via GitHub (connexion GitHub requise).",
      open: 'Ouvrir sur GitHub',
      back: 'Retour',
    },
  },
  footer: {
    madeWith: 'Fait avec React &',
    source: 'Source',
  },
  theme: {
    switchToDark: 'Thème sombre',
    switchToLight: 'Thème clair',
  },
};

export default fr;
