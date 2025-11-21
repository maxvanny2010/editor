import { RedoButton, UndoButton } from '@/widgets/toolbar/ui';

export function UndoRedoButtons() {
	return (
		<div className="flex gap-2 mt-2">
			<RedoButton />
			<UndoButton />
		</div>
	);
}
