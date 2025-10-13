import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useSelector } from 'react-redux';
import { db } from '@/shared/lib/db/dexie';
import type { Project } from '@/shared/types';
import { makeSelectors } from '@/shared/lib/store';
import { makeTestStore } from '@/test-utils/testStore';
import { createProject } from '@/entities/project/model';
import { TestStoreProvider, useTestDispatch } from '@/test-utils';

type RootState = ReturnType<ReturnType<typeof makeTestStore>['getState']>;
const selectors = makeSelectors<RootState, Project>((s) => s.projects); // 👈 исправлено

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
	const dispatch = useTestDispatch();
	return (
		<button onClick={() => dispatch(createProject({ name: 'UI-Demo' }))}>
			create
		</button>
	);
}

describe('Integration: Redux + Dexie + React', () => {
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

	it('state updates reflect immediately in the DOM', async () => {
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
