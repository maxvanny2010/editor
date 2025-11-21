import React from 'react';

interface ModalContainerProps {
	children: React.ReactNode;
	'data-testid'?: string;
}

export function ModalContainer({ children, 'data-testid': testId }: ModalContainerProps) {
	return (
		<div
			role="dialog"
			aria-modal="true"
			data-testid={testId}
			className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
		>
			{children}
		</div>
	);
}
