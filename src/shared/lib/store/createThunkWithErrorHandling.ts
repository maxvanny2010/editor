import { createAsyncThunk } from '@reduxjs/toolkit';
import { PROJECT_MESSAGES } from '@/shared/constants';

const handleError = (e: unknown): string =>
	e instanceof Error ? e.message : PROJECT_MESSAGES.ERROR_ACTION;

export const createThunkWithErrorHandling = <Returned, ThunkArg>(
	action: string,
	payload: (arg: ThunkArg) => Promise<Returned>,
) =>
	createAsyncThunk<Returned, ThunkArg, { rejectValue: string }>(
		action,
		async (arg, { rejectWithValue }) => {
			try {
				return await payload(arg);
			} catch (e) {
				return rejectWithValue(handleError(e));
			}
		},
	);
