'use client';
import { useState, useEffect } from 'react';
import { serviceStore } from '@/lib/store';
import { useApp } from '@/lib/context';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Search, Plus, Edit2, Trash2, Package, Tag } from 'lucide-react';

const CATEGORIES = ['Food', 'Decoration', 'Media', 'Event', 'Furniture', 'Utility', 'Management', 'Other'];
const UNITS = ['Plate', 'Person', 'Package', 'Event', 'Day', 'Hour', 'Set', 'Setup', 'Unit', 'Item'];
const EMPTY = { name: '', category: 'Food', unit: 'Event', price: '' };

export default function ServicesPage({ initialNew = false }) {
  const { isAdmin } = useApp();
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const refresh = () => setServices(serviceStore.getAll());
  useEffect(() => { refresh(); }, []);
  useEffect(() => { if (initialNew) openNew(); }, [initialNew]);

  const openNew = () => { setForm(EMPTY); setEditing(null); setErrors({}); setFormOpen(true); };
  const openEdit = (s) => { setForm(s); setEditing(s.id); setErrors({}); setFormOpen(true); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Service name is required';
    if (!form.price || isNaN(form.price)) e.price = 'Valid price is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const data = { ...form, price: parseFloat(form.price) };
    if (editing) serviceStore.update(editing, data);
    else serviceStore.add(data);
    refresh();
    setFormOpen(false);
  };

  const handleDelete = () => { serviceStore.delete(deleteId); refresh(); };

  const categories = ['All', ...CATEGORIES];
  const filtered = services.filter(s => {
    const matchSearch = s.name?.toLowerCase().includes(search.toLowerCase()) || s.category?.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || s.category === catFilter;
    return matchSearch && matchCat;
  });

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const items = filtered.filter(s => s.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div className="p-4 lg:p-6 space-y-5 fade-in">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="form-input pl-9" placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button onClick={openNew} className="btn btn-secondary"><Plus size={16} /> Add Service</button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(c => (
          <button key={c}
            onClick={() => setCatFilter(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${catFilter === c ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card p-4 text-center bg-blue-50 dark:bg-blue-900/20">
          <div className="text-2xl font-bold text-blue-600">{services.length}</div>
          <div className="text-xs text-slate-500">Total Services</div>
        </div>
        <div className="card p-4 text-center bg-purple-50 dark:bg-purple-900/20">
          <div className="text-2xl font-bold text-purple-600">{CATEGORIES.filter(c => services.some(s => s.category === c)).length}</div>
          <div className="text-xs text-slate-500">Categories</div>
        </div>
        <div className="card p-4 text-center bg-green-50 dark:bg-green-900/20">
          <div className="text-2xl font-bold text-green-600">
            ₨{Math.min(...services.map(s => s.price || 0)).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">Min Price</div>
        </div>
        <div className="card p-4 text-center bg-amber-50 dark:bg-amber-900/20">
          <div className="text-2xl font-bold text-amber-600">
            ₨{Math.max(...services.map(s => s.price || 0)).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">Max Price</div>
        </div>
      </div>

      {/* Services by Category */}
      {Object.keys(grouped).length === 0 ? (
        <div className="card p-12 text-center">
          <Package size={40} className="mx-auto mb-3 text-slate-200" />
          <p className="text-slate-400">No services found</p>
          <button onClick={openNew} className="btn btn-secondary mt-3 text-sm">Add First Service</button>
        </div>
      ) : Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="card overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
            <Tag size={16} className="text-amber-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white">{cat}</h3>
            <span className="ml-auto text-xs text-slate-500">{items.length} services</span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Service Name</th>
                  <th>Unit</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-600 bg-amber-50">
                          <Package size={14} />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">{s.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">{s.unit}</span>
                    </td>
                    <td className="font-semibold text-slate-900 dark:text-white">₨ {Number(s.price).toLocaleString()}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(s)} className="w-7 h-7 rounded-md bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-600">
                          <Edit2 size={13} />
                        </button>
                        {isAdmin && (
                          <button onClick={() => { setDeleteId(s.id); setDeleteOpen(true); }}
                            className="w-7 h-7 rounded-md bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500">
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
      ))}

      {/* Form Modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Edit Service' : 'Add New Service'} size="sm">
        <div className="space-y-4">
          <div>
            <label className="form-label">Service Name <span className="text-red-500">*</span></label>
            <input className={`form-input ${errors.name ? 'border-red-300' : ''}`}
              value={form.name || ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Catering Per Plate" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Category</label>
              <select className="form-input" value={form.category || 'Food'} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Unit</label>
              <select className="form-input" value={form.unit || 'Event'} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}>
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">Unit Price (₨) <span className="text-red-500">*</span></label>
            <input type="number" className={`form-input ${errors.price ? 'border-red-300' : ''}`}
              value={form.price || ''} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="0.00" min="0" />
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
          </div>
        </div>
        <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
          <button onClick={() => setFormOpen(false)} className="btn btn-outline flex-1">Cancel</button>
          <button onClick={handleSave} className="btn btn-secondary flex-1">{editing ? 'Save Changes' : 'Add Service'}</button>
        </div>
      </Modal>

      <ConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete}
        title="Delete Service" message="Delete this service? It won't affect existing quotations/invoices." />
    </div>
  );
}
