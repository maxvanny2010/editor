import { CanvasSkeleton } from './CanvasSkeleton';
import { LeftToolbarSkeleton } from './LeftToolbarSkeleton';
import { RightSidebarSkeleton } from './RightSidebarSkeleton';
import { BottomFooterSkeleton } from './BottomFooterSkeleton';

export const EditorSkeleton = () => (
	<div className="relative h-screen w-screen flex bg-gray-100 dark:bg-gray-900 overflow-hidden">
		<LeftToolbarSkeleton />
		<CanvasSkeleton />
		<RightSidebarSkeleton />
		<BottomFooterSkeleton />
	</div>
);
