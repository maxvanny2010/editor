declare module 'crypto' {
	export const webcrypto: Crypto;
}
interface Window {
	showSaveFilePicker?: (
		options?: SaveFilePickerOptions,
	) => Promise<FileSystemFileHandle>;
}

interface SaveFilePickerOptions {
	suggestedName?: string;
	types?: Array<{
		description: string;
		accept: Record<string, string[]>;
	}>;
}

interface FileSystemFileHandle {
	createWritable(): Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream {
	write(data: Blob | BufferSource | string): Promise<void>;
	close(): Promise<void>;
}
