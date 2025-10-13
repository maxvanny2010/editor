import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useSelector } from 'react-redux';
import { db } from '@/shared/lib/db/dexie';
import { createProject, makeSelectors } from '@/entities/project/model/slice';
import { TestStoreProvider } from '@/test-utils';
import { useAppDispatch } from '@/store/hooks';
import { store } from '@/store';

type TestState = ReturnType<typeof store.getState>;
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

describe('TestStoreProvider integration', () => {
	beforeEach(async () => {
		await db.projects.clear();
	});

	it('renders empty list initially', () => {
		render(
			<TestStoreProvider>
				<ProjectsList />
			</TestStoreProvider>,
		);
		expect(screen.getByTestId('list').children).toHaveLength(0);
	});

	it('dispatch through UI updates DOM', async () => {
		render(
			<TestStoreProvider>
				<CreateButton />
				<ProjectsList />
			</TestStoreProvider>,
		);

		fireEvent.click(screen.getByText('create'));
		expect(await screen.findByText('UI-Demo')).toBeInTheDocument();
	});

	it('store state updates after dispatch', async () => {
		render(
			<TestStoreProvider>
				<CreateButton />
				<ProjectsList />
			</TestStoreProvider>,
		);

		fireEvent.click(screen.getByText('create'));
		const item = await screen.findByText('UI-Demo');
		expect(item).toBeInTheDocument();
	});
});
