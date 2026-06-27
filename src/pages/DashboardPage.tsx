import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import ThemeToggle from '../Components/ThemeToggle';
import gsap from 'gsap';

/* ── Demo personal data ── */
// 🔧 BACKEND INTEGRATION POINT
// Replace these static arrays with real user activity data fetched from your backend API
// e.g., useEffect(() => { fetch('/api/user/analytics').then(res => setMyActivity(res.data)) }, [])
const myActivity = [
  { title: 'Scientists discover new cancer treatment', date: '2 min ago', type: 'Article', result: 'REAL', score: 94, url: 'nature.com' },
  { title: 'Doctors shocked: miracle cure hidden by Big Pharma', date: '18 min ago', type: 'Article', result: 'FAKE', score: 97, url: 'healthbuzz.net' },
  { title: 'IMG_evidence_rally_2026.jpg', date: '1 hr ago', type: 'Image', result: 'LIKELY_FAKE', score: 78, url: 'Upload' },
  { title: 'Global inflation hits 3-year low, economists confirm', date: '3 hrs ago', type: 'Article', result: 'REAL', score: 89, url: 'reuters.com' },
  { title: 'Government secretly poisoning water supply', date: '5 hrs ago', type: 'Article', result: 'FAKE', score: 99, url: 'truthwatch.io' },
  { title: 'New study links social media to teen anxiety', date: 'Yesterday', type: 'Article', result: 'REAL', score: 82, url: 'pubmed.ncbi' },
  { title: 'IMG_protest_doctored_crowd.png', date: 'Yesterday', type: 'Image', result: 'FAKE', score: 95, url: 'Upload' },
];

const weeklyChecks = [3, 7, 2, 9, 5, 8, 4];
const myMonthly = [2, 5, 3, 8, 6, 11, 7, 14, 10, 9, 12, 15];

const resultColor = (r: string) =>
  r === 'REAL'
    ? { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.3)' }
    : r === 'FAKE'
      ? { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'rgba(239,68,68,0.3)' }
      : { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' };

const StatCard = ({
  label, value, sub, accent, icon,
}: { label: string; value: string; sub: string; accent: string; icon: string }) => (
  <div className="glass-card p-6 flex flex-col gap-3" style={{ borderLeft: `4px solid ${accent}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontFamily: "'Inter', sans-serif" }}>{label}</span>
      <span style={{ fontSize: 20 }}>{icon}</span>
    </div>
    <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--color-text-primary)', lineHeight: 1, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>{value}</div>
    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 500 }}>{sub}</div>
  </div>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(document.documentElement.getAttribute('data-mode') === 'dark');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.name) {
          setUserName(user.name);
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const navbarRef = useRef<HTMLElement>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const kpiRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<HTMLDivElement>(null);
  const barRowRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated')) navigate('/login');
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.getAttribute('data-mode') === 'dark')
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });
    return () => obs.disconnect();
  }, [navigate]);

  /* ── GSAP entrance timeline ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Navbar slides down from top
      tl.fromTo(navbarRef.current,
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      );

      // Welcome text fades up
      tl.fromTo(welcomeRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.2'
      );

      // Action banner slides in
      tl.fromTo(bannerRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45 },
        '-=0.15'
      );

      // KPI cards stagger in
      if (kpiRef.current) {
        tl.fromTo(
          kpiRef.current.children,
          { y: 36, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 },
          '-=0.1'
        );
      }

      // Charts fade in
      tl.fromTo(chartsRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.1'
      );

      // Bar row fades in
      tl.fromTo(barRowRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.1'
      );

      // Table slides up last
      tl.fromTo(tableRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.1'
      );
    });
    return () => ctx.revert();
  }, []);

  const gridColor = isDark ? '#1e293b' : '#f1f5f9';
  const labelColor = isDark ? '#94a3b8' : '#64748b';

  const areaOpts: ApexOptions = {
    chart: { type: 'area', toolbar: { show: false }, background: 'transparent' },
    theme: { mode: isDark ? 'dark' : 'light' },
    colors: ['#3b82f6'],
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02 } },
    stroke: { curve: 'smooth', width: 2.5 },
    grid: { borderColor: gridColor, strokeDashArray: 4 },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], labels: { style: { colors: labelColor, fontSize: '10px', fontFamily: "'Inter', sans-serif", fontWeight: 500 } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { colors: labelColor, fontSize: '10px', fontFamily: "'Inter', sans-serif" } } },
    dataLabels: { enabled: false },
    tooltip: { theme: isDark ? 'dark' : 'light', style: { fontSize: '12px', fontFamily: "'Inter', sans-serif" } },
  };

  const barOpts: ApexOptions = {
    chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
    theme: { mode: isDark ? 'dark' : 'light' },
    colors: ['#8b5cf6'],
    plotOptions: { bar: { borderRadius: 6, columnWidth: '55%' } },
    dataLabels: { enabled: false },
    grid: { borderColor: gridColor, strokeDashArray: 4 },
    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], labels: { style: { colors: labelColor, fontSize: '10px', fontFamily: "'Inter', sans-serif", fontWeight: 500 } }, axisBorder: { show: false } },
    yaxis: { labels: { style: { colors: labelColor, fontSize: '10px', fontFamily: "'Inter', sans-serif" } } },
    tooltip: { theme: isDark ? 'dark' : 'light', style: { fontSize: '12px', fontFamily: "'Inter', sans-serif" } },
  };

  const donutOpts: ApexOptions = {
    chart: { type: 'donut', background: 'transparent' },
    theme: { mode: isDark ? 'dark' : 'light' },
    colors: ['#10b981', '#ef4444', '#f59e0b'],
    labels: ['Real', 'Fake', 'Uncertain'],
    legend: { position: 'bottom', fontSize: '12px', fontFamily: "'Inter', sans-serif", fontWeight: 500, labels: { colors: labelColor } },
    dataLabels: { enabled: true, style: { fontSize: '11px', fontFamily: "'Inter', sans-serif", fontWeight: 600 }, dropShadow: { enabled: false } },
    plotOptions: { pie: { donut: { size: '50%', labels: { show: true, name: { fontSize: '12px', fontFamily: "'Inter', sans-serif", fontWeight: 600, color: labelColor }, value: { fontSize: '22px', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, color: 'var(--color-text-primary)' }, total: { show: true, label: 'My Checks', color: labelColor, fontSize: '12px', fontWeight: 700, fontFamily: "'Inter', sans-serif" } } } } },
    tooltip: { theme: isDark ? 'dark' : 'light', style: { fontSize: '12px', fontFamily: "'Inter', sans-serif" } },
  };

  const realCount = myActivity.filter(a => a.result === 'REAL').length;
  const fakeCount = myActivity.filter(a => a.result === 'FAKE').length;
  const uncertainCount = myActivity.filter(a => a.result === 'LIKELY_FAKE').length;

  return (
    <div
      className="min-h-screen bg-bg-primary relative overflow-x-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >

      {/* Top Navbar */}
      <header ref={navbarRef} style={{ position: 'sticky', top: 0, zIndex: 50, background: isDark ? 'rgba(10,15,28,0.85)' : 'rgba(248,250,252,0.85)', backdropFilter: 'blur(16px)', borderBottom: `1px solid var(--color-border)` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo / back */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/Dashboard.png" alt="Dashboard Logo" className="dashboard-logo" style={{ width: 50, height: 50, objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--color-text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>FakeShield</span>
          </Link>


          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ThemeToggle />
            {/* User avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>{userName.charAt(0) || 'U'}</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{userName}</span>
            </div>
            <button
              onClick={() => { localStorage.removeItem('isAuthenticated'); navigate('/'); }}
              style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px 60px', position: 'relative', zIndex: 1 }}>

        {/* ── Hero Welcome + CTA ── */}
        <div
          ref={welcomeRef}
          style={{
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 28,
            borderRadius: 24,
            padding: '32px 36px',
            background: isDark
              ? 'linear-gradient(135deg, rgba(30,41,59,0.95) 0%, rgba(17,24,39,0.95) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(241,245,249,0.97) 100%)',
            border: '1px solid var(--color-border)',
            boxShadow: isDark
              ? '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)'
              : '0 4px 24px rgba(15,23,42,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 24,
          }}
        >
          {/* Decorative gradient orbs */}
          <div style={{ position: 'absolute', top: -40, right: 120, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -30, right: 20, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Left: greeting + badges */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 28 }}>👋</span>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 900, color: 'var(--color-text-primary)', margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                Welcome back, <span style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{userName}</span>
              </h1>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, fontWeight: 400, margin: '0 0 16px' }}>
              Here's your fact-checking activity overview. Ready to analyze something?
            </p>
            {/* Quick stat badges */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { label: '7 checks', sub: 'this week', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
                { label: `${Math.round((realCount / myActivity.length) * 100)}% real`, sub: 'accuracy', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
                { label: `${fakeCount + uncertainCount} caught`, sub: 'fake/misleading', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
              ].map((b) => (
                <span key={b.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 100, background: b.bg, border: `1px solid ${b.color}30`, fontSize: 12, fontWeight: 700, color: b.color, fontFamily: "'Inter', sans-serif" }}>
                  <span>{b.label}</span>
                  <span style={{ fontWeight: 400, opacity: 0.75 }}>{b.sub}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right: CTA buttons */}
          <div ref={bannerRef} style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
            <Link
              to="/"
              style={{ padding: '11px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'Inter', sans-serif", boxShadow: '0 4px 18px rgba(59,130,246,0.35)', letterSpacing: '0.01em' }}
            >
              <span>🔗</span> Check URL
            </Link>
            <button
              onClick={() => navigate('/', { state: { tab: 'image' } })}
              style={{ padding: '11px 24px', borderRadius: 12, background: isDark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.08)', color: '#8b5cf6', fontWeight: 700, fontSize: 14, border: '1px solid rgba(139,92,246,0.35)', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'Inter', sans-serif", cursor: 'pointer', letterSpacing: '0.01em' }}
            >
              <span>🖼️</span> Check Image
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div ref={kpiRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 28 }}>
          <StatCard label="Total Checked" value={String(myActivity.length)} sub="Articles & images" accent="#3b82f6" icon="🔍" />
          <StatCard label="Fake Found" value={String(fakeCount + uncertainCount)} sub="Misinformation caught" accent="#ef4444" icon="🚨" />
          <StatCard label="Real Content" value={String(realCount)} sub="Verified as credible" accent="#10b981" icon="✅" />
          <StatCard label="This Week" value="7" sub="Checks in 7 days" accent="#8b5cf6" icon="📅" />
        </div>

        {/* Charts row */}
        <div ref={chartsRef} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
          <div className="glass-card p-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.01em' }}>My Activity This Year</h2>
              <span style={{ fontSize: 10, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Monthly checks</span>
            </div>
            <ReactApexChart type="area" height={200} options={areaOpts} series={[{ name: 'Checks', data: myMonthly }]} />
          </div>
          <div className="glass-card p-6">
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 4px' }}>My Verdict Split</h2>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>All-time breakdown</span>
            <ReactApexChart type="donut" height={220} options={donutOpts} series={[realCount, fakeCount, uncertainCount]} />
          </div>
        </div>

        {/* Weekly bar chart */}
        <div ref={barRowRef} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div className="glass-card p-6">
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 4px' }}>Checks This Week</h2>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>Daily breakdown</span>
            <ReactApexChart type="bar" height={200} options={barOpts} series={[{ name: 'Checks', data: weeklyChecks }]} />
          </div>

          {/* Tips / insights */}
          <div className="glass-card p-6">
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 16px' }}>💡 Your Insights</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '🔴', text: `${Math.round(((fakeCount + uncertainCount) / myActivity.length) * 100)}% of content you checked was fake or misleading.` },
                { icon: '📈', text: 'Your fact-checking activity increased 40% compared to last month.' },
                { icon: '🌐', text: 'Most suspicious content came from unknown blogs and social media.' },
                { icon: '🏆', text: 'You are in the top 15% of most active users this week!' },
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', border: `1px solid var(--color-border)` }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{tip.icon}</span>
                  <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{tip.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div ref={tableRef} className="glass-card p-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>My Recent Checks</h2>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{myActivity.length} total analyses</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid var(--color-border)` }}>
                  {['Content', 'Type', 'Source', 'Confidence', 'Verdict', 'When'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myActivity.map((item, i) => {
                  const rc = resultColor(item.result);
                  return (
                    <tr key={i}
                      style={{ borderBottom: `1px solid var(--color-border)`, transition: 'background 0.15s', cursor: 'default' }}
                      onMouseEnter={e => (e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px', maxWidth: 260 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: item.type === 'Image' ? 'rgba(139,92,246,0.1)' : 'rgba(59,130,246,0.1)', color: item.type === 'Image' ? '#8b5cf6' : '#3b82f6', fontWeight: 600 }}>{item.type}</span>
                      </td>
                      <td style={{ padding: '12px', fontSize: 12, color: 'var(--color-text-muted)' }}>{item.url}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ height: 4, width: 60, borderRadius: 99, background: isDark ? '#1e293b' : '#e2e8f0', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${item.score}%`, background: item.score > 90 ? '#ef4444' : item.score > 70 ? '#f59e0b' : '#10b981', borderRadius: 99 }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-primary)' }}>{item.score}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>{item.result}</span>
                      </td>
                      <td style={{ padding: '12px', fontSize: 12, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{item.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
