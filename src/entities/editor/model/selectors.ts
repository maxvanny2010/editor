import type { RootState } from '@/store';

export const selectViewport = (state: RootState) => state.editor.viewport;
export const selectActiveTool = (state: RootState) => state.editor.activeTool;
export const selectPaletteOpen = (state: RootState) => state.editor.paletteOpen;
