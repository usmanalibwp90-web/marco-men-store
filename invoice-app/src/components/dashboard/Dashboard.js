'use client';
import { useState, useEffect } from 'react';
import { dashboardStats, formatCurrency } from '@/lib/store';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import { useApp } from '@/lib/context';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import {
  FileText, Receipt, TrendingUp, Clock, CheckCircle,
  AlertCircle, Calendar, Users
} from 'lucide-react';

const COLORS = ['#0F172A', '#F59E0B', '#22C55E', '#3B82F6', '#EF4444'];

export default function Dashboard({ onNavigate }) {
  const { user } = useApp();
  const [stats, setStats] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStats(dashboardStats());
  }, []);

  if (!mounted || !stats) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const pieData = [
    { name: 'Paid', value: stats.paidInvoices },
    { name: 'Unpaid', value: stats.unpaidInvoices },
    { name: 'Partial', value: stats.totalInvoices - stats.paidInvoices - stats.unpaidInvoices },
  ].filter(d => d.value > 0);

  return (
    <div className="p-4 lg:p-6 space-y-6 fade-in">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Quotations" value={stats.totalQuotations} icon={FileText} gradient="stat-gradient-1" subtitle="All time" />
        <StatCard title="Total Invoices" value={stats.totalInvoices} icon={Receipt} gradient="stat-gradient-2" subtitle="All time" />
        <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={TrendingUp} gradient="stat-gradient-3" subtitle="Paid invoices" />
        <StatCard title="Pending" value={formatCurrency(stats.pendingRevenue)} icon={Clock} gradient="stat-gradient-4" subtitle="To be collected" />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Paid Invoices', value: stats.paidInvoices, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Unpaid Invoices', value: stats.unpaidInvoices, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
          { label: 'This Month Rev.', value: formatCurrency(stats.monthlyData[5]?.revenue || 0), icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Monthly Pending', value: formatCurrency(stats.monthlyData[5]?.pending || 0), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        ].map(s => (
          <div key={s.label} className={`card p-4 flex items-center gap-4 ${s.bg}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg}`}>
              <s.icon size={20} className={s.color} />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Bar Chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="mb-5">
            <h3 className="font-bold text-slate-900 dark:text-white">Monthly Revenue</h3>
            <p className="text-xs text-slate-500">Last 6 months</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.monthlyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false}
                tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Bar dataKey="revenue" name="Revenue" fill="#F59E0B" radius={[4,4,0,0]} />
              <Bar dataKey="pending" name="Pending" fill="#E2E8F0" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Invoice Status</h3>
          <p className="text-xs text-slate-500 mb-4">Payment breakdown</p>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                      <span className="text-slate-600 dark:text-slate-400">{d.name}</span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <Receipt size={32} className="mb-2 opacity-30" />
              <p className="text-sm">No data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Activity Line Chart */}
      <div className="card p-5">
        <div className="mb-5">
          <h3 className="font-bold text-slate-900 dark:text-white">Quotations vs Invoices</h3>
          <p className="text-xs text-slate-500">Monthly comparison</p>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={stats.monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="quotations" name="Quotations" stroke="#3B82F6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="invoices" name="Invoices" stroke="#F59E0B" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="card p-5">
        <div className="mb-4">
          <h3 className="font-bold text-slate-900 dark:text-white">Recent Activity</h3>
          <p className="text-xs text-slate-500">Latest transactions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Number</th>
                <th>Client</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentActivity.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400">No recent activity</td></tr>
              ) : stats.recentActivity.map((a, i) => (
                <tr key={i}>
                  <td className="font-mono text-sm font-medium text-slate-900 dark:text-white">{a.number}</td>
                  <td>{a.client}</td>
                  <td>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${a.type === 'invoice' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                      {a.type === 'invoice' ? '📄 Invoice' : '📋 Quotation'}
                    </span>
                  </td>
                  <td className="font-semibold">{formatCurrency(a.amount)}</td>
                  <td className="text-slate-500">{a.date}</td>
                  <td><Badge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
