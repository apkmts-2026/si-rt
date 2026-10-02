import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, User, Eye, EyeOff, ShieldCheck, KeyRound, Loader2, Info } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, settings } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!username.trim() || !password) {
      setErrorMessage('Harap isi username dan password');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = login(username, password);
      setIsLoading(false);
      if (res.success) {
        setUsername('');
        setPassword('');
        onClose();
      } else {
        setErrorMessage(res.message);
      }
    }, 350);
  };

  const handleQuickFill = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/50 backdrop-blur-xs no-print">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col border border-[#F1E1DC] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header with RT Logo & Red-Orange Gradient */}
        <div className="relative px-5 pt-6 pb-4 bg-gradient-to-r from-[#E53935] via-[#D32F2F] to-[#FF8F00] text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* RT Logo */}
          <div className="w-12 h-12 rounded-2xl bg-white text-[#E53935] mx-auto flex items-center justify-center font-black shadow-md mb-2">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo RT" className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-black">RT {settings.rtNumber}</span>
            )}
          </div>

          <h3 className="font-extrabold text-base tracking-tight leading-tight">LOGIN PENGELOLA</h3>
          <p className="text-[11px] text-amber-100 mt-0.5">Admin • Ketua RT • Bendahara</p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-[#333333] uppercase tracking-wider mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full pl-9 pr-3 py-2 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs text-[#333333] focus:bg-white focus:outline-hidden focus:border-[#E53935] transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#333333] uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-9 pr-9 py-2 bg-[#FFF8F5] border border-[#F1E1DC] rounded-xl text-xs text-[#333333] focus:bg-white focus:outline-hidden focus:border-[#E53935] transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 mt-1 bg-gradient-to-r from-[#E53935] to-[#FF8F00] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md shadow-[#E53935]/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Masuk ke Sistem</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Buttons */}
          <div className="pt-3 border-t border-[#F1E1DC]">
            <div className="flex items-center gap-1 text-[11px] text-[#777777] font-medium mb-2">
              <Info className="w-3.5 h-3.5 text-[#E53935]" />
              <span>Akses Cepat Pengujian:</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('admin', 'admin123')}
                className="py-1 px-1.5 bg-[#FFF8F5] border border-[#F1E1DC] hover:border-[#E53935] rounded-lg text-[10px] font-bold text-[#333333] text-center"
              >
                1. Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('ketuart', 'ketua123')}
                className="py-1 px-1.5 bg-[#FFF8F5] border border-[#F1E1DC] hover:border-[#E53935] rounded-lg text-[10px] font-bold text-[#333333] text-center"
              >
                2. Ketua RT
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('bendahara', 'bendahara123')}
                className="py-1 px-1.5 bg-[#FFF8F5] border border-[#F1E1DC] hover:border-[#E53935] rounded-lg text-[10px] font-bold text-[#333333] text-center"
              >
                3. Bendahara
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 py-2.5 bg-[#FFF8F5] border-t border-[#F1E1DC] text-center">
          <p className="text-[10px] text-[#777777]">
            Warga umum dapat mengakses halaman utama tanpa perlu login.
          </p>
        </div>
      </div>
    </div>
  );
};
