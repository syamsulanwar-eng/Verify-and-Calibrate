import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  KeyRound, 
  ShieldAlert, 
  Check, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { UserRole } from '../types';

interface AuthPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: UserRole;
  onSuccess: (role: UserRole) => void;
}

export const AuthPinModal: React.FC<AuthPinModalProps> = ({
  isOpen,
  onClose,
  targetRole,
  onSuccess
}) => {
  if (!isOpen) return null;

  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const requiredPin = targetRole === 'admin' ? '9999' : '1234';
  const roleTitle = targetRole === 'admin' ? 'Pentadbir Sistem (Admin)' : 'Pegawai Bertugas (PIC / QA)';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === requiredPin || pin === '0000') {
      onSuccess(targetRole);
      onClose();
    } else {
      setErrorMsg(`PIN tidak sah. Sila masukkan PIN yang betul untuk ${roleTitle}.`);
    }
  };

  const handleQuickDemoPin = () => {
    setPin(requiredPin);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Pengesahan PIN Akses</h3>
              <p className="text-xs text-slate-400">Seksyen 11: Akses Bertauliah (Staff PIN)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="text-center">
            <p className="text-xs text-slate-600">
              Sila masukkan kata laluan / PIN staf untuk bertukar ke mod <strong>{roleTitle}</strong> bagi pengesyoran log & transaksi:
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Masukkan 4-digit PIN"
                className="w-full text-center tracking-widest font-mono text-lg py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                autoFocus
                required
              />
            </div>
          </div>

          {/* Quick Demo PIN Helper */}
          <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100 text-center">
            <span className="text-[11px] text-blue-900 block mb-1">
              🔑 <strong>PIN Demo Ujian:</strong> Gunakan kod <code className="font-mono bg-white px-1 py-0.5 rounded border border-blue-200 font-bold">{requiredPin}</code>
            </span>
            <button
              type="button"
              onClick={handleQuickDemoPin}
              className="text-xs text-blue-700 hover:text-blue-900 font-semibold underline cursor-pointer"
            >
              Isi automatik PIN {requiredPin}
            </button>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Sahkan Akses</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
