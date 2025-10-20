import React from 'react';

export function preventEnterSubmit(e: React.KeyboardEvent<HTMLInputElement>) {
	if (e.key === 'Enter') {
		e.preventDefault();
	}
}
