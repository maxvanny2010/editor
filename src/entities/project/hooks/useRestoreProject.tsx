import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '@/store';
import { PROJECT_PATHS } from '@/shared/constants';
import { activeProjectService } from '@/entities/settings/model';

export function useRestoreProject(dispatch: AppDispatch, projectId: string | undefined) {
	const navigate = useNavigate();
	const attempted = useRef(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (attempted.current) return;
		attempted.current = true;

		const restoreProject = async () => {
			const ok = await activeProjectService.restoreIntoEditor(dispatch, projectId);

			if (!ok) {
				navigate(PROJECT_PATHS.HOME, { state: { noProject: true } });
				return;
			}

			setLoading(false);
		};

		restoreProject().then((r) => r);
	}, [dispatch, projectId, navigate]);

	return loading;
}
