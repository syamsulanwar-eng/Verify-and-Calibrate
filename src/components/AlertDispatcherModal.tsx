import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Mail, 
  MessageSquare, 
  AlertTriangle, 
  Clock, 
  Send, 
  Copy, 
  Check, 
  ExternalLink,
  Smartphone,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { Equipment } from '../types';
import { formatDateMalay, getDaysRemaining, getRelativeDaysLabel } from '../utils/dateUtils';

interface AlertDispatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  urgentEquipment: Equipment[];
  todayStr: string;
}

export const AlertDispatcherModal: React.FC<AlertDispatcherModalProps> = ({
  isOpen,
  onClose,
  urgentEquipment,
  todayStr
}) => {
  if (!isOpen) return null;

  const [selectedItem, setSelectedItem] = useState<Equipment | null>(
    urgentEquipment.length > 0 ? urgentEquipment[0] : null
  );
  const [copiedType, setCopiedType] = useState<'email' | 'wa' | null>(null);

  // Group by overdue vs due soon
  const overdueList = urgentEquipment.filter(eq => {
    const dVerif = getDaysRemaining(eq.nextVerificationDate, todayStr);
    const dCalib = getDaysRemaining(eq.nextCalibrationDate, todayStr);
    return dVerif < 0 || dCalib < 0 || eq.currentStatus === 'Overdue' || eq.currentStatus === 'Out of Service';
  });

  const dueSoonList = urgentEquipment.filter(eq => !overdueList.includes(eq));

  // Generate Email template
  const getEmailSubject = (eq: Equipment) => {
    return `[PERINGATAN KALIBRASI] Tindakan Diperlukan: ${eq.id} - ${eq.name}`;
  };

  const getEmailBody = (eq: Equipment) => {
    const daysVerif = getDaysRemaining(eq.nextVerificationDate, todayStr);
    const daysCalib = getDaysRemaining(eq.nextCalibrationDate, todayStr);

    return `Assalamualaikum & Salam Sejahtera ${eq.picName},

Ini ialah peringatan rasmi sistem pengurusan kualiti (ISO/IEC 17025) mengenai instrumen di bawah kawalan anda yang memerlukan perhatian segera:

ID Peralatan : ${eq.id}
Nama Alatan  : ${eq.name}
Model / No Siri: ${eq.model} (SN: ${eq.serialNo})
Lokasi Semasa: ${eq.currentLocation}

STATUS SEMASA:
- Verifikasi Bulanan: ${formatDateMalay(eq.nextVerificationDate)} (${daysVerif < 0 ? `TERLEWAT ${Math.abs(daysVerif)} HARI` : `Baki ${daysVerif} hari`})
- Kalibrasi Vendor : ${formatDateMalay(eq.nextCalibrationDate)} (${daysCalib < 0 ? `TERLEWAT ${Math.abs(daysCalib)} HARI` : `Baki ${daysCalib} hari`})

TINDAKAN DIPERLUKAN:
1. Sila laksanakan ujian verifikasi bulanan atau sediakan instrumen bagi penghantaran ke makmal vendor.
2. Rekodkan bukti dan nombor sijil di dalam sistem CalibraTrack bagi mengelakkan ketidakpatuhan audit QA.

Sekian, terima kasih.
Unit Jaminan Kualiti & Penentukuran Makmal`;
  };

  // Generate WhatsApp text
  const getWhatsappText = (eq: Equipment) => {
    const daysVerif = getDaysRemaining(eq.nextVerificationDate, todayStr);
    const daysCalib = getDaysRemaining(eq.nextCalibrationDate, todayStr);
    const isOverdue = daysVerif < 0 || daysCalib < 0;

    return `*🔔 [PERINGATAN KALIBRASI ALATAN]*
Kepada: *${eq.picName}*

Instrumen berikut memerlukan tindakan verifikasi / kalibrasi segera:
📌 *ID:* ${eq.id}
🏷 *Nama:* ${eq.name}
📍 *Lokasi:* ${eq.currentLocation}

📅 *Verifikasi Bulanan:* ${formatDateMalay(eq.nextVerificationDate)} (${daysVerif < 0 ? `TERLEWAT ${Math.abs(daysVerif)} hari ⚠️` : `baki ${daysVerif} hari`})
📅 *Kalibrasi Vendor:* ${formatDateMalay(eq.nextCalibrationDate)} (${daysCalib < 0 ? `TERLEWAT ${Math.abs(daysCalib)} hari ⚠️` : `baki ${daysCalib} hari`})

Sila buka portal CalibraTrack untuk log verifikasi atau daftar hantaran vendor. Terima kasih.`;
  };

  const handleCopy = (text: string, type: 'email' | 'wa') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleSendWhatsapp = (eq: Equipment) => {
    const text = encodeURIComponent(getWhatsappText(eq));
    const cleanPhone = eq.picPhone.replace(/[^0-9]/g, '');
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  const handleSendEmail = (eq: Equipment) => {
    const subject = encodeURIComponent(getEmailSubject(eq));
    const body = encodeURIComponent(getEmailBody(eq));
    window.location.href = `mailto:${eq.picEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Pusat Amaran & Notifikasi Berbilang Saluran</h3>
              <p className="text-xs text-slate-400">FR-004 (Visual Dashboard, Draf Emel PIC & Mesej WhatsApp/Telegram)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {urgentEquipment.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-base">Semua Peralatan Terkawal & Sah!</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Tiada peralatan yang berada dalam lingkungan amaran 30 hari atau terlewat tarikh luput buat masa ini.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition"
            >
              Tutup Pusat Amaran
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            
            {/* Left Column: Equipment list requiring attention */}
            <div className="md:col-span-5 p-4 max-h-[65vh] overflow-y-auto space-y-3 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Senarai Amaran ({urgentEquipment.length} Unit)
                </span>
                <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Ambang 30 Hari
                </span>
              </div>

              {/* Overdue Items */}
              {overdueList.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Terlewat / Luput Had ({overdueList.length})</span>
                  </div>
                  {overdueList.map(eq => (
                    <button
                      key={eq.id}
                      onClick={() => setSelectedItem(eq)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition ${
                        selectedItem?.id === eq.id
                          ? 'border-rose-500 bg-rose-50/80 ring-2 ring-rose-500/20'
                          : 'border-slate-200 bg-white hover:bg-rose-50/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-900">{eq.id}</span>
                        <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded">
                          {eq.currentStatus}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-800 line-clamp-1 mt-0.5">{eq.name}</div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                        <span>PIC: {eq.picName}</span>
                        <span className="text-rose-600 font-semibold font-mono">
                          {formatDateMalay(eq.nextCalibrationDate)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Due Soon Items */}
              {dueSoonList.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <div className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Perlu Tindakan Bulan Ini ({dueSoonList.length})</span>
                  </div>
                  {dueSoonList.map(eq => (
                    <button
                      key={eq.id}
                      onClick={() => setSelectedItem(eq)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition ${
                        selectedItem?.id === eq.id
                          ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20'
                          : 'border-slate-200 bg-white hover:bg-amber-50/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-900">{eq.id}</span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                          Due Soon
                        </span>
                      </div>
                      <div className="font-semibold text-slate-800 line-clamp-1 mt-0.5">{eq.name}</div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                        <span>PIC: {eq.picName}</span>
                        <span className="text-amber-700 font-semibold font-mono">
                          {formatDateMalay(eq.nextCalibrationDate)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Multi-Channel Dispatch previews */}
            <div className="md:col-span-7 p-5 max-h-[65vh] overflow-y-auto space-y-4">
              {selectedItem ? (
                <>
                  <div className="border-b border-slate-200 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {selectedItem.id}
                      </span>
                      <span className="text-xs text-slate-500">
                        Penerima: <strong className="text-slate-900">{selectedItem.picName}</strong>
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{selectedItem.name}</h4>
                    <p className="text-xs text-slate-500">Lokasi: {selectedItem.currentLocation}</p>
                  </div>

                  {/* Channel 1: WhatsApp / Telegram Message Dispatch */}
                  <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                        <Smartphone className="w-4 h-4 text-emerald-600" />
                        <span>Mesej Notifikasi WhatsApp & Telegram</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{selectedItem.picPhone}</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-emerald-100 font-mono text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {getWhatsappText(selectedItem)}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => handleCopy(getWhatsappText(selectedItem), 'wa')}
                        className="px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition flex items-center gap-1"
                      >
                        {copiedType === 'wa' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedType === 'wa' ? 'Disalin!' : 'Salin Mesej'}</span>
                      </button>

                      <button
                        onClick={() => handleSendWhatsapp(selectedItem)}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Hantar ke WhatsApp PIC</span>
                      </button>
                    </div>
                  </div>

                  {/* Channel 2: Formatted Email to PIC */}
                  <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span>Draf E-mel Rasmi PIC</span>
                      </div>
                      <span className="text-[10px] text-blue-700 font-mono">{selectedItem.picEmail}</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-blue-100 font-mono text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                      <strong>Subjek: {getEmailSubject(selectedItem)}</strong>
                      <br /><br />
                      {getEmailBody(selectedItem)}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => handleCopy(getEmailBody(selectedItem), 'email')}
                        className="px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition flex items-center gap-1"
                      >
                        {copiedType === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedType === 'email' ? 'Disalin!' : 'Salin Teks Emel'}</span>
                      </button>

                      <button
                        onClick={() => handleSendEmail(selectedItem)}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Buka Emel PIC (mailto:)</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  Pilih salah satu instrumen di sebelah kiri untuk melihat draf amaran.
                </div>
              )}
            </div>

          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Mematuhi sistem penggera proaktif 30-hari (Sifar Kelewatan Luput / Zero Overdue).</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
