import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { makeTestStore, type TestRootState } from './testStore';

export const useTestDispatch = () =>
	useDispatch<ReturnType<typeof makeTestStore>['dispatch']>();

export const useTestSelector: TypedUseSelectorHook<TestRootState> = useSelector;
