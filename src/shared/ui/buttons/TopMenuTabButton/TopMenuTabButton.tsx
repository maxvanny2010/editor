import React from 'react';

interface TopMenuTabButtonProps {
	label: string;
	onClick: () => void;
	isActive: boolean;
}

export const TopMenuTabButton = React.memo(function TopMenuTabButton({
	label,
	onClick,
	isActive,
}: TopMenuTabButtonProps) {
	return (
		<button
			onClick={onClick}
			className={`
				text-sm font-medium capitalize
				transition cursor-pointer select-none
				${isActive ? 'text-indigo-600' : 'hover:text-indigo-600 text-gray-800'}
			`}
		>
			{label}
		</button>
	);
});
