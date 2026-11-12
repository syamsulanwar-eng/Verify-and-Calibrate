import React from 'react';
import { EquipmentStatus } from '../types';

interface StatsCardsProps {
  total: number;
  activeCount: number;
  dueSoonCount: number;
  outForCalibCount: number;
  overdueCount: number;
  outOfServiceCount: number;
  activeFilter: EquipmentStatus | 'ALL';
  onFilterSelect: (filter: EquipmentStatus | 'ALL') => void;
  batch1Count: number;
  batch2Count: number;
  fumeHoodCount?: number;
  ovenCount?: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  total,
  activeCount,
  dueSoonCount,
  outForCalibCount,
  overdueCount,
  outOfServiceCount,
  activeFilter,
  onFilterSelect,
  batch1Count,
  batch2Count,
  fumeHoodCount = 0,
  ovenCount = 0
}) => {
  const attentionCount = overdueCount + outOfServiceCount;

  const metrics = [
    {
      id: 'ALL',
      label: 'Semua Inventori',
      count: total,
      meta: `B1 (${batch1Count}) • B2 (${batch2Count}) • Wasap (${fumeHoodCount}) • Oven (${ovenCount})`,
      activeClass: 'bg-slate-900 text-white border-slate-900',
      inactiveClass: 'bg-white text-slate-800 hover:bg-slate-50 border-slate-200'
    },
    {
      id: 'Active' as EquipmentStatus,
      label: 'Aktif & Sah Digunakan',
      count: activeCount,
      meta: 'Disahkan MeTCaL / Dalam Had',
      activeClass: 'bg-emerald-800 text-white border-emerald-800',
      inactiveClass: 'bg-white text-slate-800 hover:bg-slate-50 border-slate-200'
    },
    {
      id: 'Out for Calibration' as EquipmentStatus,
      label: 'Sedang di MeTCaL (Batch 2)',
      count: outForCalibCount,
      meta: 'Proses Penentukuran Luaran',
      activeClass: 'bg-indigo-900 text-white border-indigo-900',
      inactiveClass: 'bg-white text-slate-800 hover:bg-slate-50 border-slate-200'
    },
    {
      id: 'Due Soon' as EquipmentStatus,
      label: 'Perlu Kalibrasi (≤ 30 Hari)',
      count: dueSoonCount,
      meta: 'Tindakan Jadual Baharu',
      activeClass: 'bg-amber-700 text-white border-amber-700',
      inactiveClass: 'bg-white text-slate-800 hover:bg-slate-50 border-slate-200'
    },
    {
      id: 'Overdue' as EquipmentStatus,
      label: 'Hilang / Out of Service',
      count: attentionCount,
      meta: 'Perlu Pelupusan / Tindakan QA',
      activeClass: 'bg-rose-900 text-white border-rose-900',
      inactiveClass: 'bg-white text-slate-800 hover:bg-slate-50 border-slate-200'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
      {metrics.map((m) => {
        const isSelected = activeFilter === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onFilterSelect(m.id as any)}
            className={`p-3 rounded-lg border text-left transition duration-100 flex flex-col justify-between ${
              isSelected ? m.activeClass : m.inactiveClass
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className={`text-[11px] font-semibold tracking-tight ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                {m.label}
              </span>
              {isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              )}
            </div>

            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="font-mono font-bold text-2xl tracking-tight">
                {m.count}
              </span>
              <span className={`text-[10px] font-mono ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                unit
              </span>
            </div>

            <div className={`mt-1.5 pt-1.5 border-t text-[10px] truncate ${
              isSelected ? 'border-white/20 text-white/70' : 'border-slate-100 text-slate-500'
            }`}>
              {m.meta}
            </div>
          </button>
        );
      })}
    </div>
  );
};
