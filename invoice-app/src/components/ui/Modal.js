'use client';
import { useEffect } from 'react';
import { X } from 'lucide-react';

const SIZE_MAP = {
  sm:   '480px',
  md:   '600px',
  lg:   '820px',
  xl:   '1100px',
  full: '1340px',
};

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (open) {
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Full-screen backdrop — above everything including sidebar (z-index 9999) */}
      <div
        onClick={(e) => e.target === e.currentTarget && onClose?.()}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(10,15,30,0.75)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        {/* Modal box */}
        <div
          style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
            width: '100%',
            maxWidth: SIZE_MAP[size] || SIZE_MAP.md,
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            animation: 'modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            overflow: 'hidden',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 22px',
            borderBottom: '1px solid #F1F5F9',
            flexShrink: 0,
            background: 'linear-gradient(135deg, #0F172A, #1E293B)',
            borderRadius: '20px 20px 0 0',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'white', margin: 0 }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.7)', transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.3)'; e.currentTarget.style.color = 'white'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Body — scrollable */}
          <div style={{ overflowY: 'auto', flex: 1, padding: '22px' }}>
            {children}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.93) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}
