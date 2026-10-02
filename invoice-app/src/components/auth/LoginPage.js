'use client';
import { useState } from 'react';
import { useApp } from '@/lib/context';
import { Eye, EyeOff, Lock, Mail, ChefHat, Sparkles, Shield, Zap } from 'lucide-react';

export default function LoginPage() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const user = login(email, password);
    if (!user) setError('Invalid email or password. Please try again.');
    setLoading(false);
  };

  const quickLogin = (role) => {
    if (role === 'admin') { setEmail('admin@mgfood.com'); setPassword('admin123'); }
    else { setEmail('staff@mgfood.com'); setPassword('staff123'); }
  };

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .login-card { animation: fadeUp 0.6s ease forwards; }
        .float-icon { animation: float 3s ease-in-out infinite; }
        .input-field {
          width: 100%; padding: 13px 14px 13px 42px;
          border: 2px solid #E2E8F0; border-radius: 12px;
          font-size: 14px; color: #0F172A; outline: none;
          box-sizing: border-box; background: #F8FAFC;
          transition: all 0.25s;
        }
        .input-field:focus {
          border-color: #F59E0B;
          background: white;
          box-shadow: 0 0 0 4px rgba(245,158,11,0.1);
        }
        .sign-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%);
          color: white; border: none; border-radius: 12px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          transition: all 0.3s; letter-spacing: 0.3px;
          box-shadow: 0 4px 15px rgba(15,23,42,0.3);
        }
        .sign-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(15,23,42,0.4);
        }
        .sign-btn:disabled { background: #94A3B8; cursor: not-allowed; transform: none; }
        .demo-btn {
          flex: 1; padding: 11px 8px; border-radius: 10px;
          background: white; border: 2px solid #E2E8F0;
          font-size: 13px; font-weight: 600; cursor: pointer;
          color: #374151; transition: all 0.2s;
        }
        .demo-btn:hover {
          border-color: #F59E0B;
          background: linear-gradient(135deg, #FFFBEB, #FEF3C7);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(245,158,11,0.2);
        }
        .feature-pill {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 16px; border-radius: 50px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.85);
          font-size: 13px; font-weight: 500;
          backdrop-filter: blur(8px);
        }
        .stat-box {
          padding: 20px; border-radius: 16px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          transition: all 0.3s;
        }
        .stat-box:hover {
          background: rgba(255,255,255,0.12);
          transform: translateY(-3px);
        }
        @media (min-width: 1024px) {
          .left-panel { display: flex !important; }
          .mobile-logo { display: none !important; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh', display: 'flex',
        background: 'linear-gradient(135deg, #0A0F1E 0%, #0F172A 50%, #0A1628 100%)',
      }}>

        {/* ═══ LEFT PANEL ═══ */}
        <div className="left-panel" style={{
          flex: 1, display: 'none', flexDirection: 'column',
          justifyContent: 'center', padding: '60px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Background blobs */}
          <div style={{
            position: 'absolute', width: '500px', height: '500px',
            borderRadius: '50%', top: '-100px', left: '-100px',
            background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', width: '400px', height: '400px',
            borderRadius: '50%', bottom: '-80px', right: '-80px',
            background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          {/* Grid lines */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '50px 50px', pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
              <div className="float-icon" style={{
                width: '64px', height: '64px', borderRadius: '20px',
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 12px 30px rgba(245,158,11,0.35)',
              }}>
                <ChefHat size={32} color="white" />
              </div>
              <div>
                <div style={{ color: 'white', fontSize: '24px', fontWeight: 800, lineHeight: 1.15 }}>MG Food &</div>
                <div style={{
                  fontSize: '22px', fontWeight: 700,
                  background: 'linear-gradient(90deg, #F59E0B, #FCD34D)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>Event Planners</div>
              </div>
            </div>

            {/* Headline */}
            <h1 style={{
              color: 'white', fontSize: '40px', fontWeight: 900,
              lineHeight: 1.2, marginBottom: '20px', letterSpacing: '-0.5px',
            }}>
              Manage Invoices &<br />
              <span style={{
                background: 'linear-gradient(90deg, #F59E0B, #FCD34D, #F59E0B)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                animation: 'shimmer 3s linear infinite',
              }}>
                Quotations Smartly
              </span>
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '15px', lineHeight: 1.8, maxWidth: '400px', marginBottom: '36px' }}>
              A professional platform built for MG Food & Event Planners to create, manage, and track all business documents efficiently.
            </p>

            {/* Feature pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '44px' }}>
              {[
                { icon: <Zap size={14} />, text: 'Auto Invoice Numbers' },
                { icon: <Shield size={14} />, text: 'Role-Based Access' },
                { icon: <Sparkles size={14} />, text: 'PDF Generation' },
              ].map(f => (
                <div key={f.text} className="feature-pill">
                  <span style={{ color: '#F59E0B' }}>{f.icon}</span>
                  {f.text}
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', maxWidth: '380px' }}>
              {[
                { value: '500+', label: 'Invoices Generated', color: '#F59E0B' },
                { value: '200+', label: 'Happy Clients', color: '#22C55E' },
                { value: '1000+', label: 'Events Managed', color: '#3B82F6' },
                { value: '₨50M+', label: 'Revenue Tracked', color: '#A78BFA' },
              ].map(s => (
                <div key={s.label} className="stat-box">
                  <div style={{ fontSize: '26px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ color: '#64748B', fontSize: '12px', marginTop: '4px', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ RIGHT FORM PANEL ═══ */}
        <div style={{
          width: '100%', maxWidth: '480px',
          margin: '0 auto',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '32px 28px',
          background: 'white',
          minHeight: '100vh',
          boxSizing: 'border-box',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.3)',
        }}>
          <div className="login-card">

            {/* Mobile Logo */}
            <div className="mobile-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(245,158,11,0.3)',
              }}>
                <ChefHat size={24} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '16px', color: '#0F172A' }}>MG Food & Event Planners</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '1px' }}>Invoice Management System</div>
              </div>
            </div>

            {/* Welcome heading */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '5px 12px', borderRadius: '50px',
                background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
                border: '1px solid #FDE68A', marginBottom: '14px',
              }}>
                <Sparkles size={12} color="#D97706" />
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#D97706' }}>SECURE LOGIN</span>
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', marginBottom: '6px', lineHeight: 1.2 }}>
                Welcome Back 👋
              </h2>
              <p style={{ color: '#64748B', fontSize: '14px' }}>
                Sign in to access your dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} />
                  <input
                    type="email"
                    className="input-field"
                    placeholder="admin@mgfood.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    className="input-field"
                    style={{ paddingRight: '42px' }}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0, display: 'flex' }}>
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  padding: '12px 14px', borderRadius: '10px',
                  background: '#FEF2F2', color: '#DC2626',
                  fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px',
                  border: '1px solid #FECACA', fontWeight: 500,
                }}>
                  <span style={{ fontSize: '16px' }}>⚠️</span> {error}
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading} className="sign-btn">
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <span style={{ width: '18px', height: '18px', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    Signing in...
                  </span>
                ) : '🔐 Sign In to Dashboard'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
              <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>QUICK ACCESS</span>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
            </div>

            {/* Demo Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
              <button onClick={() => quickLogin('admin')} className="demo-btn">
                <div style={{ fontSize: '18px', marginBottom: '2px' }}>👨‍💼</div>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>Admin</div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '1px' }}>Full Access</div>
              </button>
              <button onClick={() => quickLogin('staff')} className="demo-btn">
                <div style={{ fontSize: '18px', marginBottom: '2px' }}>👩‍💻</div>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>Staff</div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '1px' }}>Create Docs</div>
              </button>
            </div>

            <p style={{ fontSize: '11px', color: '#CBD5E1', textAlign: 'center', marginTop: '6px' }}>
              Click a role above to auto-fill credentials
            </p>

            {/* Footer */}
            <div style={{
              marginTop: '32px', paddingTop: '20px',
              borderTop: '1px solid #F1F5F9',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '12px', color: '#CBD5E1' }}>
                © 2026 MG Food & Event Planners
              </p>
              <p style={{ fontSize: '11px', color: '#E2E8F0', marginTop: '2px' }}>
                Invoice & Quotation Management System
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
