import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { handleExportPNG, handleSaveProject } from '@/features/project-actions';
import { CreateProjectModal } from '@/features/project-create/model';
import { HistoryPanel, PreviewOverlay } from '@/entities/history/ui';
import { ProjectSavedBanner } from '@/entities/project/ui/_shared';
import { BottomFooter, RightSidebar } from '@/widgets/layout/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useRestoreProject } from '@/entities/project/hooks';
import { projectsSelectors } from '@/entities/project/model';
import { redo, undo } from '@/entities/history/model/slice';
import { EditorViewport } from '@/widgets/viewport/model';
import { EditorSkeleton } from '@/entities/editor/ui';
import { LayersPanel } from '@/entities/layer/ui';
import { TopMenu } from '@/widgets/top-menu';
import { NAMES } from '@/shared/constants';

export type PanelKey = typeof NAMES.LAYERS | typeof NAMES.HISTORY | null;

export const EditorPage = () => {
	const dispatch = useAppDispatch();
	const params = useParams<{ id: string }>();

	const activeProject = useAppSelector(projectsSelectors.selectActiveProject);
	const loading = useRestoreProject(dispatch, params.id);

	// Sidebar panels
	const [activePanel, setActivePanel] = useState<PanelKey>(null);

	// Viewport state
	const [viewportInfo, setViewportInfo] = useState({
		scale: 1,
		offsetX: 0,
		offsetY: 0,
		showGrid: true,
		handleFit: () => {},
		handleReset: () => {},
		toggleGrid: () => {},
	});

	const [showCreateModal, setShowCreateModal] = useState(false);

	const [showSavedBanner, setShowSavedBanner] = useState(false);

	if (loading) return <EditorSkeleton />;
	if (!activeProject) return null;

	return (
		<div className="relative h-screen w-screen bg-gray-50 dark:bg-gray-950 overflow-hidden pt-12">
			{/* ---------------------- TOP MENU ---------------------- */}
			<TopMenu
				onNewProject={() => setShowCreateModal(true)}
				onSaveProject={async () => {
					await handleSaveProject(dispatch, activeProject);
					setShowSavedBanner(true); // показать баннер
				}}
				onExportPng={() => handleExportPNG(activeProject)}
			/>

			{/* ---------------------- VIEWPORT ---------------------- */}
			<EditorViewport
				isLayersOpen={activePanel === NAMES.LAYERS}
				isHistoryOpen={activePanel === NAMES.HISTORY}
				projectId={activeProject.id}
				width={activeProject.width}
				height={activeProject.height}
				onViewportUpdate={setViewportInfo}
			/>

			<PreviewOverlay />
			<RightSidebar active={activePanel} onSelect={setActivePanel} />

			{/* ---------------------- PANELS ---------------------- */}
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

			{/* ---------------------- FOOTER ---------------------- */}
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

			{/* ---------------------- CREATE PROJECT MODAL ---------------------- */}
			{showCreateModal && (
				<CreateProjectModal onClose={() => setShowCreateModal(false)} />
			)}

			{/* ---------------------- PROJECT SAVED BANNER ---------------------- */}
			<ProjectSavedBanner
				show={showSavedBanner}
				onHide={() => setShowSavedBanner(false)}
			/>
		</div>
	);
};
