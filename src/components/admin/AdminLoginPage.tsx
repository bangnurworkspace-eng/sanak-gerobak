/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  LogIn,
  AlertCircle,
} from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand';

interface AdminLoginPageProps {
  onBackToSite: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onBackToSite, onLoginSuccess }) => {
  const {
    loginWithEmail,
    resetPassword,
    error,
    clearError,
  } = useAdminAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Common UI state
  const [isLoading, setIsLoading] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!loginEmail || !loginPassword) {
      setLocalError('Mohon masukkan alamat email dan kata sandi Anda.');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithEmail(loginEmail, loginPassword);
      onLoginSuccess();
    } catch (err: any) {
      setLocalError(err.message || 'Gagal masuk. Periksa kembali kredensial Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetStatus('Mohon ketikkan email Anda.');
      return;
    }
    try {
      await resetPassword(resetEmail);
      setResetStatus('Tautan resmi pemulihan kata sandi telah dikirimkan ke email Anda. Silakan periksa inbox atau spam.');
    } catch (err: any) {
      setResetStatus(err.message || 'Gagal mengirim email reset.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-white flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Background ambient luxury lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#D6B46A]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#101827] blur-[120px] rounded-full pointer-events-none" />

      {/* Top back navigation */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#A4A7AE] hover:text-[#D6B46A] transition-colors px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#D6B46A]/30 backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Website Publik</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        {/* Brand Header with Official Logo */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-[#0B132B] p-1">
            <img
              src={BRAND_CONFIG.logoUrl}
              alt="Logo SANAK GEROBAK"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-['Manrope']">
              {BRAND_CONFIG.name}
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#D6B46A] font-semibold">
              Content Management System
            </p>
          </div>

          <p className="text-xs text-[#A4A7AE] italic max-w-xs mx-auto">
            “{BRAND_CONFIG.officialTagline}”
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-[#101827]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 relative">
          {/* Feedback Messages */}
          {(localError || error) && (
            <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-red-300">Gagal Memproses</p>
                <p className="leading-relaxed">{localError || error}</p>
              </div>
            </div>
          )}

          {/* MASUK ADMIN (NORMAL LOGIN) */}
          <div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-1.5">
                  Email Administrator
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A4A7AE]">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@sanakgerobak.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0B132B]/80 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D6B46A] transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider">
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetStatus(null);
                      setResetEmail(loginEmail);
                      setResetModalOpen(true);
                    }}
                    className="text-xs text-[#D6B46A] hover:underline"
                  >
                    Lupa kata sandi?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A4A7AE]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-10 pr-11 py-2.5 bg-[#0B132B]/80 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D6B46A] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#A4A7AE] hover:text-white"
                  >
                    {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D6B46A] to-[#C5A154] text-[#101827] font-bold text-xs tracking-wide uppercase hover:shadow-[0_0_20px_rgba(214,180,106,0.3)] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Akses...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Masuk ke Panel CMS</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Password Recovery Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#101827] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-base font-bold text-white font-['Manrope']">
                Pemulihan Kata Sandi
              </h3>
              <button
                onClick={() => setResetModalOpen(false)}
                className="text-[#A4A7AE] hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#A4A7AE] leading-relaxed">
              Masukkan alamat email admin Anda yang terdaftar. Sistem akan mengirimkan tautan resmi untuk mengatur ulang kata sandi ke inbox Anda.
            </p>

            {resetStatus && (
              <div className="p-3 rounded-lg bg-[#D6B46A]/10 border border-[#D6B46A]/30 text-[#D6B46A] text-xs">
                {resetStatus}
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="admin@sanakgerobak.com"
                required
                className="w-full px-4 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D6B46A]"
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#A4A7AE] hover:text-white cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#D6B46A] text-[#101827] font-semibold text-xs rounded-xl hover:bg-[#C5A154] cursor-pointer"
                >
                  Kirim Email Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
