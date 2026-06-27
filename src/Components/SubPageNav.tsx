import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const SubPageNav = () => {
  const navigate = useNavigate();
  return (
    <nav
      className="relative flex items-center justify-between px-5 shrink-0 border-b border-border-base"
      style={{ height: '52px', background: 'var(--color-bg-secondary)', backdropFilter: 'blur(12px)' }}
    >
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-sm font-semibold text-txt-secondary hover:text-accent transition-colors duration-200 cursor-pointer font-sans bg-transparent border-none z-10"
      >
        ← Back
      </button>
      
      <div className="absolute inset-x-0 flex justify-center pointer-events-none">
        <span className="gradient-text font-display font-bold text-base pointer-events-auto">FakeShield</span>
      </div>

      <div className="z-10">
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default SubPageNav;
