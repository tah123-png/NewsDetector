import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SubPageNav from '../Components/SubPageNav';
import LoadingState from '../Components/LoadingState';
import ResultCard, { type AnalysisResult } from '../Components/ResultCard';
import { analyzeUrl, getDemoArticleByUrl } from '../utils/analysisEngine';

const getStoredArticleResult = (url: string) => {
  try {
    const stored = sessionStorage.getItem('articleAnalysisResult');
    if (!stored) return null;
    const parsed = JSON.parse(stored) as { url?: string; result?: AnalysisResult };
    return parsed.url === url && parsed.result ? parsed.result : null;
  } catch { return null; }
};

const ArticleResultPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url') ?? '';
  const [result, setResult] = useState<AnalysisResult | null>(() => getStoredArticleResult(url));
  const [error, setError] = useState('');
  const missingUrlError = url ? '' : 'No article URL was provided.';
  const demoArticle = url ? getDemoArticleByUrl(url) : undefined;
  
  const dbSignals = result?.signals ? result.signals.filter(s => 
    ['Fact-Check Match', 'Source Authority', 'Database Record ID'].includes(s.label)
  ) : [];

  useEffect(() => {
    if (result || !url) return;
    let isActive = true;
    analyzeUrl(url)
      .then((r) => { if (isActive) setResult(r); })
      .catch((err) => { if (isActive) setError(err.message || 'Analysis failed. Please try again.'); });
    return () => { isActive = false; };
  }, [result, url]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-bg-primary">
      <SubPageNav />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1100px] mx-auto px-4 py-6">
          {(missingUrlError || error) ? (
            <div className="bg-danger-bg border border-danger-border text-danger rounded-[14px] px-5 py-4 text-sm font-semibold max-w-[640px] mx-auto">
              {missingUrlError || error}
            </div>
          ) : result ? (
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
              
              {/* Left Column: Article Info & Primary Actions */}
              <div className="flex flex-col gap-4 lg:sticky lg:top-5">
                <div className="glass-card p-5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[4px] bg-accent" />
                  <div className="text-[10px] font-bold tracking-widest text-txt-muted uppercase mb-1">Target Article</div>
                  <h1 className="text-xl font-extrabold font-display text-txt-primary mb-4">Analyzed Source</h1>
                  
                  {result.article ? (
                    <div className="bg-bg-secondary/60 border border-border-base rounded-[14px] p-4 flex flex-col gap-3">
                      <div>
                        <h2 className="text-sm font-extrabold font-display text-txt-primary leading-snug">{result.article.title}</h2>
                        <p className="text-xs text-txt-muted mt-1.5 font-semibold">
                          📰 {result.article.publisher} {result.article.publishedAt ? `· ${result.article.publishedAt}` : ''}
                        </p>
                      </div>
                      {result.article.excerpt && (
                        <p className="text-xs text-txt-secondary leading-relaxed bg-bg-primary/30 p-3 rounded-xl border border-border-base/55">{result.article.excerpt}</p>
                      )}
                    </div>
                  ) : demoArticle ? (
                    <div className="bg-bg-secondary/60 border border-border-base rounded-[14px] p-4 flex flex-col gap-3">
                      <div>
                        <h2 className="text-sm font-extrabold font-display text-txt-primary leading-snug">{demoArticle.title}</h2>
                        <p className="text-xs text-txt-muted mt-1.5 font-semibold">
                          📰 {demoArticle.publisher} · {demoArticle.publishedAt}
                        </p>
                      </div>
                      <p className="text-xs text-txt-secondary leading-relaxed bg-bg-primary/30 p-3 rounded-xl border border-border-base/55">{demoArticle.excerpt}</p>
                    </div>
                  ) : url && (
                    <div className="bg-bg-secondary/60 border border-border-base rounded-[14px] p-4">
                      <div className="text-xs font-semibold text-txt-secondary break-all">{url}</div>
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
                  {url && (
                    <div className="mt-4 pt-4 border-t border-border-base/50">
                      <div className="bg-bg-secondary border border-border-base rounded-[14px] px-4 py-3 flex items-center gap-3">
                        <span className="text-lg shrink-0">🔗</span>
                        <div className="min-w-0">
                          <div className="text-[9px] font-bold tracking-widest text-txt-muted uppercase mb-0.5">Analyzed URL</div>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-accent hover:underline break-all leading-5"
                          >
                            {url}
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
          ) : (
            <div className="max-w-[640px] mx-auto">
              <LoadingState type="url" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleResultPage;
