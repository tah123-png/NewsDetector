import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SubPageNav from '../Components/SubPageNav';
import LoadingState from '../Components/LoadingState';
import { analyzeUrl, getDemoArticleByUrl } from '../utils/analysisEngine';

const ArticleAnalysisPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url') ?? '';
  const [error, setError] = useState('');
  const missingUrlError = url ? '' : 'No article URL was provided.';
  const demoArticle = url ? getDemoArticleByUrl(url) : undefined;

  useEffect(() => {
    if (!url) return;
    let isActive = true;
    // 🔧 BACKEND — This calls the mock analyzeUrl(). When you add a backend,
    // this will automatically use your real API (just update analysisEngine.ts).
    analyzeUrl(url)
      .then((result) => {
        if (isActive) {
          sessionStorage.setItem('articleAnalysisResult', JSON.stringify({ url, result }));
          const currentCount = parseInt(localStorage.getItem('analyzedCount') || '0', 10);
          localStorage.setItem('analyzedCount', (currentCount + 1).toString());
          navigate(`/article-result?url=${encodeURIComponent(url)}`, { replace: true });
        }
      })
      .catch(() => { if (isActive) setError('Analysis failed. Please try again.'); });
    return () => { isActive = false; };
  }, [navigate, url]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-bg-primary">
      <SubPageNav />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[640px] mx-auto px-4 py-5 flex flex-col gap-4">

          {/* Article info */}
          <div className="glass-card p-5 animate-fade-up">
            <div className="text-[11px] font-bold tracking-widest text-txt-muted uppercase mb-1">Article Analysis</div>
            <h1 className="text-xl font-extrabold font-display text-txt-primary mb-3">Analyzing Article</h1>
            {demoArticle ? (
              <div className="bg-bg-secondary border border-border-base rounded-[14px] p-4">
                <div className="text-[11px] font-bold tracking-widest text-txt-muted uppercase mb-1.5">Demo article</div>
                <h2 className="text-base font-extrabold font-display text-txt-primary leading-snug">{demoArticle.title}</h2>
                <p className="text-xs text-txt-muted mt-1">{demoArticle.publisher} · {demoArticle.publishedAt}</p>
                <p className="text-sm text-txt-secondary mt-2 leading-6">{demoArticle.excerpt}</p>
              </div>
            ) : url && (
              <p className="text-sm text-txt-secondary break-all">{url}</p>
            )}
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '150ms', opacity: 0, animation: 'fadeUp 0.5s ease 150ms forwards' }}>
            {(missingUrlError || error) ? (
              <div className="bg-danger-bg border border-danger-border text-danger rounded-[14px] px-5 py-4 text-sm font-semibold">
                {missingUrlError || error}
              </div>
            ) : (
              <LoadingState type="url" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleAnalysisPage;
