import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit2, Trash2, UserCheck, UserX, X } from 'lucide-react';
import { User, UserRole } from '../../types';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const AdminUsers: React.FC = () => {
  const { users, createUser, updateUser, deleteUser, currentUser, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<(User & { passwordHash: string }) | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    role: 'BENDAHARA' as UserRole,
    email: '',
    phone: '',
    isActive: true,
    password: '',
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      name: '',
      role: 'BENDAHARA',
      email: '',
      phone: '',
      isActive: true,
      password: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: User & { passwordHash: string }) => {
    setEditingUser(u);
    setFormData({
      username: u.username,
      name: u.name,
      role: u.role,
      email: u.email || '',
      phone: u.phone || '',
      isActive: u.isActive,
      password: u.passwordHash,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.name.trim() || !formData.password) {
      showToast('error', 'Harap lengkapi username, nama, dan password');
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, {
        username: formData.username,
        name: formData.name,
        role: formData.role,
        email: formData.email,
        phone: formData.phone,
        isActive: formData.isActive,
        passwordHash: formData.password,
      });
      showToast('success', 'Akun pengelola berhasil diperbarui');
    } else {
      createUser({
        username: formData.username.toLowerCase(),
        name: formData.name,
        role: formData.role,
        email: formData.email,
        phone: formData.phone,
        isActive: formData.isActive,
        passwordHash: formData.password,
      });
      showToast('success', 'Akun pengelola baru berhasil dibuat');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
        <div>
          <h2 className="text-base sm:text-xl font-black text-[#333333]">
            Manajemen Akun Pengelola
          </h2>
          <p className="text-[11px] text-[#777777]">
            Kelola hak akses untuk Admin, Ketua RT, dan Bendahara.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E53935] to-[#FF8F00] text-white font-bold text-xs shadow-xs hover:opacity-95 transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Akun</span>
        </button>
      </div>

      {/* Mobile Card List */}
      <div className="block lg:hidden space-y-2">
        {users.map((u) => (
          <div
            key={u.id}
            className="p-3 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-[#333333] text-xs">{u.name}</h4>
                <div className="font-mono text-[10px] text-[#777777]">@{u.username}</div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                  u.role === 'ADMIN'
                    ? 'bg-red-50 text-[#E53935] border border-red-200'
                    : u.role === 'KETUA_RT'
                    ? 'bg-amber-50 text-[#FF8F00] border border-amber-200'
                    : 'bg-orange-50 text-[#FFA726] border border-orange-200'
                }`}
              >
                {u.role}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1.5 border-t border-[#F1E1DC] text-[10px] text-[#777777]">
              <span>Status: <strong className={u.isActive ? 'text-[#FF8F00]' : 'text-slate-400'}>{u.isActive ? 'Aktif' : 'Nonaktif'}</strong></span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(u as any)}
                  className="p-1 text-slate-500 hover:text-[#333333] rounded"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {u.id !== currentUser?.id && (
                  <button
                    onClick={() => setDeleteId(u.id)}
                    className="p-1 text-rose-500 hover:text-rose-700 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-2xl border border-[#F1E1DC] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FFF8F5] border-b border-[#F1E1DC] text-[#777777] font-bold uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-3">Nama & Username</th>
              <th className="py-2.5 px-3">Role / Peran</th>
              <th className="py-2.5 px-3">Kontak</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1E1DC]/60">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-[#FFF8F5]/60 transition">
                <td className="py-2.5 px-3">
                  <div className="font-bold text-[#333333]">{u.name}</div>
                  <div className="font-mono text-[10px] text-[#777777]">@{u.username}</div>
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      u.role === 'ADMIN'
                        ? 'bg-red-50 text-[#E53935] border border-red-200'
                        : u.role === 'KETUA_RT'
                        ? 'bg-amber-50 text-[#FF8F00] border border-amber-200'
                        : 'bg-orange-50 text-[#FFA726] border border-orange-200'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-[#555555]">
                  <div>{u.email || '-'}</div>
                  <div className="text-[10px] text-[#777777]">{u.phone || '-'}</div>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <button
                    onClick={() => updateUser(u.id, { isActive: !u.isActive })}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                      u.isActive ? 'bg-amber-50 text-[#FF8F00]' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {u.isActive ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                    <span>{u.isActive ? 'Aktif' : 'Nonaktif'}</span>
                  </button>
                </td>
                <td className="py-2.5 px-3 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleOpenEdit(u as any)}
                      className="p-1 rounded text-slate-600 hover:text-[#333333]"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {u.id !== currentUser?.id && (
                      <button
                        onClick={() => setDeleteId(u.id)}
                        className="p-1 rounded text-rose-500 hover:text-rose-700"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/50 backdrop-blur-xs no-print">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-[#F1E1DC] shadow-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1E1DC]">
              <h3 className="font-extrabold text-[#333333] text-sm">
                {editingUser ? 'Edit Akun Pengelola' : 'Tambah Akun Baru'}
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
                  placeholder="Nama pengelola"
                  className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#333333] mb-0.5">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Contoh: bendahara_rt"
                  className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#333333] mb-0.5">Role / Hak Akses</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs font-semibold"
                >
                  <option value="BENDAHARA">Bendahara (Kas, Keuangan & Iuran)</option>
                  <option value="KETUA_RT">Ketua RT (Semua Akses Operasional)</option>
                  <option value="ADMIN">Administrator (Hak Akses Penuh Sistem)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#333333] mb-0.5">Password</label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Kata sandi akun"
                  className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs font-mono"
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
        title="Hapus Akun Pengelola?"
        message="Akun yang dihapus tidak akan dapat login lagi ke sistem."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        isDestructive
        onConfirm={() => {
          if (deleteId) {
            deleteUser(deleteId);
            setDeleteId(null);
            showToast('info', 'Akun pengelola dihapus');
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
