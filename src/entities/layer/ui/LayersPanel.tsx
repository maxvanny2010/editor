import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { motion, Reorder } from 'framer-motion';
import {
	createLayer,
	deleteLayer,
	fetchLayersByProject,
	setActiveLayerId,
	updateLayer,
} from '@/entities/layer/model/slice';
import { layersSelectors, makeSelectByProject } from '@/entities/layer/model/selectors';
import { AddLayerButton, LayerItem, OpacitySlider } from '@/entities/layer/ui/components';
import { LAYER_DEFAULTS } from '@/shared/constants';
import { store } from '@/store';

interface LayersPanelProps {
	projectId: string;
	open: boolean;
}

export const LayersPanel = React.memo(function LayersPanel({
	projectId,
	open,
}: LayersPanelProps) {
	const dispatch = useAppDispatch();

	const selectByProject = useMemo(makeSelectByProject, [projectId]);

	const layers = useAppSelector((s) => selectByProject(s, projectId))
		.slice()
		.sort((a, b) => b.zIndex - a.zIndex);

	const activeLayer = useAppSelector(layersSelectors.selectActiveLayer);
	const isPreview = useAppSelector((s) => s.history.isPreview);

	const [localNameId, setLocalNameId] = useState<string | null>(null);
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);

	// ───────────────────────────────
	// Fetch layers when first open
	// ───────────────────────────────
	useEffect(() => {
		if (!open || isPreview) return;

		const state = store.getState();
		const existingCount = Object.keys(state.layers.entities).length;
		if (existingCount === 0) {
			void dispatch(fetchLayersByProject(projectId));
		}
	}, [dispatch, projectId, open, isPreview]);

	if (!open) return null;

	// ───────────────────────────────
	// Handlers
	// ───────────────────────────────
	const handleReorder = (newOrder: typeof layers) => {
		if (isPreview) return;
		newOrder.forEach((layer, idx) => {
			const newZ = newOrder.length - 1 - idx;
			if (layer.zIndex !== newZ) {
				dispatch(updateLayer({ id: layer.id, changes: { zIndex: newZ } }));
			}
		});
	};

	const handlers = {
		onCreate: () => {
			if (isPreview) return;
			void dispatch(createLayer({ projectId }));
		},
		onDelete: (id: string) => {
			if (isPreview) return;
			void dispatch(deleteLayer(id));
			setOpenMenuId(null);
		},
		onOpacityChange: (id: string, value: number) => {
			if (isPreview) return;
			void dispatch(updateLayer({ id, changes: { opacity: value } }));
		},
		onSetActive: (id: string) => dispatch(setActiveLayerId(id)),
		onToggleVisibility: (id: string, visible: boolean) => {
			if (isPreview) return;
			void dispatch(updateLayer({ id, changes: { visible: !visible } }));
		},
		onRenameSubmit: async (id: string, name: string) => {
			if (isPreview) return;
			setLocalNameId(null);
			await dispatch(
				updateLayer({
					id,
					changes: {
						name: name.trim() || `${LAYER_DEFAULTS.UNTITLED_PROJECT}`,
					},
				}),
			);
		},
	};

	// ───────────────────────────────
	// UI
	// ───────────────────────────────
	return (
		<motion.aside
			initial={{ x: '100%', opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			exit={{ x: '100%', opacity: 0 }}
			transition={{ type: 'spring', stiffness: 220, damping: 25 }}
			className="fixed top-0 right-16 bottom-16 w-72 border-l border-gray-200 bg-white/90 backdrop-blur-sm shadow-xl p-3 flex flex-col gap-3 z-40"
		>
			<header className="flex items-center justify-between">
				<h3 className="text-sm font-semibold text-gray-800">
					Layers{' '}
					{isPreview && <span className="text-amber-600 ml-1">(Preview)</span>}
				</h3>
			</header>

			<OpacitySlider
				activeLayer={activeLayer}
				onOpacityChange={handlers.onOpacityChange}
			/>

			<AddLayerButton onCreate={handlers.onCreate} disabled={isPreview} />

			{/* The list of layers */}
			<Reorder.Group axis="y" values={layers} onReorder={handleReorder}>
				{layers.map((layer) => (
					<Reorder.Item key={layer.id} value={layer}>
						<LayerItem
							layer={layer}
							isActive={activeLayer?.id === layer.id}
							isEditing={localNameId === layer.id}
							openMenuId={openMenuId}
							onSetActive={handlers.onSetActive}
							onToggleVisibility={handlers.onToggleVisibility}
							onRenameSubmit={handlers.onRenameSubmit}
							onDelete={handlers.onDelete}
							setLocalNameId={setLocalNameId}
							setOpenMenuId={setOpenMenuId}
							disabled={isPreview}
						/>
					</Reorder.Item>
				))}
			</Reorder.Group>
		</motion.aside>
	);
});
