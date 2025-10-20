import { useParams } from 'react-router-dom';

export const EditorPage = () => {
	const { id } = useParams<{ id: string }>();

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
			<h1 className="text-3xl font-bold text-gray-800 mb-2">Editor Page</h1>
			<p className="text-gray-600">
				Project ID: <span className="font-mono">{id}</span>
			</p>
		</div>
	);
};
