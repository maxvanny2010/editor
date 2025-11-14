import { Undo2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCanUndo } from '@/entities/history/model/selectors';
import { undo } from '@/entities/history/model/slice';

export function UndoButton() {
	const dispatch = useAppDispatch();
	const canUndo = useAppSelector(selectCanUndo);

	return (
		<button
			onClick={() => dispatch(undo())}
			disabled={!canUndo}
			className={`p-2 rounded transition-colors ${
				canUndo
					? 'bg-gray-100 hover:bg-gray-200'
					: 'bg-gray-50 text-gray-400 cursor-not-allowed'
			}`}
			aria-label="Undo"
			title="Undo (Ctrl+Z)"
		>
			<Undo2 className="w-4 h-4" />
		</button>
	);
}
