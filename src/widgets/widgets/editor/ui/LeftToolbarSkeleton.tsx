export const LeftToolbarSkeleton = () => (
	<div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col gap-3">
		{Array.from({ length: 5 }).map((_, i) => (
			<div
				key={i}
				className="w-12 h-12 rounded-xl bg-gray-200/70 dark:bg-gray-700/70 animate-pulse"
			/>
		))}
	</div>
);
