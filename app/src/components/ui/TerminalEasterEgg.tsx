import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import cvData from '../../../cv.json';

interface TerminalLine {
  type: 'input' | 'output' | 'error';
  content: string;
}

const PROMPT = '~/cv $ ';

function buildCommands(lang: string) {
  const t = (fr: string, en: string) => (lang.startsWith('en') ? en : fr);

  return {
    whoami: () => [
      `${cvData.basics.firstName} ${cvData.basics.lastName}`,
      t(
        cvData.basics.headline,
        (cvData.basics as unknown as Record<string, string>).headline_en ?? cvData.basics.headline
      ),
      `📍 ${cvData.basics.location}`,
    ],
    help: () => [
      t('Commandes disponibles :', 'Available commands:'),
      '  whoami       — ' + t('identité', 'identity'),
      '  git log      — ' + t('expériences', 'experiences'),
      '  ls projects  — ' + t('projets', 'projects'),
      '  cat cv.json  — ' + t('données brutes du CV', 'raw CV data'),
      '  skills       — ' + t('compétences techniques', 'tech skills'),
      '  contact      — ' + t('me contacter', 'contact me'),
      '  clear        — ' + t('effacer', 'clear'),
      '  exit         — ' + t('fermer', 'close'),
    ],
    'git log': () =>
      cvData.experience.flatMap((e) => {
        const title = lang.startsWith('en') ? (e.title_en ?? e.title) : e.title;
        const end = e.endYear ? `${e.endYear}` : t("aujourd'hui", 'present');
        return [
          `\x1b[33mcommit ${Array.from({ length: 7 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}\x1b[0m`,
          `Author: ${cvData.basics.firstName} ${cvData.basics.lastName}`,
          `Date:   ${e.startYear}–${end}`,
          ``,
          `    ${title} @ ${e.company}`,
          ``,
        ];
      }),
    'ls projects': () =>
      cvData.projects.map((p) => {
        const title = lang.startsWith('en') ? (p.title_en ?? p.title) : p.title;
        return `  ${title.padEnd(36)} ${p.technologies.slice(0, 3).join(', ')}`;
      }),
    'cat cv.json': () => [JSON.stringify({ basics: cvData.basics, metrics: cvData.metrics }, null, 2)],
    skills: () => {
      const byCategory = cvData.skills.reduce<Record<string, string[]>>((acc, s) => {
        const cat = s.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(s.name);
        return acc;
      }, {});
      return Object.entries(byCategory).flatMap(([cat, names]) => [
        `\x1b[36m${cat.toUpperCase()}\x1b[0m`,
        `  ${names.join('  ')}`,
      ]);
    },
    contact: () => [
      t('📬 Ouvrez le formulaire de contact ou écrivez directement :', '📬 Open the contact form or write directly:'),
      `  LinkedIn: ${cvData.basics.linkedinUrl}`,
      `  GitHub:   ${(cvData.basics as unknown as Record<string, string>).githubUrl ?? ''}`,
    ],
  };
}

export function TerminalEasterEgg() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();

  const commands = buildCommands(i18n.language);

  // Open on backtick
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      if (lines.length === 0) {
        setLines([
          { type: 'output', content: `Welcome to ${cvData.basics.firstName}'s terminal 👋` },
          { type: 'output', content: 'Type \x1b[36mhelp\x1b[0m to see available commands.' },
          { type: 'output', content: 'Press \x1b[33m`\x1b[0m or \x1b[33mEsc\x1b[0m to close.' },
          { type: 'output', content: '' },
        ]);
      }
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const runCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      if (!cmd) return;

      setLines((prev) => [...prev, { type: 'input', content: PROMPT + cmd }]);
      setHistory((h) => [cmd, ...h]);
      setHistIdx(-1);

      if (cmd === 'clear') {
        setLines([]);
        return;
      }
      if (cmd === 'exit') {
        setOpen(false);
        return;
      }

      const handler = commands[cmd as keyof typeof commands];
      if (handler) {
        const output = handler();
        setLines((prev) => [
          ...prev,
          ...output.map((l) => ({ type: 'output' as const, content: l })),
          { type: 'output', content: '' },
        ]);
      } else {
        setLines((prev) => [
          ...prev,
          { type: 'error', content: `command not found: ${cmd}. Type \x1b[36mhelp\x1b[0m.` },
          { type: 'output', content: '' },
        ]);
      }
    },
    [commands]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? '' : (history[idx] ?? ''));
    }
  };

  // Render ANSI-like color codes minimally
  function renderLine(content: string) {
    // Using dynamic RegExp to avoid no-control-regex linting for ESC (\x1b)
    const esc = '\x1b';
    return content
      .replace(new RegExp(`${esc}\\[33m(.*?)${esc}\\[0m`, 'g'), '<span style="color:#f59e0b">$1</span>')
      .replace(new RegExp(`${esc}\\[36m(.*?)${esc}\\[0m`, 'g'), '<span style="color:#06b6d4">$1</span>');
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="terminal"
          role="dialog"
          aria-label="Terminal"
          aria-modal="true"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        >
          {/* Title bar */}
          <div className="terminal__bar">
            <button
              className="terminal__dot terminal__dot--red"
              onClick={() => setOpen(false)}
              aria-label="Close terminal"
            />
            <button className="terminal__dot terminal__dot--yellow" aria-label="Minimize (decorative)" tabIndex={-1} />
            <button className="terminal__dot terminal__dot--green" aria-label="Maximize (decorative)" tabIndex={-1} />
            <span className="terminal__title">bash — ~/cv</span>
          </div>

          {/* Output */}
          <div className="terminal__output" aria-live="polite" aria-atomic="false">
            {lines.map((line, i) => (
              <div
                key={i}
                className={`terminal__line terminal__line--${line.type}`}
                dangerouslySetInnerHTML={{ __html: renderLine(line.content) || '&nbsp;' }}
              />
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="terminal__input-row">
            <span className="terminal__prompt" aria-hidden="true">
              {PROMPT}
            </span>
            <input
              ref={inputRef}
              className="terminal__input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
              aria-label="Terminal input"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
