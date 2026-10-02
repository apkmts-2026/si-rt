import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HeartHandshake, Plus, Edit2, Trash2, X } from 'lucide-react';
import { DonasiCampaign } from '../../types';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const AdminDonasi: React.FC = () => {
  const { donasiList, createDonasi, updateDonasi, deleteDonasi, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DonasiCampaign | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<DonasiCampaign, 'id'>>({
    title: '',
    description: '',
    targetAmount: 5000000,
    collectedAmount: 0,
    usedAmount: 0,
    startDate: new Date().toISOString().substring(0, 10),
    endDate: '',
    isActive: true,
    donorCount: 0,
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      targetAmount: 5000000,
      collectedAmount: 0,
      usedAmount: 0,
      startDate: new Date().toISOString().substring(0, 10),
      endDate: '',
      isActive: true,
      donorCount: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: DonasiCampaign) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('error', 'Nama program donasi wajib diisi');
      return;
    }

    if (editingItem) {
      updateDonasi(editingItem.id, formData);
      showToast('success', 'Program donasi diperbarui');
    } else {
      createDonasi(formData);
      showToast('success', 'Program donasi baru dibuat');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
        <div>
          <h2 className="text-base sm:text-xl font-black text-[#333333]">
            Kelola Program Donasi Swadaya
          </h2>
          <p className="text-[11px] text-[#777777]">
            Penggalangan dana sukarela untuk pengadaan sarana RT dan santunan sosial warga.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E53935] to-[#FF8F00] text-white font-bold text-xs shadow-xs hover:opacity-95 transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Program Donasi</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {donasiList.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs flex flex-col justify-between space-y-2.5"
          >
            <div>
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${item.isActive ? 'bg-amber-50 text-[#FF8F00] border border-amber-200' : 'bg-slate-100 text-[#777777]'}`}>
                  {item.isActive ? 'Sedang Berjalan' : 'Selesai'}
                </span>
                <span className="text-[10px] text-[#777777]">{item.startDate}</span>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-[#333333]">{item.title}</h3>
              <p className="text-[11px] text-[#777777] mt-0.5 line-clamp-2">{item.description}</p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#F1E1DC] text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-[#777777]">Target: Rp {item.targetAmount.toLocaleString('id-ID')}</span>
                <span className="text-[#FF8F00] font-bold">
                  Terkumpul: Rp {item.collectedAmount.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-[#777777] text-[10px]">
                <span>Terpakai: Rp {item.usedAmount.toLocaleString('id-ID')}</span>
                <span className="text-[#E53935] font-bold">
                  Sisa: Rp {(item.collectedAmount - item.usedAmount).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F1E1DC] text-xs">
              <span className="text-[10px] text-[#777777]">{item.donorCount} Donatur Warga</span>
              <div className="flex items-center gap-1">
                <button onClick={() => handleOpenEdit(item)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setDeleteId(item.id)} className="p-1 hover:bg-rose-50 rounded-lg text-rose-600 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/50 backdrop-blur-xs no-print">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-[#F1E1DC] shadow-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1E1DC]">
              <h3 className="font-extrabold text-[#333333] text-sm">
                {editingItem ? 'Edit Program Donasi' : 'Buat Program Donasi Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
              <div>
                <label className="block font-bold text-[#333333] mb-0.5">Nama Program Donasi</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Pengadaan Tenda & Sound System RT"
                  className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#333333] mb-0.5">Target Dana (Rp)</label>
                  <input
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#333333] mb-0.5">Terkumpul (Rp)</label>
                  <input
                    type="number"
                    value={formData.collectedAmount}
                    onChange={(e) => setFormData({ ...formData, collectedAmount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#333333] mb-0.5">Dana Digunakan (Rp)</label>
                  <input
                    type="number"
                    value={formData.usedAmount}
                    onChange={(e) => setFormData({ ...formData, usedAmount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#333333] mb-0.5">Jumlah Donatur</label>
                  <input
                    type="number"
                    value={formData.donorCount}
                    onChange={(e) => setFormData({ ...formData, donorCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#333333] mb-0.5">Deskripsi Program</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="donasiActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-[#E53935]"
                />
                <label htmlFor="donasiActive" className="font-bold text-[#333333] cursor-pointer">
                  Status Aktif (Terbuka untuk Donasi)
                </label>
              </div>

              <div className="pt-2 border-t border-[#F1E1DC] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-[#F1E1DC] text-[#777777]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#E53935] to-[#FF8F00] text-white font-bold"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Hapus Program Donasi?"
        message="Program donasi ini akan dihapus dari data RT."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        isDestructive
        onConfirm={() => {
          if (deleteId) {
            deleteDonasi(deleteId);
            setDeleteId(null);
            showToast('info', 'Program donasi dihapus');
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
