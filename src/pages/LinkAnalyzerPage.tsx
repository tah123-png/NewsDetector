import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import LinkAnalyzer from '../Components/LinkAnalyzer';

const LinkAnalyzerPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-primary px-6 pt-6 pb-20 relative overflow-hidden">
      <div
        aria-hidden
        className="fixed -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="fixed -bottom-[15%] -right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' }}
      />

      <div className="max-w-[720px] mx-auto relative z-10">
        <Header />

        <button
          onClick={() => navigate('/')}
          className="mb-5 px-4 py-2 bg-bg-secondary border border-border-base rounded-xl text-txt-secondary text-sm font-semibold font-sans cursor-pointer transition-all duration-200 hover:border-accent hover:text-accent"
        >
          Back to home
        </button>

        <div className="glass-card p-10 animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
          <div className="mb-6">
            <div className="text-xs font-bold tracking-widest text-txt-muted uppercase mb-2">URL analyzer</div>
            <h1 className="text-2xl font-extrabold font-display text-txt-primary">Analyze Article URL</h1>
          </div>

          <LinkAnalyzer isLoading={false} />
        </div>

        <footer className="text-center mt-12 text-txt-muted text-[13px] leading-relaxed">
          <div>For educational purposes only - always verify news from trusted sources.</div>
        </footer>
      </div>
    </div>
  );
};

export default LinkAnalyzerPage;
