import React from 'react';
import { 
  X, 
  Printer, 
  QrCode, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  User, 
  ExternalLink 
} from 'lucide-react';
import { Equipment } from '../types';
import { formatDateMalay } from '../utils/dateUtils';

interface QrStickerModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QrStickerModal: React.FC<QrStickerModalProps> = ({
  equipment,
  isOpen,
  onClose
}) => {
  if (!isOpen || !equipment) return null;

  const handlePrint = () => {
    window.print();
  };

  // Generate SVG QR Matrix Pattern based on equipment ID
  const generateQrMatrix = (id: string) => {
    // 21x21 stylized QR matrix
    const size = 21;
    const cells: boolean[][] = Array(size).fill(false).map(() => Array(size).fill(false));

    // Corner finder patterns (7x7)
    const drawFinder = (startX: number, startY: number) => {
      for (let x = 0; x < 7; x++) {
        for (let y = 0; y < 7; y++) {
          if (
            x === 0 || x === 6 || y === 0 || y === 6 ||
            (x >= 2 && x <= 4 && y >= 2 && y <= 4)
          ) {
            cells[startY + y][startX + x] = true;
          }
        }
      }
    };

    drawFinder(0, 0); // Top-left
    drawFinder(size - 7, 0); // Top-right
    drawFinder(0, size - 7); // Bottom-left

    // Deterministic pseudo-random inner fill based on equipment ID hash
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0;
    }

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // Skip finder zones
        const inTL = x < 8 && y < 8;
        const inTR = x >= size - 8 && y < 8;
        const inBL = x < 8 && y >= size - 8;
        if (!inTL && !inTR && !inBL) {
          const bit = Math.abs(Math.sin((x * 13 + y * 17 + hash) * 1.5)) > 0.52;
          cells[y][x] = bit;
        }
      }
    }

    return cells;
  };

  const qrMatrix = generateQrMatrix(equipment.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm">Pelekat Kod QR Kalibrasi Fizikal</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Sticker Preview Box */}
        <div className="p-6 bg-slate-100 flex justify-center">
          
          {/* THE PHYSICAL LABEL BADGE */}
          <div 
            id="printable-calibration-label" 
            className="w-full max-w-[340px] bg-white border-4 border-slate-900 rounded-xl p-4 shadow-lg text-slate-900 font-sans"
          >
            {/* Header Lab Brand */}
            <div className="text-center border-b-2 border-slate-900 pb-2">
              <div className="text-[10px] uppercase tracking-widest font-extrabold text-slate-500">
                LEMBAGA GETAH MALAYSIA (LGM)
              </div>
              <div className="text-sm font-black text-slate-900 tracking-tight">
                CALIBRATION STATUS LABEL
              </div>
              <div className="text-[9px] text-slate-500">ISO/IEC 17025 ACCREDITED LAB</div>
            </div>

            {/* Middle: Equipment info & QR */}
            <div className="py-3 flex items-center gap-3">
              {/* QR Code SVG */}
              <div className="p-1.5 bg-white border-2 border-slate-900 rounded-lg shrink-0">
                <svg viewBox="0 0 21 21" className="w-24 h-24">
                  {qrMatrix.map((row, y) =>
                    row.map((active, x) =>
                      active ? (
                        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#0f172a" />
                      ) : null
                    )
                  )}
                </svg>
              </div>

              {/* Data specs */}
              <div className="text-[11px] leading-tight space-y-1 overflow-hidden">
                <div>
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">ID Peralatan</span>
                  <strong className="font-mono text-sm text-blue-900 block truncate">{equipment.id}</strong>
                </div>

                <div>
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">Nama Alatan</span>
                  <div className="font-bold text-slate-900 line-clamp-2">{equipment.name}</div>
                </div>

                <div>
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">No. Siri (SN)</span>
                  <div className="font-mono text-[10px] text-slate-600 truncate">{equipment.serialNo}</div>
                </div>
              </div>
            </div>

            {/* Key Dates block */}
            <div className="border-t-2 border-slate-900 pt-2 grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                <span className="text-slate-500 block text-[9px] font-bold">VERIFIKASI BULANAN:</span>
                <strong className="font-mono text-slate-900 block">{formatDateMalay(equipment.nextVerificationDate)}</strong>
              </div>

              <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                <span className="text-slate-500 block text-[9px] font-bold">KALIBRASI VENDOR:</span>
                <strong className="font-mono text-blue-900 block">{formatDateMalay(equipment.nextCalibrationDate)}</strong>
              </div>
            </div>

            {/* Bottom status stamp */}
            <div className="mt-2 pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-[10px]">
              <div>
                <span className="text-slate-400">Pegawai PIC: </span>
                <strong className="text-slate-800">{equipment.picName.split(' ')[0]}</strong>
              </div>
              <div className={`px-2 py-0.5 rounded font-black text-[10px] ${
                equipment.currentStatus === 'Active' ? 'bg-emerald-600 text-white' :
                equipment.currentStatus === 'Due Soon' ? 'bg-amber-500 text-white' :
                'bg-rose-600 text-white'
              }`}>
                {equipment.currentStatus.toUpperCase()}
              </div>
            </div>

          </div>

        </div>

        {/* Action button */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between no-print">
          <p className="text-[11px] text-slate-500">
            Cetak pada label pelekat fizikal (saiz standard 70x50mm).
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Pelekat</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
