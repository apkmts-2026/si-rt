import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Home,
  ShieldAlert,
  UserCheck,
  Heart,
  Baby,
  GraduationCap,
  Briefcase,
} from 'lucide-react';

export const DataWargaPublic: React.FC = () => {
  const { demographics, wargaList, settings } = useApp();

  const blockStats = useMemo(() => {
    const map: { [blockPrefix: string]: number } = {};
    wargaList.forEach((w) => {
      const match = w.addressBlock.match(/Blok\s+[A-Z0-9]+/i);
      const key = match ? match[0].toUpperCase() : 'Lainnya';
      map[key] = (map[key] || 0) + 1;
    });

    return Object.entries(map).map(([block, count]) => ({
      block,
      count,
      percentage: Math.round((count / wargaList.length) * 100),
    }));
  }, [wargaList]);

  const occupationStats = useMemo(() => {
    const map: { [key: string]: number } = {};
    wargaList.forEach((w) => {
      const occ = w.occupation || 'Lain-lain';
      map[occ] = (map[occ] || 0) + 1;
    });
    return Object.entries(map)
      .map(([occupation, count]) => ({ occupation, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [wargaList]);

  const malePercent = Math.round((demographics.maleCount / (demographics.totalWarga || 1)) * 100);
  const femalePercent = 100 - malePercent;

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="px-1">
        <h2 className="text-base sm:text-xl font-black text-[#333333]">
          Statistik Kependudukan Warga RT {settings.rtNumber}
        </h2>
        <p className="text-[11px] text-[#777777]">
          Informasi demografi agregat warga RW {settings.rwNumber}.
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-[#FF8F00] shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed text-[#777777]">
          Data pribadi sensitif seperti NIK dan nomor KK dilindungi sesuai regulasi privasi & UU PDP dan tidak ditampilkan kepada publik secara umum.
        </p>
      </div>

      {/* 4 Main Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-3 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs">
          <div className="text-[10px] text-[#777777] font-semibold">Total Warga</div>
          <div className="text-xl font-black text-[#E53935] mt-0.5">
            {demographics.totalWarga} <span className="text-xs font-normal text-[#777777]">Jiwa</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs">
          <div className="text-[10px] text-[#777777] font-semibold">Kepala Keluarga</div>
          <div className="text-xl font-black text-[#FF8F00] mt-0.5">
            {demographics.totalKK} <span className="text-xs font-normal text-[#777777]">KK</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs">
          <div className="text-[10px] text-[#777777] font-semibold">Laki-Laki</div>
          <div className="text-xl font-black text-[#333333] mt-0.5">
            {demographics.maleCount} <span className="text-xs font-normal text-[#777777]">({malePercent}%)</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs">
          <div className="text-[10px] text-[#777777] font-semibold">Perempuan</div>
          <div className="text-xl font-black text-[#333333] mt-0.5">
            {demographics.femaleCount} <span className="text-xs font-normal text-[#777777]">({femalePercent}%)</span>
          </div>
        </div>
      </div>

      {/* Age Groups Distribution (Compact Grid) */}
      <div className="p-4 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs space-y-3">
        <h3 className="text-xs sm:text-sm font-extrabold text-[#333333]">
          Klasifikasi Kelompok Usia
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-[#FFF8F5] border border-[#F1E1DC]">
            <div className="text-[10px] text-[#777777] font-bold uppercase">Anak (0-12)</div>
            <div className="text-base font-black text-[#E53935] mt-0.5">{demographics.anakCount} Anak</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FFF8F5] border border-[#F1E1DC]">
            <div className="text-[10px] text-[#777777] font-bold uppercase">Remaja (13-20)</div>
            <div className="text-base font-black text-[#FF8F00] mt-0.5">{demographics.remajaCount} Jiwa</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FFF8F5] border border-[#F1E1DC]">
            <div className="text-[10px] text-[#777777] font-bold uppercase">Dewasa (21-59)</div>
            <div className="text-base font-black text-[#333333] mt-0.5">{demographics.dewasaCount} Jiwa</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FFF8F5] border border-[#F1E1DC]">
            <div className="text-[10px] text-[#777777] font-bold uppercase">Lansia (60+)</div>
            <div className="text-base font-black text-[#C62828] mt-0.5">{demographics.lansiaCount} Jiwa</div>
          </div>
        </div>
      </div>

      {/* Blok & Profesi Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Sebaran Blok */}
        <div className="p-4 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs space-y-2">
          <h3 className="text-xs sm:text-sm font-extrabold text-[#333333]">Sebaran per Blok</h3>
          <div className="space-y-1.5 pt-1">
            {blockStats.map((b) => (
              <div key={b.block} className="space-y-0.5 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#333333]">{b.block}</span>
                  <span className="text-[#777777]">{b.count} Warga ({b.percentage}%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#E53935] rounded-full" style={{ width: `${b.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profesi */}
        <div className="p-4 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs space-y-2">
          <h3 className="text-xs sm:text-sm font-extrabold text-[#333333]">Ragam Profesi Warga</h3>
          <div className="space-y-1.5 pt-1">
            {occupationStats.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-xl bg-[#FFF8F5] border border-[#F1E1DC] text-xs"
              >
                <span className="font-semibold text-[#333333]">{item.occupation}</span>
                <span className="font-bold text-[#E53935]">{item.count} Orang</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
