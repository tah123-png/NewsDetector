import { useCallback, useEffect, useState } from 'react';

type Mode = 'light' | 'dark';

const getInitialMode = (): Mode => {
  const stored = localStorage.getItem('theme-mode') as Mode | null;
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const ThemeToggle = () => {
  const [mode, setMode] = useState<Mode>(getInitialMode);

  const apply = useCallback((m: Mode) => {
    document.documentElement.setAttribute('data-mode', m);
    localStorage.setItem('theme-mode', m);
  }, []);

  useEffect(() => { apply(mode); }, [mode, apply]);

  const toggle = () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
      className="theme-toggle-pill"
    >
      {/* Track */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: mode === 'dark'
            ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
            : 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: '#fff',
          flexShrink: 0,
          transition: 'all 0.3s ease',
        }}
      >
        {mode === 'dark' ? <MoonIcon /> : <SunIcon />}
      </span>
      {mode === 'dark' ? 'Dark' : 'Light'}
    </button>
  );
};

export default ThemeToggle;
