import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HistoryPanel, PreviewOverlay } from '@/entities/history/ui';
import { BottomFooter, RightSidebar } from '@/widgets/layout/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { projectsSelectors } from '@/entities/project/model';
import { redo, undo } from '@/entities/history/model/slice';
import { EditorViewport } from '@/widgets/viewport/model';
import { LayersPanel } from '@/entities/layer/ui';
import { NAMES } from '@/shared/constants';

export type PanelKey = typeof NAMES.LAYERS | typeof NAMES.HISTORY | null;

export const EditorPage = () => {
	const dispatch = useAppDispatch();
	const activeProject = useAppSelector(projectsSelectors.selectActiveProject);

	const [viewportInfo, setViewportInfo] = useState({
		scale: 1,
		offsetX: 0,
		offsetY: 0,
		showGrid: true,
		handleFit: () => {},
		handleReset: () => {},
		toggleGrid: () => {},
	});

	const [activePanel, setActivePanel] = useState<PanelKey>(null);

	// if project not chosen
	if (!activeProject) {
		return (
			<div className="flex items-center justify-center h-screen text-gray-500">
				No active project selected.
			</div>
		);
	}

	return (
		<div className="relative h-screen w-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
			{/* Canvas viewport */}
			<EditorViewport
				isLayersOpen={activePanel === NAMES.LAYERS}
				isHistoryOpen={activePanel === NAMES.HISTORY}
				projectId={activeProject.id}
				width={activeProject.width}
				height={activeProject.height}
				onViewportUpdate={setViewportInfo}
			/>

			{/* Overlay preview banner */}
			<PreviewOverlay />

			{/* Sidebar (Layers / History) */}
			<RightSidebar active={activePanel} onSelect={setActivePanel} />

			{/* Side panels */}
			<AnimatePresence>
				{activePanel === NAMES.LAYERS && (
					<LayersPanel
						key={NAMES.LAYERS}
						open
						onClose={() => setActivePanel(null)}
						projectId={activeProject.id}
					/>
				)}

				{activePanel === NAMES.HISTORY && (
					<HistoryPanel
						key={NAMES.HISTORY}
						open
						onClose={() => setActivePanel(null)}
					/>
				)}
			</AnimatePresence>

			{/* Footer (zoom, undo/redo, grid toggle) */}
			<BottomFooter
				scale={viewportInfo.scale}
				offsetX={viewportInfo.offsetX}
				offsetY={viewportInfo.offsetY}
				onUndo={() => dispatch(undo())}
				onRedo={() => dispatch(redo())}
				onFit={viewportInfo.handleFit}
				onReset={viewportInfo.handleReset}
				onToggleGrid={viewportInfo.toggleGrid}
				showGrid={viewportInfo.showGrid}
			/>
		</div>
	);
};
