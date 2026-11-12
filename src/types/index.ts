export type EquipmentStatus = 
  | 'Active' 
  | 'Due Soon' 
  | 'Overdue' 
  | 'Out for Calibration' 
  | 'Out of Service';

export type UserRole = 'guest' | 'pic' | 'admin';

export interface Equipment {
  id: string; // e.g. "EQ-LGM-001"
  name: string;
  model: string;
  serialNo: string;
  category: string;
  currentLocation: string;
  picName: string;
  picEmail: string;
  picPhone: string;
  nextVerificationDate: string; // YYYY-MM-DD
  nextCalibrationDate: string;  // YYYY-MM-DD
  lastVerificationDate?: string;
  lastCalibrationDate?: string;
  currentStatus: EquipmentStatus;
  manualOverrideStatus?: EquipmentStatus;
  notes?: string;
  standardRef?: string;
  photoUrl?: string;
  createdDate?: string;
}

export interface VerificationLog {
  id: string;
  equipmentId: string;
  equipmentName?: string;
  verificationDate: string;
  conductedBy: string;
  status: 'Pass' | 'Fail';
  readingValue: string;
  remarks: string;
  proofUrl?: string;
  proofName?: string;
  createdAt: string;
}

export interface CalibrationMovement {
  id: string;
  equipmentId: string;
  equipmentName?: string;
  outwardDate: string;
  vendorName: string;
  doReference: string;
  expectedReturn: string;
  returnDate?: string;
  result?: 'Pass' | 'Fail' | 'Out of Tolerance';
  certNumber?: string;
  certUrl?: string;
  certName?: string;
  remarks?: string;
  status: 'In Progress' | 'Completed';
  createdAt: string;
}

export interface GoogleSheetsConfig {
  webAppUrl: string;
  autoSync: boolean;
  lastSyncTime?: string;
  status: 'connected' | 'disconnected' | 'error';
  pendingQueueCount: number;
}

export interface SyncPayload {
  action: 'addEquipment' | 'updateEquipment' | 'logVerification' | 'vendorOutward' | 'vendorInward';
  timestamp: string;
  data: any;
}
