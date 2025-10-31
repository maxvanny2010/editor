import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { projectsSelectors } from '@/entities/project/model';
import { EditorViewport } from '@/widgets/viewport/model';
import { LAYER } from '@/shared/constants';
import { LayersPanel } from '@/entities/layer/ui';
import { layerService } from '@/entities/layer/model';
import { layersSelectors } from '@/entities/layer/model/selectors';
import { fetchLayersByProject, setActiveLayerId } from '@/entities/layer/model/slice';
import { resetEditorState } from '@/entities/editor/model/slice';
import { resetBrushState } from '@/entities/brush/model/slice';
import { resetLineState } from '@/entities/line/model/slice';
import { resetShapeState } from '@/entities/shape/model/slice';
import { resetEraserState } from '@/entities/eraser/model/slice';
import { store } from '@/store';

export const EditorPage = () => {
	const [isLayersOpen, setIsLayersOpen] = useState(false);
	const dispatch = useAppDispatch();
	const activeProject = useAppSelector(projectsSelectors.selectActiveProject);

	// Protect from double initialization in StrictMode
	const initRef = useRef(false);

	useEffect(() => {
		return () => {
			dispatch(resetEditorState());
			dispatch(resetBrushState());
			dispatch(resetLineState());
			dispatch(resetShapeState());
			dispatch(resetEraserState());
		};
	}, [dispatch]);
	useEffect(() => {
		const pid = activeProject?.id;
		if (!pid || initRef.current) return;
		initRef.current = true;

		(async () => {
			//  Load existing layers
			const { layers: loaded } = await dispatch(fetchLayersByProject(pid)).unwrap();

			// If this is first open — atomically create base layer
			if (loaded.length === 0) {
				const created = await layerService.ensureBaseLayer(
					pid,
					`${LAYER.NEW_LAYER} 1`,
				);

				//  Do NOT call createLayer again — ensureBaseLayer already wrote to DB
				if (created) {
					// just sync Redux with current Dexie state
					await dispatch(fetchLayersByProject(pid)).unwrap();
				}
			}

			// Pick top layer as active
			const allLayers = layersSelectors.selectByProject(store.getState(), pid);
			if (allLayers.length > 0) {
				const topLayer = allLayers.sort((a, b) => b.zIndex - a.zIndex)[0];
				dispatch(setActiveLayerId(topLayer.id));
			}
		})();
	}, [dispatch, activeProject?.id]);

	if (!activeProject) {
		return (
			<div className="flex items-center justify-center h-screen text-gray-500">
				No active project selected.
			</div>
		);
	}

	return (
		<div className="relative h-screen w-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
			<EditorViewport
				isLayersOpen={isLayersOpen}
				projectId={activeProject.id}
				width={activeProject.width}
				height={activeProject.height}
			/>
			<LayersPanel projectId={activeProject.id} setIsOpen={setIsLayersOpen} />
		</div>
	);
};
