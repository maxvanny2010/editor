import { render, screen } from '@testing-library/react';
import { ProjectListSkeletonView } from '../index';

describe('ProjectListSkeletonView', () => {
	it('renders 12 skeleton items', () => {
		render(<ProjectListSkeletonView />);
		expect(screen.getAllByTestId('skeleton')).toHaveLength(12);
	});
});
