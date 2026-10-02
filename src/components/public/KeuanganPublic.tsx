import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Eye,
  Calendar,
  Tag,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  FileSpreadsheet,
  Download,
  Info,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { FinancialTransaction } from '../../types';
import { ReceiptViewerModal } from '../common/ReceiptViewerModal';

export const KeuanganPublic: React.FC = () => {
  const { transactions, cashStats, setActiveTab } = useApp();

  const [selectedReceipt, setSelectedReceipt] = useState<FinancialTransaction | null>(null);
  const [selectedType, setSelectedType] = useState<string>('ALL'); // ALL, PEMASUKAN, PENGELUARAN
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeViewTab, setActiveViewTab] = useState<'transaksi' | 'grafik'>('transaksi');

  // Filter only published transactions for public
  const publishedTrx = useMemo(() => {
    return transactions.filter((t) => t.status === 'DIPUBLIKASIKAN');
  }, [transactions]);

  // Extract distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    publishedTrx.forEach((t) => set.add(t.category));
    return Array.from(set);
  }, [publishedTrx]);

  // Apply filters
  const filteredTrx = useMemo(() => {
    return publishedTrx.filter((trx) => {
      if (selectedType !== 'ALL' && trx.type !== selectedType) return false;
      const d = new Date(trx.date);
      if (selectedYear !== 'ALL' && d.getFullYear().toString() !== selectedYear) return false;
      if (selectedMonth !== 'ALL' && (d.getMonth() + 1).toString() !== selectedMonth) return false;
      if (selectedCategory !== 'ALL' && trx.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTrx = trx.trxNumber.toLowerCase().includes(q);
        const matchDesc = trx.description.toLowerCase().includes(q);
        const matchCat = trx.category.toLowerCase().includes(q);
        const matchSource = trx.sourceOrRecipient.toLowerCase().includes(q);
        if (!matchTrx && !matchDesc && !matchCat && !matchSource) return false;
      }
      return true;
    });
  }, [publishedTrx, selectedType, selectedYear, selectedMonth, selectedCategory, searchQuery]);

  // Calculations for filtered selection
  const filterSummary = useMemo(() => {
    let income = 0;
    let expense = 0;

    filteredTrx.forEach((t) => {
      const amt = Number(t.amount) || 0;
      if (t.type === 'PEMASUKAN') income += amt;
      else if (t.type === 'PENGELUARAN') expense += amt;
    });

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [filteredTrx]);

  // Monthly stats for chart
  const monthlyChartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    const chartYear = selectedYear !== 'ALL' ? parseInt(selectedYear) : 2026;

    return months.map((name, index) => {
      const monthNum = index + 1;
      let income = 0;
      let expense = 0;

      publishedTrx.forEach((t) => {
        const d = new Date(t.date);
        if (d.getFullYear() === chartYear && d.getMonth() + 1 === monthNum) {
          if (t.type === 'PEMASUKAN') income += Number(t.amount);
          if (t.type === 'PENGELUARAN') expense += Number(t.amount);
        }
      });

      return {
        month: name,
        monthNum,
        income,
        expense,
      };
    });
  }, [publishedTrx, selectedYear]);

  // Expense breakdown by category
  const expenseByCategory = useMemo(() => {
    const map: { [key: string]: number } = {};
    let total = 0;

    filteredTrx
      .filter((t) => t.type === 'PENGELUARAN')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + Number(t.amount);
        total += Number(t.amount);
      });

    const list = Object.entries(map).map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
    }));

    return list.sort((a, b) => b.amount - a.amount);
  }, [filteredTrx]);

  const maxChartVal = Math.max(
    ...monthlyChartData.map((d) => Math.max(d.income, d.expense)),
    1000000
  );

  const handleExportCSV = () => {
    const headers = ['Nomor Transaksi', 'Tanggal', 'Jenis', 'Kategori', 'Keterangan', 'Sumber/Penerima', 'Nominal (Rp)'];
    const rows = filteredTrx.map((t) => [
      t.trxNumber,
      t.date,
      t.type,
      `"${t.category}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.sourceOrRecipient.replace(/"/g, '""')}"`,
      t.amount,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transaksi-kas-rt-${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Page Title Strip */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base sm:text-xl font-black text-[#333333]">
            Transparansi Kas & Keuangan RT
          </h2>
          <p className="text-[11px] text-[#777777]">
            Laporan terbuka seluruh penerimaan & belanja kas warga.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('laporan')}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-[#F1E1DC] text-[#E53935] font-bold text-xs shadow-2xs hover:bg-[#FFF8F5] transition"
          >
            Laporan Resmi
          </button>
          <button
            onClick={handleExportCSV}
            className="p-1.5 rounded-xl bg-white border border-[#F1E1DC] text-[#555555] hover:text-[#333333]"
            title="Download CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TOP SUMMARY CARDS (Saldo Saat Ini, Total Pemasukan, Total Pengeluaran) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Card 1: Saldo Kas */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#E53935] to-[#FF8F00] text-white shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-white/90 font-bold uppercase tracking-wider">
            <span>Saldo Kas RT Saat Ini</span>
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <div className="text-xl sm:text-2xl font-black my-1">
            Rp {cashStats.currentBalance.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-amber-100">
            Saldo Awal: Rp {cashStats.initialBalance.toLocaleString('id-ID')}
          </div>
        </div>

        {/* Card 2: Total Pemasukan */}
        <div className="p-4 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#777777] font-semibold">
            <span>Total Pemasukan</span>
            <span className="p-1 rounded-md bg-amber-50 text-[#FF8F00]">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-lg sm:text-xl font-black text-[#FF8F00] my-1">
            +Rp {cashStats.totalPemasukan.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-[#777777]">
            Bulan Ini: +Rp {cashStats.pemasukanBulanIni.toLocaleString('id-ID')}
          </div>
        </div>

        {/* Card 3: Total Pengeluaran */}
        <div className="p-4 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#777777] font-semibold">
            <span>Total Pengeluaran</span>
            <span className="p-1 rounded-md bg-red-50 text-[#E53935]">
              <ArrowDownRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-lg sm:text-xl font-black text-[#E53935] my-1">
            -Rp {cashStats.totalPengeluaran.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-[#777777]">
            Bulan Ini: -Rp {cashStats.pengeluaranBulanIni.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS & COMPACT TABS */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari transaksi, nomor, kategori..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#E53935]"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 self-start sm:self-auto bg-[#FFF8F5] p-1 rounded-xl border border-[#F1E1DC]">
            <button
              onClick={() => setActiveViewTab('transaksi')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                activeViewTab === 'transaksi'
                  ? 'bg-[#E53935] text-white shadow-xs'
                  : 'text-[#555555] hover:text-[#333333]'
              }`}
            >
              Daftar ({filteredTrx.length})
            </button>
            <button
              onClick={() => setActiveViewTab('grafik')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                activeViewTab === 'grafik'
                  ? 'bg-[#E53935] text-white shadow-xs'
                  : 'text-[#555555] hover:text-[#333333]'
              }`}
            >
              Grafik
            </button>
          </div>
        </div>

        {/* Compact Filters Row */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="py-1 px-2 bg-[#FFF8F5] border border-[#F1E1DC] rounded-lg text-[11px] font-bold text-[#333333]"
          >
            <option value="ALL">Semua Jenis</option>
            <option value="PEMASUKAN">Pemasukan (+)</option>
            <option value="PENGELUARAN">Pengeluaran (-)</option>
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="py-1 px-2 bg-[#FFF8F5] border border-[#F1E1DC] rounded-lg text-[11px] font-bold text-[#333333]"
          >
            <option value="ALL">Semua Bulan</option>
            <option value="1">Januari</option>
            <option value="2">Februari</option>
            <option value="3">Maret</option>
            <option value="4">April</option>
            <option value="5">Mei</option>
            <option value="6">Juni</option>
            <option value="7">Juli</option>
            <option value="8">Agustus</option>
            <option value="9">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-1 px-2 bg-[#FFF8F5] border border-[#F1E1DC] rounded-lg text-[11px] font-bold text-[#333333]"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Net Balance Banner */}
        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#F1E1DC] text-[#777777]">
          <span>Net Filter: <strong>Rp {filterSummary.balance.toLocaleString('id-ID')}</strong></span>
          <div className="flex gap-2 font-semibold">
            <span className="text-[#FF8F00]">+Rp {filterSummary.income.toLocaleString('id-ID')}</span>
            <span className="text-[#E53935]">-Rp {filterSummary.expense.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      {/* VIEW TAB 1: DAFTAR TRANSAKSI (Mobile Card List + Desktop Table) */}
      {activeViewTab === 'transaksi' && (
        <div className="space-y-2">
          {/* MOBILE LIST VIEW (block lg:hidden) - Desain Card Ringkas Sesuai Prompt */}
          <div className="block lg:hidden space-y-2">
            {filteredTrx.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#777777] bg-white rounded-2xl border border-[#F1E1DC]">
                Tidak ada transaksi yang cocok.
              </div>
            ) : (
              filteredTrx.map((trx) => {
                const isIncome = trx.type === 'PEMASUKAN';
                return (
                  <div
                    key={trx.id}
                    onClick={() => setSelectedReceipt(trx)}
                    className="p-3 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs active:bg-[#FFF8F5] transition flex items-center justify-between gap-3 cursor-pointer"
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
                        <div className="text-[10px] text-[#777777] flex items-center gap-1">
                          <span>{trx.date}</span>
                          <span>·</span>
                          <span className="truncate">{trx.category}</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#333333] truncate mt-0.5">
                          {trx.description}
                        </h4>
                        <div className="text-[10px] text-[#777777] truncate">
                          {isIncome ? `Dari: ${trx.sourceOrRecipient}` : `Ke: ${trx.sourceOrRecipient}`}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`text-xs font-black ${
                          isIncome ? 'text-[#FF8F00]' : 'text-[#E53935]'
                        }`}
                      >
                        {isIncome ? '+ ' : '- '}Rp {trx.amount.toLocaleString('id-ID')}
                      </div>
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#E53935] mt-0.5">
                        Lihat Detail <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* DESKTOP TABLE VIEW (hidden lg:block) */}
          <div className="hidden lg:block bg-white rounded-2xl border border-[#F1E1DC] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFF8F5] border-b border-[#F1E1DC] text-[#777777] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Tanggal & No. Trx</th>
                    <th className="py-3 px-4">Jenis</th>
                    <th className="py-3 px-4">Kategori & Keterangan</th>
                    <th className="py-3 px-4">Sumber / Penerima</th>
                    <th className="py-3 px-4 text-right">Nominal</th>
                    <th className="py-3 px-4 text-center">Bukti</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1E1DC]/60">
                  {filteredTrx.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Tidak ada transaksi pada filter ini.
                      </td>
                    </tr>
                  ) : (
                    filteredTrx.map((trx) => {
                      const isIncome = trx.type === 'PEMASUKAN';
                      return (
                        <tr key={trx.id} className="hover:bg-[#FFF8F5]/60 transition">
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="font-bold text-[#333333]">{trx.date}</div>
                            <div className="text-[10px] font-mono text-[#777777]">{trx.trxNumber}</div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                isIncome ? 'bg-amber-100 text-[#FF8F00]' : 'bg-red-100 text-[#E53935]'
                              }`}
                            >
                              {trx.type}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-[#333333]">{trx.description}</div>
                            <div className="text-[10px] text-[#777777]">{trx.category}</div>
                          </td>
                          <td className="py-3 px-4 text-[#555555]">{trx.sourceOrRecipient}</td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div
                              className={`font-black ${
                                isIncome ? 'text-[#FF8F00]' : 'text-[#E53935]'
                              }`}
                            >
                              {isIncome ? '+ ' : '- '}Rp {trx.amount.toLocaleString('id-ID')}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            {trx.receiptUrl ? (
                              <button
                                onClick={() => setSelectedReceipt(trx)}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#E53935] bg-red-50 hover:bg-red-100 border border-red-200 transition"
                              >
                                Lihat Bukti
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-300">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW TAB 2: GRAFIK & ANALISIS (Compact & Clean) */}
      {activeViewTab === 'grafik' && (
        <div className="space-y-4">
          {/* Monthly Comparison Bar Chart */}
          <div className="p-4 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-extrabold text-[#333333]">
                Pemasukan vs Pengeluaran (Tahun {selectedYear !== 'ALL' ? selectedYear : 2026})
              </h3>
              <div className="flex items-center gap-3 text-[11px] font-bold">
                <span className="flex items-center gap-1 text-[#FF8F00]">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#FF8F00]"></span> Pemasukan
                </span>
                <span className="flex items-center gap-1 text-[#E53935]">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#E53935]"></span> Pengeluaran
                </span>
              </div>
            </div>

            {/* Compact SVG Bar Chart */}
            <div className="pt-4 pb-1">
              <div className="h-44 flex items-end justify-between gap-1 border-b border-[#F1E1DC] pb-1">
                {monthlyChartData.map((item) => {
                  const incomeH = Math.max(3, Math.round((item.income / maxChartVal) * 140));
                  const expenseH = Math.max(3, Math.round((item.expense / maxChartVal) * 140));

                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <div className="w-full max-w-[20px] flex items-end justify-center gap-0.5 h-full">
                        <div
                          style={{ height: `${item.income > 0 ? incomeH : 3}px` }}
                          className={`w-1/2 rounded-t-xs ${item.income > 0 ? 'bg-[#FF8F00]' : 'bg-slate-100'}`}
                        />
                        <div
                          style={{ height: `${item.expense > 0 ? expenseH : 3}px` }}
                          className={`w-1/2 rounded-t-xs ${item.expense > 0 ? 'bg-[#E53935]' : 'bg-slate-100'}`}
                        />
                      </div>
                      <span className="text-[9px] font-semibold text-[#777777]">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Expense Category Breakdown */}
          <div className="p-4 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs space-y-2.5">
            <h3 className="text-xs sm:text-sm font-extrabold text-[#333333]">
              Komposisi Pengeluaran per Kategori
            </h3>
            <div className="space-y-2">
              {expenseByCategory.map((cat) => (
                <div key={cat.category} className="space-y-0.5 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-[#333333]">{cat.category}</span>
                    <span className="text-[#E53935]">Rp {cat.amount.toLocaleString('id-ID')} ({cat.percentage}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#E53935] rounded-full" style={{ width: `${cat.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Receipt Viewer Modal */}
      <ReceiptViewerModal
        transaction={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
};
