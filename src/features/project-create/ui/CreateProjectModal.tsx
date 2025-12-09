import { createProject } from '@/entities/project/model';
import { ProjectModalBase } from '@/entities/project/ui/_shared';
import { UI_LABELS } from '@/shared/constants';

interface Props {
	onClose: () => void;
}

export const CreateProjectModal = ({ onClose }: Props) => (
	<ProjectModalBase
		data-testid="create-modal"
		title={UI_LABELS.MODAL_CREATE}
		buttonLabel={UI_LABELS.MODAL_CREATE_BUTTON}
		onClose={onClose}
		showCanvasInputs={true}
		buildArgs={(name, width, height) => ({ name, width, height })}
		onSubmitAction={async (dispatch, args) => {
			await dispatch(createProject(args)).unwrap();
		}}
	/>
);
