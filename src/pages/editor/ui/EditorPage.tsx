import { useState } from 'react';
import { EditorViewport } from '@/widgets/viewport/model';
import { LayersPanel } from '@/entities/layer/ui';

export const EditorPage = () => {
	const [isLayersOpen, setIsLayersOpen] = useState(false);
	const projectId = 'current-project';

	return (
		<div className="relative h-screen w-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
			<EditorViewport isLayersOpen={isLayersOpen} />
			<LayersPanel projectId={projectId} setIsOpen={setIsLayersOpen} />
		</div>
	);
};
