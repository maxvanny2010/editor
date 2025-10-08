import { beforeEach, describe, expect, it } from 'vitest';
import { Provider, useSelector } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import {
	createProject,
	makeSelectors,
	projectsReducer,
} from '@/entities/project/model/slice.ts';
import { db } from '@/shared/lib/db/dexie.ts';
import { useAppDispatch } from '../hooks';

const storeFactory = () =>
	configureStore({
		reducer: { projects: projectsReducer },
	});

type TestState = ReturnType<ReturnType<typeof storeFactory>['getState']>;

const selectors = makeSelectors<TestState>((s) => s.projects);

function ProjectsList() {
	const items = useSelector(selectors.selectAll);
	return (
		<ul data-testid="list">
			{items.map((p) => (
				<li key={p.id}>{p.name}</li>
			))}
		</ul>
	);
}

function CreateButton() {
	const dispatch = useAppDispatch();
	return (
		<button onClick={() => dispatch(createProject({ name: 'UI-Demo' }))}>
			create
		</button>
	);
}

describe('Provider integration', () => {
	beforeEach(async () => {
		await db.projects.clear();
	});

	it('dispatch через UI обновляет DOM', async () => {
		const store = storeFactory();

		render(
			<Provider store={store}>
				<CreateButton />
				<ProjectsList />
			</Provider>,
		);

		fireEvent.click(screen.getByText('create'));
		expect(await screen.findByText('UI-Demo')).toBeInTheDocument();
	});
});
