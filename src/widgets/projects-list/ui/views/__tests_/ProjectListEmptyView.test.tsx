import { render, screen } from '@testing-library/react';
import { ProjectListEmptyView } from '../index';

describe('ProjectListEmptyView', () => {
	it('renders ProjectEmptyState correctly', () => {
		render(<ProjectListEmptyView />);
		expect(screen.getByTestId('empty-state')).toBeInTheDocument();
	});
});
