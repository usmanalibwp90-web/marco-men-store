'use client';
import { useState, useEffect } from 'react';
import { clientStore, serviceStore, invoiceStore, settingsStore } from '@/lib/store';
import { useApp } from '@/lib/context';
import { Plus, Trash2, ChevronDown, Save, Eye } from 'lucide-react';

const PAYMENT_METHODS = ['Cash', 'Bank Transfer', 'Easypaisa', 'JazzCash', 'Cheque', 'Online Transfer'];
const PAYMENT_STATUSES = [
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'partially_paid', label: 'Partially Paid' },
  { value: 'paid', label: 'Paid' },
];
const EMPTY_ITEM = { id: Date.now(), service: '', description: '', qty: 1, unitPrice: 0, discount: 0, tax: 0, total: 0 };

const calcItem = (item) => {
  const base = (item.qty || 0) * (item.unitPrice || 0);
  const disc = base * ((item.discount || 0) / 100);
  const taxable = base - disc;
  const taxAmt = taxable * ((item.tax || 0) / 100);
  return { ...item, total: taxable + taxAmt };
};

const calcTotals = (items) => {
  const subtotal = items.reduce((s, i) => s + (i.qty || 0) * (i.unitPrice || 0), 0);
  const discountAmount = items.reduce((s, i) => {
    const base = (i.qty || 0) * (i.unitPrice || 0);
    return s + base * ((i.discount || 0) / 100);
  }, 0);
  const taxAmount = items.reduce((s, i) => {
    const base = (i.qty || 0) * (i.unitPrice || 0);
    const disc = base * ((i.discount || 0) / 100);
    return s + (base - disc) * ((i.tax || 0) / 100);
  }, 0);
  const grandTotal = subtotal - discountAmount + taxAmount;
  return { subtotal, discountAmount, taxAmount, grandTotal };
};

export default function InvoiceForm({ editing, onClose, onSaved, onPreview }) {
  const { user } = useApp();
  const settings = settingsStore.get();
  const clients = clientStore.getAll();
  const services = serviceStore.getAll();

  const [form, setForm] = useState({
    number: '',
    clientId: '',
    clientName: '',
    eventName: '',
    eventDate: '',
    venue: '',
    guestCount: '',
    salesPerson: user?.name || '',
    paymentStatus: 'unpaid',
    paymentMethod: 'Cash',
    advancePayment: 0,
    remainingAmount: 0,
    dueDate: new Date(Date.now() + 30 * 864e5).toISOString().split('T')[0],
    notes: '',
    termsAndConditions: settings.termsAndConditions || '',
    items: [{ ...EMPTY_ITEM, id: Date.now() }],
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [serviceDropOpen, setServiceDropOpen] = useState(null);

  useEffect(() => {
    if (editing) setForm({ ...editing });
    else setForm(p => ({ ...p, number: invoiceStore.getNextNumber() }));
  }, [editing]);

  // Auto-calculate remaining when advance or status changes
  useEffect(() => {
    const totals = calcTotals(form.items);
    const remaining = Math.max(0, totals.grandTotal - (parseFloat(form.advancePayment) || 0));
    setForm(p => ({ ...p, remainingAmount: remaining }));
  }, [form.advancePayment, form.items]);

  const setField = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const setClient = (id) => {
    const c = clients.find(c => c.id === id);
    setField('clientId', id);
    setField('clientName', c?.name || '');
  };

  const addItem = () => setForm(p => ({ ...p, items: [...p.items, { ...EMPTY_ITEM, id: Date.now() + Math.random() }] }));
  const removeItem = (id) => setForm(p => ({ ...p, items: p.items.filter(i => i.id !== id) }));

  const updateItem = (id, key, value) => {
    setForm(p => ({
      ...p,
      items: p.items.map(i => {
        if (i.id !== id) return i;
        const updated = { ...i, [key]: value };
        return calcItem(updated);
      }),
    }));
  };

  const pickService = (itemId, svc) => {
    setForm(p => ({
      ...p,
      items: p.items.map(i => {
        if (i.id !== itemId) return i;
        const updated = { ...i, service: svc.name, unitPrice: svc.price };
        return calcItem(updated);
      }),
    }));
    setServiceDropOpen(null);
  };

  const totals = calcTotals(form.items);

  const validate = () => {
    const e = {};
    if (!form.clientId) e.clientId = 'Select a client';
    if (!form.eventName.trim()) e.eventName = 'Event name required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaving(true);
    const data = { ...form, ...totals };
    let saved;
    if (editing) { invoiceStore.update(editing.id, data); saved = { ...editing, ...data }; }
    else saved = invoiceStore.add(data);
    setSaving(false);
    onSaved?.(saved);
    onClose?.();
  };

  return (
    <div className="space-y-6">
      {/* Header info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700">
          <p className="text-xs text-slate-500">Invoice #</p>
          <p className="font-bold text-slate-900 dark:text-white font-mono">{form.number}</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700">
          <p className="text-xs text-slate-500">Payment Status</p>
          <select className="text-sm font-semibold bg-transparent text-slate-900 dark:text-white outline-none w-full"
            value={form.paymentStatus} onChange={e => setField('paymentStatus', e.target.value)}>
            {PAYMENT_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700">
          <p className="text-xs text-slate-500">Payment Method</p>
          <select className="text-sm font-semibold bg-transparent text-slate-900 dark:text-white outline-none w-full"
            value={form.paymentMethod} onChange={e => setField('paymentMethod', e.target.value)}>
            {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700">
          <p className="text-xs text-slate-500">Due Date</p>
          <input type="date" className="text-sm bg-transparent text-slate-900 dark:text-white outline-none w-full"
            value={form.dueDate} onChange={e => setField('dueDate', e.target.value)} />
        </div>
      </div>

      {/* Client & Event */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Client <span className="text-red-500">*</span></label>
          <select className={`form-input ${errors.clientId ? 'border-red-300' : ''}`}
            value={form.clientId} onChange={e => setClient(e.target.value)}>
            <option value="">-- Select Client --</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ''}</option>)}
          </select>
          {errors.clientId && <p className="text-xs text-red-500 mt-1">{errors.clientId}</p>}
        </div>
        <div>
          <label className="form-label">Event Name <span className="text-red-500">*</span></label>
          <input className={`form-input ${errors.eventName ? 'border-red-300' : ''}`}
            value={form.eventName} onChange={e => setField('eventName', e.target.value)} placeholder="e.g. Wedding Reception" />
          {errors.eventName && <p className="text-xs text-red-500 mt-1">{errors.eventName}</p>}
        </div>
        <div>
          <label className="form-label">Event Date</label>
          <input type="date" className="form-input" value={form.eventDate} onChange={e => setField('eventDate', e.target.value)} />
        </div>
        <div>
          <label className="form-label">Venue</label>
          <input className="form-input" value={form.venue} onChange={e => setField('venue', e.target.value)} placeholder="Event venue" />
        </div>
        <div>
          <label className="form-label">Guest Count</label>
          <input type="number" className="form-input" value={form.guestCount} onChange={e => setField('guestCount', e.target.value)} placeholder="0" />
        </div>
        <div>
          <label className="form-label">Sales Person</label>
          <input className="form-input" value={form.salesPerson} onChange={e => setField('salesPerson', e.target.value)} />
        </div>
      </div>

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900 dark:text-white">Line Items</h3>
          <button onClick={addItem} className="btn btn-outline text-sm py-1.5 px-3"><Plus size={14} /> Add Item</button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table style={{ minWidth: '680px', width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Service', 'Description', 'Qty', 'Unit Price', 'Disc %', 'Tax %', 'Total', ''].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#64748B', borderBottom: '1px solid #E2E8F0', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {form.items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '8px 10px', minWidth: '160px', position: 'relative' }}>
                    <div className="relative">
                      <input className="form-input text-xs pr-7"
                        value={item.service} onChange={e => updateItem(item.id, 'service', e.target.value)} placeholder="Service" />
                      <button type="button" onClick={() => setServiceDropOpen(serviceDropOpen === item.id ? null : item.id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                        <ChevronDown size={13} />
                      </button>
                      {serviceDropOpen === item.id && (
                        <div className="absolute left-0 top-full mt-1 z-50 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 w-64 max-h-52 overflow-y-auto">
                          {services.map(s => (
                            <button key={s.id} onClick={() => pickService(item.id, s)}
                              className="flex items-center justify-between w-full px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 text-left">
                              <span className="font-medium">{s.name}</span>
                              <span className="text-slate-400">₨{s.price.toLocaleString()}/{s.unit}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '8px 10px', minWidth: '140px' }}>
                    <input className="form-input text-xs" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} placeholder="Description" />
                  </td>
                  <td style={{ padding: '8px 10px', minWidth: '70px' }}>
                    <input type="number" className="form-input text-xs" value={item.qty} onChange={e => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)} min="0" />
                  </td>
                  <td style={{ padding: '8px 10px', minWidth: '100px' }}>
                    <input type="number" className="form-input text-xs" value={item.unitPrice} onChange={e => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)} min="0" />
                  </td>
                  <td style={{ padding: '8px 10px', minWidth: '70px' }}>
                    <input type="number" className="form-input text-xs" value={item.discount} onChange={e => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)} min="0" max="100" />
                  </td>
                  <td style={{ padding: '8px 10px', minWidth: '70px' }}>
                    <input type="number" className="form-input text-xs" value={item.tax} onChange={e => updateItem(item.id, 'tax', parseFloat(e.target.value) || 0)} min="0" max="100" />
                  </td>
                  <td style={{ padding: '8px 10px', minWidth: '100px' }}>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white whitespace-nowrap">₨ {Number(item.total || 0).toLocaleString()}</span>
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    {form.items.length > 1 && (
                      <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals + Payment */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-between">
          {/* Payment info */}
          <div className="flex-1 space-y-3">
            <div>
              <label className="form-label">Advance Payment (₨)</label>
              <input type="number" className="form-input" value={form.advancePayment}
                onChange={e => setField('advancePayment', parseFloat(e.target.value) || 0)} min="0" />
            </div>
            <div>
              <label className="form-label">Remaining Amount (₨)</label>
              <input type="number" className="form-input bg-slate-50" value={form.remainingAmount} readOnly />
            </div>
          </div>

          {/* Totals */}
          <div className="w-full sm:w-64 space-y-2">
            {[
              { label: 'Subtotal', value: totals.subtotal, cls: '' },
              { label: 'Discount', value: -totals.discountAmount, cls: 'text-red-600' },
              { label: 'Tax', value: totals.taxAmount, cls: 'text-blue-600' },
            ].map(r => (
              <div key={r.label} className="flex justify-between text-sm">
                <span className="text-slate-500">{r.label}</span>
                <span className={`font-medium ${r.cls}`}>₨ {Math.abs(r.value).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between text-base font-bold pt-2 border-t-2 border-slate-200">
              <span>Grand Total</span>
              <span className="text-amber-600">₨ {totals.grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Notes</label>
          <textarea className="form-input" rows={3} value={form.notes} onChange={e => setField('notes', e.target.value)} placeholder="Additional notes..." />
        </div>
        <div>
          <label className="form-label">Terms & Conditions</label>
          <textarea className="form-input" rows={3} value={form.termsAndConditions} onChange={e => setField('termsAndConditions', e.target.value)} />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
        <button onClick={handleSave} disabled={saving} className="btn btn-primary">
          <Save size={15} /> {saving ? 'Saving...' : 'Save Invoice'}
        </button>
        <button onClick={() => { const data = { ...form, ...totals }; onPreview?.(data); }} className="btn btn-secondary">
          <Eye size={15} /> Preview
        </button>
      </div>
    </div>
  );
}
