import { exportMergedPNG } from './exportMergedPNG';
import type { Project } from '@/shared/types';

export async function handleExportPNG(activeProject: Project) {
	if (!activeProject) return;

	const dataUrl = await exportMergedPNG();
	const fileName = `${activeProject.name}.png`;

	// --- File System Access API (Save As)
	if (typeof window.showSaveFilePicker === 'function') {
		const picker = window.showSaveFilePicker.bind(window);

		const handle = await picker({
			suggestedName: fileName,
			types: [
				{
					description: 'PNG Image',
					accept: { 'image/png': ['.png'] },
				},
			],
		});

		const writable = await handle.createWritable();
		const blob = await (await fetch(dataUrl)).blob();

		await writable.write(blob);
		await writable.close();
		return;
	}

	// --- Fallback (download)
	const link = document.createElement('a');
	link.href = dataUrl;
	link.download = fileName;
	link.click();
}
