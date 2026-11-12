import { Equipment, VerificationLog, CalibrationMovement, GoogleSheetsConfig, SyncPayload } from '../types';
import { INITIAL_EQUIPMENT, INITIAL_VERIFICATION_LOGS, INITIAL_CALIBRATION_MOVEMENTS } from '../data/initialData';
import { calculateEquipmentStatus } from '../utils/dateUtils';

const STORAGE_KEYS = {
  EQUIPMENT: 'calibratrack_upks_2026_metcal_v5',
  VERIFICATION_LOGS: 'calibratrack_upks_verif_logs_v5',
  CALIBRATION_MOVEMENTS: 'calibratrack_upks_movements_v5',
  SHEETS_CONFIG: 'calibratrack_sheets_config_v5',
  OFFLINE_QUEUE: 'calibratrack_offline_queue_v5',
  USER_ROLE: 'calibratrack_user_role_v5',
  PIN_PIC: 'calibratrack_pin_pic_v5',
  PIN_ADMIN: 'calibratrack_pin_admin_v5'
};

export const DEFAULT_SHEETS_CONFIG: GoogleSheetsConfig = {
  webAppUrl: '',
  autoSync: false,
  status: 'disconnected',
  pendingQueueCount: 0
};

export class StorageService {
  /**
   * Load equipment from local storage or initialize with UPKS MeTCaL + Fume Hood 2026 real data
   */
  static getEquipment(): Equipment[] {
    try {
      // Clear legacy storage versions if present
      localStorage.removeItem('calibratrack_equipment_v1');
      localStorage.removeItem('calibratrack_verification_logs_v1');
      localStorage.removeItem('calibratrack_calibration_movements_v1');

      const data = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
      if (!data) {
        const initialized = INITIAL_EQUIPMENT.map(eq => ({
          ...eq,
          currentStatus: calculateEquipmentStatus(eq)
        }));
        this.saveEquipment(initialized);
        return initialized;
      }
      let parsed: Equipment[] = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length <= 15) {
        const initialized = INITIAL_EQUIPMENT.map(eq => ({
          ...eq,
          currentStatus: calculateEquipmentStatus(eq)
        }));
        this.saveEquipment(initialized);
        return initialized;
      }

      // Merge any new equipment that exists in INITIAL_EQUIPMENT but missing in parsed storage
      const existingIds = new Set(parsed.map(e => e.id));
      let hasNew = false;
      INITIAL_EQUIPMENT.forEach(initItem => {
        if (!existingIds.has(initItem.id)) {
          parsed.push({
            ...initItem,
            currentStatus: calculateEquipmentStatus(initItem)
          });
          hasNew = true;
        }
      });

      if (hasNew) {
        this.saveEquipment(parsed);
      }

      return parsed.map(eq => ({
        ...eq,
        currentStatus: calculateEquipmentStatus(eq)
      }));
    } catch (e) {
      console.error('Failed to load equipment:', e);
      return INITIAL_EQUIPMENT;
    }
  }

  static saveEquipment(equipment: Equipment[]): void {
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipment));
  }

  static getVerificationLogs(): VerificationLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VERIFICATION_LOGS);
      if (!data) {
        this.saveVerificationLogs(INITIAL_VERIFICATION_LOGS);
        return INITIAL_VERIFICATION_LOGS;
      }
      const parsed: VerificationLog[] = JSON.parse(data);
      if (!Array.isArray(parsed)) {
        this.saveVerificationLogs(INITIAL_VERIFICATION_LOGS);
        return INITIAL_VERIFICATION_LOGS;
      }

      // Merge missing initial logs if any
      const existingLogIds = new Set(parsed.map(l => l.id));
      let hasNewLogs = false;
      INITIAL_VERIFICATION_LOGS.forEach(log => {
        if (!existingLogIds.has(log.id)) {
          parsed.push(log);
          hasNewLogs = true;
        }
      });
      if (hasNewLogs) {
        this.saveVerificationLogs(parsed);
      }

      return parsed;
    } catch (e) {
      console.error('Failed to load logs:', e);
      return INITIAL_VERIFICATION_LOGS;
    }
  }

  static saveVerificationLogs(logs: VerificationLog[]): void {
    localStorage.setItem(STORAGE_KEYS.VERIFICATION_LOGS, JSON.stringify(logs));
  }

  static getCalibrationMovements(): CalibrationMovement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CALIBRATION_MOVEMENTS);
      if (!data) {
        this.saveCalibrationMovements(INITIAL_CALIBRATION_MOVEMENTS);
        return INITIAL_CALIBRATION_MOVEMENTS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load movements:', e);
      return INITIAL_CALIBRATION_MOVEMENTS;
    }
  }

  static saveCalibrationMovements(movements: CalibrationMovement[]): void {
    localStorage.setItem(STORAGE_KEYS.CALIBRATION_MOVEMENTS, JSON.stringify(movements));
  }

  static getSheetsConfig(): GoogleSheetsConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SHEETS_CONFIG);
      const queue = this.getOfflineQueue();
      if (!data) {
        return { ...DEFAULT_SHEETS_CONFIG, pendingQueueCount: queue.length };
      }
      const parsed = JSON.parse(data);
      return { ...parsed, pendingQueueCount: queue.length };
    } catch {
      return DEFAULT_SHEETS_CONFIG;
    }
  }

  static saveSheetsConfig(config: GoogleSheetsConfig): void {
    localStorage.setItem(STORAGE_KEYS.SHEETS_CONFIG, JSON.stringify(config));
  }

  static getOfflineQueue(): SyncPayload[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static addToOfflineQueue(payload: SyncPayload): void {
    const queue = this.getOfflineQueue();
    queue.push(payload);
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
  }

  static clearOfflineQueue(): void {
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify([]));
  }

  static resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.EQUIPMENT);
    localStorage.removeItem(STORAGE_KEYS.VERIFICATION_LOGS);
    localStorage.removeItem(STORAGE_KEYS.CALIBRATION_MOVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
  }

  /**
   * Helper to push updates to Google Apps Script Web App API if configured
   */
  static async pushToGoogleSheets(payload: SyncPayload): Promise<{ success: boolean; message: string }> {
    const config = this.getSheetsConfig();
    if (!config.webAppUrl || !config.webAppUrl.trim()) {
      return { success: true, message: 'Disimpan secara setempat (Local Storage).' };
    }

    try {
      // Use no-cors or standard fetch with JSON
      const res = await fetch(config.webAppUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // Google Apps Script handles text/plain cleanly without CORS preflight block
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        config.lastSyncTime = new Date().toISOString();
        config.status = 'connected';
        this.saveSheetsConfig(config);
        return { success: true, message: 'Berjaya disegerakkan dengan Google Sheets.' };
      } else {
        throw new Error(`HTTP status ${res.status}`);
      }
    } catch (err: any) {
      console.warn('Google Sheets sync queued in offline storage:', err);
      this.addToOfflineQueue(payload);
      config.status = 'error';
      this.saveSheetsConfig(config);
      return { 
        success: false, 
        message: 'Disimpan ke antrian setempat (Offline Queue). Akan disegerakkan bila rangkaian sedia.' 
      };
    }
  }

  /**
   * Pull complete data from Google Sheets Apps Script
   */
  static async fetchFromGoogleSheets(): Promise<{ 
    success: boolean; 
    data?: { equipment: Equipment[]; logs: VerificationLog[]; movements: CalibrationMovement[] }; 
    message: string 
  }> {
    const config = this.getSheetsConfig();
    if (!config.webAppUrl || !config.webAppUrl.trim()) {
      return { success: false, message: 'Sila masukkan URL Google Apps Script Web App terlebih dahulu.' };
    }

    try {
      const res = await fetch(config.webAppUrl + '?action=getAll');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      
      if (json && json.status === 'success') {
        config.lastSyncTime = new Date().toISOString();
        config.status = 'connected';
        this.saveSheetsConfig(config);
        return {
          success: true,
          data: {
            equipment: json.equipment || [],
            logs: json.logs || [],
            movements: json.movements || []
          },
          message: 'Berjaya memuat turun data terkini daripada Google Sheets.'
        };
      } else {
        throw new Error(json.message || 'Format data Google Sheets tidak sah');
      }
    } catch (err: any) {
      config.status = 'error';
      this.saveSheetsConfig(config);
      return { success: false, message: `Ralat penyambungan: ${err.message || 'Gagal menyambung ke Google Sheets'}` };
    }
  }

  /**
   * Generate ready-to-paste Google Apps Script code for the user
   */
  static getAppsScriptTemplate(): string {
    return `/**
 * CalibraTrack - Google Apps Script Backend Web App
 * Sila tampal kod ini ke dalam Extensions -> Apps Script pada Google Sheets anda,
 * kemudian klik Deploy -> New Deployment -> Web App (Execute as: Me, Who has access: Anyone).
 */

const SS = SpreadsheetApp.getActiveSpreadsheet();

function doGet(e) {
  setupSheetsIfNeeded();
  const action = e.parameter.action || 'getAll';
  
  if (action === 'getAll') {
    const equipment = getSheetDataAsJson('Master_Equipment');
    const logs = getSheetDataAsJson('Verification_Logs');
    const movements = getSheetDataAsJson('Calibration_Movements');
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      equipment: equipment,
      logs: logs,
      movements: movements
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok', time: new Date() }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  setupSheetsIfNeeded();
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    const data = payload.data;
    
    if (action === 'logVerification') {
      appendVerificationLog(data);
      updateEquipmentVerificationDate(data.equipmentId, data.nextVerificationDate, data.status);
    } else if (action === 'vendorOutward') {
      appendMovement(data);
      setEquipmentStatus(data.equipmentId, 'Out for Calibration');
    } else if (action === 'vendorInward') {
      updateMovementInward(data);
      updateEquipmentCalibrationDate(data.equipmentId, data.nextCalibrationDate, data.result);
    } else if (action === 'addEquipment') {
      appendEquipment(data);
    } else if (action === 'updateEquipment') {
      updateEquipmentMaster(data);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Transaksi berjaya direkodkan',
      action: action
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function setupSheetsIfNeeded() {
  const sheets = {
    'Master_Equipment': ['Equipment_ID', 'Name', 'Model', 'Serial_No', 'Category', 'Current_Location', 'PIC_Name', 'PIC_Email', 'PIC_Phone', 'Next_Verification_Date', 'Next_Calibration_Date', 'Current_Status', 'Standard_Ref', 'Notes'],
    'Verification_Logs': ['Log_ID', 'Equipment_ID', 'Verification_Date', 'Conducted_By', 'Status', 'Reading_Value', 'Remarks', 'Proof_URL', 'Created_At'],
    'Calibration_Movements': ['Movement_ID', 'Equipment_ID', 'Outward_Date', 'Vendor_Name', 'DO_Reference', 'Expected_Return', 'Return_Date', 'Result', 'Cert_Number', 'Cert_URL', 'Status']
  };
  
  for (let sheetName in sheets) {
    let sheet = SS.getSheetByName(sheetName);
    if (!sheet) {
      sheet = SS.insertSheet(sheetName);
      sheet.appendRow(sheets[sheetName]);
      sheet.getRange(1, 1, 1, sheets[sheetName].length).setFontWeight('bold').setBackground('#E2E8F0');
      sheet.setFrozenRows(1);
    }
  }
}

function getSheetDataAsJson(sheetName) {
  const sheet = SS.getSheetByName(sheetName);
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  const headers = rows[0];
  const data = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    data.push(obj);
  }
  return data;
}

function appendVerificationLog(log) {
  const sheet = SS.getSheetByName('Verification_Logs');
  sheet.appendRow([
    log.id, log.equipmentId, log.verificationDate, log.conductedBy, 
    log.status, log.readingValue, log.remarks, log.proofUrl || '', new Date()
  ]);
}

function updateEquipmentVerificationDate(eqId, nextDate, status) {
  const sheet = SS.getSheetByName('Master_Equipment');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(eqId)) {
      sheet.getRange(i + 1, 10).setValue(nextDate); // Next_Verification_Date col
      if (status === 'Fail') {
        sheet.getRange(i + 1, 12).setValue('Out of Service');
      } else {
        sheet.getRange(i + 1, 12).setValue('Active');
      }
      break;
    }
  }
}

function appendMovement(mov) {
  const sheet = SS.getSheetByName('Calibration_Movements');
  sheet.appendRow([
    mov.id, mov.equipmentId, mov.outwardDate, mov.vendorName, mov.doReference,
    mov.expectedReturn, '', '', '', '', 'In Progress'
  ]);
}

function updateMovementInward(data) {
  const sheet = SS.getSheetByName('Calibration_Movements');
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][1]) === String(data.equipmentId) && rows[i][10] === 'In Progress') {
      sheet.getRange(i + 1, 7).setValue(data.returnDate);
      sheet.getRange(i + 1, 8).setValue(data.result);
      sheet.getRange(i + 1, 9).setValue(data.certNumber);
      sheet.getRange(i + 1, 10).setValue(data.certUrl || '');
      sheet.getRange(i + 1, 11).setValue('Completed');
      break;
    }
  }
}

function updateEquipmentCalibrationDate(eqId, nextCalibDate, result) {
  const sheet = SS.getSheetByName('Master_Equipment');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(eqId)) {
      sheet.getRange(i + 1, 11).setValue(nextCalibDate);
      sheet.getRange(i + 1, 12).setValue(result === 'Pass' ? 'Active' : 'Out of Service');
      break;
    }
  }
}

function setEquipmentStatus(eqId, status) {
  const sheet = SS.getSheetByName('Master_Equipment');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(eqId)) {
      sheet.getRange(i + 1, 12).setValue(status);
      break;
    }
  }
}

function appendEquipment(eq) {
  const sheet = SS.getSheetByName('Master_Equipment');
  sheet.appendRow([
    eq.id, eq.name, eq.model, eq.serialNo, eq.category, eq.currentLocation,
    eq.picName, eq.picEmail, eq.picPhone, eq.nextVerificationDate,
    eq.nextCalibrationDate, eq.currentStatus, eq.standardRef || '', eq.notes || ''
  ]);
}

function updateEquipmentMaster(eq) {
  const sheet = SS.getSheetByName('Master_Equipment');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(eq.id)) {
      sheet.getRange(i + 1, 2).setValue(eq.name);
      sheet.getRange(i + 1, 3).setValue(eq.model);
      sheet.getRange(i + 1, 4).setValue(eq.serialNo);
      sheet.getRange(i + 1, 5).setValue(eq.category);
      sheet.getRange(i + 1, 6).setValue(eq.currentLocation);
      sheet.getRange(i + 1, 7).setValue(eq.picName);
      sheet.getRange(i + 1, 8).setValue(eq.picEmail);
      sheet.getRange(i + 1, 9).setValue(eq.picPhone);
      break;
    }
  }
}
`;
  }
}
