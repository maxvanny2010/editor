import { Eye as EyeIcon, EyeOff as EyeOffIcon } from 'lucide-react';
import React from 'react';
import { UI_LABELS } from '@/shared/constants';

interface LayerVisibilityToggleProps {
	layerId: string;
	isVisible: boolean;
	onToggle: (id: string, visible: boolean) => void;
}

export const LayerVisibilityToggle = React.memo(function LayerVisibilityToggle({
	layerId,
	isVisible,
	onToggle,
}: LayerVisibilityToggleProps) {
	return (
		<button
			onClick={(mouseEvent) => {
				mouseEvent.stopPropagation();
				onToggle(layerId, isVisible);
			}}
			className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
			aria-label={isVisible ? UI_LABELS.LAYER_HIDE : UI_LABELS.LAYER_SHOW}
		>
			{isVisible ? (
				<EyeIcon className="w-4 h-4" />
			) : (
				<EyeOffIcon className="w-4 h-4" />
			)}
		</button>
	);
});
