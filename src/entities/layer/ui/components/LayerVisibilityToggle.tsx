import { Eye as EyeIcon, EyeOff as EyeOffIcon } from 'lucide-react';

interface LayerVisibilityToggleProps {
	layerId: string;
	isVisible: boolean;
	onToggle: (id: string, visible: boolean) => void;
}

export function LayerVisibilityToggle({
	layerId,
	isVisible,
	onToggle,
}: LayerVisibilityToggleProps) {
	return (
		<button
			onClick={(e) => {
				e.stopPropagation();
				onToggle(layerId, isVisible);
			}}
			className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
			aria-label={isVisible ? 'Hide layer' : 'Show layer'}
		>
			{isVisible ? (
				<EyeIcon className="w-4 h-4" />
			) : (
				<EyeOffIcon className="w-4 h-4" />
			)}
		</button>
	);
}
