import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { LayerMenu } from '@/entities/layer/ui/components';

describe('LayerMenu', () => {
	const mockSetOpen = vi.fn();
	const mockRename = vi.fn();
	const mockDelete = vi.fn();

	beforeEach(() => {
		mockSetOpen.mockClear();
		mockRename.mockClear();
		mockDelete.mockClear();
	});

	it('renders menu button and toggles open state', () => {
		render(
			<LayerMenu
				layerId="123"
				isMenuOpen={false}
				setOpenMenuId={mockSetOpen}
				onRenameClick={mockRename}
				onDeleteClick={mockDelete}
			/>,
		);

		const btn = screen.getByRole('button', { name: /layer options menu/i });
		expect(btn).toBeInTheDocument();

		fireEvent.click(btn);
		expect(mockSetOpen).toHaveBeenCalledWith('123');
	});

	it('renders context menu when open', () => {
		render(
			<LayerMenu
				layerId="123"
				isMenuOpen={true}
				setOpenMenuId={mockSetOpen}
				onRenameClick={mockRename}
				onDeleteClick={mockDelete}
			/>,
		);

		expect(screen.getByText(/rename/i)).toBeInTheDocument();
		expect(screen.getByText(/delete/i)).toBeInTheDocument();
	});

	it('closes menu on mouse leave', () => {
		render(
			<LayerMenu
				layerId="123"
				isMenuOpen={true}
				setOpenMenuId={mockSetOpen}
				onRenameClick={mockRename}
				onDeleteClick={mockDelete}
			/>,
		);

		const menu = screen.getByRole('menu');
		fireEvent.mouseLeave(menu);
		expect(mockSetOpen).toHaveBeenCalledWith(null);
	});

	it('calls onRenameClick and onDeleteClick', () => {
		render(
			<LayerMenu
				layerId="123"
				isMenuOpen={true}
				setOpenMenuId={mockSetOpen}
				onRenameClick={mockRename}
				onDeleteClick={mockDelete}
			/>,
		);

		fireEvent.click(screen.getByText(/rename/i));
		expect(mockRename).toHaveBeenCalled();

		fireEvent.click(screen.getByText(/delete/i));
		expect(mockDelete).toHaveBeenCalled();
	});
});
