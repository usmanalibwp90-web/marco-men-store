'use client';
import { useState, useEffect } from 'react';
import { invoiceStore, quotationStore, clientStore, formatCurrency } from '@/lib/store';
import { useApp } from '@/lib/context';
import Badge from '@/components/ui/Badge';
import {
  FileText, Receipt, Plus, Clock, CheckCircle,
  TrendingUp, Calendar, User, ArrowRight, Zap
} from 'lucide-react';

export default function StaffDashboard({ onNavigate }) {
  const { user } = useApp();
  const [data, setData] = useState(null);

  useEffect(() => {
    const allInvoices = invoiceStore.getAll();
    const allQuotations = quotationStore.getAll();
    const allClients = clientStore.getAll();

    // Staff only sees their own records
    const myInvoices = allInvoices.filter(i => i.salesPerson === user?.name);
    const myQuotations = allQuotations.filter(q => q.salesPerson === user?.name);

    // Recent 5 of each
    const recentInvoices = [...myInvoices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    const recentQuotations = [...myQuotations].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    setData({
      totalInvoices: myInvoices.length,
      totalQuotations: myQuotations.length,
      paidInvoices: myInvoices.filter(i => i.paymentStatus === 'paid').length,
      pendingInvoices: myInvoices.filter(i => i.paymentStatus !== 'paid').length,
      totalRevenue: myInvoices.reduce((s, i) => s + (i.grandTotal || 0), 0),
      pendingAmount: myInvoices.reduce((s, i) => s + (i.remainingAmount || 0), 0),
      totalClients: allClients.length,
      recentInvoices,
      recentQuotations,
    });
  }, [user]);

  if (!data) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="p-4 lg:p-6 space-y-6" style={{ animation: 'fadeIn 0.4s ease' }}>

      {/* ── Welcome Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)',
        borderRadius: '20px', padding: '28px 28px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* deco */}
        <div style={{ position: 'absolute', right: '-30px', top: '-30px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(245,158,11,0.08)' }} />
        <div style={{ position: 'absolute', right: '60px', bottom: '-40px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(34,197,94,0.06)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '22px' }}>
              {hour < 12 ? '🌅' : hour < 17 ? '☀️' : '🌙'}
            </span>
            <span style={{ color: '#94A3B8', fontSize: '14px' }}>{greeting}</span>
          </div>
          <h2 style={{ color: 'white', fontSize: '26px', fontWeight: 800, marginBottom: '4px' }}>
            {user?.name} 👋
          </h2>
          <p style={{ color: '#64748B', fontSize: '13px' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* ── Quick Actions (BIG BUTTONS) ── */}
      <div>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
          Quick Actions
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

          {/* Create Invoice */}
          <button
            onClick={() => onNavigate('invoices-new')}
            style={{
              padding: '24px 20px', borderRadius: '18px', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              textAlign: 'left', position: 'relative', overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(245,158,11,0.35)',
              transition: 'all 0.25s',
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(245,158,11,0.45)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(245,158,11,0.35)'; }}
          >
            <div style={{ position: 'absolute', right: '-15px', top: '-15px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
            <Receipt size={28} color="white" style={{ marginBottom: '12px', position: 'relative', zIndex: 1 }} />
            <div style={{ color: 'white', fontWeight: 800, fontSize: '16px', position: 'relative', zIndex: 1 }}>Create Invoice</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', marginTop: '3px', position: 'relative', zIndex: 1 }}>New billing document</div>
            <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '4px', color: 'white', fontSize: '12px', fontWeight: 600, position: 'relative', zIndex: 1 }}>
              <Plus size={14} /> Create Now <ArrowRight size={12} />
            </div>
          </button>

          {/* Create Quotation */}
          <button
            onClick={() => onNavigate('quotations-new')}
            style={{
              padding: '24px 20px', borderRadius: '18px', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)',
              textAlign: 'left', position: 'relative', overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(15,23,42,0.35)',
              transition: 'all 0.25s',
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(15,23,42,0.5)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.35)'; }}
          >
            <div style={{ position: 'absolute', right: '-15px', top: '-15px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(245,158,11,0.15)' }} />
            <FileText size={28} color="#F59E0B" style={{ marginBottom: '12px', position: 'relative', zIndex: 1 }} />
            <div style={{ color: 'white', fontWeight: 800, fontSize: '16px', position: 'relative', zIndex: 1 }}>Create Quotation</div>
            <div style={{ color: '#64748B', fontSize: '12px', marginTop: '3px', position: 'relative', zIndex: 1 }}>New price estimate</div>
            <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontSize: '12px', fontWeight: 600, position: 'relative', zIndex: 1 }}>
              <Plus size={14} /> Create Now <ArrowRight size={12} />
            </div>
          </button>
        </div>

        {/* Secondary actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '10px' }}>
          {[
            { label: 'All Invoices', icon: Receipt, color: '#F59E0B', bg: '#FFFBEB', nav: 'invoices' },
            { label: 'All Quotations', icon: FileText, color: '#3B82F6', bg: '#EFF6FF', nav: 'quotations' },
            { label: 'Clients', icon: User, color: '#22C55E', bg: '#F0FDF4', nav: 'clients' },
          ].map(a => (
            <button key={a.label} onClick={() => onNavigate(a.nav)}
              style={{
                padding: '14px 10px', borderRadius: '14px', border: '2px solid transparent',
                background: a.bg, cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = a.color; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'transparent'; }}
            >
              <a.icon size={18} color={a.color} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#374151' }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── My Stats ── */}
      <div>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
          My Performance
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { label: 'My Invoices', value: data.totalInvoices, icon: Receipt, color: '#F59E0B', bg: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)' },
            { label: 'My Quotations', value: data.totalQuotations, icon: FileText, color: '#3B82F6', bg: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' },
            { label: 'Paid Invoices', value: data.paidInvoices, icon: CheckCircle, color: '#22C55E', bg: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)' },
            { label: 'Pending', value: data.pendingInvoices, icon: Clock, color: '#EF4444', bg: 'linear-gradient(135deg, #FFF1F2, #FFE4E6)' },
          ].map(s => (
            <div key={s.label} style={{
              padding: '18px', borderRadius: '16px',
              background: s.bg, display: 'flex', alignItems: 'center', gap: '14px',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flexShrink: 0,
              }}>
                <s.icon size={20} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '3px', fontWeight: 500 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
          <div style={{ padding: '18px', borderRadius: '16px', background: 'linear-gradient(135deg, #0F172A, #1E3A5F)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <TrendingUp size={16} color="#F59E0B" />
              <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 500 }}>Total Billed</span>
            </div>
            <div style={{ color: 'white', fontSize: '20px', fontWeight: 800 }}>{formatCurrency(data.totalRevenue)}</div>
          </div>
          <div style={{ padding: '18px', borderRadius: '16px', background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', border: '1px solid #FDE68A' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Clock size={16} color="#D97706" />
              <span style={{ color: '#92400E', fontSize: '12px', fontWeight: 500 }}>Pending Amount</span>
            </div>
            <div style={{ color: '#D97706', fontSize: '20px', fontWeight: 800 }}>{formatCurrency(data.pendingAmount)}</div>
          </div>
        </div>
      </div>

      {/* ── Recent Invoices ── */}
      {data.recentInvoices.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Recent Invoices
            </p>
            <button onClick={() => onNavigate('invoices')}
              style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #F1F5F9' }}>
            {data.recentInvoices.map((inv, idx) => (
              <div key={inv.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px',
                background: idx % 2 === 0 ? 'white' : '#FAFAFA',
                borderBottom: idx < data.recentInvoices.length - 1 ? '1px solid #F1F5F9' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Receipt size={16} color="#F59E0B" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>{inv.number}</div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>{inv.clientName} · {inv.eventName}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{formatCurrency(inv.grandTotal)}</div>
                  <Badge status={inv.paymentStatus} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Recent Quotations ── */}
      {data.recentQuotations.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Recent Quotations
            </p>
            <button onClick={() => onNavigate('quotations')}
              style={{ fontSize: '12px', color: '#3B82F6', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #F1F5F9' }}>
            {data.recentQuotations.map((q, idx) => (
              <div key={q.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px',
                background: idx % 2 === 0 ? 'white' : '#FAFAFA',
                borderBottom: idx < data.recentQuotations.length - 1 ? '1px solid #F1F5F9' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <FileText size={16} color="#3B82F6" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>{q.number}</div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>{q.clientName} · {q.eventName}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{formatCurrency(q.grandTotal)}</div>
                  <Badge status={q.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state for new staff */}
      {data.totalInvoices === 0 && data.totalQuotations === 0 && (
        <div style={{
          padding: '40px 24px', borderRadius: '20px', textAlign: 'center',
          background: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)',
          border: '2px dashed #E2E8F0',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>✨</div>
          <div style={{ fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '6px' }}>Ready to get started?</div>
          <div style={{ color: '#64748B', fontSize: '13px', marginBottom: '20px' }}>Create your first invoice or quotation</div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={() => onNavigate('invoices-new')}
              style={{ padding: '10px 20px', borderRadius: '10px', background: '#F59E0B', color: 'white', border: 'none', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              + New Invoice
            </button>
            <button onClick={() => onNavigate('quotations-new')}
              style={{ padding: '10px 20px', borderRadius: '10px', background: '#0F172A', color: 'white', border: 'none', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              + New Quotation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
