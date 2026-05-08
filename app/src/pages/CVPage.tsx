import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from '@/components/cv/Navbar';
import { Hero } from '@/components/cv/Hero';
import { ImpactMetrics } from '@/components/cv/ImpactMetrics';
import { ExperienceTimeline } from '@/components/cv/ExperienceTimeline';
import { SkillsCloud } from '@/components/cv/SkillsCloud';
import { ProjectsGrid } from '@/components/cv/ProjectsGrid';
import { EducationSection } from '@/components/cv/EducationSection';
import { ContactSection } from '@/components/cv/ContactSection';
import { ContactModal } from '@/components/contact/ContactModal';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { FloatingCTA } from '@/components/ui/FloatingCTA';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

export function CVPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const openModal = () => setModalOpen(true);
  useDocumentMeta({ lang: i18n.language });

  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <Navbar onContactClick={openModal} />

      <main>
        <Hero onContactClick={openModal} />
        <ImpactMetrics />
        <ExperienceTimeline />
        <SkillsCloud />
        <ProjectsGrid />
        <EducationSection />
        <ContactSection onContactClick={openModal} />
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <span className="footer__copy">
            &copy; {new Date().getFullYear()} &middot; {t('footer.madeWith')} &#9749;
          </span>
          <a
            href="https://github.com/chrysa/linkendin-resume"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__source"
          >
            <i className="bi bi-github" /> {t('footer.source')}
          </a>
        </div>
      </footer>

      <FloatingCTA onContactClick={openModal} />
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
