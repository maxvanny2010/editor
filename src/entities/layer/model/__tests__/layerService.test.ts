import { db } from '@/shared/lib/db/dexie';
import { layerRepository } from '@/entities/layer/api';
import { layerService } from '@/entities/layer/model';
import { LAYER } from '@/shared/constants';

describe('layerService', () => {
	beforeEach(async () => {
		await db.layers.clear();
	});

	it('creates layer with sequential name', async () => {
		const projectId = 'proj1';

		const l1 = await layerService.createLayer({ projectId });
		const l2 = await layerService.createLayer({ projectId });

		expect(l1.name).toBe(`${LAYER.NEW_LAYER} ${1}`);
		expect(l2.name).toBe(`${LAYER.NEW_LAYER} ${2}`);

		const all = await layerRepository.getAllByProject(projectId);
		expect(all.length).toBe(2);
	});

	it('respects custom name if provided', async () => {
		const layer = await layerService.createLayer({
			projectId: 'p2',
			name: 'Custom',
		});
		expect(layer.name).toBe('Custom');
	});

	it('updateLayer changes properties and returns updated', async () => {
		const projectId = 'p3';
		const original = await layerService.createLayer({ projectId });

		const updated = await layerService.updateLayer({
			id: original.id,
			changes: { name: 'Renamed' },
		});

		expect(updated.name).toBe('Renamed');
	});

	it('deleteLayer removes from db', async () => {
		const projectId = 'p4';
		const layer = await layerService.createLayer({ projectId });

		await layerService.deleteLayer(layer.id);
		const found = await layerRepository.getById(layer.id);
		expect(found).toBeUndefined();
	});
	it('creates unique numbered layers even after deletions', async () => {
		const pid = 'proj5';
		await layerService.createLayer({ projectId: pid });
		await layerService.createLayer({ projectId: pid });

		const layersBefore = await layerRepository.getAllByProject(pid);
		await layerService.deleteLayer(layersBefore[0].id);

		const l3 = await layerService.createLayer({ projectId: pid });
		expect(l3.name).toBe(`${LAYER.NEW_LAYER} ${3}`);
	});
});
