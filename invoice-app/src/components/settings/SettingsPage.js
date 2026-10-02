'use client';
import { useState, useRef } from 'react';
import { useApp } from '@/lib/context';
import { settingsStore } from '@/lib/store';
import { Save, Upload, Building2, Phone, CreditCard, FileText, Image } from 'lucide-react';

const TABS = [
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'contact', label: 'Contact', icon: Phone },
  { id: 'banking', label: 'Banking', icon: CreditCard },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'branding', label: 'Branding', icon: Image },
];

export default function SettingsPage() {
  const { settings, updateSettings } = useApp();
  const [activeTab, setActiveTab] = useState('company');
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const logoRef = useRef();
  const signRef = useRef();
  const stampRef = useRef();

  const handleSave = () => {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleFileUpload = (key, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setF(key, ev.target.result);
    reader.readAsDataURL(file);
  };

  const F = ({ label, name, type = 'text', placeholder, hint }) => (
    <div>
      <label className="form-label">{label}</label>
      <input type={type} className="form-input" value={form[name] || ''} onChange={e => setF(name, e.target.value)} placeholder={placeholder || label} />
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );

  return (
    <div className="p-4 lg:p-6 fade-in">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}>
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="card p-6 space-y-5">
          {/* Company Info */}
          {activeTab === 'company' && (
            <>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2"><Building2 size={18} /> Company Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <F label="Company Name" name="companyName" />
                <F label="Tagline" name="tagline" />
                <div className="sm:col-span-2"><F label="Address" name="address" /></div>
                <F label="Quotation Prefix" name="quotationPrefix" hint="e.g. QTN → QTN-000001" />
                <F label="Invoice Prefix" name="invoicePrefix" hint="e.g. INV → INV-000001" />
                <F label="Currency Symbol" name="currencySymbol" hint="e.g. ₨, $, €" />
                <F label="Currency" name="currency" />
              </div>
            </>
          )}

          {/* Contact */}
          {activeTab === 'contact' && (
            <>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2"><Phone size={18} /> Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <F label="Phone Number" name="phone" type="tel" />
                <F label="WhatsApp Number" name="whatsapp" type="tel" />
                <F label="Email Address" name="email" type="email" />
                <F label="Website" name="website" />
              </div>
            </>
          )}

          {/* Banking */}
          {activeTab === 'banking' && (
            <>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2"><CreditCard size={18} /> Bank Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <F label="Bank Name" name="bankName" />
                <F label="Account Title" name="accountTitle" />
                <F label="Account Number" name="accountNumber" />
                <F label="IBAN" name="iban" />
              </div>
            </>
          )}

          {/* Documents */}
          {activeTab === 'documents' && (
            <>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2"><FileText size={18} /> Document Settings</h3>
              <div>
                <label className="form-label">Default Terms & Conditions</label>
                <textarea className="form-input" rows={8} value={form.termsAndConditions || ''} onChange={e => setF('termsAndConditions', e.target.value)} />
              </div>
            </>
          )}

          {/* Branding */}
          {activeTab === 'branding' && (
            <>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2"><Image size={18} /> Branding Assets</h3>
              <div className="space-y-6">
                {/* Logo */}
                <div>
                  <label className="form-label">Company Logo</label>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50">
                      {form.logo ? (
                        <img src={form.logo} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-2xl font-bold text-slate-300">MG</span>
                      )}
                    </div>
                    <div>
                      <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload('logo', e)} />
                      <button onClick={() => logoRef.current?.click()} className="btn btn-outline text-sm">
                        <Upload size={14} /> Upload Logo
                      </button>
                      {form.logo && <button onClick={() => setF('logo', null)} className="btn text-sm text-red-500 hover:bg-red-50 ml-2">Remove</button>}
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG, SVG (max 2MB)</p>
                    </div>
                  </div>
                </div>

                {/* Signature */}
                <div>
                  <label className="form-label">Authorized Signature</label>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="w-32 h-16 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50">
                      {form.signature ? (
                        <img src={form.signature} alt="Signature" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-xs text-slate-300">Signature</span>
                      )}
                    </div>
                    <div>
                      <input ref={signRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload('signature', e)} />
                      <button onClick={() => signRef.current?.click()} className="btn btn-outline text-sm">
                        <Upload size={14} /> Upload Signature
                      </button>
                      {form.signature && <button onClick={() => setF('signature', null)} className="btn text-sm text-red-500 hover:bg-red-50 ml-2">Remove</button>}
                    </div>
                  </div>
                </div>

                {/* Stamp */}
                <div>
                  <label className="form-label">Company Stamp</label>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50">
                      {form.stamp ? (
                        <img src={form.stamp} alt="Stamp" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-xs text-slate-300 text-center">Stamp</span>
                      )}
                    </div>
                    <div>
                      <input ref={stampRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload('stamp', e)} />
                      <button onClick={() => stampRef.current?.click()} className="btn btn-outline text-sm">
                        <Upload size={14} /> Upload Stamp
                      </button>
                      {form.stamp && <button onClick={() => setF('stamp', null)} className="btn text-sm text-red-500 hover:bg-red-50 ml-2">Remove</button>}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Save Button */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button onClick={handleSave} className="btn btn-secondary">
              <Save size={16} /> Save Settings
            </button>
            {saved && (
              <div className="flex items-center gap-2 text-green-600 text-sm animate-pulse">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Settings saved successfully!
              </div>
            )}
          </div>
        </div>

        {/* Current company card preview */}
        <div className="card p-5 bg-slate-50 dark:bg-slate-800">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Preview</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {form.companyName?.[0] || 'M'}
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">{form.companyName}</div>
              <div className="text-sm text-slate-500">{form.tagline}</div>
              <div className="text-xs text-slate-400 mt-1">{form.email} · {form.phone}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
