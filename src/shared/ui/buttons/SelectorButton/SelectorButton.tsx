import React from 'react';

interface SelectorButtonProps {
	testId: string;
	selected: boolean;
	onClick: () => void;
	children: React.ReactNode;
	className?: string;
}

export const SelectorButton = React.memo(function SelectorButton({
	testId,
	selected,
	onClick,
	children,
	className = '',
}: SelectorButtonProps) {
	return (
		<button
			data-testid={testId}
			onClick={onClick}
			className={`relative grid place-items-center rounded-full border border-gray-200 bg-white p-1
                hover:bg-gray-50 transition shrink-0
                ${selected ? 'ring-2 ring-offset-1 ring-indigo-400' : ''}
                ${className}`}
		>
			{children}
		</button>
	);
});
