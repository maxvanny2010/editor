import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProjects } from '@/entities/project/model/slice';
import { PROJECT_STATE } from '@/shared/constants';
import { projectsSelectors } from '@/entities/project/model';

export function useFetchProjectsOnMount(projectsCount: number) {
	const dispatch = useAppDispatch();
	const loading = useAppSelector(projectsSelectors.selectLoading);

	useEffect(() => {
		if (!projectsCount && loading === PROJECT_STATE.IDLE) {
			dispatch(fetchProjects());
		}
	}, [dispatch, projectsCount, loading]);
}
