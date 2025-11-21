import { createProject } from '@/entities/project/model';
import { ProjectModalBase } from '@/entities/project/ui/_shared';

interface Props {
	onClose: () => void;
}

export const CreateProjectModal = ({ onClose }: Props) => (
	<ProjectModalBase
		data-testid="create-modal"
		title="Create new project"
		buttonLabel="Create"
		onClose={onClose}
		showCanvasInputs={true}
		buildArgs={(name, width, height) => ({ name, width, height })}
		onSubmitAction={async (dispatch, args) => {
			await dispatch(createProject(args)).unwrap();
		}}
	/>
);
