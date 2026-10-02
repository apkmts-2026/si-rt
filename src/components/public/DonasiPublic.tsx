import React from 'react';
import { useApp } from '../../context/AppContext';
import { HeartHandshake, Users } from 'lucide-react';

export const DonasiPublic: React.FC = () => {
  const { donasiList, settings } = useApp();

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="px-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#E53935] text-[10px] font-bold mb-0.5 border border-red-100">
          <HeartHandshake className="w-3 h-3 text-[#E53935]" />
          <span>Gotong Royong & Sumbangan Swadaya</span>
        </div>
        <h2 className="text-base sm:text-xl font-black text-[#333333]">
          Transparansi Donasi RT {settings.rtNumber}
        </h2>
        <p className="text-[11px] text-[#777777]">
          Rekapitulasi terbuka penggalangan dana sukarela untuk kegiatan sosial & fasilitas warga.
        </p>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {donasiList.map((item) => {
          const percent = Math.min(100, Math.round((item.collectedAmount / item.targetAmount) * 100));
          const remaining = item.collectedAmount - item.usedAmount;

          return (
            <div
              key={item.id}
              className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                      item.isActive
                        ? 'bg-amber-50 text-[#FF8F00] border border-amber-200'
                        : 'bg-slate-100 text-[#777777]'
                    }`}
                  >
                    {item.isActive ? 'Sedang Berjalan' : 'Selesai'}
                  </span>
                  <span className="text-[10px] text-[#777777]">
                    {item.startDate} {item.endDate ? `s/d ${item.endDate}` : ''}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-[#333333] leading-snug">
                  {item.title}
                </h3>
                <p className="text-[11px] text-[#555555] leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#333333]">
                    Terkumpul: Rp {item.collectedAmount.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[#FF8F00]">
                    {percent}% (Target: Rp {item.targetAmount.toLocaleString('id-ID')})
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#E53935] to-[#FF8F00] rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Rekap Dana Masuk, Digunakan, Sisa */}
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-[#F1E1DC] text-center">
                <div className="p-2 rounded-xl bg-[#FFF8F5] border border-[#F1E1DC]">
                  <span className="text-[9px] text-[#777777] block font-semibold">Terkumpul</span>
                  <span className="text-xs font-black text-[#333333] mt-0.5 block truncate">
                    Rp {item.collectedAmount.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-red-50/60 border border-red-200">
                  <span className="text-[9px] text-[#E53935] block font-semibold">Digunakan</span>
                  <span className="text-xs font-black text-[#E53935] mt-0.5 block truncate">
                    Rp {item.usedAmount.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-200">
                  <span className="text-[9px] text-[#FF8F00] block font-semibold">Sisa Kas</span>
                  <span className="text-xs font-black text-[#FF8F00] mt-0.5 block truncate">
                    Rp {remaining.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Footer Note */}
              <div className="flex items-center justify-between text-[10px] text-[#777777] pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <Users className="w-3 h-3 text-[#E53935]" />
                  <span>Didukung <strong>{item.donorCount} warga</strong></span>
                </span>
                <span className="italic">Data donatur dirahasiakan</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
