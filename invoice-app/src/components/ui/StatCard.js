'use client';

export default function StatCard({ title, value, subtitle, icon: Icon, gradient, change }) {
  return (
    <div className={`rounded-2xl p-5 text-white ${gradient} shadow-lg relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute right-0 top-0 w-24 h-24 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(30%,-30%)' }} />
      <div className="absolute right-4 bottom-0 w-16 h-16 rounded-full opacity-10" style={{ background: 'white', transform: 'translateY(40%)' }} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Icon size={20} className="text-white" />
          </div>
          {change !== undefined && (
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${change >= 0 ? 'bg-white/20' : 'bg-white/20'}`}>
              {change >= 0 ? '+' : ''}{change}%
            </span>
          )}
        </div>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className="text-sm font-medium opacity-90">{title}</div>
        {subtitle && <div className="text-xs opacity-70 mt-1">{subtitle}</div>}
      </div>
    </div>
  );
}
