import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  Database, 
  Bell, 
  UserCheck, 
  Lock, 
  ChevronDown, 
  FileSpreadsheet,
  CheckCircle2,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { UserRole, GoogleSheetsConfig } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onOpenAlerts: () => void;
  onOpenSheetsModal: () => void;
  onOpenAdminSettings: () => void;
  sheetsConfig: GoogleSheetsConfig;
  alertCount: number;
  todayStr: string;
  isSyncing: boolean;
  onQuickSync: () => void;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onSelectRole,
  onOpenAlerts,
  onOpenSheetsModal,
  sheetsConfig,
  alertCount,
  todayStr,
  isSyncing,
  onQuickSync,
  totalCount
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return { title: 'Pentadbir Makmal', badge: 'Admin', color: 'bg-slate-900 text-white' };
      case 'pic':
        return { title: 'Pegawai PIC / QA', badge: 'PIC Mode', color: 'bg-blue-800 text-white' };
      default:
        return { title: 'Akses Awam', badge: 'Read-Only', color: 'bg-slate-100 text-slate-700' };
    }
  };

  const roleInfo = getRoleLabel(currentRole);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      {/* Institutional Top Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 font-mono">
        <div className="flex items-center gap-2 text-[11px]">
          <span className="font-bold text-white tracking-wider">LEMBAGA GETAH MALAYSIA (LGM)</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300">Unit Pengujian & Kalibrasi Standard (UPKS)</span>
          <span className="text-slate-600 hidden md:inline">/</span>
          <span className="text-blue-400 hidden md:inline">MeTCaL Calibration 2026</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Tarikh Semasa: <span className="text-white font-bold">{todayStr}</span></span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{totalCount} Alatan Berdaftar</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-15 gap-4">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-slate-900 flex items-center justify-center text-white shrink-0 font-mono font-black text-sm tracking-tighter border border-slate-800">
              LGM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base text-slate-950 tracking-tight leading-none">
                  CalibraTrack UPKS
                </h1>
                <span className="text-[10px] font-mono font-semibold uppercase bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                  ISO/IEC 17025
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-none">
                Senarai Penentukuran MeTCaL, Kebuk Wasap & Master Ketuhar 2026
              </p>
            </div>
          </div>

          {/* Action Tools & Role Control */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Google Sheets Sync Button */}
            <button
              onClick={onOpenSheetsModal}
              title="Penyambung Google Sheets API & Sandaran"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline text-[11px]">Google Sheets</span>
              {sheetsConfig.webAppUrl ? (
                <span className="w-2 h-2 rounded-full bg-emerald-600" title="Tersambung ke Google Sheets"></span>
              ) : (
                <span className="text-[10px] text-slate-400 font-mono">Setempat</span>
              )}
            </button>

            {/* Alert Center Trigger */}
            <button
              onClick={onOpenAlerts}
              className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition ${
                alertCount > 0
                  ? 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Pusat Peringatan & Amaran PIC"
            >
              <Bell className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline text-[11px]">Amaran</span>
              {alertCount > 0 && (
                <span className="bg-amber-600 text-white text-[10px] font-mono font-bold px-1.5 py-0.2 rounded">
                  {alertCount}
                </span>
              )}
            </button>

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition border border-slate-300 ${roleInfo.color}`}
              >
                {currentRole === 'guest' ? (
                  <Lock className="w-3 h-3 opacity-60" />
                ) : (
                  <UserCheck className="w-3 h-3" />
                )}
                <span className="font-semibold text-[11px]">{roleInfo.title}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {roleMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setRoleMenuOpen(false)} 
                  />
                  <div className="absolute right-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-lg shadow-lg z-50 p-1.5 space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Tukar Peranan Pengguna
                    </div>

                    <button
                      onClick={() => {
                        onSelectRole('guest');
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between ${
                        currentRole === 'guest' ? 'bg-slate-100 font-bold text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-medium">Akses Awam (Staf Makmal)</div>
                        <div className="text-[10px] text-slate-400">Hanya semak status & carian</div>
                      </div>
                      {currentRole === 'guest' && <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>}
                    </button>

                    <button
                      onClick={() => {
                        onSelectRole('pic');
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between ${
                        currentRole === 'pic' ? 'bg-blue-50 font-bold text-blue-900' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          Pegawai PIC / QA
                          <span className="text-[10px] text-blue-600 font-mono font-normal">PIN: 1234</span>
                        </div>
                        <div className="text-[10px] text-slate-400">Log verifikasi & logistik vendor</div>
                      </div>
                      {currentRole === 'pic' && <span className="w-1.5 h-1.5 rounded-full bg-blue-700"></span>}
                    </button>

                    <button
                      onClick={() => {
                        onSelectRole('admin');
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between ${
                        currentRole === 'admin' ? 'bg-slate-100 font-bold text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          Pentadbir Makmal (Admin)
                          <span className="text-[10px] text-purple-600 font-mono font-normal">PIN: 9999</span>
                        </div>
                        <div className="text-[10px] text-slate-400">Daftar alatan & konfigurasi Google Sheets</div>
                      </div>
                      {currentRole === 'admin' && <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>}
                    </button>

                    {currentRole !== 'guest' && (
                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={() => {
                            onSelectRole('guest');
                            setRoleMenuOpen(false);
                          }}
                          className="w-full text-left px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded"
                        >
                          Log Keluar ke Paparan Awam
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
