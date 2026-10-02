import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, MapPin, User, Search } from 'lucide-react';

export const AgendaPublic: React.FC = () => {
  const { agendaList, settings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = agendaList.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q) ||
      a.picName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#E53935] text-[10px] font-bold mb-0.5 border border-red-100">
            <Calendar className="w-3 h-3 text-[#E53935]" />
            <span>Kalender Rencana RT</span>
          </div>
          <h2 className="text-base sm:text-xl font-black text-[#333333]">
            Agenda Pertemuan & Kegiatan RT {settings.rtNumber}
          </h2>
          <p className="text-[11px] text-[#777777]">
            Jadwal musyawarah, kerja bakti, dan agenda bersama warga.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari agenda kegiatan..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#F1E1DC] rounded-xl focus:outline-hidden focus:border-[#E53935]"
          />
        </div>
      </div>

      {/* Agenda Timeline List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#777777] bg-white rounded-2xl border border-[#F1E1DC]">
            <Calendar className="w-8 h-8 mx-auto text-[#FFA726] mb-2" />
            <p className="font-bold text-[#333333]">Belum ada agenda pada pencarian ini</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-300 transition"
            >
              {/* Date Box and Details */}
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-[#FFF8F5] border border-[#F1E1DC] text-[#E53935] text-center shrink-0 min-w-16">
                  <Calendar className="w-4 h-4 mx-auto mb-0.5 text-[#E53935]" />
                  <span className="text-[10px] font-black block leading-none">{item.date.substring(5)}</span>
                  <span className="text-[9px] text-[#777777] block mt-0.5">{item.date.substring(0, 4)}</span>
                </div>

                <div className="space-y-1 min-w-0">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-50 text-[#FF8F00] border border-amber-200 inline-block">
                    {item.category}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-[#333333] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[#555555] leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Meta Info */}
              <div className="pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F1E1DC] flex flex-wrap sm:flex-col gap-1.5 text-[11px] text-[#777777] shrink-0 sm:text-right">
                <div className="flex items-center sm:justify-end gap-1 text-[#E53935] font-bold">
                  <Clock className="w-3 h-3 shrink-0" />
                  <span>{item.time}</span>
                </div>
                <div className="flex items-center sm:justify-end gap-1">
                  <MapPin className="w-3 h-3 text-[#FF8F00] shrink-0" />
                  <span className="truncate max-w-[180px]">{item.location}</span>
                </div>
                <div className="flex items-center sm:justify-end gap-1 text-[10px]">
                  <User className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>PIC: <strong className="text-[#333333]">{item.picName}</strong></span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
