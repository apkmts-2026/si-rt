import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Plus, Edit2, Trash2, MapPin, Clock, X } from 'lucide-react';
import { Kegiatan } from '../../types';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const AdminKegiatan: React.FC = () => {
  const { kegiatanList, createKegiatan, updateKegiatan, deleteKegiatan, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Kegiatan | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Kegiatan, 'id'>>({
    title: '',
    date: new Date().toISOString().substring(0, 10),
    time: '08:00 - 11:00 WIB',
    location: 'Balai Warga RT 001',
    description: '',
    photoUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
    status: 'Akan Datang',
    category: 'Kerja Bakti',
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      date: new Date().toISOString().substring(0, 10),
      time: '08:00 - 11:00 WIB',
      location: 'Lingkungan RT 001',
      description: '',
      photoUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
      status: 'Akan Datang',
      category: 'Kerja Bakti',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Kegiatan) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('error', 'Judul kegiatan wajib diisi');
      return;
    }

    if (editingItem) {
      updateKegiatan(editingItem.id, formData);
      showToast('success', 'Kegiatan diperbarui');
    } else {
      createKegiatan(formData);
      showToast('success', 'Kegiatan baru berhasil dipublikasikan');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
        <div>
          <h2 className="text-base sm:text-xl font-black text-[#333333]">
            Kelola Kegiatan Lingkungan RT
          </h2>
          <p className="text-[11px] text-[#777777]">
            Publikasikan kerja bakti, posyandu, perayaan warga, dan olahraga lingkungan.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E53935] to-[#FF8F00] text-white font-bold text-xs shadow-xs hover:opacity-95 transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kegiatan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {kegiatanList.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-[#F1E1DC] bg-white overflow-hidden shadow-xs flex flex-col justify-between"
          >
            {item.photoUrl && (
              <img src={item.photoUrl} alt={item.title} className="w-full h-32 object-cover" />
            )}
            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between text-[9px] font-bold uppercase mb-1">
                  <span className="text-[#FF8F00]">{item.category}</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-50 text-[#FF8F00] border border-amber-200">
                    {item.status}
                  </span>
                </div>
                <h3 className="font-bold text-[#333333] text-xs sm:text-sm leading-snug">{item.title}</h3>
                <p className="text-[11px] text-[#777777] mt-1 line-clamp-2">{item.description}</p>
              </div>

              <div className="pt-2 border-t border-[#F1E1DC] space-y-1 text-[11px] text-[#777777]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-[#E53935]" />
                  <span>{item.date} • {item.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#FF8F00]" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F1E1DC] flex items-center justify-end gap-1">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="p-1 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer"
                  title="Hapus"
                >
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
                {editingItem ? 'Edit Kegiatan RT' : 'Tambah Kegiatan Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
              <div>
                <label className="block font-bold text-[#333333] mb-0.5">Judul Kegiatan</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Kerja Bakti Massal Sambut HUT RI"
                  className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
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
                <div>
                  <label className="block font-bold text-[#333333] mb-0.5">Waktu</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="Contoh: 08:00 - 11:00 WIB"
                    className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#333333] mb-0.5">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs font-semibold"
                  >
                    <option value="Kerja Bakti">Kerja Bakti</option>
                    <option value="Rapat">Rapat</option>
                    <option value="Sosial">Sosial</option>
                    <option value="Keagamaan">Keagamaan</option>
                    <option value="Posyandu">Posyandu</option>
                    <option value="17 Agustus">17 Agustus</option>
                    <option value="Olahraga">Olahraga</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#333333] mb-0.5">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs font-semibold"
                  >
                    <option value="Akan Datang">Akan Datang</option>
                    <option value="Sedang Berlangsung">Sedang Berlangsung</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#333333] mb-0.5">Lokasi Pelaksanaan</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Contoh: Balai Warga RT 001"
                  className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#333333] mb-0.5">Keterangan Kegiatan</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#333333] mb-0.5">URL Foto Dokumentasi</label>
                <input
                  type="text"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                />
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
        title="Hapus Kegiatan?"
        message="Kegiatan ini akan dihapus dari publikasi warga."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        isDestructive
        onConfirm={() => {
          if (deleteId) {
            deleteKegiatan(deleteId);
            setDeleteId(null);
            showToast('info', 'Kegiatan dihapus');
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
