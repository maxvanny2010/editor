import { EditorViewport } from '@/entities/editor/model';

export const EditorPage = () => {
	return (
		<div className="h-screen w-screen bg-gray-50 dark:bg-gray-950">
			<EditorViewport />
		</div>
	);
};
