import { db } from '@/shared/lib/db/dexie';

/**
 * Typed shortcut to the layers table.
 * Keeps the entity domain independent of shared infrastructure.
 */
export const layerTable = db.layers;
