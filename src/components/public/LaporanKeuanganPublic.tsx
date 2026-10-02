import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Calendar,
  Building2,
  CheckCircle,
} from 'lucide-react';

export const LaporanKeuanganPublic: React.FC = () => {
  const { settings, transactions } = useApp();

  const [periodType, setPeriodType] = useState<'bulanan' | 'triwulan' | 'semester' | 'tahunan'>('bulanan');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(10);
  const [selectedQuarter, setSelectedQuarter] = useState<number>(3);
  const [selectedSemester, setSelectedSemester] = useState<number>(2);

  // Filter published transactions based on period
  const reportData = useMemo(() => {
    const published = transactions.filter((t) => t.status === 'DIPUBLIKASIKAN');

    let periodTitle = '';
    let isMatching = (_dateStr: string) => false;

    if (periodType === 'bulanan') {
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      periodTitle = `BULAN ${monthNames[selectedMonth - 1].toUpperCase()} ${selectedYear}`;
      isMatching = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth;
      };
    } else if (periodType === 'triwulan') {
      const qNames = ['TRIWULAN I (JAN - MAR)', 'TRIWULAN II (APR - JUN)', 'TRIWULAN III (JUL - SEP)', 'TRIWULAN IV (OKT - DES)'];
      periodTitle = `${qNames[selectedQuarter - 1]} TAHUN ${selectedYear}`;
      isMatching = (dateStr: string) => {
        const d = new Date(dateStr);
        if (d.getFullYear() !== selectedYear) return false;
        const m = d.getMonth() + 1;
        if (selectedQuarter === 1) return m >= 1 && m <= 3;
        if (selectedQuarter === 2) return m >= 4 && m <= 6;
        if (selectedQuarter === 3) return m >= 7 && m <= 9;
        return m >= 10 && m <= 12;
      };
    } else if (periodType === 'semester') {
      periodTitle = `SEMESTER ${selectedSemester === 1 ? 'I (JANUARI - JUNI)' : 'II (JULI - DESEMBER)'} TAHUN ${selectedYear}`;
      isMatching = (dateStr: string) => {
        const d = new Date(dateStr);
        if (d.getFullYear() !== selectedYear) return false;
        const m = d.getMonth() + 1;
        return selectedSemester === 1 ? m >= 1 && m <= 6 : m >= 7 && m <= 12;
      };
    } else {
      periodTitle = `TAHUN ANGGARAN ${selectedYear}`;
      isMatching = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.getFullYear() === selectedYear;
      };
    }

    const currentPeriodTrx = published.filter((t) => isMatching(t.date));

    // Calculate initial balance for this period
    let priorIncome = 0;
    let priorExpense = 0;

    published.forEach((t) => {
      const d = new Date(t.date);
      let isPrior = false;

      if (periodType === 'bulanan') {
        isPrior = d.getFullYear() < selectedYear || (d.getFullYear() === selectedYear && d.getMonth() + 1 < selectedMonth);
      } else if (periodType === 'triwulan') {
        const minMonth = (selectedQuarter - 1) * 3 + 1;
        isPrior = d.getFullYear() < selectedYear || (d.getFullYear() === selectedYear && d.getMonth() + 1 < minMonth);
      } else if (periodType === 'semester') {
        const minMonth = selectedSemester === 1 ? 1 : 7;
        isPrior = d.getFullYear() < selectedYear || (d.getFullYear() === selectedYear && d.getMonth() + 1 < minMonth);
      } else {
        isPrior = d.getFullYear() < selectedYear;
      }

      if (isPrior) {
        if (t.type === 'PEMASUKAN') priorIncome += Number(t.amount);
        if (t.type === 'PENGELUARAN') priorExpense += Number(t.amount);
      }
    });

    const baseInitial = Number(settings.initialCashBalance) || 0;
    const periodInitialBalance = baseInitial + priorIncome - priorExpense;

    let periodIncome = 0;
    let periodExpense = 0;

    const incomeList: typeof published = [];
    const expenseList: typeof published = [];

    currentPeriodTrx.forEach((t) => {
      const amt = Number(t.amount);
      if (t.type === 'PEMASUKAN') {
        periodIncome += amt;
        incomeList.push(t);
      } else {
        periodExpense += amt;
        expenseList.push(t);
      }
    });

    const periodEndingBalance = periodInitialBalance + periodIncome - periodExpense;

    return {
      periodTitle,
      periodInitialBalance,
      periodIncome,
      periodExpense,
      periodEndingBalance,
      incomeList,
      expenseList,
      totalCount: currentPeriodTrx.length,
    };
  }, [transactions, periodType, selectedYear, selectedMonth, selectedQuarter, selectedSemester, settings.initialCashBalance]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Controls & Title (Hidden in Print) */}
      <div className="no-print space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div>
            <h2 className="text-base sm:text-xl font-black text-[#333333]">
              Laporan Keuangan Resmi Kas RT
            </h2>
            <p className="text-[11px] text-[#777777]">
              Laporan pertanggungjawaban kas periodik berformat standar pemerintahan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E53935] to-[#FF8F00] text-white text-xs font-bold shadow-xs hover:opacity-95 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Cetak PDF</span>
            </button>
          </div>
        </div>

        {/* Compact Period Selectors */}
        <div className="p-3 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs space-y-2">
          {/* Period Type Segmented Buttons */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-[#FFF8F5] rounded-xl border border-[#F1E1DC]">
            {[
              { id: 'bulanan', label: 'Bulanan' },
              { id: 'triwulan', label: 'Triwulan' },
              { id: 'semester', label: 'Semester' },
              { id: 'tahunan', label: 'Tahunan' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPeriodType(tab.id as any)}
                className={`py-1.5 text-xs font-bold rounded-lg transition text-center ${
                  periodType === tab.id
                    ? 'bg-[#E53935] text-white shadow-xs'
                    : 'text-[#555555] hover:text-[#333333]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sub Selectors */}
          <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#777777] text-[11px]">Tahun:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="py-1 px-2.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-lg text-xs font-bold text-[#333333]"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
              </select>
            </div>

            {periodType === 'bulanan' && (
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#777777] text-[11px]">Bulan:</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="py-1 px-2.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-lg text-xs font-bold text-[#333333]"
                >
                  <option value={1}>Januari</option>
                  <option value={2}>Februari</option>
                  <option value={3}>Maret</option>
                  <option value={4}>April</option>
                  <option value={5}>Mei</option>
                  <option value={6}>Juni</option>
                  <option value={7}>Juli</option>
                  <option value={8}>Agustus</option>
                  <option value={9}>September</option>
                  <option value={10}>Oktober</option>
                  <option value={11}>November</option>
                  <option value={12}>Desember</option>
                </select>
              </div>
            )}

            {periodType === 'triwulan' && (
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#777777] text-[11px]">Triwulan:</span>
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(parseInt(e.target.value))}
                  className="py-1 px-2.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-lg text-xs font-bold text-[#333333]"
                >
                  <option value={1}>Triwulan I (Jan - Mar)</option>
                  <option value={2}>Triwulan II (Apr - Jun)</option>
                  <option value={3}>Triwulan III (Jul - Sep)</option>
                  <option value={4}>Triwulan IV (Okt - Des)</option>
                </select>
              </div>
            )}

            {periodType === 'semester' && (
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#777777] text-[11px]">Semester:</span>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
                  className="py-1 px-2.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-lg text-xs font-bold text-[#333333]"
                >
                  <option value={1}>Semester I (Jan - Jun)</option>
                  <option value={2}>Semester II (Jul - Des)</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DOCUMENT PREVIEW CONTAINER (Official Kop RT, Printable) */}
      <div className="bg-white rounded-3xl border border-[#F1E1DC] p-5 sm:p-10 shadow-xs print:shadow-none print:border-none print:p-0">
        {/* OFFICIAL KOP RT */}
        <div className="border-b-4 border-double border-slate-900 pb-4 text-center">
          <div className="text-xs sm:text-sm font-bold tracking-widest text-slate-900 uppercase">
            PEMERINTAH {settings.city.toUpperCase()}
          </div>
          <div className="text-[11px] sm:text-xs font-bold tracking-wider text-slate-800 uppercase mt-0.5">
            KECAMATAN {settings.kecamatan.toUpperCase()} • KELURAHAN {settings.kelurahan.toUpperCase()}
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 tracking-wide mt-1">
            RUKUN TETANGGA {settings.rtNumber} / RUKUN WARGA {settings.rwNumber}
          </div>
          <div className="text-[10px] text-slate-600 mt-1">
            Sekretariat: {settings.address} • Telp/WA: {settings.phone} • Email: {settings.email}
          </div>
        </div>

        {/* REPORT TITLE */}
        <div className="text-center my-4">
          <h3 className="text-base sm:text-lg font-black uppercase text-slate-900 underline underline-offset-4">
            LAPORAN KAS & KEUANGAN RT
          </h3>
          <p className="text-xs font-bold text-slate-700 mt-0.5 uppercase tracking-wide">
            {reportData.periodTitle}
          </p>
        </div>

        {/* SUMMARY BALANCE BOX (FORMULA RT) */}
        <div className="mb-4 p-3 rounded-xl border border-slate-300 bg-slate-50/50">
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 font-bold text-slate-700">1. SALDO AWAL PERIODE</td>
                <td className="py-1.5 text-right font-black text-slate-900">
                  Rp {reportData.periodInitialBalance.toLocaleString('id-ID')}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 font-bold text-[#FF8F00]">2. TOTAL PEMASUKAN KAS (+)</td>
                <td className="py-1.5 text-right font-black text-[#FF8F00]">
                  + Rp {reportData.periodIncome.toLocaleString('id-ID')}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 font-bold text-[#E53935]">3. TOTAL PENGELUARAN KAS (-)</td>
                <td className="py-1.5 text-right font-black text-[#E53935]">
                  - Rp {reportData.periodExpense.toLocaleString('id-ID')}
                </td>
              </tr>
              <tr className="bg-red-50 font-black">
                <td className="py-2 px-2 text-[#333333] uppercase">4. SALDO AKHIR PERIODE (=)</td>
                <td className="py-2 px-2 text-right text-[#E53935] text-sm sm:text-base">
                  Rp {reportData.periodEndingBalance.toLocaleString('id-ID')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECTION A: DAFTAR PEMASUKAN */}
        <div className="space-y-1.5 mb-5 overflow-x-auto">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
            A. Rincian Pemasukan Kas (Total: Rp {reportData.periodIncome.toLocaleString('id-ID')})
          </h4>
          <table className="w-full text-xs border border-slate-300 border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700">
                <th className="p-1.5 text-center border-r border-slate-300 w-8">No</th>
                <th className="p-1.5 text-left border-r border-slate-300 w-20">Tanggal</th>
                <th className="p-1.5 text-left border-r border-slate-300 w-24">No. Trx</th>
                <th className="p-1.5 text-left border-r border-slate-300">Uraian</th>
                <th className="p-1.5 text-left border-r border-slate-300">Sumber</th>
                <th className="p-1.5 text-right w-24">Jumlah (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {reportData.incomeList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-3 text-center text-slate-400 italic">
                    Tidak ada transaksi pemasukan pada periode ini.
                  </td>
                </tr>
              ) : (
                reportData.incomeList.map((t, idx) => (
                  <tr key={t.id} className="border-b border-slate-200">
                    <td className="p-1.5 text-center border-r border-slate-200">{idx + 1}</td>
                    <td className="p-1.5 border-r border-slate-200">{t.date}</td>
                    <td className="p-1.5 border-r border-slate-200 font-mono text-[10px]">{t.trxNumber}</td>
                    <td className="p-1.5 border-r border-slate-200 font-semibold text-slate-800">
                      [{t.category}] {t.description}
                    </td>
                    <td className="p-1.5 border-r border-slate-200 text-slate-600">{t.sourceOrRecipient}</td>
                    <td className="p-1.5 text-right font-bold text-slate-900">
                      {t.amount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-bold border-t border-slate-300">
                <td colSpan={5} className="p-1.5 text-right border-r border-slate-300">TOTAL PEMASUKAN</td>
                <td className="p-1.5 text-right text-[#FF8F00]">
                  Rp {reportData.periodIncome.toLocaleString('id-ID')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* SECTION B: DAFTAR PENGELUARAN */}
        <div className="space-y-1.5 mb-6 overflow-x-auto">
          <h4 className="text-xs font-bold uppercase tracking-wider text-red-900 bg-red-50 p-1.5 rounded-lg border border-red-200">
            B. Rincian Pengeluaran Kas (Total: Rp {reportData.periodExpense.toLocaleString('id-ID')})
          </h4>
          <table className="w-full text-xs border border-slate-300 border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700">
                <th className="p-1.5 text-center border-r border-slate-300 w-8">No</th>
                <th className="p-1.5 text-left border-r border-slate-300 w-20">Tanggal</th>
                <th className="p-1.5 text-left border-r border-slate-300 w-24">No. Trx</th>
                <th className="p-1.5 text-left border-r border-slate-300">Uraian</th>
                <th className="p-1.5 text-left border-r border-slate-300">Penerima</th>
                <th className="p-1.5 text-right w-24">Jumlah (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {reportData.expenseList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-3 text-center text-slate-400 italic">
                    Tidak ada transaksi pengeluaran pada periode ini.
                  </td>
                </tr>
              ) : (
                reportData.expenseList.map((t, idx) => (
                  <tr key={t.id} className="border-b border-slate-200">
                    <td className="p-1.5 text-center border-r border-slate-200">{idx + 1}</td>
                    <td className="p-1.5 border-r border-slate-200">{t.date}</td>
                    <td className="p-1.5 border-r border-slate-200 font-mono text-[10px]">{t.trxNumber}</td>
                    <td className="p-1.5 border-r border-slate-200 font-semibold text-slate-800">
                      [{t.category}] {t.description}
                    </td>
                    <td className="p-1.5 border-r border-slate-200 text-slate-600">{t.sourceOrRecipient}</td>
                    <td className="p-1.5 text-right font-bold text-slate-900">
                      {t.amount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-bold border-t border-slate-300">
                <td colSpan={5} className="p-1.5 text-right border-r border-slate-300">TOTAL PENGELUARAN</td>
                <td className="p-1.5 text-right text-[#E53935]">
                  Rp {reportData.periodExpense.toLocaleString('id-ID')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* SIGNATURE / PENGESAHAN BLOCKS */}
        <div className="pt-4 border-t border-slate-300 grid grid-cols-2 text-center text-xs">
          <div className="space-y-1">
            <p className="text-slate-500">Mengetahui,</p>
            <p className="font-bold text-slate-900">Ketua RT {settings.rtNumber}</p>
            <div className="h-12" />
            <p className="font-bold text-slate-900 underline underline-offset-2">{settings.leadName}</p>
            <p className="text-[10px] text-slate-500">Ketua RT Periode {settings.period}</p>
          </div>

          <div className="space-y-1">
            <p className="text-slate-500">{settings.city}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="font-bold text-slate-900">Bendahara RT {settings.rtNumber}</p>
            <div className="h-12" />
            <p className="font-bold text-slate-900 underline underline-offset-2">{settings.treasurerName}</p>
            <p className="text-[10px] text-slate-500">Bendahara Kas RT</p>
          </div>
        </div>
      </div>
    </div>
  );
};
