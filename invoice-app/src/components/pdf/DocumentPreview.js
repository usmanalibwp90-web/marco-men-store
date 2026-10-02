'use client';
import { useRef } from 'react';
import { settingsStore, clientStore, formatCurrency } from '@/lib/store';
import { Printer, Download, X, MessageCircle, Mail } from 'lucide-react';

export default function DocumentPreview({ doc, type = 'quotation', onClose }) {
  const settings = settingsStore.get();
  const client = doc.clientId ? clientStore.getById(doc.clientId) : null;
  const printRef = useRef();

  const handlePrint = () => window.print();

  const handleDownloadPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${doc.number}.pdf`);
    } catch (e) {
      alert('PDF generation requires the app to be running. Please use Print instead.');
    }
  };

  const handleWhatsApp = () => {
    const phone = client?.whatsapp?.replace(/\D/g, '') || '';
    const msg = encodeURIComponent(
      `Dear ${doc.clientName},\n\nPlease find your ${type === 'quotation' ? 'Quotation' : 'Invoice'} ${doc.number} from ${settings.companyName}.\n\nEvent: ${doc.eventName}\nAmount: ${formatCurrency(doc.grandTotal)}\n\nThank you for your business!\n${settings.companyName}`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`${type === 'quotation' ? 'Quotation' : 'Invoice'} ${doc.number} - ${settings.companyName}`);
    const body = encodeURIComponent(`Dear ${doc.clientName},\n\nPlease find attached your ${type} ${doc.number}.\n\nEvent: ${doc.eventName}\nAmount: ${formatCurrency(doc.grandTotal)}\n\nThank you!\n${settings.companyName}`);
    window.location.href = `mailto:${client?.email || ''}?subject=${subject}&body=${body}`;
  };

  const isInvoice = type === 'invoice';
  const statusColor = {
    paid: '#22C55E', unpaid: '#EF4444', partially_paid: '#F59E0B',
    draft: '#94A3B8', confirmed: '#3B82F6',
  };
  const statusLabel = {
    paid: 'PAID', unpaid: 'UNPAID', partially_paid: 'PARTIAL',
    draft: 'DRAFT', confirmed: 'CONFIRMED',
  };
  const docStatus = isInvoice ? doc.paymentStatus : doc.status;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 no-print">
        <button onClick={handlePrint} className="btn btn-primary text-sm">
          <Printer size={14} /> Print
        </button>
        <button onClick={handleDownloadPDF} className="btn btn-secondary text-sm">
          <Download size={14} /> Download PDF
        </button>
        <button onClick={handleWhatsApp} className="btn text-sm" style={{ background: '#25D366', color: 'white' }}>
          <MessageCircle size={14} /> WhatsApp
        </button>
        <button onClick={handleEmail} className="btn btn-outline text-sm">
          <Mail size={14} /> Email
        </button>
      </div>

      {/* A4 Document */}
      <div className="overflow-auto" style={{ maxHeight: '70vh' }}>
        <div
          ref={printRef}
          className="bg-white text-slate-900 mx-auto"
          style={{
            width: '794px',
            minHeight: '1123px',
            padding: '40px',
            fontSize: '13px',
            fontFamily: 'Arial, sans-serif',
            position: 'relative',
          }}
        >
          {/* Watermark for draft */}
          {docStatus === 'draft' && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%) rotate(-45deg)',
              fontSize: '100px', fontWeight: 900, color: 'rgba(200,200,200,0.15)',
              pointerEvents: 'none', zIndex: 0, whiteSpace: 'nowrap',
            }}>DRAFT</div>
          )}

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', borderBottom: '3px solid #F59E0B', paddingBottom: '20px' }}>
            <div>
              {settings.logo ? (
                <img src={settings.logo} alt="Logo" style={{ height: '60px', objectFit: 'contain', marginBottom: '8px' }} />
              ) : (
                <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                  <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>MG</span>
                </div>
              )}
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0F172A' }}>{settings.companyName}</div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{settings.tagline}</div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '6px', lineHeight: '1.6' }}>
                <div>📍 {settings.address}</div>
                <div>📞 {settings.phone}</div>
                <div>✉️ {settings.email}</div>
                {settings.website && <div>🌐 {settings.website}</div>}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '28px', fontWeight: 900, color: '#0F172A',
                letterSpacing: '-1px', marginBottom: '4px'
              }}>
                {isInvoice ? 'INVOICE' : 'QUOTATION'}
              </div>
              <div style={{
                display: 'inline-block',
                padding: '4px 14px', borderRadius: '20px',
                background: statusColor[docStatus] || '#94A3B8',
                color: 'white', fontSize: '11px', fontWeight: 700,
                marginBottom: '10px',
              }}>
                {statusLabel[docStatus] || docStatus?.toUpperCase()}
              </div>
              <div style={{ color: '#374151', fontSize: '12px', lineHeight: '1.8' }}>
                <div><strong>Number:</strong> {doc.number}</div>
                <div><strong>Date:</strong> {doc.createdAt || new Date().toLocaleDateString()}</div>
                {isInvoice && doc.dueDate && <div><strong>Due Date:</strong> {doc.dueDate}</div>}
                {!isInvoice && doc.validUntil && <div><strong>Valid Until:</strong> {doc.validUntil}</div>}
              </div>
            </div>
          </div>

          {/* Client & Event info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
            <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Bill To</div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>{doc.clientName}</div>
              {client?.company && <div style={{ color: '#64748B', fontSize: '12px', marginTop: '2px' }}>{client.company}</div>}
              {client?.phone && <div style={{ color: '#64748B', fontSize: '12px', marginTop: '4px' }}>📞 {client.phone}</div>}
              {client?.email && <div style={{ color: '#64748B', fontSize: '12px' }}>✉️ {client.email}</div>}
              {client?.address && <div style={{ color: '#64748B', fontSize: '12px' }}>📍 {client.address}, {client.city}</div>}
            </div>
            <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Event Details</div>
              <div style={{ color: '#374151', fontSize: '12px', lineHeight: '2' }}>
                <div><strong>Event:</strong> {doc.eventName}</div>
                {doc.eventDate && <div><strong>Date:</strong> {doc.eventDate}</div>}
                {doc.venue && <div><strong>Venue:</strong> {doc.venue}</div>}
                {doc.guestCount && <div><strong>Guests:</strong> {doc.guestCount}</div>}
                {doc.salesPerson && <div><strong>Sales Person:</strong> {doc.salesPerson}</div>}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
            <thead>
              <tr style={{ background: '#0F172A', color: 'white' }}>
                {['#', 'Service', 'Description', 'Qty', 'Unit Price', 'Disc', 'Tax', 'Total'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: h === '#' ? 'center' : 'left', fontSize: '11px', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(doc.items || []).map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9', background: idx % 2 === 0 ? 'white' : '#FAFAFA' }}>
                  <td style={{ padding: '10px 12px', textAlign: 'center', color: '#94A3B8', fontSize: '12px' }}>{idx + 1}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600, fontSize: '13px' }}>{item.service}</td>
                  <td style={{ padding: '10px 12px', color: '#64748B', fontSize: '12px' }}>{item.description}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', fontSize: '12px' }}>{item.qty}</td>
                  <td style={{ padding: '10px 12px', fontSize: '12px' }}>₨ {Number(item.unitPrice).toLocaleString()}</td>
                  <td style={{ padding: '10px 12px', fontSize: '12px', color: '#EF4444' }}>{item.discount ? `${item.discount}%` : '-'}</td>
                  <td style={{ padding: '10px 12px', fontSize: '12px', color: '#3B82F6' }}>{item.tax ? `${item.tax}%` : '-'}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 700, fontSize: '13px' }}>₨ {Number(item.total).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
            <div style={{ width: '280px' }}>
              {[
                { label: 'Subtotal', value: `₨ ${Number(doc.subtotal || 0).toLocaleString()}`, bold: false },
                { label: 'Discount', value: `- ₨ ${Number(doc.discountAmount || 0).toLocaleString()}`, bold: false, color: '#EF4444' },
                { label: 'Tax', value: `₨ ${Number(doc.taxAmount || 0).toLocaleString()}`, bold: false, color: '#3B82F6' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '13px', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>{r.label}</span>
                  <span style={{ color: r.color || '#374151' }}>{r.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', marginTop: '6px', background: '#0F172A', color: 'white', borderRadius: '8px', fontWeight: 700, fontSize: '15px' }}>
                <span>Grand Total</span>
                <span style={{ color: '#F59E0B' }}>₨ {Number(doc.grandTotal || 0).toLocaleString()}</span>
              </div>
              {isInvoice && (
                <div style={{ marginTop: '8px', padding: '10px 12px', background: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#374151', marginBottom: '4px' }}>
                    <span>Advance Paid</span>
                    <span style={{ color: '#22C55E', fontWeight: 600 }}>₨ {Number(doc.advancePayment || 0).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#374151' }}>
                    <span>Remaining</span>
                    <span style={{ color: '#EF4444', fontWeight: 600 }}>₨ {Number(doc.remainingAmount || 0).toLocaleString()}</span>
                  </div>
                  {doc.paymentMethod && (
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Payment: {doc.paymentMethod}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bank Details (Invoice only) */}
          {isInvoice && settings.bankName && (
            <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Payment Details</div>
              <div style={{ fontSize: '12px', color: '#374151', lineHeight: '1.8' }}>
                <span><strong>Bank:</strong> {settings.bankName}</span> &nbsp;|&nbsp;
                <span><strong>Account:</strong> {settings.accountTitle}</span> &nbsp;|&nbsp;
                <span><strong>Number:</strong> {settings.accountNumber}</span>
                {settings.iban && <span> &nbsp;|&nbsp; <strong>IBAN:</strong> {settings.iban}</span>}
              </div>
            </div>
          )}

          {/* Notes & Terms */}
          {doc.notes && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Notes</div>
              <p style={{ fontSize: '12px', color: '#374151' }}>{doc.notes}</p>
            </div>
          )}
          {doc.termsAndConditions && (
            <div style={{ marginBottom: '24px', padding: '12px', background: '#FFFBEB', borderRadius: '8px', border: '1px solid #FDE68A' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Terms & Conditions</div>
              <p style={{ fontSize: '11px', color: '#78350F', whiteSpace: 'pre-line', lineHeight: '1.7' }}>{doc.termsAndConditions}</p>
            </div>
          )}

          {/* Footer / Signature */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '32px', paddingTop: '20px', borderTop: '2px solid #F1F5F9' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '24px' }}>Authorized Signature</div>
              {settings.signature ? (
                <img src={settings.signature} alt="Signature" style={{ height: '40px', objectFit: 'contain' }} />
              ) : (
                <div style={{ width: '160px', borderBottom: '1px solid #0F172A' }} />
              )}
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>{settings.companyName}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              {settings.stamp ? (
                <img src={settings.stamp} alt="Stamp" style={{ height: '80px', objectFit: 'contain', opacity: 0.8 }} />
              ) : (
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  border: '3px solid #F59E0B', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexDirection: 'column',
                }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#F59E0B', textAlign: 'center', lineHeight: '1.3' }}>MG FOOD<br/>&amp; EVENTS</div>
                </div>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '4px' }}>Generated by</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>{settings.companyName}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>{settings.website}</div>
              <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '4px' }}>
                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
