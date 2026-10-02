'use client';
import { useState, useEffect } from 'react';
import { invoiceStore, quotationStore, clientStore, serviceStore, formatCurrency } from '@/lib/store';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import { Download, TrendingUp, Users, Receipt, FileText } from 'lucide-react';

const COLORS = ['#F59E0B', '#0F172A', '#22C55E', '#3B82F6', '#EF4444', '#8B5CF6'];

export default function ReportsPage() {
  const [period, setPeriod] = useState('monthly');
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const invoices = invoiceStore.getAll();
    const quotations = quotationStore.getAll();
    const clients = clientStore.getAll();
    const services = serviceStore.getAll();

    // Monthly data
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthlyRevenue = months.map((month, i) => {
      const key = `${year}-${String(i + 1).padStart(2, '0')}`;
      const monthInv = invoices.filter(inv => inv.createdAt?.startsWith(key));
      const monthQtn = quotations.filter(q => q.createdAt?.startsWith(key));
      return {
        month,
        revenue: monthInv.reduce((s, inv) => s + (inv.grandTotal || 0), 0),
        collected: monthInv.filter(i => i.paymentStatus === 'paid').reduce((s, inv) => s + (inv.grandTotal || 0), 0),
        pending: monthInv.reduce((s, inv) => s + (inv.remainingAmount || 0), 0),
        invoices: monthInv.length,
        quotations: monthQtn.length,
      };
    });

    // Service popularity (count in all invoices)
    const serviceCount = {};
    invoices.forEach(inv => {
      (inv.items || []).forEach(item => {
        serviceCount[item.service] = (serviceCount[item.service] || 0) + (item.qty || 1);
      });
    });
    const topServices = Object.entries(serviceCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));

    // Client revenue
    const clientRevenue = clients.map(c => {
      const clientInvoices = invoices.filter(inv => inv.clientId === c.id);
      return {
        name: c.name,
        revenue: clientInvoices.reduce((s, inv) => s + (inv.grandTotal || 0), 0),
        invoices: clientInvoices.length,
      };
    }).filter(c => c.revenue > 0).sort((a, b) => b.revenue - a.revenue).slice(0, 8);

    // Payment method breakdown
    const paymentMethods = {};
    invoices.forEach(inv => {
      if (inv.paymentMethod) {
        paymentMethods[inv.paymentMethod] = (paymentMethods[inv.paymentMethod] || 0) + (inv.grandTotal || 0);
      }
    });
    const paymentMethodData = Object.entries(paymentMethods).map(([name, value]) => ({ name, value }));

    // Summary stats
    const totalRevenue = invoices.reduce((s, i) => s + (i.grandTotal || 0), 0);
    const collectedRevenue = invoices.filter(i => i.paymentStatus === 'paid').reduce((s, i) => s + (i.grandTotal || 0), 0);
    const pendingRevenue = invoices.reduce((s, i) => s + (i.remainingAmount || 0), 0);

    setData({ monthlyRevenue, topServices, clientRevenue, paymentMethodData, totalRevenue, collectedRevenue, pendingRevenue, invoices, quotations });
  }, [year]);

  if (!mounted || !data) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" /></div>;

  const exportCSV = () => {
    const rows = [
      ['Month', 'Revenue', 'Collected', 'Pending', 'Invoices', 'Quotations'],
      ...data.monthlyRevenue.map(r => [r.month, r.revenue, r.collected, r.pending, r.invoices, r.quotations])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `report-${year}.csv`; a.click();
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 fade-in">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <select className="form-input w-28" value={year} onChange={e => setYear(parseInt(e.target.value))}>
            {[2022, 2023, 2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
        <button onClick={exportCSV} className="btn btn-outline text-sm">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(data.totalRevenue), icon: TrendingUp, color: 'bg-gradient-to-br from-amber-400 to-orange-500' },
          { label: 'Collected', value: formatCurrency(data.collectedRevenue), icon: Receipt, color: 'bg-gradient-to-br from-green-400 to-emerald-600' },
          { label: 'Pending', value: formatCurrency(data.pendingRevenue), icon: TrendingUp, color: 'bg-gradient-to-br from-red-400 to-rose-600' },
          { label: 'Total Invoices', value: data.invoices.length, icon: FileText, color: 'bg-gradient-to-br from-blue-400 to-blue-600' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-5 text-white shadow-lg`}>
            <s.icon size={20} className="mb-3 opacity-80" />
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-sm opacity-80 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Monthly Revenue Bar Chart */}
      <div className="card p-5">
        <h3 className="font-bold text-slate-900 dark:text-white mb-1">Monthly Revenue {year}</h3>
        <p className="text-xs text-slate-500 mb-5">Revenue vs Collections vs Pending</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data.monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Legend />
            <Bar dataKey="revenue" name="Total Revenue" fill="#F59E0B" radius={[4,4,0,0]} />
            <Bar dataKey="collected" name="Collected" fill="#22C55E" radius={[4,4,0,0]} />
            <Bar dataKey="pending" name="Pending" fill="#EF4444" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Row: Invoices/Quotations trend + Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Line Chart */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Document Activity</h3>
          <p className="text-xs text-slate-500 mb-5">Invoices & Quotations per month</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="invoices" name="Invoices" stroke="#F59E0B" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="quotations" name="Quotations" stroke="#3B82F6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods Pie */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Payment Methods</h3>
          <p className="text-xs text-slate-500 mb-5">Revenue by payment method</p>
          {data.paymentMethodData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={data.paymentMethodData} cx="50%" cy="50%" outerRadius={70} paddingAngle={3} dataKey="value">
                    {data.paymentMethodData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {data.paymentMethodData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-slate-600 dark:text-slate-400">{d.name}</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(d.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-slate-400 text-sm text-center mt-8">No payment data</p>}
        </div>
      </div>

      {/* Top Services */}
      {data.topServices.length > 0 && (
        <div className="card p-5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Best Selling Services</h3>
          <p className="text-xs text-slate-500 mb-5">By quantity ordered</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.topServices} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} width={140} />
              <Tooltip />
              <Bar dataKey="count" name="Orders" fill="#F59E0B" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Clients */}
      {data.clientRevenue.length > 0 && (
        <div className="card p-5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Top Clients by Revenue</h3>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Client</th>
                  <th>Total Invoices</th>
                  <th>Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.clientRevenue.map((c, idx) => (
                  <tr key={c.name}>
                    <td className="text-slate-400">{idx + 1}</td>
                    <td className="font-medium">{c.name}</td>
                    <td>{c.invoices}</td>
                    <td className="font-semibold text-amber-600">{formatCurrency(c.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
