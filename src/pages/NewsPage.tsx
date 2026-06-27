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

/* ─── Demo Data ─── */
const DEMO_NEWS: NewsArticle[] = [
  {
    _id: 'demo-1',
    title: 'AI-Powered Fact-Checking Tools Are Changing How We Consume News',
    summary: 'New generation of machine learning models can now detect misinformation with over 94% accuracy, revolutionizing digital media verification worldwide.',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop',
    author: 'Sarah Mitchell',
    source: 'TechInsider',
    tags: ['AI', 'Fact-checking', 'Machine Learning'],
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    featured: true,
  },
  {
    _id: 'demo-2',
    title: 'Social Media Platforms Double Down on Misinformation Policies Ahead of Elections',
    summary: 'Major platforms including Meta, Twitter/X, and TikTok announce sweeping new content moderation policies targeting political deepfakes and coordinated inauthentic behavior.',
    category: 'Media',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop',
    author: 'James Okonkwo',
    source: 'MediaWatch',
    tags: ['Social Media', 'Elections', 'Policy'],
    publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    featured: true,
  },
  {
    _id: 'demo-3',
    title: 'WHO Warns of Dangerous Health Misinformation Surge on Short-Video Apps',
    summary: 'The World Health Organization releases new report showing a 340% increase in health-related false claims on platforms like TikTok and Instagram Reels since 2023.',
    category: 'Health',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop',
    author: 'Dr. Amara Diallo',
    source: 'WHO Report',
    tags: ['Health', 'WHO', 'Misinformation'],
    publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    featured: false,
  },
  {
    _id: 'demo-4',
    title: 'Deepfake Detection Research Reaches New Milestone with 99% Precision',
    summary: 'A team of researchers at MIT and Stanford have developed a neural network capable of identifying AI-generated video content with near-perfect precision even in compressed formats.',
    category: 'Science',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop',
    author: 'Prof. Lena Hoffman',
    source: 'ScienceDaily',
    tags: ['Deepfake', 'Research', 'Neural Network'],
    publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    featured: false,
  },
  {
    _id: 'demo-5',
    title: 'Government to Introduce Digital Literacy Curriculum in All Public Schools',
    summary: 'The Ministry of Education announces a national initiative to teach students how to spot fake news, verify sources, and understand algorithmic content bias starting next academic year.',
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&auto=format&fit=crop',
    author: 'Rajesh Kumar',
    source: 'The Daily Post',
    tags: ['Education', 'Policy', 'Digital Literacy'],
    publishedAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    featured: false,
  },
  {
    _id: 'demo-6',
    title: 'New Browser Extension Flags Unverified News in Real Time',
    summary: 'A viral browser extension now used by over 3 million users highlights potentially misleading articles and attaches credibility scores directly in your feed.',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop',
    author: 'Chen Wei',
    source: 'ProductHunt',
    tags: ['Browser', 'Extension', 'Tools'],
    publishedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    featured: false,
  },
  {
    _id: 'demo-7',
    title: 'Climate Change Disinformation Campaigns Linked to Fossil Fuel Lobbyists',
    summary: 'An investigative report exposes a coordinated network of websites and social accounts that have systematically spread misleading climate data, with ties to fossil fuel industry donors.',
    category: 'Science',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop',
    author: 'Fatima Al-Rashid',
    source: 'The Guardian',
    tags: ['Climate', 'Disinformation', 'Investigation'],
    publishedAt: new Date(Date.now() - 36 * 3600000).toISOString(),
    featured: false,
  },
  {
    _id: 'demo-8',
    title: 'Journalists Report Surge in AI-Generated Press Releases from Unknown Sources',
    summary: 'Newsrooms around the world are reporting that an increasing number of press releases are being auto-generated by AI and sent under the names of non-existent organizations.',
    category: 'Media',
    imageUrl: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=800&auto=format&fit=crop',
    author: 'Michael Tan',
    source: 'Columbia Journalism',
    tags: ['AI', 'Journalism', 'Press'],
    publishedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    featured: false,
  },
  {
    _id: 'demo-9',
    title: 'Study: People Who Verify News Before Sharing Are 6x Less Likely to Spread Falsehoods',
    summary: 'A landmark behavioral study involving 120,000 participants across 15 countries shows that simple habits like pausing to check a source dramatically reduce misinformation sharing.',
    category: 'Health',
    imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&auto=format&fit=crop',
    author: 'Dr. Priya Nair',
    source: 'Nature Human Behaviour',
    tags: ['Psychology', 'Study', 'Behaviour'],
    publishedAt: new Date(Date.now() - 60 * 3600000).toISOString(),
    featured: false,
  },
  {
    _id: 'demo-10',
    title: 'Bangladesh Media Regulators Propose New Guidelines for Online News Portals',
    summary: 'The Bangladesh Telecommunication Regulatory Commission releases draft guidelines requiring online news portals to register, disclose ownership, and implement content moderation systems.',
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&auto=format&fit=crop',
    author: 'Sumaiya Islam',
    source: 'BD News Desk',
    tags: ['Bangladesh', 'Media', 'Regulation'],
    publishedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    featured: false,
  },
  {
    _id: 'demo-11',
    title: 'Viral Image of Flooded City Was Actually From 3 Years Ago — Fact Check',
    summary: 'An image circulating on social media claiming to show recent flooding in a major city has been verified by reverse image search to originate from a 2021 monsoon event.',
    category: 'Media',
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop',
    author: 'Ananya Roy',
    source: 'FactCheck BD',
    tags: ['Image Verification', 'Flood', 'Fact Check'],
    publishedAt: new Date(Date.now() - 90 * 3600000).toISOString(),
    featured: false,
  },
  {
    _id: 'demo-12',
    title: 'How Language Models Are Being Used to Generate Fake News at Scale',
    summary: 'Researchers demonstrate how large language models can be fine-tuned to produce highly convincing fake news articles, and the countermeasures being developed to detect them.',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&auto=format&fit=crop',
    author: 'Alex Turner',
    source: 'Wired',
    tags: ['LLM', 'Fake News', 'AI Generation'],
    publishedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    featured: false,
  },
];

const DEMO_LIVE_FEEDS: LiveFeedArticle[] = [
  // Jamuna TV
  { id: 'jt-1', title: 'দেশে করোনার নতুন ভ্যারিয়েন্ট শনাক্ত, স্বাস্থ্য মন্ত্রণালয়ের সতর্কতা জারি', link: 'https://www.jamuna.tv', imageUrl: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=600&auto=format&fit=crop', source: 'Jamuna TV', category: 'Health' },
  { id: 'jt-2', title: 'ঢাকায় বড় সড়ক দুর্ঘটনায় ৫ জন নিহত, আহত অনেকে', link: 'https://www.jamuna.tv', imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop', source: 'Jamuna TV', category: 'National' },
  { id: 'jt-3', title: 'জাতীয় নির্বাচনের তারিখ ঘোষণা করলেন নির্বাচন কমিশন', link: 'https://www.jamuna.tv', imageUrl: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=600&auto=format&fit=crop', source: 'Jamuna TV', category: 'National' },
  { id: 'jt-4', title: 'বাংলাদেশ ক্রিকেট দলের নতুন কোচ নিয়োগ দিলো বিসিবি', link: 'https://www.jamuna.tv', imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop', source: 'Jamuna TV', category: 'Sports' },
  { id: 'jt-5', title: 'শেয়ার বাজারে বড় ধস, বিনিয়োগকারীদের উদ্বেগ বাড়ছে', link: 'https://www.jamuna.tv', imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop', source: 'Jamuna TV', category: 'National' },
  { id: 'jt-6', title: 'দেশের সেরা বিশ্ববিদ্যালয়গুলোতে ভর্তি পরীক্ষার সময়সূচি প্রকাশ', link: 'https://www.jamuna.tv', imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop', source: 'Jamuna TV', category: 'Health' },
  { id: 'jt-7', title: 'চট্টগ্রাম বন্দরে নতুন কন্টেইনার টার্মিনাল উদ্বোধন', link: 'https://www.jamuna.tv', imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop', source: 'Jamuna TV', category: 'National' },
  { id: 'jt-8', title: 'জলবায়ু পরিবর্তন মোকাবেলায় বাংলাদেশের নতুন পরিকল্পনা', link: 'https://www.jamuna.tv', imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop', source: 'Jamuna TV', category: 'National' },
  // Somoy News
  { id: 'sn-1', title: 'সারাদেশে ভারী বৃষ্টিপাতের পূর্বাভাস, নিম্নাঞ্চল প্লাবিত হওয়ার আশঙ্কা', link: 'https://www.somoynews.tv', imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600&auto=format&fit=crop', source: 'Somoy News', category: 'National' },
  { id: 'sn-2', title: 'আইসিসি র‍্যাংকিংয়ে শীর্ষে বাংলাদেশের সাকিব আল হাসান', link: 'https://www.somoynews.tv', imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&auto=format&fit=crop', source: 'Somoy News', category: 'Sports' },
  { id: 'sn-3', title: 'প্রধানমন্ত্রীর কার্যালয়ে নতুন ডিজিটাল সেবা চালু', link: 'https://www.somoynews.tv', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop', source: 'Somoy News', category: 'National' },
  { id: 'sn-4', title: 'ডেঙ্গু মহামারী নিয়ন্ত্রণে সিটি কর্পোরেশনের বিশেষ অভিযান', link: 'https://www.somoynews.tv', imageUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&auto=format&fit=crop', source: 'Somoy News', category: 'Health' },
  { id: 'sn-5', title: 'পদ্মা সেতুতে যানবাহন চলাচলে রেকর্ড সংখ্যক টোল আদায়', link: 'https://www.somoynews.tv', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop', source: 'Somoy News', category: 'National' },
  { id: 'sn-6', title: 'বাংলাদেশ জাতীয় ফুটবল দল ফিফা র‍্যাংকিংয়ে উন্নতি করেছে', link: 'https://www.somoynews.tv', imageUrl: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=600&auto=format&fit=crop', source: 'Somoy News', category: 'Sports' },
  { id: 'sn-7', title: 'রোহিঙ্গা সংকট সমাধানে জাতিসংঘের নতুন প্রস্তাব', link: 'https://www.somoynews.tv', imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop', source: 'Somoy News', category: 'National' },
  { id: 'sn-8', title: 'নতুন ওষুধ আবিষ্কারে বাংলাদেশি বিজ্ঞানীদের সাফল্য', link: 'https://www.somoynews.tv', imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop', source: 'Somoy News', category: 'Health' },
];

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
      const fetched = dedupeArticles(Array.isArray(data.data) ? data.data : []);
      setArticles(fetched.length > 0 ? fetched : DEMO_NEWS);
    } catch {
      // Backend unavailable — use demo data
      const filtered = cat === 'All' ? DEMO_NEWS : DEMO_NEWS.filter(a => a.category === cat);
      setArticles(filtered);
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
      const fetched = Array.isArray(data.data) ? data.data : [];
      setFeedArticles(fetched.length > 0 ? fetched : DEMO_LIVE_FEEDS);
    } catch {
      // Backend unavailable — use demo data
      const filtered = src === 'All' ? DEMO_LIVE_FEEDS : DEMO_LIVE_FEEDS.filter(a => a.source === src);
      setFeedArticles(filtered);
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
