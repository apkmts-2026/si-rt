import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Megaphone, Pin, Calendar, FileText, Download, Search } from 'lucide-react';

export const PengumumanPublic: React.FC = () => {
  const { pengumumanList, settings, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = pengumumanList
    .filter((p) => p.isActive)
    .filter((p) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });

  // Sort pinned first
  const sorted = [...filtered].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleDownloadAttachment = (attachmentName: string) => {
    showToast('info', `Mengunduh lampiran resmi: ${attachmentName}`);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#E53935] text-[10px] font-bold mb-0.5 border border-red-100">
            <Megaphone className="w-3 h-3 text-[#E53935]" />
            <span>Papan Informasi Warga</span>
          </div>
          <h2 className="text-base sm:text-xl font-black text-[#333333]">
            Surat & Pengumuman RT {settings.rtNumber}
          </h2>
          <p className="text-[11px] text-[#777777]">
            Informasi penting, edaran resmi, dan jadwal kegiatan RT.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pengumuman..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#F1E1DC] rounded-xl focus:outline-hidden focus:border-[#E53935]"
          />
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-2.5">
        {sorted.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#777777] bg-white rounded-2xl border border-[#F1E1DC]">
            <Megaphone className="w-8 h-8 mx-auto text-[#FFA726] mb-2" />
            <p className="font-bold text-[#333333]">Tidak ada pengumuman yang sesuai</p>
          </div>
        ) : (
          sorted.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                item.isPinned
                  ? 'bg-orange-50/50 border-amber-300 shadow-2xs'
                  : 'bg-white border-[#F1E1DC] shadow-xs'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      item.isPinned
                        ? 'bg-[#E53935] text-white flex items-center gap-1'
                        : 'bg-amber-50 text-[#FF8F00] border border-amber-200'
                    }`}
                  >
                    {item.isPinned && <Pin className="w-2.5 h-2.5 rotate-45" />}
                    {item.category}
                  </span>
                  {item.isPinned && (
                    <span className="text-[10px] font-bold text-[#E53935]">
                      Penting (Disematkan)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[10px] text-[#777777]">
                  <Calendar className="w-3 h-3 text-[#FF8F00]" />
                  <span>{item.date}</span>
                </div>
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-[#333333] leading-snug mb-1">
                {item.title}
              </h3>

              <div className="text-[11px] sm:text-xs text-[#555555] leading-relaxed whitespace-pre-line mb-3">
                {item.content}
              </div>

              {item.attachmentName && (
                <div className="pt-2.5 border-t border-[#F1E1DC] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#777777] min-w-0">
                    <FileText className="w-3.5 h-3.5 text-[#E53935] shrink-0" />
                    <span className="font-medium truncate">{item.attachmentName}</span>
                  </div>
                  <button
                    onClick={() => handleDownloadAttachment(item.attachmentName!)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#E53935] bg-red-50 hover:bg-red-100 border border-red-200 transition shrink-0 cursor-pointer"
                  >
                    <Download className="w-3 h-3" /> Unduh
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
