import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


interface Props {
  isLoading: boolean;
}

const isValidUrl = (url: string) => {
  try { new URL(url); return true; } catch { return false; }
};

const LinkAnalyzer = ({ isLoading }: Props) => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);

  const handleAnalyze = () => {
    setError('');
    const trimmedUrl = url.trim();
    if (!trimmedUrl) { setError('Please enter a URL to analyze.'); return; }
    if (!isValidUrl(trimmedUrl)) { setError('Please enter a valid URL (e.g. https://rumorscanner.com/article).'); return; }
    
    try {
      const parsed = new URL(trimmedUrl);
      if (!parsed.hostname.toLowerCase().includes('rumorscanner.com')) {
        setError('Only rumorscanner.com URLs can be analyzed.');
        return;
      }
    } catch {
      setError('Please enter a valid rumorscanner.com URL.');
      return;
    }
    
    navigate(`/analyze-article?url=${encodeURIComponent(trimmedUrl)}`);
  };

  return (
    <div>
      {/* URL input */}
      <div className="relative mb-7">
        <span className="absolute left-[18px] top-1/2 -translate-y-1/2 text-xl pointer-events-none z-[2]">🔗</span>
        <input
          type="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError(''); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleAnalyze()}
          placeholder="Paste article URL (e.g. https://example.com/news/article)"
          disabled={isLoading}
          className="w-full py-[18px] pr-[18px] pl-[52px] text-[15px] font-sans rounded-[14px] outline-none transition-all duration-200"
          style={{
            background: 'var(--color-bg-input)',
            color: 'var(--color-text-primary)',
            border: `2px solid ${error ? 'var(--color-danger)' : focused ? 'var(--color-border-focus)' : 'var(--color-border)'}`,
            boxShadow: focused ? '0 0 0 4px var(--color-accent-glow)' : 'none',
          }}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-[10px] text-[13px] font-medium mb-7 animate-fade-in bg-danger-bg border border-danger-border text-danger">
          ⚠️ {error}
        </div>
      )}

      {/* Analyze button */}
      <button
        className="btn-primary w-full text-base py-[18px] px-7"
        onClick={handleAnalyze}
        disabled={isLoading || !url.trim()}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2.5">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Analyzing...
          </span>
        ) : 'Analyze Article'}
      </button>
    </div>
  );
};

export default LinkAnalyzer;
