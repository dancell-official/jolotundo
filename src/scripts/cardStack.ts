import { onReady } from './domReady';

export interface CardStackOptions {
  wrapperSelector: string;
  innerSelector: string;
  containerId?: string;
  sectionId?: string;
  scaleFactor?: number;
  brightnessFactor?: number;
  opacityFactor?: number;
  overlapRatio?: number;
  enableClickScroll?: boolean;
  clickOffsetPerIndex?: number;
  clickOffsetBase?: number;
  mobileClickOffsetPerIndex?: number;
  mobileClickOffsetBase?: number;
}

/** Tactile sticky card stack depth effect (scale, dim/fade & click-to-scroll on card headers). */
export function initCardStack({
  wrapperSelector,
  innerSelector,
  containerId,
  sectionId,
  scaleFactor = 0.035,
  brightnessFactor = 0.12,
  opacityFactor,
  overlapRatio = 0.75,
  enableClickScroll = false,
  clickOffsetPerIndex = 26,
  clickOffsetBase = 90,
  mobileClickOffsetPerIndex,
  mobileClickOffsetBase,
}: CardStackOptions): void {
  onReady(() => {
    if (containerId && !document.getElementById(containerId)) return;
    const section = sectionId ? document.getElementById(sectionId) : null;
    if (sectionId && !section) return;

    const wrappers = document.querySelectorAll<HTMLElement>(wrapperSelector);
    if (wrappers.length === 0) return;

    if (enableClickScroll) {
      wrappers.forEach((wrapper, idx) => {
        wrapper.addEventListener('click', (e) => {
          const target = e.target as HTMLElement | null;
          if (target?.closest('a')) return;

          const isMobile = window.innerWidth < 640;
          const perIdx =
            isMobile && mobileClickOffsetPerIndex !== undefined
              ? mobileClickOffsetPerIndex
              : clickOffsetPerIndex;
          const base =
            isMobile && mobileClickOffsetBase !== undefined
              ? mobileClickOffsetBase
              : clickOffsetBase;
          const offsetVal = idx * perIdx + base;

          const lenis = window.__lenis;
          if (lenis) {
            lenis.scrollTo(wrapper, { offset: -offsetVal, duration: 0.8 });
          } else {
            window.scrollTo({
              top: wrapper.offsetTop - offsetVal,
              behavior: 'smooth',
            });
          }
        });
      });
    }

    function onScrollStack() {
      wrappers.forEach((wrapper, idx) => {
        if (idx === wrappers.length - 1) return;

        const nextWrapper = wrappers[idx + 1];
        if (!nextWrapper) return;

        const nextRect = nextWrapper.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();
        const cardInner = wrapper.querySelector<HTMLElement>(innerSelector);
        if (!cardInner) return;

        if (nextRect.top <= wrapperRect.bottom) {
          const overlap = wrapperRect.bottom - nextRect.top;
          const maxOverlap = wrapperRect.height;
          const progress = Math.max(0, Math.min(1, overlap / (maxOverlap * overlapRatio)));

          const scale = 1 - progress * scaleFactor;
          cardInner.style.transform = `scale(${scale.toFixed(4)})`;

          if (opacityFactor !== undefined) {
            const opacity = 1 - progress * opacityFactor;
            cardInner.style.opacity = opacity.toFixed(3);
          } else {
            const brightness = 1 - progress * brightnessFactor;
            cardInner.style.filter = `brightness(${brightness.toFixed(3)})`;
          }
        } else {
          cardInner.style.transform = 'scale(1)';
          if (opacityFactor !== undefined) {
            cardInner.style.opacity = '1';
          } else {
            cardInner.style.filter = 'brightness(1)';
          }
        }
      });
    }

    let isTicking = false;
    let isIntersecting = !section;

    function handleScroll() {
      if (!isTicking && isIntersecting) {
        requestAnimationFrame(() => {
          onScrollStack();
          isTicking = false;
        });
        isTicking = true;
      }
    }

    if (section) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isIntersecting = entry.isIntersecting;
            if (isIntersecting) {
              onScrollStack();
            }
          });
        },
        {
          root: null,
          threshold: 0,
          rootMargin: '200px 0px',
        }
      );
      observer.observe(section);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    onScrollStack();
  });
}
