import type { ActiveProject } from '@/shared/types';
import { NAMES } from '@/shared/constants';
import { db } from '@/shared/lib/db';

export const settingsTable = db.table<ActiveProject>(`${NAMES.ACTIVE_PROJECT}`);
