'use client';
import { useState, useEffect } from 'react';
import { invoiceStore, formatCurrency } from '@/lib/store';
import { useApp } from '@/lib/context';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Badge from '@/components/ui/Badge';
import InvoiceForm from './InvoiceForm';
import DocumentPreview from '@/components/pdf/DocumentPreview';
import { Search, Plus, Eye, Edit2, Trash2, Copy, Receipt, Filter } from 'lucide-react';

export default function InvoicesPage({ initialNew = false }) {
  const { isAdmin } = useApp();
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [previewing, setPreviewing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const refresh = () => setInvoices(invoiceStore.getAll());
  useEffect(() => { refresh(); }, []);
  useEffect(() => { if (initialNew) { setEditing(null); setFormOpen(true); } }, [initialNew]);

  const handleDelete = () => { invoiceStore.delete(deleteId); refresh(); };
  const handleDuplicate = (id) => { invoiceStore.duplicate(id); refresh(); };

  const filtered = invoices.filter(inv => {
    const matchSearch =
      inv.number?.toLowerCase().includes(search.toLowerCase()) ||
      inv.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      inv.eventName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.paymentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.paymentStatus === 'paid').length,
    unpaid: invoices.filter(i => i.paymentStatus === 'unpaid').length,
    partial: invoices.filter(i => i.paymentStatus === 'partially_paid').length,
    totalRevenue: invoices.reduce((s, i) => s + (i.grandTotal || 0), 0),
    collected: invoices.reduce((s, i) => s + (i.advancePayment || 0), 0),
    pending: invoices.reduce((s, i) => s + (i.remainingAmount || 0), 0),
  };

  const paymentStatusColors = {
    paid: { bg: 'bg-green-50', text: 'text-green-600' },
    unpaid: { bg: 'bg-red-50', text: 'text-red-600' },
    partially_paid: { bg: 'bg-amber-50', text: 'text-amber-600' },
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 fade-in">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="form-input pl-9" placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-input w-full sm:w-44" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="partially_paid">Partially Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
        <button onClick={() => { setEditing(null); setFormOpen(true); }} className="btn btn-secondary">
          <Plus size={16} /> New Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Invoices', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Paid', value: stats.paid, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Unpaid', value: stats.unpaid, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Total Billed', value: formatCurrency(stats.totalRevenue), color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className={`card p-4 text-center ${s.bg}`}>
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Billed', value: formatCurrency(stats.totalRevenue), icon: '📋', color: 'border-blue-200 bg-blue-50/50' },
          { label: 'Collected', value: formatCurrency(stats.collected), icon: '✅', color: 'border-green-200 bg-green-50/50' },
          { label: 'Pending', value: formatCurrency(stats.pending), icon: '⏳', color: 'border-amber-200 bg-amber-50/50' },
        ].map(s => (
          <div key={s.label} className={`card p-4 border ${s.color}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Event</th>
                <th>Total</th>
                <th>Advance</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12">
                    <Receipt size={40} className="mx-auto mb-3 text-slate-200" />
                    <p className="text-slate-400">No invoices found</p>
                    <button onClick={() => { setEditing(null); setFormOpen(true); }} className="btn btn-secondary mt-3 text-sm">Create First Invoice</button>
                  </td>
                </tr>
              ) : filtered.map(inv => (
                <tr key={inv.id}>
                  <td className="font-mono text-sm font-semibold text-slate-900 dark:text-white">{inv.number}</td>
                  <td className="font-medium text-slate-900 dark:text-white">{inv.clientName}</td>
                  <td className="text-slate-600 dark:text-slate-300 max-w-32 truncate">{inv.eventName}</td>
                  <td className="font-semibold">{formatCurrency(inv.grandTotal)}</td>
                  <td className="text-green-600 font-medium">{formatCurrency(inv.advancePayment)}</td>
                  <td className="text-red-500 font-medium">{formatCurrency(inv.remainingAmount)}</td>
                  <td><Badge status={inv.paymentStatus} /></td>
                  <td className={`text-sm font-medium ${inv.dueDate && new Date(inv.dueDate) < new Date() && inv.paymentStatus !== 'paid' ? 'text-red-600' : 'text-slate-500'}`}>
                    {inv.dueDate || '-'}
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setPreviewing(inv); setPreviewOpen(true); }}
                        className="w-7 h-7 rounded-md bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600" title="Preview">
                        <Eye size={13} />
                      </button>
                      <button onClick={() => { setEditing(inv); setFormOpen(true); }}
                        className="w-7 h-7 rounded-md bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-600" title="Edit">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => handleDuplicate(inv.id)}
                        className="w-7 h-7 rounded-md bg-purple-50 hover:bg-purple-100 flex items-center justify-center text-purple-600" title="Duplicate">
                        <Copy size={13} />
                      </button>
                      {isAdmin && (
                        <button onClick={() => { setDeleteId(inv.id); setDeleteOpen(true); }}
                          className="w-7 h-7 rounded-md bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500" title="Delete">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${editing.number}` : 'New Invoice'} size="xl">
        <InvoiceForm
          editing={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => refresh()}
          onPreview={(data) => { setPreviewing(data); setPreviewOpen(true); }}
        />
      </Modal>

      {/* Preview Modal */}
      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)}
        title={`Invoice - ${previewing?.number}`} size="full">
        {previewing && <DocumentPreview doc={previewing} type="invoice" onClose={() => setPreviewOpen(false)} />}
      </Modal>

      <ConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete}
        title="Delete Invoice" message="Delete this invoice permanently?" />
    </div>
  );
}
