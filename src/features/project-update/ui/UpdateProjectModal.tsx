import { updateProject } from '@/entities/project/model';
import { ProjectModalBase } from '@/entities/project/ui/_shared';

interface Props {
	projectId: string;
	initialName: string;
	onClose: () => void;
}

export const UpdateProjectModal = ({ projectId, initialName, onClose }: Props) => (
	<ProjectModalBase
		title="Update project name"
		buttonLabel="Update"
		onClose={onClose}
		initialValue={initialName}
		buildArgs={(name) => ({ id: projectId, changes: { name } })}
		onSubmitAction={async (dispatch, args) => {
			await dispatch(updateProject(args)).unwrap();
		}}
	/>
);
