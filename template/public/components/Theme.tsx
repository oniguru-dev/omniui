import { useState, useEffect } from "preact/hooks";

function getTheme(): string {
  return document.documentElement.dataset.theme || 'dark';
}

export function Theme() {
  const [theme, setTheme] = useState(getTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = () => {
    const root = document.documentElement;
    root.classList.add('theme-transition');
    setTheme(t => t === 'dark' ? 'light' : 'dark');
    setTimeout(() => root.classList.remove('theme-transition'), 150);
  };

  const nightMode = theme === 'dark';

  return (
    <button onClick={toggle} class="relative size-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{
      background: nightMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
      border: `1px solid ${nightMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`,
    }} aria-label="Toggle theme">
      <div class="i-solar-moon-bold transition-all duration-300 absolute" style={{
        width: '18px', height: '18px',
        color: '#fff',
        opacity: nightMode ? 1 : 0,
        transform: nightMode ? 'rotate(0) scale(1)' : 'rotate(90deg) scale(0)',
      }} />
      <div class="i-solar-sun-bold transition-all duration-300 absolute" style={{
        width: '18px', height: '18px',
        color: '#1a1a1a',
        opacity: nightMode ? 0 : 1,
        transform: nightMode ? '-rotate(90deg) scale(0)' : 'rotate(0) scale(1)',
      }} />
    </button>
  );
}