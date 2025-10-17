import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithStore } from '@/test-utils';
import { ProjectListCardsView } from '../ProjectListCardsView';

beforeAll(() => {
	vi.unmock('@/entities/project/ui/_shared');
});

describe('ProjectListCardsView', () => {
	const mockProjects = [{ id: '1', name: 'Alpha', createdAt: 1, updatedAt: 1 }];

	it('renders project cards', () => {
		renderWithStore(<ProjectListCardsView projects={mockProjects} />);
		expect(screen.getByTestId('project-card')).toBeInTheDocument();
	});

	it('renders and closes UpdateProjectModal after clicking update button', async () => {
		renderWithStore(<ProjectListCardsView projects={mockProjects} />);

		fireEvent.click(screen.getByTestId('update-button-1'));

		await waitFor(() =>
			expect(screen.getByTestId('update-modal')).toBeInTheDocument(),
		);

		fireEvent.click(screen.getByText('Cancel'));

		await waitFor(() =>
			expect(screen.queryByTestId('update-modal')).not.toBeInTheDocument(),
		);
	});

	it('renders and closes DeleteProjectModal after clicking delete button', async () => {
		renderWithStore(<ProjectListCardsView projects={mockProjects} />);

		fireEvent.click(screen.getByTestId('delete-button-1'));

		await waitFor(() =>
			expect(screen.getByTestId('delete-modal')).toBeInTheDocument(),
		);

		fireEvent.click(screen.getByText('Cancel'));

		await waitFor(() =>
			expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument(),
		);
	});
});
