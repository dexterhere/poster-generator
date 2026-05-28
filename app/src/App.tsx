import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/ToastContext';
import { useThemeStore } from './store/useThemeStore';
import LandingPage from './pages/LandingPage';
import TemplatesPage from './pages/TemplatesPage';
import BuilderPage from './pages/BuilderPage';

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const editorTheme = useThemeStore((s) => s.editorTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-editor-theme', editorTheme);
  }, [editorTheme]);

  return <>{children}</>;
}

function App() {
  return (
    <ThemeWrapper>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/builder" element={<BuilderPage />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeWrapper>
  );
}

export default App;
