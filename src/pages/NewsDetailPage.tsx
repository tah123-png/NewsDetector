import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SubPageNav from '../Components/SubPageNav';

interface NewsArticle {
  _id:         string;
  title:       string;
  summary:     string;
  content:     string;
  category:    string;
  imageUrl:    string;
  author:      string;
  source:      string;
  tags:        string[];
  publishedAt: string;
  featured:    boolean;
}

const categoryColors: Record<string, string> = {
  Technology: 'var(--color-accent)',
  Health:     '#10b981',
  Politics:   '#f59e0b',
  Science:    '#8b5cf6',
  Media:      '#ef4444',
  General:    'var(--color-text-muted)',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

const NewsDetailPage = () => {
  const { id }      = useParams<{ id: string }>();
  const navigate    = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError('');
        const res  = await fetch(`http://localhost:5000/api/news/${id}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setArticle(data.data);
      } catch {
        setError('Article not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchArticle();
  }, [id]);

  const catColor = article ? (categoryColors[article.category] ?? categoryColors['General']) : 'var(--color-accent)';

  return (
    <div className="min-h-screen bg-bg-primary">
      <SubPageNav />

      {loading && (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div
            className="animate-spin-slow"
            style={{
              width: 48, height: 48, borderRadius: '50%',
              border: '3px solid var(--color-border)',
              borderTopColor: 'var(--color-accent)',
            }}
          />
          <p className="text-txt-secondary text-sm font-medium">Loading article…</p>
        </div>
      )}

      {error && !loading && (
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
          <p className="text-txt-secondary font-medium text-lg mb-6">{error}</p>
          <button
            className="btn-primary px-6 py-2.5 text-sm"
            onClick={() => navigate('/news')}
          >
            Back to News
          </button>
        </div>
      )}

      {article && !loading && (
        <div className="max-w-3xl mx-auto px-6 py-12 animate-fade-up" style={{ animationFillMode: 'both' }}>

          {/* Back link */}
          <button
            onClick={() => navigate('/news')}
            style={{
              display:    'inline-flex',
              alignItems: 'center',
              gap:        6,
              color:      'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize:   14,
              marginBottom: 28,
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              padding:    0,
              transition: 'color 0.2s',
              fontFamily: 'Inter, sans-serif',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>
            </svg>
            Back to News
          </button>

          {/* Category badge */}
          <div style={{ marginBottom: 16 }}>
            <span
              style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
                textTransform: 'uppercase', color: catColor,
                background: `${catColor}18`, padding: '4px 12px', borderRadius: 999,
              }}
            >
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily:   "'Space Grotesk', sans-serif",
              fontWeight:   800,
              fontSize:     'clamp(26px, 4vw, 40px)',
              lineHeight:   1.2,
              color:        'var(--color-text-primary)',
              marginBottom: 16,
            }}
          >
            {article.title}
          </h1>

          {/* Meta row */}
          <div
            style={{
              display:     'flex',
              flexWrap:    'wrap',
              alignItems:  'center',
              gap:         16,
              marginBottom: 28,
              paddingBottom: 24,
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            {/* Author avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 13, fontWeight: 700,
                }}
              >
                {article.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {article.author}
                </div>
                {article.source && (
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                    {article.source}
                  </div>
                )}
              </div>
            </div>

            <div style={{ color: 'var(--color-border)', fontSize: 18 }}>·</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontSize: 13 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {formatDate(article.publishedAt)}
            </div>
          </div>

          {/* Summary */}
          <p
            style={{
              fontSize:     'clamp(15px, 2vw, 18px)',
              lineHeight:   1.7,
              color:        'var(--color-text-secondary)',
              fontWeight:   400,
              marginBottom: 28,
              fontStyle:    'italic',
              borderLeft:   '3px solid var(--color-accent)',
              paddingLeft:  18,
            }}
          >
            {article.summary}
          </p>

          {/* Hero image */}
          {article.imageUrl && (
            <div
              style={{
                borderRadius: 16, overflow: 'hidden',
                marginBottom: 36, boxShadow: 'var(--shadow-card)',
              }}
            >
              <img
                src={article.imageUrl}
                alt={article.title}
                style={{ width: '100%', height: 'auto', maxHeight: 400, objectFit: 'cover', display: 'block' }}
                onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
              />
            </div>
          )}

          {/* Content */}
          <div
            style={{
              fontSize:   'clamp(15px, 2vw, 17px)',
              lineHeight: 1.85,
              color:      'var(--color-text-primary)',
            }}
          >
            {article.content.split('\n').map((para, i) =>
              para.trim() ? (
                <p key={i} style={{ marginBottom: 22 }}>{para}</p>
              ) : null
            )}
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div
              style={{
                display:    'flex',
                flexWrap:   'wrap',
                gap:        8,
                marginTop:  40,
                paddingTop: 28,
                borderTop:  '1px solid var(--color-border)',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginRight: 4 }}>
                Tags:
              </span>
              {article.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    fontSize:    12,
                    fontWeight:  600,
                    color:       'var(--color-accent)',
                    background:  'var(--color-accent-glow)',
                    border:      '1px solid var(--color-border-focus)',
                    borderRadius: 999,
                    padding:     '4px 12px',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Back button */}
          <div style={{ marginTop: 48 }}>
            <button
              className="btn-primary px-8 py-3 text-sm"
              onClick={() => navigate('/news')}
            >
              ← More Articles
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetailPage;
