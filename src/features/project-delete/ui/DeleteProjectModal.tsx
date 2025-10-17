// src/features/project-delete/model/DeleteProjectModal.tsx
import { deleteProject } from '@/entities/project/model';
import { ProjectModalBase } from '@/entities/project/ui/_shared';

interface Props {
	projectId: string;
	projectName: string;
	onClose: () => void;
}

export const DeleteProjectModal = ({ projectId, projectName, onClose }: Props) => (
	<ProjectModalBase
		title="Delete project"
		buttonLabel="Delete"
		onClose={onClose}
		showInput={false}
		customContent={
			<div className="space-y-1">
				<p>
					Are you sure you want to delete project{' '}
					<span className="font-semibold text-gray-900">“{projectName}”</span>?
				</p>
				<p>This action cannot be undone.</p>
			</div>
		}
		buildArgs={() => ({ id: projectId })}
		onSubmitAction={async (dispatch) => {
			await dispatch(deleteProject(projectId)).unwrap();
		}}
	/>
);
