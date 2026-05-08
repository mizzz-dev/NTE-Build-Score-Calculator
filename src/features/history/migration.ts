import type { AuthUser } from '@/features/auth/types';
import { canUseCloudStorage, listCloudHistory, saveCloudHistory } from './cloudStorage';
import { deleteGuestHistory, listGuestHistory } from './storage';
import type { CloudHistoryEntry } from './cloudStorage';
import type { GuestHistoryEntry } from './types';

export type MigrationCandidate = Omit<CloudHistoryEntry, 'id' | 'createdAt'>;

function normalizeEntry(entry: MigrationCandidate): string {
  return JSON.stringify({ kind: entry.kind, payload: entry.payload });
}

export function mapGuestHistoryToMigrationCandidates(entries: GuestHistoryEntry[]): MigrationCandidate[] {
  return entries.map((entry) => ({ kind: entry.kind, payload: entry.payload }));
}

export function listMigrationGuestHistory(): GuestHistoryEntry[] {
  return listGuestHistory();
}

export async function migrateGuestHistoryToCloud(user: AuthUser): Promise<{ migratedCount: number; skippedCount: number }> {
  if (!canUseCloudStorage(user)) {
    throw new Error('クラウド保存は利用できません。');
  }

  const guestEntries = listGuestHistory();
  if (guestEntries.length === 0) {
    return { migratedCount: 0, skippedCount: 0 };
  }

  const cloudEntries = await listCloudHistory(user);
  const existing = new Set(cloudEntries.map((entry) => normalizeEntry({ kind: entry.kind, payload: entry.payload })));
  const candidates = mapGuestHistoryToMigrationCandidates(guestEntries);

  let migratedCount = 0;
  let skippedCount = 0;

  for (const candidate of candidates) {
    const signature = normalizeEntry(candidate);
    if (existing.has(signature)) {
      skippedCount += 1;
      continue;
    }

    await saveCloudHistory(user, candidate);
    existing.add(signature);
    migratedCount += 1;
  }

  guestEntries.forEach((entry) => {
    deleteGuestHistory(entry.id);
  });

  return { migratedCount, skippedCount };
}
