import { updateProject } from '@/entities/project/model';
import { ProjectModalBase } from '@/entities/project/ui/_shared';
import { UI_LABELS } from '@/shared/constants';

interface Props {
	projectId: string;
	initialName: string;
	onClose: () => void;
}

export const UpdateProjectModal = ({ projectId, initialName, onClose }: Props) => (
	<ProjectModalBase
		data-testid="update-modal"
		title={UI_LABELS.MODAL_UPDATE}
		buttonLabel={UI_LABELS.MODAL_UPDATE_BUTTON}
		onClose={onClose}
		initialValue={initialName}
		buildArgs={(name) => ({ id: projectId, changes: { name } })}
		onSubmitAction={async (dispatch, args) => {
			await dispatch(updateProject(args)).unwrap();
		}}
	/>
);
