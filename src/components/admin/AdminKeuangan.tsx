import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Upload,
  CheckCircle,
  Clock,
  EyeOff,
  FileText,
  X,
} from 'lucide-react';
import { FinancialTransaction, TransactionType, PublicationStatus } from '../../types';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { ReceiptViewerModal } from '../common/ReceiptViewerModal';

export const AdminKeuangan: React.FC = () => {
  const {
    transactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    setTransactionStatus,
    cashStats,
    currentUser,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'PEMASUKAN' | 'PENGELUARAN'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PublicationStatus>('ALL');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTrx, setEditingTrx] = useState<FinancialTransaction | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [previewReceiptTrx, setPreviewReceiptTrx] = useState<FinancialTransaction | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    type: 'PEMASUKAN' as TransactionType,
    date: new Date().toISOString().substring(0, 10),
    category: 'Iuran warga',
    description: '',
    sourceOrRecipient: '',
    amount: '',
    status: 'DIPUBLIKASIKAN' as PublicationStatus,
    receiptName: '',
    receiptUrl: '',
    notes: '',
  });

  const categoriesIncome = [
    'Iuran warga',
    'Sumbangan',
    'Donasi',
    'Bantuan',
    'Pendapatan kegiatan',
    'Lain-lain',
  ];

  const categoriesExpense = [
    'Kebersihan',
    'Keamanan',
    'Kegiatan warga',
    'Sosial',
    'Perawatan fasilitas',
    'Administrasi',
    'Kegiatan keagamaan',
    'Bantuan warga',
    'Listrik',
    'Air',
    'Konsumsi',
    'Lain-lain',
  ];

  const activeCategories = formData.type === 'PEMASUKAN' ? categoriesIncome : categoriesExpense;

  const handleOpenCreate = (initialType: TransactionType = 'PEMASUKAN') => {
    setEditingTrx(null);
    setFormData({
      type: initialType,
      date: new Date().toISOString().substring(0, 10),
      category: initialType === 'PEMASUKAN' ? 'Iuran warga' : 'Keamanan',
      description: '',
      sourceOrRecipient: '',
      amount: '',
      status: 'DIPUBLIKASIKAN',
      receiptName: '',
      receiptUrl: '',
      notes: '',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (trx: FinancialTransaction) => {
    setEditingTrx(trx);
    setFormData({
      type: trx.type,
      date: trx.date,
      category: trx.category,
      description: trx.description,
      sourceOrRecipient: trx.sourceOrRecipient,
      amount: trx.amount.toString(),
      status: trx.status,
      receiptName: trx.receiptName || '',
      receiptUrl: trx.receiptUrl || '',
      notes: trx.notes || '',
    });
    setIsFormOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          receiptName: file.name,
          receiptUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseInt(formData.amount.replace(/[^0-9]/g, ''), 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast('error', 'Nominal harus berupa angka valid di atas Rp 0');
      return;
    }

    if (!formData.description.trim()) {
      showToast('error', 'Keterangan transaksi wajib diisi');
      return;
    }

    if (editingTrx) {
      updateTransaction(editingTrx.id, {
        type: formData.type,
        date: formData.date,
        category: formData.category,
        description: formData.description,
        sourceOrRecipient: formData.sourceOrRecipient,
        amount: parsedAmount,
        status: formData.status,
        receiptName: formData.receiptName,
        receiptUrl: formData.receiptUrl,
        notes: formData.notes,
      });
      showToast('success', 'Transaksi berhasil diperbarui');
    } else {
      createTransaction({
        type: formData.type,
        date: formData.date,
        category: formData.category,
        description: formData.description,
        sourceOrRecipient: formData.sourceOrRecipient || (formData.type === 'PEMASUKAN' ? 'Warga RT 001' : 'Pengurus RT'),
        amount: parsedAmount,
        status: formData.status,
        receiptName: formData.receiptName,
        receiptUrl: formData.receiptUrl,
        notes: formData.notes,
        approvedByKetua: true,
      });
      showToast('success', 'Transaksi baru berhasil dicatat');
    }

    setIsFormOpen(false);
  };

  // Filtered list
  const filteredList = transactions.filter((t) => {
    if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        t.trxNumber.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.sourceOrRecipient.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
        <div>
          <h2 className="text-base sm:text-xl font-black text-[#333333]">
            Pengelolaan Keuangan & Mutasi Kas RT
          </h2>
          <p className="text-[11px] text-[#777777]">
            Mencatat transaksi penerimaan & belanja RT dengan kwitansi bukti sah.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => handleOpenCreate('PEMASUKAN')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#FF8F00] to-[#FFA726] text-white font-bold text-xs shadow-xs hover:opacity-95 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Pemasukan</span>
          </button>
          <button
            onClick={() => handleOpenCreate('PENGELUARAN')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#E53935] to-[#C62828] text-white font-bold text-xs shadow-xs hover:opacity-95 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Pengeluaran</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="relative w-full md:max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari transaksi, no trx, keterangan..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#E53935]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs self-start md:self-auto w-full md:w-auto">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="py-1 px-2.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-lg text-xs font-semibold text-[#333333]"
          >
            <option value="ALL">Semua Jenis</option>
            <option value="PEMASUKAN">Pemasukan (+)</option>
            <option value="PENGELUARAN">Pengeluaran (-)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="py-1 px-2.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-lg text-xs font-semibold text-[#333333]"
          >
            <option value="ALL">Semua Status</option>
            <option value="DIPUBLIKASIKAN">Dipublikasikan</option>
            <option value="DRAFT">Draft</option>
            <option value="DISEMBUNYIKAN">Disembunyikan</option>
          </select>
        </div>
      </div>

      {/* MOBILE LIST VIEW */}
      <div className="block lg:hidden space-y-2">
        {filteredList.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#777777] bg-white rounded-2xl border border-[#F1E1DC]">
            Tidak ada transaksi yang cocok.
          </div>
        ) : (
          filteredList.map((trx) => {
            const isIncome = trx.type === 'PEMASUKAN';
            return (
              <div
                key={trx.id}
                className="p-3 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`p-1.5 rounded-lg ${
                        isIncome ? 'bg-amber-50 text-[#FF8F00]' : 'bg-red-50 text-[#E53935]'
                      }`}
                    >
                      {isIncome ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    </span>
                    <div>
                      <span className="font-mono text-[10px] text-[#777777]">{trx.trxNumber}</span>
                      <div className="text-[10px] text-[#777777]">{trx.date}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-xs font-black ${
                        isIncome ? 'text-[#FF8F00]' : 'text-[#E53935]'
                      }`}
                    >
                      {isIncome ? '+ ' : '- '}Rp {trx.amount.toLocaleString('id-ID')}
                    </div>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        trx.status === 'DIPUBLIKASIKAN'
                          ? 'bg-amber-50 text-[#FF8F00] border border-amber-200'
                          : trx.status === 'DRAFT'
                          ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                          : 'bg-slate-100 text-[#777777]'
                      }`}
                    >
                      {trx.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#333333]">{trx.description}</h4>
                  <div className="text-[10px] text-[#777777] mt-0.5">
                    Kategori: {trx.category} • {isIncome ? `Dari: ${trx.sourceOrRecipient}` : `Ke: ${trx.sourceOrRecipient}`}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F1E1DC] flex items-center justify-between gap-1 text-xs">
                  <div>
                    {trx.receiptUrl ? (
                      <button
                        onClick={() => setPreviewReceiptTrx(trx)}
                        className="text-[11px] font-bold text-[#E53935] hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Bukti
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-300">Tanpa Bukti</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {trx.status === 'DRAFT' ? (
                      <button
                        onClick={() => setTransactionStatus(trx.id, 'DIPUBLIKASIKAN')}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                      >
                        Publikasi
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          setTransactionStatus(
                            trx.id,
                            trx.status === 'DIPUBLIKASIKAN' ? 'DISEMBUNYIKAN' : 'DIPUBLIKASIKAN'
                          )
                        }
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                        title={trx.status === 'DIPUBLIKASIKAN' ? 'Sembunyikan dari Publik' : 'Tampilkan'}
                      >
                        {trx.status === 'DIPUBLIKASIKAN' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenEdit(trx)}
                      className="p-1 text-slate-500 hover:text-[#333333] rounded-lg"
                      title="Edit Transaksi"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(trx.id)}
                      className="p-1 text-rose-500 hover:text-rose-700 rounded-lg"
                      title="Hapus Transaksi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block bg-white rounded-2xl border border-[#F1E1DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF8F5] border-b border-[#F1E1DC] text-[#777777] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Tanggal & No. Trx</th>
                <th className="py-2.5 px-3">Jenis</th>
                <th className="py-2.5 px-3">Kategori & Uraian</th>
                <th className="py-2.5 px-3">Pihak Terkait</th>
                <th className="py-2.5 px-3 text-right">Nominal (Rp)</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-center">Bukti</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1E1DC]/60">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Tidak ada transaksi yang cocok.
                  </td>
                </tr>
              ) : (
                filteredList.map((trx) => {
                  const isIncome = trx.type === 'PEMASUKAN';
                  return (
                    <tr key={trx.id} className="hover:bg-[#FFF8F5]/60 transition">
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="font-bold text-[#333333]">{trx.date}</div>
                        <div className="text-[10px] font-mono text-[#777777]">{trx.trxNumber}</div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            isIncome ? 'bg-amber-50 text-[#FF8F00] border border-amber-200' : 'bg-red-50 text-[#E53935] border border-red-200'
                          }`}
                        >
                          {trx.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-[#333333] max-w-xs truncate">{trx.description}</div>
                        <div className="text-[10px] text-[#777777]">{trx.category}</div>
                      </td>
                      <td className="py-2.5 px-3 text-[#555555] max-w-[150px] truncate">
                        {trx.sourceOrRecipient}
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div
                          className={`font-black ${
                            isIncome ? 'text-[#FF8F00]' : 'text-[#E53935]'
                          }`}
                        >
                          {isIncome ? '+ ' : '- '}Rp {trx.amount.toLocaleString('id-ID')}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            trx.status === 'DIPUBLIKASIKAN'
                              ? 'bg-amber-50 text-[#FF8F00] border border-amber-200'
                              : trx.status === 'DRAFT'
                              ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                              : 'bg-slate-100 text-[#777777]'
                          }`}
                        >
                          {trx.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        {trx.receiptUrl ? (
                          <button
                            onClick={() => setPreviewReceiptTrx(trx)}
                            className="p-1 text-[#E53935] hover:bg-red-50 rounded transition"
                            title="Lihat Bukti Kwitansi"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-slate-300 text-xs">-</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(trx)}
                            className="p-1.5 text-slate-600 hover:text-[#333333] hover:bg-slate-100 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(trx.id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORM MODAL (TAMBAH / EDIT TRANSAKSI) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/50 backdrop-blur-xs no-print">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#F1E1DC] shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1E1DC]">
              <h3 className="text-sm font-extrabold text-[#333333]">
                {editingTrx ? 'Edit Mutasi Kas RT' : 'Catat Mutasi Kas Baru'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              {/* Jenis Transaksi */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'PEMASUKAN' })}
                  className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    formData.type === 'PEMASUKAN'
                      ? 'bg-[#FF8F00] text-white shadow-xs'
                      : 'bg-[#FFF8F5] text-[#777777] border border-[#F1E1DC]'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Pemasukan (+)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'PENGELUARAN' })}
                  className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    formData.type === 'PENGELUARAN'
                      ? 'bg-[#E53935] text-white shadow-xs'
                      : 'bg-[#FFF8F5] text-[#777777] border border-[#F1E1DC]'
                  }`}
                >
                  <ArrowDownRight className="w-4 h-4" />
                  <span>Pengeluaran (-)</span>
                </button>
              </div>

              {/* Tanggal & Nominal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-[#333333] mb-1">Tanggal Transaksi</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#333333] mb-1">Nominal (Rp)</label>
                  <input
                    type="text"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="Contoh: 150000"
                    className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs font-bold text-[#333333]"
                    required
                  />
                </div>
              </div>

              {/* Kategori */}
              <div>
                <label className="block font-bold text-[#333333] mb-1">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs font-semibold"
                >
                  {activeCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Uraian Keterangan */}
              <div>
                <label className="block font-bold text-[#333333] mb-1">Keterangan / Uraian</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Contoh: Pembelian bola lampu pos ronda blok B"
                  className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                  required
                />
              </div>

              {/* Sumber / Penerima */}
              <div>
                <label className="block font-bold text-[#333333] mb-1">
                  {formData.type === 'PEMASUKAN' ? 'Sumber Pemasukan' : 'Penerima / Toko / Vendor'}
                </label>
                <input
                  type="text"
                  value={formData.sourceOrRecipient}
                  onChange={(e) => setFormData({ ...formData, sourceOrRecipient: e.target.value })}
                  placeholder="Contoh: Toko Listrik Sejahtera"
                  className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                />
              </div>

              {/* Status Publikasi */}
              <div>
                <label className="block font-bold text-[#333333] mb-1">Status Publikasi ke Warga</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs font-semibold"
                >
                  <option value="DIPUBLIKASIKAN">Dipublikasikan (Warga dapat melihat langsung)</option>
                  <option value="DRAFT">Draft (Perlu verifikasi pengurus)</option>
                  <option value="DISEMBUNYIKAN">Disembunyikan</option>
                </select>
              </div>

              {/* Upload Bukti */}
              <div>
                <label className="block font-bold text-[#333333] mb-1">Kwitansi / Bukti Nota</label>
                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 rounded-xl bg-[#FFF8F5] hover:bg-orange-50 border border-[#F1E1DC] text-[#E53935] font-bold text-xs flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Bukti</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-[#777777] truncate">
                    {formData.receiptName || 'Belum ada file dipilih'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#F1E1DC] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#F1E1DC] text-[#777777] hover:bg-slate-50 font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E53935] to-[#FF8F00] text-white font-bold text-xs shadow-xs hover:opacity-95 transition cursor-pointer"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog Delete */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        title="Hapus Transaksi Kas?"
        message="Apakah Anda yakin ingin menghapus data transaksi kas ini? Tindakan ini akan dicatat dalam audit log sistem."
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        isDestructive
        onConfirm={() => {
          if (deleteConfirmId) {
            deleteTransaction(deleteConfirmId);
            setDeleteConfirmId(null);
            showToast('info', 'Transaksi berhasil dihapus');
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />

      {/* Receipt Viewer Modal */}
      <ReceiptViewerModal
        transaction={previewReceiptTrx}
        onClose={() => setPreviewReceiptTrx(null)}
      />
    </div>
  );
};
