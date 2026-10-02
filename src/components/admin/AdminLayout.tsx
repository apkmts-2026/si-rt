import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Wallet,
  CheckCircle2,
  Users,
  Megaphone,
  Calendar,
  HeartHandshake,
  Settings,
  ShieldCheck,
  History,
  Building2,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { AdminKeuangan } from './AdminKeuangan';
import { AdminRekapIuran } from './AdminRekapIuran';
import { AdminWarga } from './AdminWarga';
import { AdminPengurus } from './AdminPengurus';
import { AdminKegiatan } from './AdminKegiatan';
import { AdminPengumuman } from './AdminPengumuman';
import { AdminAgenda } from './AdminAgenda';
import { AdminDonasi } from './AdminDonasi';
import { AdminPengaturan } from './AdminPengaturan';
import { AdminUsers } from './AdminUsers';
import { AdminAuditLog } from './AdminAuditLog';

export const AdminLayout: React.FC = () => {
  const { currentUser, activeTab, setActiveTab, logout } = useApp();

  const allTabs = [
    {
      id: 'admin-dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      allowedRoles: ['ADMIN', 'KETUA_RT', 'BENDAHARA'],
    },
    {
      id: 'admin-keuangan',
      label: 'Kas & Keuangan RT',
      icon: <Wallet className="w-4 h-4" />,
      allowedRoles: ['ADMIN', 'KETUA_RT', 'BENDAHARA'],
    },
    {
      id: 'admin-rekap-iuran',
      label: 'Rekap & Pengingat Iuran',
      icon: <CheckCircle2 className="w-4 h-4" />,
      allowedRoles: ['ADMIN', 'BENDAHARA', 'KETUA_RT'],
    },
    {
      id: 'admin-warga',
      label: 'Data Kependudukan',
      icon: <Users className="w-4 h-4" />,
      allowedRoles: ['ADMIN', 'KETUA_RT'],
    },
    {
      id: 'admin-pengurus',
      label: 'Susunan Pengurus',
      icon: <UserCheck className="w-4 h-4" />,
      allowedRoles: ['ADMIN', 'KETUA_RT'],
    },
    {
      id: 'admin-kegiatan',
      label: 'Kegiatan RT',
      icon: <Calendar className="w-4 h-4" />,
      allowedRoles: ['ADMIN', 'KETUA_RT'],
    },
    {
      id: 'admin-pengumuman',
      label: 'Pengumuman RT',
      icon: <Megaphone className="w-4 h-4" />,
      allowedRoles: ['ADMIN', 'KETUA_RT'],
    },
    {
      id: 'admin-agenda',
      label: 'Agenda Pertemuan',
      icon: <Calendar className="w-4 h-4" />,
      allowedRoles: ['ADMIN', 'KETUA_RT'],
    },
    {
      id: 'admin-donasi',
      label: 'Donasi Swadaya',
      icon: <HeartHandshake className="w-4 h-4" />,
      allowedRoles: ['ADMIN', 'KETUA_RT', 'BENDAHARA'],
    },
    {
      id: 'admin-pengaturan',
      label: 'Pengaturan & Backup',
      icon: <Settings className="w-4 h-4" />,
      allowedRoles: ['ADMIN'],
    },
    {
      id: 'admin-users',
      label: 'Manajemen Akun',
      icon: <ShieldCheck className="w-4 h-4" />,
      allowedRoles: ['ADMIN'],
    },
    {
      id: 'admin-audit',
      label: 'Audit Log',
      icon: <History className="w-4 h-4" />,
      allowedRoles: ['ADMIN', 'BENDAHARA'],
    },
  ];

  const userRole = currentUser?.role || 'ADMIN';
  const accessibleTabs = allTabs.filter((tab) => tab.allowedRoles.includes(userRole));

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'admin-keuangan':
        return <AdminKeuangan />;
      case 'admin-rekap-iuran':
        return <AdminRekapIuran />;
      case 'admin-warga':
        return <AdminWarga />;
      case 'admin-pengurus':
        return <AdminPengurus />;
      case 'admin-kegiatan':
        return <AdminKegiatan />;
      case 'admin-pengumuman':
        return <AdminPengumuman />;
      case 'admin-agenda':
        return <AdminAgenda />;
      case 'admin-donasi':
        return <AdminDonasi />;
      case 'admin-pengaturan':
        return <AdminPengaturan />;
      case 'admin-users':
        return <AdminUsers />;
      case 'admin-audit':
        return <AdminAuditLog />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Sidebar for Desktop / Compact Bar on Mobile */}
      <aside className="w-full lg:w-60 shrink-0 space-y-3">
        {/* User Card */}
        <div className="p-3 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E53935] to-[#FF8F00] text-white font-black flex items-center justify-center text-xs shadow-xs">
              {currentUser?.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-[#333333] text-xs truncate">{currentUser?.name}</h4>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-50 text-[#FF8F00] border border-amber-200">
                {currentUser?.role}
              </span>
            </div>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-[#F1E1DC] flex items-center justify-between text-xs">
            <button
              onClick={() => setActiveTab('beranda')}
              className="text-[#E53935] hover:text-[#C62828] font-bold flex items-center gap-1 text-[11px]"
            >
              <Building2 className="w-3.5 h-3.5" /> Halaman Warga
            </button>
            <button
              onClick={logout}
              className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 text-[11px]"
            >
              <LogOut className="w-3.5 h-3.5" /> Keluar
            </button>
          </div>
        </div>

        {/* Navigation Menu (Horizontal scroll on mobile, vertical list on desktop) */}
        <div className="p-1.5 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs overflow-x-auto lg:overflow-visible scrollbar-none">
          <nav className="flex lg:flex-col gap-1 min-w-max lg:min-w-0">
            {accessibleTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#E53935] to-[#FF8F00] text-white shadow-xs'
                      : 'text-[#555555] hover:text-[#333333] hover:bg-[#FFF8F5]'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-[#E53935]'}>{tab.icon}</span>
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Admin Screen Content */}
      <main className="flex-1 min-w-0">{renderActiveScreen()}</main>
    </div>
  );
};
