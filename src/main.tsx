// src/main.tsx (Vite entry)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { StoreProvider } from '@/app/providers/StoreProvider';
import App from './App'; // или твой корневой компонент

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<StoreProvider>
			<App />
		</StoreProvider>
	</React.StrictMode>,
);
