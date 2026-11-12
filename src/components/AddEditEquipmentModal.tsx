import React, { useState, useEffect } from 'react';
import { 
  X, 
  Layers, 
  Check, 
  AlertCircle, 
  Plus, 
  Edit3,
  Calendar,
  Building,
  User,
  MapPin,
  Tag
} from 'lucide-react';
import { Equipment } from '../types';
import { getTodayString, addDays, addOneYear } from '../utils/dateUtils';

interface AddEditEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentToEdit: Equipment | null;
  onSave: (eq: Equipment) => void;
  existingCount: number;
}

export const AddEditEquipmentModal: React.FC<AddEditEquipmentModalProps> = ({
  isOpen,
  onClose,
  equipmentToEdit,
  onSave,
  existingCount
}) => {
  if (!isOpen) return null;

  const isEdit = Boolean(equipmentToEdit);
  const today = getTodayString();

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [serialNo, setSerialNo] = useState('');
  const [category, setCategory] = useState('Mekanikal & Fizikal');
  const [currentLocation, setCurrentLocation] = useState('');
  const [picName, setPicName] = useState('');
  const [picEmail, setPicEmail] = useState('');
  const [picPhone, setPicPhone] = useState('+601');
  const [nextVerificationDate, setNextVerificationDate] = useState('');
  const [nextCalibrationDate, setNextCalibrationDate] = useState('');
  const [standardRef, setStandardRef] = useState('ISO/IEC 17025');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (equipmentToEdit) {
      setId(equipmentToEdit.id);
      setName(equipmentToEdit.name);
      setModel(equipmentToEdit.model);
      setSerialNo(equipmentToEdit.serialNo);
      setCategory(equipmentToEdit.category);
      setCurrentLocation(equipmentToEdit.currentLocation);
      setPicName(equipmentToEdit.picName);
      setPicEmail(equipmentToEdit.picEmail);
      setPicPhone(equipmentToEdit.picPhone || '+601');
      setNextVerificationDate(equipmentToEdit.nextVerificationDate);
      setNextCalibrationDate(equipmentToEdit.nextCalibrationDate);
      setStandardRef(equipmentToEdit.standardRef || 'ISO/IEC 17025');
      setNotes(equipmentToEdit.notes || '');
    } else {
      // Auto-generate ID like EQ-LGM-011
      const nextNum = String(existingCount + 1).padStart(3, '0');
      setId(`EQ-LGM-${nextNum}`);
      setName('');
      setModel('');
      setSerialNo('');
      setCategory('Mekanikal & Fizikal');
      setCurrentLocation('Makmal Ujian Utama');
      setPicName('Syamsul Anwar');
      setPicEmail('syamsulanwar@lgm.gov.my');
      setPicPhone('+6012-3849102');
      setNextVerificationDate(addDays(today, 30));
      setNextCalibrationDate(addOneYear(today));
      setStandardRef('ISO/IEC 17025 / ASTM');
      setNotes('');
    }
  }, [equipmentToEdit, existingCount, today]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim() || !name.trim() || !serialNo.trim()) {
      setErrorMsg('Sila lengkapkan semua medan wajib (ID, Nama, dan Nombor Siri)');
      return;
    }

    const payload: Equipment = {
      id: id.trim(),
      name: name.trim(),
      model: model.trim() || 'Standard Model',
      serialNo: serialNo.trim(),
      category,
      currentLocation: currentLocation.trim() || 'Makmal Utama',
      picName: picName.trim() || 'Pegawai Bertugas',
      picEmail: picEmail.trim() || 'qa@lgm.gov.my',
      picPhone: picPhone.trim(),
      nextVerificationDate: nextVerificationDate || addDays(today, 30),
      nextCalibrationDate: nextCalibrationDate || addOneYear(today),
      currentStatus: equipmentToEdit?.currentStatus || 'Active',
      standardRef: standardRef.trim(),
      notes: notes.trim(),
      lastVerificationDate: equipmentToEdit?.lastVerificationDate,
      lastCalibrationDate: equipmentToEdit?.lastCalibrationDate
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              {isEdit ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {isEdit ? 'Kemas Kini Maklumat Peralatan' : 'Pendaftaran Peralatan Baharu'}
              </h3>
              <p className="text-xs text-slate-400">Mod Pentadbir Sistem (Master_Equipment Sheet)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ID Peralatan (PK) *
              </label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="cth: EQ-LGM-011"
                disabled={isEdit}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-hidden disabled:opacity-75"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori Makmal *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="Kebuk Wasap (Fume Hood)">Kebuk Wasap (Fume Hood)</option>
                <option value="Jisim & Penimbangan">Jisim & Penimbangan</option>
                <option value="Volumetrik & Pipet">Volumetrik & Pipet</option>
                <option value="Suhu & Persekitaran">Suhu & Persekitaran</option>
                <option value="Terma & Pemanas">Terma & Pemanas</option>
                <option value="Elektrokimia & pH">Elektrokimia & pH</option>
                <option value="Emparan & Penggoncang">Emparan & Penggoncang</option>
                <option value="Dimensi & Ukuran">Dimensi & Ukuran</option>
                <option value="Volumetrik & Titrasi">Volumetrik & Titrasi</option>
                <option value="Pemberat Standard">Pemberat Standard</option>
                <option value="Peralatan Mandian Air">Peralatan Mandian Air</option>
                <option value="Elektrik & Halaju Udara">Elektrik & Halaju Udara</option>
                <option value="Mekanikal & Fizikal">Mekanikal & Fizikal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Instrumen / Mesin *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="cth: Digital Hardness Tester Shore D"
              className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Model Instrumen
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="cth: ZwickRoell 3117"
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombor Siri (SN) *
              </label>
              <input
                type="text"
                value={serialNo}
                onChange={(e) => setSerialNo(e.target.value)}
                placeholder="cth: SN-ZW-99214"
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lokasi Fizikal Semasa Makmal *
            </label>
            <input
              type="text"
              value={currentLocation}
              onChange={(e) => setCurrentLocation(e.target.value)}
              placeholder="cth: Makmal Fizikal Blok B, Bilik 104"
              className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              required
            />
          </div>

          {/* PIC Section */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
            <h5 className="text-xs font-bold text-slate-700">Maklumat Pegawai PIC (Person In Charge)</h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Nama PIC</label>
                <input
                  type="text"
                  value={picName}
                  onChange={(e) => setPicName(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Emel Rasmi PIC</label>
                <input
                  type="email"
                  value={picEmail}
                  onChange={(e) => setPicEmail(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">No. Telefon</label>
                <input
                  type="tel"
                  value={picPhone}
                  onChange={(e) => setPicPhone(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tarikh Verifikasi Bulanan Seterusnya
              </label>
              <input
                type="date"
                value={nextVerificationDate}
                onChange={(e) => setNextVerificationDate(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tarikh Kalibrasi Vendor Seterusnya
              </label>
              <input
                type="date"
                value={nextCalibrationDate}
                onChange={(e) => setNextCalibrationDate(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Piawaian / Rujukan Standard (ISO / ASTM / JIS)
            </label>
            <input
              type="text"
              value={standardRef}
              onChange={(e) => setStandardRef(e.target.value)}
              placeholder="cth: ASTM D412 / MS ISO 17025"
              className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Penggunaan
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan had operasi, keperluan penyelenggaraan..."
              className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Footer buttons */}
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
              className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isEdit ? 'Kemas Kini Rekod' : 'Simpan Pendaftaran'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
