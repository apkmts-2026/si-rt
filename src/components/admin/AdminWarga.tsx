import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Plus,
  Search,
  Download,
  Upload,
  Edit2,
  Trash2,
  Home,
  X,
} from 'lucide-react';
import { Warga } from '../../types';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const AdminWarga: React.FC = () => {
  const { wargaList, createWarga, updateWarga, deleteWarga, importWargaBatch, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterBlock, setFilterBlock] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarga, setEditingWarga] = useState<Warga | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Warga, 'id'>>({
    noKk: '',
    nik: '',
    name: '',
    gender: 'L',
    birthDate: '1990-01-01',
    ageGroup: 'DEWASA',
    occupation: '',
    phone: '',
    addressBlock: 'Blok A1 No. 01',
    isHeadOfFamily: false,
    statusKeluarga: 'Kepala Keluarga',
    religion: 'Islam',
  });

  const handleOpenAdd = () => {
    setEditingWarga(null);
    setFormData({
      noKk: '3276011203000008',
      nik: '3276011203900008',
      name: '',
      gender: 'L',
      birthDate: '1990-01-01',
      ageGroup: 'DEWASA',
      occupation: 'Karyawan Swasta',
      phone: '08123456789',
      addressBlock: 'Blok A1 No. 08',
      isHeadOfFamily: true,
      statusKeluarga: 'Kepala Keluarga',
      religion: 'Islam',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (w: Warga) => {
    setEditingWarga(w);
    setFormData({ ...w });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('error', 'Nama warga wajib diisi');
      return;
    }

    if (editingWarga) {
      updateWarga(editingWarga.id, formData);
      showToast('success', 'Data warga berhasil diperbarui');
    } else {
      createWarga(formData);
      showToast('success', 'Warga baru berhasil ditambahkan');
    }
    setIsModalOpen(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['No KK', 'NIK', 'Nama Lengkap', 'Jenis Kelamin', 'Tgl Lahir', 'Kelompok Usia', 'Pekerjaan', 'No HP', 'Blok Rumah', 'Status Keluarga', 'Agama'];
    const rows = wargaList.map((w) => [
      `"${w.noKk}"`,
      `"${w.nik}"`,
      `"${w.name}"`,
      w.gender,
      w.birthDate,
      w.ageGroup,
      `"${w.occupation}"`,
      `"${w.phone || ''}"`,
      `"${w.addressBlock}"`,
      `"${w.statusKeluarga}"`,
      `"${w.religion}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `data-warga-rt-${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Data warga berhasil diexport ke CSV');
  };

  // Import CSV
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const lines = text.split('\n').filter((l) => l.trim().length > 0);
          if (lines.length <= 1) return;

          const imported: Array<Omit<Warga, 'id'>> = [];
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
            if (cols.length >= 3 && cols[2]) {
              imported.push({
                noKk: cols[0] || '3276010000000000',
                nik: cols[1] || '3276010000000000',
                name: cols[2],
                gender: (cols[3] === 'P' ? 'P' : 'L') as any,
                birthDate: cols[4] || '1995-01-01',
                ageGroup: (cols[5] as any) || 'DEWASA',
                occupation: cols[6] || 'Wiraswasta',
                phone: cols[7] || '',
                addressBlock: cols[8] || 'Blok A',
                statusKeluarga: (cols[9] as any) || 'Kepala Keluarga',
                religion: cols[10] || 'Islam',
                isHeadOfFamily: cols[9]?.toLowerCase().includes('kepala') || false,
              });
            }
          }

          if (imported.length > 0) {
            importWargaBatch(imported);
            showToast('success', `Berhasil mengimpor ${imported.length} data warga.`);
          }
        } catch {
          showToast('error', 'Gagal memproses file CSV.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Filter list
  const filteredWarga = wargaList.filter((w) => {
    if (filterBlock !== 'ALL' && !w.addressBlock.toUpperCase().includes(filterBlock)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        w.name.toLowerCase().includes(q) ||
        w.nik.includes(q) ||
        w.noKk.includes(q) ||
        w.addressBlock.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
        <div>
          <h2 className="text-base sm:text-xl font-black text-[#333333]">
            Data Kependudukan RT
          </h2>
          <p className="text-[11px] text-[#777777]">
            Manajemen kepala keluarga, NIK, dan sebaran rumah warga.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-[#F1E1DC] text-xs font-bold text-[#555555] hover:text-[#333333] cursor-pointer"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#FF8F00]" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <label className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-[#F1E1DC] text-xs font-bold text-[#555555] hover:text-[#333333] cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-[#E53935]" />
            <span className="hidden sm:inline">Import</span>
            <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
          </label>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#E53935] to-[#FF8F00] text-white font-bold text-xs shadow-xs hover:opacity-95 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Warga</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-3 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, NIK, atau blok..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#E53935]"
          />
        </div>

        <div className="flex items-center gap-1 self-start sm:self-auto text-xs">
          <select
            value={filterBlock}
            onChange={(e) => setFilterBlock(e.target.value)}
            className="py-1 px-2.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-lg text-xs font-bold text-[#333333]"
          >
            <option value="ALL">Semua Blok</option>
            <option value="BLOK A">Blok A</option>
            <option value="BLOK B">Blok B</option>
            <option value="BLOK C">Blok C</option>
          </select>
          <span className="text-[11px] text-[#777777] font-semibold pl-1">
            Total: {filteredWarga.length} Jiwa
          </span>
        </div>
      </div>

      {/* MOBILE LIST VIEW */}
      <div className="block lg:hidden space-y-2">
        {filteredWarga.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#777777] bg-white rounded-2xl border border-[#F1E1DC]">
            Tidak ada warga yang cocok.
          </div>
        ) : (
          filteredWarga.map((w) => (
            <div
              key={w.id}
              className="p-3 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-[#333333] flex items-center gap-1.5">
                    <span>{w.name}</span>
                    {w.isHeadOfFamily && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-50 text-[#FF8F00] border border-amber-200">
                        Kepala KK
                      </span>
                    )}
                  </h4>
                  <div className="text-[10px] text-[#777777] mt-0.5 flex items-center gap-1">
                    <Home className="w-3 h-3 text-[#E53935]" />
                    <span>{w.addressBlock}</span>
                    <span>•</span>
                    <span>{w.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(w)}
                    className="p-1 text-slate-500 hover:text-[#333333] rounded-lg"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(w.id)}
                    className="p-1 text-rose-500 hover:text-rose-700 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-1.5 border-t border-[#F1E1DC] flex items-center justify-between text-[10px] text-[#777777]">
                <span>NIK: <strong className="text-[#333333] font-mono">{w.nik}</strong></span>
                <span>Pekerjaan: <strong className="text-[#333333]">{w.occupation || '-'}</strong></span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block bg-white rounded-2xl border border-[#F1E1DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF8F5] border-b border-[#F1E1DC] text-[#777777] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Nama Lengkap</th>
                <th className="py-2.5 px-3">NIK & No KK</th>
                <th className="py-2.5 px-3">L/P</th>
                <th className="py-2.5 px-3">Blok Rumah</th>
                <th className="py-2.5 px-3">Status Keluarga</th>
                <th className="py-2.5 px-3">Pekerjaan</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1E1DC]/60">
              {filteredWarga.map((w) => (
                <tr key={w.id} className="hover:bg-[#FFF8F5]/60 transition">
                  <td className="py-2.5 px-3 font-bold text-[#333333]">{w.name}</td>
                  <td className="py-2.5 px-3 font-mono text-[10px] text-[#777777]">
                    <div>NIK: {w.nik}</div>
                    <div className="text-slate-400">KK: {w.noKk}</div>
                  </td>
                  <td className="py-2.5 px-3 font-semibold">{w.gender}</td>
                  <td className="py-2.5 px-3 text-[#333333]">{w.addressBlock}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        w.isHeadOfFamily
                          ? 'bg-amber-50 text-[#FF8F00] border border-amber-200'
                          : 'bg-slate-100 text-[#777777]'
                      }`}
                    >
                      {w.statusKeluarga}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#555555]">{w.occupation || '-'}</td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(w)}
                        className="p-1.5 text-slate-600 hover:text-[#333333] hover:bg-slate-100 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(w.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM TAMBAH / EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/50 backdrop-blur-xs no-print">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-[#F1E1DC] shadow-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1E1DC]">
              <h3 className="text-sm font-extrabold text-[#333333]">
                {editingWarga ? 'Edit Data Warga' : 'Tambah Warga Baru'}
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
                  placeholder="Nama warga"
                  className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#333333] mb-0.5">NIK (16 Digit)</label>
                  <input
                    type="text"
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#333333] mb-0.5">Nomor KK</label>
                  <input
                    type="text"
                    value={formData.noKk}
                    onChange={(e) => setFormData({ ...formData, noKk: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#333333] mb-0.5">Jenis Kelamin</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs font-semibold"
                  >
                    <option value="L">Laki-Laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#333333] mb-0.5">Blok / Alamat Rumah</label>
                  <input
                    type="text"
                    value={formData.addressBlock}
                    onChange={(e) => setFormData({ ...formData, addressBlock: e.target.value })}
                    placeholder="Contoh: Blok A1 No. 04"
                    className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#333333] mb-0.5">Kelompok Usia</label>
                  <select
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs font-semibold"
                  >
                    <option value="ANAK">Anak (0-12)</option>
                    <option value="REMAJA">Remaja (13-20)</option>
                    <option value="DEWASA">Dewasa (21-59)</option>
                    <option value="LANSIA">Lansia (60+)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#333333] mb-0.5">Pekerjaan</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="headOfFam"
                  checked={formData.isHeadOfFamily}
                  onChange={(e) => setFormData({ ...formData, isHeadOfFamily: e.target.checked })}
                  className="rounded text-[#E53935]"
                />
                <label htmlFor="headOfFam" className="font-bold text-[#333333] cursor-pointer">
                  Sebagai Kepala Keluarga (KK)
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Hapus Data Warga?"
        message="Data warga yang dihapus akan dicatat dalam audit trail log."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        isDestructive
        onConfirm={() => {
          if (deleteId) {
            deleteWarga(deleteId);
            setDeleteId(null);
            showToast('info', 'Data warga berhasil dihapus');
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
