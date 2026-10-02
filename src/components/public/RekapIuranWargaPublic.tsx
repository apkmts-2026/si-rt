import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Check,
  X,
  Send,
  Home,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const RekapIuranWargaPublic: React.FC = () => {
  const { settings, monthlyDues } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<number>(10);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'UNPAID'>('ALL');

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Head of families dues records
  const duesData = useMemo(() => {
    return monthlyDues.filter((due) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = due.wargaName.toLowerCase().includes(q);
        const matchBlock = due.addressBlock.toLowerCase().includes(q);
        if (!matchName && !matchBlock) return false;
      }

      if (statusFilter !== 'ALL') {
        const isPaid = !!due.months[selectedMonth]?.paid;
        if (statusFilter === 'PAID' && !isPaid) return false;
        if (statusFilter === 'UNPAID' && isPaid) return false;
      }

      return true;
    });
  }, [monthlyDues, searchQuery, statusFilter, selectedMonth]);

  // Overall statistics for the selected month
  const monthStats = useMemo(() => {
    let totalTargetKK = monthlyDues.length;
    let paidCount = 0;
    let unpaidCount = 0;

    monthlyDues.forEach((d) => {
      if (d.months[selectedMonth]?.paid) {
        paidCount++;
      } else {
        unpaidCount++;
      }
    });

    const duesPerKK = settings.monthlyDuesAmount || 50000;
    const collectedAmount = paidCount * duesPerKK;
    const targetAmount = totalTargetKK * duesPerKK;
    const percent = totalTargetKK > 0 ? Math.round((paidCount / totalTargetKK) * 100) : 0;

    return {
      totalTargetKK,
      paidCount,
      unpaidCount,
      collectedAmount,
      targetAmount,
      percent,
    };
  }, [monthlyDues, selectedMonth, settings.monthlyDuesAmount]);

  const handleConfirmViaWA = (wargaName: string, block: string) => {
    const text = encodeURIComponent(
      `Halo Bendahara RT ${settings.rtNumber} (${settings.treasurerName}),\n\nSaya ingin konfirmasi pembayaran iuran kas RT:\nNama: ${wargaName}\nAlamat: ${block}\nBulan: ${monthNames[selectedMonth - 1]} 2026\nNominal: Rp ${(settings.monthlyDuesAmount || 50000).toLocaleString('id-ID')}\n\nTerima kasih.`
    );
    window.open(`https://wa.me/${settings.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <h2 className="text-base sm:text-xl font-black text-[#333333]">
            Dasbor Rekapitulasi Iuran Warga
          </h2>
          <p className="text-[11px] text-[#777777]">
            Pantau status pembayaran iuran kas bulanan per KK secara transparan.
          </p>
        </div>

        <div className="px-3 py-1 bg-white border border-[#F1E1DC] rounded-xl text-xs font-bold text-[#E53935] self-start sm:self-auto">
          Rp {(settings.monthlyDuesAmount || 50000).toLocaleString('id-ID')} / KK / Bulan
        </div>
      </div>

      {/* Month Carousel in Red-Orange Theme */}
      <div className="bg-white p-2 rounded-2xl border border-[#F1E1DC] shadow-xs overflow-x-auto scrollbar-none">
        <div className="flex space-x-1.5 min-w-max">
          {monthNames.map((name, idx) => {
            const mNum = idx + 1;
            const isSelected = selectedMonth === mNum;
            return (
              <button
                key={name}
                onClick={() => setSelectedMonth(mNum)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                  isSelected
                    ? 'bg-[#E53935] text-white shadow-xs'
                    : 'bg-[#FFF8F5] text-[#555555] hover:text-[#333333]'
                }`}
              >
                <span>{name}</span>
                {mNum === 10 && (
                  <span className={`text-[9px] px-1 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-red-100 text-[#E53935]'}`}>
                    Kini
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs">
          <div className="text-[10px] text-[#777777] font-semibold">Total Target KK</div>
          <div className="text-base sm:text-lg font-black text-[#333333] mt-0.5">
            {monthStats.totalTargetKK} <span className="text-[10px] text-[#777777]">KK</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-amber-200 shadow-xs">
          <div className="text-[10px] text-[#FF8F00] font-semibold">Lunas ({monthStats.percent}%)</div>
          <div className="text-base sm:text-lg font-black text-[#FF8F00] mt-0.5">
            {monthStats.paidCount} <span className="text-[10px] text-[#777777]">KK</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-red-200 shadow-xs">
          <div className="text-[10px] text-[#E53935] font-semibold">Belum Lunas</div>
          <div className="text-base sm:text-lg font-black text-[#E53935] mt-0.5">
            {monthStats.unpaidCount} <span className="text-[10px] text-[#777777]">KK</span>
          </div>
        </div>
      </div>

      {/* Search and Status Filter */}
      <div className="p-3 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kepala keluarga atau blok..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#E53935]"
          />
        </div>

        <div className="flex items-center gap-1 self-start sm:self-auto text-xs">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
              statusFilter === 'ALL' ? 'bg-[#333333] text-white' : 'bg-[#FFF8F5] text-[#555555]'
            }`}
          >
            Semua ({monthlyDues.length})
          </button>
          <button
            onClick={() => setStatusFilter('PAID')}
            className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
              statusFilter === 'PAID' ? 'bg-[#FF8F00] text-white' : 'bg-amber-50 text-[#FF8F00]'
            }`}
          >
            Lunas ({monthStats.paidCount})
          </button>
          <button
            onClick={() => setStatusFilter('UNPAID')}
            className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
              statusFilter === 'UNPAID' ? 'bg-[#E53935] text-white' : 'bg-red-50 text-[#E53935]'
            }`}
          >
            Belum ({monthStats.unpaidCount})
          </button>
        </div>
      </div>

      {/* MOBILE LIST VIEW (block lg:hidden) - Desain Card Mobile Tanpa Scroll Horizontal */}
      <div className="block lg:hidden space-y-2">
        {duesData.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#777777] bg-white rounded-2xl border border-[#F1E1DC]">
            Tidak ada data yang cocok dengan pencarian.
          </div>
        ) : (
          duesData.map((due) => {
            const isPaid = !!due.months[selectedMonth]?.paid;

            return (
              <div
                key={due.id}
                className="p-3.5 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#333333] truncate">{due.wargaName}</h4>
                  <div className="text-[11px] text-[#777777] flex items-center gap-1 mt-0.5">
                    <Home className="w-3 h-3 text-[#E53935]" />
                    <span>{due.addressBlock}</span>
                  </div>

                  {/* 12 Months Mini Indicators */}
                  <div className="flex items-center gap-0.5 mt-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => {
                      const paid = !!due.months[m]?.paid;
                      const isCurrent = m === selectedMonth;
                      return (
                        <span
                          key={m}
                          title={`Bulan ${m}: ${paid ? 'Lunas' : 'Belum'}`}
                          className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center text-[8px] font-bold ${
                            paid
                              ? 'bg-amber-400 text-white'
                              : 'bg-slate-100 text-slate-300'
                          } ${isCurrent ? 'ring-1 ring-[#E53935]' : ''}`}
                        >
                          {m}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {isPaid ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-[#FF8F00] border border-amber-200">
                      <Check className="w-3 h-3" /> Lunas
                    </span>
                  ) : (
                    <div className="flex flex-col items-end gap-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-[#E53935] border border-red-200">
                        <Clock className="w-3 h-3" /> Belum
                      </span>
                      <button
                        onClick={() => handleConfirmViaWA(due.wargaName, due.addressBlock)}
                        className="px-2 py-0.5 text-[10px] font-bold text-white bg-gradient-to-r from-[#E53935] to-[#FF8F00] rounded-md shadow-2xs"
                      >
                        Setor WA
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP MATRIX VIEW (hidden lg:block) */}
      <div className="hidden lg:block bg-white rounded-2xl border border-[#F1E1DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FFF8F5] border-b border-[#F1E1DC] text-[#777777] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3 w-8 text-center">No</th>
                <th className="py-2.5 px-3 min-w-40">Nama KK & Alamat</th>
                {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'].map((m, idx) => (
                  <th
                    key={m}
                    className={`py-2 px-1 text-center w-10 ${
                      idx + 1 === selectedMonth ? 'bg-red-100 text-[#E53935] font-black' : ''
                    }`}
                  >
                    {m}
                  </th>
                ))}
                <th className="py-2.5 px-3 text-center">Status {monthNames[selectedMonth - 1]}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1E1DC]/60">
              {duesData.map((due, index) => {
                const isPaid = !!due.months[selectedMonth]?.paid;

                return (
                  <tr key={due.id} className="hover:bg-[#FFF8F5]/60 transition">
                    <td className="py-2.5 px-3 text-center text-[#777777] font-mono">{index + 1}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-[#333333] text-xs">{due.wargaName}</div>
                      <div className="text-[10px] text-[#777777]">{due.addressBlock}</div>
                    </td>

                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => {
                      const paid = !!due.months[m]?.paid;
                      const isCurrent = m === selectedMonth;

                      return (
                        <td key={m} className={`py-2 px-1 text-center ${isCurrent ? 'bg-red-50/40' : ''}`}>
                          {paid ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-[#FF8F00] font-bold">
                              <Check className="w-3 h-3" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-300">
                              <X className="w-3 h-3" />
                            </span>
                          )}
                        </td>
                      );
                    })}

                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-[#FF8F00] border border-amber-200">
                          <Check className="w-3 h-3" /> Lunas
                        </span>
                      ) : (
                        <button
                          onClick={() => handleConfirmViaWA(due.wargaName, due.addressBlock)}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 hover:bg-red-100 text-[#E53935] border border-red-200 transition"
                        >
                          <Send className="w-2.5 h-2.5" /> Konfirmasi WA
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
