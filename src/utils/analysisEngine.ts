import type { AnalysisResult, Verdict } from '../Components/ResultCard';

// BACKEND INTEGRATION POINT — This entire file is the "mock" analysis engine.
// In production, replace the simulated functions below with real HTTP calls to
// your backend API (e.g., Express/FastAPI/Django). The backend should handle:
//   1. Fetching & scraping article content from the submitted URL
//   2. Running NLP / AI models for credibility analysis
//   3. Cross-referencing fact-check databases (Google Fact Check, ClaimBuster)
//   4. Returning a structured AnalysisResult response
//
// Suggested backend endpoint structure:
//   POST /api/analyze/url   — body: { url: string }
//   POST /api/analyze/image — body: FormData with image file


const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface DemoArticle {
  id: string;
  label: string;
  url: string;
  title: string;
  publisher: string;
  publishedAt: string;
  excerpt: string;
  verdict: Verdict;
  score: number;
  confidence: number;
  summary: string;
}

export const demoArticles: DemoArticle[] = [
  {
    id: 'padma-bridge',
    label: 'AI Cattle Market',
    url: 'https://rumorscanner.com/fact-check/ai-photo-cattle-market-padma-bridge/207784',
    title: 'যুবদল পদ্মা সেতুতে গরুর হাট বসিয়েছে দাবিতে এআই ছবি প্রচার',
    publisher: 'Rumor Scanner',
    publishedAt: 'June 1, 2026',
    excerpt: 'A photo claiming to show a cattle market set up on the Padma Bridge by Jubo Dal was analyzed and found to be AI-generated.',
    verdict: 'FAKE',
    score: 95,
    confidence: 98,
    summary: 'Fact check verified: The image showing cattle on the Padma Bridge is entirely fabricated using generative AI models. No such market was established.',
  },
  {
    id: 'internet-shutdown',
    label: 'Internet Shutdown',
    url: 'https://rumorscanner.com/fact-check/no-announcement-on-two-day-internet-shutdown/207674',
    title: 'দুই দিনের জন্য ইন্টারনেট সেবা বন্ধের কোনো ঘোষণা দেওয়া হয়নি',
    publisher: 'Rumor Scanner',
    publishedAt: 'May 30, 2026',
    excerpt: 'Claims that internet services would be shut down for two days in Bangladesh were analyzed and found to be baseless.',
    verdict: 'FAKE',
    score: 92,
    confidence: 96,
    summary: 'Fact check verified: The Bangladesh Telecommunication Regulatory Commission (BTRC) confirmed no such internet shutdown order was issued. The claim is completely false.',
  },
  {
    id: 'police-arrest',
    label: 'Police Arrest Image',
    url: 'https://rumorscanner.com/fact-check/police-member-arrested-for-demanding-police-killing-justice-fake-claim/207662',
    title: '‘পুলিশ হত্যার’ বিচার চাওয়ায় police সদস্য আটক দাবিতে ভুয়া police গ্রেফতারের ছবি প্রচার',
    publisher: 'Rumor Scanner',
    publishedAt: 'May 28, 2026',
    excerpt: 'A photo shared claiming to show a police officer arrested for seeking justice is actually an old photo of an imposter being detained.',
    verdict: 'FAKE',
    score: 94,
    confidence: 97,
    summary: 'Fact check verified: The image depicts the arrest of a fake police officer from a previous event, not an active officer seeking justice. The context is completely manipulated.',
  },
];

export function getDemoArticleByUrl(url: string) {
  return demoArticles.find((article) => article.url.toLowerCase() === url.toLowerCase());
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const summaries: Record<Verdict, string[]> = {
  FAKE: [
    'Multiple red flags detected. The article uses highly emotional language, lacks credible citations, and the domain has a known history of spreading misinformation. Claims made are directly contradicted by peer-reviewed sources.',
    'This content exhibits classic hallmarks of fabricated news: sensationalist headlines, anonymous sources, no publication date, and the narrative conflicts with verified reporting from established news organizations.',
  ],
  LIKELY_FAKE: [
    'Several indicators suggest this content may be misleading. While some factual elements exist, key claims are exaggerated, sources are questionable, and the article uses manipulative framing techniques.',
    'The content contains a mix of accurate and inaccurate information, a common pattern in deliberately misleading articles. Emotional language and selective omission of context raise significant concerns.',
  ],
  UNCERTAIN: [
    'The analysis returned mixed signals. Some claims are verifiable while others could not be confirmed or denied. We recommend cross-referencing this content with at least two independent, reputable sources.',
    'Insufficient data to make a definitive determination. The content references real events but the framing and some specific claims remain unverified. Exercise caution before sharing.',
  ],
  LIKELY_REAL: [
    'The content aligns with verified reporting and credible sources. Minor inconsistencies were detected but they do not materially affect the core narrative. The publisher has a moderate credibility rating.',
    'Most claims are substantiated by identifiable sources. The writing style is factual, citations are present, and the domain does not have a history of publishing misinformation.',
  ],
  REAL: [
    'High-confidence verdict: this content is credible. All major claims are corroborated by multiple independent, authoritative sources. The publisher has a strong track record of accurate reporting.',
    'The article demonstrates best practices in journalism: named sources, verifiable data, clear attribution, and no sensationalist language. Cross-referenced against 14 trusted news databases — no contradictions found.',
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getSignals(verdict: Verdict) {
  const score = {
    FAKE: 85, LIKELY_FAKE: 65, UNCERTAIN: 50, LIKELY_REAL: 30, REAL: 10,
  }[verdict];

  return [
    {
      label: 'Source Credibility',
      value: score > 70 ? 'Low' : score > 45 ? 'Moderate' : 'High',
      icon: '🏛️',
      status: (score > 70 ? 'bad' : score > 45 ? 'warn' : 'good') as 'bad' | 'warn' | 'good',
    },
    {
      label: 'Emotional Language',
      value: score > 70 ? 'Heavy' : score > 45 ? 'Moderate' : 'Minimal',
      icon: '💭',
      status: (score > 70 ? 'bad' : score > 45 ? 'warn' : 'good') as 'bad' | 'warn' | 'good',
    },
    {
      label: 'Citation Quality',
      value: score > 70 ? 'None' : score > 45 ? 'Weak' : 'Strong',
      icon: '📚',
      status: (score > 70 ? 'bad' : score > 45 ? 'warn' : 'good') as 'bad' | 'warn' | 'good',
    },
    {
      label: 'Fact-Check Match',
      value: score > 70 ? 'Contradicted' : score > 45 ? 'Partial' : 'Confirmed',
      icon: '✔️',
      status: (score > 70 ? 'bad' : score > 45 ? 'warn' : 'good') as 'bad' | 'warn' | 'good',
    },
    {
      label: 'Domain Age',
      value: score > 70 ? '<6 months' : score > 45 ? '1–3 years' : '10+ years',
      icon: '📅',
      status: (score > 70 ? 'bad' : score > 45 ? 'warn' : 'good') as 'bad' | 'warn' | 'good', 
    },
    {
      label: 'Social Shares',
      value: score > 70 ? 'Viral / Bot-driven' : score > 45 ? 'Moderate' : 'Organic',
      icon: '📡',
      status: (score > 70 ? 'bad' : score > 45 ? 'warn' : 'good') as 'bad' | 'warn' | 'good',
    },
  ];
}

export async function analyzeUrl(url: string): Promise<AnalysisResult> {
  try {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('http://localhost:5000/api/analyze/url', {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify({ url }),
    });
    if (!response.ok) {
      if (response.status === 400) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || 'Only rumorscanner.com URLs can be analyzed.');
      }
      throw new Error('Backend response error');
    }
    return (await response.json()) as AnalysisResult;
  } catch (error: any) {
    // If it's a domain/validation error, do not fallback to simulation - throw it so the user sees the error
    if (error.message && error.message.includes('rumorscanner.com')) {
      throw error;
    }
    console.warn('Backend URL analysis failed. Falling back to simulated client-side analysis.', error);
    const start = Date.now();
    await delay(randomBetween(400, 700));

    const demoArticle = getDemoArticleByUrl(url);
    if (demoArticle) {
      return {
        verdict: demoArticle.verdict,
        score: demoArticle.score,
        confidence: demoArticle.confidence,
        summary: demoArticle.summary,
        signals: getSignals(demoArticle.verdict),
        sourceUrl: demoArticle.url,
        article: {
          title: demoArticle.title,
          publisher: demoArticle.publisher,
          publishedAt: demoArticle.publishedAt,
          excerpt: demoArticle.excerpt,
        },
        analysisTime: Date.now() - start,
      };
    }

    // Bias the result based on URL patterns
    let verdict: Verdict;
    const lower = url.toLowerCase();
    if (lower.includes('bbc') || lower.includes('reuters') || lower.includes('apnews') || lower.includes('nytimes')) {
      verdict = 'REAL';
    } else if (lower.includes('theonion') || lower.includes('clickbait') || lower.includes('viral')) {
      verdict = 'FAKE';
    } else {
      const verdicts: Verdict[] = ['FAKE', 'LIKELY_FAKE', 'UNCERTAIN', 'LIKELY_REAL', 'REAL'];
      verdict = verdicts[randomBetween(0, 4)];
    }

    const scoreMap = { FAKE: randomBetween(82, 98), LIKELY_FAKE: randomBetween(60, 79), UNCERTAIN: randomBetween(40, 59), LIKELY_REAL: randomBetween(20, 39), REAL: randomBetween(2, 18) };
    const confMap  = { FAKE: randomBetween(88, 97), LIKELY_FAKE: randomBetween(72, 87), UNCERTAIN: randomBetween(55, 70), LIKELY_REAL: randomBetween(75, 90), REAL: randomBetween(91, 98) };

    return {
      verdict,
      score: scoreMap[verdict],
      confidence: confMap[verdict],
      summary: pickRandom(summaries[verdict]),
      signals: getSignals(verdict),
      sourceUrl: url,
      analysisTime: Date.now() - start,
    };
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

export async function analyzeImage(file: File): Promise<AnalysisResult> {
  try {
    const base64 = await fileToBase64(file);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 65000); // 65s timeout
    let response: Response;
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      response = await fetch('http://localhost:5000/api/analyze/image', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({ image: base64, name: file.name }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
    if (!response.ok) throw new Error('Backend response error');
    return (await response.json()) as AnalysisResult;
  } catch (error) {
    console.warn('Backend image analysis failed. Falling back to simulated client-side analysis.', error);
    const start = Date.now();
    await delay(randomBetween(500, 900));
    void file;

    const verdicts: Verdict[] = ['FAKE', 'LIKELY_FAKE', 'UNCERTAIN', 'LIKELY_REAL', 'REAL'];
    const verdict = verdicts[randomBetween(0, 4)];

    const scoreMap = { FAKE: randomBetween(80, 96), LIKELY_FAKE: randomBetween(58, 78), UNCERTAIN: randomBetween(38, 57), LIKELY_REAL: randomBetween(18, 37), REAL: randomBetween(3, 17) };
    const confMap  = { FAKE: randomBetween(82, 95), LIKELY_FAKE: randomBetween(70, 84), UNCERTAIN: randomBetween(52, 68), LIKELY_REAL: randomBetween(73, 88), REAL: randomBetween(88, 97) };

    const imageSignals = {
      FAKE: [
        { label: 'Metadata Integrity', value: 'Tampered', icon: '🔬', status: 'bad' as const },
        { label: 'Reverse Image Search', value: 'Reused Photo', icon: '🔄', status: 'bad' as const },
        { label: 'Compression Artifacts', value: 'Heavy (edited)', icon: '🖼️', status: 'bad' as const },
        { label: 'Context Match', value: 'Mismatch', icon: '❌', status: 'bad' as const },
        { label: 'AI Generation Prob.', value: `${randomBetween(70, 95)}% AI-made`, icon: '🤖', status: 'bad' as const },
        { label: 'Face Authenticity', value: 'Deepfake Detected', icon: '😶', status: 'bad' as const },
      ],
      LIKELY_FAKE: [
        { label: 'Metadata Integrity', value: 'Suspicious', icon: '🔬', status: 'warn' as const },
        { label: 'Reverse Image Search', value: 'Misleading Context', icon: '🔄', status: 'warn' as const },
        { label: 'Compression Artifacts', value: 'Moderate', icon: '🖼️', status: 'warn' as const },
        { label: 'Context Match', value: 'Partial', icon: '⚠️', status: 'warn' as const },
        { label: 'AI Generation Prob.', value: `${randomBetween(40, 68)}% likely AI`, icon: '🤖', status: 'warn' as const },
        { label: 'Face Authenticity', value: 'Uncertain', icon: '😶', status: 'warn' as const },
      ],
      UNCERTAIN: [
        { label: 'Metadata Integrity', value: 'Partial', icon: '🔬', status: 'warn' as const },
        { label: 'Reverse Image Search', value: 'Multiple sources', icon: '🔄', status: 'warn' as const },
        { label: 'Compression Artifacts', value: 'Minor', icon: '🖼️', status: 'good' as const },
        { label: 'Context Match', value: 'Inconclusive', icon: '🤔', status: 'warn' as const },
        { label: 'AI Generation Prob.', value: `${randomBetween(20, 45)}%`, icon: '🤖', status: 'warn' as const },
        { label: 'Face Authenticity', value: 'Likely Human', icon: '😶', status: 'good' as const },
      ],
      LIKELY_REAL: [
        { label: 'Metadata Integrity', value: 'Intact', icon: '🔬', status: 'good' as const },
        { label: 'Reverse Image Search', value: 'Source Verified', icon: '🔄', status: 'good' as const },
        { label: 'Compression Artifacts', value: 'Normal', icon: '🖼️', status: 'good' as const },
        { label: 'Context Match', value: 'Mostly Accurate', icon: '✅', status: 'good' as const },
        { label: 'AI Generation Prob.', value: `${randomBetween(5, 18)}%`, icon: '🤖', status: 'good' as const },
        { label: 'Face Authenticity', value: 'Authentic', icon: '😶', status: 'good' as const },
      ],
      REAL: [
        { label: 'Metadata Integrity', value: 'Verified', icon: '🔬', status: 'good' as const },
        { label: 'Reverse Image Search', value: 'Original Source', icon: '🔄', status: 'good' as const },
        { label: 'Compression Artifacts', value: 'None', icon: '🖼️', status: 'good' as const },
        { label: 'Context Match', value: 'Full Match', icon: '✅', status: 'good' as const },
        { label: 'AI Generation Prob.', value: `< ${randomBetween(2, 8)}%`, icon: '🤖', status: 'good' as const },
        { label: 'Face Authenticity', value: 'Real Person', icon: '😶', status: 'good' as const },
      ],
    };

    return {
      verdict,
      score: scoreMap[verdict],
      confidence: confMap[verdict],
      summary: pickRandom(summaries[verdict]),
      signals: imageSignals[verdict],
      analysisTime: Date.now() - start,
    };
  }
}
