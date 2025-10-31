import React from 'react';

interface LayerNameEditorProps {
	layerId: string;
	layerName: string;
	isEditing: boolean;
	onRenameSubmit: (id: string, name: string) => Promise<void>;
}

export function LayerNameEditor({
	layerId,
	layerName,
	isEditing,
	onRenameSubmit,
}: LayerNameEditorProps) {
	// Prevents the click from activating the layer selection when interacting with the input field.
	const handleInputClick = (e: React.MouseEvent) => e.stopPropagation();

	// Handles form submission (Enter key) to save the new layer name.
	const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const input = form.elements.namedItem('name') as HTMLInputElement;

		onRenameSubmit(layerId, input.value).then((r) => r);
	};

	// Handles loss of focus (click outside input) to save the new layer name.
	const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		onRenameSubmit(layerId, e.currentTarget.value).then((r) => r);
	};

	return (
		<div className="min-w-0">
			{isEditing ? (
				<form onSubmit={handleFormSubmit}>
					<input
						name="name"
						autoFocus
						defaultValue={layerName}
						onClick={handleInputClick}
						onBlur={handleInputBlur}
						className="w-44 text-sm px-1 py-0.5 rounded border border-indigo-300"
					/>
				</form>
			) : (
				<div className="truncate text-sm" title={layerName}>
					{layerName}
				</div>
			)}
		</div>
	);
}
