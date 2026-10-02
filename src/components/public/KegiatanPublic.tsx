import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';

export const KegiatanPublic: React.FC = () => {
  const { kegiatanList, settings } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Kerja Bakti', 'Rapat', 'Sosial', 'Keagamaan', 'Posyandu', '17 Agustus', 'Olahraga'];

  const filteredKegiatan = useMemo(() => {
    return kegiatanList.filter((k) => {
      if (selectedCategory !== 'ALL' && k.category !== selectedCategory) return false;
      return true;
    });
  }, [kegiatanList, selectedCategory]);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="px-1">
        <h2 className="text-base sm:text-xl font-black text-[#333333]">
          Kegiatan & Gotong Royong RT {settings.rtNumber}
        </h2>
        <p className="text-[11px] text-[#777777]">
          Dokumentasi kerja bakti, posyandu, dan kebersamaan warga.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-white border border-[#F1E1DC] rounded-2xl scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-[#E53935] text-white shadow-xs'
                : 'text-[#555555] hover:text-[#333333]'
            }`}
          >
            {cat === 'ALL' ? 'Semua' : cat}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredKegiatan.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-[#F1E1DC] bg-white overflow-hidden shadow-xs flex flex-col justify-between"
          >
            {item.photoUrl && (
              <div className="h-36 relative overflow-hidden bg-slate-100">
                <img
                  src={item.photoUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-[#E53935] shadow-xs">
                  {item.category}
                </span>
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E53935] text-white shadow-xs">
                  {item.status}
                </span>
              </div>
            )}

            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-[#333333] leading-snug">
                  {item.title}
                </h3>
                <p className="text-[11px] text-[#555555] mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#F1E1DC] space-y-1 text-[11px] text-[#777777]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-[#E53935]" />
                  <span>{item.date} • {item.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#FF8F00]" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
