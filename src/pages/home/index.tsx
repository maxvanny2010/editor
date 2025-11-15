import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HomeLayout } from './ui/HomeLayout';
import { ProjectList } from '@/widgets/projects-list/model';
import { CreateProjectModal } from '@/features/project-create/model';
import { ProjectNotFoundBanner } from '@/entities/project/ui/_shared';

export default function HomePage() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const [banner, setBanner] = useState(false);

	// show banner if come without an active project
	useEffect(() => {
		const noProject = location.state?.noProject;
		if (!noProject) return;

		setBanner(true);

		// clear state
		navigate(location.pathname, { replace: true });
	}, [location.pathname, location.state, navigate]);

	return (
		<HomeLayout onNewProject={() => setIsModalOpen(true)}>
			<ProjectNotFoundBanner show={banner} onHide={() => setBanner(false)} />
			<ProjectList />
			{isModalOpen && <CreateProjectModal onClose={() => setIsModalOpen(false)} />}
		</HomeLayout>
	);
}
