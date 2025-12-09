export const BottomFooterSkeleton = () => (
	<div className="absolute bottom-0 left-0 w-full h-14 border-t border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/70 flex items-center justify-center space-x-6">
		{Array.from({ length: 5 }).map((_, i) => (
			<div
				key={i}
				className="w-8 h-8 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"
			/>
		))}
	</div>
);
