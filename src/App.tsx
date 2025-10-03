import { decrement, increment } from './store/slices/counterSlice';
import { fetchTodos, type RootState, useAppDispatch, useAppSelector } from './store';

export default function App() {
	const dispatch = useAppDispatch();
	const count = useAppSelector((state: RootState) => state.counter.value);
	const todos = useAppSelector((state: RootState) => state.todos.items);

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-6">
			<div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 space-y-6 mx-auto">
				{/* Header */}
				<div className="text-center">
					<h1 className="text-3xl font-bold text-blue-600">
						Redux Toolkit + Tailwind
					</h1>
					<p className="text-gray-600 mt-2">
						State management with counter & todos
					</p>
				</div>

				{/* Counter */}
				<div className="text-center">
					<p className="text-xl font-semibold text-black">Count: {count}</p>
					<div className="flex justify-center space-x-4 mt-4">
						<button
							className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition cursor-pointer"
							onClick={() => dispatch(increment())}
						>
							+ Increment
						</button>
						<button
							className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition cursor-pointer"
							onClick={() => dispatch(decrement())}
						>
							- Decrement
						</button>
					</div>
				</div>

				{/* Todos */}
				<div>
					<div className="flex justify-between items-center mb-3">
						<h2 className="text-xl font-bold text-gray-800">Todos</h2>
						<button
							className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition cursor-pointer"
							onClick={() => dispatch(fetchTodos())}
						>
							Load Todos
						</button>
					</div>
					<ul className="space-y-2">
						{todos.map((t) => (
							<li
								key={t.id}
								className="p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 transition text-black cursor-pointer"
							>
								{t.title}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
