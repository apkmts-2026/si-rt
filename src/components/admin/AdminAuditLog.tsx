import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { History, Search } from 'lucide-react';
import { AuditLog } from '../../types';

export const AdminAuditLog: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = auditLogs.filter((log) => {
    if (filterType !== 'ALL' && log.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.activity.toLowerCase().includes(q) ||
        log.userName.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getTypeBadge = (type: AuditLog['type']) => {
    switch (type) {
      case 'CREATE':
        return 'bg-amber-50 text-[#FF8F00] border border-amber-200';
      case 'UPDATE':
        return 'bg-orange-50 text-[#FFA726] border border-orange-200';
      case 'DELETE':
        return 'bg-red-50 text-[#E53935] border border-red-200';
      case 'LOGIN':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'PUBLISH':
        return 'bg-amber-100 text-[#FF8F00] border border-amber-300';
      case 'SETTING':
        return 'bg-red-100 text-[#E53935] border border-red-200';
      default:
        return 'bg-slate-100 text-[#777777]';
    }
  };

  return (
    <div className="space-y-4">
      <div className="px-1">
        <h2 className="text-base sm:text-xl font-black text-[#333333]">
          Log Aktivitas & Jejak Audit Pengelola
        </h2>
        <p className="text-[11px] text-[#777777]">
          Merekam setiap tindakan penambahan, pengubahan, publikasi, dan penghapusan data secara transparan.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari aktivitas, user..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#E53935]"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
          <span className="font-semibold text-[#777777] text-[11px]">Jenis Aksi:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="py-1 px-2.5 bg-[#FFF8F5] border border-[#F1E1DC] rounded-lg text-xs font-semibold text-[#333333]"
          >
            <option value="ALL">Semua Aktivitas</option>
            <option value="CREATE">CREATE (Tambah)</option>
            <option value="UPDATE">UPDATE (Ubah)</option>
            <option value="DELETE">DELETE (Hapus)</option>
            <option value="PUBLISH">PUBLISH (Publikasi)</option>
            <option value="LOGIN">LOGIN</option>
            <option value="SETTING">SETTING</option>
          </select>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="block lg:hidden space-y-2">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#777777] bg-white rounded-2xl border border-[#F1E1DC]">
            Belum ada log aktivitas yang cocok.
          </div>
        ) : (
          filtered.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs space-y-1.5"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-mono text-[#777777]">{log.timestamp}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${getTypeBadge(log.type)}`}>
                  {log.type}
                </span>
              </div>
              <div className="font-bold text-[#333333] text-xs">{log.activity}</div>
              <div className="text-[10px] text-[#555555] font-mono truncate">{log.details}</div>
              <div className="text-[10px] text-[#FF8F00] font-semibold pt-1 border-t border-[#F1E1DC]">
                Oleh: {log.userName} ({log.userRole})
              </div>
            </div>
          ))
        )}
      </div>

      {/* Log Table Desktop */}
      <div className="hidden lg:block bg-white rounded-2xl border border-[#F1E1DC] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FFF8F5] border-b border-[#F1E1DC] text-[#777777] font-bold uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-3 w-36">Waktu & Tanggal</th>
              <th className="py-2.5 px-3">Pengguna & Role</th>
              <th className="py-2.5 px-3 text-center">Jenis Aksi</th>
              <th className="py-2.5 px-3">Aktivitas</th>
              <th className="py-2.5 px-3">Rincian Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1E1DC]/60">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-[#FFF8F5]/60 transition">
                <td className="py-2.5 px-3 whitespace-nowrap text-[#777777] font-mono text-[10px]">
                  {log.timestamp}
                </td>
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <div className="font-bold text-[#333333]">{log.userName}</div>
                  <div className="text-[9px] uppercase font-semibold text-[#FF8F00]">
                    {log.userRole}
                  </div>
                </td>
                <td className="py-2.5 px-3 text-center whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${getTypeBadge(log.type)}`}>
                    {log.type}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-semibold text-[#333333]">
                  {log.activity}
                </td>
                <td className="py-2.5 px-3 text-[#777777] font-mono text-[10px]">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
