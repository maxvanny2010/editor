import type { RootState } from '@/store';

export const selectEraserSize = (state: RootState) => state.eraser.size;
export const selectEraserActive = (state: RootState) => state.eraser.active;
export const selectEraserState = (state: RootState) => state.eraser;
