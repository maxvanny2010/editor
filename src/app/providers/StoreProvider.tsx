// src/app/providers/StoreProvider.tsx
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import React from 'react';

type Props = { children: React.ReactNode };

export function StoreProvider({ children }: Props) {
	return <Provider store={store}>{children}</Provider>;
}
