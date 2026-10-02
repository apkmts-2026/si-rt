import React from 'react';
import { FinancialTransaction } from '../../types';
import { X, Download, FileText, Calendar, Tag, UserCheck, ShieldCheck } from 'lucide-react';

interface ReceiptViewerModalProps {
  transaction: FinancialTransaction | null;
  onClose: () => void;
}

export const ReceiptViewerModal: React.FC<ReceiptViewerModalProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const isIncome = transaction.type === 'PEMASUKAN';

  const handleDownload = () => {
    if (transaction.receiptUrl) {
      window.open(transaction.receiptUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/50 backdrop-blur-xs no-print">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm sm:max-w-md w-full overflow-hidden flex flex-col max-h-[90vh] border border-[#F1E1DC] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#F1E1DC] bg-[#FFF8F5]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-100 text-[#E53935]">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-extrabold text-[#333333] text-sm">Bukti Transaksi Keuangan</h3>
              <p className="text-[10px] text-[#777777] font-mono">{transaction.trxNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3 text-xs">
          {/* Summary Box */}
          <div className={`p-3.5 rounded-2xl border ${isIncome ? 'bg-amber-50/70 border-amber-200 text-amber-950' : 'bg-red-50/70 border-red-200 text-red-950'}`}>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-0.5">
              {isIncome ? 'Pemasukan Kas' : 'Pengeluaran Kas'}
            </div>
            <div className="text-xl font-black">
              {isIncome ? '+ ' : '- '} Rp {transaction.amount.toLocaleString('id-ID')}
            </div>
            <p className="text-xs font-semibold mt-1 text-[#333333]">{transaction.description}</p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-xl bg-[#FFF8F5] border border-[#F1E1DC]">
              <div className="text-[#777777] flex items-center gap-1 mb-0.5">
                <Calendar className="w-3 h-3 text-[#E53935]" /> Tanggal
              </div>
              <div className="font-bold text-[#333333]">{transaction.date}</div>
            </div>
            <div className="p-2 rounded-xl bg-[#FFF8F5] border border-[#F1E1DC]">
              <div className="text-[#777777] flex items-center gap-1 mb-0.5">
                <Tag className="w-3 h-3 text-[#FF8F00]" /> Kategori
              </div>
              <div className="font-bold text-[#333333]">{transaction.category}</div>
            </div>
            <div className="p-2 rounded-xl bg-[#FFF8F5] border border-[#F1E1DC] col-span-2">
              <div className="text-[#777777] flex items-center gap-1 mb-0.5">
                <UserCheck className="w-3 h-3 text-[#E53935]" /> {isIncome ? 'Sumber Dana' : 'Penerima'}
              </div>
              <div className="font-bold text-[#333333]">{transaction.sourceOrRecipient}</div>
            </div>
          </div>

          {/* Receipt Image / Document Preview */}
          <div className="border border-[#F1E1DC] rounded-2xl overflow-hidden bg-slate-50 p-2 text-center">
            {transaction.receiptUrl ? (
              <div>
                <img
                  src={transaction.receiptUrl}
                  alt={transaction.receiptName || 'Bukti Transaksi'}
                  className="w-full max-h-56 object-contain rounded-xl bg-white shadow-xs mx-auto"
                />
                <div className="mt-1 text-[10px] text-[#777777] font-mono">
                  {transaction.receiptName || 'Lampiran Bukti Transaksi'}
                </div>
              </div>
            ) : (
              <div className="py-8 text-[#777777] text-xs flex flex-col items-center gap-1">
                <FileText className="w-8 h-8 text-slate-300" />
                <span>Bukti kwitansi fisik tersimpan di buku kas bendahara RT.</span>
              </div>
            )}
          </div>

          {/* Verification Badge */}
          <div className="flex items-center gap-2 text-[11px] text-[#C62828] bg-red-50/80 px-3 py-2 rounded-xl border border-red-100">
            <ShieldCheck className="w-4 h-4 text-[#E53935] shrink-0" />
            <span>
              Diverifikasi oleh <strong>{transaction.createdByName || 'Bendahara RT'}</strong>
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#F1E1DC] bg-[#FFF8F5]">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-bold text-[#555555] hover:text-[#333333]"
          >
            Tutup
          </button>
          {transaction.receiptUrl && (
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#E53935] to-[#FF8F00] rounded-xl shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" /> Buka Berkas
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
