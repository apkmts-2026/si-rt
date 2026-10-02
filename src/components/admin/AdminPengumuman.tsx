import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Megaphone, Plus, Edit2, Trash2, Pin, Calendar, X } from 'lucide-react';
import { Pengumuman } from '../../types';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const AdminPengumuman: React.FC = () => {
  const { pengumumanList, createPengumuman, updatePengumuman, deletePengumuman, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Pengumuman | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Pengumuman, 'id'>>({
    title: '',
    category: 'Himbauan',
    date: new Date().toISOString().substring(0, 10),
    content: '',
    isPinned: false,
    isActive: true,
    attachmentName: '',
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'Himbauan',
      date: new Date().toISOString().substring(0, 10),
      content: '',
      isPinned: false,
      isActive: true,
      attachmentName: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Pengumuman) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('error', 'Judul pengumuman wajib diisi');
      return;
    }

    if (editingItem) {
      updatePengumuman(editingItem.id, formData);
      showToast('success', 'Pengumuman diperbarui');
    } else {
      createPengumuman(formData);
      showToast('success', 'Pengumuman baru diterbitkan');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
        <div>
          <h2 className="text-base sm:text-xl font-black text-[#333333]">
            Pengumuman & Surat Edaran RT
          </h2>
          <p className="text-[11px] text-[#777777]">
            Publikasikan surat resmi, himbauan keamanan, dan informasi ke warga.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E53935] to-[#FF8F00] text-white font-bold text-xs shadow-xs hover:opacity-95 transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Pengumuman</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {pengumumanList.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 sm:p-4 rounded-2xl border transition shadow-xs ${
              item.isPinned
                ? 'bg-orange-50/40 border-amber-300'
                : 'bg-white border-[#F1E1DC]'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-50 text-[#FF8F00] border border-amber-200">
                  {item.category}
                </span>
                {item.isPinned && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#E53935]">
                    <Pin className="w-2.5 h-2.5 rotate-45" /> Disematkan
                  </span>
                )}
                {!item.isActive && (
                  <span className="text-[9px] font-bold text-slate-400">Arsip</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#777777] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#FF8F00]" /> {item.date}
                </span>

                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1 rounded-lg text-slate-500 hover:text-[#333333]"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="p-1 rounded-lg text-rose-500 hover:text-rose-700"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-xs sm:text-sm text-[#333333] mb-1">{item.title}</h3>
            <p className="text-[11px] text-[#555555] leading-relaxed line-clamp-2">{item.content}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/50 backdrop-blur-xs no-print">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-[#F1E1DC] shadow-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1E1DC]">
              <h3 className="font-extrabold text-[#333333] text-sm">
                {editingItem ? 'Edit Pengumuman' : 'Terbitkan Pengumuman'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
              <div>
                <label className="block font-bold text-[#333333] mb-0.5">Judul Pengumuman</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Jadwal Fogging Nyamuk DBD"
                  className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#333333] mb-0.5">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs font-semibold"
                  >
                    <option value="Himbauan">Himbauan</option>
                    <option value="Pemberitahuan">Pemberitahuan</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Darurat">Darurat</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#333333] mb-0.5">Tanggal</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#333333] mb-0.5">Isi Pengumuman</label>
                <textarea
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Tuliskan isi pengumuman lengkap..."
                  className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#333333] mb-0.5">Nama Lampiran (Opsional)</label>
                <input
                  type="text"
                  value={formData.attachmentName || ''}
                  onChange={(e) => setFormData({ ...formData, attachmentName: e.target.value })}
                  placeholder="Contoh: Surat-Edaran-01-2026.pdf"
                  className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 font-bold text-[#333333] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPinned}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                    className="rounded text-[#E53935]"
                  />
                  <span>Sematkan di Atas (Pin)</span>
                </label>

                <label className="flex items-center gap-1.5 font-bold text-[#333333] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-[#FF8F00]"
                  />
                  <span>Tampilkan di Publik</span>
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
        title="Hapus Pengumuman?"
        message="Pengumuman ini tidak akan ditampilkan lagi kepada warga."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        isDestructive
        onConfirm={() => {
          if (deleteId) {
            deletePengumuman(deleteId);
            setDeleteId(null);
            showToast('info', 'Pengumuman dihapus');
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
