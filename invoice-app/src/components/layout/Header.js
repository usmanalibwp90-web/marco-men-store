'use client';
import { useApp } from '@/lib/context';
import { Menu, Bell, Plus } from 'lucide-react';

const PAGE_TITLES = {
  dashboard:   { admin: 'Dashboard',           staff: 'My Dashboard' },
  clients:     { admin: 'Client Management',   staff: 'Clients' },
  services:    { admin: 'Services Management', staff: 'Services' },
  quotations:  { admin: 'Quotations',          staff: 'Quotations' },
  invoices:    { admin: 'Invoices',            staff: 'Invoices' },
  reports:     { admin: 'Reports & Analytics', staff: 'Reports' },
  settings:    { admin: 'Settings',            staff: 'Settings' },
};

const NEW_LABEL = {
  clients:    'Client',
  services:   'Service',
  quotations: 'Quotation',
  invoices:   'Invoice',
};

export default function Header({ active, onNew }) {
  const { setSidebarOpen, settings, isAdmin, user } = useApp();

  const titles = PAGE_TITLES[active] || { admin: active, staff: active };
  const title = isAdmin ? titles.admin : titles.staff;

  const showNewBtn = ['quotations', 'invoices', 'clients', 'services'].includes(active);

  return (
    <header style={{
      height: '64px', background: 'white',
      borderBottom: '1px solid #F1F5F9',
      display: 'flex', alignItems: 'center',
      padding: '0 16px', gap: '12px',
      position: 'sticky', top: 0, zIndex: 30,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      flexShrink: 0,
    }}>
      {/* Hamburger for mobile */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg-hamburger"
        style={{
          width: '36px', height: '36px', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#64748B', flexShrink: 0,
        }}
      >
        <Menu size={20} />
      </button>

      {/* Title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{
          fontSize: '17px', fontWeight: 800, color: '#0F172A',
          margin: 0, lineHeight: 1.2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {title}
        </h1>
        <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0, marginTop: '1px' }}>
          {settings?.companyName} {!isAdmin && `· ${user?.name}`}
        </p>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>

        {/* Notification */}
        <button style={{
          width: '36px', height: '36px', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#64748B', position: 'relative',
        }}>
          <Bell size={18} />
          <span style={{
            position: 'absolute', top: '7px', right: '7px',
            width: '7px', height: '7px', borderRadius: '50%',
            background: '#F59E0B', border: '1.5px solid white',
          }} />
        </button>

        {/* New button */}
        {showNewBtn && (
          <button
            onClick={onNew}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              color: 'white', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 700,
              boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
              transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(245,158,11,0.4)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(245,158,11,0.3)'; }}
          >
            <Plus size={15} />
            <span className="new-btn-text">New {NEW_LABEL[active]}</span>
          </button>
        )}
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .lg-hamburger { display: flex !important; }
        }
        @media (min-width: 1024px) {
          .lg-hamburger { display: none !important; }
        }
        @media (max-width: 480px) {
          .new-btn-text { display: none; }
        }
      `}</style>
    </header>
  );
}
