import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PROJECT_MESSAGES } from '@/shared/constants';
import { ModalInputs } from '@/entities/project/ui/modal';

describe('ModalInputs', () => {
	it('renders project name and canvas size inputs when showInput=true', () => {
		render(
			<ModalInputs
				showInput
				showCanvasInputs
				customContent={null}
				name="Test Project"
				width={800}
				height={600}
				error={null}
				setName={vi.fn()}
				setWidth={vi.fn()}
				setHeight={vi.fn()}
			/>,
		);

		expect(screen.getByLabelText('Project name')).toBeInTheDocument();
		expect(screen.getByTestId('project-input')).toHaveValue('Test Project');
		expect(screen.getByTestId('canvas-width')).toHaveValue(800);
		expect(screen.getByTestId('canvas-height')).toHaveValue(600);
	});

	it('renders custom content when showInput=false', () => {
		render(
			<ModalInputs
				showInput={false}
				showCanvasInputs={false}
				customContent={<div data-testid="custom">Custom Content</div>}
				name=""
				width={0}
				height={0}
				error={null}
				setName={vi.fn()}
				setWidth={vi.fn()}
				setHeight={vi.fn()}
			/>,
		);

		expect(screen.getByTestId('custom')).toHaveTextContent('Custom Content');
	});

	it('calls setters on input change', () => {
		const setName = vi.fn();
		const setWidth = vi.fn();
		const setHeight = vi.fn();

		render(
			<ModalInputs
				showInput
				showCanvasInputs
				customContent={null}
				name=""
				width={800}
				height={600}
				error={null}
				setName={setName}
				setWidth={setWidth}
				setHeight={setHeight}
			/>,
		);

		fireEvent.change(screen.getByTestId('project-input'), {
			target: { value: 'New Name' },
		});
		expect(setName).toHaveBeenCalledWith('New Name');

		fireEvent.change(screen.getByTestId('canvas-width'), {
			target: { value: '1024' },
		});
		expect(setWidth).toHaveBeenCalledWith(1024);

		fireEvent.change(screen.getByTestId('canvas-height'), {
			target: { value: '768' },
		});
		expect(setHeight).toHaveBeenCalledWith(768);
	});

	it('shows error message when error is provided', () => {
		render(
			<ModalInputs
				showInput
				showCanvasInputs={false}
				customContent={null}
				name=""
				width={800}
				height={600}
				error="Validation failed"
				setName={vi.fn()}
				setWidth={vi.fn()}
				setHeight={vi.fn()}
			/>,
		);

		expect(screen.getByRole('alert')).toHaveTextContent(
			PROJECT_MESSAGES.ERROR_VALIDATION,
		);
	});
});
