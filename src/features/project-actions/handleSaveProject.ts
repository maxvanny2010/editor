import { projectService } from '@/entities/project/model/project.service';
import { exportMergedPNG } from '@/features/project-actions';
import { upsertProject } from '@/entities/project/model';
import type { Project } from '@/shared/types';
import type { AppDispatch } from '@/store';

export async function handleSaveProject(dispatch: AppDispatch, activeProject: Project) {
	if (!activeProject) return;

	const preview = await exportMergedPNG();

	// Save to the Dexie
	const updated = await projectService.updateProject({
		id: activeProject.id,
		changes: { snapshot: preview },
	});

	// update in the Redux
	dispatch(upsertProject(updated));
}
