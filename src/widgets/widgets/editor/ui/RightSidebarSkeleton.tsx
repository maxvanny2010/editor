export const RightSidebarSkeleton = () => (
	<div className="absolute right-0 top-0 h-full w-60 border-l border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/70">
		<div className="p-4 space-y-3 animate-pulse">
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					key={i}
					className="h-6 w-full rounded-md bg-gray-200 dark:bg-gray-700"
				/>
			))}
		</div>
	</div>
);
