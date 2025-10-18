import { PROJECT_MESSAGES } from '@/shared/constants';
import { z } from 'zod';

export const projectNameSchema = z
	.string()
	.trim()
	.min(1, PROJECT_MESSAGES.NAME_EMPTY)
	.max(25, PROJECT_MESSAGES.NAME_REQUEST);
