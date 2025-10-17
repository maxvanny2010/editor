import { render } from '@testing-library/react';
import { CreateProjectModal } from '@/features/project-create/model';
import { ProjectModalBase } from '@/entities/project/ui/_shared';
import { vi } from 'vitest';

describe('CreateProjectModal', () => {
	it('renders ProjectModalBase with correct props', () => {
		const onClose = vi.fn();

		render(<CreateProjectModal onClose={onClose} />);

		expect(ProjectModalBase).toHaveBeenCalledWith(
			expect.objectContaining({
				title: 'Create new project',
				buttonLabel: 'Create',
				onClose,
				buildArgs: expect.any(Function),
				onSubmitAction: expect.any(Function),
				'data-testid': 'create-modal',
			}),
			undefined,
		);
	});
});
