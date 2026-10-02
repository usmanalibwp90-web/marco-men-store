'use client';
// Central data store using localStorage for persistence
// In production this connects to a Laravel REST API

const KEYS = {
  AUTH: 'mg_auth',
  CLIENTS: 'mg_clients',
  SERVICES: 'mg_services',
  QUOTATIONS: 'mg_quotations',
  INVOICES: 'mg_invoices',
  SETTINGS: 'mg_settings',
  DARK_MODE: 'mg_dark_mode',
};

// ─── Helpers ────────────────────────────────────────────────────────────────
const load = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};

const save = (key, value) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const padNum = (n, len = 6) => String(n).padStart(len, '0');

// ─── Auth ────────────────────────────────────────────────────────────────────
const SEED_USERS = [
  { id: '1', name: 'Admin User', email: 'admin@mgfood.com', password: 'admin123', role: 'admin' },
  { id: '2', name: 'Staff Member', email: 'staff@mgfood.com', password: 'staff123', role: 'staff' },
];

export const authStore = {
  getUser: () => load(KEYS.AUTH, null),
  login: (email, password) => {
    const user = SEED_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...safe } = user;
      save(KEYS.AUTH, safe);
      return safe;
    }
    return null;
  },
  logout: () => save(KEYS.AUTH, null),
  isAdmin: () => {
    const u = load(KEYS.AUTH, null);
    return u?.role === 'admin';
  },
};

// ─── Settings ────────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  companyName: 'MG Food & Event Planners',
  tagline: 'Creating Memorable Moments',
  address: '123 Main Boulevard, Lahore, Pakistan',
  email: 'info@mgfoodevents.com',
  phone: '+92 300 1234567',
  whatsapp: '+92 300 1234567',
  website: 'www.mgfoodevents.com',
  bankName: 'HBL Bank',
  accountTitle: 'MG Food & Events',
  accountNumber: '12345678901',
  iban: 'PK00HABB0000000123456789',
  currency: 'PKR',
  currencySymbol: '₨',
  quotationPrefix: 'QTN',
  invoicePrefix: 'INV',
  taxRate: 0,
  termsAndConditions: `1. Payment is due within 30 days of invoice date.\n2. 50% advance payment required to confirm booking.\n3. Cancellation policy: 30 days notice required.\n4. All prices are inclusive of service charges.\n5. MG Food & Event Planners reserves the right to adjust services based on mutual agreement.`,
  logo: null,
  signature: null,
  stamp: null,
};

export const settingsStore = {
  get: () => load(KEYS.SETTINGS, DEFAULT_SETTINGS),
  set: (data) => save(KEYS.SETTINGS, { ...load(KEYS.SETTINGS, DEFAULT_SETTINGS), ...data }),
};

// ─── Clients ─────────────────────────────────────────────────────────────────
const SEED_CLIENTS = [
  { id: '1', name: 'Ahmed Khan', company: 'Khan Enterprises', phone: '+92 321 1111111', whatsapp: '+92 321 1111111', email: 'ahmed@khan.com', address: '45 Garden Town', city: 'Lahore', notes: 'VIP client', createdAt: '2024-01-10' },
  { id: '2', name: 'Sara Ali', company: 'Ali & Sons', phone: '+92 333 2222222', whatsapp: '+92 333 2222222', email: 'sara@ali.com', address: '12 Model Town', city: 'Lahore', notes: '', createdAt: '2024-02-15' },
  { id: '3', name: 'Bilal Hassan', company: 'Hassan Corp', phone: '+92 300 3333333', whatsapp: '+92 300 3333333', email: 'bilal@hassan.com', address: '78 DHA Phase 5', city: 'Karachi', notes: 'Prefers WhatsApp contact', createdAt: '2024-03-20' },
];

export const clientStore = {
  getAll: () => {
    const stored = load(KEYS.CLIENTS, null);
    if (!stored) { save(KEYS.CLIENTS, SEED_CLIENTS); return SEED_CLIENTS; }
    return stored;
  },
  add: (client) => {
    const all = clientStore.getAll();
    const newClient = { ...client, id: genId(), createdAt: new Date().toISOString().split('T')[0] };
    save(KEYS.CLIENTS, [...all, newClient]);
    return newClient;
  },
  update: (id, data) => {
    const all = clientStore.getAll().map(c => c.id === id ? { ...c, ...data } : c);
    save(KEYS.CLIENTS, all);
  },
  delete: (id) => save(KEYS.CLIENTS, clientStore.getAll().filter(c => c.id !== id)),
  getById: (id) => clientStore.getAll().find(c => c.id === id),
};

// ─── Services ────────────────────────────────────────────────────────────────
const SEED_SERVICES = [
  { id: '1', name: 'Catering (Per Plate)', category: 'Food', unit: 'Plate', price: 1500 },
  { id: '2', name: 'BBQ Setup', category: 'Food', unit: 'Setup', price: 25000 },
  { id: '3', name: 'Wedding Menu (Deluxe)', category: 'Food', unit: 'Package', price: 150000 },
  { id: '4', name: 'Hi Tea (Per Person)', category: 'Food', unit: 'Person', price: 800 },
  { id: '5', name: 'Decoration (Basic)', category: 'Decoration', unit: 'Event', price: 30000 },
  { id: '6', name: 'Decoration (Premium)', category: 'Decoration', unit: 'Event', price: 80000 },
  { id: '7', name: 'Photography', category: 'Media', unit: 'Day', price: 20000 },
  { id: '8', name: 'Videography', category: 'Media', unit: 'Day', price: 25000 },
  { id: '9', name: 'Stage Setup', category: 'Event', unit: 'Event', price: 50000 },
  { id: '10', name: 'Lighting System', category: 'Event', unit: 'Event', price: 35000 },
  { id: '11', name: 'Sound System', category: 'Event', unit: 'Event', price: 30000 },
  { id: '12', name: 'Furniture Package', category: 'Furniture', unit: 'Package', price: 15000 },
  { id: '13', name: 'Crockery Set', category: 'Furniture', unit: 'Set', price: 10000 },
  { id: '14', name: 'Generator (8 Hours)', category: 'Utility', unit: 'Day', price: 12000 },
  { id: '15', name: 'Event Management', category: 'Management', unit: 'Event', price: 40000 },
];

export const serviceStore = {
  getAll: () => {
    const stored = load(KEYS.SERVICES, null);
    if (!stored) { save(KEYS.SERVICES, SEED_SERVICES); return SEED_SERVICES; }
    return stored;
  },
  add: (service) => {
    const all = serviceStore.getAll();
    const newService = { ...service, id: genId() };
    save(KEYS.SERVICES, [...all, newService]);
    return newService;
  },
  update: (id, data) => {
    const all = serviceStore.getAll().map(s => s.id === id ? { ...s, ...data } : s);
    save(KEYS.SERVICES, all);
  },
  delete: (id) => save(KEYS.SERVICES, serviceStore.getAll().filter(s => s.id !== id)),
};

// ─── Quotations ───────────────────────────────────────────────────────────────
const SEED_QUOTATIONS = [
  {
    id: '1', number: 'QTN-000001', clientId: '1', clientName: 'Ahmed Khan',
    eventName: 'Wedding Reception', eventDate: '2024-06-15', venue: 'Pearl Continental, Lahore',
    guestCount: 500, salesPerson: 'Admin User', validUntil: '2024-05-15',
    status: 'confirmed', notes: 'Royal wedding setup required',
    termsAndConditions: '', items: [
      { id: '1', service: 'Catering (Per Plate)', description: 'Full wedding menu', qty: 500, unitPrice: 1500, discount: 5, tax: 0, total: 712500 },
      { id: '2', service: 'Decoration (Premium)', description: 'Premium floral decoration', qty: 1, unitPrice: 80000, discount: 0, tax: 0, total: 80000 },
    ],
    subtotal: 792500, discountAmount: 37500, taxAmount: 0, grandTotal: 755000,
    createdAt: '2024-04-01',
  },
  {
    id: '2', number: 'QTN-000002', clientId: '2', clientName: 'Sara Ali',
    eventName: 'Corporate Hi Tea', eventDate: '2024-07-20', venue: 'Avari Hotel, Lahore',
    guestCount: 150, salesPerson: 'Staff Member', validUntil: '2024-06-20',
    status: 'draft', notes: 'Corporate branding required',
    termsAndConditions: '', items: [
      { id: '1', service: 'Hi Tea (Per Person)', description: 'Premium hi tea', qty: 150, unitPrice: 800, discount: 0, tax: 0, total: 120000 },
    ],
    subtotal: 120000, discountAmount: 0, taxAmount: 0, grandTotal: 120000,
    createdAt: '2024-04-10',
  },
];

export const quotationStore = {
  getAll: () => {
    const stored = load(KEYS.QUOTATIONS, null);
    if (!stored) { save(KEYS.QUOTATIONS, SEED_QUOTATIONS); return SEED_QUOTATIONS; }
    return stored;
  },
  getNextNumber: () => {
    const s = settingsStore.get();
    const all = quotationStore.getAll();
    const nums = all.map(q => parseInt(q.number.split('-')[1] || '0', 10));
    const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `${s.quotationPrefix}-${padNum(next)}`;
  },
  add: (q) => {
    const all = quotationStore.getAll();
    const newQ = { ...q, id: genId(), createdAt: new Date().toISOString().split('T')[0] };
    save(KEYS.QUOTATIONS, [...all, newQ]);
    return newQ;
  },
  update: (id, data) => {
    const all = quotationStore.getAll().map(q => q.id === id ? { ...q, ...data } : q);
    save(KEYS.QUOTATIONS, all);
  },
  delete: (id) => save(KEYS.QUOTATIONS, quotationStore.getAll().filter(q => q.id !== id)),
  getById: (id) => quotationStore.getAll().find(q => q.id === id),
  duplicate: (id) => {
    const orig = quotationStore.getById(id);
    if (!orig) return null;
    const newNum = quotationStore.getNextNumber();
    return quotationStore.add({ ...orig, number: newNum, status: 'draft', id: undefined, createdAt: undefined });
  },
};

// ─── Invoices ─────────────────────────────────────────────────────────────────
const SEED_INVOICES = [
  {
    id: '1', number: 'INV-000001', quotationId: '1', clientId: '1', clientName: 'Ahmed Khan',
    eventName: 'Wedding Reception', eventDate: '2024-06-15', venue: 'Pearl Continental, Lahore',
    guestCount: 500, salesPerson: 'Admin User',
    paymentStatus: 'partially_paid', paymentMethod: 'Bank Transfer',
    advancePayment: 300000, remainingAmount: 455000, dueDate: '2024-06-10',
    notes: '', termsAndConditions: '',
    items: [
      { id: '1', service: 'Catering (Per Plate)', description: 'Full wedding menu', qty: 500, unitPrice: 1500, discount: 5, tax: 0, total: 712500 },
      { id: '2', service: 'Decoration (Premium)', description: 'Premium floral decoration', qty: 1, unitPrice: 80000, discount: 0, tax: 0, total: 80000 },
    ],
    subtotal: 792500, discountAmount: 37500, taxAmount: 0, grandTotal: 755000,
    createdAt: '2024-04-05',
  },
  {
    id: '2', number: 'INV-000002', quotationId: null, clientId: '3', clientName: 'Bilal Hassan',
    eventName: 'Birthday Party', eventDate: '2024-05-30', venue: 'Home, Karachi',
    guestCount: 80, salesPerson: 'Admin User',
    paymentStatus: 'paid', paymentMethod: 'Cash',
    advancePayment: 45000, remainingAmount: 0, dueDate: '2024-05-25',
    notes: '', termsAndConditions: '',
    items: [
      { id: '1', service: 'Catering (Per Plate)', description: 'Birthday dinner', qty: 80, unitPrice: 1500, discount: 0, tax: 0, total: 120000 },
      { id: '2', service: 'Decoration (Basic)', description: 'Birthday decoration', qty: 1, unitPrice: 30000, discount: 10, tax: 0, total: 27000 },
    ],
    subtotal: 150000, discountAmount: 3000, taxAmount: 0, grandTotal: 147000,
    createdAt: '2024-04-20',
  },
];

export const invoiceStore = {
  getAll: () => {
    const stored = load(KEYS.INVOICES, null);
    if (!stored) { save(KEYS.INVOICES, SEED_INVOICES); return SEED_INVOICES; }
    return stored;
  },
  getNextNumber: () => {
    const s = settingsStore.get();
    const all = invoiceStore.getAll();
    const nums = all.map(i => parseInt(i.number.split('-')[1] || '0', 10));
    const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `${s.invoicePrefix}-${padNum(next)}`;
  },
  add: (inv) => {
    const all = invoiceStore.getAll();
    const newInv = { ...inv, id: genId(), createdAt: new Date().toISOString().split('T')[0] };
    save(KEYS.INVOICES, [...all, newInv]);
    return newInv;
  },
  update: (id, data) => {
    const all = invoiceStore.getAll().map(i => i.id === id ? { ...i, ...data } : i);
    save(KEYS.INVOICES, all);
  },
  delete: (id) => save(KEYS.INVOICES, invoiceStore.getAll().filter(i => i.id !== id)),
  getById: (id) => invoiceStore.getAll().find(i => i.id === id),
  fromQuotation: (quotationId) => {
    const q = quotationStore.getById(quotationId);
    if (!q) return null;
    const num = invoiceStore.getNextNumber();
    const grandTotal = q.grandTotal;
    return invoiceStore.add({
      ...q,
      id: undefined,
      number: num,
      quotationId,
      paymentStatus: 'unpaid',
      paymentMethod: 'Cash',
      advancePayment: 0,
      remainingAmount: grandTotal,
      dueDate: new Date(Date.now() + 30 * 864e5).toISOString().split('T')[0],
    });
  },
  duplicate: (id) => {
    const orig = invoiceStore.getById(id);
    if (!orig) return null;
    const newNum = invoiceStore.getNextNumber();
    return invoiceStore.add({ ...orig, number: newNum, paymentStatus: 'unpaid', id: undefined, createdAt: undefined });
  },
};

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const dashboardStats = () => {
  const invoices = invoiceStore.getAll();
  const quotations = quotationStore.getAll();
  const settings = settingsStore.get();
  const sym = settings.currencySymbol;

  const totalRevenue = invoices.filter(i => i.paymentStatus === 'paid').reduce((s, i) => s + i.grandTotal, 0);
  const pendingRevenue = invoices.filter(i => i.paymentStatus !== 'paid').reduce((s, i) => s + i.remainingAmount, 0);
  const paidInvoices = invoices.filter(i => i.paymentStatus === 'paid').length;
  const unpaidInvoices = invoices.filter(i => i.paymentStatus === 'unpaid').length;

  // Monthly data for charts (last 6 months)
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const month = d.toLocaleString('default', { month: 'short' });
    const year = d.getFullYear();
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthInvoices = invoices.filter(inv => inv.createdAt?.startsWith(key));
    const monthQuotations = quotations.filter(q => q.createdAt?.startsWith(key));
    monthlyData.push({
      month: `${month} ${year}`,
      invoices: monthInvoices.length,
      quotations: monthQuotations.length,
      revenue: monthInvoices.reduce((s, inv) => s + inv.grandTotal, 0),
      pending: monthInvoices.filter(inv => inv.paymentStatus !== 'paid').reduce((s, inv) => s + inv.remainingAmount, 0),
    });
  }

  return {
    totalQuotations: quotations.length,
    totalInvoices: invoices.length,
    totalRevenue,
    pendingRevenue,
    paidInvoices,
    unpaidInvoices,
    monthlyData,
    currencySymbol: sym,
    recentActivity: [
      ...invoices.slice(-5).reverse().map(i => ({ type: 'invoice', number: i.number, client: i.clientName, amount: i.grandTotal, date: i.createdAt, status: i.paymentStatus })),
      ...quotations.slice(-3).reverse().map(q => ({ type: 'quotation', number: q.number, client: q.clientName, amount: q.grandTotal, date: q.createdAt, status: q.status })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8),
  };
};

export const formatCurrency = (amount) => {
  const s = settingsStore.get();
  return `${s.currencySymbol} ${Number(amount || 0).toLocaleString()}`;
};
