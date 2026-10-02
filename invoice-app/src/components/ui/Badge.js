'use client';

const configs = {
  paid: { cls: 'badge-paid', label: 'Paid' },
  unpaid: { cls: 'badge-unpaid', label: 'Unpaid' },
  partially_paid: { cls: 'badge-partial', label: 'Partial' },
  draft: { cls: 'badge-draft', label: 'Draft' },
  confirmed: { cls: 'badge-confirmed', label: 'Confirmed' },
  cancelled: { cls: 'badge-unpaid', label: 'Cancelled' },
};

export default function Badge({ status, custom }) {
  const cfg = configs[status] || { cls: 'badge-draft', label: status || '' };
  return (
    <span className={`badge ${cfg.cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {custom || cfg.label}
    </span>
  );
}
