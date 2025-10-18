import { z } from 'zod';
import { PROJECT_MESSAGES } from '@/shared/constants';

const numericString = (field: 'width' | 'height') =>
	z.preprocess(
		(val) => {
			if (typeof val === 'string') {
				if (!/^\d+$/.test(val)) return NaN;
				if (/^0\d+/.test(val)) return NaN;
				return Number(val);
			}
			return val;
		},
		z
			.number()
			.min(
				100,
				field === 'width'
					? PROJECT_MESSAGES.CANVAS_REQUIRED_WIDTH_MIN
					: PROJECT_MESSAGES.CANVAS_REQUIRED_HEIGHT_MIN,
			)
			.max(
				4000,
				field === 'width'
					? PROJECT_MESSAGES.CANVAS_REQUIRED_WIDTH_MAX
					: PROJECT_MESSAGES.CANVAS_REQUIRED_HEIGHT_MAX,
			),
	);

export const projectSchema = z.object({
	name: z
		.string()
		.min(1, PROJECT_MESSAGES.NAME_EMPTY)
		.max(25, PROJECT_MESSAGES.NAME_REQUEST),
	width: numericString('width'),
	height: numericString('height'),
});
