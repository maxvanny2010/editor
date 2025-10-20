import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PROJECT_PATHS } from '@/shared/constants';
import { EditorPage } from '@/pages/model';
import HomePage from '@/pages/home';

export const App = () => (
	<BrowserRouter>
		<Routes>
			<Route path={PROJECT_PATHS.HOME} element={<HomePage />} />
			<Route path={`${PROJECT_PATHS.EDITOR}/:id`} element={<EditorPage />} />
		</Routes>
	</BrowserRouter>
);
