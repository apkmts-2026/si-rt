import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Phone, Mail, MapPin, Clock, Heart } from 'lucide-react';

export const Footer: React.FC<{ onOpenLogin?: () => void }> = ({ onOpenLogin }) => {
  const { settings, setActiveTab, currentUser } = useApp();

  return (
    <footer className="bg-[#241E1C] text-[#E0D5D0] pt-8 pb-20 lg:pb-8 border-t border-[#3A2F2B] no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-xs">
          {/* Col 1: RT Identity */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E53935] to-[#FF8F00] text-white font-black flex items-center justify-center text-xs">
                RT {settings.rtNumber}
              </div>
              <div>
                <h3 className="text-white font-bold text-sm leading-tight">
                  RT {settings.rtNumber} / RW {settings.rwNumber}
                </h3>
                <p className="text-[11px] text-[#FFA726]">Kelurahan {settings.kelurahan}</p>
              </div>
            </div>
            <p className="text-[11px] text-[#A89A94] leading-relaxed">
              Mewujudkan lingkungan rukun tetangga yang guyub, aman, tertib, dan transparan dalam pengelolaan kas warga.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-800/40 text-red-200 text-[10px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFA726] shrink-0" />
              <span>Transparansi Kas & Informasi</span>
            </div>
          </div>

          {/* Col 2: Pelayanan & Balai RT */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">
              Sekretariat & Pelayanan
            </h4>
            <ul className="space-y-1.5 text-[11px] text-[#A89A94]">
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E53935] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#FF8F00] shrink-0" />
                <span>{settings.serviceHours}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#E53935] shrink-0" />
                <span>{settings.phone} (Ketua RT)</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigasi Cepat Warga */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">
              Menu Informasi
            </h4>
            <ul className="space-y-1 text-[11px] text-[#A89A94]">
              <li>
                <button
                  onClick={() => { setActiveTab('keuangan'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#FFA726] transition"
                >
                  Transparansi Kas RT
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('laporan'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#FFA726] transition"
                >
                  Laporan Keuangan Resmi
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('rekap-iuran'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#FFA726] transition"
                >
                  Dasbor Rekap Iuran
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('kegiatan'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#FFA726] transition"
                >
                  Kegiatan Warga
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Pengurus Inti & Akses Pengelola */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">
              Pengurus RT ({settings.period})
            </h4>
            <div className="text-[11px] space-y-1 text-[#A89A94]">
              <div>
                <span className="text-[#8C7D77] block text-[10px]">Ketua RT:</span>
                <span className="font-semibold text-white">{settings.leadName}</span>
              </div>
              <div>
                <span className="text-[#8C7D77] block text-[10px]">Bendahara RT:</span>
                <span className="font-semibold text-white">{settings.treasurerName}</span>
              </div>
            </div>

            <div className="pt-1.5">
              {!currentUser && onOpenLogin && (
                <button
                  onClick={onOpenLogin}
                  className="inline-flex items-center gap-1 text-[11px] text-[#FFA726] hover:text-white font-bold"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Login Khusus Pengelola
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-[#3A2F2B] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8C7D77] gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} SISTEM INFORMASI RT {settings.rtNumber} / RW {settings.rwNumber}.</p>
          <p className="flex items-center justify-center gap-1">
            Transparansi Kas & Pelayanan Warga <Heart className="w-3 h-3 text-[#E53935] fill-[#E53935]" />
          </p>
        </div>
      </div>
    </footer>
  );
};
