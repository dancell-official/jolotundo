import { onReady } from './domReady';

export interface WordRevealOptions {
  headingId: string;
  wordSelector?: string;
  startFactor?: number;
  endFactor?: number;
  minOpacity?: number;
  rootMargin?: string;
}

/** Scroll-driven word-by-word opacity reveal engine (GPU-safe opacity updates). */
export function initWordReveal({
  headingId,
  wordSelector = '.reveal-word',
  startFactor = 0.85,
  endFactor = 0.35,
  minOpacity = 0.18,
  rootMargin = '200px 0px',
}: WordRevealOptions): void {
  onReady(() => {
    const heading = document.getElementById(headingId);
    if (!heading) return;

    const words = heading.querySelectorAll<HTMLElement>(wordSelector);
    if (words.length === 0) return;

    const totalWords = words.length;
    const opacitySpan = 1 - minOpacity;
    let isTicking = false;
    let isVisible = false;

    function updateWords() {
      if (!heading) return;
      const rect = heading.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const startTrigger = viewportHeight * startFactor;
      const endTrigger = viewportHeight * endFactor;

      const rawProgress = (startTrigger - rect.top) / (startTrigger - endTrigger);
      const overallProgress = Math.max(0, Math.min(1, rawProgress));

      words.forEach((word, idx) => {
        const wordStart = idx / totalWords;
        const wordEnd = (idx + 1) / totalWords;
        const wordProgress = Math.max(
          0,
          Math.min(1, (overallProgress - wordStart) / (wordEnd - wordStart))
        );
        word.style.opacity = (minOpacity + wordProgress * opacitySpan).toFixed(2);
      });

      isTicking = false;
    }

    function onScroll() {
      if (!isTicking && isVisible) {
        requestAnimationFrame(updateWords);
        isTicking = true;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;
        if (isVisible) updateWords();
      },
      { rootMargin }
    );
    observer.observe(heading);

    window.addEventListener('scroll', onScroll, { passive: true });
    updateWords();
  });
}
