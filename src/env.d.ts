/// <reference types="astro/client" />
import type Lenis from 'lenis';

declare global {
	interface Window {
		__lenis?: Lenis;
	}

	interface Document {
		webkitFullscreenElement?: Element | null;
		webkitExitFullscreen?: () => Promise<void> | void;
	}

	interface HTMLElement {
		webkitRequestFullscreen?: () => Promise<void> | void;
	}
}

export {};
