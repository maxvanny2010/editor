type ViewportButtonProps = {
	label: string;
	onClick: () => void;
	active?: boolean;
	testId?: string;
};

export const ViewportButton = ({
	label,
	onClick,
	active,
	testId,
}: ViewportButtonProps) => (
	<button
		type="button"
		data-testid={testId}
		onClick={onClick}
		className={`px-2 py-1 rounded-md transition text-sm font-medium
			${
				active
					? 'bg-indigo-200 dark:bg-indigo-700 text-indigo-900 dark:text-white'
					: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200'
			}`}
	>
		{label}
	</button>
);
