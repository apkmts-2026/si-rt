import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Users,
  Home,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Megaphone,
  Calendar,
  Eye,
  Sparkles,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { FinancialTransaction } from '../../types';
import { ReceiptViewerModal } from '../common/ReceiptViewerModal';

export const PublicHome: React.FC = () => {
  const {
    settings,
    cashStats,
    demographics,
    transactions,
    pengumumanList,
    agendaList,
    setActiveTab,
  } = useApp();

  const [selectedReceiptTrx, setSelectedReceiptTrx] = useState<FinancialTransaction | null>(null);

  // Published recent transactions (Max 5)
  const publishedTrx = transactions
    .filter((t) => t.status === 'DIPUBLIKASIKAN')
    .slice(0, 5);

  // Announcements (Max 2)
  const recentAnnouncements = pengumumanList
    .filter((p) => p.isActive)
    .slice(0, 2);

  // Agenda (Max 2)
  const upcomingAgenda = agendaList.slice(0, 2);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* A. Compact Greeting Strip */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[11px] font-bold text-[#FF8F00] uppercase tracking-wider">
            Lingkungan Rukun Tetangga
          </span>
          <h2 className="text-base sm:text-lg font-black text-[#333333]">
            RT {settings.rtNumber} / RW {settings.rwNumber} {settings.kelurahan}
          </h2>
        </div>
        <button
          onClick={() => setActiveTab('kontak')}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#F1E1DC] text-[#E53935] font-bold text-xs shadow-2xs hover:bg-[#FFF8F5] transition"
        >
          <Phone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Hubungi RT</span>
        </button>
      </div>

      {/* B. KARTU SALDO UTAMA (Gradasi Merah-Orange, Teks Putih, Ukuran Ringkas) */}
      <div className="rounded-3xl p-5 bg-gradient-to-r from-[#E53935] via-[#D32F2F] to-[#FF8F00] text-white shadow-md shadow-[#E53935]/15 relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-white/90 mb-1">
          <span className="font-extrabold tracking-wider uppercase text-[11px]">
            SALDO KAS RT SAAT INI
          </span>
          <span className="p-1 rounded-lg bg-white/15">
            <Wallet className="w-4 h-4 text-white" />
          </span>
        </div>

        <div className="text-2xl sm:text-3xl font-black tracking-tight my-1">
          Rp {cashStats.currentBalance.toLocaleString('id-ID')}
        </div>

        <div className="flex items-center justify-between text-[11px] text-amber-100 pt-2 border-t border-white/20 mt-3">
          <span>Status: <strong>{cashStats.surplusStatus}</strong></span>
          <button
            onClick={() => setActiveTab('keuangan')}
            className="font-bold underline hover:text-white flex items-center gap-0.5"
          >
            Rincian Kas <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* C. STATISTIK KEUANGAN (2 Kartu Kecil Berdampingan) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Pemasukan Bulan Ini */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#777777] font-semibold">
            <span>Pemasukan Bulan Ini</span>
            <span className="p-1 rounded-md bg-amber-50 text-[#FF8F00]">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-base sm:text-lg font-black text-[#FF8F00] mt-1.5">
            +Rp {cashStats.pemasukanBulanIni.toLocaleString('id-ID')}
          </div>
        </div>

        {/* Pengeluaran Bulan Ini */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#777777] font-semibold">
            <span>Pengeluaran Bulan Ini</span>
            <span className="p-1 rounded-md bg-red-50 text-[#E53935]">
              <TrendingDown className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-base sm:text-lg font-black text-[#E53935] mt-1.5">
            -Rp {cashStats.pengeluaranBulanIni.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* D. STATISTIK WARGA (2 Kartu Kecil Berdampingan) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Jumlah Warga */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#777777] font-semibold">Jumlah Warga</div>
            <div className="text-lg font-black text-[#333333] mt-0.5">
              {demographics.totalWarga} <span className="text-xs font-normal text-[#777777]">Jiwa</span>
            </div>
          </div>
          <span className="p-2 rounded-xl bg-[#FFF8F5] text-[#E53935] border border-[#F1E1DC]">
            <Users className="w-4 h-4" />
          </span>
        </div>

        {/* Jumlah KK */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#777777] font-semibold">Kepala Keluarga</div>
            <div className="text-lg font-black text-[#333333] mt-0.5">
              {demographics.totalKK} <span className="text-xs font-normal text-[#777777]">KK</span>
            </div>
          </div>
          <span className="p-2 rounded-xl bg-[#FFF8F5] text-[#FF8F00] border border-[#F1E1DC]">
            <Home className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Quick Action Ribbon for Citizens */}
      <div className="p-2.5 rounded-2xl bg-white border border-[#F1E1DC] flex items-center justify-between gap-2 text-xs">
        <span className="text-[11px] text-[#555555] font-medium pl-1 truncate">
          Cek status iuran kas bulanan rumah Anda:
        </span>
        <button
          onClick={() => setActiveTab('rekap-iuran')}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#E53935] to-[#FF8F00] text-white font-bold text-[11px] whitespace-nowrap shadow-xs hover:opacity-95 transition"
        >
          Rekap Iuran
        </button>
      </div>

      {/* E. TRANSAKSI TERBARU (Maksimal 5 Transaksi, List/Card Format untuk HP) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs sm:text-sm font-extrabold text-[#333333] uppercase tracking-wide">
            Transaksi Kas Terbaru
          </h3>
          <button
            onClick={() => setActiveTab('keuangan')}
            className="text-xs font-bold text-[#E53935] hover:underline flex items-center gap-0.5"
          >
            Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#F1E1DC] shadow-xs divide-y divide-[#F1E1DC]/60 overflow-hidden">
          {publishedTrx.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#777777]">Belum ada transaksi publik.</div>
          ) : (
            publishedTrx.map((trx) => {
              const isIncome = trx.type === 'PEMASUKAN';
              return (
                <div
                  key={trx.id}
                  className="p-3 sm:p-3.5 flex items-center justify-between gap-2.5 hover:bg-[#FFF8F5] transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`p-2 rounded-xl shrink-0 ${
                        isIncome ? 'bg-amber-50 text-[#FF8F00]' : 'bg-red-50 text-[#E53935]'
                      }`}
                    >
                      {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] text-[#777777]">
                        <span>{trx.date}</span>
                        <span>·</span>
                        <span className="truncate">{trx.category}</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#333333] truncate mt-0.5 max-w-[200px] sm:max-w-md">
                        {trx.description}
                      </h4>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`text-xs sm:text-sm font-black ${
                        isIncome ? 'text-[#FF8F00]' : 'text-[#E53935]'
                      }`}
                    >
                      {isIncome ? '+ ' : '- '}Rp {trx.amount.toLocaleString('id-ID')}
                    </div>
                    {trx.receiptUrl && (
                      <button
                        onClick={() => setSelectedReceiptTrx(trx)}
                        className="text-[10px] font-bold text-[#E53935] hover:underline inline-flex items-center gap-0.5 mt-0.5"
                      >
                        <Eye className="w-3 h-3" /> Bukti
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* F. PENGUMUMAN TERBARU (Maksimal 2 Pengumuman) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs sm:text-sm font-extrabold text-[#333333] uppercase tracking-wide">
            Pengumuman Terbaru
          </h3>
          <button
            onClick={() => setActiveTab('pengumuman')}
            className="text-xs font-bold text-[#E53935] hover:underline flex items-center gap-0.5"
          >
            Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {recentAnnouncements.map((p) => (
            <div
              key={p.id}
              className="p-3.5 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-[#777777] mb-1">
                  <span className="font-bold text-[#FF8F00]">{p.category}</span>
                  <span>{p.date}</span>
                </div>
                <h4 className="text-xs font-bold text-[#333333] line-clamp-1">{p.title}</h4>
                <p className="text-[11px] text-[#555555] line-clamp-2 mt-0.5 leading-relaxed">
                  {p.content}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('pengumuman')}
                className="text-[11px] font-bold text-[#E53935] self-start hover:underline"
              >
                Baca Lengkap →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* G. AGENDA TERDEKAT (Maksimal 2 Agenda) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs sm:text-sm font-extrabold text-[#333333] uppercase tracking-wide">
            Agenda Terdekat
          </h3>
          <button
            onClick={() => setActiveTab('agenda')}
            className="text-xs font-bold text-[#E53935] hover:underline flex items-center gap-0.5"
          >
            Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {upcomingAgenda.map((ag) => (
            <div
              key={ag.id}
              className="p-3 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs flex items-center gap-3"
            >
              <div className="p-2.5 rounded-xl bg-[#FFF8F5] border border-[#F1E1DC] text-[#E53935] text-center shrink-0">
                <Calendar className="w-4 h-4 mx-auto mb-0.5" />
                <span className="text-[9px] font-bold block">{ag.date.substring(5)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-[#333333] truncate">{ag.title}</h4>
                <div className="text-[11px] text-[#777777] mt-0.5 truncate">{ag.location}</div>
                <div className="text-[10px] text-[#FF8F00] font-semibold">{ag.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Receipt Viewer Modal */}
      <ReceiptViewerModal
        transaction={selectedReceiptTrx}
        onClose={() => setSelectedReceiptTrx(null)}
      />
    </div>
  );
};
