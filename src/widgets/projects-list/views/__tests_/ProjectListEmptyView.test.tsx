import { render, screen } from '@testing-library/react';
import { ProjectListEmptyView } from '../ProjectListEmptyView';

beforeAll(() => {
	vi.unmock('@/entities/project/ui/_shared');
});
describe('ProjectListEmptyView', () => {
	it('renders ProjectEmptyState correctly', () => {
		render(<ProjectListEmptyView />);
		expect(screen.getByTestId('empty-state')).toBeInTheDocument();
	});
});
