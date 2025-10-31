import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, Reorder } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
	createLayer,
	deleteLayer,
	fetchLayersByProject,
	setActiveLayerId,
	updateLayer,
} from '@/entities/layer/model/slice';
import { layersSelectors, makeSelectByProject } from '@/entities/layer/model/selectors';
import { X as CloseIcon } from 'lucide-react';
import {
	AddLayerButton,
	LayerItem,
	OpacitySlider,
	PanelToggleButton,
} from '@/entities/layer/ui/components';

export function LayersPanel({
	projectId,
	setIsOpen,
}: {
	projectId: string;
	setIsOpen: (v: boolean) => void;
}) {
	const dispatch = useAppDispatch();
	const selectByProject = useMemo(makeSelectByProject, []);
	const layers = (useAppSelector((s) => selectByProject(s, projectId)) ?? [])
		.slice()
		.sort((a, b) => b.zIndex - a.zIndex);

	const activeLayer = useAppSelector(layersSelectors.selectActiveLayer);

	const [open, setOpen] = useState(false);
	const [localNameId, setLocalNameId] = useState<string | null>(null);
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);

	useEffect(() => {
		void dispatch(fetchLayersByProject(projectId));
	}, [dispatch, projectId]);

	useEffect(() => {
		setIsOpen(open);
	}, [open, setIsOpen]);

	// Reorder handler
	const handleReorder = (newOrder: typeof layers) => {
		newOrder.forEach((layer, idx) => {
			const newZ = newOrder.length - 1 - idx;
			if (layer.zIndex !== newZ) {
				dispatch(updateLayer({ id: layer.id, changes: { zIndex: newZ } }));
			}
		});
	};

	// UI actions
	const handlers = {
		onCreate: () => void dispatch(createLayer({ projectId })),
		onSetActive: (id: string) => dispatch(setActiveLayerId(id)),
		onToggleVisibility: (id: string, visible: boolean) =>
			void dispatch(updateLayer({ id, changes: { visible: !visible } })),
		onOpacityChange: (id: string, value: number) =>
			void dispatch(updateLayer({ id, changes: { opacity: value } })),
		onRenameSubmit: async (id: string, name: string) => {
			setLocalNameId(null);
			await dispatch(
				updateLayer({ id, changes: { name: name.trim() || 'Untitled' } }),
			);
		},
		onDelete: (id: string) => {
			void dispatch(deleteLayer(id));
			setOpenMenuId(null);
		},
	};

	return (
		<>
			<PanelToggleButton open={open} setOpen={setOpen} />

			<AnimatePresence>
				{open && (
					<motion.aside
						initial={{ x: '100%', opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: '100%', opacity: 0 }}
						transition={{ type: 'spring', stiffness: 220, damping: 25 }}
						className="fixed top-0 right-0 h-full w-72 border-l border-gray-200 bg-white/80 backdrop-blur-sm shadow-2xl p-3 flex flex-col gap-3 z-40"
					>
						<header className="flex items-center justify-between">
							<h3 className="text-sm font-semibold text-gray-800">
								Layers
							</h3>
							<button
								onClick={() => setOpen(false)}
								className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
								aria-label="Close panel"
							>
								<CloseIcon className="w-4 h-4" />
							</button>
						</header>

						<OpacitySlider
							activeLayer={activeLayer}
							onOpacityChange={handlers.onOpacityChange}
						/>

						<AddLayerButton onCreate={handlers.onCreate} />

						{/* Animated reorderable layer list */}
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
									/>
								</Reorder.Item>
							))}
						</Reorder.Group>
					</motion.aside>
				)}
			</AnimatePresence>
		</>
	);
}
