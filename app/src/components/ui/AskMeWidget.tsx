import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import cvData from '../../../cv.json';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Simple rule-based responder using cv.json as knowledge base
function buildAnswer(question: string, lang: string): string {
  const q = question.toLowerCase();
  const t = (fr: string, en: string) => (lang.startsWith('en') ? en : fr);

  // Experience questions
  if (/expérience|experience|travail|work|job|career|parcours|années|years/.test(q)) {
    const companies = cvData.experience.map((e) => `${e.company} (${e.startYear})`).join(', ');
    return t(
      `J'ai ${cvData.experience.length} expériences professionnelles : ${companies}.`,
      `I have ${cvData.experience.length} professional experiences: ${companies}.`
    );
  }

  // Skills
  if (/skill|compétence|tech|stack|langage|language|python|django|react|kubernetes|docker/.test(q)) {
    const top = cvData.skills
      .filter((s) => s.level >= 4)
      .map((s) => s.name)
      .join(', ');
    return t(
      `Mes compétences principales (niveau avancé/expert) : ${top}.`,
      `My core skills (advanced/expert level): ${top}.`
    );
  }

  // Projects
  if (/projet|project|portfolio|github|open source/.test(q)) {
    const titles = cvData.projects.map((p) => p.title).join(', ');
    return t(
      `Mes projets mis en avant : ${titles}. Retrouvez-les sur GitHub !`,
      `My highlighted projects: ${titles}. Find them on GitHub!`
    );
  }

  // Availability
  if (/disponible|available|freelance|cdi|mission|hire|recruter|recruit/.test(q)) {
    const a = cvData.basics.availability;
    return t(
      `${a.label} — ${a.type}. Utilisez le formulaire de contact pour me contacter.`,
      `${a.label_en} — ${a.type}. Use the contact form to reach out.`
    );
  }

  // Location
  if (/location|lieu|ville|city|where|où/.test(q)) {
    return t(`Je suis basé à ${cvData.basics.location}.`, `I'm based in ${cvData.basics.location}.`);
  }

  // Education
  if (/formation|école|school|education|étude|study|42/.test(q)) {
    const ed = cvData.education[0];
    return t(
      `Formation à ${ed.school} (${ed.startYear}–${ed.endYear}) — ${ed.fieldOfStudy}.`,
      `Studied at ${ed.school} (${ed.startYear}–${ed.endYear}) — ${ed.fieldOfStudy_en}.`
    );
  }

  // Contact
  if (/contact|email|message|écrire|write|reach/.test(q)) {
    return t(
      `Utilisez le bouton "Contact" en haut de la page pour m'envoyer un message via GitHub Issues.`,
      `Use the "Contact" button at the top of the page to send me a message via GitHub Issues.`
    );
  }

  // Default
  return t(
    `Je suis ${cvData.basics.firstName} ${cvData.basics.lastName}, ${cvData.basics.headline}. Posez-moi une question sur mon parcours, mes compétences ou mes projets !`,
    `I'm ${cvData.basics.firstName} ${cvData.basics.lastName}, ${(cvData.basics as unknown as Record<string, string>).headline_en ?? cvData.basics.headline}. Ask me about my experience, skills, or projects!`
  );
}

export function AskMeWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: i18n.language.startsWith('en')
            ? `Hi! I'm Anthony's CV assistant. Ask me anything about his experience, skills, or availability! 👋`
            : `Bonjour ! Je suis l'assistant CV d'Anthony. Posez-moi vos questions sur son parcours, ses compétences ou sa disponibilité ! 👋`,
        },
      ]);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((m) => [...m, { role: 'user', content: trimmed }]);
    setInput('');
    setTyping(true);

    // Simulate a short thinking delay
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

    const answer = buildAnswer(trimmed, i18n.language);
    setMessages((m) => [...m, { role: 'assistant', content: answer }]);
    setTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Trigger */}
      <motion.button
        className="askme-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('askme.label')}
        aria-expanded={open}
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        data-hover="true"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.i
              key="close"
              className="bi bi-x-lg"
              aria-hidden="true"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
          ) : (
            <motion.i
              key="chat"
              className="bi bi-stars"
              aria-hidden="true"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="askme-panel"
            role="dialog"
            aria-label={t('askme.label')}
            aria-modal="false"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            <div className="askme-panel__header">
              <span className="askme-panel__title">
                <i className="bi bi-stars" aria-hidden="true" /> {t('askme.label')}
              </span>
              <button
                className="askme-panel__close"
                onClick={() => setOpen(false)}
                aria-label={t('a11y.close')}
                type="button"
              >
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </div>

            <div className="askme-panel__messages" aria-live="polite" aria-atomic="false">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`askme-msg askme-msg--${msg.role}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {msg.content}
                </motion.div>
              ))}
              {typing && (
                <div className="askme-msg askme-msg--assistant askme-msg--typing" aria-label={t('askme.typing')}>
                  <span />
                  <span />
                  <span />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="askme-panel__input-row">
              <input
                ref={inputRef}
                className="askme-panel__input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('askme.placeholder')}
                aria-label={t('askme.placeholder')}
                disabled={typing}
              />
              <button
                type="button"
                className="askme-panel__send"
                onClick={send}
                disabled={!input.trim() || typing}
                aria-label={t('askme.send')}
                data-hover="true"
              >
                <i className="bi bi-send-fill" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
