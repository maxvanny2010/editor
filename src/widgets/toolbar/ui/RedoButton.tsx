import { Redo2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCanRedo } from '@/entities/history/model/selectors';
import { redo } from '@/entities/history/model/slice';

export function RedoButton() {
	const dispatch = useAppDispatch();
	const canRedo = useAppSelector(selectCanRedo);

	return (
		<button
			onClick={() => dispatch(redo())}
			disabled={!canRedo}
			className={`p-2 rounded transition-colors ${
				canRedo
					? 'bg-gray-100 hover:bg-gray-200'
					: 'bg-gray-50 text-gray-400 cursor-not-allowed'
			}`}
			aria-label="Redo"
			title="Redo (Ctrl+Shift+Z)"
		>
			<Redo2 className="w-4 h-4" />
		</button>
	);
}
