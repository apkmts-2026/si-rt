import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  X,
  Bell,
  ShieldCheck,
  Building2,
  LayoutDashboard,
  Wallet,
  FileSpreadsheet,
  Users,
  CalendarDays,
  Megaphone,
  HeartHandshake,
  PhoneCall,
  CheckCircle2,
  LogOut,
  ChevronRight,
  Info,
  Layers,
} from 'lucide-react';
import { LoginModal } from '../auth/LoginModal';
import { NotificationDrawer } from './NotificationDrawer';

export const Header: React.FC = () => {
  const { settings, currentUser, logout, activeTab, setActiveTab, notifications } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const publicNavLinks = [
    { id: 'beranda', label: 'Beranda', icon: <Building2 className="w-4 h-4" /> },
    { id: 'keuangan', label: 'Keuangan', icon: <Wallet className="w-4 h-4" /> },
    { id: 'laporan', label: 'Laporan', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'rekap-iuran', label: 'Rekap Iuran', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'data-warga', label: 'Data Warga', icon: <Users className="w-4 h-4" /> },
    { id: 'kegiatan', label: 'Kegiatan', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'pengumuman', label: 'Pengumuman', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'agenda', label: 'Agenda', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'donasi', label: 'Donasi', icon: <HeartHandshake className="w-4 h-4" /> },
    { id: 'kontak', label: 'Kontak', icon: <PhoneCall className="w-4 h-4" /> },
  ];

  const isPublicTab = !activeTab.startsWith('admin-');

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getAdminDefaultTab = () => {
    if (currentUser?.role === 'BENDAHARA') return 'admin-keuangan';
    return 'admin-dashboard';
  };

  // Bottom nav items (max 5)
  const bottomNavItems = [
    { id: 'beranda', label: 'Beranda', icon: <Building2 className="w-5 h-5" /> },
    { id: 'keuangan', label: 'Keuangan', icon: <Wallet className="w-5 h-5" /> },
    { id: 'laporan', label: 'Laporan', icon: <FileSpreadsheet className="w-5 h-5" /> },
    { id: 'data-warga', label: 'Informasi', icon: <Info className="w-5 h-5" /> },
    { id: 'menu', label: 'Menu', icon: <Layers className="w-5 h-5" /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#F1E1DC] shadow-xs no-print">
        {/* Desktop Top Strip (Government RT Banner) */}
        <div className="bg-gradient-to-r from-[#C62828] via-[#E53935] to-[#FF8F00] text-white text-[11px] py-1 px-4 hidden lg:block">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2 font-medium">
              <span className="font-bold">RT {settings.rtNumber} / RW {settings.rwNumber}</span>
              <span>•</span>
              <span>Kel. {settings.kelurahan}, Kec. {settings.kecamatan}</span>
              <span>•</span>
              <span>{settings.city}</span>
            </div>
            <div className="flex items-center space-x-3 text-white/90">
              <span>Jam Pelayanan: {settings.serviceHours}</span>
              <span>•</span>
              <span className="font-semibold text-amber-100">Periode {settings.period}</span>
            </div>
          </div>
        </div>

        {/* Header Main Bar: Compact on Mobile (52-56px), Balanced on Desktop */}
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo & RT Branding */}
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => handleNavClick('beranda')}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#E53935] to-[#FF8F00] text-white flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo RT" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center leading-none">
                    <span className="text-[9px] font-bold uppercase tracking-wider">RT</span>
                    <span className="text-sm font-black">{settings.rtNumber}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold tracking-wider text-[#E53935] uppercase leading-none">
                  SISTEM INFORMASI
                </span>
                <h1 className="text-sm sm:text-base font-extrabold text-[#333333] leading-tight">
                  RT {settings.rtNumber} / RW {settings.rwNumber}
                </h1>
                <p className="text-[10px] text-[#777777] hidden md:block leading-none mt-0.5">
                  Transparansi Informasi dan Keuangan Warga
                </p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2.5">
              {/* Notification Bell */}
              <button
                type="button"
                onClick={() => setNotifDrawerOpen(true)}
                className="relative p-2 text-[#777777] hover:text-[#E53935] rounded-xl hover:bg-[#FFF8F5] transition cursor-pointer"
                title="Pemberitahuan & Notifikasi Kas RT"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-[#E53935] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Status / Login Pengelola */}
              {currentUser ? (
                <div className="flex items-center gap-2 pl-2 border-l border-[#F1E1DC]">
                  <div className="text-right">
                    <div className="text-xs font-bold text-[#333333] flex items-center gap-1 justify-end">
                      <span className="w-2 h-2 rounded-full bg-[#E53935]"></span>
                      {currentUser.name}
                    </div>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-amber-50 text-[#FF8F00] border border-amber-200">
                      {currentUser.role}
                    </span>
                  </div>

                  {isPublicTab ? (
                    <button
                      onClick={() => handleNavClick(getAdminDefaultTab())}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E53935] to-[#FF8F00] hover:opacity-90 shadow-xs transition cursor-pointer"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Panel Pengelola</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNavClick('beranda')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#333333] bg-[#FFF8F5] hover:bg-[#F1E1DC] border border-[#F1E1DC] transition cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#E53935]" />
                      <span>Halaman Publik</span>
                    </button>
                  )}

                  <button
                    onClick={logout}
                    title="Keluar / Logout"
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setLoginModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E53935] to-[#FF8F00] hover:shadow-md hover:shadow-[#E53935]/20 shadow-xs transition cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Login Pengelola</span>
                </button>
              )}
            </div>

            {/* Mobile Top Controls: Notif + Menu Button */}
            <div className="flex lg:hidden items-center gap-1">
              <button
                type="button"
                onClick={() => setNotifDrawerOpen(true)}
                className="relative p-2 text-[#555555] hover:text-[#E53935] rounded-xl hover:bg-[#FFF8F5]"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-[#E53935] text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {currentUser ? (
                <button
                  type="button"
                  onClick={() => handleNavClick(getAdminDefaultTab())}
                  className="px-2.5 py-1 text-[11px] font-bold text-white bg-gradient-to-r from-[#E53935] to-[#FF8F00] rounded-lg"
                >
                  Admin
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setLoginModalOpen(true)}
                  className="px-2.5 py-1 text-[11px] font-bold text-[#E53935] bg-red-50 border border-red-200 rounded-lg"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Navigation Bar */}
        {isPublicTab && (
          <div className="hidden lg:block border-t border-[#F1E1DC] bg-[#FFF8F5]/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex space-x-1 overflow-x-auto py-1 scrollbar-none">
                {publicNavLinks.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleNavClick(tab.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#E53935] text-white shadow-xs'
                          : 'text-[#555555] hover:text-[#E53935] hover:bg-white'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* FIXED BOTTOM NAVIGATION BAR FOR SMARTPHONES (Mobile First Design) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F1E1DC] pb-safe no-print shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
        <div className="grid grid-cols-5 h-14 items-center">
          {bottomNavItems.map((item) => {
            const isMenuBtn = item.id === 'menu';
            const isActive =
              !isMenuBtn &&
              (activeTab === item.id ||
                (item.id === 'data-warga' &&
                  (activeTab === 'data-warga' || activeTab === 'kontak' || activeTab === 'pengumuman')));

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (isMenuBtn) {
                    setMobileMenuOpen(true);
                  } else {
                    handleNavClick(item.id);
                  }
                }}
                className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
                  isActive ? 'text-[#E53935]' : 'text-[#777777] hover:text-[#333333]'
                }`}
              >
                <div className={`p-0.5 ${isActive ? 'scale-110 transition-transform' : ''}`}>
                  {item.icon}
                </div>
                <span
                  className={`text-[10px] font-semibold tracking-tight mt-0.5 ${
                    isActive ? 'text-[#E53935] font-extrabold' : 'text-[#777777]'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* MOBILE FULL DRAWER / BOTTOM SHEET FOR "MENU" */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-xs no-print animate-in fade-in duration-150">
          <div
            className="flex-1"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 pb-safe border-t border-[#F1E1DC] shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
            {/* Grab handle */}
            <div className="w-12 h-1.5 bg-[#F1E1DC] rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F1E1DC]">
              <div>
                <h3 className="text-base font-extrabold text-[#333333]">Menu Sistem Informasi RT</h3>
                <p className="text-[11px] text-[#777777]">RT {settings.rtNumber} / RW {settings.rwNumber}</p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Public Links Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {publicNavLinks.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleNavClick(tab.id)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold transition text-left ${
                    activeTab === tab.id
                      ? 'bg-[#E53935] text-white shadow-xs'
                      : 'bg-[#FFF8F5] text-[#333333] hover:bg-orange-50 border border-[#F1E1DC]'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'text-white' : 'text-[#E53935]'}>
                    {tab.icon}
                  </span>
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Auth / Admin actions */}
            <div className="pt-3 border-t border-[#F1E1DC] space-y-2">
              {currentUser ? (
                <>
                  <div className="p-3 bg-[#FFF8F5] rounded-xl border border-[#F1E1DC] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-[#777777]">Masuk sebagai:</div>
                      <div className="text-xs font-bold text-[#333333]">{currentUser.name}</div>
                      <div className="text-[10px] font-bold text-[#FF8F00]">{currentUser.role}</div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="px-2.5 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-lg flex items-center gap-1"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </div>
                  {isPublicTab ? (
                    <button
                      onClick={() => handleNavClick(getAdminDefaultTab())}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E53935] to-[#FF8F00] shadow-sm"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Buka Panel Pengelola
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNavClick('beranda')}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-[#333333] bg-[#FFF8F5] border border-[#F1E1DC]"
                    >
                      <Building2 className="w-4 h-4 text-[#E53935]" /> Kembali ke Halaman Publik
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLoginModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E53935] to-[#FF8F00] shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4" /> Login Pengelola RT (Admin/Ketua/Bendahara)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      <NotificationDrawer isOpen={notifDrawerOpen} onClose={() => setNotifDrawerOpen(false)} />
    </>
  );
};
