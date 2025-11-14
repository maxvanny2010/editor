/* eslint-disable react-refresh/only-export-components */
import React, { type JSX } from 'react';
import { vi } from 'vitest';

const ignoredMotionProps = [
	'whileHover',
	'whileTap',
	'initial',
	'animate',
	'exit',
	'transition',
	'variants',
	'drag',
	'layout',
	'layoutId',
	'onAnimationStart',
	'onAnimationComplete',
];

const cleanProps = (props: Record<string, unknown>) =>
	Object.fromEntries(
		Object.entries(props).filter(
			([k]) => !ignoredMotionProps.includes(k) && k !== 'ref',
		),
	);

/**
 * Типобезопасный мок motion.* компонентов.
 * Поддерживает все базовые HTML-теги и не ломает типизацию ref/children.
 */
const createMockComponent = <T extends keyof JSX.IntrinsicElements>(Tag: T) => {
	const MockComponent = React.forwardRef<
		Element,
		React.PropsWithChildren<JSX.IntrinsicElements[T]>
	>((props, ref) => {
		const { children, ...rest } = props;
		const clean = cleanProps(rest as Record<string, unknown>);
		return React.createElement(Tag, { ...clean, ref }, children);
	});
	MockComponent.displayName = `MockMotion.${Tag}`;
	return MockComponent;
};

export const motion = {
	div: createMockComponent('div'),
	span: createMockComponent('span'),
	button: createMockComponent('button'),
	form: createMockComponent('form'),
	input: createMockComponent('input'),
	label: createMockComponent('label'),
	textarea: createMockComponent('textarea'),
	svg: createMockComponent('svg'),
	aside: createMockComponent('aside'),
	li: createMockComponent('li'),
	footer: createMockComponent('footer'),
};

const mockMotionValue = <T,>(initial: T) => ({
	get: vi.fn(() => initial),
	set: vi.fn(),
	onChange: vi.fn(),
	destroy: vi.fn(),
});

export const useMotionValue = vi.fn().mockImplementation(mockMotionValue);

export const useCycle = vi
	.fn()
	.mockImplementation(<T,>(initial: T) => [initial, vi.fn()] as [T, (next: T) => void]);

export const useAnimationControls = vi.fn().mockImplementation(() => ({
	start: vi.fn(async () => ({ stop: vi.fn() })),
	stop: vi.fn(),
	set: vi.fn(),
}));
export const useAnimation = useAnimationControls;

export const useViewportScroll = vi.fn().mockImplementation(() => ({
	scrollY: mockMotionValue(0),
	scrollYProgress: mockMotionValue(0),
}));
export const useScroll = useViewportScroll;

export const useTransform = vi
	.fn()
	.mockImplementation((_value, _range, output) =>
		Array.isArray(output) ? output[0] : output,
	);
export const useVelocity = vi.fn().mockImplementation(() => mockMotionValue(0));

export const useMotionTemplate = vi
	.fn()
	.mockImplementation((template: string) => template.replace(/\$\{.*?}/g, () => '0'));

export const useInView = vi.fn().mockImplementation(() => true);

export const AnimatePresence: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => <>{React.Children.toArray(children).filter(Boolean)}</>;

export default {
	motion,
	AnimatePresence,
	useAnimationControls,
	useAnimation,
	useCycle,
	useScroll,
	useTransform,
	useVelocity,
	useViewportScroll,
	useMotionValue,
	useMotionTemplate,
	useInView,
};
