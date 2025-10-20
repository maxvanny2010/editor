import React from 'react';
import { preventEnterSubmit } from '@/shared/lib/utils';

interface ModalInputsProps {
	showInput?: boolean;
	showCanvasInputs?: boolean;
	customContent?: React.ReactNode;
	name: string;
	width: number;
	height: number;
	error: string | null;
	setName: (val: string) => void;
	setWidth: (val: number) => void;
	setHeight: (val: number) => void;
}

export function ModalInputs({
	showInput,
	showCanvasInputs,
	customContent,
	name,
	width,
	height,
	error,
	setName,
	setWidth,
	setHeight,
}: ModalInputsProps) {
	if (!showInput) {
		return <div className="text-gray-700 text-sm">{customContent}</div>;
	}

	return (
		<div className="space-y-4">
			{/* Project name */}
			<div className="space-y-2">
				<label
					htmlFor="project-name"
					className="block text-sm font-medium text-gray-600"
				>
					Project name
				</label>
				<input
					id="project-name"
					type="text"
					value={name}
					data-testid="project-input"
					placeholder="Enter project name"
					onChange={(e) => setName(e.target.value)}
					className="border border-gray-300 rounded-lg px-4 py-2.5 w-full text-gray-800 bg-white/80
							   focus:ring-2 focus:ring-indigo-500 focus:shadow-[0_0_8px_rgba(99,102,241,0.25)]
							   outline-none transition"
				/>
			</div>

			{/* Canvas size inputs */}
			{showCanvasInputs && (
				<div className="flex gap-4">
					<div className="flex-1">
						<label className="block text-sm font-medium text-gray-600">
							Width (px)
						</label>
						<input
							type="number"
							value={width}
							onKeyDown={preventEnterSubmit}
							onChange={(e) => setWidth(Number(e.target.value))}
							data-testid="canvas-width"
							className="border border-gray-300 rounded-lg px-3 py-2 w-full text-gray-800 bg-white/80 focus:ring-2 focus:ring-indigo-500 outline-none transition"
						/>
					</div>
					<div className="flex-1">
						<label className="block text-sm font-medium text-gray-600">
							Height (px)
						</label>
						<input
							type="number"
							onKeyDown={preventEnterSubmit}
							value={height}
							onChange={(e) => setHeight(Number(e.target.value))}
							data-testid="canvas-height"
							className="border border-gray-300 rounded-lg px-3 py-2 w-full text-gray-800 bg-white/80 focus:ring-2 focus:ring-indigo-500 outline-none transition"
						/>
					</div>
				</div>
			)}

			{error && (
				<p role="alert" className="text-red-500 text-sm mt-1">
					{error}
				</p>
			)}
		</div>
	);
}
