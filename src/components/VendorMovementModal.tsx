import React, { useState, useEffect } from 'react';
import { 
  X, 
  Truck, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Upload,
  Check,
  Building
} from 'lucide-react';
import { Equipment, CalibrationMovement } from '../types';
import { getTodayString, addOneYear, formatDateMalay } from '../utils/dateUtils';

interface VendorMovementModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
  onOutwardSubmit: (movement: Omit<CalibrationMovement, 'id' | 'createdAt' | 'status'>) => void;
  onInwardSubmit: (
    equipmentId: string, 
    returnData: {
      returnDate: string;
      result: 'Pass' | 'Fail' | 'Out of Tolerance';
      nextCalibrationDate: string;
      certNumber: string;
      certUrl?: string;
      certName?: string;
      remarks?: string;
    }
  ) => void;
}

export const VendorMovementModal: React.FC<VendorMovementModalProps> = ({
  equipment,
  isOpen,
  onClose,
  onOutwardSubmit,
  onInwardSubmit
}) => {
  if (!isOpen || !equipment) return null;

  const today = getTodayString();
  const isCurrentlyOut = equipment.currentStatus === 'Out for Calibration';

  // Default active tab: If currently out, default to Inward tab. Otherwise Outward tab.
  const [activeTab, setActiveTab] = useState<'outward' | 'inward'>(isCurrentlyOut ? 'inward' : 'outward');

  // Outward state
  const [outwardDate, setOutwardDate] = useState<string>(today);
  const [vendorName, setVendorName] = useState<string>('');
  const [doReference, setDoReference] = useState<string>(`DO/LGM/${new Date().getFullYear()}/` + Math.floor(100 + Math.random() * 900));
  const [expectedReturn, setExpectedReturn] = useState<string>('');
  const [outwardRemarks, setOutwardRemarks] = useState<string>('Kalibrasi tahunan standard ISO/IEC 17025');

  // Inward state
  const [returnDate, setReturnDate] = useState<string>(today);
  const [calibResult, setCalibResult] = useState<'Pass' | 'Fail' | 'Out of Tolerance'>('Pass');
  const [nextCalibrationDate, setNextCalibrationDate] = useState<string>(addOneYear(today));
  const [certNumber, setCertNumber] = useState<string>('');
  const [certFileName, setCertFileName] = useState<string>('');
  const [certFileUrl, setCertFileUrl] = useState<string>('');
  const [inwardRemarks, setInwardRemarks] = useState<string>('');

  const [errorMsg, setErrorMsg] = useState<string>('');

  // Whenever returnDate changes, auto update next calibration date to +1 year
  useEffect(() => {
    if (returnDate) {
      setNextCalibrationDate(addOneYear(returnDate));
    }
  }, [returnDate]);

  const handleCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCertFileUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOutwardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCurrentlyOut) {
      setErrorMsg('Peralatan ini sedang berada di luar bagi kalibrasi! Sila daftar penerimaan semula terlebih dahulu.');
      return;
    }
    if (!outwardDate) {
      setErrorMsg('Sila masukkan tarikh keluar alatan');
      return;
    }
    if (!vendorName.trim()) {
      setErrorMsg('Sila masukkan nama vendor / makmal kalibrasi luaran');
      return;
    }
    if (!doReference.trim()) {
      setErrorMsg('Sila masukkan No. Delivery Order (DO) / Surat Iringan');
      return;
    }

    onOutwardSubmit({
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      outwardDate,
      vendorName,
      doReference,
      expectedReturn: expectedReturn || outwardDate,
      remarks: outwardRemarks
    });

    onClose();
  };

  const handleInwardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnDate) {
      setErrorMsg('Sila masukkan tarikh penerimaan alatan');
      return;
    }
    if (!certNumber.trim()) {
      setErrorMsg('Sila masukkan nombor sijil kalibrasi vendor');
      return;
    }
    if (!nextCalibrationDate) {
      setErrorMsg('Sila tentukan tarikh luput kalibrasi seterusnya');
      return;
    }

    onInwardSubmit(equipment.id, {
      returnDate,
      result: calibResult,
      nextCalibrationDate,
      certNumber,
      certUrl: certFileUrl,
      certName: certFileName,
      remarks: inwardRemarks || 'Peralatan diterima semula dalam keadaan baik dan disahkan lulus.'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Logistik Kalibrasi Vendor Luar</h3>
              <p className="text-xs text-slate-400">FR-003 (Penjejakan Hantar Keluar & Terima Semula Sijil)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Equipment summary info */}
        <div className="bg-slate-50 border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                {equipment.id}
              </span>
              <h4 className="font-bold text-slate-900 text-sm mt-1">{equipment.name}</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Model: {equipment.model} • PIC: {equipment.picName}
              </p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                isCurrentlyOut 
                  ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                {isCurrentlyOut ? 'Sedang di Vendor' : 'Di Makmal'}
              </span>
            </div>
          </div>
        </div>

        {/* Dual Tab navigation */}
        <div className="grid grid-cols-2 border-b border-slate-200 text-xs font-bold text-center">
          <button
            onClick={() => {
              setActiveTab('outward');
              setErrorMsg('');
            }}
            className={`py-3 flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'outward'
                ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <ArrowUpRight className="w-4 h-4 text-blue-600" />
            <span>1. Hantar Keluar (Outward)</span>
          </button>
          
          <button
            onClick={() => {
              setActiveTab('inward');
              setErrorMsg('');
            }}
            className={`py-3 flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'inward'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
            <span>2. Terima Semula (Inward Return)</span>
          </button>
        </div>

        {errorMsg && (
          <div className="mx-5 mt-4 flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab 1: Outward Form */}
        {activeTab === 'outward' && (
          <form onSubmit={handleOutwardSubmit} className="p-5 space-y-4">
            {isCurrentlyOut && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <strong>Perhatian Sistem:</strong> Instrumen ini sudah berada di vendor luar. Sila gunakan tab <em>Terima Semula (Inward)</em> untuk mendaftar sijil kelulusan.
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tarikh Hantar Keluar *
                </label>
                <input
                  type="date"
                  value={outwardDate}
                  onChange={(e) => setOutwardDate(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  required
                  disabled={isCurrentlyOut}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jangkaan Tarikh Kembali
                </label>
                <input
                  type="date"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  disabled={isCurrentlyOut}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Vendor / Makmal Kalibrasi *
              </label>
              <input
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="cth: SIRIM Standards Technology Sdn Bhd / Mettler Toledo"
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                required
                disabled={isCurrentlyOut}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                No. Delivery Order (DO) / Surat Iringan Rasmi *
              </label>
              <input
                type="text"
                value={doReference}
                onChange={(e) => setDoReference(e.target.value)}
                placeholder="cth: DO/LGM/QA/2026/099"
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                required
                disabled={isCurrentlyOut}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Penghantaran / Skop Kalibrasi
              </label>
              <textarea
                rows={2}
                value={outwardRemarks}
                onChange={(e) => setOutwardRemarks(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                disabled={isCurrentlyOut}
              />
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
              ⚡ Status alatan akan serta-merta bertukar menjadi <strong>`Out for Calibration`</strong> dan dikunci daripada pengesanan hantaran bertindih.
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isCurrentlyOut}
                className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition flex items-center gap-1.5 ${
                  isCurrentlyOut 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Hantar ke Vendor Luar</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Inward Return Form */}
        {activeTab === 'inward' && (
          <form onSubmit={handleInwardSubmit} className="p-5 space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tarikh Terima Semula *
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tarikh Kalibrasi Baharu (+1 Tahun) *
                </label>
                <input
                  type="date"
                  value={nextCalibrationDate}
                  onChange={(e) => setNextCalibrationDate(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-bold text-blue-700"
                  required
                />
              </div>
            </div>

            {/* Keputusan Kalibrasi */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Keputusan Kalibrasi Vendor *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'Pass', label: 'LULUS (Pass)', color: 'text-emerald-700 border-emerald-300 bg-emerald-50' },
                  { value: 'Fail', label: 'GAGAL (Fail)', color: 'text-rose-700 border-rose-300 bg-rose-50' },
                  { value: 'Out of Tolerance', label: 'Di Luar Toleransi', color: 'text-amber-700 border-amber-300 bg-amber-50' }
                ].map((item) => (
                  <label
                    key={item.value}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border cursor-pointer text-center transition ${
                      calibResult === item.value 
                        ? `${item.color} ring-2 ring-blue-500 font-bold` 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="calibResult"
                      value={item.value}
                      checked={calibResult === item.value}
                      onChange={() => setCalibResult(item.value as any)}
                      className="hidden"
                    />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* No. Sijil Kalibrasi */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombor Sijil Kalibrasi Rasmi *
              </label>
              <input
                type="text"
                value={certNumber}
                onChange={(e) => setCertNumber(e.target.value)}
                placeholder="cth: SIRIM-CAL-2026-8819A"
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                required
              />
            </div>

            {/* Muat Naik Sijil PDF */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Salinan Sijil Kalibrasi (PDF / Imej)
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition">
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Pilih Salinan Sijil...</span>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleCertUpload}
                    className="hidden"
                  />
                </label>
                {certFileName ? (
                  <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                    <FileText className="w-3.5 h-3.5" />
                    <span className="line-clamp-1">{certFileName}</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">Tiada fail sijil dipilih</span>
                )}
              </div>
            </div>

            {/* Catatan Penerimaan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Penerimaan / Keadaan Fizikal
              </label>
              <textarea
                rows={2}
                value={inwardRemarks}
                onChange={(e) => setInwardRemarks(e.target.value)}
                placeholder="Pemeriksaan fizikal semasa penerimaan selesai..."
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
              ✓ Status alatan akan diperbaharui semula kepada <strong>`Active`</strong> dan tarikh kalibrasi seterusnya dijadualkan ke <strong>{formatDateMalay(nextCalibrationDate)}</strong>.
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Daftar Masuk & Sahkan Sijil</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
