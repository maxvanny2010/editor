import type { HistoryEntry } from '@/shared/types';
import { NAMES } from '@/shared/constants';
import { db } from '@/shared/lib/db';

export const historyTable = db.table<HistoryEntry>(`${NAMES.HISTORY}`);
