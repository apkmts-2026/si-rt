import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle2,
  AlertTriangle,
  History,
  ShieldCheck,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    settings,
    cashStats,
    demographics,
    transactions,
    monthlyDues,
    auditLogs,
    setActiveTab,
  } = useApp();

  const draftTrx = transactions.filter((t) => t.status === 'DRAFT');

  // October 2026 dues stats
  const currentMonth = 10;
  const paidCount = monthlyDues.filter((d) => d.months[currentMonth]?.paid).length;
  const unpaidCount = monthlyDues.length - paidCount;

  return (
    <div className="space-y-4">
      {/* Welcome Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#E53935] via-[#D32F2F] to-[#FF8F00] text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/20 text-white border border-white/20">
              Hak Akses: {currentUser?.role}
            </span>
            <span className="text-[10px] text-amber-100">Periode {settings.period}</span>
          </div>
          <h2 className="text-base sm:text-xl font-extrabold text-white">
            Selamat Datang, {currentUser?.name}
          </h2>
          <p className="text-[11px] text-amber-50 max-w-xl">
            Panel Pengelola RT {settings.rtNumber} / RW {settings.rwNumber}. Pantau mutasi kas, kelola warga, dan kirimkan pengingat iuran secara transparan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(currentUser?.role === 'ADMIN' || currentUser?.role === 'BENDAHARA') && (
            <button
              onClick={() => setActiveTab('admin-keuangan')}
              className="px-3 py-2 rounded-xl bg-white hover:bg-amber-50 text-[#C62828] font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Input Mutasi Kas</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('admin-rekap-iuran')}
            className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/25 transition flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Pengingat Iuran</span>
          </button>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Kas RT Saat Ini */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-bold text-[#777777] uppercase mb-1">
            <span>Saldo Kas RT</span>
            <span className="p-1 rounded-md bg-red-50 text-[#E53935]">
              <Wallet className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-base sm:text-lg font-black text-[#333333]">
            Rp {cashStats.currentBalance.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-[#FF8F00] font-semibold mt-1">
            Status: {cashStats.surplusStatus}
          </div>
        </div>

        {/* Pemasukan Bulan Ini */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-bold text-[#777777] uppercase mb-1">
            <span>Pemasukan Bulan Ini</span>
            <span className="p-1 rounded-md bg-amber-50 text-[#FF8F00]">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-base sm:text-lg font-black text-[#FF8F00]">
            +Rp {cashStats.pemasukanBulanIni.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-[#777777] mt-1">
            Total: Rp {cashStats.totalPemasukan.toLocaleString('id-ID')}
          </div>
        </div>

        {/* Pengeluaran Bulan Ini */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-bold text-[#777777] uppercase mb-1">
            <span>Pengeluaran Bulan Ini</span>
            <span className="p-1 rounded-md bg-red-50 text-[#E53935]">
              <TrendingDown className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-base sm:text-lg font-black text-[#E53935]">
            -Rp {cashStats.pengeluaranBulanIni.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-[#777777] mt-1">
            Total: Rp {cashStats.totalPengeluaran.toLocaleString('id-ID')}
          </div>
        </div>

        {/* Iuran Warga Bulan Ini */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-bold text-[#777777] uppercase mb-1">
            <span>Iuran Okt 2026</span>
            <span className="p-1 rounded-md bg-orange-50 text-[#FF8F00]">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-base sm:text-lg font-black text-[#333333]">
            {paidCount} / {monthlyDues.length} <span className="text-[10px] font-normal text-[#777777]">KK</span>
          </div>
          <div className="text-[10px] text-[#E53935] font-semibold mt-1">
            {unpaidCount} KK belum bayar
          </div>
        </div>
      </div>

      {/* Draft Transactions Alert Banner if any */}
      {draftTrx.length > 0 && (
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-2.5 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FF8F00] shrink-0" />
            <span className="text-[11px]">
              Terdapat <strong>{draftTrx.length} transaksi DRAFT</strong> yang belum dipublikasikan kepada warga.
            </span>
          </div>
          <button
            onClick={() => setActiveTab('admin-keuangan')}
            className="px-2.5 py-1 rounded-lg bg-[#FF8F00] hover:bg-amber-600 text-white font-bold text-[11px] whitespace-nowrap transition cursor-pointer"
          >
            Tinjau
          </button>
        </div>
      )}

      {/* 2-Columns Grid: Quick Management Links & Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left Column (2 Cols): Quick Access Cards */}
        <div className="lg:col-span-2 space-y-2">
          <h3 className="text-xs sm:text-sm font-extrabold text-[#333333] px-1">Pusat Navigasi Pengelola</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div
              onClick={() => setActiveTab('admin-keuangan')}
              className="p-3.5 rounded-2xl bg-white border border-[#F1E1DC] hover:border-[#FFA726] shadow-xs cursor-pointer transition group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="p-2 rounded-xl bg-red-50 text-[#E53935] group-hover:bg-[#E53935] group-hover:text-white transition">
                  <Wallet className="w-4 h-4" />
                </span>
                <span className="text-[10px] text-[#777777] font-mono">{transactions.length} Transaksi</span>
              </div>
              <h4 className="font-bold text-[#333333] text-xs">Kelola Keuangan Kas</h4>
              <p className="text-[11px] text-[#777777] mt-0.5 leading-relaxed">
                Tambah mutasi kas, upload bukti transfer/kwitansi, dan atur status publikasi.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('admin-rekap-iuran')}
              className="p-3.5 rounded-2xl bg-white border border-[#F1E1DC] hover:border-[#FFA726] shadow-xs cursor-pointer transition group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="p-2 rounded-xl bg-amber-50 text-[#FF8F00] group-hover:bg-[#FF8F00] group-hover:text-white transition">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <span className="text-[10px] text-[#777777] font-mono">{monthlyDues.length} KK</span>
              </div>
              <h4 className="font-bold text-[#333333] text-xs">Rekap & Pengingat Iuran</h4>
              <p className="text-[11px] text-[#777777] mt-0.5 leading-relaxed">
                Catat pembayaran iuran bulanan dan kirim pesan otomatis via WhatsApp warga.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('admin-warga')}
              className="p-3.5 rounded-2xl bg-white border border-[#F1E1DC] hover:border-[#FFA726] shadow-xs cursor-pointer transition group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="p-2 rounded-xl bg-orange-50 text-[#FFA726] group-hover:bg-[#FF8F00] group-hover:text-white transition">
                  <Users className="w-4 h-4" />
                </span>
                <span className="text-[10px] text-[#777777] font-mono">{demographics.totalWarga} Jiwa</span>
              </div>
              <h4 className="font-bold text-[#333333] text-xs">Data Kependudukan</h4>
              <p className="text-[11px] text-[#777777] mt-0.5 leading-relaxed">
                Kelola data KK, NIK, alamat blok, dan ekspor/impor file CSV warga.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('admin-pengaturan')}
              className="p-3.5 rounded-2xl bg-white border border-[#F1E1DC] hover:border-[#FFA726] shadow-xs cursor-pointer transition group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="p-2 rounded-xl bg-red-50 text-[#E53935] group-hover:bg-[#E53935] group-hover:text-white transition">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <span className="text-[10px] text-[#FF8F00] font-semibold">Backup & Profil</span>
              </div>
              <h4 className="font-bold text-[#333333] text-xs">Pengaturan RT & Cadangan</h4>
              <p className="text-[11px] text-[#777777] mt-0.5 leading-relaxed">
                Atur kop surat, logo, nomor rekening bank, dan backup/restore data.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Audit Log Trail */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs sm:text-sm font-extrabold text-[#333333] flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-[#E53935]" />
              <span>Aktivitas Pengelola</span>
            </h3>
            <button
              onClick={() => setActiveTab('admin-audit')}
              className="text-[11px] text-[#E53935] font-semibold hover:underline"
            >
              Semua
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#F1E1DC] p-3 space-y-2 shadow-xs">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="text-xs border-b border-[#F1E1DC]/60 pb-2 last:border-none last:pb-0">
                <div className="flex items-center justify-between text-[#777777] text-[10px] mb-0.5">
                  <span className="font-bold text-[#333333]">{log.userName}</span>
                  <span>{log.timestamp}</span>
                </div>
                <div className="font-bold text-[#333333] text-[11px]">{log.activity}</div>
                <div className="text-[#777777] text-[10px] truncate mt-0.5">{log.details}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
