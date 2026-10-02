import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Send,
  Search,
  Check,
  X,
  Copy,
} from 'lucide-react';

export const AdminRekapIuran: React.FC = () => {
  const { monthlyDues, toggleMonthlyDue, settings, showToast } = useApp();

  const [selectedMonth, setSelectedMonth] = useState<number>(10); // current month Oktober
  const [searchQuery, setSearchQuery] = useState('');
  const [blastModalOpen, setBlastModalOpen] = useState(false);
  const [customTemplate, setCustomTemplate] = useState(
    `Yth. Bapak/Ibu {NAMA} ({ALAMAT}),\n\nSalam hangat dari Pengurus RT {NO_RT} / RW {NO_RW}. Mengingatkan perihal iuran kas rutin warga untuk periode bulan {BULAN} {TAHUN} sebesar Rp {NOMINAL}.\n\nDana kas digunakan untuk pembiayaan satpam keamanan, pengangkutan sampah, penerangan jalan, serta kas sosial warga.\n\nPembayaran dapat diserahkan langsung ke Bendahara ({BENDAHARA}) atau konfirmasi melalui pesan ini.\n\nTerima kasih atas partisipasi aktif dalam menjaga lingkungan kita tetap bersih dan aman.`
  );

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // List of warga dues
  const duesList = useMemo(() => {
    return monthlyDues.filter((item) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return item.wargaName.toLowerCase().includes(q) || item.addressBlock.toLowerCase().includes(q);
    });
  }, [monthlyDues, searchQuery]);

  // Unpaid residents for the selected month
  const unpaidResidents = useMemo(() => {
    return monthlyDues.filter((d) => !d.months[selectedMonth]?.paid);
  }, [monthlyDues, selectedMonth]);

  const paidCount = monthlyDues.length - unpaidResidents.length;

  const generateReminderMessage = (wargaName: string, address: string) => {
    return customTemplate
      .replace(/{NAMA}/g, wargaName)
      .replace(/{ALAMAT}/g, address)
      .replace(/{NO_RT}/g, settings.rtNumber)
      .replace(/{NO_RW}/g, settings.rwNumber)
      .replace(/{BULAN}/g, monthNames[selectedMonth - 1])
      .replace(/{TAHUN}/g, '2026')
      .replace(/{NOMINAL}/g, (settings.monthlyDuesAmount || 50000).toLocaleString('id-ID'))
      .replace(/{BENDAHARA}/g, settings.treasurerName);
  };

  const handleSendReminderWA = (wargaName: string, address: string, phone?: string) => {
    const msg = generateReminderMessage(wargaName, address);
    const targetPhone = phone ? phone.replace(/[^0-9]/g, '') : settings.whatsapp;
    const cleanPhone = targetPhone.startsWith('0') ? '62' + targetPhone.substring(1) : targetPhone;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCopyBlastMessage = () => {
    navigator.clipboard.writeText(customTemplate);
    showToast('success', 'Format pesan pengingat disalin ke clipboard.');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
        <div>
          <h2 className="text-base sm:text-xl font-black text-[#333333]">
            Rekapitulasi & Pengingat Iuran Warga
          </h2>
          <p className="text-[11px] text-[#777777]">
            Kelola status lunas iuran per rumah dan kirimkan pengingat ramah via WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setBlastModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E53935] to-[#FF8F00] text-white font-bold text-xs shadow-xs hover:opacity-95 transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim Pengingat ({unpaidResidents.length} KK)</span>
          </button>
        </div>
      </div>

      {/* Month Selector Bar */}
      <div className="p-2.5 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
        <div className="flex space-x-1 min-w-max">
          {monthNames.map((name, idx) => {
            const m = idx + 1;
            const isSelected = selectedMonth === m;
            return (
              <button
                key={name}
                onClick={() => setSelectedMonth(m)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  isSelected
                    ? 'bg-[#E53935] text-white shadow-xs'
                    : 'bg-[#FFF8F5] text-[#555555] hover:text-[#333333]'
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>

        <div className="text-[11px] font-semibold text-[#777777] whitespace-nowrap hidden lg:block pr-1">
          Status: <strong className="text-[#FF8F00]">{paidCount} Lunas</strong> •{' '}
          <strong className="text-[#E53935]">{unpaidResidents.length} Belum</strong>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs">
          <div className="text-[10px] font-semibold text-[#777777]">Iuran per KK</div>
          <div className="text-sm sm:text-base font-black text-[#333333] mt-0.5">
            Rp {(settings.monthlyDuesAmount || 50000).toLocaleString('id-ID')}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-amber-200 shadow-xs">
          <div className="text-[10px] font-semibold text-[#FF8F00]">Lunas ({monthNames[selectedMonth - 1]})</div>
          <div className="text-sm sm:text-base font-black text-[#FF8F00] mt-0.5">
            {paidCount} KK
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-red-200 shadow-xs">
          <div className="text-[10px] font-semibold text-[#E53935]">Belum Lunas</div>
          <div className="text-sm sm:text-base font-black text-[#E53935] mt-0.5">
            {unpaidResidents.length} KK
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-3 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kepala keluarga atau blok..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#E53935]"
          />
        </div>
      </div>

      {/* Dues List (Card on Mobile, Table on Desktop) */}
      <div className="space-y-2">
        {/* Mobile View */}
        <div className="block lg:hidden space-y-2">
          {duesList.map((item) => {
            const isPaid = !!item.months[selectedMonth]?.paid;
            return (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs flex items-center justify-between gap-2.5"
              >
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#333333] truncate">{item.wargaName}</h4>
                  <div className="text-[10px] text-[#777777] mt-0.5">{item.addressBlock}</div>
                  <div className="flex items-center gap-0.5 mt-1.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => {
                      const paid = !!item.months[m]?.paid;
                      return (
                        <span
                          key={m}
                          className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center text-[8px] font-bold ${
                            paid ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-300'
                          } ${m === selectedMonth ? 'ring-1 ring-[#E53935]' : ''}`}
                        >
                          {m}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => toggleMonthlyDue(item.id, selectedMonth, !isPaid)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                      isPaid
                        ? 'bg-amber-50 text-[#FF8F00] border border-amber-200'
                        : 'bg-red-50 text-[#E53935] border border-red-200'
                    }`}
                  >
                    {isPaid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    <span>{isPaid ? 'Lunas' : 'Belum'}</span>
                  </button>

                  {!isPaid && (
                    <button
                      onClick={() => handleSendReminderWA(item.wargaName, item.addressBlock)}
                      className="p-1 rounded-lg bg-red-50 text-[#E53935] hover:bg-red-100 border border-red-200"
                      title="Kirim Pesan WhatsApp"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block bg-white rounded-2xl border border-[#F1E1DC] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF8F5] border-b border-[#F1E1DC] text-[#777777] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Kepala Keluarga</th>
                  <th className="py-2.5 px-3">Blok</th>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                    <th
                      key={m}
                      className={`py-2.5 px-2 text-center text-[10px] ${
                        m === selectedMonth ? 'bg-red-50 text-[#E53935] font-black' : ''
                      }`}
                    >
                      Bln {m}
                    </th>
                  ))}
                  <th className="py-2.5 px-3 text-right">Aksi Bulan Ini</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1E1DC]/60">
                {duesList.map((item) => {
                  const isCurrentPaid = !!item.months[selectedMonth]?.paid;
                  return (
                    <tr key={item.id} className="hover:bg-[#FFF8F5]/60 transition">
                      <td className="py-2.5 px-3 font-bold text-[#333333]">{item.wargaName}</td>
                      <td className="py-2.5 px-3 text-[#777777]">{item.addressBlock}</td>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => {
                        const paid = !!item.months[m]?.paid;
                        return (
                          <td key={m} className="py-2.5 px-2 text-center">
                            <button
                              onClick={() => toggleMonthlyDue(item.id, m, !paid)}
                              className={`w-6 h-6 mx-auto rounded flex items-center justify-center text-[10px] font-bold transition cursor-pointer ${
                                paid
                                  ? 'bg-amber-400 text-white'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-400'
                              } ${m === selectedMonth ? 'ring-2 ring-[#E53935]' : ''}`}
                            >
                              {paid ? '✓' : '-'}
                            </button>
                          </td>
                        );
                      })}
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toggleMonthlyDue(item.id, selectedMonth, !isCurrentPaid)}
                            className={`px-2 py-1 rounded-md text-[10px] font-bold cursor-pointer ${
                              isCurrentPaid
                                ? 'bg-amber-50 text-[#FF8F00] border border-amber-200'
                                : 'bg-red-50 text-[#E53935] border border-red-200'
                            }`}
                          >
                            {isCurrentPaid ? 'Batalkan' : 'Set Lunas'}
                          </button>
                          {!isCurrentPaid && (
                            <button
                              onClick={() => handleSendReminderWA(item.wargaName, item.addressBlock)}
                              className="px-2 py-1 rounded-md text-[10px] font-bold bg-gradient-to-r from-[#E53935] to-[#FF8F00] text-white flex items-center gap-1 cursor-pointer"
                            >
                              <Send className="w-3 h-3" /> WA
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Blast Modal */}
      {blastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/50 backdrop-blur-xs no-print">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#F1E1DC] shadow-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1E1DC]">
              <h3 className="text-sm font-extrabold text-[#333333]">Format Pesan Pengingat Iuran</h3>
              <button onClick={() => setBlastModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-[#777777]">
              Pesan ramah dikirimkan otomatis ke WhatsApp masing-masing warga yang belum melunasi kas bulan {monthNames[selectedMonth - 1]}.
            </p>

            <textarea
              rows={6}
              value={customTemplate}
              onChange={(e) => setCustomTemplate(e.target.value)}
              className="w-full p-2.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs font-mono leading-relaxed"
            />

            <div className="flex items-center justify-between pt-2 border-t border-[#F1E1DC]">
              <button
                onClick={handleCopyBlastMessage}
                className="px-3 py-1.5 rounded-xl border border-[#F1E1DC] text-xs font-bold text-[#777777] flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" /> Salin Template
              </button>
              <button
                onClick={() => setBlastModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#E53935] to-[#FF8F00] text-white text-xs font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
