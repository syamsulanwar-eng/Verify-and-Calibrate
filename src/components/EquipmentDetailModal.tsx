import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  FileCheck2, 
  Truck, 
  QrCode, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Download,
  Share2,
  ExternalLink,
  Edit,
  Tag,
  ShieldCheck
} from 'lucide-react';
import { Equipment, VerificationLog, CalibrationMovement, UserRole } from '../types';
import { formatDateMalay, getDaysRemaining, getRelativeDaysLabel } from '../utils/dateUtils';

interface EquipmentDetailModalProps {
  equipment: Equipment | null;
  logs: VerificationLog[];
  movements: CalibrationMovement[];
  isOpen: boolean;
  onClose: () => void;
  onOpenVerification: (eq: Equipment) => void;
  onOpenVendorMovement: (eq: Equipment) => void;
  onOpenEdit: (eq: Equipment) => void;
  onOpenQrSticker: (eq: Equipment) => void;
  currentRole: UserRole;
  todayStr: string;
}

export const EquipmentDetailModal: React.FC<EquipmentDetailModalProps> = ({
  equipment,
  logs,
  movements,
  isOpen,
  onClose,
  onOpenVerification,
  onOpenVendorMovement,
  onOpenEdit,
  onOpenQrSticker,
  currentRole,
  todayStr
}) => {
  if (!isOpen || !equipment) return null;

  const [activeTab, setActiveTab] = useState<'info' | 'verifications' | 'movements'>('info');

  const filteredLogs = logs.filter(l => l.equipmentId === equipment.id);
  const filteredMovements = movements.filter(m => m.equipmentId === equipment.id);

  const daysVerif = getDaysRemaining(equipment.nextVerificationDate, todayStr);
  const daysCalib = getDaysRemaining(equipment.nextCalibrationDate, todayStr);
  const relVerif = getRelativeDaysLabel(daysVerif);
  const relCalib = getRelativeDaysLabel(daysCalib);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                  {equipment.id}
                </span>
                <span className="text-xs text-slate-400">{equipment.category}</span>
              </div>
              <h2 className="font-bold text-base sm:text-lg text-white mt-1 leading-snug">
                {equipment.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-slate-50 border-b border-slate-200 text-xs">
          <div className="p-3">
            <span className="text-slate-400 block text-[11px]">Status Operasi</span>
            <span className={`inline-block font-bold text-xs mt-0.5 px-2 py-0.5 rounded-full ${
              equipment.currentStatus === 'Active' ? 'bg-emerald-100 text-emerald-800' :
              equipment.currentStatus === 'Due Soon' ? 'bg-amber-100 text-amber-800 animate-pulse' :
              equipment.currentStatus === 'Out for Calibration' ? 'bg-blue-100 text-blue-800' :
              'bg-rose-100 text-rose-800'
            }`}>
              {equipment.currentStatus}
            </span>
          </div>

          <div className="p-3">
            <span className="text-slate-400 block text-[11px]">Verifikasi Bulanan</span>
            <div className="font-bold text-slate-800 text-xs mt-0.5 font-mono">
              {formatDateMalay(equipment.nextVerificationDate)}
            </div>
            <span className={`text-[10px] font-semibold ${relVerif.urgent ? 'text-rose-600' : relVerif.warning ? 'text-amber-600' : 'text-slate-500'}`}>
              {relVerif.text}
            </span>
          </div>

          <div className="p-3">
            <span className="text-slate-400 block text-[11px]">Kalibrasi Tahunan</span>
            <div className="font-bold text-slate-800 text-xs mt-0.5 font-mono">
              {formatDateMalay(equipment.nextCalibrationDate)}
            </div>
            <span className={`text-[10px] font-semibold ${relCalib.urgent ? 'text-rose-600' : relCalib.warning ? 'text-amber-600' : 'text-slate-500'}`}>
              {relCalib.text}
            </span>
          </div>

          <div className="p-3">
            <span className="text-slate-400 block text-[11px]">Lokasi Semasa</span>
            <div className="font-semibold text-slate-800 text-xs mt-0.5 line-clamp-2 flex items-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <span>{equipment.currentLocation}</span>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 text-xs font-semibold px-4 pt-2 bg-white">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'info'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Profil Instrumen</span>
          </button>

          <button
            onClick={() => setActiveTab('verifications')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'verifications'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Log Verifikasi Bulanan ({filteredLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('movements')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'movements'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Pergerakan Kalibrasi Vendor ({filteredMovements.length})</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          
          {/* TAB 1: Profile Details */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Device specs box */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Spesifikasi Peralatan
                  </h4>
                  
                  <div className="text-xs space-y-1.5">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Model / Siri:</span>
                      <span className="font-semibold text-slate-800">{equipment.model}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">No. Rujukan LGM:</span>
                      <span className="font-mono font-semibold text-slate-800">{equipment.serialNo}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Kategori Makmal:</span>
                      <span className="font-semibold text-slate-800">{equipment.category}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Piawaian / Rujukan:</span>
                      <span className="font-semibold text-slate-800 text-right">{equipment.standardRef || 'ISO/IEC 17025'}</span>
                    </div>
                  </div>
                </div>

                {/* PIC & Lab Location box */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Pegawai Pengendali (Operator / PIC)
                  </h4>
                  
                  <div className="text-xs space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-700 shrink-0" />
                      <div>
                        <span className="text-slate-500 text-[11px] block">Nama Pegawai:</span>
                        <strong className="text-slate-900">{equipment.picName}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                      <div>
                        <span className="text-slate-500 text-[11px] block">Emel Rasmi:</span>
                        <a href={`mailto:${equipment.picEmail}`} className="text-blue-700 hover:underline font-mono">
                          {equipment.picEmail}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                      <div>
                        <span className="text-slate-500 text-[11px] block">No. Telefon:</span>
                        <span className="font-mono text-slate-800">{equipment.picPhone || '+6012-XXXXXXX'}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Calibration Points & Metrology Specifications */}
              {/* Calibration Points & Metrology Specifications */}
              {equipment.notes && (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 text-xs">
                  <span className="font-bold text-slate-800 block mb-1 font-mono uppercase text-[11px]">
                    {equipment.category.includes('Kebuk Wasap') ? 'Spesifikasi & Halaju Muka Kebuk Wasap:' : 'Parameter & Titik Penentukuran MeTCaL:'}
                  </span>
                  <div className="font-mono bg-white p-2.5 rounded border border-slate-200 text-slate-800 leading-relaxed text-[11px]">
                    {equipment.notes}
                  </div>
                </div>
              )}

              {/* Document Reference Banner */}
              <div className="p-3 rounded-xl border border-blue-100 bg-blue-50/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 block">
                      {equipment.id.startsWith('OV') || equipment.name.toLowerCase().includes('oven')
                        ? 'Master List of Oven Calibration 2026'
                        : equipment.category.includes('Kebuk Wasap')
                        ? 'Dokumen Verifikasi Kebuk Wasap 2026'
                        : 'Jadual Penentukuran MeTCaL 2026'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {equipment.id.startsWith('OV') || equipment.name.toLowerCase().includes('oven')
                        ? 'Disediakan oleh: En. Mohd Fandi Bin Mohd Sukri (PDF)'
                        : 'Fail asal akreditasi makmal UPKS LGM (PDF)'}
                    </span>
                  </div>
                </div>
                <a
                  href={
                    equipment.id.startsWith('OV') || equipment.name.toLowerCase().includes('oven')
                      ? '/assets/aistudio/2026_Oven_Periodic_Verification1_5ccc33c2.pdf'
                      : equipment.category.includes('Kebuk Wasap')
                      ? '/assets/aistudio/2026_Fumehood_-_Periodic_Verification_101020251_b28c60f6.pdf'
                      : '/assets/aistudio/2026_UPKS_Calibration_List_MeTCaL_d8f9d349.pdf'
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 text-[11px] font-semibold text-blue-800 hover:text-blue-900 bg-white hover:bg-blue-100 border border-blue-200 rounded transition flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Buka PDF</span>
                </a>
              </div>

              {/* QR Code lab quick card */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-100 rounded-xl">
                    <QrCode className="w-6 h-6 text-slate-700" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Pelekat Kalibrasi Fizikal</h5>
                    <p className="text-[11px] text-slate-500">
                      Pelekat kod QR untuk dilekatkan terus pada badan instrumen di lantai makmal.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onOpenQrSticker(equipment)}
                  className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
                >
                  Papar & Cetak Pelekat
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: Monthly Verification Logs */}
          {activeTab === 'verifications' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Rekod ujian berkala setiap 30 hari (Option B: Nilai Bacaan & Bukti).
                </p>
                <button
                  onClick={() => onOpenVerification(equipment)}
                  className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition flex items-center gap-1"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>+ Tambah Log Baharu</span>
                </button>
              </div>

              {filteredLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-medium text-slate-600">Belum ada rekod log verifikasi bulanan.</p>
                  <button
                    onClick={() => onOpenVerification(equipment)}
                    className="mt-2 text-xs text-blue-600 font-semibold hover:underline"
                  >
                    Daftar log pertama sekarang
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredLogs.map((log) => (
                    <div 
                      key={log.id} 
                      className={`p-3.5 rounded-xl border text-xs transition ${
                        log.status === 'Pass' ? 'border-emerald-200 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {log.status === 'Pass' ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                          <span className="font-bold text-slate-900 font-mono">
                            {formatDateMalay(log.verificationDate)}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'Pass' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {log.status.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          Oleh: <strong>{log.conductedBy}</strong>
                        </span>
                      </div>

                      <div className="mt-2 text-slate-700 bg-white/70 p-2.5 rounded-lg border border-slate-200/60 font-mono text-[11px]">
                        <strong>Bacaan Standard:</strong> {log.readingValue}
                      </div>

                      {log.remarks && (
                        <p className="mt-1.5 text-slate-600 text-xs">
                          <strong className="text-slate-700">Catatan:</strong> {log.remarks}
                        </p>
                      )}

                      {log.proofName && (
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-blue-600">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Lampiran: {log.proofName}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Vendor Movements */}
          {activeTab === 'movements' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Log pergerakan fizikal alatan ke makmal kalibrasi luar dan salinan sijil kelulusan.
                </p>
                <button
                  onClick={() => onOpenVendorMovement(equipment)}
                  className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition flex items-center gap-1"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>+ Kemas Kini Logistik Vendor</span>
                </button>
              </div>

              {filteredMovements.length === 0 ? (
                <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  <Truck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-medium text-slate-600">Belum ada rekod kalibrasi vendor luaran.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredMovements.map((mov) => (
                    <div 
                      key={mov.id} 
                      className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs hover:border-blue-200 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{mov.vendorName}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              mov.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {mov.status === 'Completed' ? 'Selesai & Diterima' : 'Sedang Diproses'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            No. DO / Surat Iringan: <strong>{mov.doReference}</strong>
                          </div>
                        </div>

                        {mov.result && (
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            mov.result === 'Pass' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            Keputusan: {mov.result}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                        <div>Tarikh Hantar: <strong>{formatDateMalay(mov.outwardDate)}</strong></div>
                        <div>
                          Tarikh Kembali: <strong>{mov.returnDate ? formatDateMalay(mov.returnDate) : `Jangkaan: ${formatDateMalay(mov.expectedReturn)}`}</strong>
                        </div>
                      </div>

                      {mov.certNumber && (
                        <div className="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-slate-400 text-[11px]">No. Sijil Kalibrasi:</span>
                            <div className="font-mono font-bold text-blue-800">{mov.certNumber}</div>
                          </div>
                          {mov.certName && (
                            <span className="text-[11px] text-slate-500 flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5" />
                              {mov.certName}
                            </span>
                          )}
                        </div>
                      )}

                      {mov.remarks && (
                        <p className="mt-2 text-[11px] text-slate-500 italic">
                          "{mov.remarks}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenQrSticker(equipment)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 bg-white border border-slate-200 rounded-xl transition flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4 text-slate-600" />
              <span>Pelekat QR Makmal</span>
            </button>

            {currentRole === 'admin' && (
              <button
                onClick={() => onOpenEdit(equipment)}
                className="px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 bg-white border border-purple-200 rounded-xl transition flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Kemas Kini Maklumat</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenVerification(equipment)}
              className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition flex items-center gap-1.5"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Log Verifikasi</span>
            </button>

            <button
              onClick={() => onOpenVendorMovement(equipment)}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Truck className="w-4 h-4" />
              <span>{equipment.currentStatus === 'Out for Calibration' ? 'Terima Semula' : 'Hantar ke Vendor'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
