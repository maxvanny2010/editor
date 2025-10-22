import { EditorCanvas } from '@/widgets/canvas/model';

export const EditorPage = () => {
	return (
		<div className="h-screen w-screen bg-gradient-to-b from-gray-50 to-gray-100">
			<div className="h-full w-full">
				<EditorCanvas
					width={1200}
					height={800}
					padding={32}
					autoResize
					onReady={(ctx) => {
						ctx.save();
						ctx.globalAlpha = 0.75;
						ctx.fillStyle = '#22c55e';
						ctx.fillRect(20, 20, 120, 60);
						ctx.restore();
					}}
				/>
			</div>
		</div>
	);
};
