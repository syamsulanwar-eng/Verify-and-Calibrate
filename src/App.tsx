import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Bell, 
  Database, 
  AlertTriangle, 
  Plus, 
  FileCheck2, 
  Truck, 
  CheckCircle2, 
  Info,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { 
  Equipment, 
  VerificationLog, 
  CalibrationMovement, 
  UserRole, 
  EquipmentStatus, 
  GoogleSheetsConfig 
} from './types';
import { StorageService } from './services/storageService';
import { getTodayString, calculateEquipmentStatus, getDaysRemaining } from './utils/dateUtils';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { EquipmentTable } from './components/EquipmentTable';
import { EquipmentDetailModal } from './components/EquipmentDetailModal';
import { VerificationModal } from './components/VerificationModal';
import { VendorMovementModal } from './components/VendorMovementModal';
import { AddEditEquipmentModal } from './components/AddEditEquipmentModal';
import { AlertDispatcherModal } from './components/AlertDispatcherModal';
import { GoogleSheetsSettingsModal } from './components/GoogleSheetsSettingsModal';
import { AuthPinModal } from './components/AuthPinModal';
import { QrStickerModal } from './components/QrStickerModal';

export default function App() {
  const [todayStr] = useState<string>(() => {
    // Standard system date matching PRD v1.0 context (Nov 2026)
    return getTodayString();
  });

  // Main application data state
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(() => StorageService.getEquipment());
  const [verificationLogs, setVerificationLogs] = useState<VerificationLog[]>(() => StorageService.getVerificationLogs());
  const [calibrationMovements, setCalibrationMovements] = useState<CalibrationMovement[]>(() => StorageService.getCalibrationMovements());
  const [sheetsConfig, setSheetsConfig] = useState<GoogleSheetsConfig>(() => StorageService.getSheetsConfig());

  // Role and security
  const [currentRole, setCurrentRole] = useState<UserRole>('guest'); // Open View by default
  const [pendingActionRole, setPendingActionRole] = useState<UserRole | null>(null);
  const [isAuthPinOpen, setIsAuthPinOpen] = useState<boolean>(false);

  // Filters & Selected Modals
  const [statusFilter, setStatusFilter] = useState<EquipmentStatus | 'ALL'>('ALL');
  const [selectedEquipmentForDetail, setSelectedEquipmentForDetail] = useState<Equipment | null>(null);
  const [selectedEquipmentForVerification, setSelectedEquipmentForVerification] = useState<Equipment | null>(null);
  const [selectedEquipmentForMovement, setSelectedEquipmentForMovement] = useState<Equipment | null>(null);
  const [selectedEquipmentForEdit, setSelectedEquipmentForEdit] = useState<Equipment | null>(null);
  const [selectedEquipmentForQr, setSelectedEquipmentForQr] = useState<Equipment | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState<boolean>(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Keep LocalStorage in sync
  useEffect(() => {
    StorageService.saveEquipment(equipmentList);
  }, [equipmentList]);

  useEffect(() => {
    StorageService.saveVerificationLogs(verificationLogs);
  }, [verificationLogs]);

  useEffect(() => {
    StorageService.saveCalibrationMovements(calibrationMovements);
  }, [calibrationMovements]);

  // Urgent equipment (Overdue or Due Soon within 30 days)
  const urgentEquipment = useMemo(() => {
    return equipmentList.filter(eq => {
      if (eq.currentStatus === 'Overdue' || eq.currentStatus === 'Out of Service' || eq.currentStatus === 'Due Soon') {
        return true;
      }
      const dCalib = getDaysRemaining(eq.nextCalibrationDate, todayStr);
      const dVerif = getDaysRemaining(eq.nextVerificationDate, todayStr);
      return dCalib <= 30 || dVerif <= 30;
    });
  }, [equipmentList, todayStr]);

  // Overall Statistics count
  const stats = useMemo(() => {
    let active = 0;
    let dueSoon = 0;
    let outVendor = 0;
    let overdue = 0;
    let outOfService = 0;

    equipmentList.forEach(item => {
      if (item.currentStatus === 'Active') active++;
      else if (item.currentStatus === 'Due Soon') dueSoon++;
      else if (item.currentStatus === 'Out for Calibration') outVendor++;
      else if (item.currentStatus === 'Overdue') overdue++;
      else if (item.currentStatus === 'Out of Service') outOfService++;
    });

    return {
      total: equipmentList.length,
      active,
      dueSoon,
      outVendor,
      overdue,
      outOfService
    };
  }, [equipmentList]);

  // Auth gatekeeper helper
  const requireRole = (role: 'pic' | 'admin', callback: () => void) => {
    if (currentRole === 'admin') {
      callback();
      return;
    }
    if (role === 'pic' && currentRole === 'pic') {
      callback();
      return;
    }

    // Otherwise prompt PIN
    setPendingActionRole(role);
    setIsAuthPinOpen(true);
  };

  const handleRoleSelect = (role: UserRole) => {
    if (role === 'guest') {
      setCurrentRole('guest');
      showToast('Beralih ke mod Akses Awam (Hanya Baca).', 'info');
    } else {
      setPendingActionRole(role);
      setIsAuthPinOpen(true);
    }
  };

  const handleAuthPinSuccess = (authenticatedRole: UserRole) => {
    setCurrentRole(authenticatedRole);
    showToast(`Berjaya log masuk sebagai ${authenticatedRole === 'admin' ? 'Pentadbir Sistem' : 'Pegawai PIC / QA'}.`, 'success');
  };

  // Actions: FR-002 Monthly Verification Logging
  const handleLogVerification = (
    logData: Omit<VerificationLog, 'id' | 'createdAt'>,
    newVerificationDate: string,
    updatedStatus: 'Active' | 'Out of Service'
  ) => {
    const newLogId = `VLOG-${new Date().getFullYear()}-${String(verificationLogs.length + 1).padStart(3, '0')}`;
    const newLog: VerificationLog = {
      ...logData,
      id: newLogId,
      createdAt: new Date().toISOString()
    };

    // Update log history
    setVerificationLogs(prev => [newLog, ...prev]);

    // Update equipment master
    setEquipmentList(prev => prev.map(eq => {
      if (eq.id === logData.equipmentId) {
        return {
          ...eq,
          lastVerificationDate: logData.verificationDate,
          nextVerificationDate: newVerificationDate,
          currentStatus: updatedStatus
        };
      }
      return eq;
    }));

    // Trigger Google Sheets background sync if configured
    StorageService.pushToGoogleSheets({
      action: 'logVerification',
      timestamp: new Date().toISOString(),
      data: {
        ...newLog,
        nextVerificationDate: newVerificationDate
      }
    }).then(res => {
      setSheetsConfig(StorageService.getSheetsConfig());
    });

    showToast(
      updatedStatus === 'Active'
        ? `Verifikasi bulanan berjaya direkodkan. Tarikh seterusnya: ${newVerificationDate} (+30 hari).`
        : `Verifikasi GAGAL. Status alatan bertukar ke Out of Service untuk pemeriksaan lanjut.`,
      updatedStatus === 'Active' ? 'success' : 'error'
    );
  };

  // Actions: FR-003 Vendor Outward
  const handleVendorOutward = (movementData: Omit<CalibrationMovement, 'id' | 'createdAt' | 'status'>) => {
    const newMovId = `MOV-${new Date().getFullYear()}-${String(calibrationMovements.length + 1).padStart(3, '0')}`;
    const newMovement: CalibrationMovement = {
      ...movementData,
      id: newMovId,
      status: 'In Progress',
      createdAt: new Date().toISOString()
    };

    setCalibrationMovements(prev => [newMovement, ...prev]);

    setEquipmentList(prev => prev.map(eq => {
      if (eq.id === movementData.equipmentId) {
        return {
          ...eq,
          currentStatus: 'Out for Calibration'
        };
      }
      return eq;
    }));

    StorageService.pushToGoogleSheets({
      action: 'vendorOutward',
      timestamp: new Date().toISOString(),
      data: newMovement
    }).then(() => {
      setSheetsConfig(StorageService.getSheetsConfig());
    });

    showToast(`Peralatan ${movementData.equipmentId} telah dihantar ke vendor (${movementData.vendorName}). Status: Out for Calibration.`, 'info');
  };

  // Actions: FR-003 Vendor Inward Return
  const handleVendorInward = (
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
  ) => {
    // Update movement record
    setCalibrationMovements(prev => prev.map(m => {
      if (m.equipmentId === equipmentId && m.status === 'In Progress') {
        return {
          ...m,
          returnDate: returnData.returnDate,
          result: returnData.result,
          certNumber: returnData.certNumber,
          certUrl: returnData.certUrl,
          certName: returnData.certName,
          remarks: returnData.remarks,
          status: 'Completed'
        };
      }
      return m;
    }));

    const finalStatus: EquipmentStatus = returnData.result === 'Pass' ? 'Active' : 'Out of Service';

    setEquipmentList(prev => prev.map(eq => {
      if (eq.id === equipmentId) {
        return {
          ...eq,
          lastCalibrationDate: returnData.returnDate,
          nextCalibrationDate: returnData.nextCalibrationDate,
          currentStatus: finalStatus
        };
      }
      return eq;
    }));

    StorageService.pushToGoogleSheets({
      action: 'vendorInward',
      timestamp: new Date().toISOString(),
      data: {
        equipmentId,
        ...returnData
      }
    }).then(() => {
      setSheetsConfig(StorageService.getSheetsConfig());
    });

    showToast(`Peralatan ${equipmentId} berjaya diterima semula dari vendor. Sijil No: ${returnData.certNumber}. Status: ${finalStatus}.`, 'success');
  };

  // Actions: Add or Update Equipment (Admin)
  const handleSaveEquipment = (eqData: Equipment) => {
    const exists = equipmentList.some(e => e.id === eqData.id);
    if (exists) {
      setEquipmentList(prev => prev.map(e => e.id === eqData.id ? eqData : e));
      StorageService.pushToGoogleSheets({
        action: 'updateEquipment',
        timestamp: new Date().toISOString(),
        data: eqData
      });
      showToast(`Maklumat instrumen ${eqData.id} berjaya dikemas kini.`, 'success');
    } else {
      setEquipmentList(prev => [eqData, ...prev]);
      StorageService.pushToGoogleSheets({
        action: 'addEquipment',
        timestamp: new Date().toISOString(),
        data: eqData
      });
      showToast(`Peralatan baharu ${eqData.id} berjaya didaftarkan ke inventori induk.`, 'success');
    }
  };

  // Live Sync Now with Google Sheets
  const handleLiveSync = async () => {
    setIsSyncing(true);
    const result = await StorageService.fetchFromGoogleSheets();
    setIsSyncing(false);
    if (result.success && result.data) {
      if (result.data.equipment?.length) setEquipmentList(result.data.equipment);
      if (result.data.logs?.length) setVerificationLogs(result.data.logs);
      if (result.data.movements?.length) setCalibrationMovements(result.data.movements);
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'error');
    }
    setSheetsConfig(StorageService.getSheetsConfig());
  };

  const handleResetData = () => {
    StorageService.resetToDefault();
    setEquipmentList(StorageService.getEquipment());
    setVerificationLogs(StorageService.getVerificationLogs());
    setCalibrationMovements(StorageService.getCalibrationMovements());
    setSheetsConfig(StorageService.getSheetsConfig());
    showToast('Data sistem telah ditetapkan semula kepada data sampel makmal.', 'info');
  };

  const batch1Count = useMemo(() => equipmentList.filter(e => e.notes?.includes('BATCH 1')).length, [equipmentList]);
  const batch2Count = useMemo(() => equipmentList.filter(e => e.notes?.includes('BATCH 2')).length, [equipmentList]);
  const fumeHoodCount = useMemo(() => equipmentList.filter(e => e.category.includes('Kebuk Wasap') || e.id.startsWith('FC-') || e.notes?.includes('FUME HOOD')).length, [equipmentList]);
  const ovenCount = useMemo(() => equipmentList.filter(e => e.id.startsWith('OV') || e.name.toLowerCase().includes('oven')).length, [equipmentList]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-slate-200 selection:text-slate-900">
      
      {/* Navigation Header */}
      <Header
        currentRole={currentRole}
        onSelectRole={handleRoleSelect}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
        onOpenAdminSettings={() => setIsSheetsModalOpen(true)}
        sheetsConfig={sheetsConfig}
        alertCount={urgentEquipment.length}
        todayStr={todayStr}
        isSyncing={isSyncing}
        onQuickSync={handleLiveSync}
        totalCount={equipmentList.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 space-y-4">
        
        {/* Clinical Alert Warning Banner */}
        {urgentEquipment.length > 0 && (
          <div className="bg-amber-50 border border-amber-200/80 rounded-lg p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse shrink-0"></span>
              <div>
                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                  Pengawasan Kualiti: {urgentEquipment.length} instrumen berada dalam pemantauan tarikh luput / luar makmal
                </span>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Termasuk {stats.outVendor} instrumen Batch 2 yang sedang di vendor MeTCaL dan alatan bermasalah/tamat tempoh (MP3 & OV11).
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAlertsOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 rounded border border-slate-300 transition shrink-0 self-end sm:self-center"
            >
              Buka Notifikasi PIC & WhatsApp &rarr;
            </button>
          </div>
        )}

        {/* Section 1: KPI Statistics Summary Cards */}
        <StatsCards
          total={stats.total}
          activeCount={stats.active}
          dueSoonCount={stats.dueSoon}
          outForCalibCount={stats.outVendor}
          overdueCount={stats.overdue}
          outOfServiceCount={stats.outOfService}
          activeFilter={statusFilter}
          onFilterSelect={setStatusFilter}
          batch1Count={batch1Count}
          batch2Count={batch2Count}
          fumeHoodCount={fumeHoodCount}
          ovenCount={ovenCount}
        />

        {/* Section 2: Main Equipment Inventory Table */}
        <EquipmentTable
          equipmentList={equipmentList}
          currentRole={currentRole}
          todayStr={todayStr}
          activeStatusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onSelectEquipment={(eq) => setSelectedEquipmentForDetail(eq)}
          onOpenVerification={(eq) => {
            requireRole('pic', () => setSelectedEquipmentForVerification(eq));
          }}
          onOpenVendorMovement={(eq) => {
            requireRole('pic', () => setSelectedEquipmentForMovement(eq));
          }}
          onOpenAddEquipment={() => {
            requireRole('admin', () => setIsAddModalOpen(true));
          }}
          onOpenQrSticker={(eq) => setSelectedEquipmentForQr(eq)}
        />

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-700">CalibraTrack v1.0</span>
            <span>—</span>
            <span>Sistem Pengurusan Kalibrasi & Verifikasi Makmal Berpusat</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsSheetsModalOpen(true)}
              className="text-slate-600 hover:text-blue-600 font-medium underline"
            >
              Konfigurasi Google Sheets
            </button>
            <span>•</span>
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-rose-600"
            >
              Reset Sampel Demo
            </button>
          </div>
        </div>
      </footer>

      {/* Toast Notification Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200 no-print">
          <div className={`px-4 py-3 rounded-xl shadow-xl border text-xs font-semibold flex items-center gap-2.5 ${
            toastMessage.type === 'success' ? 'bg-emerald-900 text-white border-emerald-700' :
            toastMessage.type === 'error' ? 'bg-rose-900 text-white border-rose-700' :
            'bg-slate-900 text-white border-slate-700'
          }`}>
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : toastMessage.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Modal: Screen 2 - Equipment Detail Modal */}
      <EquipmentDetailModal
        equipment={selectedEquipmentForDetail}
        logs={verificationLogs}
        movements={calibrationMovements}
        isOpen={Boolean(selectedEquipmentForDetail)}
        onClose={() => setSelectedEquipmentForDetail(null)}
        onOpenVerification={(eq) => {
          setSelectedEquipmentForDetail(null);
          requireRole('pic', () => setSelectedEquipmentForVerification(eq));
        }}
        onOpenVendorMovement={(eq) => {
          setSelectedEquipmentForDetail(null);
          requireRole('pic', () => setSelectedEquipmentForMovement(eq));
        }}
        onOpenEdit={(eq) => {
          setSelectedEquipmentForDetail(null);
          requireRole('admin', () => setSelectedEquipmentForEdit(eq));
        }}
        onOpenQrSticker={(eq) => {
          setSelectedEquipmentForDetail(null);
          setSelectedEquipmentForQr(eq);
        }}
        currentRole={currentRole}
        todayStr={todayStr}
      />

      {/* Modal: Screen 3 - FR-002 Monthly Verification */}
      <VerificationModal
        equipment={selectedEquipmentForVerification}
        isOpen={Boolean(selectedEquipmentForVerification)}
        onClose={() => setSelectedEquipmentForVerification(null)}
        onSubmit={handleLogVerification}
      />

      {/* Modal: Screen 4 - FR-003 Vendor Movement */}
      <VendorMovementModal
        equipment={selectedEquipmentForMovement}
        isOpen={Boolean(selectedEquipmentForMovement)}
        onClose={() => setSelectedEquipmentForMovement(null)}
        onOutwardSubmit={handleVendorOutward}
        onInwardSubmit={handleVendorInward}
      />

      {/* Modal: Admin Add / Edit Equipment */}
      <AddEditEquipmentModal
        isOpen={isAddModalOpen || Boolean(selectedEquipmentForEdit)}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedEquipmentForEdit(null);
        }}
        equipmentToEdit={selectedEquipmentForEdit}
        onSave={handleSaveEquipment}
        existingCount={equipmentList.length}
      />

      {/* Modal: FR-004 Alert Dispatcher */}
      <AlertDispatcherModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        urgentEquipment={urgentEquipment}
        todayStr={todayStr}
      />

      {/* Modal: Google Sheets API & Backup Settings */}
      <GoogleSheetsSettingsModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        config={sheetsConfig}
        onSaveConfig={(cfg) => {
          setSheetsConfig(cfg);
          StorageService.saveSheetsConfig(cfg);
        }}
        onSyncNow={handleLiveSync}
        onResetData={handleResetData}
        equipment={equipmentList}
        logs={verificationLogs}
        movements={calibrationMovements}
      />

      {/* Modal: Auth PIN verification */}
      <AuthPinModal
        isOpen={isAuthPinOpen}
        onClose={() => {
          setIsAuthPinOpen(false);
          setPendingActionRole(null);
        }}
        targetRole={pendingActionRole || 'pic'}
        onSuccess={handleAuthPinSuccess}
      />

      {/* Modal: Physical QR Calibration Label */}
      <QrStickerModal
        equipment={selectedEquipmentForQr}
        isOpen={Boolean(selectedEquipmentForQr)}
        onClose={() => setSelectedEquipmentForQr(null)}
      />

    </div>
  );
}
