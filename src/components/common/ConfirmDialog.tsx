import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title = 'Konfirmasi Penghapusan',
  message = 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
  confirmLabel = 'Ya, Hapus Data',
  cancelLabel = 'Batal',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/50 backdrop-blur-xs no-print">
      <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full overflow-hidden p-5 border border-[#F1E1DC] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-2xl shrink-0 ${isDestructive ? 'bg-red-100 text-[#E53935]' : 'bg-amber-100 text-[#FF8F00]'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#333333]">{title}</h3>
            <p className="text-xs text-[#777777] mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-[#F1E1DC]">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 text-xs font-bold text-[#555555] bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl hover:bg-slate-100 transition"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition ${
              isDestructive
                ? 'bg-[#E53935] hover:bg-[#C62828]'
                : 'bg-[#FF8F00] hover:bg-[#FF8F00]/90'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
