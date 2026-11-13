import { useEffect, useState } from 'react';
import { HomeView } from './components/HomeView';
import { Shell } from './components/Shell';
import { SubViews } from './components/SubViews';

export default function App() {
  const [path, setPath] = useState<string>(() => window.location.pathname || '/');

  useEffect(() => {
    const onPopState = () => {
      setPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (nextPath: string) => {
    const normalized = nextPath.startsWith('/') ? nextPath : `/${nextPath}`;
    if (normalized !== path) {
      window.history.pushState({}, '', normalized);
      setPath(normalized);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Shell currentPath={path} onNavigate={navigate}>
      {path === '/' ? (
        <HomeView onNavigate={navigate} />
      ) : (
        <SubViews path={path} onNavigate={navigate} />
      )}
    </Shell>
  );
}
