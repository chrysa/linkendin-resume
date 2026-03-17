import { CVPage } from '@/pages/CVPage';
import { ThemeProvider } from '@/hooks/useTheme';
import { ProfileProvider } from '@/contexts/ProfileContext';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@/styles/tokens.css';
import '@/styles/globals.css';
import '@/styles/components.css';
import '@/styles/sections.css';
import '@/styles/modal.css';
import '@/styles/animations.css';
import '@/styles/responsive.css';

function App() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <CVPage />
      </ProfileProvider>
    </ThemeProvider>
  );
}

export default App;
