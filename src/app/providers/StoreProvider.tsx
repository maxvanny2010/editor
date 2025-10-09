import { store } from '@/app/store';
import { Provider } from 'react-redux';
import * as React from 'react';

type Props = { children: React.ReactNode };

/** StoreProvider **/
export function StoreProvider({ children }: Props) {
	return <Provider store={store}>{children}</Provider>;
}
