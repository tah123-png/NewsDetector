import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SubPageNav from '../Components/SubPageNav';
import LoadingState from '../Components/LoadingState';
import ResultCard, { type AnalysisResult } from '../Components/ResultCard';
import { analyzeImage } from '../utils/analysisEngine';

type LocationState = { file?: File };

const ImageAnalysisPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const file = (state as LocationState | null)?.file;
  const analyzedFileRef = useRef<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const missingImageError = file ? '' : 'No image was provided.';

  // Track dark mode mode attribute changes for dynamic styling
  const [isDark, setIsDark] = useState(document.documentElement.getAttribute('data-mode') === 'dark');

  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.getAttribute('data-mode') === 'dark')
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });
    return () => obs.disconnect();
  }, []);

  // ── Cursor-following glow orb ──────────────────────────────────────────────
  const orbRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -999, y: -999 });
  const rafId = useRef<number>(0);

  const animateOrb = useCallback(() => {
    if (orbRef.current) {
      orbRef.current.style.transform =
        `translate(${mousePos.current.x - 175}px, ${mousePos.current.y - 175}px)`;
    }
    if (trailRef.current) {
      trailRef.current.style.transform =
        `translate(${mousePos.current.x - 60}px, ${mousePos.current.y - 60}px)`;
    }
    rafId.current = requestAnimationFrame(animateOrb);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    rafId.current = requestAnimationFrame(animateOrb);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [animateOrb]);

  const dbSignals = result?.signals ? result.signals.filter(s => 
    ['Fact-Check Match', 'Source Authority', 'Database Record ID'].includes(s.label)
  ) : [];

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
      setPreviewUrl(''); 
    };
  }, [file]);

  useEffect(() => {
    if (!file) return;
    if (analyzedFileRef.current === file) return;
    analyzedFileRef.current = file;
    setResult(null);
    setError('');
    setIsLoading(true);
    let isActive = true;
    const timeoutId = window.setTimeout(() => {
      if (isActive) {
        setIsLoading(false);
        setError('Analysis timed out. Please try again.');
      }
    }, 70000); // 70s timeout
    
    // 🔧 BACKEND INTEGRATION POINT
    // This calls the mock analyzeImage(). When you add a backend,
    // this will automatically use your real API (just update analysisEngine.ts).
    analyzeImage(file)
      .then((r) => { if (isActive) setResult(r); })
      .catch((err) => { if (isActive) setError(err.message || 'Analysis failed. Please try again.'); })
      .finally(() => { if (isActive) setIsLoading(false); window.clearTimeout(timeoutId); });
    return () => { isActive = false; };
  }, [file]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-bg-primary relative">

      {/* ── Cursor-following glow orb (large, blurry) ── */}
      <div
        ref={orbRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.03) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
          willChange: 'transform',
          transition: 'transform 0.08s linear',
          filter: 'blur(2px)',
        }}
      />

      {/* ── Cursor-following inner dot (small, sharp) ── */}
      <div
        ref={trailRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
          willChange: 'transform',
          transition: 'transform 0.04s linear',
        }}
      />

      <SubPageNav />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1100px] mx-auto px-4 py-6">
          {(missingImageError || error) ? (
            <div className="bg-danger-bg border border-danger-border text-danger rounded-[14px] px-5 py-4 text-sm font-semibold max-w-[640px] mx-auto">
              {missingImageError || error}
            </div>
          ) : result ? (
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
              
              {/* Left Column: Image Info & Preview Sidebar */}
              <div className="flex flex-col gap-4 lg:sticky lg:top-5">
                <div className="glass-card p-5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[4px] bg-accent" />
                  <div className="text-[10px] font-bold tracking-widest text-txt-muted uppercase mb-1">Image Analysis</div>
                  <h1 className="text-xl font-extrabold font-display text-txt-primary mb-4">Analyzed Image</h1>
                  
                  {file && (
                    <div className="flex flex-col gap-3 bg-bg-secondary/60 border border-border-base rounded-[14px] p-4">
                      {previewUrl && (
                        <div className="relative group overflow-hidden rounded-xl border border-border-base/50 aspect-video flex items-center justify-center bg-bg-primary">
                          <img src={previewUrl} alt="Analyzed Media" className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105" />
                        </div>
                      )}
                      <div className="min-w-0 pt-1">
                        <p className="text-sm font-extrabold text-txt-primary truncate">{file.name}</p>
                        <p className="text-xs text-txt-muted mt-1 font-semibold">📁 {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  )}

                  {/* Verification Signals (Shifted to Left Side) */}
                  {dbSignals.length > 0 && (
                    <div className="flex flex-col gap-2.5 mt-4 pt-4 border-t border-border-base/50">
                      <div className="text-[10px] font-bold tracking-widest text-txt-muted uppercase mb-1">🔍 Verification Signals</div>
                      <div className="grid grid-cols-1 gap-2">
                        {dbSignals.map(sig => (
                          <div
                            key={sig.label}
                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all duration-200"
                            style={{ 
                              background: sig.status === 'bad' ? 'var(--color-danger-bg)' : 'var(--color-success-bg)',
                              borderColor: sig.status === 'bad' ? 'var(--color-danger-border)' : 'var(--color-success-border)' 
                            }}
                          >
                            <span className="text-lg">{sig.icon}</span>
                            <div className="min-w-0">
                              <div className="text-[10px] text-txt-muted font-bold">{sig.label}</div>
                              <div 
                                className="text-xs font-black truncate"
                                style={{ color: sig.status === 'bad' ? 'var(--color-danger)' : 'var(--color-success)' }}
                              >
                                {sig.value}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Analyzed URL (Shifted to Left Side) */}
                  {result.sourceUrl && (
                    <div className="mt-4 pt-4 border-t border-border-base/50">
                      <div className="bg-bg-secondary border border-border-base rounded-[14px] px-4 py-3 flex items-center gap-3">
                        <span className="text-lg shrink-0">🔗</span>
                        <div className="min-w-0">
                          <div className="text-[9px] font-bold tracking-widest text-txt-muted uppercase mb-0.5">Analyzed URL</div>
                          <a
                            href={result.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-accent hover:underline break-all leading-5"
                          >
                            {result.sourceUrl}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate('/')}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-bg-secondary border-[1.5px] border-border-base rounded-xl text-txt-secondary text-xs font-bold font-sans cursor-pointer transition-all duration-200 hover:border-accent hover:text-accent shadow-sm"
                >
                  ◀ Analyze Another
                </button>
              </div>

              {/* Right Column: Interactive Credibility Dashboard */}
              <div className="flex flex-col gap-4">
                <ResultCard result={result} />
              </div>

            </div>
          ) : isLoading ? (
            <div className="max-w-[640px] mx-auto">
              <LoadingState type="image" />
            </div>
          ) : (
            <div className="max-w-[640px] mx-auto">
              <div className="text-center text-sm text-txt-muted">No result available.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageAnalysisPage;
