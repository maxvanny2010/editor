import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TopMenu } from '@/widgets/top-menu';

describe('TopMenu', () => {
	const newFn = vi.fn();
	const saveFn = vi.fn();
	const exportFn = vi.fn();

	function renderMenu() {
		return render(
			<BrowserRouter>
				<TopMenu
					onNewProject={newFn}
					onSaveProject={saveFn}
					onExportPng={exportFn}
				/>
			</BrowserRouter>,
		);
	}

	it('renders main tabs', () => {
		renderMenu();
		expect(screen.getByText('file')).toBeInTheDocument();
		expect(screen.getByText('projects')).toBeInTheDocument();
	});

	it('opens menu when tab clicked', () => {
		renderMenu();
		fireEvent.click(screen.getByText('file'));

		expect(screen.getByText('New Project')).toBeInTheDocument();
	});

	it('calls onNewProject', () => {
		renderMenu();
		fireEvent.click(screen.getByText('file'));
		fireEvent.click(screen.getByText('New Project'));
		expect(newFn).toHaveBeenCalledTimes(1);
	});

	it('closes menu on blur', () => {
		renderMenu();

		const tab = screen.getByText('file');
		fireEvent.click(tab);
		expect(screen.getByText('New Project')).toBeInTheDocument();

		fireEvent.blur(tab);
		expect(screen.queryByText('New Project')).toBeNull();
	});
});
