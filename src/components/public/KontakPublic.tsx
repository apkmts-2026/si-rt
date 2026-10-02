import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Building2,
  Send,
} from 'lucide-react';

export const KontakPublic: React.FC = () => {
  const { settings, pengurusList } = useApp();
  const [senderName, setSenderName] = useState('');
  const [senderBlock, setSenderBlock] = useState('');
  const [messageText, setMessageText] = useState('');

  const cleanWaNumber = settings.whatsapp.replace(/[^0-9]/g, '');

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const fullMsg = `Halo Pengurus RT ${settings.rtNumber} / RW ${settings.rwNumber},\n\nNama: ${senderName || 'Warga RT'}\nAlamat/Blok: ${senderBlock || '-'}\nPesan:\n${messageText}\n\nMohon petunjuk dan tindak lanjutnya. Terima kasih.`;
    const encoded = encodeURIComponent(fullMsg);
    window.open(`https://wa.me/${cleanWaNumber}?text=${encoded}`, '_blank');
  };

  const handleDirectCallKetua = () => {
    const text = encodeURIComponent(
      `Selamat siang/malam Bpk. Ketua RT (${settings.leadName}), saya warga RT ${settings.rtNumber} ingin menyampaikan keperluan terkait lingkungan.`
    );
    window.open(`https://wa.me/${cleanWaNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#E53935] text-[10px] font-bold mb-0.5 border border-red-100">
            <Building2 className="w-3 h-3 text-[#E53935]" />
            <span>Pusat Layanan Warga</span>
          </div>
          <h2 className="text-base sm:text-xl font-black text-[#333333]">
            Kontak & Informasi RT {settings.rtNumber}
          </h2>
          <p className="text-[11px] text-[#777777]">
            Layanan pengantar surat, pengaduan lingkungan, dan komunikasi pengurus.
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={handleDirectCallKetua}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E53935] to-[#FF8F00] text-white font-extrabold text-xs shadow-xs hover:opacity-95 transition self-start sm:self-auto cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Hubungi Ketua RT</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left Column (2 Cols): Wilayah & Form */}
        <div className="lg:col-span-2 space-y-3">
          {/* Identitas RT */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs space-y-3">
            <h3 className="text-xs sm:text-sm font-extrabold text-[#333333] flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#E53935]" />
              <span>Wilayah Administrasi Rukun Tetangga</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FFF8F5] border border-[#F1E1DC]">
                <span className="text-[#777777] text-[10px] font-semibold uppercase block">RT</span>
                <div className="text-sm font-black text-[#333333] mt-0.5">RT {settings.rtNumber}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFF8F5] border border-[#F1E1DC]">
                <span className="text-[#777777] text-[10px] font-semibold uppercase block">RW</span>
                <div className="text-sm font-black text-[#333333] mt-0.5">RW {settings.rwNumber}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFF8F5] border border-[#F1E1DC]">
                <span className="text-[#777777] text-[10px] font-semibold uppercase block">Kelurahan</span>
                <div className="text-xs font-bold text-[#333333] mt-0.5 truncate">{settings.kelurahan}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFF8F5] border border-[#F1E1DC]">
                <span className="text-[#777777] text-[10px] font-semibold uppercase block">Kecamatan</span>
                <div className="text-xs font-bold text-[#333333] mt-0.5 truncate">{settings.kecamatan}</div>
              </div>
            </div>

            {/* Sekretariat Details */}
            <div className="pt-2 border-t border-[#F1E1DC] space-y-2 text-xs text-[#555555]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E53935] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#333333] block text-[11px]">Alamat Sekretariat:</strong>
                  <span className="text-[11px]">{settings.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#FF8F00] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#333333] block text-[11px]">Jam Pelayanan:</strong>
                  <span className="text-[11px]">{settings.serviceHours}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E53935] shrink-0" />
                <div className="text-[11px]">
                  <strong className="text-[#333333]">Telepon:</strong> {settings.phone}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF8F00] shrink-0" />
                <div className="text-[11px]">
                  <strong className="text-[#333333]">Email:</strong> {settings.email}
                </div>
              </div>
            </div>
          </div>

          {/* Form Kirim Pesan Cepat */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#E53935] to-[#FF8F00] text-white shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/15">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm">Kirim Pesan ke Pengurus RT</h3>
                <p className="text-[10px] text-amber-100">
                  Tersambung langsung ke WhatsApp Pengurus RT
                </p>
              </div>
            </div>

            <form onSubmit={handleSendWhatsApp} className="space-y-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-white/90 uppercase mb-0.5">
                    Nama Anda
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Contoh: Bpk. Budi"
                    className="w-full px-3 py-1.5 bg-white/15 border border-white/25 rounded-xl text-white placeholder-white/60 text-xs focus:bg-white/20 focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/90 uppercase mb-0.5">
                    Blok / No. Rumah
                  </label>
                  <input
                    type="text"
                    value={senderBlock}
                    onChange={(e) => setSenderBlock(e.target.value)}
                    placeholder="Contoh: Blok A1 No. 04"
                    className="w-full px-3 py-1.5 bg-white/15 border border-white/25 rounded-xl text-white placeholder-white/60 text-xs focus:bg-white/20 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-white/90 uppercase mb-0.5">
                  Isi Pesan / Keperluan Surat Pengantar
                </label>
                <textarea
                  rows={3}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Tuliskan keperluan Anda..."
                  className="w-full px-3 py-1.5 bg-white/15 border border-white/25 rounded-xl text-white placeholder-white/60 text-xs focus:bg-white/20 focus:outline-hidden"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full h-10 bg-white hover:bg-amber-50 text-[#C62828] font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer mt-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Pesan ke WhatsApp Pengurus</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Susunan Pengurus */}
        <div className="space-y-3">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#F1E1DC] shadow-xs space-y-3">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-[#FF8F00] border border-amber-200">
                Struktur Organisasi
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-[#333333] mt-1">
                Pengurus RT {settings.rtNumber}
              </h3>
              <p className="text-[10px] text-[#777777]">Masa Bakti Periode {settings.period}</p>
            </div>

            <div className="space-y-2 pt-1">
              {pengurusList.map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-xl bg-[#FFF8F5] border border-[#F1E1DC] flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#333333] text-xs truncate">{p.name}</h4>
                    <span className="text-[10px] font-semibold text-[#E53935] block">
                      {p.roleTitle}
                    </span>
                  </div>
                  <a
                    href={`https://wa.me/${p.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-white hover:bg-orange-50 text-[#E53935] border border-[#F1E1DC] shadow-2xs transition shrink-0"
                    title={`Hubungi ${p.name}`}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
