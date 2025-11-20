import { fireEvent, screen } from '@testing-library/react';
import { renderWithStore } from '@/test-utils';
import { HistoryPanel } from '@/entities/history/ui';
import * as historySlice from '@/entities/history/model/slice';

const mockStack = [
	{
		id: '1',
		label: 'Create Layer',
		state: {
			projectId: 'p1',
			layers: [],
			activeTool: null,
			viewport: { scale: 1, offsetX: 0, offsetY: 0 },
		},
		timestamp: 1,
		toolType: 'brush' as const,
	},
	{
		id: '2',
		label: 'Draw Circle',
		state: {
			projectId: 'p1',
			layers: [],
			activeTool: 'shape' as const,
			viewport: { scale: 1, offsetX: 0, offsetY: 0 },
		},
		timestamp: 2,
		toolType: 'shape' as const,
		shapeType: 'circle' as const,
	},
];

describe('HistoryPanel', () => {
	it('renders nothing when closed', () => {
		const { container } = renderWithStore(<HistoryPanel open={false} />, {
			initialState: {
				history: { stack: [], currentIndex: -1, isPreview: false },
			},
		});
		expect(container.firstChild).toBeNull();
	});

	it('renders list of history items', () => {
		renderWithStore(<HistoryPanel open={true} />, {
			initialState: {
				history: { stack: mockStack, currentIndex: 1, isPreview: false },
			},
		});

		expect(screen.getByText('History')).toBeInTheDocument();
		expect(screen.getByText('Create Layer')).toBeInTheDocument();
		expect(screen.getByText('Draw Circle')).toBeInTheDocument();
	});

	it('dispatches jumpTo on click', () => {
		const spy = vi.spyOn(historySlice, 'jumpTo');

		renderWithStore(<HistoryPanel open={true} />, {
			initialState: {
				history: { stack: mockStack, currentIndex: 1, isPreview: false },
			},
		});

		fireEvent.click(screen.getByText('Create Layer'));
		expect(spy).toHaveBeenCalled();

		spy.mockRestore();
	});
});
