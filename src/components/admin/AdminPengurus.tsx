import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit2, Trash2, Phone, X } from 'lucide-react';
import { Pengurus } from '../../types';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const AdminPengurus: React.FC = () => {
  const { pengurusList, createPengurus, updatePengurus, deletePengurus, settings, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Pengurus | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Pengurus, 'id'>>({
    name: '',
    roleTitle: 'Seksi Lingkungan Hidup',
    phone: '0812-3456-7890',
    period: settings.period,
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      roleTitle: 'Seksi Pemuda & Olahraga',
      phone: '0812-0000-1111',
      period: settings.period,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Pengurus) => {
    setEditingItem(p);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('error', 'Nama pengurus wajib diisi');
      return;
    }

    if (editingItem) {
      updatePengurus(editingItem.id, formData);
      showToast('success', 'Data pengurus diperbarui');
    } else {
      createPengurus(formData);
      showToast('success', 'Pengurus baru ditambahkan');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
        <div>
          <h2 className="text-base sm:text-xl font-black text-[#333333]">
            Susunan Pengurus Lingkungan RT
          </h2>
          <p className="text-[11px] text-[#777777]">
            Daftar pengurus resmi periode masa bakti {settings.period}.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E53935] to-[#FF8F00] text-white font-bold text-xs shadow-xs hover:opacity-95 transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengurus</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {pengurusList.map((p) => (
          <div
            key={p.id}
            className="p-3.5 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs flex flex-col justify-between space-y-2.5"
          >
            <div>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-[#FF8F00] border border-amber-200 uppercase">
                {p.roleTitle}
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-[#333333] mt-1.5">{p.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-[#777777] mt-1">
                <Phone className="w-3.5 h-3.5 text-[#E53935]" />
                <span>{p.phone}</span>
              </div>
              <div className="text-[10px] text-[#777777] mt-0.5">Periode: {p.period}</div>
            </div>

            <div className="pt-2 border-t border-[#F1E1DC] flex items-center justify-end gap-1">
              <button
                onClick={() => handleOpenEdit(p)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeleteId(p.id)}
                className="p-1 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer"
                title="Hapus"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/50 backdrop-blur-xs no-print">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-[#F1E1DC] shadow-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1E1DC]">
              <h3 className="font-extrabold text-[#333333] text-sm">
                {editingItem ? 'Edit Data Pengurus' : 'Tambah Pengurus RT'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
              <div>
                <label className="block font-bold text-[#333333] mb-0.5">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#333333] mb-0.5">Jabatan / Seksi</label>
                <input
                  type="text"
                  value={formData.roleTitle}
                  onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                  placeholder="Contoh: Sie Keamanan & Ketertiban"
                  className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#333333] mb-0.5">Nomor WhatsApp / HP</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                  required
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
        title="Hapus Data Pengurus?"
        message="Pengurus yang dihapus tidak akan ditampilkan lagi pada daftar resmi."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        isDestructive
        onConfirm={() => {
          if (deleteId) {
            deletePengurus(deleteId);
            setDeleteId(null);
            showToast('info', 'Data pengurus dihapus');
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
