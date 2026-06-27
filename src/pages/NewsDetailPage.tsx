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

/* ── Demo article detail content ── */
const DEMO_ARTICLES: Record<string, NewsArticle> = {
  'demo-1': {
    _id: 'demo-1', featured: true,
    title: 'AI-Powered Fact-Checking Tools Are Changing How We Consume News',
    summary: 'New generation of machine learning models can now detect misinformation with over 94% accuracy, revolutionizing digital media verification worldwide.',
    content: `Artificial intelligence is rapidly transforming the landscape of news verification. A new wave of machine learning models, trained on billions of articles and social media posts, can now flag misleading content with unprecedented accuracy.\n\nResearchers at leading universities have developed multi-modal AI systems capable of analyzing text, images, video, and audio simultaneously. These tools cross-reference claims against thousands of trusted databases in milliseconds, offering fact-checkers a powerful new weapon against the spread of disinformation.\n\n"This is a game changer," said Dr. Elena Vasquez, lead researcher at the Digital Media Lab. "For the first time, we have tools that can keep up with the speed of misinformation spread on social media."\n\nSeveral major news organizations have already integrated these tools into their workflows. Reuters, the Associated Press, and AFP are piloting AI-assisted verification systems that alert journalists to potentially false claims before publication.\n\nHowever, experts caution that AI alone cannot solve the misinformation crisis. Human judgment remains essential, particularly for nuanced political claims where context is everything. The most effective approaches combine AI speed with human expertise.\n\nThe technology is also being adapted for consumer use. Browser extensions powered by these models can now display credibility scores next to links in social media feeds, giving everyday users real-time guidance on the reliability of content they encounter.`,
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop',
    author: 'Sarah Mitchell', source: 'TechInsider',
    tags: ['AI', 'Fact-checking', 'Machine Learning'],
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  'demo-2': {
    _id: 'demo-2', featured: true,
    title: 'Social Media Platforms Double Down on Misinformation Policies Ahead of Elections',
    summary: 'Major platforms including Meta, Twitter/X, and TikTok announce sweeping new content moderation policies targeting political deepfakes and coordinated inauthentic behavior.',
    content: `With major elections approaching across Europe, Asia, and the Americas, social media giants are facing intense pressure to tighten their content moderation policies. This week, Meta, X (formerly Twitter), and TikTok announced a coordinated set of new measures targeting political misinformation.\n\nMeta unveiled a new "Election Information Centre" that will be activated in countries holding national votes in the coming months. The center will surface authoritative information from electoral commissions directly in users' feeds and apply additional labels to AI-generated political content.\n\nX, under the leadership of Elon Musk, announced an expanded Community Notes program that will allow more users globally to add fact-checking context to misleading tweets. Critics have questioned whether the crowdsourced approach is sufficient to counter sophisticated influence operations.\n\nTikTok, which has faced particular scrutiny over its Chinese ownership, pledged to remove content that seeks to suppress voter participation or spread false information about electoral processes. The platform will also limit political advertising in the weeks before elections.\n\nCivil society organizations welcomed the announcements but called for greater transparency. "We need to see real data on how many pieces of misinformation are being removed, not just policy documents," said Maria Chen of the Digital Rights Foundation.\n\nThe stakes are high. Research shows that election-related misinformation is among the most damaging forms of false content, capable of suppressing turnout, inflaming political tensions, and undermining trust in democratic institutions.`,
    category: 'Media',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop',
    author: 'James Okonkwo', source: 'MediaWatch',
    tags: ['Social Media', 'Elections', 'Policy'],
    publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  'demo-3': {
    _id: 'demo-3', featured: false,
    title: 'WHO Warns of Dangerous Health Misinformation Surge on Short-Video Apps',
    summary: 'The World Health Organization releases new report showing a 340% increase in health-related false claims on platforms like TikTok and Instagram Reels since 2023.',
    content: `The World Health Organization has issued a stark warning about the explosive growth of health misinformation on short-form video platforms. A new report from the agency documents a 340% increase in false or misleading health claims on TikTok and Instagram Reels between 2023 and 2025.\n\nThe most common false claims involve miracle cures, vaccine misinformation, and dangerous dietary advice. Researchers found that videos promoting unproven cancer treatments garnered over 2 billion views in the past year alone.\n\n"The algorithm-driven nature of these platforms means that sensational health claims spread far faster than accurate medical information," said Dr. Tedros Adhanom Ghebreyesus, WHO Director-General. "This is not just a digital problem — it has real consequences for public health."\n\nThe report highlights a troubling trend of medical professionals and influencers spreading conflicting information, making it difficult for the public to identify reliable sources. AI-generated health content has also proliferated, with synthetic voices and faces lending false credibility to dangerous claims.\n\nThe WHO is calling on platforms to partner with health authorities to develop dedicated fact-checking systems for medical content and to algorithmically downrank content that contradicts established medical consensus.`,
    category: 'Health',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop',
    author: 'Dr. Amara Diallo', source: 'WHO Report',
    tags: ['Health', 'WHO', 'Misinformation'],
    publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
  'demo-4': {
    _id: 'demo-4', featured: false,
    title: 'Deepfake Detection Research Reaches New Milestone with 99% Precision',
    summary: 'A team of researchers at MIT and Stanford have developed a neural network capable of identifying AI-generated video content with near-perfect precision even in compressed formats.',
    content: `Scientists at the Massachusetts Institute of Technology and Stanford University have announced a breakthrough in deepfake detection technology. Their new neural network, dubbed "TruthNet," can identify AI-generated video content with 99.1% precision — even after the video has been compressed and re-uploaded multiple times.\n\nPrevious detection systems struggled with compressed videos because the compression process destroys many of the subtle artifacts that betray AI-generated content. TruthNet overcomes this limitation by focusing on micro-inconsistencies in lighting, skin texture, and eye movement that survive the compression process.\n\n"The key insight was to look at biological signals that are incredibly difficult to fake," explained Prof. David Kim, the project's lead researcher. "Human blinking patterns, skin micro-pulsations driven by blood flow — these are near impossible for current AI models to replicate convincingly."\n\nThe technology has been licensed to several social media platforms and is being integrated into content moderation pipelines. An open-source version of the model will be made available to researchers and journalists through the newly established Deepfake Detection Initiative.\n\nExperts caution that the arms race between detection and generation technologies will continue, and that no technical solution alone can address the social harms caused by deepfakes. Policy interventions and digital literacy education remain essential complements.`,
    category: 'Science',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop',
    author: 'Prof. Lena Hoffman', source: 'ScienceDaily',
    tags: ['Deepfake', 'Research', 'Neural Network'],
    publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  'demo-5': {
    _id: 'demo-5', featured: false,
    title: 'Government to Introduce Digital Literacy Curriculum in All Public Schools',
    summary: 'The Ministry of Education announces a national initiative to teach students how to spot fake news, verify sources, and understand algorithmic content bias starting next academic year.',
    content: `The Ministry of Education has unveiled a landmark initiative to embed digital literacy across the national school curriculum. Starting from the next academic year, students from Grade 6 through Grade 12 will receive structured instruction in critical thinking, source verification, and understanding how social media algorithms shape the information they see.\n\nThe curriculum, developed in collaboration with leading universities and civil society organizations, covers a range of topics including how to identify clickbait and sensationalism, how to perform reverse image searches, how to distinguish between opinion and fact, and how to recognize common logical fallacies used in propaganda.\n\n"We are preparing students for a world where misinformation is everywhere," said the Minister of Education at the announcement ceremony. "Digital literacy is now as fundamental as reading and writing."\n\nThe program will train 45,000 teachers over the next 18 months. Free digital resources, including interactive exercises and a classroom fact-checking toolkit, will be made available to all public schools.\n\nPilot programs run in 200 schools over the past two years showed promising results. Students who completed the program were significantly better at identifying false news articles and reported higher confidence in evaluating online content.`,
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&auto=format&fit=crop',
    author: 'Rajesh Kumar', source: 'The Daily Post',
    tags: ['Education', 'Policy', 'Digital Literacy'],
    publishedAt: new Date(Date.now() - 18 * 3600000).toISOString(),
  },
  'demo-6': {
    _id: 'demo-6', featured: false,
    title: 'New Browser Extension Flags Unverified News in Real Time',
    summary: 'A viral browser extension now used by over 3 million users highlights potentially misleading articles and attaches credibility scores directly in your feed.',
    content: `A browser extension designed to flag unverified news claims in real time has gone viral, amassing over 3 million users in just four months since its public launch. The extension, called "VerifyNow," overlays credibility scores on links and articles as users browse social media and news sites.\n\nThe tool uses a combination of natural language processing, source reputation databases, and cross-referencing with major fact-checking organizations to assess the reliability of online content. A color-coded badge appears next to every link — green for verified, yellow for uncertain, and red for content flagged by multiple fact-checkers.\n\n"We wanted to meet people where they already are — in their feeds, not on a separate fact-checking website they'll never visit," said the extension's creator. "The friction of leaving a platform is too high. We needed to bring the information to users instantly."\n\nThe rapid adoption has drawn both praise and criticism. Supporters call it a vital tool for fighting misinformation at scale. Critics worry about the potential for false positives, algorithmic bias, and the concentration of truth-determination power in a single tool.\n\nThe development team has pledged to make the extension's credibility scoring methodology open-source, and has established an independent advisory board including journalists, academics, and civil liberties advocates.`,
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop',
    author: 'Chen Wei', source: 'ProductHunt',
    tags: ['Browser', 'Extension', 'Tools'],
    publishedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
};

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
        // Check demo articles first
        if (id && DEMO_ARTICLES[id]) {
          setArticle(DEMO_ARTICLES[id]);
          setLoading(false);
          return;
        }
        const res  = await fetch(`http://localhost:5000/api/news/${id}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setArticle(data.data);
      } catch {
        // If backend unavailable and it's a demo ID, use demo data
        if (id && DEMO_ARTICLES[id]) {
          setArticle(DEMO_ARTICLES[id]);
        } else {
          setError('Article not found or failed to load.');
        }
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
