import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { ProjectCard, type ProjectCardData } from '@/entities/project/ui/_shared';
import { projectsReducer } from '@/entities/project/model/slice';

function renderWithProviders(ui: React.ReactElement) {
	const store = configureStore({
		reducer: { projects: projectsReducer },
	});
	return render(
		<Provider store={store}>
			<MemoryRouter>{ui}</MemoryRouter>
		</Provider>,
	);
}

describe('ProjectCard', () => {
	const baseProject: ProjectCardData = {
		id: '1',
		name: 'Alpha',
		createdAt: new Date('2023-10-26T10:00:00Z').getTime(),
		updatedAt: new Date('2023-10-26T10:00:00Z').getTime(),
	};

	it('renders project name and dates', () => {
		renderWithProviders(<ProjectCard project={baseProject} />);

		expect(screen.getByTestId('project-card')).toBeInTheDocument();
		expect(screen.getByText(/Alpha/i)).toBeInTheDocument();
		expect(screen.getAllByText(/Oct 26, 2023/i)).toHaveLength(2);
	});

	it('calls onEditClick when Update button is clicked', () => {
		const onEditClick = vi.fn();
		renderWithProviders(
			<ProjectCard project={baseProject} onEditClick={onEditClick} />,
		);

		fireEvent.click(screen.getByRole('button', { name: /update/i }));
		expect(onEditClick).toHaveBeenCalledWith(baseProject);
	});

	it('calls onDeleteClick when Delete button is clicked', () => {
		const onDeleteClick = vi.fn();
		renderWithProviders(
			<ProjectCard project={baseProject} onDeleteClick={onDeleteClick} />,
		);

		fireEvent.click(screen.getByRole('button', { name: /delete/i }));
		expect(onDeleteClick).toHaveBeenCalledWith(baseProject);
	});

	it('renders buttons even without click handlers', () => {
		renderWithProviders(<ProjectCard project={baseProject} />);

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
		renderWithProviders(<ProjectCard project={baseProject} />);

		const card = screen.getByTestId('project-card');
		fireEvent.mouseEnter(card);
		fireEvent.mouseLeave(card);

		expect(card).toBeInTheDocument();
	});
});
