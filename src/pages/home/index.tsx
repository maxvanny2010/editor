import { useState } from 'react';
import { HomeLayout } from './ui/HomeLayout';
import { ProjectList } from '@/widgets/projects-list';
import { CreateProjectModal } from '@/features/project-create/model';

export default function HomePage() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<HomeLayout onNewProject={() => setIsModalOpen(true)}>
			<ProjectList />
			{isModalOpen && <CreateProjectModal onClose={() => setIsModalOpen(false)} />}
		</HomeLayout>
	);
}
