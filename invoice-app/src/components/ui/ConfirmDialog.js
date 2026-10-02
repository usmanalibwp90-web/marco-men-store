'use client';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Confirm Action', message = 'Are you sure?' }) {
  return (
    <Modal open={open} onClose={onClose} title=" " size="sm">
      <div className="text-center py-2">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="btn btn-outline px-6">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="btn btn-danger px-6">
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
