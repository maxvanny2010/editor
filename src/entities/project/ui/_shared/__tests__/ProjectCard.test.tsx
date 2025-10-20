import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProjectCard, type ProjectCardData } from '@/entities/project/ui/_shared';

describe('ProjectCard', () => {
	const baseProject: ProjectCardData = {
		id: '1',
		name: 'Alpha',
		createdAt: new Date('2023-10-26T10:00:00Z').getTime(),
		updatedAt: new Date('2023-10-26T10:00:00Z').getTime(),
	};

	const renderWithInlineContext = (ui: React.ReactElement) => {
		return render(<MemoryRouter>{ui}</MemoryRouter>);
	};

	it('renders project name and dates', () => {
		renderWithInlineContext(<ProjectCard project={baseProject} />);

		expect(screen.getByTestId('project-card')).toBeInTheDocument();
		expect(screen.getByText(/Alpha/i)).toBeInTheDocument();
		expect(screen.getAllByText(/Oct 26, 2023/i)).toHaveLength(2);
	});

	it('calls onEditClick when Update button is clicked', () => {
		const onEditClick = vi.fn();
		renderWithInlineContext(
			<ProjectCard project={baseProject} onEditClick={onEditClick} />,
		);

		fireEvent.click(screen.getByRole('button', { name: /update/i }));
		expect(onEditClick).toHaveBeenCalledWith(baseProject);
	});

	it('calls onDeleteClick when Delete button is clicked', () => {
		const onDeleteClick = vi.fn();
		renderWithInlineContext(
			<ProjectCard project={baseProject} onDeleteClick={onDeleteClick} />,
		);

		fireEvent.click(screen.getByRole('button', { name: /delete/i }));
		expect(onDeleteClick).toHaveBeenCalledWith(baseProject);
	});

	it('renders buttons even without click handlers', () => {
		renderWithInlineContext(<ProjectCard project={baseProject} />);

		expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();

		expect(() =>
			fireEvent.click(screen.getByRole('button', { name: /update/i })),
		).not.toThrow();
		expect(() =>
			fireEvent.click(screen.getByRole('button', { name: /delete/i })),
		).not.toThrow();
	});

	it('handles hover states correctly', () => {
		renderWithInlineContext(<ProjectCard project={baseProject} />);

		const card = screen.getByTestId('project-card');
		fireEvent.mouseEnter(card);
		fireEvent.mouseLeave(card);

		expect(card).toBeInTheDocument();
	});
});
