import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  User, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Truck, 
  XCircle, 
  FileCheck2, 
  Plus, 
  QrCode, 
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Layers,
  ArrowUpDown,
  Check
} from 'lucide-react';
import { Equipment, EquipmentStatus, UserRole } from '../types';
import { formatDateMalay, getDaysRemaining, getRelativeDaysLabel } from '../utils/dateUtils';

interface EquipmentTableProps {
  equipmentList: Equipment[];
  currentRole: UserRole;
  todayStr: string;
  activeStatusFilter: EquipmentStatus | 'ALL';
  onStatusFilterChange: (status: EquipmentStatus | 'ALL') => void;
  onSelectEquipment: (eq: Equipment) => void;
  onOpenVerification: (eq: Equipment) => void;
  onOpenVendorMovement: (eq: Equipment) => void;
  onOpenAddEquipment: () => void;
  onOpenQrSticker: (eq: Equipment) => void;
}

export const EquipmentTable: React.FC<EquipmentTableProps> = ({
  equipmentList,
  currentRole,
  todayStr,
  activeStatusFilter,
  onStatusFilterChange,
  onSelectEquipment,
  onOpenVerification,
  onOpenVendorMovement,
  onOpenAddEquipment,
  onOpenQrSticker
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<'ALL' | 'BATCH 1' | 'BATCH 2' | 'FUME HOOD' | 'OVEN'>('ALL');
  const [selectedPremise, setSelectedPremise] = useState<string>('ALL');
  const [selectedOperator, setSelectedOperator] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [density, setDensity] = useState<'compact' | 'standard'>('standard');
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'calibDate' | 'operator'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Dynamic counts for batch tabs
  const b1Count = useMemo(() => equipmentList.filter(e => e.notes?.includes('BATCH 1')).length, [equipmentList]);
  const b2Count = useMemo(() => equipmentList.filter(e => e.notes?.includes('BATCH 2')).length, [equipmentList]);
  const fhCount = useMemo(() => equipmentList.filter(e => e.category.includes('Kebuk Wasap') || e.id.startsWith('FC-') || e.notes?.includes('FUME HOOD')).length, [equipmentList]);
  const ovenCount = useMemo(() => equipmentList.filter(e => e.id.startsWith('OV') || e.name.toLowerCase().includes('oven')).length, [equipmentList]);

  // Distinct categories, operators, premises
  const { categories, operators, premises } = useMemo(() => {
    const cats = new Set<string>();
    const ops = new Set<string>();
    const prems = new Set<string>();

    equipmentList.forEach(item => {
      if (item.category) cats.add(item.category);
      if (item.picName) ops.add(item.picName);
      if (item.currentLocation.includes('Bangunan 260') || item.currentLocation.includes('B159') || item.currentLocation.includes('B033') || item.currentLocation.includes('B048') || item.currentLocation.includes('B050') || item.currentLocation.includes('B123') || item.currentLocation.includes('B158') || item.currentLocation.includes('B039') || item.currentLocation.includes('B037')) {
        prems.add('Bangunan 260');
      } else if (item.currentLocation.includes('Sg Buloh')) {
        prems.add('Stesen Sg Buloh');
      }
    });

    return {
      categories: Array.from(cats).sort(),
      operators: Array.from(ops).sort(),
      premises: Array.from(prems).sort()
    };
  }, [equipmentList]);

  // Filtered equipment list
  const filteredEquipment = useMemo(() => {
    return equipmentList.filter((item) => {
      // Status filter
      if (activeStatusFilter !== 'ALL') {
        if (activeStatusFilter === 'Overdue') {
          if (item.currentStatus !== 'Overdue' && item.currentStatus !== 'Out of Service') {
            return false;
          }
        } else if (item.currentStatus !== activeStatusFilter) {
          return false;
        }
      }

      // Batch filter
      if (selectedBatch !== 'ALL') {
        const isBatch1 = item.notes?.includes('BATCH 1');
        const isBatch2 = item.notes?.includes('BATCH 2');
        const isFumeHood = item.category.includes('Kebuk Wasap') || item.id.startsWith('FC-') || item.notes?.includes('FUME HOOD');
        const isOven = item.id.startsWith('OV') || item.name.toLowerCase().includes('oven') || item.notes?.includes('LGM/OV');
        if (selectedBatch === 'BATCH 1' && !isBatch1) return false;
        if (selectedBatch === 'BATCH 2' && !isBatch2) return false;
        if (selectedBatch === 'FUME HOOD' && !isFumeHood) return false;
        if (selectedBatch === 'OVEN' && !isOven) return false;
      }

      // Premise filter
      if (selectedPremise !== 'ALL') {
        if (!item.currentLocation.includes(selectedPremise)) return false;
      }

      // Operator filter
      if (selectedOperator !== 'ALL' && item.picName !== selectedOperator) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.id.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          item.model.toLowerCase().includes(q) ||
          item.serialNo.toLowerCase().includes(q) ||
          item.picName.toLowerCase().includes(q) ||
          item.currentLocation.toLowerCase().includes(q) ||
          (item.notes && item.notes.toLowerCase().includes(q))
        );
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'id') {
        comparison = a.id.localeCompare(b.id, undefined, { numeric: true });
      } else if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'calibDate') {
        comparison = a.nextCalibrationDate.localeCompare(b.nextCalibrationDate);
      } else if (sortBy === 'operator') {
        comparison = a.picName.localeCompare(b.picName);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [
    equipmentList, 
    activeStatusFilter, 
    selectedBatch, 
    selectedPremise, 
    selectedOperator, 
    selectedCategory, 
    searchQuery, 
    sortBy, 
    sortOrder
  ]);

  const getStatusBadge = (status: EquipmentStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Aktif (Sah)
          </span>
        );
      case 'Out for Calibration':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
            Di MeTCaL
          </span>
        );
      case 'Due Soon':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            Jadual Semula
          </span>
        );
      case 'Out of Service':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            Hilang / Rosak
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            Luput Had
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
      
      {/* Upper Control Bar: Search & Batch Switcher */}
      <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-50/70 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari No ID (cth: B03, DTL1), nama alatan, rujukan LGM, operator, atau parameter kalibrasi..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Batch Selector & Add Equipment (Admin) */}
          <div className="flex items-center gap-2">
            
            {/* Batch Segments */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-mono font-medium shadow-2xs">
              <button
                onClick={() => setSelectedBatch('ALL')}
                className={`px-2.5 py-1 rounded-md transition ${
                  selectedBatch === 'ALL'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({equipmentList.length})
              </button>
              <button
                onClick={() => setSelectedBatch('BATCH 1')}
                className={`px-2.5 py-1 rounded-md transition ${
                  selectedBatch === 'BATCH 1'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Batch 1 ({b1Count})
              </button>
              <button
                onClick={() => setSelectedBatch('BATCH 2')}
                className={`px-2.5 py-1 rounded-md transition ${
                  selectedBatch === 'BATCH 2'
                    ? 'bg-indigo-900 text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Batch 2 ({b2Count})
              </button>
              <button
                onClick={() => setSelectedBatch('FUME HOOD')}
                className={`px-2.5 py-1 rounded-md transition ${
                  selectedBatch === 'FUME HOOD'
                    ? 'bg-teal-900 text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kebuk Wasap ({fhCount})
              </button>
              <button
                onClick={() => setSelectedBatch('OVEN')}
                className={`px-2.5 py-1 rounded-md transition ${
                  selectedBatch === 'OVEN'
                    ? 'bg-amber-900 text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ketuhar / Oven ({ovenCount})
              </button>
            </div>

            {/* Density toggle */}
            <button
              onClick={() => setDensity(density === 'compact' ? 'standard' : 'compact')}
              title={`Tukar kepadatan: sekarang ${density === 'compact' ? 'Padat' : 'Standard'}`}
              className="px-2.5 py-1.5 text-xs border border-slate-200 bg-white rounded-lg text-slate-600 hover:bg-slate-50 font-mono hidden sm:block"
            >
              {density === 'compact' ? 'Paparan: Padat' : 'Paparan: Selesa'}
            </button>

            {currentRole === 'admin' && (
              <button
                onClick={onOpenAddEquipment}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Daftar Alatan</span>
              </button>
            )}

          </div>

        </div>

        {/* Lower Filters: Premis, Operator, Kategori, Susunan */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          {/* Premis dropdown */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700">
            <span className="text-[10px] text-slate-400 font-mono uppercase">Premis:</span>
            <select
              value={selectedPremise}
              onChange={(e) => setSelectedPremise(e.target.value)}
              className="bg-transparent font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">Semua Premis (260 & Sg Buloh)</option>
              {premises.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Operator dropdown */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700">
            <span className="text-[10px] text-slate-400 font-mono uppercase">Operator:</span>
            <select
              value={selectedOperator}
              onChange={(e) => setSelectedOperator(e.target.value)}
              className="bg-transparent font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">Semua Operator ({operators.length})</option>
              {operators.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>

          {/* Kategori dropdown */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700">
            <span className="text-[10px] text-slate-400 font-mono uppercase">Kategori:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent font-medium focus:outline-hidden cursor-pointer max-w-[160px] truncate"
            >
              <option value="ALL">Semua Kategori ({categories.length})</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 ml-auto">
            <span className="text-[10px] text-slate-400 font-mono uppercase">Susun:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="id">No. ID Alatan</option>
              <option value="name">Jenis & Model</option>
              <option value="calibDate">Tarikh Kalibrasi</option>
              <option value="operator">Nama Operator</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="text-slate-700 hover:text-black font-mono font-bold px-1"
              title="Tukar tertib susunan"
            >
              {sortOrder === 'asc' ? '▲' : '▼'}
            </button>
          </div>

        </div>

      </div>

      {/* Main Metrology Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-sans">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 text-[11px] font-mono uppercase tracking-wider">
              <th className="py-2.5 px-3 w-12 text-center">Batch</th>
              <th className="py-2.5 px-3 w-20">NO ID</th>
              <th className="py-2.5 px-3">Jenis Peralatan & Model</th>
              <th className="py-2.5 px-3">No. Rujukan LGM / Siri</th>
              <th className="py-2.5 px-3">Lokasi & Premis</th>
              <th className="py-2.5 px-3">Operator</th>
              <th className="py-2.5 px-3 min-w-[200px]">Titik Kalibrasi (Cal Point)</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredEquipment.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500">
                  <p className="font-semibold text-slate-700 text-sm">Tiada instrumen yang sepadan dengan penapis.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedBatch('ALL');
                      setSelectedPremise('ALL');
                      setSelectedOperator('ALL');
                      setSelectedCategory('ALL');
                      onStatusFilterChange('ALL');
                    }}
                    className="mt-2 text-xs text-blue-700 hover:underline font-semibold"
                  >
                    Tetapkan semula semua penapis
                  </button>
                </td>
              </tr>
            ) : (
              filteredEquipment.map((eq, idx) => {
                const isBatch2 = eq.notes?.includes('BATCH 2');
                const batchBadge = isBatch2 ? 'B2' : 'B1';
                const paddingY = density === 'compact' ? 'py-1.5' : 'py-2.5';

                return (
                  <tr 
                    key={eq.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      eq.currentStatus === 'Out for Calibration' ? 'bg-indigo-50/20' :
                      eq.currentStatus === 'Out of Service' ? 'bg-rose-50/20' : ''
                    }`}
                  >
                    {/* Batch Tag */}
                    <td className={`${paddingY} px-3 text-center align-middle`}>
                      <span className={`inline-block font-mono text-[10px] font-bold px-1 rounded ${
                        isBatch2 ? 'bg-indigo-100 text-indigo-900' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {batchBadge}
                      </span>
                    </td>

                    {/* NO ID */}
                    <td className={`${paddingY} px-3 align-middle font-mono font-bold text-slate-900`}>
                      <span className="text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60 inline-block">
                        {eq.id}
                      </span>
                    </td>

                    {/* Name & Model */}
                    <td className={`${paddingY} px-3 align-middle`}>
                      <button
                        onClick={() => onSelectEquipment(eq)}
                        className="font-bold text-slate-900 hover:text-blue-700 text-left transition"
                      >
                        {eq.name}
                      </button>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {eq.model}
                      </div>
                    </td>

                    {/* Ref No LGM */}
                    <td className={`${paddingY} px-3 align-middle font-mono text-[11px] text-slate-700`}>
                      {eq.serialNo !== '-' ? eq.serialNo : <span className="text-slate-300">-</span>}
                    </td>

                    {/* Location */}
                    <td className={`${paddingY} px-3 align-middle text-[11px] text-slate-600`}>
                      <div className="line-clamp-1">{eq.currentLocation}</div>
                    </td>

                    {/* Operator */}
                    <td className={`${paddingY} px-3 align-middle text-[11px]`}>
                      <span className="font-semibold text-slate-800">{eq.picName}</span>
                    </td>

                    {/* Cal Point & Notes */}
                    <td className={`${paddingY} px-3 align-middle text-[11px] text-slate-600 font-mono`}>
                      {eq.notes ? (
                        <div className="line-clamp-2 max-w-sm" title={eq.notes}>
                          {eq.notes.split('Titik Kalibrasi: ')[1] || eq.notes}
                        </div>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className={`${paddingY} px-3 align-middle text-center`}>
                      {getStatusBadge(eq.currentStatus)}
                    </td>

                    {/* Actions */}
                    <td className={`${paddingY} px-3 align-middle text-right`}>
                      <div className="inline-flex items-center gap-1">
                        
                        <button
                          onClick={() => onSelectEquipment(eq)}
                          className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded transition"
                          title="Perincian Lengkap"
                        >
                          Perincian
                        </button>

                        <button
                          onClick={() => onOpenVerification(eq)}
                          className="p-1 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded border border-slate-200 transition"
                          title="Borang Verifikasi Bulanan (FR-002)"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onOpenVendorMovement(eq)}
                          className={`p-1 rounded border transition ${
                            eq.currentStatus === 'Out for Calibration'
                              ? 'text-indigo-800 bg-indigo-50 border-indigo-300 hover:bg-indigo-100'
                              : 'text-slate-600 hover:bg-slate-100 border-slate-200'
                          }`}
                          title="Logistik Vendor MeTCaL (Hantar / Terima)"
                        >
                          <Truck className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onOpenQrSticker(eq)}
                          className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition"
                          title="Pelekat Kod QR Fizikal Makmal"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 font-mono gap-2">
        <div>
          <span>Memaparkan <strong className="text-slate-900">{filteredEquipment.length}</strong> daripada <strong className="text-slate-900">{equipmentList.length}</strong> instrumen makmal LGM (UPKS MeTCaL).</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span>Akreditasi: SAMM / ISO 17025</span>
          <span>•</span>
          <span>Premis 260 & Sg Buloh</span>
        </div>
      </div>

    </div>
  );
};
