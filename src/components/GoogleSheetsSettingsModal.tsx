import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  RotateCcw,
  Code2,
  FileSpreadsheet,
  Layers
} from 'lucide-react';
import { GoogleSheetsConfig, Equipment, VerificationLog, CalibrationMovement } from '../types';
import { StorageService } from '../services/storageService';

interface GoogleSheetsSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GoogleSheetsConfig;
  onSaveConfig: (config: GoogleSheetsConfig) => void;
  onSyncNow: () => Promise<void>;
  onResetData: () => void;
  equipment: Equipment[];
  logs: VerificationLog[];
  movements: CalibrationMovement[];
}

export const GoogleSheetsSettingsModal: React.FC<GoogleSheetsSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onSyncNow,
  onResetData,
  equipment,
  logs,
  movements
}) => {
  if (!isOpen) return null;

  const [url, setUrl] = useState(config.webAppUrl || '');
  const [autoSync, setAutoSync] = useState(config.autoSync || false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'config' | 'script' | 'backup'>('config');

  const appsScriptCode = StorageService.getAppsScriptTemplate();

  const handleCopyScript = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleSaveAndTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    const newConfig: GoogleSheetsConfig = {
      ...config,
      webAppUrl: url.trim(),
      autoSync
    };
    onSaveConfig(newConfig);

    if (!url.trim()) {
      setIsTesting(false);
      setTestResult({
        success: true,
        message: 'Mod setempat (Local Storage) diaktifkan. Data disimpan dalam pelayar anda.'
      });
      return;
    }

    try {
      await onSyncNow();
      setIsTesting(false);
      setTestResult({
        success: true,
        message: 'Sambungan ke Google Apps Script berjaya disahkan!'
      });
    } catch (err: any) {
      setIsTesting(false);
      setTestResult({
        success: false,
        message: err?.message || 'Gagal menghubungi Google Apps Script. Sila semak semula kebenaran Deploy Web App (Anyone).'
      });
    }
  };

  // Export full JSON backup
  const handleExportJson = () => {
    const fullBackup = {
      timestamp: new Date().toISOString(),
      equipment,
      verificationLogs: logs,
      calibrationMovements: movements
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `CalibraTrack_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(blobUrl);
  };

  // Export Equipment as CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Nama', 'Model', 'Serial_No', 'Kategori', 'Lokasi', 'PIC_Nama', 'PIC_Emel', 'Verifikasi_Seterusnya', 'Kalibrasi_Seterusnya', 'Status'];
    const rows = equipment.map(eq => [
      `"${eq.id}"`,
      `"${eq.name}"`,
      `"${eq.model}"`,
      `"${eq.serialNo}"`,
      `"${eq.category}"`,
      `"${eq.currentLocation}"`,
      `"${eq.picName}"`,
      `"${eq.picEmail}"`,
      `"${eq.nextVerificationDate}"`,
      `"${eq.nextCalibrationDate}"`,
      `"${eq.currentStatus}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `CalibraTrack_Equipment_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(blobUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Integrasi Google Sheets & Storan</h3>
              <p className="text-xs text-slate-400">Penyambung REST API Google Apps Script & Sandaran Data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex border-b border-slate-200 text-xs font-semibold px-4 pt-2 bg-slate-50">
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'config'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Pautan Web App</span>
          </button>

          <button
            onClick={() => setActiveTab('script')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'script'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Skrip Google Apps Script (Code.gs)</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'backup'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Sandaran & Reset</span>
          </button>
        </div>

        {/* TAB 1: Config & Connect */}
        {activeTab === 'config' && (
          <div className="p-5 space-y-4">
            
            {/* Status overview */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Status Sambungan:</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    config.status === 'connected' ? 'bg-emerald-500 animate-pulse' :
                    config.webAppUrl ? 'bg-amber-400' : 'bg-slate-400'
                  }`}></span>
                  <span className="text-xs font-bold text-slate-800">
                    {config.status === 'connected' ? 'Tersambung ke Google Sheets' :
                     config.webAppUrl ? 'Menunggu Pengesahan' : 'Storan Setempat (Offline/Local Storage)'}
                  </span>
                </div>
              </div>

              {config.pendingQueueCount > 0 && (
                <div className="text-right">
                  <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-1 rounded-md">
                    {config.pendingQueueCount} Perubahan Dalam Antrian
                  </span>
                </div>
              )}
            </div>

            {/* Input Web App URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Google Apps Script Web App URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                className="w-full text-xs font-mono px-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Dapatkan pautan ini selepas membuat <em>New Deployment</em> sebagai <em>Web App</em> di Google Sheets anda.
              </p>
            </div>

            {testResult && (
              <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                testResult.success 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            {/* 3 Step setup reminder */}
            <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl text-xs space-y-1.5 text-blue-900">
              <strong className="block">Panduan Ringkas 3 Langkah Google Sheets:</strong>
              <ol className="list-decimal pl-4 space-y-1 text-slate-700">
                <li>Buka fail Google Sheets baharu di Google Drive anda.</li>
                <li>Pergi ke menu <strong>Extensions &gt; Apps Script</strong>, salin kod daripada tab <em>Skrip (Code.gs)</em> dan tampal.</li>
                <li>Klik <strong>Deploy &gt; New deployment</strong>, pilih <em>Web App</em>, set <em>Who has access</em> kepada <strong>Anyone</strong>, kemudian salin URL ke sini.</li>
              </ol>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Tutup
              </button>

              <button
                type="button"
                onClick={handleSaveAndTest}
                disabled={isTesting}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? 'Menguji Sambungan...' : 'Simpan & Uji Sambungan'}</span>
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: Script Code */}
        {activeTab === 'script' && (
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-600">
                Salin kod ini dan tampal ke dalam <strong>Code.gs</strong> pada Google Sheets anda:
              </p>
              <button
                onClick={handleCopyScript}
                className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Berjaya Disalin!' : 'Salin Semua Kod (Code.gs)'}</span>
              </button>
            </div>

            <pre className="p-3 bg-slate-900 text-slate-200 text-[11px] font-mono rounded-xl max-h-72 overflow-y-auto leading-relaxed border border-slate-800">
              {appsScriptCode}
            </pre>
          </div>
        )}

        {/* TAB 3: Backup & Reset */}
        {activeTab === 'backup' && (
          <div className="p-5 space-y-4">
            <p className="text-xs text-slate-600">
              Muat turun salinan sandaran data inventori atau pulihkan sampel data permulaan.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExportCsv}
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition"
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 mb-1" />
                <div className="text-xs font-bold text-slate-900">Eksport ke CSV</div>
                <div className="text-[11px] text-slate-500">Sesuai untuk dibuka di Excel / Sheets</div>
              </button>

              <button
                onClick={handleExportJson}
                className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-left transition"
              >
                <Download className="w-5 h-5 text-blue-600 mb-1" />
                <div className="text-xs font-bold text-slate-900">Sandaran Penuh (JSON)</div>
                <div className="text-[11px] text-slate-500">Termasuk semua log verifikasi & kalibrasi</div>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-rose-900">Tetapkan Semula Data Contoh (Reset Demo)</h5>
                  <p className="text-[11px] text-rose-700">
                    Memadam rekod tempatan dan mengembalikan peralatan makmal asal.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Adakah anda pasti ingin menetapkan semula ke sampel data asal?')) {
                      onResetData();
                      onClose();
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-white border border-rose-300 hover:bg-rose-100 rounded-lg transition"
                >
                  Reset Demo
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
