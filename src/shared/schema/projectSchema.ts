import { z } from 'zod';
import { PROJECT_MESSAGES } from '@/shared/constants';

export const projectSchema = z.object({
	name: z
		.string()
		.min(1, PROJECT_MESSAGES.NAME_EMPTY)
		.max(25, PROJECT_MESSAGES.NAME_REQUEST),

	width: z.coerce
		.number()
		.min(100, PROJECT_MESSAGES.CANVAS_REQUIRED_WIDTH_MIN)
		.max(4000, PROJECT_MESSAGES.CANVAS_REQUIRED_WIDTH_MAX),

	height: z.coerce
		.number()
		.min(100, PROJECT_MESSAGES.CANVAS_REQUIRED_HEIGHT_MIN)
		.max(4000, PROJECT_MESSAGES.CANVAS_REQUIRED_HEIGHT_MAX),
});
