'use client';
import { useState, useEffect } from 'react';
import { clientStore, quotationStore, invoiceStore, formatCurrency } from '@/lib/store';
import { useApp } from '@/lib/context';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Badge from '@/components/ui/Badge';
import {
  Search, Edit2, Trash2, Eye, Phone, Mail, MapPin,
  MessageCircle, Building2, User, Plus, ChevronDown, ChevronUp
} from 'lucide-react';

const EMPTY = { name: '', company: '', phone: '', whatsapp: '', email: '', address: '', city: '', notes: '' };

export default function ClientsPage({ initialNew = false }) {
  const { isAdmin } = useApp();
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const refresh = () => setClients(clientStore.getAll());

  useEffect(() => { refresh(); }, []);
  useEffect(() => { if (initialNew) openNew(); }, [initialNew]);

  const openNew = () => { setForm(EMPTY); setEditing(null); setErrors({}); setFormOpen(true); };
  const openEdit = (client) => { setForm(client); setEditing(client.id); setErrors({}); setFormOpen(true); };
  const openView = (client) => { setViewing(client); setViewOpen(true); };
  const openDelete = (id) => { setDeleteId(id); setDeleteOpen(true); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editing) clientStore.update(editing, form);
    else clientStore.add(form);
    refresh();
    setFormOpen(false);
  };

  const handleDelete = () => {
    clientStore.delete(deleteId);
    refresh();
  };

  const filtered = clients.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.city?.toLowerCase().includes(search.toLowerCase())
  );

  const F = ({ label, name, type = 'text', required }) => (
    <div>
      <label className="form-label">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      <input
        type={type}
        className={`form-input ${errors[name] ? 'border-red-300' : ''}`}
        value={form[name] || ''}
        onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
        placeholder={label}
      />
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="p-4 lg:p-6 space-y-5 fade-in">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="form-input pl-9"
            placeholder="Search by name, company, phone, city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button onClick={openNew} className="btn btn-secondary">
          <Plus size={16} /> Add Client
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Clients', value: clients.length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'With Company', value: clients.filter(c => c.company).length, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Cities', value: [...new Set(clients.map(c => c.city).filter(Boolean))].length, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Showing', value: filtered.length, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className={`card p-4 text-center ${s.bg}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
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
                <th>#</th>
                <th>Client</th>
                <th>Contact</th>
                <th>City</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <User size={40} className="mx-auto mb-3 text-slate-200" />
                    <p className="text-slate-400">No clients found</p>
                    <button onClick={openNew} className="btn btn-secondary mt-3 text-sm">Add First Client</button>
                  </td>
                </tr>
              ) : filtered.map((c, idx) => (
                <tr key={c.id}>
                  <td className="text-slate-400 text-sm">{idx + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ background: `hsl(${(c.name.charCodeAt(0) * 15) % 360}, 60%, 45%)` }}>
                        {c.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white text-sm">{c.name}</div>
                        {c.company && <div className="text-xs text-slate-500 flex items-center gap-1"><Building2 size={10} />{c.company}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      {c.phone && <div className="text-xs flex items-center gap-1 text-slate-600"><Phone size={10} />{c.phone}</div>}
                      {c.email && <div className="text-xs flex items-center gap-1 text-slate-500"><Mail size={10} />{c.email}</div>}
                    </div>
                  </td>
                  <td>
                    {c.city && <span className="text-xs flex items-center gap-1 text-slate-600"><MapPin size={10} />{c.city}</span>}
                  </td>
                  <td className="text-xs text-slate-500">{c.createdAt}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openView(c)} className="w-7 h-7 rounded-md bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600" title="View">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => openEdit(c)} className="w-7 h-7 rounded-md bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-600" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      {isAdmin && (
                        <button onClick={() => openDelete(c.id)} className="w-7 h-7 rounded-md bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500" title="Delete">
                          <Trash2 size={14} />
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
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Edit Client' : 'Add New Client'} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <F label="Full Name" name="name" required />
          <F label="Company Name" name="company" />
          <F label="Phone Number" name="phone" type="tel" />
          <F label="WhatsApp Number" name="whatsapp" type="tel" />
          <F label="Email Address" name="email" type="email" />
          <F label="City" name="city" />
          <div className="sm:col-span-2">
            <F label="Address" name="address" />
          </div>
          <div className="sm:col-span-2">
            <label className="form-label">Notes</label>
            <textarea
              className="form-input"
              rows={3}
              value={form.notes || ''}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="Any additional notes..."
            />
          </div>
        </div>
        <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
          <button onClick={() => setFormOpen(false)} className="btn btn-outline flex-1">Cancel</button>
          <button onClick={handleSave} className="btn btn-secondary flex-1">{editing ? 'Save Changes' : 'Add Client'}</button>
        </div>
      </Modal>

      {/* View Modal */}
      {viewing && (
        <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Client Details" size="lg">
          <ClientDetail client={viewing} />
        </Modal>
      )}

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
      />
    </div>
  );
}

function ClientDetail({ client }) {
  const quotations = quotationStore.getAll().filter(q => q.clientId === client.id);
  const invoices = invoiceStore.getAll().filter(i => i.clientId === client.id);
  const [showQ, setShowQ] = useState(false);
  const [showI, setShowI] = useState(false);

  const totalBilled = invoices.reduce((s, i) => s + i.grandTotal, 0);
  const totalPaid = invoices.filter(i => i.paymentStatus === 'paid').reduce((s, i) => s + i.grandTotal, 0);

  return (
    <div className="space-y-5">
      {/* Profile */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
          style={{ background: `hsl(${(client.name.charCodeAt(0) * 15) % 360}, 60%, 45%)` }}>
          {client.name[0]}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{client.name}</h3>
          {client.company && <p className="text-slate-500 text-sm">{client.company}</p>}
          {client.city && <p className="text-slate-400 text-xs flex items-center gap-1 mt-1"><MapPin size={10} />{client.city}</p>}
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-sm text-slate-500">Member since</div>
          <div className="font-medium text-slate-700 dark:text-slate-300">{client.createdAt}</div>
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Phone', value: client.phone, icon: Phone },
          { label: 'WhatsApp', value: client.whatsapp, icon: MessageCircle },
          { label: 'Email', value: client.email, icon: Mail },
          { label: 'Address', value: client.address, icon: MapPin },
        ].filter(f => f.value).map(f => (
          <div key={f.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <f.icon size={12} /> {f.label}
            </div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">{f.value}</div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Quotations', value: quotations.length, color: 'text-blue-600' },
          { label: 'Invoices', value: invoices.length, color: 'text-amber-600' },
          { label: 'Total Billed', value: formatCurrency(totalBilled), color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="card p-3 text-center">
            <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quotations */}
      {quotations.length > 0 && (
        <div>
          <button onClick={() => setShowQ(v => !v)}
            className="flex items-center justify-between w-full text-sm font-semibold text-slate-900 dark:text-white p-3 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100">
            Quotation History ({quotations.length})
            {showQ ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showQ && (
            <div className="mt-2 space-y-2">
              {quotations.map(q => (
                <div key={q.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div>
                    <span className="font-mono text-sm font-medium">{q.number}</span>
                    <span className="text-slate-500 text-xs ml-2">{q.eventName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{formatCurrency(q.grandTotal)}</span>
                    <Badge status={q.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Invoices */}
      {invoices.length > 0 && (
        <div>
          <button onClick={() => setShowI(v => !v)}
            className="flex items-center justify-between w-full text-sm font-semibold text-slate-900 dark:text-white p-3 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100">
            Invoice History ({invoices.length})
            {showI ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showI && (
            <div className="mt-2 space-y-2">
              {invoices.map(inv => (
                <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div>
                    <span className="font-mono text-sm font-medium">{inv.number}</span>
                    <span className="text-slate-500 text-xs ml-2">{inv.eventName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{formatCurrency(inv.grandTotal)}</span>
                    <Badge status={inv.paymentStatus} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {client.notes && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <p className="text-xs text-amber-600 font-medium mb-1">Notes</p>
          <p className="text-sm text-slate-700 dark:text-slate-300">{client.notes}</p>
        </div>
      )}
    </div>
  );
}
