import React from 'react';
import { preventEnterSubmit } from '@/shared/lib/utils';

function makeReactKeyboardEvent(key: string): React.KeyboardEvent<HTMLInputElement> {
	return {
		key,
		preventDefault: vi.fn(),
	} as unknown as React.KeyboardEvent<HTMLInputElement>;
}

describe('preventEnterSubmit', () => {
	it('calls preventDefault on Enter key', () => {
		const event = makeReactKeyboardEvent('Enter');
		preventEnterSubmit(event);
		expect(event.preventDefault).toHaveBeenCalledTimes(1);
	});

	it('does not call preventDefault on other keys', () => {
		const event = makeReactKeyboardEvent('a');
		preventEnterSubmit(event);
		expect(event.preventDefault).not.toHaveBeenCalled();
	});
});
