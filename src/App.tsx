import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { LoginModal } from './components/auth/LoginModal';

// Public views
import { PublicHome } from './components/public/PublicHome';
import { KeuanganPublic } from './components/public/KeuanganPublic';
import { LaporanKeuanganPublic } from './components/public/LaporanKeuanganPublic';
import { RekapIuranWargaPublic } from './components/public/RekapIuranWargaPublic';
import { DataWargaPublic } from './components/public/DataWargaPublic';
import { KegiatanPublic } from './components/public/KegiatanPublic';
import { PengumumanPublic } from './components/public/PengumumanPublic';
import { AgendaPublic } from './components/public/AgendaPublic';
import { DonasiPublic } from './components/public/DonasiPublic';
import { KontakPublic } from './components/public/KontakPublic';

// Admin view
import { AdminLayout } from './components/admin/AdminLayout';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();
  const [footerLoginOpen, setFooterLoginOpen] = useState(false);

  const renderContent = () => {
    // Admin routing
    if (activeTab.startsWith('admin-')) {
      return <AdminLayout />;
    }

    // Public routing
    switch (activeTab) {
      case 'beranda':
        return <PublicHome />;
      case 'keuangan':
        return <KeuanganPublic />;
      case 'laporan':
        return <LaporanKeuanganPublic />;
      case 'rekap-iuran':
        return <RekapIuranWargaPublic />;
      case 'data-warga':
        return <DataWargaPublic />;
      case 'kegiatan':
        return <KegiatanPublic />;
      case 'pengumuman':
        return <PengumumanPublic />;
      case 'agenda':
        return <AgendaPublic />;
      case 'donasi':
        return <DonasiPublic />;
      case 'kontak':
        return <KontakPublic />;
      default:
        return <PublicHome />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F5] text-[#333333]">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-6 pb-20 lg:pb-8">
        {renderContent()}
      </main>
      <Footer onOpenLogin={() => setFooterLoginOpen(true)} />
      <ToastContainer />
      <LoginModal isOpen={footerLoginOpen} onClose={() => setFooterLoginOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
