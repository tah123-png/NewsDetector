export type Verdict = 'FAKE' | 'LIKELY_FAKE' | 'UNCERTAIN' | 'LIKELY_REAL' | 'REAL';

export interface AnalysisResult {
  verdict: Verdict;
  score: number;
  confidence: number;
  summary: string;
  signals: { label: string; value: string; icon: string; status: 'bad' | 'warn' | 'good' }[];
  sourceUrl?: string;
  article?: {
    title: string;
    publisher: string;
    publishedAt: string;
    excerpt: string;
  };
  analysisTime: number;
  factcheck_content?: string;
  sources?: { text: string; link: string }[];
}

interface Props {
  result: AnalysisResult;
}

const verdictConfig: Record<Verdict, {
  label: string; color: string; bg: string; border: string;
  emoji: string; tagline: string;
}> = {
  FAKE: {
    label: 'FAKE NEWS', color: '#ef4444', bg: 'var(--color-danger-bg)',
    border: 'var(--color-danger-border)', emoji: '🚨',
    tagline: 'High probability of misinformation detected',
  },
  LIKELY_FAKE: {
    label: 'LIKELY FAKE', color: '#f97316', bg: 'var(--color-warning-bg)',
    border: 'var(--color-warning-border)', emoji: '⚠️',
    tagline: 'Several indicators suggest misleading content',
  },
  UNCERTAIN: {
    label: 'UNCERTAIN', color: 'var(--color-warning)', bg: 'var(--color-warning-bg)',
    border: 'var(--color-warning-border)', emoji: '🤔',
    tagline: 'Mixed signals — verify from multiple sources',
  },
  LIKELY_REAL: {
    label: 'LIKELY REAL', color: '#22c55e', bg: 'var(--color-success-bg)',
    border: 'var(--color-success-border)', emoji: '✅',
    tagline: 'Content appears credible with minor caveats',
  },
  REAL: {
    label: 'VERIFIED REAL', color: 'var(--color-success)', bg: 'var(--color-success-bg)',
    border: 'var(--color-success-border)', emoji: '🛡️',
    tagline: 'High credibility — consistent with trusted sources',
  },
};

const statusColor = { bad: '#ef4444', warn: '#f59e0b', good: '#10b981' };
const statusBg = { bad: 'var(--color-danger-bg)', warn: 'var(--color-warning-bg)', good: 'var(--color-success-bg)' };

const ResultCard = ({ result }: Props) => {
  const cfg = verdictConfig[result.verdict];
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const strokeDash = (result.score / 100) * circ;

  return (
    <div className="animate-bounce-in glass-card p-5">

      {/* Verdict banner */}
      <div
        className="flex items-center gap-3 px-4 py-4 rounded-[14px] mb-5"
        style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}` }}
      >
        <span className="text-4xl">{cfg.emoji}</span>
        <div>
          <div className="text-[22px] font-extrabold font-display tracking-tight" style={{ color: cfg.color }}>
            {cfg.label}
          </div>
          <div className="text-[13px] text-txt-secondary mt-0.5">{cfg.tagline}</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-xs text-txt-muted">Analyzed in</div>
          <div className="text-[15px] font-bold text-accent">{result.analysisTime}ms</div>
        </div>
      </div>

      {/* Score + Confidence */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* Gauge */}
        <div className="bg-bg-secondary border border-border-base rounded-2xl p-6 flex flex-col items-center gap-3">
          <div className="text-[13px] font-semibold text-txt-secondary">Fake Score</div>
          <svg width="130" height="130" viewBox="0 0 130 130">
            <circle cx="65" cy="65" r={radius} fill="none" stroke="var(--color-border)" strokeWidth="10" />
            <circle
              cx="65" cy="65" r={radius} fill="none" stroke={cfg.color} strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${strokeDash} ${circ}`}
              strokeDashoffset={circ / 4}
              style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)' }}
            />
            <text x="65" y="60" textAnchor="middle" fontSize="24" fontWeight="800" fill={cfg.color} fontFamily="Space Grotesk,sans-serif">{result.score}</text>
            <text x="65" y="78" textAnchor="middle" fontSize="11" fill="var(--color-text-muted)" fontFamily="Inter,sans-serif">/ 100</text>
          </svg>
        </div>




        {/* Confidence */}
        <div className="bg-bg-secondary border border-border-base rounded-2xl p-6 flex flex-col gap-4">
          <div className="text-[13px] font-semibold text-txt-secondary">AI Confidence</div>
          <div className="text-5xl font-extrabold font-display text-accent leading-none">{result.confidence}%</div>
          <div>
            <div className="h-2 bg-border-base rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-[1.4s] ease-in-out"
                style={{
                  width: `${result.confidence}%`,
                  background: 'linear-gradient(90deg, var(--color-accent), #a78bfa)',
                }}
              />
            </div>
            <div className="text-xs text-txt-muted mt-2">Model certainty level</div>
          </div>
          <div className="flex flex-col gap-1.5 mt-auto">
            {(['Low', 'Medium', 'High'] as const).map((level, i) => {
              const isActive = result.confidence >= [0, 40, 75][i] && result.confidence < [40, 75, 101][i];
              return (
                <div key={level} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{
                      background: ['var(--color-danger)', 'var(--color-warning)', 'var(--color-success)'][i],
                      opacity: 1,
                      boxShadow: isActive ? `0 0 8px ${['var(--color-danger)', 'var(--color-warning)', 'var(--color-success)'][i]}` : 'none'
                    }}
                  />
                  <span className="text-[11px]" style={{
                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                    fontWeight: isActive ? 700 : 500
                  }}>
                    {level}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-bg-secondary border border-border-base rounded-[14px] p-4 mb-4">
        <div className="text-xs font-bold tracking-widest text-txt-muted uppercase mb-2.5">📋 Analysis Summary</div>
        <p className="text-txt-secondary text-sm leading-7">{result.summary}</p>
      </div>

      {/* Fact-Check Content (Bengali Full Explanation) */}
      {result.factcheck_content && (
        <div className="bg-bg-secondary border border-border-base rounded-[14px] p-4 mb-4">
          <div className="text-xs font-bold tracking-widest text-txt-muted uppercase mb-2.5">📰 Detailed Fact-Check Report</div>
          <p className="text-txt-secondary text-sm leading-7 whitespace-pre-wrap font-sans text-left" dir="auto">{result.factcheck_content}</p>
        </div>
      )}

      {/* Sources list */}
      {result.sources && result.sources.length > 0 && (
        <div className="bg-bg-secondary border border-border-base rounded-[14px] p-4 mb-4">
          <div className="text-xs font-bold tracking-widest text-txt-muted uppercase mb-2.5">🔗 Verified Information Sources</div>
          <div className="flex flex-col gap-2 mt-2 text-left">
            {result.sources.map((src, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-xs mt-0.5">📌</span>
                {src.link ? (
                  <a
                    href={src.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-accent hover:underline break-all"
                  >
                    {src.text}
                  </a>
                ) : (
                  <span className="text-xs text-txt-secondary">{src.text}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Signals grid */}
      <div className="mb-4">
        <div className="text-xs font-bold tracking-widest text-txt-muted uppercase mb-3.5">🔍 Detection Signals</div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5">
          {result.signals.map((sig) => (
            <div
              key={sig.label}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
              style={{ background: statusBg[sig.status], border: `1px solid ${statusColor[sig.status]}30` }}
            >
              <span className="text-xl">{sig.icon}</span>
              <div>
                <div className="text-[11px] text-txt-muted font-semibold">{sig.label}</div>
                <div className="text-[13px] font-bold" style={{ color: statusColor[sig.status] }}>{sig.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ResultCard;
