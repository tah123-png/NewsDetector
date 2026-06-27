import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <header className="pt-20 lg:pt-2 pb-2 text-center relative">
      {/* Top-right controls */}
      <div className="fixed top-5 right-6 md:top-6 md:right-8 z-50 flex items-center gap-3">
        <ThemeToggle />
        <Link
          to="/news"
          className="px-5 py-2 text-sm font-semibold text-txt-primary bg-bg-secondary border border-border-base rounded-full hover:border-accent hover:text-accent hover:bg-accent-glow hover:-translate-y-0.5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" /><path d="M18 14h-8" /><path d="M15 18h-5" /><path d="M10 6h8v4h-8V6Z" /></svg>
          News
        </Link>
        <Link
          to={isAuthenticated ? '/dashboard' : '/login'}
          className="px-5 py-2 text-sm font-semibold text-txt-primary bg-bg-secondary border border-border-base rounded-full hover:border-accent hover:text-accent hover:bg-accent-glow hover:-translate-y-0.5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
        >
          {isAuthenticated ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
              Dashboard
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
              Sign In
            </>
          )}
        </Link>
      </div>

      {/* Badge */}
      <div className="inline-flex items-center justify-center gap-2.5 bg-accent-glow border border-border-focus rounded-full px-5 py-2 mb-8 md:mb-10 text-[12px] font-semibold text-accent tracking-widest uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
        <span>AI-Powered Analysis Engine</span>
        {/* Invisible spacer to perfectly center the text despite the left dot */}
        <span className="w-1.5 h-1.5 shrink-0 invisible" />
      </div>

      {/* Title with Logo */}
      <div className="flex justify-center -my-2 md:-my-4 relative z-0">
        <img src="/logo.svg" alt="FakeShield Logo" className="w-40 md:w-48 max-w-full h-auto object-contain" />
      </div>

      <h1 className="relative z-10 font-display text-[clamp(30px,5vw,54px)] font-extrabold leading-[1.1] mb-2 tracking-tight text-center flex flex-col items-center justify-center">
        <span className="text-txt-primary font-bold">News Detector</span>
      </h1>

      {/* Subtitle */}
      <p className="text-txt-secondary text-[clamp(14px,2vw,17px)] max-w-[540px] mx-auto mb-2 font-normal leading-relaxed">
        Analyze news articles and images for misinformation using advanced AI.
        Paste a URL or upload an image to get started.
      </p>

      {/* Stats */}
      <div className="flex justify-center gap-6 sm:gap-10 mt-4 mb-8 flex-wrap">
        {[
          { value: '90%', label: 'Accuracy Rate', interactive: true },
          { value: '100K+', label: 'Articles Analyzed', interactive: true },
          { value: '<2s', label: 'Avg. Response', interactive: false },
        ].map((s) => {
          const handleClick = s.interactive
            ? () => document.getElementById('accuracy-methodology')?.scrollIntoView({ behavior: 'smooth' })
            : undefined;
          return (
            <div
              key={s.label}
              onClick={handleClick}
              className={`text-center ${s.interactive ? 'cursor-pointer' : ''}`}
              title={s.interactive ? "Click to view methodology & verification details" : undefined}
            >
              <div className="text-[21px] font-extrabold font-display text-accent">
                {s.value}
              </div>
              <div className="text-xs text-txt-muted font-medium mt-0.5">
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </header>
  );
};

export default Header;
