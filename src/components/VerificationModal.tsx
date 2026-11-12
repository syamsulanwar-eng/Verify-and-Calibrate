import React, { useState } from 'react';
import { 
  X, 
  FileCheck2, 
  CheckCircle, 
  XCircle, 
  Upload, 
  Calendar, 
  AlertCircle,
  FileText,
  User,
  Sliders,
  Check
} from 'lucide-react';
import { Equipment, VerificationLog } from '../types';
import { addDays, getTodayString, formatDateMalay } from '../utils/dateUtils';

interface VerificationModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (log: Omit<VerificationLog, 'id' | 'createdAt'>, newVerificationDate: string, updatedStatus: 'Active' | 'Out of Service') => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  equipment,
  isOpen,
  onClose,
  onSubmit
}) => {
  if (!isOpen || !equipment) return null;

  const today = getTodayString();
  const [verificationDate, setVerificationDate] = useState<string>(today);
  const [conductedBy, setConductedBy] = useState<string>(equipment.picName || '');
  const [status, setStatus] = useState<'Pass' | 'Fail'>('Pass');
  const [readingValue, setReadingValue] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileUrl, setFileUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Auto-calculated next verification date (+30 days from test date)
  const nextScheduledDate = addDays(verificationDate || today, 30);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Read as base64 data url for persistent client viewing
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationDate) {
      setErrorMsg('Sila nyatakan tarikh ujian verifikasi');
      return;
    }
    if (!conductedBy.trim()) {
      setErrorMsg('Sila masukkan nama staf pelaksana ujian');
      return;
    }
    if (!readingValue.trim()) {
      setErrorMsg('Sila rekodkan nilai bacaan / ukuran rujukan standard');
      return;
    }

    const newStatus = status === 'Pass' ? 'Active' : 'Out of Service';

    onSubmit(
      {
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        verificationDate,
        conductedBy,
        status,
        readingValue,
        remarks: remarks.trim() || (status === 'Pass' ? 'Semakan bulanan lulus mengikut spesifikasi.' : 'Gagal semakan verifikasi bulanan.'),
        proofUrl: fileUrl,
        proofName: fileName
      },
      nextScheduledDate,
      newStatus
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Log Verifikasi Bulanan</h3>
              <p className="text-xs text-slate-400">FR-002 (Pilihan B: Rekod Ujian & Bukti Ukuran)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Equipment Identification summary */}
        <div className="bg-blue-50/70 border-b border-blue-100 p-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                {equipment.id}
              </span>
              <h4 className="font-bold text-slate-900 text-sm mt-1">{equipment.name}</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Model: {equipment.model} • Lokasi: {equipment.currentLocation}
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Tarikh Ujian */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tarikh Ujian Verifikasi *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={verificationDate}
                  onChange={(e) => setVerificationDate(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            {/* Nama Pelaksana */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Staf Pelaksana *
              </label>
              <input
                type="text"
                value={conductedBy}
                onChange={(e) => setConductedBy(e.target.value)}
                placeholder="cth: Syamsul Anwar (Juruteknik QA)"
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                required
              />
            </div>

          </div>

          {/* Keputusan: Pass / Fail Radio */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Keputusan Verifikasi *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition ${
                  status === 'Pass'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="verifStatus"
                  value="Pass"
                  checked={status === 'Pass'}
                  onChange={() => setStatus('Pass')}
                  className="hidden"
                />
                <CheckCircle className={`w-5 h-5 ${status === 'Pass' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <div className={`text-xs font-bold ${status === 'Pass' ? 'text-emerald-900' : 'text-slate-700'}`}>
                    LULUS (PASS)
                  </div>
                  <div className="text-[11px] text-slate-500">Dalam toleransi standard</div>
                </div>
              </label>

              <label
                className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition ${
                  status === 'Fail'
                    ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="verifStatus"
                  value="Fail"
                  checked={status === 'Fail'}
                  onChange={() => setStatus('Fail')}
                  className="hidden"
                />
                <XCircle className={`w-5 h-5 ${status === 'Fail' ? 'text-rose-600' : 'text-slate-400'}`} />
                <div>
                  <div className={`text-xs font-bold ${status === 'Fail' ? 'text-rose-900' : 'text-slate-700'}`}>
                    GAGAL (FAIL)
                  </div>
                  <div className="text-[11px] text-rose-600">Automatik Out of Service</div>
                </div>
              </label>
            </div>
          </div>

          {/* Nilai Bacaan / Ukuran Rujukan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nilai Bacaan / Ukuran Rujukan Standard *
            </label>
            <input
              type="text"
              value={readingValue}
              onChange={(e) => setReadingValue(e.target.value)}
              placeholder={
                equipment.category.includes('Kebuk Wasap')
                  ? "cth: Halaju Muka Purata: 156.50 fpm (Piawai DOSH ≥ 100 fpm / Grid 9-titik)"
                  : "cth: Blok Rujukan 10.00mm -> Bacaan: 10.01mm (Had +/- 0.05mm)"
              }
              className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1">
              {equipment.category.includes('Kebuk Wasap')
                ? 'Masukkan nilai purata halaju muka (face velocity fpm atau m/s) mengikut jadual bulanan.'
                : 'Masukkan nilai ukuran instrumen berbanding standard rujukan makmal.'}
            </p>
          </div>

          {/* Catatan Ringkas */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Ringkas (Remarks)
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="cth: Keadaan mekanikal baik, kanta pengukur dibersihkan..."
              className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Lampiran Bukti Semakan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lampiran Bukti Semakan (Foto / Sijil Semakan)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition">
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Pilih Fail...</span>
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {fileName ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="line-clamp-1">{fileName}</span>
                </div>
              ) : (
                <span className="text-xs text-slate-400">Tiada fail dipilih (Pilihan)</span>
              )}
            </div>
          </div>

          {/* Next Verification Date Preview notice */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
            <div className="text-slate-600">
              <span>Tarikh Semakan Bulanan Seterusnya:</span>
              <div className="text-[11px] text-slate-400">Automatik anjakan +30 hari daripada tarikh ujian</div>
            </div>
            <div className="font-mono font-bold text-sm text-blue-700">
              {formatDateMalay(nextScheduledDate)}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Sahkan & Simpan Log</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
