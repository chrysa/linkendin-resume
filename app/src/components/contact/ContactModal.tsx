import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { ContactFormData } from '@/types/github';
import { GITHUB_CONFIG, CONTACT_CONFIG } from '@/data/profile';

const schema = z.object({
  senderName: z.string().min(2, 'Minimum 2 caractères').max(100),
  subject: z.string().min(5, 'Minimum 5 caractères').max(150),
  message: z.string().min(20, 'Minimum 20 caractères').max(2000),
});

type FormErrors = Partial<Record<keyof ContactFormData, string>>;

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Status = 'idle' | 'loading' | 'success' | 'error';
type Tab = 'github' | 'whatsapp';

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr';
  const hasWhatsapp = Boolean(CONTACT_CONFIG.whatsapp);
  const [tab, setTab] = useState<Tab>('github');
  const [form, setForm] = useState<ContactFormData>({
    senderName: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [issueUrl, setIssueUrl] = useState<string | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus piège + fermeture clavier
  useEffect(() => {
    if (!isOpen) return;
    firstInputRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const validate = (): boolean => {
    const result = schema.safeParse(form);
    if (result.success) {
      setErrors({});
      return true;
    }
    const errs: FormErrors = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof ContactFormData;
      errs[field] = issue.message;
    });
    setErrors(errs);
    return false;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Efface l'erreur du champ en cours de saisie
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');

    const title = encodeURIComponent('[Contact] ' + form.subject);
    const body = encodeURIComponent('**De :** ' + form.senderName + '\n\n' + form.message + '\n\n---\n*CV en ligne*');
    const url =
      'https://github.com/' +
      GITHUB_CONFIG.owner +
      '/' +
      GITHUB_CONFIG.repo +
      '/issues/new?title=' +
      title +
      '&body=' +
      body +
      '&labels=contact';

    await new Promise((r) => setTimeout(r, 800));

    setIssueUrl(url);
    setStatus('success');
  };

  const handleClose = () => {
    onClose();
    // Reset avec délai pour laisser l'animation se terminer
    setTimeout(() => {
      setForm({ senderName: '', subject: '', message: '' });
      setErrors({});
      setStatus('idle');
      setIssueUrl(null);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal wrapper (full-screen flex container) */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Box animée */}
            <motion.div
              className="modal__box"
              initial={{ y: 40, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 40, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            >
              <button className="modal__close" onClick={handleClose} aria-label="Fermer">
                <i className="bi bi-x-lg" />
              </button>

              {status === 'success' && issueUrl ? (
                <motion.div
                  className="modal__success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="modal__success-icon">🎉</div>
                  <h3>{t('modal.success.title')}</h3>
                  <p>{t('modal.success.body')}</p>
                  <a href={issueUrl} target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--lg">
                    <i className="bi bi-github" />
                    {t('modal.success.open')}
                  </a>
                  <button className="modal__success-back" onClick={handleClose}>
                    {t('modal.success.back')}
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="modal__header">
                    <h2 id="modal-title" className="modal__title">
                      <span className="gradient-text">{t('modal.title')}</span>
                    </h2>
                    {hasWhatsapp && (
                      <div className="modal__tabs">
                        <button
                          className={'modal__tab' + (tab === 'github' ? ' modal__tab--active' : '')}
                          onClick={() => setTab('github')}
                        >
                          <i className="bi bi-github" /> {t('modal.tabGithub')}
                        </button>
                        <button
                          className={'modal__tab' + (tab === 'whatsapp' ? ' modal__tab--active' : '')}
                          onClick={() => setTab('whatsapp')}
                        >
                          <i className="bi bi-whatsapp" /> {t('modal.tabWhatsapp')}
                        </button>
                      </div>
                    )}
                    <p className="modal__subtitle">
                      {t(tab === 'whatsapp' ? 'modal.subtitleWhatsapp' : 'modal.subtitleGithub')}
                    </p>
                  </div>

                  {tab === 'whatsapp' ? (
                    <div className="modal__whatsapp">
                      <a
                        href={
                          'https://wa.me/' +
                          CONTACT_CONFIG.whatsapp.replace(/\D/g, '') +
                          '?text=' +
                          encodeURIComponent(CONTACT_CONFIG.whatsappPrefill(lang))
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--primary btn--lg btn--whatsapp"
                      >
                        <i className="bi bi-whatsapp" /> {t('modal.whatsappCta')}
                      </a>
                    </div>
                  ) : (
                    <form className="modal__form" onSubmit={handleSubmit} noValidate>
                      <div className="form-field">
                        <label className="form-field__label" htmlFor="senderName">
                          {t('modal.name.label')}
                        </label>
                        <input
                          ref={firstInputRef}
                          id="senderName"
                          name="senderName"
                          type="text"
                          className={'form-field__input' + (errors.senderName ? ' form-field__input--error' : '')}
                          placeholder={t('modal.name.placeholder')}
                          value={form.senderName}
                          onChange={handleChange}
                          autoComplete="name"
                        />
                        {errors.senderName && <span className="form-field__error">{errors.senderName}</span>}
                      </div>

                      <div className="form-field">
                        <label className="form-field__label" htmlFor="subject">
                          {t('modal.subject.label')}
                        </label>
                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          className={'form-field__input' + (errors.subject ? ' form-field__input--error' : '')}
                          placeholder={t('modal.subject.placeholder')}
                          value={form.subject}
                          onChange={handleChange}
                        />
                        {errors.subject && <span className="form-field__error">{errors.subject}</span>}
                      </div>

                      <div className="form-field">
                        <label className="form-field__label" htmlFor="message">
                          {t('modal.message.label')}
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          className={
                            'form-field__input form-field__textarea' +
                            (errors.message ? ' form-field__input--error' : '')
                          }
                          placeholder={t('modal.message.placeholder')}
                          value={form.message}
                          onChange={handleChange}
                        />
                        <div className="form-field__footer">
                          {errors.message && <span className="form-field__error">{errors.message}</span>}
                          <span className="form-field__count">{form.message.length}/2000</span>
                        </div>
                      </div>

                      <button type="submit" className="btn btn--primary btn--full" disabled={status === 'loading'}>
                        {status === 'loading' ? (
                          <>
                            <span className="spinner" />
                            {t('modal.sending')}
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send-fill" />
                            {t('modal.submit')}
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
