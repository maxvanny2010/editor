import { deleteProject } from '@/entities/project/model';
import { ProjectModalBase } from '@/entities/project/ui/_shared';
import { UI_LABELS } from '@/shared/constants';

interface Props {
	projectId: string;
	projectName: string;
	onClose: () => void;
}

export const DeleteProjectModal = ({ projectId, projectName, onClose }: Props) => (
	<ProjectModalBase
		data-testid="delete-modal"
		title={UI_LABELS.MODAL_DELETE}
		buttonLabel={UI_LABELS.MODAL_DELETE_BUTTON}
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
		onSubmitAction={async (dispatch, args) => {
			await dispatch(deleteProject(args.id)).unwrap();
		}}
	/>
);
