import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProjects } from '@/entities/project/model/slice';
import { PROJECT_STATE } from '@/shared/constants';

export function useFetchProjectsOnMount(projectsCount: number) {
	const dispatch = useAppDispatch();
	const loading = useAppSelector((s) => s.projects.loading);

	useEffect(() => {
		if (!projectsCount && loading === PROJECT_STATE.IDLE) {
			dispatch(fetchProjects());
		}
	}, [dispatch, projectsCount, loading]);
}
