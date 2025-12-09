import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { ApplySnapshotButton, ExitPreviewButton } from '@/shared/ui/buttons';
import { selectHistoryIsPreview } from '@/entities/history/model';

export const PreviewOverlay = React.memo(function PreviewOverlay() {
	const isPreview = useAppSelector(selectHistoryIsPreview);

	if (!isPreview) return null;

	return (
		<div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-100 border border-amber-300 text-amber-800 px-4 py-2 rounded shadow-md z-[9999] flex items-center gap-4">
			<span className="font-medium">Viewing historical snapshot</span>
			<ApplySnapshotButton />
			<ExitPreviewButton />
		</div>
	);
});
