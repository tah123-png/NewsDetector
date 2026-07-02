import { useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from '../Components/ThemeToggle';



const LoginPage = () => {
  const navigate = useNavigate();
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!spotlightRef.current) return;
    spotlightRef.current.style.left = `${e.clientX}px`;
    spotlightRef.current.style.top = `${e.clientY}px`;
    spotlightRef.current.style.opacity = '1';
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!spotlightRef.current) return;
    spotlightRef.current.style.opacity = '0';
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const DEMO_ID = 'tahmid';
  const DEMO_PASS = '12345678';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    // ── Demo shortcut ──
    if (normalizedEmail === DEMO_ID && normalizedPassword === DEMO_PASS) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('user', JSON.stringify({ name: 'Demo User', email: 'demo1@fakeshield.ai' }));
      setLoading(false);
      navigate('/dashboard');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.errors?.[0]?.msg ?? data.message ?? 'Login failed.';
        setError(msg);
        setLoading(false);
        return;
      }

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch {
      setError('Cannot reach the server. Try the demo account below.');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden bg-bg-primary"
      style={{ fontFamily: "'Inter', sans-serif" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Cursor spotlight ── */}
      <div
        ref={spotlightRef}
        aria-hidden
        style={{
          position: 'fixed', width: 600, height: 600, borderRadius: '50%',
          pointerEvents: 'none', zIndex: 0, opacity: 0,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 65%)',
          transition: 'opacity 0.4s ease', willChange: 'left, top',
        }}
      />
      {/* Static ambient blobs */}
      <div aria-hidden className="fixed -top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)', opacity: 0.5 }} />
      <div aria-hidden className="fixed -bottom-[15%] -right-[10%] w-[400px] h-[400px] rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)', opacity: 0.4 }} />

      {/* Top bar */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-between px-4 sm:px-8 py-4 z-50">
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: 'var(--color-text-secondary)', fontSize: 14, fontWeight: 600,
            background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s',
            padding: '8px 0', minHeight: 44,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          <span className="hidden xs:inline">Back to home</span>
          <span className="xs:hidden">Back</span>
        </button>
        <ThemeToggle />
      </div>

      {/* Form area */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-20 sm:py-10 relative z-10">
        <div className="glass-card p-6 sm:p-8 md:p-10 animate-fade-up w-full max-w-[460px]">

          {/* Heading */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(22px, 5vw, 30px)',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              marginBottom: 6,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}>
              Welcome back
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'clamp(13px, 3vw, 15px)' }}>
              Sign in to your FakeShield account
            </p>
          </div>

          {/* Google button */}
          <button
            id="btn-google-login"
            className="btn-google w-full mb-4"
            style={{ padding: '12px 16px', fontSize: 14, minHeight: 48 }}
            onClick={() => alert('Google Sign-In coming soon!')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="divider mb-4" style={{ fontSize: 11 }}>or sign in with email</div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'var(--color-danger-bg)', color: 'var(--color-danger)',
              border: '1px solid var(--color-danger-border)', borderRadius: 10,
              padding: '10px 12px', fontSize: 13, fontWeight: 600, marginBottom: 14,
              display: 'flex', alignItems: 'flex-start', gap: 8,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>
                Account ID
              </label>
              <input
                id="login-email"
                type="text"
                required
                className="input-field"
                placeholder="Enter your account ID"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ fontSize: 16 /* prevent iOS zoom */, minHeight: 48 }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Password
                </label>
                <button type="button" style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', minHeight: 32 }}>
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingRight: 52, fontSize: 16 /* prevent iOS zoom */, minHeight: 48 }}
                />
                {/* Touch-friendly show/hide toggle — larger hit area */}
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position: 'absolute', right: 0, top: 0, bottom: 0,
                    width: 48,
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  }
                </button>
              </div>
            </div>

            <button
              id="btn-signin"
              type="submit"
              className="btn-primary w-full mt-1"
              style={{ padding: '14px 16px', fontSize: 15, minHeight: 52 }}
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" strokeOpacity="0.3" /><path d="M12 2a10 10 0 0 1 10 10" /></svg>
                  Signing in…
                </span>
              ) : 'Sign In →'}
            </button>
          </form>


          {/* Footer link */}
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--color-text-secondary)' }}>
            Don't have an account?{' '}
            <Link
              to="/signup"
              style={{ color: 'var(--color-accent)', fontWeight: 700, textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
            >
              Create one free
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
