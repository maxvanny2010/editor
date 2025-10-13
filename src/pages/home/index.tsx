import { ProjectList } from '@/widgets/projects-list';

export default function HomePage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 py-16 px-6">
			<h1 className="text-3xl font-bold mb-10 text-gray-800">Projects</h1>
			<div className="w-full max-w-3xl">
				<ProjectList />
			</div>
		</div>
	);
}
