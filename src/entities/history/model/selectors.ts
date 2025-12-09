import type { RootState } from '@/store';

export const selectHistory = (s: RootState) => s.history;
export const selectHistoryStack = (s: RootState) => s.history.stack;
export const selectHistoryIndex = (s: RootState) => s.history.currentIndex;

export const selectCurrentHistoryEntry = (s: RootState) => {
	const { stack, currentIndex } = s.history;
	return stack[currentIndex] || null;
};

export const selectCanUndo = (s: RootState) => s.history.currentIndex > 0;
export const selectCanRedo = (s: RootState) => {
	const { stack, currentIndex } = s.history;
	return currentIndex < stack.length - 1;
};
export const selectHistoryIsPreview = (state: RootState) => state.history.isPreview;
