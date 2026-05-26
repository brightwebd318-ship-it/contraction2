import React, { useState, useEffect } from 'react';
import './App.css';
import { createClient } from '@supabase/supabase-js';

// Supabase Configuration (with graceful offline fallback)
const SUPABASE_URL = 'https://upiqnybaynfcxfpvudxj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_60Df3BRlvF7EKQ9R8DoDXQ_mXQRFVVv';
let supabase = null;
try {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (e) {
  console.warn('Supabase initialization failed, falling back to local-only state.', e);
}

// ── SVG Icon Definitions ──────────────────────────────────────────────────────
const EyeOpen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosed = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const TerminalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

// ── Floating Particles Background ────────────────────────────────────────────
function ParticleField() {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1.5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.3 + 0.1,
  }));

  return (
    <div className="particle-field" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── Input Field Component ─────────────────────────────────────────────────────
function InputField({ id, label, type, value, onChange, icon: Icon, error, rightEl, autoComplete, placeholder }) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className={`input-group ${error ? 'has-error' : ''} ${focused ? 'focused' : ''}`}>
      <div className="input-inner">
        <div className="input-icon"><Icon /></div>
        <div className="input-field-wrap">
          <label htmlFor={id} className={`float-label ${lifted ? 'lifted' : ''}`}>
            {label}
          </label>
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoComplete={autoComplete}
            placeholder={focused ? placeholder : ''}
            className="auth-input"
          />
        </div>
        {rightEl && <div className="input-right">{rightEl}</div>}
      </div>
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
function LoginPage({ onLogin, onGoRegister, theme, setTheme }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [role, setRole] = useState('client');

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address.';
    if (!password) e.password = 'Password is required.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ name: email.split('@')[0], email, remember, role });
    }, 1000);
  };

  return (
    <div className={`auth-form-card ${shake ? 'shake' : ''}`}>
      <div className="theme-toggle-header">
        <button
          type="button"
          className="theme-toggle-btn-top"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      <div className="form-brand" style={{ marginTop: '10px' }}>
        <div className="brand-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <h1 className="brand-name">ConstructFlow 2026</h1>
        <p className="brand-tagline">SaaS Construction Management Dashboard</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="auth-form" id="login-form">
        <div className="role-switch-container">
          <button
            type="button"
            className={`role-switch-btn ${role === 'client' ? 'active' : ''}`}
            onClick={() => setRole('client')}
          >
            <BriefcaseIcon />
            <span>Client Login</span>
          </button>
          <button
            type="button"
            className={`role-switch-btn ${role === 'contractor' ? 'active' : ''}`}
            onClick={() => setRole('contractor')}
          >
            <TerminalIcon />
            <span>Contractor Login</span>
          </button>
        </div>

        <InputField
          id="login-email"
          label="Email Address"
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
          icon={MailIcon}
          error={errors.email}
          autoComplete="email"
          placeholder="client@email.com or contractor@email.com"
        />

        <InputField
          id="login-password"
          label="Password"
          type={showPw ? 'text' : 'password'}
          value={password}
          onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
          icon={LockIcon}
          error={errors.password}
          autoComplete="current-password"
          placeholder="Enter password"
          rightEl={
            <button
              type="button"
              className="pw-toggle-btn"
              onClick={() => setShowPw(v => !v)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeClosed /> : <EyeOpen />}
            </button>
          }
        />

        <div className="form-options-row">
          <label className="remember-label" htmlFor="remember-me">
            <div className={`custom-checkbox ${remember ? 'checked' : ''}`} onClick={() => setRemember(v => !v)}>
              {remember && <CheckIcon />}
            </div>
            <input
              id="remember-me"
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(v => !v)}
              style={{ display: 'none' }}
            />
            Remember me
          </label>
          <button type="button" className="forgot-link" onClick={() => { setForgotSent(true); setTimeout(() => setForgotSent(false), 2000); }}>
            {forgotSent ? '✓ Check your inbox!' : 'Forgot password?'}
          </button>
        </div>

        <button
          type="submit"
          id="login-submit-btn"
          className="auth-submit-btn"
          disabled={loading}
        >
          {loading ? (
            <span className="btn-spinner" />
          ) : (
            <>
              <span>Access Dashboard</span>
              <span className="btn-arrow">→</span>
            </>
          )}
        </button>
      </form>

      <p className="auth-switch-text">
        Don't have an account?{' '}
        <button type="button" id="go-to-register-btn" className="auth-switch-link" onClick={onGoRegister}>
          Create account
        </button>
      </p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// REGISTRATION PAGE
// ══════════════════════════════════════════════════════════════════════════════
function RegisterPage({ onRegister, onGoLogin, theme, setTheme }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const validate = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = 'Full name is required.';
    if (!email.trim()) e.email = 'Email address is required.';
    if (!password || password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (!agreeTerms) e.terms = 'You must agree to terms.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onRegister({ name: fullName, email, role });
    }, 1000);
  };

  return (
    <div className={`auth-form-card ${shake ? 'shake' : ''}`}>
      <div className="theme-toggle-header">
        <button
          type="button"
          className="theme-toggle-btn-top"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      <div className="form-brand" style={{ marginTop: '10px' }}>
        <div className="brand-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <h1 className="brand-name">Register Account</h1>
        <p className="brand-tagline">Set up your construction project dashboard</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="auth-form" id="register-form">
        <div className="role-cards-container">
          <div
            className={`role-card ${role === 'client' ? 'active' : ''}`}
            onClick={() => setRole('client')}
          >
            <div className="role-card-icon"><BriefcaseIcon /></div>
            <div className="role-card-info">
              <span className="role-card-title">Client</span>
              <span className="role-card-desc">I am the home owner</span>
            </div>
            <div className="role-card-radio"><div className="radio-dot" /></div>
          </div>

          <div
            className={`role-card ${role === 'contractor' ? 'active' : ''}`}
            onClick={() => setRole('contractor')}
          >
            <div className="role-card-icon"><TerminalIcon /></div>
            <div className="role-card-info">
              <span className="role-card-title">Contractor</span>
              <span className="role-card-desc">I manage the construction site</span>
            </div>
            <div className="role-card-radio"><div className="radio-dot" /></div>
          </div>
        </div>

        <InputField
          id="reg-fullname"
          label="Full Name"
          type="text"
          value={fullName}
          onChange={e => { setFullName(e.target.value); setErrors(prev => ({ ...prev, fullName: '' })); }}
          icon={UserIcon}
          error={errors.fullName}
          placeholder="shani dibin"
        />

        <InputField
          id="reg-email"
          label="Email Address"
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
          icon={MailIcon}
          error={errors.email}
          placeholder="yourname@email.com"
        />

        <InputField
          id="reg-password"
          label="Password (min. 6 chars)"
          type="password"
          value={password}
          onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
          icon={LockIcon}
          error={errors.password}
          placeholder="Choose password"
        />

        <div className="terms-row">
          <div className={`custom-checkbox ${agreeTerms ? 'checked' : ''} ${errors.terms ? 'error' : ''}`} onClick={() => { setAgreeTerms(v => !v); setErrors(prev => ({ ...prev, terms: '' })); }}>
            {agreeTerms && <CheckIcon />}
          </div>
          <span className="terms-text">I agree to site terms and privacy policies.</span>
        </div>

        <button
          type="submit"
          id="register-submit-btn"
          className="auth-submit-btn"
          disabled={loading}
        >
          {loading ? <span className="btn-spinner" /> : <span>Sign Up</span>}
        </button>
      </form>

      <p className="auth-switch-text">
        Already have an account?{' '}
        <button type="button" id="go-to-login-btn" className="auth-switch-link" onClick={onGoLogin}>
          Sign in
        </button>
      </p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT & REAL-TIME SHARED STATE
// ══════════════════════════════════════════════════════════════════════════════
function App() {
  const [screen, setScreen] = useState('login'); // 'login' | 'register' | 'dashboard'
  const [user, setUser] = useState(null);

  // ── SHARED CLIENT NOTES (visible to contractor as notifications) ────────────
  const [clientNotes, setClientNotes] = useState(() => {
    const saved = localStorage.getItem('cf_client_notes');
    return saved ? JSON.parse(saved) : [
      { id: 'n-1', type: 'Note', text: 'Please ensure the roof waterproofing is double-checked before closing.', date: '2026-05-24', priority: 'high', readByContractor: false },
      { id: 'n-2', type: 'Request', text: 'Need updated photos of the electrical conduit work by end of week.', date: '2026-05-25', priority: 'medium', readByContractor: false },
      { id: 'n-3', type: 'Note', text: 'Paint colors: Living Room — Ivory White, Bedrooms — Sage Green.', date: '2026-05-26', priority: 'low', readByContractor: false },
    ];
  });

  const saveClientNotes = (updated) => {
    setClientNotes(updated);
    localStorage.setItem('cf_client_notes', JSON.stringify(updated));
  };
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [animKey, setAnimKey] = useState(0);

  // ── SEED/SHARED STATE ──────────────────────────────────────────────────────
  const [siteDetails, setSiteDetails] = useState(() => {
    const saved = localStorage.getItem('cf_site_details');
    const defaults = {
      siteName: "Sunrise Villa Restoration",
      projectAddress: "Plot 42, Green Meadows, Mumbai, MH 400001",
      clientName: "shani dibin",
      contractorName: "Albin Mathew",
      projectType: "Residential Luxury Villa",
      startDate: "2026-01-15",
      expectedCompletionDate: "2026-10-30",
      siteDescription: "Ultra-modern 3-story residential luxury villa with glass facade, rooftop terrace, solar integrations, automated smart systems, and custom interior design.",
      currentStage: "Roof Work"
    };
    if (!saved) return defaults;
    try {
      const parsed = JSON.parse(saved);
      if (parsed.clientName === "Amir Khan") parsed.clientName = "shani dibin";
      if (parsed.contractorName === "BuildPro Ltd. (Rahul Patel)") parsed.contractorName = "Albin Mathew";
      return parsed;
    } catch (e) {
      return defaults;
    }
  });

  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem('cf_photos_data');
    return saved ? JSON.parse(saved) : [
      {
        id: 'p-1',
        stage: 'Foundation Work',
        category: 'Completed',
        url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80',
        uploadDate: '2026-02-10',
        description: 'Excavation completed and concrete foundation slab poured. Structural integrity certified.'
      },
      {
        id: 'p-2',
        stage: 'Brick Work',
        category: 'Completed',
        url: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80',
        uploadDate: '2026-04-15',
        description: 'First floor brick wall layout completed. Door frames and lintels successfully aligned.'
      },
      {
        id: 'p-3',
        stage: 'Roof Work',
        category: 'During',
        url: 'https://images.unsplash.com/photo-1632759162463-157daf6a833f?auto=format&fit=crop&w=600&q=80',
        uploadDate: '2026-05-22',
        description: 'Waterproofing membrane laid out. Wooden ridge support truss and structural anchors installation in progress.'
      },
      {
        id: 'p-4',
        stage: 'Electrical Work',
        category: 'During',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
        uploadDate: '2026-05-24',
        description: 'Conduit laying for ground floor ceiling completed. Main Distribution box wiring initiated.'
      },
      {
        id: 'p-5',
        stage: 'Painting',
        category: 'Before',
        url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
        uploadDate: '2026-05-25',
        description: 'Wall surface sanding and putty preparation initiated. Base primer coats delivered to site.'
      },
      {
        id: 'p-6',
        stage: 'Interior Work',
        category: 'Before',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
        uploadDate: '2026-05-25',
        description: 'Modular kitchen frames and drywall layouts delivered. Installation to start post plumbing checks.'
      }
    ];
  });

  const [timeline, setTimeline] = useState(() => {
    const saved = localStorage.getItem('cf_timeline_data');
    return saved ? JSON.parse(saved) : [
      { id: 't-1', time: '09:00 AM', status: 'Foundation Started', date: '2026-05-25', description: 'Excavation team started digging on south plot sector.' },
      { id: 't-2', time: '11:00 AM', status: 'Material Delivered', date: '2026-05-25', description: '100 bags of Portland Cement OPC 53 delivered and stored.' },
      { id: 't-3', time: '02:00 PM', status: 'Painting Completed', date: '2026-05-25', description: 'Exterior primer base coat application completed for structural columns.' },
      { id: 't-4', time: '05:00 PM', status: 'New Images Added', date: '2026-05-25', description: '3 roof work progress and material layout photos uploaded.' }
    ];
  });

  // Base costs state
  const [costs, setCosts] = useState(() => {
    const saved = localStorage.getItem('cf_costs_data');
    return saved ? JSON.parse(saved) : {
      totalBudget: 250000,
      cement: 20000,
      steel: 45000,
      bricks: 15000,
      paint: 10000,
      labourCost: 30000,
      extras: {}       // ← dynamic items added by contractor
    };
  });

  // Material Management state
  const [materials, setMaterials] = useState(() => {
    const saved = localStorage.getItem('cf_materials_data');
    return saved ? JSON.parse(saved) : [
      { id: 'm-1', name: 'Cement', qty: 100, unit: 'Bags', price: 200, supplier: 'UltraTech Cements', date: '2026-05-24' },
      { id: 'm-2', name: 'Steel', qty: 2, unit: 'Tons', price: 22500, supplier: 'TATA Steel Ltd.', date: '2026-05-20' },
      { id: 'm-3', name: 'Bricks', qty: 8000, unit: 'Nos', price: 1.875, supplier: 'Prime Brick Kiln', date: '2026-05-22' },
      { id: 'm-4', name: 'Paint', qty: 25, unit: 'Buckets', price: 400, supplier: 'Asian Paints', date: '2026-05-26' }
    ];
  });

  // Worker daily list state (attendance tracker)
  const [workers, setWorkers] = useState(() => {
    const saved = localStorage.getItem('cf_workers_data');
    return saved ? JSON.parse(saved) : [
      { id: 'w-1', name: 'Ram Singh', role: 'Mason', present: true },
      { id: 'w-2', name: 'Abdur Rehman', role: 'Mason', present: true },
      { id: 'w-3', name: 'Shiva Kumar', role: 'Mason', present: true },
      { id: 'w-4', name: 'Sanjay Dutt', role: 'Mason', present: true },
      { id: 'w-5', name: 'Amit Mishra', role: 'Mason', present: true },
      { id: 'w-6', name: 'Lokesh Das', role: 'Mason', present: true },
      
      { id: 'w-7', name: 'Vikram Seth', role: 'Painter', present: true },
      { id: 'w-8', name: 'Sameer Sen', role: 'Painter', present: true },
      { id: 'w-9', name: 'Danish Khan', role: 'Painter', present: true },
      { id: 'w-10', name: 'Rajesh Varma', role: 'Painter', present: true },

      { id: 'w-11', name: 'Kamlesh Soni', role: 'Electrician', present: true },
      { id: 'w-12', name: 'Satyajit Ray', role: 'Electrician', present: true },
      { id: 'w-13', name: 'Gopal Joshi', role: 'Electrician', present: true },

      { id: 'w-14', name: 'Deepak Dev', role: 'Helper', present: true },
      { id: 'w-15', name: 'Anup Jalota', role: 'Helper', present: true },
      { id: 'w-16', name: 'Nandan Nile', role: 'Helper', present: true },
      { id: 'w-17', name: 'Sujith Roy', role: 'Helper', present: true },
      { id: 'w-18', name: 'Bobby Deol', role: 'Helper', present: true }
    ];
  });

  // Sync state to local storage to persist across page refresh / toggles
  useEffect(() => {
    localStorage.setItem('cf_site_details', JSON.stringify(siteDetails));
  }, [siteDetails]);

  useEffect(() => {
    localStorage.setItem('cf_photos_data', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem('cf_timeline_data', JSON.stringify(timeline));
  }, [timeline]);

  useEffect(() => {
    localStorage.setItem('cf_costs_data', JSON.stringify(costs));
  }, [costs]);

  useEffect(() => {
    localStorage.setItem('cf_materials_data', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('cf_workers_data', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('cf_client_notes', JSON.stringify(clientNotes));
  }, [clientNotes]);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sync Supabase listeners (if initialized)
  useEffect(() => {
    if (!supabase) return;
    
    // Attempt database setup verification
    const setupSubscriptions = async () => {
      try {
        // Read initial photos from Supabase if table exists
        const { data: dbPhotos } = await supabase.from('photos').select('*');
        if (dbPhotos && dbPhotos.length > 0) {
          // Merge db photos into state, keeping locally created ones too
          setPhotos(prev => {
            const merged = [...prev];
            dbPhotos.forEach(dbP => {
              if (!merged.some(p => p.id === dbP.id || p.url === dbP.url)) {
                merged.unshift({
                  id: dbP.id,
                  stage: dbP.stage || 'General',
                  category: dbP.category || 'During',
                  url: dbP.url,
                  uploadDate: new Date(dbP.created_at).toISOString().split('T')[0],
                  description: dbP.description || 'Uploaded photo from site'
                });
              }
            });
            return merged;
          });
        }
      } catch (err) {
        console.log('Supabase tables might not exist yet. Relying on local storage sync.', err);
      }
    };
    setupSubscriptions();
  }, []);

  const navigate = (to) => {
    setAnimKey(k => k + 1);
    setScreen(to);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    navigate('dashboard');
  };

  const handleRegister = (userData) => {
    setUser(userData);
    navigate('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('login');
  };

  // Shared callback actions (accessible by either tab)
  const addTimelineEvent = (event) => {
    const newEvent = {
      id: 't-' + Date.now(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      ...event
    };
    setTimeline(prev => [newEvent, ...prev]);
  };

  const deleteTimelineEvent = (eventId) => {
    setTimeline(prev => prev.filter(e => e.id !== eventId));
  };

  const addPhotoFromSite = (photoObj) => {
    const newPhoto = {
      id: 'p-' + Date.now(),
      uploadDate: new Date().toISOString().split('T')[0],
      ...photoObj
    };
    setPhotos(prev => [newPhoto, ...prev]);
    // Notify in timeline
    addTimelineEvent({
      status: 'New Images Added',
      description: `Added "${newPhoto.stage} (${newPhoto.category})" photo: ${newPhoto.description}`
    });
  };

  return (
    <div className="auth-app-root">
      {/* Animated background system */}
      <div className="auth-bg" aria-hidden="true">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
        <div className="bg-orb orb-3" />
        <div className="bg-orb orb-4" />
        <div className="bg-grid" />
      </div>

      <ParticleField />

      <div className="auth-stage">
        <div className={`auth-form-panel ${screen === 'dashboard' ? 'dashboard-wide' : ''}`}>
          <div key={animKey} className="form-panel-inner fade-in-up">
            {screen === 'login' && (
              <LoginPage
                onLogin={handleLogin}
                onGoRegister={() => navigate('register')}
                theme={theme}
                setTheme={setTheme}
              />
            )}
            {screen === 'register' && (
              <RegisterPage
                onRegister={handleRegister}
                onGoLogin={() => navigate('login')}
                theme={theme}
                setTheme={setTheme}
              />
            )}
            {screen === 'dashboard' && user && (
              <DashboardScreen
                user={user}
                onLogout={handleLogout}
                theme={theme}
                setTheme={setTheme}
                siteDetails={siteDetails}
                setSiteDetails={setSiteDetails}
                photos={photos}
                setPhotos={setPhotos}
                addPhotoFromSite={addPhotoFromSite}
                timeline={timeline}
                addTimelineEvent={addTimelineEvent}
                deleteTimelineEvent={deleteTimelineEvent}
                costs={costs}
                setCosts={setCosts}
                materials={materials}
                setMaterials={setMaterials}
                workers={workers}
                setWorkers={setWorkers}
                clientNotes={clientNotes}
                saveClientNotes={saveClientNotes}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROUTER FOR CLIENT OR CONTRACTOR
// ══════════════════════════════════════════════════════════════════════════════
function DashboardScreen({
  user,
  onLogout,
  theme,
  setTheme,
  siteDetails,
  setSiteDetails,
  photos,
  setPhotos,
  addPhotoFromSite,
  timeline,
  addTimelineEvent,
  deleteTimelineEvent,
  costs,
  setCosts,
  materials,
  setMaterials,
  workers,
  setWorkers,
  clientNotes,
  saveClientNotes
}) {
  const isClient = user.role !== 'contractor';

  return (
    <div className="dashboard-root-layout">
      {/* Universal Top Nav */}
      <div className="dash-header flex-header">
        <div className="brand-logo-section">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="logo-svg-small">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="dash-brand-name">ConstructFlow 2026</span>
        </div>
        <div className="header-actions">
          <span className="user-profile-badge">
            <span className="role-dot-indicator" style={{ background: isClient ? '#22d3ee' : '#bf5af2' }}></span>
            {user.email} ({isClient ? 'Client' : 'Contractor'})
          </span>
          <button
            type="button"
            className="theme-toggle-btn-top"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button id="logout-btn" className="logout-btn" onClick={onLogout}>
            <LogoutIcon />
            Sign Out
          </button>
        </div>
      </div>

      {isClient ? (
        <ClientDashboard
          siteDetails={siteDetails}
          photos={photos}
          setPhotos={setPhotos}
          timeline={timeline}
          deleteTimelineEvent={deleteTimelineEvent}
          costs={costs}
          setCosts={setCosts}
          addTimelineEvent={addTimelineEvent}
          clientNotes={clientNotes}
          saveClientNotes={saveClientNotes}
        />
      ) : (
        <ContractorDashboard
          siteDetails={siteDetails}
          setSiteDetails={setSiteDetails}
          photos={photos}
          setPhotos={setPhotos}
          addPhotoFromSite={addPhotoFromSite}
          timeline={timeline}
          addTimelineEvent={addTimelineEvent}
          costs={costs}
          setCosts={setCosts}
          materials={materials}
          setMaterials={setMaterials}
          workers={workers}
          setWorkers={setWorkers}
          clientNotes={clientNotes}
          saveClientNotes={saveClientNotes}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. CLIENT DASHBOARD COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
function ClientDashboard({ siteDetails, photos, setPhotos, timeline, deleteTimelineEvent, costs, setCosts, addTimelineEvent, clientNotes, saveClientNotes }) {
  const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="dashboard-content-grid">
      {/* Site Header Block */}
      <div className="construction-hero client-hero">
        <div className="hero-flex">
          <div>
            <h1 className="hero-title">{siteDetails.siteName}</h1>
            <p className="hero-subtext">📍 {siteDetails.projectAddress}</p>
          </div>
          <div className="hero-badge-item">
            <span className="badge-tag">Current Stage</span>
            <span className="badge-value">{siteDetails.currentStage}</span>
          </div>
        </div>
        <p className="hero-desc">{siteDetails.siteDescription}</p>
        <div className="hero-meta-grid">
          <div><strong>Owner:</strong> {siteDetails.clientName}</div>
          <div><strong>Contractor:</strong> {siteDetails.contractorName}</div>
          <div><strong>Start Date:</strong> {siteDetails.startDate}</div>
          <div><strong>Expected End:</strong> {siteDetails.expectedCompletionDate}</div>
        </div>
      </div>

      <div className="dash-two-columns">
        {/* Column Left: Visual Gallery */}
        <div className="dash-column flex-grow-3">
          <ClientGalleryPanel photos={photos} setPhotos={setPhotos} addTimelineEvent={addTimelineEvent} />
        </div>

        {/* Column Right: Costs, Timeline, Notes */}
        <div className="dash-column flex-grow-2">
          <ClientBudgetPanel costs={costs} setCosts={setCosts} addTimelineEvent={addTimelineEvent} formatINR={formatINR} />
          <ClientTimelinePanel timeline={timeline} addTimelineEvent={addTimelineEvent} deleteTimelineEvent={deleteTimelineEvent} />
          <ClientNotesPanel clientNotes={clientNotes} saveClientNotes={saveClientNotes} addTimelineEvent={addTimelineEvent} />
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CLIENT GALLERY PANEL — Add (URL or file), Edit, Delete
// ══════════════════════════════════════════════════════════════════════════════
function ClientGalleryPanel({ photos, setPhotos, addTimelineEvent }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoFilter, setPhotoFilter] = useState('All');
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const [editPhotoDesc, setEditPhotoDesc] = useState('');
  const [editPhotoStage, setEditPhotoStage] = useState('');
  const [editPhotoCat, setEditPhotoCat] = useState('');
  const [showAddPhotoForm, setShowAddPhotoForm] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoStage, setNewPhotoStage] = useState('Roof Work');
  const [newPhotoCat, setNewPhotoCat] = useState('During');
  const [newPhotoDesc, setNewPhotoDesc] = useState('');
  const [newPhotoFile, setNewPhotoFile] = useState('');
  const [newPhotoFileName, setNewPhotoFileName] = useState('No file chosen');
  const [addPhotoMode, setAddPhotoMode] = useState('url');

  const photoStages = ['All', 'Foundation Work', 'Brick Work', 'Roof Work', 'Painting', 'Electrical Work', 'Interior Work'];
  const photoStageOptions = ['Foundation Work', 'Brick Work', 'Roof Work', 'Painting', 'Electrical Work', 'Interior Work'];
  const filteredPhotos = photoFilter === 'All' ? photos : photos.filter(p => p.stage === photoFilter);

  const downloadImage = (url, name) => {
    const link = document.createElement('a');
    link.href = url; link.download = name || 'photo.jpg'; link.target = '_blank';
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const startEditPhoto = (photo) => {
    setEditingPhotoId(photo.id); setEditPhotoDesc(photo.description);
    setEditPhotoStage(photo.stage); setEditPhotoCat(photo.category);
  };

  const savePhotoEdit = (photoId) => {
    setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, description: editPhotoDesc, stage: editPhotoStage, category: editPhotoCat } : p));
    setEditingPhotoId(null);
    addTimelineEvent({ status: 'Photo Edited', description: `Client updated photo details for "${editPhotoStage}"` });
  };

  const deletePhoto = (photoId) => {
    if (window.confirm('Delete this photo from the gallery?')) {
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      addTimelineEvent({ status: 'Photo Removed', description: 'A site progress photo was deleted by Client.' });
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0]; if (!file) return;
    setNewPhotoFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => setNewPhotoFile(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAddPhotoSubmit = (e) => {
    e.preventDefault();
    const finalUrl = addPhotoMode === 'file' ? newPhotoFile : newPhotoUrl;
    if (!finalUrl) { alert('Please provide a photo URL or select a file.'); return; }
    const newPhoto = { id: 'p-' + Date.now(), stage: newPhotoStage, category: newPhotoCat, url: finalUrl, uploadDate: new Date().toISOString().split('T')[0], description: newPhotoDesc || 'Client uploaded photo' };
    setPhotos(prev => [newPhoto, ...prev]);
    addTimelineEvent({ status: 'New Images Added', description: `Client added photo: "${newPhoto.description}" (${newPhotoStage})` });
    setNewPhotoUrl(''); setNewPhotoDesc(''); setNewPhotoFile(''); setNewPhotoFileName('No file chosen');
    setShowAddPhotoForm(false);
  };

  return (
    <div className="glass-card">
      <div className="card-header-row">
        <div>
          <h2 className="card-heading-title">🛠️ Working Site Gallery</h2>
          <span className="card-heading-subtitle">Add, edit & delete site progress photos</span>
        </div>
        <button type="button" className={`add-content-btn ${showAddPhotoForm ? 'cancel-mode' : ''}`}
          onClick={() => setShowAddPhotoForm(v => !v)}>
          {showAddPhotoForm ? '✕ Cancel' : '➕ Add Photo'}
        </button>
      </div>

      {showAddPhotoForm && (
        <div className="client-add-photo-form">
          <div className="add-photo-mode-toggle">
            <button type="button" className={`mode-toggle-btn ${addPhotoMode === 'url' ? 'active' : ''}`} onClick={() => setAddPhotoMode('url')}>🔗 From URL</button>
            <button type="button" className={`mode-toggle-btn ${addPhotoMode === 'file' ? 'active' : ''}`} onClick={() => setAddPhotoMode('file')}>📂 Upload File</button>
          </div>
          <form onSubmit={handleAddPhotoSubmit} className="simple-add-form" style={{ marginTop: '14px' }}>
            <div className="form-flex-row">
              <div className="form-group-item">
                <label>Stage</label>
                <select value={newPhotoStage} onChange={e => setNewPhotoStage(e.target.value)}>
                  {photoStageOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group-item">
                <label>Timing</label>
                <select value={newPhotoCat} onChange={e => setNewPhotoCat(e.target.value)}>
                  {['Before', 'During', 'Completed'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            {addPhotoMode === 'url' ? (
              <div className="form-group-item">
                <label>Image URL</label>
                <input type="url" placeholder="https://example.com/photo.jpg" value={newPhotoUrl} onChange={e => setNewPhotoUrl(e.target.value)} />
              </div>
            ) : (
              <div className="form-group-item">
                <label>Upload Image File</label>
                <div className="custom-file-upload-block">
                  <input type="file" id="client-photo-file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
                  <button type="button" className="add-content-btn" style={{ width: '100%' }} onClick={() => document.getElementById('client-photo-file').click()}>📂 Choose File</button>
                  <div style={{ marginTop: '6px', fontSize: '0.78rem', textAlign: 'center', opacity: 0.75 }}><strong>{newPhotoFileName}</strong></div>
                  {newPhotoFile && <img src={newPhotoFile} alt="preview" style={{ maxWidth: '100%', maxHeight: '100px', borderRadius: '8px', marginTop: '8px' }} />}
                </div>
              </div>
            )}
            <div className="form-group-item">
              <label>Description</label>
              <input type="text" placeholder="Describe this photo..." value={newPhotoDesc} onChange={e => setNewPhotoDesc(e.target.value)} />
            </div>
            <button type="submit" className="add-content-btn" style={{ width: '100%', marginTop: '10px' }}>✅ Add to Gallery</button>
          </form>
        </div>
      )}

      <div className="filter-scroll-container">
        {photoStages.map(stage => (
          <button key={stage} type="button" className={`filter-badge-btn ${photoFilter === stage ? 'active' : ''}`} onClick={() => setPhotoFilter(stage)}>{stage}</button>
        ))}
      </div>

      <div className="photo-gallery-grid">
        {filteredPhotos.map(photo => (
          <div key={photo.id} className="gallery-photo-card">
            <div className="photo-image-wrap" onClick={() => setSelectedPhoto(photo)}>
              <img src={photo.url} alt={photo.description} />
              <span className={`photo-category-badge ${photo.category.toLowerCase()}`}>{photo.category}</span>
            </div>
            {editingPhotoId === photo.id ? (
              <div className="photo-details-wrap editing-block">
                <div className="form-group-item" style={{ marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.7rem' }}>Stage</label>
                  <select value={editPhotoStage} onChange={e => setEditPhotoStage(e.target.value)} style={{ padding: '4px', fontSize: '0.8rem' }}>
                    {photoStageOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group-item" style={{ marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.7rem' }}>Timing</label>
                  <select value={editPhotoCat} onChange={e => setEditPhotoCat(e.target.value)} style={{ padding: '4px', fontSize: '0.8rem' }}>
                    {['Before', 'During', 'Completed'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group-item" style={{ marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.7rem' }}>Description</label>
                  <textarea value={editPhotoDesc} onChange={e => setEditPhotoDesc(e.target.value)} rows="2" style={{ padding: '4px', fontSize: '0.8rem' }} />
                </div>
                <div className="photo-actions-row">
                  <button type="button" className="photo-action-btn download" onClick={() => savePhotoEdit(photo.id)}>Save</button>
                  <button type="button" className="photo-action-btn zoom" onClick={() => setEditingPhotoId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="photo-details-wrap">
                <div className="photo-header-line">
                  <span className="photo-stage-tag">{photo.stage}</span>
                  <span className="photo-date-tag">{photo.uploadDate}</span>
                </div>
                <p className="photo-desc-text">{photo.description}</p>
                <div className="photo-actions-row" style={{ flexWrap: 'wrap', gap: '6px' }}>
                  <button type="button" className="photo-action-btn zoom" onClick={() => setSelectedPhoto(photo)}>🔍 Zoom</button>
                  <button type="button" className="photo-action-btn download" onClick={() => downloadImage(photo.url, `${photo.stage}.jpg`)}>⬇️ Download</button>
                  <button type="button" className="photo-action-btn edit-meta-btn" onClick={() => startEditPhoto(photo)} style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)' }}>✏️ Edit</button>
                  <button type="button" className="photo-action-btn delete-meta-btn" onClick={() => deletePhoto(photo.id)} style={{ background: 'rgba(244,63,94,0.1)', color: '#f87171', border: '1px solid rgba(244,63,94,0.25)' }}>🗑️ Del</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filteredPhotos.length === 0 && <div className="empty-state-notice">No progress photos found.</div>}
      </div>

      {selectedPhoto && (
        <div className="lightbox-overlay" onClick={() => setSelectedPhoto(null)}>
          <div className="lightbox-img-container" onClick={e => e.stopPropagation()}>
            <button type="button" className="close-lightbox-btn" onClick={() => setSelectedPhoto(null)}>&times;</button>
            <img src={selectedPhoto.url} alt={selectedPhoto.description} className="zoomed-image-item" />
            <div className="lightbox-caption-block">
              <h3 className="lightbox-stage-title">{selectedPhoto.stage} ({selectedPhoto.category})</h3>
              <p className="lightbox-desc">{selectedPhoto.description}</p>
              <div className="lightbox-meta">Uploaded on {selectedPhoto.uploadDate}</div>
              <div style={{ marginTop: '12px' }}>
                <button type="button" className="add-content-btn" onClick={() => downloadImage(selectedPhoto.url, `${selectedPhoto.stage}.jpg`)}>Download File</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CLIENT BUDGET PANEL — Full edit of ALL cost line items
// ══════════════════════════════════════════════════════════════════════════════
function ClientBudgetPanel({ costs, setCosts, addTimelineEvent, formatINR }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editBudget, setEditBudget] = useState(costs.totalBudget);
  const [editCement, setEditCement] = useState(costs.cement);
  const [editSteel, setEditSteel] = useState(costs.steel);
  const [editBricks, setEditBricks] = useState(costs.bricks);
  const [editPaint, setEditPaint] = useState(costs.paint);
  const [editLabour, setEditLabour] = useState(costs.labourCost);
  const [editExtras, setEditExtras] = useState([]);

  const extras = costs.extras || {};
  const extrasTotal = Object.values(extras).reduce((s, v) => s + v, 0);
  const spentAmount = costs.cement + costs.steel + costs.bricks + costs.paint + costs.labourCost + extrasTotal;
  const remainingAmount = costs.totalBudget - spentAmount;
  const spendPercentage = Math.min((spentAmount / costs.totalBudget) * 100, 100);

  const handleOpenEdit = () => {
    setEditBudget(costs.totalBudget); setEditCement(costs.cement); setEditSteel(costs.steel);
    setEditBricks(costs.bricks); setEditPaint(costs.paint); setEditLabour(costs.labourCost);
    const initialExtras = Object.entries(costs.extras || {}).map(([name, cost], idx) => ({
      id: `ext-client-${idx}-${Date.now()}`,
      name,
      cost
    }));
    setEditExtras(initialExtras);
    setIsEditing(true);
  };

  const handleAddEditExtra = () => {
    setEditExtras(prev => [
      ...prev,
      { id: `ext-new-${Date.now()}-${Math.random()}`, name: '', cost: '' }
    ]);
  };

  const handleUpdateExtraName = (id, name) => {
    setEditExtras(prev => prev.map(item => item.id === id ? { ...item, name } : item));
  };

  const handleUpdateExtraCost = (id, cost) => {
    setEditExtras(prev => prev.map(item => item.id === id ? { ...item, cost: cost === '' ? '' : parseFloat(cost) || 0 } : item));
  };

  const handleDeleteEditExtra = (id) => {
    setEditExtras(prev => prev.filter(item => item.id !== id));
  };

  const extrasTotalLive = editExtras.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);
  const liveTotalSpent = (parseFloat(editCement)||0)+(parseFloat(editSteel)||0)+(parseFloat(editBricks)||0)+(parseFloat(editPaint)||0)+(parseFloat(editLabour)||0)+extrasTotalLive;

  const handleSaveCosts = (e) => {
    e.preventDefault();
    const newExtras = {};
    editExtras.forEach(item => {
      if (item.name.trim()) {
        newExtras[item.name.trim()] = parseFloat(item.cost) || 0;
      }
    });

    const updated = {
      totalBudget: parseFloat(editBudget)||0,
      cement:      parseFloat(editCement)||0,
      steel:       parseFloat(editSteel)||0,
      bricks:      parseFloat(editBricks)||0,
      paint:       parseFloat(editPaint)||0,
      labourCost:  parseFloat(editLabour)||0,
      extras:      newExtras
    };
    setCosts(updated);
    setIsEditing(false);
    addTimelineEvent({ status: 'Budget Adjusted', description: `Client updated all cost allocations & custom items. Total Budget: ${formatINR(updated.totalBudget)}.` });
  };

  return (
    <div className="glass-card cost-glass-card">
      <div className="card-header-row">
        <h2 className="card-heading-title">💰 Budget & Costs</h2>
        <button type="button" className={`add-content-btn ${isEditing ? 'cancel-mode' : ''}`}
          style={{ fontSize: '0.75rem', padding: '4px 10px' }}
          onClick={() => isEditing ? setIsEditing(false) : handleOpenEdit()}>
          {isEditing ? '✕ Cancel' : '✍️ Edit All Costs'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSaveCosts} className="client-costs-edit-form">
          <div className="costs-edit-grid">
            <div className="costs-edit-field budget-field">
              <label>💼 Total Budget (₹)</label>
              <input type="number" value={editBudget} onChange={e => setEditBudget(e.target.value)} required />
            </div>
            <div className="costs-edit-field"><label>🏗️ Cement (₹)</label><input type="number" value={editCement} onChange={e => setEditCement(e.target.value)} required /></div>
            <div className="costs-edit-field"><label>⚙️ Steel (₹)</label><input type="number" value={editSteel} onChange={e => setEditSteel(e.target.value)} required /></div>
            <div className="costs-edit-field"><label>🧱 Bricks (₹)</label><input type="number" value={editBricks} onChange={e => setEditBricks(e.target.value)} required /></div>
            <div className="costs-edit-field"><label>🎨 Paint (₹)</label><input type="number" value={editPaint} onChange={e => setEditPaint(e.target.value)} required /></div>
            <div className="costs-edit-field"><label>👷 Labour (₹)</label><input type="number" value={editLabour} onChange={e => setEditLabour(e.target.value)} required /></div>
          </div>

          <div className="custom-items-edit-section">
            <h4 className="custom-items-edit-title">📦 Custom Extras Ledger</h4>
            {editExtras.length === 0 ? (
              <p className="no-custom-items-notice">No custom items added yet.</p>
            ) : (
              <div className="custom-items-edit-list">
                {editExtras.map((item) => (
                  <div key={item.id} className="custom-item-edit-row">
                    <input
                      type="text"
                      placeholder="Item Name (e.g. Sand)"
                      value={item.name}
                      onChange={(e) => handleUpdateExtraName(item.id, e.target.value)}
                      className="custom-item-name-input"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Cost (₹)"
                      value={item.cost}
                      onChange={(e) => handleUpdateExtraCost(item.id, e.target.value)}
                      className="custom-item-cost-input"
                      required
                    />
                    <button
                      type="button"
                      className="delete-custom-item-btn"
                      onClick={() => handleDeleteEditExtra(item.id)}
                      title="Remove Item"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              className="add-custom-item-btn"
              onClick={handleAddEditExtra}
            >
              ➕ Add Custom Item
            </button>
          </div>

          <div className="costs-edit-preview">
            <span>Live Total Spent:</span>
            <strong style={{ color: liveTotalSpent > (parseFloat(editBudget)||0) ? '#f43f5e' : '#10b981' }}>{formatINR(liveTotalSpent)}</strong>
          </div>
          <button type="submit" className="add-content-btn" style={{ width: '100%', marginTop: '12px' }}>💾 Save All Budget Changes</button>
        </form>
      ) : (
        <>
          <div className="cost-kpi-grid">
            <div className="kpi-box budget"><span className="kpi-label">Total Budget</span><span className="kpi-val">{formatINR(costs.totalBudget)}</span></div>
            <div className="kpi-box spent"><span className="kpi-label">Spent Amount</span><span className="kpi-val">{formatINR(spentAmount)}</span></div>
            <div className="kpi-box remaining"><span className="kpi-label">Remaining</span><span className="kpi-val" style={{ color: remainingAmount < 0 ? '#f43f5e' : '#10b981' }}>{formatINR(remainingAmount)}</span></div>
          </div>
          <div className="progress-bar-block">
            <div className="progress-label-flex"><span>Budget Spent Efficiency</span><span>{spendPercentage.toFixed(1)}%</span></div>
            <div className="progress-bar-bg-custom">
              <div className="progress-bar-fill-custom" style={{ width: `${spendPercentage}%`, background: spendPercentage > 90 ? 'var(--red-neon)' : 'linear-gradient(90deg, var(--cyan-bright), var(--violet-neon))' }} />
            </div>
          </div>
          <div className="cost-breakdown-list">
            <h3 className="breakdown-subtitle">Itemized Expenditure</h3>
            <ul className="itemized-ul">
              {[['🏗️ Cement', costs.cement], ['⚙️ Steel', costs.steel], ['🧱 Bricks', costs.bricks], ['🎨 Paint', costs.paint], ['👷 Labour Cost', costs.labourCost]].map(([name, val]) => (
                <li key={name} className="itemized-li"><span className="item-name">{name}</span><span className="item-cost">{formatINR(val)}</span></li>
              ))}
              {Object.entries(extras).map(([name, val]) => (
                <li key={name} className="itemized-li itemized-li-new">
                  <span className="item-name">📦 {name}</span>
                  <span className="item-cost">{formatINR(val)}</span>
                </li>
              ))}
              {extrasTotal > 0 && (
                <li className="itemized-li itemized-total-row">
                  <span className="item-name" style={{ fontWeight: 700 }}>Total Spent</span>
                  <span className="item-cost" style={{ color: spentAmount > costs.totalBudget ? '#f43f5e' : '#10b981', fontWeight: 800 }}>{formatINR(spentAmount)}</span>
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CLIENT TIMELINE PANEL — Add events + Delete events
// ══════════════════════════════════════════════════════════════════════════════
function ClientTimelinePanel({ timeline, addTimelineEvent, deleteTimelineEvent }) {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newStatus, setNewStatus] = useState('Progress Update');
  const [newDesc, setNewDesc] = useState('');

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newDesc.trim()) return;
    addTimelineEvent({ status: newStatus, description: newDesc });
    setNewDesc(''); setShowAddEvent(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this timeline event?')) deleteTimelineEvent(id);
  };

  return (
    <div className="glass-card" style={{ marginTop: '24px' }}>
      <div className="card-header-row">
        <h2 className="card-heading-title">⏱️ Live Timeline Logs</h2>
        <button type="button" className={`add-content-btn ${showAddEvent ? 'cancel-mode' : ''}`}
          style={{ fontSize: '0.75rem', padding: '4px 10px' }}
          onClick={() => setShowAddEvent(v => !v)}>
          {showAddEvent ? '✕ Cancel' : '➕ Add Event'}
        </button>
      </div>
      {showAddEvent && (
        <form onSubmit={handleAddEvent} className="simple-add-form timeline-add-form">
          <div className="form-group-item">
            <label>Event Type</label>
            <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
              <option value="Progress Update">Progress Update</option>
              <option value="Client Note">Client Note</option>
              <option value="Budget Adjusted">Budget Adjusted</option>
              <option value="Inspection Request">Inspection Request</option>
              <option value="Work Completed">Work Completed</option>
              <option value="Milestone Reached">Milestone Reached</option>
            </select>
          </div>
          <div className="form-group-item">
            <label>Description</label>
            <textarea rows="3" placeholder="Describe this event..." value={newDesc} onChange={e => setNewDesc(e.target.value)} required />
          </div>
          <button type="submit" className="add-content-btn" style={{ width: '100%' }}>📋 Log Event</button>
        </form>
      )}
      <div className="timeline-v-list">
        {timeline.map(event => (
          <div key={event.id} className="timeline-v-item client-timeline-item">
            <div className="timeline-node-dot"></div>
            <div className="timeline-v-card" style={{ flex: 1 }}>
              <div className="timeline-v-header">
                <span className="timeline-v-time">{event.time}</span>
                <span className="timeline-v-status">{event.status}</span>
                <button type="button" className="timeline-delete-btn" title="Delete event" onClick={() => handleDelete(event.id)}>✕</button>
              </div>
              <p className="timeline-v-desc">{event.description}</p>
              <span className="timeline-v-date">{event.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CLIENT NOTES & REQUESTS PANEL — Fully manageable by client
// ══════════════════════════════════════════════════════════════════════════════
function ClientNotesPanel({ clientNotes, saveClientNotes, addTimelineEvent }) {
  const notes = clientNotes;
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteType, setNoteType] = useState('Note');
  const [noteText, setNoteText] = useState('');
  const [notePriority, setNotePriority] = useState('medium');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editNoteText, setEditNoteText] = useState('');
  const [sentFlash, setSentFlash] = useState(null); // id of note just sent

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    const newNote = {
      id: 'n-' + Date.now(),
      type: noteType,
      text: noteText,
      date: new Date().toISOString().split('T')[0],
      priority: notePriority,
      readByContractor: false   // ← marks as unread for contractor
    };
    saveClientNotes([newNote, ...notes]);
    // Also log it in the shared timeline so contractor sees it immediately
    addTimelineEvent({
      status: 'Client Message',
      description: `[${noteType}] ${noteText}`
    });
    setSentFlash(newNote.id);
    setTimeout(() => setSentFlash(null), 2500);
    setNoteText('');
    setShowAddNote(false);
  };

  const handleDeleteNote = (id) => {
    if (window.confirm('Delete this note?')) saveClientNotes(notes.filter(n => n.id !== id));
  };
  const handleSaveEditNote = (id) => {
    // Reset seen status so contractor is notified again after edit
    saveClientNotes(notes.map(n => n.id === id
      ? { ...n, text: editNoteText, readByContractor: false, seenAt: null }
      : n
    ));
    setEditingNoteId(null);
  };

  const priorityColors = { high: '#f43f5e', medium: '#f59e0b', low: '#10b981' };
  const priorityLabels = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' };

  return (
    <div className="glass-card client-notes-card" style={{ marginTop: '24px' }}>
      <div className="card-header-row">
        <div>
          <h2 className="card-heading-title">📝 My Notes & Requests</h2>
          <span className="card-heading-subtitle">Notes are sent as live notifications to your contractor 🔔</span>
        </div>
        <button type="button" className={`add-content-btn ${showAddNote ? 'cancel-mode' : ''}`}
          style={{ fontSize: '0.75rem', padding: '4px 10px' }}
          onClick={() => setShowAddNote(v => !v)}>
          {showAddNote ? '✕ Cancel' : '➕ New Note'}
        </button>
      </div>
      {sentFlash && (
        <div className="note-sent-banner">
          🔔 Notification sent to contractor!
        </div>
      )}
      {showAddNote && (
        <form onSubmit={handleAddNote} className="simple-add-form notes-add-form">
          <div className="form-flex-row">
            <div className="form-group-item">
              <label>Type</label>
              <select value={noteType} onChange={e => setNoteType(e.target.value)}>
                <option value="Note">📌 Note</option>
                <option value="Request">🔔 Request</option>
                <option value="Reminder">⏰ Reminder</option>
                <option value="Approval">✅ Approval</option>
              </select>
            </div>
            <div className="form-group-item">
              <label>Priority</label>
              <select value={notePriority} onChange={e => setNotePriority(e.target.value)}>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
          </div>
          <div className="form-group-item">
            <label>Note / Request Text</label>
            <textarea rows="3" placeholder="Write your note or request here..." value={noteText} onChange={e => setNoteText(e.target.value)} required />
          </div>
          <button type="submit" className="add-content-btn" style={{ width: '100%' }}>💾 Save Note</button>
        </form>
      )}
      <div className="notes-list">
        {notes.length === 0 && <div className="empty-state-notice">No notes yet. Add your first note above!</div>}
        {notes.map(note => (
          <div key={note.id} className="note-item-card">
            <div className="note-item-header">
              <div className="note-type-badge">
                <span className="note-priority-dot" style={{ background: priorityColors[note.priority] }} />
                <span className="note-type-label">{note.type}</span>
                <span className="note-priority-label" style={{ color: priorityColors[note.priority], fontSize: '0.72rem' }}>{priorityLabels[note.priority]}</span>
              </div>
              <span className="note-date">{note.date}</span>
            </div>
            {editingNoteId === note.id ? (
              <div style={{ marginTop: '8px' }}>
                <textarea value={editNoteText} onChange={e => setEditNoteText(e.target.value)} rows="3" className="note-edit-textarea" />
                <div className="note-actions-row">
                  <button type="button" className="note-action-btn save-btn" onClick={() => handleSaveEditNote(note.id)}>✅ Save</button>
                  <button type="button" className="note-action-btn cancel-btn" onClick={() => setEditingNoteId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <p className="note-text">{note.text}</p>
                {/* Auto seen-receipt from contractor */}
                {note.seenAt ? (
                  <div className="note-seen-receipt">
                    <span className="seen-tick">✅</span>
                    <span>Seen by Contractor at {note.seenAt}</span>
                  </div>
                ) : (
                  <div className="note-pending-receipt">
                    <span className="pending-dot" />
                    <span>Awaiting contractor</span>
                  </div>
                )}
                <div className="note-actions-row" style={{ marginTop: '8px' }}>
                  <button type="button" className="note-action-btn edit-btn" onClick={() => { setEditingNoteId(note.id); setEditNoteText(note.text); }}>✏️ Edit</button>
                  <button type="button" className="note-action-btn delete-btn" onClick={() => handleDeleteNote(note.id)}>🗑️ Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. CONTRACTOR DASHBOARD COMPONENT (with Edit Process and Custom Image Uploads)
// ══════════════════════════════════════════════════════════════════════════════
function ContractorDashboard({
  siteDetails,
  setSiteDetails,
  photos,
  setPhotos,
  addPhotoFromSite,
  timeline,
  addTimelineEvent,
  costs,
  setCosts,
  materials,
  setMaterials,
  workers,
  setWorkers,
  clientNotes,
  saveClientNotes
}) {
  const [activeSubTab, setActiveSubTab] = useState('project'); // 'project' | 'labour' | 'materials' | 'upload' | 'budget'
  const unreadNotifications = clientNotes.filter(n => !n.readByContractor).length;

  const markAllNotificationsRead = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    saveClientNotes(clientNotes.map(n => ({
      ...n,
      readByContractor: true,
      seenAt: n.seenAt || timeStr   // stamp only if not already seen
    })));
  };

  const markNotificationRead = (id) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    saveClientNotes(clientNotes.map(n =>
      n.id === id
        ? { ...n, readByContractor: true, seenAt: n.seenAt || timeStr }
        : n
    ));
  };
  
  // Materials Ledger Form States
  const [newMatName, setNewMatName] = useState('');
  const [newMatQty, setNewMatQty] = useState('');
  const [newMatUnit, setNewMatUnit] = useState('Bags');
  const [newMatPrice, setNewMatPrice] = useState('');
  const [newMatSupplier, setNewMatSupplier] = useState('');

  // Site Details Edit States
  const [editDetails, setEditDetails] = useState({ ...siteDetails });
  const [isEditingSite, setIsEditingSite] = useState(false);

  // Custom Local File Upload States
  const [uploadStage, setUploadStage] = useState('Roof Work');
  const [uploadCategory, setUploadCategory] = useState('During');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [fileNameLabel, setFileNameLabel] = useState('No file chosen');
  const [uploadError, setUploadError] = useState('');

  // Inline Photo Editor States on Contractor view
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const [editPhotoDesc, setEditPhotoDesc] = useState('');
  const [editPhotoStage, setEditPhotoStage] = useState('');
  const [editPhotoCat, setEditPhotoCat] = useState('');

  // Timeline Event Form State
  const [timelineStatus, setTimelineStatus] = useState('Progress Update');
  const [timelineDesc, setTimelineDesc] = useState('');

  // Direct Cost Editing States
  const [budgetVal, setBudgetVal] = useState(costs.totalBudget);
  const [cementVal, setCementVal] = useState(costs.cement);
  const [steelVal, setSteelVal] = useState(costs.steel);
  const [bricksVal, setBricksVal] = useState(costs.bricks);
  const [paintVal, setPaintVal] = useState(costs.paint);
  const [labourVal, setLabourVal] = useState(costs.labourCost);
  const [contractorExtras, setContractorExtras] = useState([]);

  const handleAddContractorExtra = () => {
    setContractorExtras(prev => [
      ...prev,
      { id: `ext-contractor-new-${Date.now()}-${Math.random()}`, name: '', cost: '' }
    ]);
  };

  const handleUpdateContractorExtraName = (id, name) => {
    setContractorExtras(prev => prev.map(item => item.id === id ? { ...item, name } : item));
  };

  const handleUpdateContractorExtraCost = (id, cost) => {
    setContractorExtras(prev => prev.map(item => item.id === id ? { ...item, cost: cost === '' ? '' : parseFloat(cost) || 0 } : item));
  };

  const handleDeleteContractorExtra = (id) => {
    setContractorExtras(prev => prev.filter(item => item.id !== id));
  };

  // Load editing details if stats change
  useEffect(() => {
    setEditDetails({ ...siteDetails });
  }, [siteDetails]);

  useEffect(() => {
    setBudgetVal(costs.totalBudget);
    setCementVal(costs.cement);
    setSteelVal(costs.steel);
    setBricksVal(costs.bricks);
    setPaintVal(costs.paint);
    setLabourVal(costs.labourCost);
    const initialExtras = Object.entries(costs.extras || {}).map(([name, cost], idx) => ({
      id: `ext-contractor-${idx}-${Date.now()}`,
      name,
      cost
    }));
    setContractorExtras(initialExtras);
  }, [costs]);

  // Recalculate Active Labour
  const totalLaboursCount = workers.filter(w => w.present).length;
  const masonsCount = workers.filter(w => w.present && w.role === 'Mason').length;
  const paintersCount = workers.filter(w => w.present && w.role === 'Painter').length;
  const electriciansCount = workers.filter(w => w.present && w.role === 'Electrician').length;
  const helpersCount = workers.filter(w => w.present && w.role === 'Helper').length;

  const toggleAttendance = (workerId) => {
    setWorkers(prev => {
      const updated = prev.map(w => w.id === workerId ? { ...w, present: !w.present } : w);
      const presentCount = updated.filter(worker => worker.present).length;
      // Recalculate daily wages dynamically (₹800 wage scaled)
      const updatedLabourCost = presentCount * 800 * 2; 
      setCosts(c => ({ ...c, labourCost: updatedLabourCost }));
      return updated;
    });
  };

  // Convert File Input to Base64 (Custom Image Upload)
  const handleLocalFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileNameLabel(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadUrl(reader.result); // Base64 data URL string!
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadUrl) {
      setUploadError('Please select a local custom image file first.');
      return;
    }
    setUploadError('');
    addPhotoFromSite({
      stage: uploadStage,
      category: uploadCategory,
      url: uploadUrl,
      description: uploadDesc || 'Uploaded progress update image'
    });

    // Reset Form
    setUploadDesc('');
    setUploadUrl('');
    setFileNameLabel('No file chosen');
    alert('Custom image successfully uploaded & synchronized to Client dashboard!');
  };

  const handleAddMaterial = (e) => {
    e.preventDefault();
    if (!newMatName || !newMatQty || !newMatPrice) return;
    
    const costValue = parseFloat(newMatQty) * parseFloat(newMatPrice);
    const newMaterial = {
      id: 'm-' + Date.now(),
      name: newMatName,
      qty: parseFloat(newMatQty),
      unit: newMatUnit,
      price: parseFloat(newMatPrice),
      supplier: newMatSupplier || 'General Supply Co.',
      date: new Date().toISOString().split('T')[0]
    };

    setMaterials(prev => [newMaterial, ...prev]);

    // Map material name → costs bucket (or extras)
    const updatedCostsKey = newMatName.toLowerCase();
    setCosts(prevCosts => {
      let updatedCosts = { ...prevCosts, extras: { ...(prevCosts.extras || {}) } };
      if (updatedCostsKey.includes('cement')) {
        updatedCosts.cement = (updatedCosts.cement || 0) + costValue;
      } else if (updatedCostsKey.includes('steel')) {
        updatedCosts.steel = (updatedCosts.steel || 0) + costValue;
      } else if (updatedCostsKey.includes('brick')) {
        updatedCosts.bricks = (updatedCosts.bricks || 0) + costValue;
      } else if (updatedCostsKey.includes('paint')) {
        updatedCosts.paint = (updatedCosts.paint || 0) + costValue;
      } else {
        // New custom material → add as its own line item
        updatedCosts.extras[newMatName] = (updatedCosts.extras[newMatName] || 0) + costValue;
      }
      return updatedCosts;
    });

    addTimelineEvent({
      status: 'Material Delivered',
      description: `Delivered ${newMatQty} ${newMatUnit} of ${newMatName} (Budget item cost incremented).`
    });

    setNewMatName('');
    setNewMatQty('');
    setNewMatPrice('');
    setNewMatSupplier('');
    alert('Material recorded successfully!');
  };

  const saveSiteDetails = (e) => {
    e.preventDefault();
    setSiteDetails({ ...editDetails });
    setIsEditingSite(false);
    addTimelineEvent({
      status: 'Project Info Updated',
      description: `Site details modified. Current stage: ${editDetails.currentStage}`
    });
    alert('Project details saved!');
  };

  // Direct Budget & Cost Save Form
  const saveCostsEdit = (e) => {
    e.preventDefault();
    const newExtras = {};
    contractorExtras.forEach(item => {
      if (item.name.trim()) {
        newExtras[item.name.trim()] = parseFloat(item.cost) || 0;
      }
    });

    setCosts(prev => ({
      totalBudget: parseFloat(budgetVal) || 0,
      cement:      parseFloat(cementVal) || 0,
      steel:       parseFloat(steelVal)  || 0,
      bricks:      parseFloat(bricksVal) || 0,
      paint:       parseFloat(paintVal)  || 0,
      labourCost:  parseFloat(labourVal) || 0,
      extras:      newExtras
    }));
    addTimelineEvent({
      status: 'Costs Updated',
      description: 'Site manager adjusted itemized ledger costs.'
    });
    alert('Site budget costs saved and pushed to client view!');
  };

  const handleTimelineSubmit = (e) => {
    e.preventDefault();
    if (!timelineDesc) return;
    addTimelineEvent({
      status: timelineStatus,
      description: timelineDesc
    });
    setTimelineDesc('');
    alert('Timeline log broadcasted to Client!');
  };

  // Editing gallery photos in Contractor Panel
  const startEditPhoto = (photo) => {
    setEditingPhotoId(photo.id);
    setEditPhotoDesc(photo.description);
    setEditPhotoStage(photo.stage);
    setEditPhotoCat(photo.category);
  };

  const savePhotoEdit = (photoId) => {
    setPhotos(prev => prev.map(p => {
      if (p.id === photoId) {
        return { ...p, description: editPhotoDesc, stage: editPhotoStage, category: editPhotoCat };
      }
      return p;
    }));
    setEditingPhotoId(null);
    addTimelineEvent({
      status: 'Photo Edited',
      description: `Contractor updated details for progress photo in "${editPhotoStage}"`
    });
  };

  const deletePhoto = (photoId) => {
    if (window.confirm('Delete this photo?')) {
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      addTimelineEvent({
        status: 'Photo Removed',
        description: 'A site progress photo was deleted by Contractor.'
      });
    }
  };

  return (
    <div className="dashboard-content-grid">
      
      {/* Contractor Navbar */}
      <div className="construction-nav contractor-subnav">
        <div className="construction-tabs">
          <button
            type="button"
            className={`construction-tab-btn ${activeSubTab === 'project' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('project')}
          >
            📋 Site Info & Logs
            {unreadNotifications > 0 && (
              <span className="notif-badge">{unreadNotifications}</span>
            )}
          </button>
          <button
            type="button"
            className={`construction-tab-btn ${activeSubTab === 'labour' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('labour')}
          >
            👷 Daily Labour
          </button>
          <button
            type="button"
            className={`construction-tab-btn ${activeSubTab === 'materials' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('materials')}
          >
            📦 Materials Ledger
          </button>
          <button
            type="button"
            className={`construction-tab-btn ${activeSubTab === 'budget' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('budget')}
          >
            💰 Budget Costs
          </button>
          <button
            type="button"
            className={`construction-tab-btn ${activeSubTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('upload')}
          >
            📷 Photos & Gallery
          </button>
        </div>
      </div>

      <div className="construction-tab-panels">

        {/* Tab 1: SITE DETAILS & LOGS */}
        {activeSubTab === 'project' && (
          <div className="dash-two-columns">
            <div className="dash-column flex-grow-3">
              <div className="glass-card">
                <div className="card-header-row">
                  <h2 className="card-heading-title">🏗️ Project Site Details</h2>
                  <button
                    type="button"
                    className="add-content-btn"
                    onClick={() => setIsEditingSite(!isEditingSite)}
                  >
                    {isEditingSite ? 'Cancel Edit' : '✍️ Edit Details'}
                  </button>
                </div>

                {!isEditingSite ? (
                  <div className="site-details-read-mode">
                    <table className="site-details-table">
                      <tbody>
                        <tr>
                          <th>Site Name</th>
                          <td>{siteDetails.siteName}</td>
                        </tr>
                        <tr>
                          <th>Project Address</th>
                          <td>{siteDetails.projectAddress}</td>
                        </tr>
                        <tr>
                          <th>Client Name</th>
                          <td>{siteDetails.clientName}</td>
                        </tr>
                        <tr>
                          <th>Contractor Name</th>
                          <td>{siteDetails.contractorName}</td>
                        </tr>
                        <tr>
                          <th>Project Type</th>
                          <td>{siteDetails.projectType}</td>
                        </tr>
                        <tr>
                          <th>Start Date</th>
                          <td>{siteDetails.startDate}</td>
                        </tr>
                        <tr>
                          <th>Expected Completion</th>
                          <td>{siteDetails.expectedCompletionDate}</td>
                        </tr>
                        <tr>
                          <th>Description</th>
                          <td>{siteDetails.siteDescription}</td>
                        </tr>
                        <tr>
                          <th>Current Stage</th>
                          <td>
                            <span className="badge-value" style={{ margin: 0, padding: '4px 10px', fontSize: '0.9rem' }}>
                              {siteDetails.currentStage}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <form onSubmit={saveSiteDetails} className="site-details-edit-form">
                    <div className="edit-form-grid">
                      <div className="form-group-item">
                        <label>Site Name</label>
                        <input
                          type="text"
                          value={editDetails.siteName}
                          onChange={(e) => setEditDetails({ ...editDetails, siteName: e.target.value })}
                        />
                      </div>
                      <div className="form-group-item">
                        <label>Project Address</label>
                        <input
                          type="text"
                          value={editDetails.projectAddress}
                          onChange={(e) => setEditDetails({ ...editDetails, projectAddress: e.target.value })}
                        />
                      </div>
                      <div className="form-group-item">
                        <label>Client Name</label>
                        <input
                          type="text"
                          value={editDetails.clientName}
                          onChange={(e) => setEditDetails({ ...editDetails, clientName: e.target.value })}
                        />
                      </div>
                      <div className="form-group-item">
                        <label>Contractor Name</label>
                        <input
                          type="text"
                          value={editDetails.contractorName}
                          onChange={(e) => setEditDetails({ ...editDetails, contractorName: e.target.value })}
                        />
                      </div>
                      <div className="form-group-item">
                        <label>Project Type</label>
                        <input
                          type="text"
                          value={editDetails.projectType}
                          onChange={(e) => setEditDetails({ ...editDetails, projectType: e.target.value })}
                        />
                      </div>
                      <div className="form-group-item">
                        <label>Expected Completion</label>
                        <input
                          type="date"
                          value={editDetails.expectedCompletionDate}
                          onChange={(e) => setEditDetails({ ...editDetails, expectedCompletionDate: e.target.value })}
                        />
                      </div>
                      <div className="form-group-item full-width">
                        <label>Site Description</label>
                        <textarea
                          rows="3"
                          value={editDetails.siteDescription}
                          onChange={(e) => setEditDetails({ ...editDetails, siteDescription: e.target.value })}
                        />
                      </div>
                      <div className="form-group-item">
                        <label>Current Stage</label>
                        <select
                          value={editDetails.currentStage}
                          onChange={(e) => setEditDetails({ ...editDetails, currentStage: e.target.value })}
                        >
                          <option value="Foundation Work">Foundation Work</option>
                          <option value="Brick Work">Brick Work</option>
                          <option value="Roof Work">Roof Work</option>
                          <option value="Electrical Work">Electrical Work</option>
                          <option value="Painting">Painting</option>
                          <option value="Interior Work">Interior Work</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="auth-submit-btn" style={{ height: '44px', marginTop: '16px' }}>
                      Save Project Info
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="dash-column flex-grow-2">
              <div className="glass-card">
                <h2 className="card-heading-title">✍️ Broadcast Timeline Update</h2>
                <form onSubmit={handleTimelineSubmit} className="simple-add-form">
                  <div className="form-group-item">
                    <label>Event Type</label>
                    <select
                      value={timelineStatus}
                      onChange={(e) => setTimelineStatus(e.target.value)}
                    >
                      <option value="Progress Update">Progress Update</option>
                      <option value="Foundation Started">Foundation Started</option>
                      <option value="Material Delivered">Material Delivered</option>
                      <option value="Painting Completed">Painting Completed</option>
                      <option value="New Images Added">New Images Added</option>
                      <option value="Inspection Approved">Inspection Approved</option>
                    </select>
                  </div>
                  <div className="form-group-item">
                    <label>Description Note</label>
                    <textarea
                      rows="4"
                      placeholder="Enter update description..."
                      value={timelineDesc}
                      onChange={(e) => setTimelineDesc(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="add-content-btn" style={{ width: '100%', marginTop: '10px' }}>
                    Broadcast to Client
                  </button>
                </form>
              </div>

              {/* ── CLIENT NOTIFICATIONS PANEL ─────────────────────────── */}
              <div className="glass-card contractor-notif-card" style={{ marginTop: '24px' }}>
                <div className="card-header-row">
                  <div>
                    <h2 className="card-heading-title">
                      🔔 Client Messages
                      {unreadNotifications > 0 && (
                        <span className="notif-badge notif-badge-inline">{unreadNotifications} new</span>
                      )}
                    </h2>
                    <span className="card-heading-subtitle">Notes & requests sent by your client</span>
                  </div>
                  {unreadNotifications > 0 && (
                    <button
                      type="button"
                      className="add-content-btn"
                      style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                      onClick={markAllNotificationsRead}
                    >
                      ✓ Mark All Read
                    </button>
                  )}
                </div>

                <div className="contractor-notif-list">
                  {clientNotes.length === 0 && (
                    <div className="empty-state-notice">No messages from client yet.</div>
                  )}
                  {clientNotes.map(note => {
                    const priorityColors = { high: '#f43f5e', medium: '#f59e0b', low: '#10b981' };
                    const priorityLabels = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' };
                    return (
                      <div
                        key={note.id}
                        className={`contractor-notif-item ${!note.readByContractor ? 'unread' : ''}`}
                        onClick={() => markNotificationRead(note.id)}
                      >
                        <div className="notif-item-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {!note.readByContractor && <span className="notif-unread-dot" />}
                            <span className="note-type-label">{note.type}</span>
                            <span style={{ color: priorityColors[note.priority], fontSize: '0.72rem', fontWeight: 600 }}>
                              {priorityLabels[note.priority]}
                            </span>
                          </div>
                          <span className="note-date">{note.date}</span>
                        </div>
                        <p className="notif-item-text">{note.text}</p>
                        {!note.readByContractor && (
                          <div className="notif-click-hint">Click to mark as read</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: DAILY LABOUR MANAGEMENT */}
        {activeSubTab === 'labour' && (
          <div className="dash-two-columns">
            <div className="dash-column flex-grow-3">
              <div className="glass-card">
                <h2 className="card-heading-title">👷 Daily Labour Attendance</h2>
                <span className="card-heading-subtitle">Toggle checkboxes to update counts and wage budgets instantly</span>
                
                <div className="worker-checklist-container" style={{ marginTop: '16px' }}>
                  <table className="expense-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Worker Name</th>
                        <th>Role / Skillset</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workers.map(w => (
                        <tr key={w.id}>
                          <td style={{ width: '80px' }}>
                            <div
                              className={`custom-checkbox ${w.present ? 'checked' : ''}`}
                              onClick={() => toggleAttendance(w.id)}
                            >
                              {w.present && <CheckIcon />}
                            </div>
                          </td>
                          <td><strong>{w.name}</strong></td>
                          <td>
                            <span className={`worker-role-tag ${w.role.toLowerCase()}`}>
                              {w.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="dash-column flex-grow-2">
              <div className="glass-card flex-kpi-card">
                <h2 className="card-heading-title">📈 Daily Labour Summary</h2>
                <div className="labour-big-stat" style={{ textAlign: 'center', margin: '20px 0' }}>
                  <span className="large-count">{totalLaboursCount}</span>
                  <span className="large-lbl">Workers Active Today</span>
                </div>
                <div className="role-breakdown-box">
                  <h3 className="breakdown-subtitle">Skill Distribution</h3>
                  <ul className="itemized-ul">
                    <li className="itemized-li">
                      <span className="item-name">👷 Masons</span>
                      <span className="item-cost font-weight-bold">{masonsCount} / 6 present</span>
                    </li>
                    <li className="itemized-li">
                      <span className="item-name">🎨 Painters</span>
                      <span className="item-cost font-weight-bold">{paintersCount} / 4 present</span>
                    </li>
                    <li className="itemized-li">
                      <span className="item-name">⚡ Electricians</span>
                      <span className="item-cost font-weight-bold">{electriciansCount} / 3 present</span>
                    </li>
                    <li className="itemized-li">
                      <span className="item-name">🤝 Helpers</span>
                      <span className="item-cost font-weight-bold">{helpersCount} / 5 present</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: MATERIALS LEDGER */}
        {activeSubTab === 'materials' && (
          <div className="dash-two-columns">
            <div className="dash-column flex-grow-3">
              <div className="glass-card">
                <h2 className="card-heading-title">📦 Materials Inventory Logs</h2>
                <div className="table-responsive-wrapper" style={{ marginTop: '16px' }}>
                  <table className="expense-table">
                    <thead>
                      <tr>
                        <th>Material</th>
                        <th>Qty</th>
                        <th>Rate (₹)</th>
                        <th>Supplier</th>
                        <th>Delivery Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materials.map(mat => (
                        <tr key={mat.id}>
                          <td><strong>{mat.name}</strong></td>
                          <td>{mat.qty} {mat.unit}</td>
                          <td>₹{mat.price.toLocaleString()}</td>
                          <td>{mat.supplier}</td>
                          <td>{mat.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="dash-column flex-grow-2">
              <div className="glass-card">
                <h2 className="card-heading-title">➕ Add Materials Delivery</h2>
                <form onSubmit={handleAddMaterial} className="simple-add-form">
                  <div className="form-group-item">
                    <label>Material Name</label>
                    <input
                      type="text"
                      placeholder="Cement, Steel, Bricks..."
                      value={newMatName}
                      onChange={(e) => setNewMatName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-flex-row">
                    <div className="form-group-item">
                      <label>Quantity</label>
                      <input
                        type="number"
                        placeholder="100"
                        value={newMatQty}
                        onChange={(e) => setNewMatQty(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group-item">
                      <label>Unit</label>
                      <select
                        value={newMatUnit}
                        onChange={(e) => setNewMatUnit(e.target.value)}
                      >
                        <option value="Bags">Bags</option>
                        <option value="Tons">Tons</option>
                        <option value="Nos">Nos</option>
                        <option value="Buckets">Buckets</option>
                        <option value="Meters">Meters</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group-item">
                    <label>Price Rate (Per Unit) (₹)</label>
                    <input
                      type="number"
                      placeholder="400"
                      value={newMatPrice}
                      onChange={(e) => setNewMatPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group-item">
                    <label>Supplier Shop Name</label>
                    <input
                      type="text"
                      placeholder="UltraTech Cement, TATA Steel..."
                      value={newMatSupplier}
                      onChange={(e) => setNewMatSupplier(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="add-content-btn" style={{ width: '100%', marginTop: '12px' }}>
                    Record Delivery & Update Budget
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: DIRECT BUDGET COSTS MANAGEMENT */}
        {activeSubTab === 'budget' && (
          <div className="dash-two-columns">
            <div className="dash-column flex-grow-3">
              <div className="glass-card">
                <h2 className="card-heading-title">💰 Edit Project Budget & Expenses Ledger</h2>
                <span className="card-heading-subtitle">Process adjustments on costs directly displayed on client dashboard</span>
                
                <form onSubmit={saveCostsEdit} className="site-details-edit-form" style={{ marginTop: '20px' }}>
                  <div className="edit-form-grid">
                    <div className="form-group-item">
                      <label>Total Allocated Budget (₹)</label>
                      <input
                        type="number"
                        value={budgetVal}
                        onChange={(e) => setBudgetVal(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group-item">
                      <label>Cement Expenses (₹)</label>
                      <input
                        type="number"
                        value={cementVal}
                        onChange={(e) => setCementVal(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group-item">
                      <label>Steel Expenses (₹)</label>
                      <input
                        type="number"
                        value={steelVal}
                        onChange={(e) => setSteelVal(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group-item">
                      <label>Bricks Expenses (₹)</label>
                      <input
                        type="number"
                        value={bricksVal}
                        onChange={(e) => setBricksVal(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group-item">
                      <label>Paint Expenses (₹)</label>
                      <input
                        type="number"
                        value={paintVal}
                        onChange={(e) => setPaintVal(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group-item">
                      <label>Labour Cost Total (₹)</label>
                      <input
                        type="number"
                        value={labourVal}
                        onChange={(e) => setLabourVal(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="custom-items-edit-section">
                    <h4 className="custom-items-edit-title">📦 Custom Extras Ledger</h4>
                    {contractorExtras.length === 0 ? (
                      <p className="no-custom-items-notice">No custom items added yet.</p>
                    ) : (
                      <div className="custom-items-edit-list">
                        {contractorExtras.map((item) => (
                          <div key={item.id} className="custom-item-edit-row">
                            <input
                              type="text"
                              placeholder="Item Name (e.g. Sand)"
                              value={item.name}
                              onChange={(e) => handleUpdateContractorExtraName(item.id, e.target.value)}
                              className="custom-item-name-input"
                              required
                            />
                            <input
                              type="number"
                              placeholder="Cost (₹)"
                              value={item.cost}
                              onChange={(e) => handleUpdateContractorExtraCost(item.id, e.target.value)}
                              className="custom-item-cost-input"
                              required
                            />
                            <button
                              type="button"
                              className="delete-custom-item-btn"
                              onClick={() => handleDeleteContractorExtra(item.id)}
                              title="Remove Item"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      type="button"
                      className="add-custom-item-btn"
                      onClick={handleAddContractorExtra}
                    >
                      ➕ Add Custom Item
                    </button>
                  </div>

                  <button type="submit" className="auth-submit-btn" style={{ height: '44px', marginTop: '16px' }}>
                    Save Ledger Updates & Push to Client
                  </button>
                </form>
              </div>
            </div>

            <div className="dash-column flex-grow-2">
              <div className="glass-card">
                <h2 className="card-heading-title">📈 Current Aggregated Total</h2>
                <div className="labour-big-stat" style={{ textAlign: 'center', margin: '20px 0' }}>
                  <span className="large-count" style={{ fontSize: '2.5rem' }}>
                    ₹{(
                      parseFloat(cementVal) + parseFloat(steelVal) + parseFloat(bricksVal) +
                      parseFloat(paintVal) + parseFloat(labourVal) +
                      Object.values(costs.extras || {}).reduce((s, v) => s + v, 0)
                    ).toLocaleString('en-IN')}
                  </span>
                  <span className="large-lbl">Total Expenses Accumulated</span>
                </div>
                {Object.keys(costs.extras || {}).length > 0 && (
                  <div className="cost-breakdown-list" style={{ marginTop: '0' }}>
                    <h3 className="breakdown-subtitle">📦 Custom Items</h3>
                    <ul className="itemized-ul">
                      {Object.entries(costs.extras || {}).map(([name, val]) => (
                        <li key={name} className="itemized-li itemized-li-new">
                          <span className="item-name">{name}</span>
                          <span className="item-cost">₹{val.toLocaleString('en-IN')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="site-details-read-mode" style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '12px' }}>
                  <p>💡 Setting values here overrides materials inventory calculations and updates client budget tracking instantly.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: PHOTO UPLOAD AND GALLERY EDITOR */}
        {activeSubTab === 'upload' && (
          <div className="dash-two-columns">
            <div className="dash-column flex-grow-3">
              {/* Photo Upload Card */}
              <div className="glass-card">
                <h2 className="card-heading-title">📷 Upload Site Photos (Custom Files Supported)</h2>
                <span className="card-heading-subtitle">Choose a custom image from your disk and push it to the gallery</span>
                
                <form onSubmit={handlePhotoUploadSubmit} className="photo-upload-form" style={{ marginTop: '20px' }}>
                  <div className="form-group-item">
                    <label>Select Stage Name</label>
                    <select
                      value={uploadStage}
                      onChange={(e) => setUploadStage(e.target.value)}
                    >
                      <option value="Foundation Work">Foundation Work</option>
                      <option value="Brick Work">Brick Work</option>
                      <option value="Roof Work">Roof Work</option>
                      <option value="Electrical Work">Electrical Work</option>
                      <option value="Painting">Painting</option>
                      <option value="Interior Work">Interior Work</option>
                    </select>
                  </div>

                  <div className="form-group-item">
                    <label>Photo Timing (Category)</label>
                    <div className="radio-cards-container" style={{ margin: '8px 0' }}>
                      {['Before', 'During', 'Completed'].map(cat => (
                        <div
                          key={cat}
                          className={`role-card category-radio-card ${uploadCategory === cat ? 'active' : ''}`}
                          onClick={() => setUploadCategory(cat)}
                          style={{ padding: '10px 16px', display: 'flex', gap: '8px' }}
                        >
                          <span className="role-card-title" style={{ fontSize: '0.85rem' }}>{cat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group-item">
                    <label>Select Local Image File (Custom Image Upload)</label>
                    
                    <div className="custom-file-upload-block">
                      <input
                        type="file"
                        id="custom-file-selector"
                        accept="image/*"
                        onChange={handleLocalFileChange}
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        className="add-content-btn"
                        onClick={() => document.getElementById('custom-file-selector').click()}
                        style={{ width: '100%', height: '46px', textTransform: 'none' }}
                      >
                        📂 Choose Custom Image File
                      </button>
                      <div className="selected-filename" style={{ marginTop: '8px', fontSize: '0.8rem', textAlign: 'center', opacity: 0.8 }}>
                        File Selected: <strong>{fileNameLabel}</strong>
                      </div>
                    </div>

                    {uploadUrl && (
                      <div className="upload-preview-container" style={{ marginTop: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Image Preview:</div>
                        <img
                          src={uploadUrl}
                          alt="Upload Preview"
                          style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-group-item">
                    <label>Photo Description note</label>
                    <input
                      type="text"
                      placeholder="e.g. Finished roof frame supports structural layout"
                      value={uploadDesc}
                      onChange={(e) => setUploadDesc(e.target.value)}
                      required
                    />
                  </div>

                  {uploadError && <div className="input-error-msg">{uploadError}</div>}

                  <button type="submit" className="auth-submit-btn" style={{ height: '46px', marginTop: '16px' }}>
                    Publish Photo Update
                  </button>
                </form>
              </div>

              {/* Gallery list with Edit/Delete capabilities for Contractor */}
              <div className="glass-card" style={{ marginTop: '24px' }}>
                <h2 className="card-heading-title">📋 Manage Current Site Photos</h2>
                <span className="card-heading-subtitle">Edit descriptions, change stages, or delete uploaded files</span>

                <div className="photo-gallery-grid" style={{ marginTop: '20px' }}>
                  {photos.map(photo => (
                    <div key={photo.id} className="gallery-photo-card">
                      <div className="photo-image-wrap">
                        <img src={photo.url} alt={photo.description} />
                        <span className={`photo-category-badge ${photo.category.toLowerCase()}`}>
                          {photo.category}
                        </span>
                      </div>

                      {editingPhotoId === photo.id ? (
                        <div className="photo-details-wrap editing-block">
                          <div className="form-group-item" style={{ marginBottom: '8px' }}>
                            <label style={{ fontSize: '0.7rem' }}>Stage</label>
                            <select value={editPhotoStage} onChange={e => setEditPhotoStage(e.target.value)} style={{ padding: '4px', fontSize: '0.8rem' }}>
                              <option value="Foundation Work">Foundation Work</option>
                              <option value="Brick Work">Brick Work</option>
                              <option value="Roof Work">Roof Work</option>
                              <option value="Electrical Work">Electrical Work</option>
                              <option value="Painting">Painting</option>
                              <option value="Interior Work">Interior Work</option>
                            </select>
                          </div>
                          <div className="form-group-item" style={{ marginBottom: '8px' }}>
                            <label style={{ fontSize: '0.7rem' }}>Timing</label>
                            <select value={editPhotoCat} onChange={e => setEditPhotoCat(e.target.value)} style={{ padding: '4px', fontSize: '0.8rem' }}>
                              <option value="Before">Before</option>
                              <option value="During">During</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                          <div className="form-group-item" style={{ marginBottom: '8px' }}>
                            <label style={{ fontSize: '0.7rem' }}>Description</label>
                            <textarea value={editPhotoDesc} onChange={e => setEditPhotoDesc(e.target.value)} rows="2" style={{ padding: '4px', fontSize: '0.8rem' }} />
                          </div>
                          <div className="photo-actions-row">
                            <button type="button" className="photo-action-btn download" onClick={() => savePhotoEdit(photo.id)}>Save</button>
                            <button type="button" className="photo-action-btn zoom" onClick={() => setEditingPhotoId(null)}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="photo-details-wrap">
                          <div className="photo-header-line">
                            <span className="photo-stage-tag">{photo.stage}</span>
                            <span className="photo-date-tag">{photo.uploadDate}</span>
                          </div>
                          <p className="photo-desc-text">{photo.description}</p>
                          <div className="photo-actions-row">
                            <button type="button" className="photo-action-btn edit-meta-btn" onClick={() => startEditPhoto(photo)} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.25)' }}>✏️ Edit Info</button>
                            <button type="button" className="photo-action-btn delete-meta-btn" onClick={() => deletePhoto(photo.id)} style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f87171', border: '1px solid rgba(244, 63, 94, 0.25)' }}>🗑️ Delete</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="dash-column flex-grow-2">
              <div className="glass-card">
                <h2 className="card-heading-title">💡 Image Guidelines</h2>
                <div className="site-details-read-mode" style={{ fontSize: '0.85rem' }}>
                  <p style={{ marginBottom: '12px' }}>✓ Take photos at matching angles to enable high quality side-by-side progression analysis.</p>
                  <p style={{ marginBottom: '12px' }}>✓ Label stages correctly so client gets updates filtered directly in their workspace.</p>
                  <p>✓ All updates synchronize instantly to the client login across browser tabs.</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
