import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Save,
  Download,
  Upload,
  RotateCcw,
} from 'lucide-react';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const AdminPengaturan: React.FC = () => {
  const {
    settings,
    updateSettings,
    exportDatabaseJSON,
    importDatabaseJSON,
    resetToDefaults,
  } = useApp();

  const [formData, setFormData] = useState({ ...settings });
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...formData,
      monthlyDuesAmount: Number(formData.monthlyDuesAmount) || 50000,
      initialCashBalance: Number(formData.initialCashBalance) || 0,
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          importDatabaseJSON(text);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="px-1">
        <h2 className="text-base sm:text-xl font-black text-[#333333]">
          Pengaturan Aplikasi & Profil RT
        </h2>
        <p className="text-[11px] text-[#777777]">
          Atur identitas resmi RT, kop surat, besaran iuran, kontak layanan, serta cadangan database.
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="p-3.5 sm:p-5 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs space-y-3.5 text-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-[#F1E1DC]">
          <Building2 className="w-4 h-4 text-[#E53935]" />
          <h3 className="font-extrabold text-[#333333] text-xs sm:text-sm">Identitas Pemerintahan & Wilayah RT</h3>
        </div>

        {/* Row 1: Logo & Basic App Names */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          <div>
            <label className="block font-bold text-[#333333] uppercase text-[10px] mb-1">Logo RT</label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl border-2 border-dashed border-[#F1E1DC] bg-[#FFF8F5] flex items-center justify-center overflow-hidden shrink-0">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-black text-[#E53935] text-xs">RT {formData.rtNumber}</span>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:bg-red-50 file:text-[#E53935] file:text-[10px] file:font-bold hover:file:bg-red-100"
                />
                <p className="text-[9px] text-[#777777] mt-0.5">Format PNG/JPG</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#333333] mb-0.5">Nama Aplikasi</label>
            <input
              type="text"
              value={formData.appName}
              onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
              className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-[#333333] mb-0.5">Periode Kepengurusan</label>
            <input
              type="text"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              placeholder="Contoh: 2024 - 2027"
              className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
              required
            />
          </div>
        </div>

        {/* Row 2: RT/RW & Daerah */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div>
            <label className="block font-bold text-[#333333] mb-0.5">Nomor RT *</label>
            <input
              type="text"
              value={formData.rtNumber}
              onChange={(e) => setFormData({ ...formData, rtNumber: e.target.value })}
              className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs font-bold"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-[#333333] mb-0.5">Nomor RW *</label>
            <input
              type="text"
              value={formData.rwNumber}
              onChange={(e) => setFormData({ ...formData, rwNumber: e.target.value })}
              className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs font-bold"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-[#333333] mb-0.5">Kelurahan *</label>
            <input
              type="text"
              value={formData.kelurahan}
              onChange={(e) => setFormData({ ...formData, kelurahan: e.target.value })}
              className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-[#333333] mb-0.5">Kecamatan *</label>
            <input
              type="text"
              value={formData.kecamatan}
              onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
              className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
              required
            />
          </div>
        </div>

        {/* Row 3: Kota, Provinsi, Kode Pos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="block font-bold text-[#333333] mb-0.5">Kota / Kabupaten *</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
              required
            />
          </div>
          <div>
            <label className="block font-bold text-[#333333] mb-0.5">Provinsi</label>
            <input
              type="text"
              value={formData.province}
              onChange={(e) => setFormData({ ...formData, province: e.target.value })}
              className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
            />
          </div>
          <div>
            <label className="block font-bold text-[#333333] mb-0.5">Kode Pos</label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Row 4: Alamat & Jam Pelayanan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block font-bold text-[#333333] mb-0.5">Alamat Balai / Sekretariat RT</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
              required
            />
          </div>
          <div>
            <label className="block font-bold text-[#333333] mb-0.5">Jam Pelayanan Administrasi</label>
            <input
              type="text"
              value={formData.serviceHours}
              onChange={(e) => setFormData({ ...formData, serviceHours: e.target.value })}
              placeholder="Contoh: Senin - Sabtu: 18:30 - 21:00 WIB"
              className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Row 5: Kontak & WA */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="block font-bold text-[#333333] mb-0.5">No. WhatsApp Pelayanan *</label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="6281234567890"
              className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs font-mono"
              required
            />
          </div>
          <div>
            <label className="block font-bold text-[#333333] mb-0.5">No. Telepon RT</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
            />
          </div>
          <div>
            <label className="block font-bold text-[#333333] mb-0.5">Email RT</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Row 6: Nama Pengurus Inti */}
        <div className="pt-2 border-t border-[#F1E1DC]">
          <h4 className="font-bold text-[#333333] mb-2 text-xs">Nama Pejabat untuk Kop Surat & Laporan Resmi:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block font-semibold text-[#777777] mb-0.5">Nama Ketua RT</label>
              <input
                type="text"
                value={formData.leadName}
                onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs font-bold"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#777777] mb-0.5">Nama Bendahara RT</label>
              <input
                type="text"
                value={formData.treasurerName}
                onChange={(e) => setFormData({ ...formData, treasurerName: e.target.value })}
                className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs font-bold"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#777777] mb-0.5">Nama Sekretaris RT</label>
              <input
                type="text"
                value={formData.secretaryName}
                onChange={(e) => setFormData({ ...formData, secretaryName: e.target.value })}
                className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs font-bold"
                required
              />
            </div>
          </div>
        </div>

        {/* Row 7: Konfigurasi Keuangan Kas RT */}
        <div className="pt-2 border-t border-[#F1E1DC]">
          <h4 className="font-bold text-[#333333] mb-2 text-xs">Konfigurasi Standar Keuangan:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-[#777777] mb-0.5">
                Besaran Iuran Bulanan per KK (Rupiah)
              </label>
              <input
                type="number"
                value={formData.monthlyDuesAmount}
                onChange={(e) => setFormData({ ...formData, monthlyDuesAmount: Number(e.target.value) })}
                className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs font-bold text-[#333333]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#777777] mb-0.5">
                Saldo Awal Kas RT (Rupiah)
              </label>
              <input
                type="number"
                value={formData.initialCashBalance}
                onChange={(e) => setFormData({ ...formData, initialCashBalance: Number(e.target.value) })}
                className="w-full px-3 py-1.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs font-bold text-[#333333]"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E53935] to-[#FF8F00] text-white font-bold text-xs shadow-xs hover:opacity-95 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Perubahan Pengaturan RT</span>
          </button>
        </div>
      </form>

      {/* Backup, Restore & Reset Database Section */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs space-y-3 text-xs">
        <h3 className="text-xs sm:text-sm font-extrabold text-[#333333]">
          Pemeliharaan Database & Cadangan Sistem
        </h3>
        <p className="text-[11px] text-[#777777]">
          Unduh cadangan data lengkap (JSON) untuk arsip berkala, pulihkan data, atau reset ke pengaturan awal.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Export JSON */}
          <div className="p-3 rounded-xl bg-[#FFF8F5] border border-[#F1E1DC] flex flex-col justify-between space-y-2">
            <div>
              <div className="font-bold text-[#333333] text-xs">Backup Database</div>
              <p className="text-[10px] text-[#777777] mt-0.5">
                Unduh seluruh data warga, transaksi, rekap iuran, dan agenda ke berkas JSON.
              </p>
            </div>
            <button
              type="button"
              onClick={exportDatabaseJSON}
              className="w-full py-1.5 px-3 bg-[#333333] hover:bg-black text-white font-bold rounded-xl flex items-center justify-center gap-1.5 text-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#FFA726]" />
              <span>Unduh JSON</span>
            </button>
          </div>

          {/* Restore JSON */}
          <div className="p-3 rounded-xl bg-[#FFF8F5] border border-[#F1E1DC] flex flex-col justify-between space-y-2">
            <div>
              <div className="font-bold text-[#333333] text-xs">Restore Database</div>
              <p className="text-[10px] text-[#777777] mt-0.5">
                Pulihkan data aplikasi dari berkas cadangan JSON yang sebelumnya pernah diunduh.
              </p>
            </div>
            <label className="w-full py-1.5 px-3 bg-white hover:bg-orange-50 border border-[#F1E1DC] text-[#333333] font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer text-center text-xs">
              <Upload className="w-3.5 h-3.5 text-[#E53935]" />
              <span>Pilih Berkas JSON</span>
              <input type="file" accept=".json" onChange={handleFileRestore} className="hidden" />
            </label>
          </div>

          {/* Reset to Default */}
          <div className="p-3 rounded-xl bg-red-50/50 border border-red-200 flex flex-col justify-between space-y-2">
            <div>
              <div className="font-bold text-[#C62828] text-xs">Reset ke Data Awal</div>
              <p className="text-[10px] text-[#E53935] mt-0.5">
                Kembalikan seluruh isi database ke contoh data standar RT 001.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setResetConfirmOpen(true)}
              className="w-full py-1.5 px-3 bg-[#E53935] hover:bg-[#C62828] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 text-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Database</span>
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={resetConfirmOpen}
        title="Reset Seluruh Data Aplikasi"
        message="PERINGATAN: Tindakan ini akan mengembalikan data warga, transaksi, dan pengaturan ke data contoh default bawaan sistem. Apakah Anda yakin?"
        confirmLabel="Ya, Reset Sekarang"
        isDestructive={true}
        onConfirm={() => {
          resetToDefaults();
          setResetConfirmOpen(false);
          setFormData({ ...settings });
        }}
        onCancel={() => setResetConfirmOpen(false)}
      />
    </div>
  );
};
