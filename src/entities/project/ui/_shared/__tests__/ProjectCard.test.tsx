import { fireEvent, screen, render } from '@testing-library/react';
import { ProjectCard, type ProjectCardData } from '@/entities/project/ui';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import React from 'react'; // Added explicit import for context

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
		expect(screen.getAllByText(/Oct 26, 2023/i).length).toBe(2);
	});

	it('calls onEditClick when edit button is clicked', () => {
		const onEditClick = vi.fn();
		renderWithInlineContext(
			<ProjectCard project={baseProject} onEditClick={onEditClick} />,
		);

		const editButton = screen.getByRole('button', { name: /update/i });
		fireEvent.click(editButton);

		expect(onEditClick).toHaveBeenCalledWith(baseProject);
	});

	it('handles hover state visually', () => {
		renderWithInlineContext(<ProjectCard project={baseProject} />);

		const card = screen.getByTestId('project-card');
		fireEvent.mouseEnter(card);
		expect(card).toBeInTheDocument();

		fireEvent.mouseLeave(card);
		expect(card).toBeInTheDocument();
	});

	it('renders with Update button when onEditClick provided', () => {
		const onEditClick = vi.fn();
		renderWithInlineContext(
			<ProjectCard project={baseProject} onEditClick={onEditClick} />,
		);

		const button = screen.getByRole('button', { name: /update/i });
		expect(button).toBeInTheDocument();

		fireEvent.click(button);
		expect(onEditClick).toHaveBeenCalled();
	});

	it('renders Update button even without onEditClick but does nothing on click', () => {
		renderWithInlineContext(<ProjectCard project={baseProject} />);

		const button = screen.getByRole('button', { name: /update/i });
		expect(button).toBeInTheDocument();

		expect(() => fireEvent.click(button)).not.toThrow();
	});

	it('handles hover state of edit button', () => {
		const onEditClick = vi.fn();
		renderWithInlineContext(
			<ProjectCard project={baseProject} onEditClick={onEditClick} />,
		);

		const button = screen.getByRole('button', { name: /update/i });
		fireEvent.mouseEnter(button);
		fireEvent.mouseLeave(button);

		expect(button).toBeInTheDocument();
	});
});
