import { LayerVisibilityToggle } from './LayerVisibilityToggle.tsx';
import { LayerNameEditor } from './LayerNameEditor.tsx';
import { LayerMenu } from './LayerMenu';
import type { Layer } from '@/shared/types';

interface LayerItemProps {
	layer: Layer;
	isActive: boolean;
	isEditing: boolean;
	openMenuId: string | null;
	onSetActive: (id: string) => void;
	onToggleVisibility: (id: string, visible: boolean) => void;
	onRenameSubmit: (id: string, name: string) => Promise<void>;
	onDelete: (id: string) => void;
	setLocalNameId: (id: string | null) => void;
	setOpenMenuId: (id: string | null) => void;
	disabled?: boolean;
}

export function LayerItem({
	layer,
	isActive,
	isEditing,
	openMenuId,
	onSetActive,
	onToggleVisibility,
	onRenameSubmit,
	onDelete,
	setLocalNameId,
	setOpenMenuId,
	disabled,
}: LayerItemProps) {
	const isMenuOpen = openMenuId === layer.id;

	// Handlers for the context menu actions, which update the parent state (localNameId/openMenuId) and dispatch actions.
	const handleRenameClick = () => {
		setLocalNameId(layer.id);
		setOpenMenuId(null);
	};

	const handleDeleteClick = () => {
		onDelete(layer.id);
	};

	return (
		// The main list item, handling layer activation on click.
		<div
			className={`group relative flex items-center justify-between gap-2 px-2 py-1.5 rounded-md border
			${isActive ? 'border-indigo-400 bg-indigo-50' : 'border-transparent hover:bg-gray-50'}
			${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
			onClick={() => !disabled && onSetActive(layer.id)}
		>
			<div className="flex items-center gap-2 min-w-0">
				{/* Component to toggle layer visibility */}
				<LayerVisibilityToggle
					layerId={layer.id}
					isVisible={layer.visible}
					onToggle={onToggleVisibility}
				/>

				{/* Component for displaying and editing the layer name */}
				<LayerNameEditor
					layerId={layer.id}
					layerName={layer.name}
					isEditing={isEditing}
					onRenameSubmit={onRenameSubmit}
				/>
			</div>

			{/* Component for the layer options context menu */}
			<LayerMenu
				layerId={layer.id}
				isMenuOpen={isMenuOpen}
				setOpenMenuId={setOpenMenuId}
				onRenameClick={handleRenameClick}
				onDeleteClick={handleDeleteClick}
			/>
		</div>
	);
}
