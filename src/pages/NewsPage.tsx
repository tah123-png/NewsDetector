import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SubPageNav from '../Components/SubPageNav';

/* ─── Types ─── */
interface NewsArticle {
  _id: string;
  title: string;
  summary: string;
  category: string;
  imageUrl: string;
  author: string;
  source: string;
  tags: string[];
  publishedAt: string;
  featured: boolean;
}

interface FactCheckArticle {
  id: string;
  title: string;
  link: string;
  imageUrl: string;
  category: string;
  source: string;
}

interface LiveFeedArticle {
  id: string;
  title: string;
  link: string;
  imageUrl: string;
  source: 'Jamuna TV' | 'Somoy News';
  category: string;
}

/* ─── Constants ─── */
const NEWS_CATEGORIES = ['All', 'Technology', 'Health', 'Politics', 'Science', 'Media'];
const FACT_CATEGORIES = ['All', 'National', 'Politics', 'Education', 'Science & Tech', 'Health'];
const LIVEFEED_SOURCES = ['All', 'Jamuna TV', 'Somoy News'];

const categoryColors: Record<string, string> = {
  Technology: 'var(--color-accent)',
  Health: '#10b981',
  Politics: '#f59e0b',
  Science: '#8b5cf6',
  Media: '#ef4444',
  General: 'var(--color-text-muted)',
  National: '#3b82f6',
  Education: '#06b6d4',
  'Science & Tech': '#8b5cf6',
  Sports: '#f97316',
};

const sourceColors: Record<string, string> = {
  'Jamuna TV': '#e11d48',
  'Somoy News': '#0284c7',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return `${mins}m ago`;
}

/* ─── Main Component ─── */
const NewsPage = () => {
  const navigate = useNavigate();

  // Tab state
  const [activeTab, setActiveTab] = useState<'news' | 'livefeeds'>('news');

  // News state
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All');
  // Live feeds state
  const [feedArticles, setFeedArticles] = useState<LiveFeedArticle[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState('');
  const [feedSource, setFeedSource] = useState('All');
  const [feedScraping, setFeedScraping] = useState(false);
  // Per-source category filters
  const [jamunaCategory, setJamunaCategory] = useState('All');
  const [somoyCategory, setSomoyCategory] = useState('All');

  /* ── Fetchers ── */
  const dedupeArticles = (items: NewsArticle[]) => {
    const seen = new Set<string>();
    return items.filter((item) => {
      const key = [item.title, item.source, item.publishedAt]
        .map(value => String(value || '').trim().toLowerCase())
        .join('|');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const fetchNews = async (cat: string) => {
    try {
      setLoading(true); setError('');
      const params = new URLSearchParams({ limit: '50' });
      if (cat !== 'All') params.set('category', cat);
      const res = await fetch(`http://localhost:5000/api/news?${params}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setArticles(dedupeArticles(Array.isArray(data.data) ? data.data : []));
    } catch {
      setError('Failed to load news. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveFeeds = async (src: string) => {
    try {
      setFeedLoading(true); setFeedError('');
      const params = new URLSearchParams();
      if (src !== 'All') params.set('source', src);
      const res = await fetch(`http://localhost:5000/api/livefeeds?${params}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setFeedArticles(Array.isArray(data.data) ? data.data : []);
    } catch {
      setFeedError('Failed to load live feeds. Please try again.');
    } finally {
      setFeedLoading(false);
    }
  };

  /* ── Scrape triggers ── */
  const triggerFeedScrape = async () => {
    try {
      setFeedScraping(true);
      await fetch('http://localhost:5000/api/livefeeds/scrape', { method: 'POST' });
      setTimeout(() => { fetchLiveFeeds(feedSource); setFeedScraping(false); }, 60000);
    } catch { setFeedScraping(false); }
  };

  /* ── Effects ── */
  useEffect(() => {
    const seed = async () => {
      try { await fetch('http://localhost:5000/api/news/seed', { method: 'POST' }); } catch { /* ignore */ }
      fetchNews('All');
    };
    seed();
    fetchLiveFeeds('All');
  }, []);

  useEffect(() => { fetchNews(category); }, [category]);
  useEffect(() => { fetchLiveFeeds(feedSource); }, [feedSource]);

  /* ── Derived collections (no search filter) ── */
  const filteredNews = articles;
  const featured = articles.filter(a => a.featured);
  const regular = articles.filter(a => !a.featured);
  const filteredFeed = feedArticles;

  /* ── Derived state per tab ── */
  const isNews = activeTab === 'news';
  const isLiveFeeds = activeTab === 'livefeeds';

  const cats = isNews ? NEWS_CATEGORIES : LIVEFEED_SOURCES;
  const activeCat = isNews ? category : feedSource;
  const setActiveCat = isNews ? setCategory : setFeedSource;
  const isLoading = isNews ? loading : feedLoading;
  const activeError = isNews ? error : feedError;

  return (
    <div className="min-h-screen bg-bg-primary">
      <SubPageNav />

      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden py-20 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)' }}
      >
        <div aria-hidden style={{ position: 'absolute', top: '-30%', left: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', bottom: '-20%', right: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)', pointerEvents: 'none', opacity: 0.6 }} />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-accent-glow border border-border-focus rounded-full px-4 py-1.5 mb-6 text-[11px] font-semibold text-accent tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Latest Updates
          </div>
          <h1 className="font-display text-[clamp(28px,5vw,52px)] font-extrabold tracking-tight text-txt-primary mb-4">
            News &amp; <span className="gradient-text">Media Insights</span>
          </h1>
          <p className="text-txt-secondary text-[clamp(14px,2vw,17px)] leading-relaxed mb-8">
            Stay informed with the latest developments in misinformation research,
            AI verification technology, and digital media literacy.
          </p>

          {/* Tab switcher */}
          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            {(['news', 'livefeeds'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 24px',
                  borderRadius: 999,
                  border: '1.5px solid',
                  borderColor: activeTab === tab ? 'var(--color-accent)' : 'var(--color-border)',
                  background: activeTab === tab
                    ? 'linear-gradient(135deg, var(--color-accent), var(--color-accent-2))'
                    : 'var(--color-bg-secondary)',
                  color: activeTab === tab ? '#fff' : 'var(--color-text-secondary)',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.01em',
                }}
              >
                {tab === 'news' ? '📰 News Articles' : '🗞️ Live Feeds'}
              </button>
            ))}
          </div>


        </div>
      </div>

      {/* ── Category / Source tabs ── */}
      <div className="sticky top-0 z-40 border-b border-border-base" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            {cats.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                style={{
                  padding: '7px 18px',
                  borderRadius: 999,
                  border: '1.5px solid',
                  borderColor: activeCat === cat ? 'var(--color-accent)' : 'transparent',
                  background: activeCat === cat
                    ? 'linear-gradient(135deg, var(--color-accent), var(--color-accent-2))'
                    : 'var(--color-bg-input)',
                  color: activeCat === cat ? '#fff' : 'var(--color-text-secondary)',
                  fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  whiteSpace: 'nowrap', transition: 'all 0.2s ease',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {cat}
              </button>
            ))}

            {/* Refresh button — live feeds tab */}
            {isLiveFeeds && (
              <button
                onClick={triggerFeedScrape}
                disabled={feedScraping}
                style={{
                  padding: '7px 16px', borderRadius: 999,
                  border: '1.5px solid var(--color-border)',
                  background: 'var(--color-bg-input)',
                  color: feedScraping ? 'var(--color-text-muted)' : 'var(--color-accent)',
                  fontWeight: 600, fontSize: 13,
                  cursor: feedScraping ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap', transition: 'all 0.2s ease',
                  fontFamily: 'Inter, sans-serif',
                  marginLeft: 'auto',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                  className={feedScraping ? 'animate-spin' : ''}>
                  <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                {feedScraping ? 'Scraping…' : 'Refresh'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="animate-spin-slow" style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--color-border)', borderTopColor: 'var(--color-accent)' }} />
            <p className="text-txt-secondary text-sm font-medium">
              {isNews ? 'Loading articles…' : 'Loading live feeds…'}
            </p>
          </div>
        )}

        {/* Error */}
        {activeError && !isLoading && (
          <div className="text-center py-20" style={{ background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger-border)', borderRadius: 16, padding: '2rem' }}>
            <p style={{ color: 'var(--color-danger)', fontWeight: 600, marginBottom: 12 }}>{activeError}</p>
            <button className="btn-primary px-6 py-2.5 text-sm"
              onClick={() => isNews ? fetchNews(category) : fetchLiveFeeds(feedSource)}>
              Retry
            </button>
          </div>
        )}

        {/* ── NEWS TAB ── */}
        {isNews && !loading && !error && (
          <>
            {featured.length > 0 && (
              <section className="mb-14">
                <h2 className="text-txt-primary font-display font-bold text-xl mb-6 flex items-center gap-2">
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block' }} />
                  Featured
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featured.map((article, i) => (
                    <NewsCard key={article._id} article={article} onClick={() => navigate(`/news/${article._id}`)} large delay={i * 0.08} />
                  ))}
                </div>
              </section>
            )}
            {regular.length > 0 && (
              <section>
                {featured.length > 0 && (
                  <h2 className="text-txt-primary font-display font-bold text-xl mb-6 flex items-center gap-2">
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block' }} />
                    Latest Articles
                  </h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regular.map((article, i) => (
                    <NewsCard key={article._id} article={article} onClick={() => navigate(`/news/${article._id}`)} delay={i * 0.06} />
                  ))}
                </div>
              </section>
            )}
            {filteredNews.length === 0 && (
              <div className="text-center py-32">
                <div style={{ fontSize: 48, marginBottom: 16 }}>📰</div>
                <p className="text-txt-secondary font-medium text-lg">No articles found.</p>
                <p className="text-txt-muted text-sm mt-2">Try a different category or search term.</p>
              </div>
            )}
          </>
        )}


        {/* ── LIVE FEEDS TAB ── */}
        {isLiveFeeds && !feedLoading && !feedError && (() => {
          // Group by source, then by category within each source
          const SOURCES = ['Jamuna TV', 'Somoy News'] as const;
          const FEED_CATEGORIES = ['All', 'National', 'Sports', 'Health'];
          const sourceConfig = {
            'Jamuna TV': { gradient: 'linear-gradient(135deg,#e11d48,#be123c)', abbr: 'JT', emoji: '📺', activeCat: jamunaCategory, setActiveCat: setJamunaCategory },
            'Somoy News': { gradient: 'linear-gradient(135deg,#0284c7,#0369a1)', abbr: 'SN', emoji: '📡', activeCat: somoyCategory, setActiveCat: setSomoyCategory },
          } as const;

          const grouped: Record<string, Record<string, typeof filteredFeed>> = {};
          for (const src of SOURCES) grouped[src] = {};
          for (const article of filteredFeed) {
            const src = article.source;
            const cat = article.category || 'General';
            if (!grouped[src]) grouped[src] = {};
            if (!grouped[src][cat]) grouped[src][cat] = [];
            grouped[src][cat].push(article);
          }

          const anySrc = SOURCES.some(s => Object.keys(grouped[s]).length > 0);
          if (!anySrc) return (
            <div className="text-center py-32">
              <div style={{ fontSize: 48, marginBottom: 16 }}>🗞️</div>
              <p className="text-txt-secondary font-medium text-lg">No live feed articles found.</p>
              <p className="text-txt-muted text-sm mt-2">
                Try a different source filter, or click <strong>Refresh</strong> to run the scraper.
              </p>
            </div>
          );

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
              {SOURCES.map(src => {
                const allCats = Object.keys(grouped[src]);
                if (!allCats.length) return null;
                const cfg = sourceConfig[src];
                const totalCount = allCats.reduce((n, c) => n + grouped[src][c].length, 0);

                // Apply per-source category filter
                const activeSrcCat = cfg.activeCat;
                const visibleCats = activeSrcCat === 'All'
                  ? allCats
                  : allCats.filter(c => c.toLowerCase() === activeSrcCat.toLowerCase());

                return (
                  <div key={src}>
                    {/* ── Source header ── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: cfg.gradient,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 15, fontWeight: 800, flexShrink: 0,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                      }}>{cfg.abbr}</div>
                      <div>
                        <h2 style={{
                          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
                          fontSize: 22, color: 'var(--color-text-primary)', margin: 0,
                          display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                          {cfg.emoji} {src}
                          <span style={{
                            fontSize: 13, fontWeight: 500,
                            color: 'var(--color-text-muted)', marginLeft: 4,
                          }}>({totalCount} articles)</span>
                        </h2>
                        <div style={{ height: 3, width: 60, borderRadius: 99, background: cfg.gradient, marginTop: 6 }} />
                      </div>
                    </div>

                    {/* ── Per-source category filter buttons ── */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                      {FEED_CATEGORIES.map(cat => {
                        const isActive = activeSrcCat === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => cfg.setActiveCat(cat)}
                            style={{
                              padding: '6px 16px',
                              borderRadius: 999,
                              border: '1.5px solid',
                              borderColor: isActive ? 'transparent' : 'var(--color-border)',
                              background: isActive ? cfg.gradient : 'var(--color-bg-input)',
                              color: isActive ? '#fff' : 'var(--color-text-secondary)',
                              fontWeight: 600, fontSize: 13,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              fontFamily: 'Inter, sans-serif',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>

                    {/* ── Category sub-sections ── */}
                    {visibleCats.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--color-text-muted)', fontSize: 14 }}>
                        No articles found for <strong>{activeSrcCat}</strong> in {src}.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
                        {visibleCats.map(cat => {
                          const catColor = categoryColors[cat] ?? categoryColors['General'] ?? '#6b7280';
                          const articles = grouped[src][cat];
                          return (
                            <div key={cat}>
                              {/* Sub-section label */}
                              <div style={{
                                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
                                paddingBottom: 10, borderBottom: '1px solid var(--color-border)',
                              }}>
                                <span style={{
                                  width: 10, height: 10, borderRadius: '50%',
                                  background: catColor, display: 'inline-block', flexShrink: 0,
                                }} />
                                <h3 style={{
                                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                                  fontSize: 15, color: catColor, margin: 0,
                                  textTransform: 'uppercase', letterSpacing: '0.06em',
                                }}>{cat}</h3>
                                <span style={{
                                  fontSize: 12, color: 'var(--color-text-muted)',
                                  background: 'var(--color-bg-input)',
                                  padding: '2px 8px', borderRadius: 999,
                                }}>{articles.length}</span>
                              </div>
                              {/* Cards */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {articles.map((article, i) => (
                                  <LiveFeedCard key={article.id} article={article} delay={i * 0.05} />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}

      </div>
    </div>
  );
};

/* ── NewsCard component ── */
interface NewsCardProps {
  article: NewsArticle;
  onClick: () => void;
  large?: boolean;
  delay?: number;
}

const NewsCard = ({ article, onClick, large = false, delay = 0 }: NewsCardProps) => {
  const catColor = categoryColors[article.category] ?? categoryColors['General'];
  return (
    <article onClick={onClick} className="glass-card hover-card-animate overflow-hidden cursor-pointer group animate-fade-up"
      style={{ animationDelay: `${delay}s`, opacity: 0, animationFillMode: 'forwards', display: 'flex', flexDirection: 'column' }}
      tabIndex={0} onKeyDown={e => e.key === 'Enter' && onClick()} role="button" aria-label={`Read article: ${article.title}`}>
      {article.imageUrl && (
        <div style={{ height: large ? 220 : 180, overflow: 'hidden', flexShrink: 0 }}>
          <img src={article.imageUrl} alt={article.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            className="group-hover:scale-105"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      )}
      <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: catColor, background: `${catColor}18`, padding: '3px 10px', borderRadius: 999 }}>
            {article.category}
          </span>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{timeAgo(article.publishedAt)}</span>
        </div>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: large ? 19 : 16, lineHeight: 1.35, color: 'var(--color-text-primary)', marginBottom: 10, transition: 'color 0.2s' }} className="group-hover:text-accent">
          {article.title}
        </h3>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-secondary)', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {article.summary}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
              {article.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>{article.author}</div>
              {article.source && <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{article.source}</div>}
            </div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: 4, transition: 'gap 0.2s' }} className="group-hover:gap-2">
            Read
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
};

/* ── LiveFeedCard component ── */
interface LiveFeedCardProps { article: LiveFeedArticle; delay?: number; }

const LiveFeedCard = ({ article, delay = 0 }: LiveFeedCardProps) => {
  const srcColor = sourceColors[article.source] ?? '#6b7280';
  const catColor = categoryColors[article.category] ?? categoryColors['General'];
  const isJamuna = article.source === 'Jamuna TV';

  return (
    <a href={article.link} target="_blank" rel="noopener noreferrer"
      className="glass-card hover-card-animate overflow-hidden cursor-pointer group animate-fade-up"
      style={{ animationDelay: `${delay}s`, opacity: 0, animationFillMode: 'forwards', display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>

      {/* Image */}
      {article.imageUrl ? (
        <div style={{ height: 180, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
          <img src={article.imageUrl} alt={article.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            className="group-hover:scale-105"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          {/* Source badge */}
          <div style={{ position: 'absolute', top: 10, left: 10, background: isJamuna ? 'linear-gradient(135deg,#e11d48,#be123c)' : 'linear-gradient(135deg,#0284c7,#0369a1)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 999, letterSpacing: '0.06em', textTransform: 'uppercase', boxShadow: `0 2px 8px ${srcColor}55` }}>
            {article.source}
          </div>
          {/* Category badge */}
          {article.category !== 'General' && (
            <div style={{ position: 'absolute', top: 10, right: 10, background: `${catColor}dd`, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {article.category}
            </div>
          )}
        </div>
      ) : (
        /* Placeholder when no image */
        <div style={{ height: 100, flexShrink: 0, background: `linear-gradient(135deg, ${srcColor}22, ${srcColor}44)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <span style={{ fontSize: 36 }}>{isJamuna ? '📺' : '📡'}</span>
          <div style={{ position: 'absolute', top: 10, left: 10, background: isJamuna ? 'linear-gradient(135deg,#e11d48,#be123c)' : 'linear-gradient(135deg,#0284c7,#0369a1)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 999, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {article.source}
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, lineHeight: 1.5, color: 'var(--color-text-primary)', marginBottom: 14, transition: 'color 0.2s', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} className="group-hover:text-accent">
          {article.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: isJamuna ? 'linear-gradient(135deg,#e11d48,#be123c)' : 'linear-gradient(135deg,#0284c7,#0369a1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 800, flexShrink: 0 }}>
              {isJamuna ? 'JT' : 'SN'}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>{article.source}</div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: 4, transition: 'gap 0.2s' }} className="group-hover:gap-2">
            Read
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
};

export default NewsPage;
