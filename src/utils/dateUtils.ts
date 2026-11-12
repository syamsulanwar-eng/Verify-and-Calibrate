import { Equipment, EquipmentStatus } from '../types';

/**
 * Normalizes date to midnight UTC/local for reliable day calculations
 */
export function parseDate(dateStr: string): Date {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(dateStr);
}

/**
 * Returns today formatted as YYYY-MM-DD
 */
export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate difference in whole days: targetDate - today
 * Positive: Days remaining in future
 * 0: Due today
 * Negative: Overdue by X days
 */
export function getDaysRemaining(targetDateStr: string, fromDateStr?: string): number {
  if (!targetDateStr) return 999;
  const target = parseDate(targetDateStr);
  const base = fromDateStr ? parseDate(fromDateStr) : new Date();
  
  // Set both to midnight to compare pure calendar days
  target.setHours(0, 0, 0, 0);
  base.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - base.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Adds specified number of days to a date string (YYYY-MM-DD)
 */
export function addDays(dateStr: string, days: number): string {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Adds 1 year (or 365 days) to a date string (YYYY-MM-DD)
 */
export function addOneYear(dateStr: string): string {
  const d = parseDate(dateStr);
  d.setFullYear(d.getFullYear() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Evaluates the effective status of equipment strictly following PRD Section 8 & 13 business rules:
 * - If Out for Calibration => Out for Calibration
 * - If Out of Service => Out of Service
 * - If overdue on calibration OR verification (days < 0) => Overdue
 * - If within 30 days on calibration OR verification (days <= 30) => Due Soon
 * - Otherwise => Active
 */
export function calculateEquipmentStatus(item: Equipment, currentDateStr?: string): EquipmentStatus {
  // If explicitly out for calibration or decommissioned/failed
  if (item.currentStatus === 'Out for Calibration') {
    return 'Out for Calibration';
  }
  if (item.currentStatus === 'Out of Service') {
    return 'Out of Service';
  }

  const daysCalib = getDaysRemaining(item.nextCalibrationDate, currentDateStr);
  const daysVerif = getDaysRemaining(item.nextVerificationDate, currentDateStr);

  // Overdue check (FR-001 / Rule 13: if date passed, mandatory Overdue)
  if (daysCalib < 0 || daysVerif < 0) {
    return 'Overdue';
  }

  // Due soon threshold (≤ 30 days)
  if (daysCalib <= 30 || daysVerif <= 30) {
    return 'Due Soon';
  }

  return 'Active';
}

/**
 * Formats YYYY-MM-DD into readable Malaysian format: "12 Nov 2026"
 */
export function formatDateMalay(dateStr?: string): string {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  
  const months = [
    'Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun',
    'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'
  ];
  
  const day = parseInt(parts[2], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const year = parts[0];
  
  return `${day} ${months[monthIdx] || parts[1]} ${year}`;
}

/**
 * Returns humanized relative badge text in Malay
 */
export function getRelativeDaysLabel(days: number): { text: string; urgent: boolean; warning: boolean; ok: boolean } {
  if (days < 0) {
    return {
      text: `Terlewat ${Math.abs(days)} hari`,
      urgent: true,
      warning: false,
      ok: false
    };
  }
  if (days === 0) {
    return {
      text: `Hari ini!`,
      urgent: true,
      warning: false,
      ok: false
    };
  }
  if (days <= 30) {
    return {
      text: `Baki ${days} hari`,
      urgent: false,
      warning: true,
      ok: false
    };
  }
  return {
    text: `Baki ${days} hari`,
    urgent: false,
    warning: false,
    ok: true
  };
}
