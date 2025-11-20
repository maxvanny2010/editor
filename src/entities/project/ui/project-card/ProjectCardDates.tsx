import { ClockIcon } from './ClockIcon';
import React from 'react';

interface ProjectCardDatesProps {
	createdAt: number | string;
	updatedAt: number | string;
}

export const ProjectCardDates = React.memo(function ProjectCardDates({
	createdAt,
	updatedAt,
}: ProjectCardDatesProps) {
	const formatDate = (value: number | string) => {
		const date = new Date(value);
		return {
			date: date.toLocaleDateString(undefined, {
				day: '2-digit',
				month: 'short',
				year: 'numeric',
			}),
			time: date.toLocaleTimeString(undefined, {
				hour: '2-digit',
				minute: '2-digit',
			}),
			raw: date,
		};
	};

	const created = formatDate(createdAt);
	const updated = formatDate(updatedAt);

	return (
		<div className="space-y-2 text-xs text-gray-500">
			<div className="flex items-center gap-2">
				<ClockIcon date={created.raw} />
				<p>
					<span className="font-medium text-gray-800">Created:</span>{' '}
					{created.date} <span className="text-gray-400">• {created.time}</span>
				</p>
			</div>

			<div className="flex items-center gap-2">
				<ClockIcon date={updated.raw} />
				<p>
					<span className="font-medium text-gray-800">Updated:</span>{' '}
					{updated.date} <span className="text-gray-400">• {updated.time}</span>
				</p>
			</div>
		</div>
	);
});
