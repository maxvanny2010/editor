import type { LucideIcon } from 'lucide-react';
import React from 'react';

interface Props {
	label: string;
	IconComponent?: LucideIcon;
	onClick: () => void;
	divider?: boolean;
	colorClass?: string;
}

export const TopMenuItemButton = React.memo(function TopMenuItemButton({
	label,
	IconComponent,
	onClick,
	divider,
	colorClass = 'text-gray-700',
}: Props) {
	if (divider) {
		return <div className="my-2 h-[1px] bg-gray-200 mx-2" />;
	}

	return (
		<button
			onClick={onClick}
			className="
				w-full flex items-center gap-2
				px-3 py-1.5 text-left text-sm
				hover:bg-gray-100 transition
				text-gray-800 cursor-pointer
			"
		>
			{IconComponent && (
				<IconComponent className={`w-4 h-4 ${colorClass}`} strokeWidth={2} />
			)}

			{label}
		</button>
	);
});
