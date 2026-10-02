import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Plus, Edit2, Trash2, Clock, MapPin, User, X } from 'lucide-react';
import { AgendaItem } from '../../types';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const AdminAgenda: React.FC = () => {
  const { agendaList, createAgenda, updateAgenda, deleteAgenda, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AgendaItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<AgendaItem, 'id'>>({
    title: '',
    date: new Date().toISOString().substring(0, 10),
    time: '19:30 - 21:30 WIB',
    location: 'Balai Warga RT 001',
    description: '',
    category: 'Rapat RT',
    picName: 'Ketua RT',
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      date: new Date().toISOString().substring(0, 10),
      time: '19:30 - 21:30 WIB',
      location: 'Balai Warga RT 001',
      description: '',
      category: 'Rapat RT',
      picName: 'Ketua RT',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AgendaItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('error', 'Nama agenda kegiatan wajib diisi');
      return;
    }

    if (editingItem) {
      updateAgenda(editingItem.id, formData);
      showToast('success', 'Agenda berhasil diperbarui');
    } else {
      createAgenda(formData);
      showToast('success', 'Agenda baru berhasil dijadwalkan');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
        <div>
          <h2 className="text-base sm:text-xl font-black text-[#333333]">
            Kalender Agenda Pertemuan & Rapat RT
          </h2>
          <p className="text-[11px] text-[#777777]">
            Jadwal kegiatan berkala, musyawarah bersama warga, dan PIC penanggung jawab.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E53935] to-[#FF8F00] text-white font-bold text-xs shadow-xs hover:opacity-95 transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Agenda</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {agendaList.map((item) => (
          <div
            key={item.id}
            className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-300 transition"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-[#FFF8F5] border border-[#F1E1DC] text-[#E53935] text-center shrink-0 min-w-16">
                <Calendar className="w-4 h-4 mx-auto mb-0.5 text-[#E53935]" />
                <span className="text-[10px] font-black block">{item.date.substring(5)}</span>
              </div>

              <div className="space-y-1 min-w-0">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-50 text-[#FF8F00] border border-amber-200 inline-block">
                  {item.category}
                </span>
                <h3 className="font-bold text-xs sm:text-sm text-[#333333] leading-snug">{item.title}</h3>
                <p className="text-[11px] text-[#555555] line-clamp-2">{item.description}</p>
              </div>
            </div>

            <div className="pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F1E1DC] flex flex-wrap sm:flex-col gap-1 text-[11px] text-[#777777] shrink-0 sm:text-right">
              <div className="flex items-center sm:justify-end gap-1 text-[#E53935] font-bold">
                <Clock className="w-3 h-3" />
                <span>{item.time}</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1">
                <MapPin className="w-3 h-3 text-[#FF8F00]" />
                <span className="truncate max-w-[160px]">{item.location}</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1 text-[10px]">
                <User className="w-3 h-3 text-slate-400" />
                <span>PIC: <strong className="text-[#333333]">{item.picName}</strong></span>
              </div>

              <div className="flex items-center sm:justify-end gap-1 pt-1">
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
                {editingItem ? 'Edit Agenda Rapat' : 'Tambah Agenda Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
              <div>
                <label className="block font-bold text-[#333333] mb-0.5">Nama Agenda / Rapat</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Rapat Musyawarah Warga Bulanan"
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
                    placeholder="Contoh: 19:30 - 21:30 WIB"
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
                    <option value="Rapat RT">Rapat RT</option>
                    <option value="Kerja Bakti">Kerja Bakti</option>
                    <option value="Kegiatan Sosial">Kegiatan Sosial</option>
                    <option value="Kegiatan Warga">Kegiatan Warga</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#333333] mb-0.5">PIC / Penanggung Jawab</label>
                  <input
                    type="text"
                    value={formData.picName}
                    onChange={(e) => setFormData({ ...formData, picName: e.target.value })}
                    placeholder="Contoh: Ketua RT"
                    className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#333333] mb-0.5">Lokasi Tempat Pertemuan</label>
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
                <label className="block font-bold text-[#333333] mb-0.5">Uraian Pembahasan</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
        title="Hapus Agenda?"
        message="Agenda ini akan dihapus dari jadwal kegiatan RT."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        isDestructive
        onConfirm={() => {
          if (deleteId) {
            deleteAgenda(deleteId);
            setDeleteId(null);
            showToast('info', 'Agenda dihapus');
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
