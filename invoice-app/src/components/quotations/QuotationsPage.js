'use client';
import { useState, useEffect } from 'react';
import { quotationStore, invoiceStore, formatCurrency } from '@/lib/store';
import { useApp } from '@/lib/context';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Badge from '@/components/ui/Badge';
import QuotationForm from './QuotationForm';
import DocumentPreview from '@/components/pdf/DocumentPreview';
import {
  Search, Plus, Eye, Edit2, Trash2, Copy, Receipt,
  Filter, FileText, Calendar, ChevronDown
} from 'lucide-react';

export default function QuotationsPage({ initialNew = false, onNavigate }) {
  const { isAdmin } = useApp();
  const [quotations, setQuotations] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [previewing, setPreviewing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [convertId, setConvertId] = useState(null);
  const [convertConfirm, setConvertConfirm] = useState(false);

  const refresh = () => setQuotations(quotationStore.getAll());
  useEffect(() => { refresh(); }, []);
  useEffect(() => { if (initialNew) { setEditing(null); setFormOpen(true); } }, [initialNew]);

  const openNew = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (q) => { setEditing(q); setFormOpen(true); };
  const openPreview = (q) => { setPreviewing(q); setPreviewOpen(true); };
  const openDelete = (id) => { setDeleteId(id); setDeleteOpen(true); };

  const handleDelete = () => { quotationStore.delete(deleteId); refresh(); };
  const handleDuplicate = (id) => { quotationStore.duplicate(id); refresh(); };
  const handleConvert = () => {
    invoiceStore.fromQuotation(convertId);
    refresh();
    onNavigate?.('invoices');
  };

  const statuses = ['all', 'draft', 'confirmed', 'cancelled'];
  const filtered = quotations.filter(q => {
    const matchSearch =
      q.number?.toLowerCase().includes(search.toLowerCase()) ||
      q.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      q.eventName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: quotations.length,
    draft: quotations.filter(q => q.status === 'draft').length,
    confirmed: quotations.filter(q => q.status === 'confirmed').length,
    value: quotations.reduce((s, q) => s + (q.grandTotal || 0), 0),
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 fade-in">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="form-input pl-9" placeholder="Search quotations..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-input w-full sm:w-40" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <button onClick={openNew} className="btn btn-secondary"><Plus size={16} /> New Quotation</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Draft', value: stats.draft, color: 'text-slate-600', bg: 'bg-slate-50' },
          { label: 'Confirmed', value: stats.confirmed, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Value', value: formatCurrency(stats.value), color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className={`card p-4 text-center ${s.bg}`}>
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Number</th>
                <th>Client</th>
                <th>Event</th>
                <th>Event Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <FileText size={40} className="mx-auto mb-3 text-slate-200" />
                    <p className="text-slate-400">No quotations found</p>
                    <button onClick={openNew} className="btn btn-secondary mt-3 text-sm">Create First Quotation</button>
                  </td>
                </tr>
              ) : filtered.map(q => (
                <tr key={q.id}>
                  <td className="font-mono text-sm font-semibold text-slate-900 dark:text-white">{q.number}</td>
                  <td>
                    <div className="font-medium text-slate-900 dark:text-white">{q.clientName}</div>
                  </td>
                  <td className="text-slate-600 dark:text-slate-300">{q.eventName}</td>
                  <td className="text-slate-500 text-sm">{q.eventDate || '-'}</td>
                  <td className="font-semibold">{formatCurrency(q.grandTotal)}</td>
                  <td><Badge status={q.status} /></td>
                  <td className="text-slate-500 text-sm">{q.createdAt}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openPreview(q)} className="w-7 h-7 rounded-md bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600" title="Preview">
                        <Eye size={13} />
                      </button>
                      <button onClick={() => openEdit(q)} className="w-7 h-7 rounded-md bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-600" title="Edit">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => handleDuplicate(q.id)} className="w-7 h-7 rounded-md bg-purple-50 hover:bg-purple-100 flex items-center justify-center text-purple-600" title="Duplicate">
                        <Copy size={13} />
                      </button>
                      <button onClick={() => { setConvertId(q.id); setConvertConfirm(true); }}
                        className="w-7 h-7 rounded-md bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-600" title="Convert to Invoice">
                        <Receipt size={13} />
                      </button>
                      {isAdmin && (
                        <button onClick={() => openDelete(q.id)} className="w-7 h-7 rounded-md bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500" title="Delete">
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
        title={editing ? `Edit ${editing.number}` : 'New Quotation'} size="xl">
        <QuotationForm
          editing={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => refresh()}
          onPreview={(data) => { setPreviewing(data); setPreviewOpen(true); }}
        />
      </Modal>

      {/* Preview Modal */}
      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)}
        title={`Preview - ${previewing?.number}`} size="full">
        {previewing && <DocumentPreview doc={previewing} type="quotation" onClose={() => setPreviewOpen(false)} />}
      </Modal>

      <ConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete}
        title="Delete Quotation" message="Delete this quotation permanently?" />

      <ConfirmDialog open={convertConfirm} onClose={() => setConvertConfirm(false)} onConfirm={handleConvert}
        title="Convert to Invoice"
        message="This will create a new invoice from this quotation. Continue?" />
    </div>
  );
}
