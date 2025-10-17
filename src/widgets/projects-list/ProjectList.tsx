import { useAppSelector } from '@/store/hooks';
import { PROJECT_STATE } from '@/shared/constants';
import { useDelayedSkeleton } from '@/shared/lib/hooks';
import { useFetchProjectsOnMount } from '@/features/project-list/model';
import { projectsSelectors } from '@/entities/project/model/selectors';
import {
	ProjectListCardsView,
	ProjectListEmptyView,
	ProjectListSkeletonView,
} from './views';

export const ProjectList = () => {
	const projects = useAppSelector(projectsSelectors.selectAll);
	const loading = useAppSelector((s) => s.projects.loading);

	useFetchProjectsOnMount(projects.length);

	const showSkeletons = useDelayedSkeleton(loading === PROJECT_STATE.PENDING);
	const isEmpty =
		projects.length === 0 &&
		(loading === PROJECT_STATE.IDLE || loading === PROJECT_STATE.SUCCEEDED);

	if (showSkeletons) return <ProjectListSkeletonView />;
	if (isEmpty) return <ProjectListEmptyView />;
	return <ProjectListCardsView projects={projects} />;
};
