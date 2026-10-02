'use client';
import { useApp } from '@/lib/context';
import {
  LayoutDashboard, Users, Package, FileText, Receipt,
  BarChart3, Settings, ChevronRight, X, ChefHat,
  LogOut, Moon, Sun, Plus, Shield, UserCheck
} from 'lucide-react';

// Admin sees everything, Staff sees only operational pages
const ADMIN_NAV = [
  { id: 'dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { id: 'clients',     label: 'Clients',     icon: Users },
  { id: 'services',    label: 'Services',    icon: Package },
  { id: 'quotations',  label: 'Quotations',  icon: FileText },
  { id: 'invoices',    label: 'Invoices',    icon: Receipt },
  { id: 'reports',     label: 'Reports',     icon: BarChart3 },
  { id: 'settings',    label: 'Settings',    icon: Settings },
];

const STAFF_NAV = [
  { id: 'dashboard',       label: 'My Dashboard',  icon: LayoutDashboard },
  { id: 'invoices-new',    label: 'Create Invoice', icon: Receipt,   highlight: true },
  { id: 'quotations-new',  label: 'Create Quotation', icon: FileText, highlight: true },
  { id: 'invoices',        label: 'All Invoices',   icon: Receipt },
  { id: 'quotations',      label: 'All Quotations', icon: FileText },
  { id: 'clients',         label: 'Clients',        icon: Users },
];

export default function Sidebar({ active, onChange }) {
  const { user, logout, isAdmin, darkMode, toggleDarkMode, sidebarOpen, setSidebarOpen } = useApp();

  const NAV = isAdmin ? ADMIN_NAV : STAFF_NAV;

  // For active check — "invoices-new" highlights "invoices" in nav as active
  const isActive = (id) => {
    if (id === active) return true;
    if (id === 'invoices' && active === 'invoices') return true;
    if (id === 'quotations' && active === 'quotations') return true;
    return false;
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)',
          }}
          className="lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: '256px', flexShrink: 0,
          background: 'linear-gradient(180deg, #0A0F1E 0%, #0F172A 100%)',
          display: 'flex', flexDirection: 'column',
          height: '100vh',
          position: 'fixed', top: 0, left: 0, zIndex: 50,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
        className="lg-sidebar"
      >
        {/* Logo */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(245,158,11,0.35)',
              }}>
                <ChefHat size={20} color="white" />
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 800, fontSize: '13px', lineHeight: 1.2 }}>MG Food &</div>
                <div style={{
                  fontWeight: 700, fontSize: '12px',
                  background: 'linear-gradient(90deg, #F59E0B, #FCD34D)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>Event Planners</div>
              </div>
            </div>
            {/* Mobile close */}
            <button
              onClick={() => setSidebarOpen(false)}
              style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: '4px', display: 'none' }}
              className="lg-hide-close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Role badge */}
          <div style={{
            marginTop: '14px',
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 12px', borderRadius: '10px',
            background: isAdmin ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
            border: `1px solid ${isAdmin ? 'rgba(245,158,11,0.2)' : 'rgba(34,197,94,0.2)'}`,
          }}>
            {isAdmin
              ? <Shield size={13} color="#F59E0B" />
              : <UserCheck size={13} color="#22C55E" />
            }
            <span style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em',
              color: isAdmin ? '#F59E0B' : '#22C55E',
              textTransform: 'uppercase',
            }}>
              {isAdmin ? 'Administrator' : 'Staff Member'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>

          {/* Section label */}
          <p style={{ fontSize: '10px', fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 8px 8px', marginTop: '4px' }}>
            {isAdmin ? 'Main Menu' : 'Quick Actions'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {NAV.map(item => {
              const Icon = item.icon;
              const active_ = isActive(item.id);
              const isHighlight = item.highlight;

              if (isHighlight) {
                // Special highlighted buttons for staff quick create
                return (
                  <button
                    key={item.id}
                    onClick={() => { onChange(item.id); setSidebarOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '11px 12px', borderRadius: '10px',
                      border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                      background: item.id === 'invoices-new'
                        ? 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(245,158,11,0.08))'
                        : 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.06))',
                      borderLeft: `3px solid ${item.id === 'invoices-new' ? '#F59E0B' : '#3B82F6'}`,
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseOut={e => e.currentTarget.style.opacity = '1'}
                  >
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '8px',
                      background: item.id === 'invoices-new' ? '#F59E0B' : '#3B82F6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Plus size={14} color="white" />
                    </div>
                    <span style={{
                      flex: 1, fontSize: '13px', fontWeight: 700,
                      color: item.id === 'invoices-new' ? '#FCD34D' : '#93C5FD',
                    }}>
                      {item.label}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => { onChange(item.id); setSidebarOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', borderRadius: '10px',
                    border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                    background: active_ ? 'rgba(245,158,11,0.15)' : 'transparent',
                    transition: 'all 0.2s',
                    color: active_ ? '#F59E0B' : '#64748B',
                  }}
                  onMouseOver={e => {
                    if (!active_) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.color = '#CBD5E1';
                    }
                  }}
                  onMouseOut={e => {
                    if (!active_) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#64748B';
                    }
                  }}
                >
                  <Icon size={17} />
                  <span style={{ flex: 1, fontSize: '13px', fontWeight: active_ ? 700 : 500 }}>
                    {item.label}
                  </span>
                  {active_ && <ChevronRight size={13} style={{ opacity: 0.5 }} />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom section */}
        <div style={{
          padding: '12px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', flexDirection: 'column', gap: '4px',
        }}>
          {/* Dark mode */}
          <button
            onClick={toggleDarkMode}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 12px', borderRadius: '10px', border: 'none',
              cursor: 'pointer', background: 'transparent',
              color: '#64748B', transition: 'all 0.2s', width: '100%', textAlign: 'left',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#CBD5E1'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span style={{ fontSize: '13px', fontWeight: 500 }}>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* User card */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
              background: isAdmin
                ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                : 'linear-gradient(135deg, #22C55E, #16A34A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '14px', color: 'white',
            }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'white', fontSize: '12px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div style={{ color: '#475569', fontSize: '11px', textTransform: 'capitalize', marginTop: '1px' }}>{user?.role}</div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#475569', padding: '4px', borderRadius: '6px',
                transition: 'all 0.2s', display: 'flex',
              }}
              onMouseOver={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
              onMouseOut={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'none'; }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      <style>{`
        @media (min-width: 1024px) {
          .lg-sidebar {
            position: static !important;
            transform: none !important;
          }
          .lg-hide-close { display: none !important; }
        }
        @media (max-width: 1023px) {
          .lg-hide-close { display: flex !important; }
        }
      `}</style>
    </>
  );
}
