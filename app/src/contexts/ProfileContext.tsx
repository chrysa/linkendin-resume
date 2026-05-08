import { createContext, useContext, useMemo } from 'react';
import type { CvProfile } from '@/types/profile';
import { PROFILES, DEFAULT_PROFILE } from '@/data/profiles';

const ProfileContext = createContext<CvProfile>(DEFAULT_PROFILE);

/** Hook — retourne le profil actif (lu depuis ?profile=<slug> dans l'URL) */
// eslint-disable-next-line react-refresh/only-export-components
export function useProfile(): CvProfile {
  return useContext(ProfileContext);
}

/**
 * Provider — lit le param URL ?profile=<slug> et injecte le profil dans le
 * contexte. Doit envelopper <App /> ou <CVPage />.
 *
 * Exemples :
 *   /?profile=freelance  → profil Freelance
 *   /?profile=backend    → profil Backend
 *   /                    → profil default (CV complet)
 */
export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const profile = useMemo(() => {
    const slug = new URLSearchParams(window.location.search).get('profile') ?? 'default';
    return PROFILES[slug] ?? DEFAULT_PROFILE;
  }, []);

  return <ProfileContext.Provider value={profile}>{children}</ProfileContext.Provider>;
}
