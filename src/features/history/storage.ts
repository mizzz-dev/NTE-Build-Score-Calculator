import { GUEST_HISTORY_LIMIT, type GuestHistoryEntry } from './types';

const STORAGE_KEY = 'nte_guest_history_v1';

function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const key = '__nte_test__';
    window.localStorage.setItem(key, '1');
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function readRaw(): GuestHistoryEntry[] {
  if (!isStorageAvailable()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as GuestHistoryEntry[];
  } catch {
    return [];
  }
}

function writeRaw(entries: GuestHistoryEntry[]): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // no-op
  }
}

export function listGuestHistory(): GuestHistoryEntry[] {
  return readRaw();
}

export function saveGuestHistory(entry: GuestHistoryEntry): GuestHistoryEntry[] {
  const current = readRaw();
  const next = [entry, ...current].slice(0, GUEST_HISTORY_LIMIT);
  writeRaw(next);
  return next;
}

export function deleteGuestHistory(id: string): GuestHistoryEntry[] {
  const current = readRaw();
  const next = current.filter((entry) => entry.id !== id);
  writeRaw(next);
  return next;
}
