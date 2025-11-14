import React, { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { projectSchema } from '@/shared/schema';
import { PROJECT_MESSAGES } from '@/shared/constants';
import {
	ModalActions,
	ModalContainer,
	ModalForm,
	ModalInputs,
} from '@/entities/project/ui/modal';

interface ProjectModalBaseProps<TArgs extends Record<string, unknown>> {
	title: string;
	buttonLabel: string;
	onClose: () => void;
	onSubmitAction: (
		dispatch: ReturnType<typeof useAppDispatch>,
		args: TArgs,
	) => Promise<void>;
	initialValue?: string;
	buildArgs: (name: string, width: number, height: number) => TArgs;
	disableAutoClose?: boolean;
	showInput?: boolean;
	showCanvasInputs?: boolean;
	customContent?: React.ReactNode;
	'data-testid'?: string;
}
/**
 * Base modal layout for project operations (Create / Update / Delete)
 * Handles validation, async dispatching, error feedback and visuals.
 */
export function ProjectModalBase<TArgs extends Record<string, unknown>>({
	title,
	buttonLabel,
	onClose,
	onSubmitAction,
	initialValue = '',
	buildArgs,
	showInput = true,
	showCanvasInputs = false,
	customContent,
	'data-testid': testId,
}: ProjectModalBaseProps<TArgs>) {
	const dispatch = useAppDispatch();

	const [name, setName] = useState(initialValue);
	const [width, setWidth] = useState(800);
	const [height, setHeight] = useState(600);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);

		if (showInput || showCanvasInputs) {
			const validation = projectSchema.safeParse({ name, width, height });
			if (!validation.success) {
				setError(
					validation.error.issues[0]?.message ??
						PROJECT_MESSAGES.ERROR_VALIDATION,
				);
				return;
			}
		}

		try {
			setLoading(true);
			await onSubmitAction(dispatch, buildArgs(name, width, height));
			onClose();
		} catch (err) {
			const message = (err instanceof Error ? err.message : '') || '';
			setError(
				message.includes('exists')
					? PROJECT_MESSAGES.NAME_DUPLICATE
					: PROJECT_MESSAGES.UNEXPECTED_SERVER_ERROR,
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<ModalContainer data-testid={testId}>
			<ModalForm onSubmit={handleSubmit} data-testid="project-form" title={title}>
				<ModalInputs
					showInput={showInput}
					showCanvasInputs={showCanvasInputs}
					customContent={customContent}
					name={name}
					width={width}
					height={height}
					error={error}
					setName={setName}
					setWidth={setWidth}
					setHeight={setHeight}
				/>
				<ModalActions
					onClose={onClose}
					buttonLabel={buttonLabel}
					loading={loading}
					showInput={showInput}
				/>
			</ModalForm>
		</ModalContainer>
	);
}
