import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ImageAnalyzer from '../Components/ImageAnalyzer';
import LinkAnalyzer from '../Components/LinkAnalyzer';
import ThemeToggle from '../Components/ThemeToggle';

type Tab = 'url' | 'image';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialTab: Tab = (location.state as { tab?: Tab })?.tab ?? 'url';

  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [typedText, setTypedText] = useState('');
  const spotlightRef = useRef<HTMLDivElement>(null);

  const fullText = 'False News Detector';

  // Infinite typewriter: type → pause 2s → erase → repeat
  useEffect(() => {
    let currentIndex = 0;
    let isDeleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!isDeleting) {
        // Typing forward
        currentIndex++;
        setTypedText(fullText.substring(0, currentIndex));
        if (currentIndex === fullText.length) {
          // Finished typing — wait 2s then start erasing
          isDeleting = true;
          timeoutId = setTimeout(tick, 2000);
          return;
        }
        timeoutId = setTimeout(tick, 110);
      } else {
        // Erasing backward
        currentIndex--;
        setTypedText(fullText.substring(0, currentIndex));
        if (currentIndex === 0) {
          // Finished erasing — wait 2s then start typing again
          isDeleting = false;
          timeoutId = setTimeout(tick, 2000);
          return;
        }
        timeoutId = setTimeout(tick, 60);
      }
    };

    timeoutId = setTimeout(tick, 300);
    return () => clearTimeout(timeoutId);
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'url', label: 'Analyze URL' },
    { id: 'image', label: 'Analyze Image' },
  ];

  // Move the spotlight div to follow the cursor
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!spotlightRef.current) return;
    spotlightRef.current.style.left = `${e.clientX}px`;
    spotlightRef.current.style.top = `${e.clientY}px`;
    spotlightRef.current.style.opacity = '1';
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!spotlightRef.current) return;
    spotlightRef.current.style.opacity = '0';
  }, []);

  const handleAnalyzeClick = () => {
    setShowAnalyzer(true);
  };

  const handleExistingNewsClick = () => {
    navigate('/news');
  };

  return (
    <div
      className="min-h-screen bg-bg-primary px-6 py-12 flex flex-col justify-center items-center relative overflow-x-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Cursor spotlight ── */}
      <div
        ref={spotlightRef}
        aria-hidden
        style={{
          position: 'fixed',
          width: 600,
          height: 600,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 65%)',
          transition: 'opacity 0.4s ease',
          willChange: 'left, top',
        }}
      />

      {/* Static ambient blobs */}
      <div
        aria-hidden
        className="fixed -top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)', opacity: 0.3 }}
      />
      <div
        aria-hidden
        className="fixed -bottom-[15%] -right-[10%] w-[400px] h-[400px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)', opacity: 0.2 }}
      />

      {/* Theme Toggle / Dashboard controls */}
      <div className="fixed top-5 right-6 z-50 flex items-center gap-3">
        <ThemeToggle />
        <button
          onClick={() => navigate('/signup')}
          className="px-5 py-2 text-sm font-semibold text-txt-primary bg-bg-secondary border border-border-base rounded-full hover:border-accent hover:text-accent hover:bg-accent-glow hover:-translate-y-0.5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
          Sign Up
        </button>
      </div>

      <div className="w-full max-w-[860px] relative z-10 flex flex-col my-auto transition-all duration-500">

        {!showAnalyzer ? (
          /* Mockup Landing Page View */
          <div className="w-full py-4 flex flex-col items-center text-center animate-fade-up">

            {/* Top Center: Minimalist blue shield checkmark logo */}
            <div className="mb-6 text-accent transition-transform duration-300 hover:scale-105">
              <svg width="88" height="88" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="url(#shieldGrad)" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 11.5L11 13.5L15 9" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="shieldGrad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3b82f6" />
                    <stop offset="1" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Pill Badge directly below logo */}
            <div className="inline-flex items-center justify-center gap-2 bg-accent-glow border border-border-focus rounded-full px-4 py-1.5 mb-6 text-[11px] font-bold text-accent tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>AI-Powered Analysis Engine</span>
            </div>

            {/* Heading styled in distinct bold monospace typewriter font with blinking terminal cursor */}
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl tracking-tight mb-5 text-txt-primary flex items-center justify-center min-h-[60px] leading-tight select-none"
              style={{ fontFamily: "'Story Script', cursive" }}
            >
              <span>{typedText}</span>
              <span className="animate-[blink_1s_infinite] text-accent font-light ml-1">|</span>
            </h1>

            {/* Short text description */}
            <p className="text-txt-secondary text-lg sm:text-xl max-w-[620px] mx-auto mb-10 font-normal leading-relaxed"> 
              Verify news articles url links and images for misinformation instantly using advanced neural network models. Protect yourself from digital fraud, rumor networks, and fake reporting.
            </p>

            {/* Metrics stats in a single horizontal row */}
            <div className="grid grid-cols-3 gap-6 w-full max-w-[560px] py-5 border-y border-border-base/50 mb-12">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-accent">90%</div>
                <div className="text-xs text-txt-muted font-semibold tracking-wider uppercase mt-1.5">Accuracy</div>
              </div>
              <div className="text-center border-x border-border-base/50">
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-accent">100K+</div>
                <div className="text-xs text-txt-muted font-semibold tracking-wider uppercase mt-1.5">Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-accent">&lt;2s</div>
                <div className="text-xs text-txt-muted font-semibold tracking-wider uppercase mt-1.5">Response</div>
              </div>
            </div>

            {/* Actions: "Analyze" in vibrant blue, "Existing News" in light gray */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[420px]">
              <button
                onClick={handleAnalyzeClick}
                className="flex-1 btn-primary py-4 px-8 text-base font-bold shadow-md cursor-pointer
                  transition-all duration-300 ease-out
                  hover:-translate-y-1 hover:scale-[1.04] hover:shadow-[0_8px_30px_var(--color-accent-glow)]
                  active:scale-[0.97] active:translate-y-0"
                style={{ borderRadius: '999px' }}
              >
                Analyze
              </button>
              <button
                onClick={handleExistingNewsClick}
                className="flex-1 py-4 px-8 bg-bg-secondary border-2 border-border-base text-txt-primary text-base font-bold cursor-pointer
                  transition-all duration-300 ease-out
                  hover:-translate-y-1 hover:scale-[1.04] hover:border-accent hover:text-accent hover:bg-accent-glow hover:shadow-[0_8px_24px_var(--color-accent-glow)]
                  active:scale-[0.97] active:translate-y-0"
                style={{ borderRadius: '999px' }}
              >
                Existing News
              </button>
            </div>

          </div>
        ) : (
          /* Original Analyzer Interactive View */
          <div key="analyzer-card" className="glass-card p-8 sm:p-12 animate-fade-up relative">

              <button
                onClick={() => setShowAnalyzer(false)}
                className="text-xs font-semibold text-txt-muted hover:text-accent flex items-center gap-1.5 border border-border-base/80 bg-bg-secondary px-3 py-1.5 rounded-lg transition-all cursor-pointer mb-6"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Back to Mockup
              </button>

            {/* Tab Selector */}
            <div className="grid grid-cols-2 gap-1.5 bg-bg-input p-1.5 rounded-[14px] mb-8 border border-border-base">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="py-3 px-5 rounded-[10px] border-none font-sans text-sm font-bold cursor-pointer transition-all duration-200"
                  style={{
                    background: activeTab === tab.id
                      ? 'linear-gradient(135deg, var(--color-accent), var(--color-accent-2))'
                      : 'transparent',
                    color: activeTab === tab.id ? 'white' : 'var(--color-text-secondary)',
                    boxShadow: activeTab === tab.id ? '0 4px 12px var(--color-accent-glow)' : 'none',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Panel */}
            <div key={activeTab} className="animate-fade-in">
              {activeTab === 'url' ? <LinkAnalyzer isLoading={false} /> : <ImageAnalyzer isLoading={false} />}
            </div>

          </div>
        )}

      </div>

      <footer className="w-full text-center mt-auto pt-6 pb-2 text-txt-muted text-xs sm:text-sm leading-relaxed relative z-10">
        <div>For educational purposes only - always verify news from trusted sources.</div>
      </footer>
    </div>
  );
};

export default HomePage;
