import { onReady } from './domReady';

export interface HorizontalGalleryOptions {
  sectionId: string;
  trackId: string;
  progressBarId: string;
  windowId: string;
}

/** Sticky vertical-to-horizontal scroll gallery synced with Lenis when available. */
export function initHorizontalGallery({
  sectionId,
  trackId,
  progressBarId,
  windowId,
}: HorizontalGalleryOptions): void {
  onReady(() => {
    const section = document.getElementById(sectionId);
    const track = document.getElementById(trackId);
    const progressBar = document.getElementById(progressBarId);
    const sliderWindow = document.getElementById(windowId);
    if (!section || !track || !progressBar || !sliderWindow) return;

    let sectionTop = 0;
    let sectionHeight = 0;
    let windowHeight = 0;
    let totalDistance = 1;
    let maxScrollX = 0;
    let isTicking = false;

    function getCurrentScroll(): number {
      return window.__lenis ? window.__lenis.scroll : window.scrollY;
    }

    function updateMetrics() {
      if (!section || !track || !sliderWindow) return;
      const rect = section.getBoundingClientRect();
      windowHeight = window.innerHeight;
      sectionTop = getCurrentScroll() + rect.top;
      sectionHeight = section.offsetHeight;
      totalDistance = Math.max(1, sectionHeight - windowHeight);

      const trackWidth = track.scrollWidth;
      const windowWidth = sliderWindow.offsetWidth;
      maxScrollX = Math.max(0, trackWidth - windowWidth + 64);
    }

    function renderGallery(currentScroll: number) {
      if (!track || !progressBar) return;
      const scrolled = currentScroll - sectionTop;

      if (scrolled < -windowHeight || scrolled > totalDistance + windowHeight) {
        return;
      }

      const progress = Math.max(0, Math.min(1, scrolled / totalDistance));
      const translateX = progress * maxScrollX;

      track.style.transform = `translate3d(-${translateX.toFixed(1)}px, 0, 0)`;
      progressBar.style.transform = `scaleX(${(0.15 + progress * 0.85).toFixed(4)})`;
    }

    function onScrollNative() {
      if (!isTicking) {
        requestAnimationFrame(() => {
          renderGallery(getCurrentScroll());
          isTicking = false;
        });
        isTicking = true;
      }
    }

    if (window.__lenis) {
      window.__lenis.on('scroll', (e) => {
        renderGallery(typeof e.scroll === 'number' ? e.scroll : window.scrollY);
      });
    } else {
      window.addEventListener('scroll', onScrollNative, { passive: true });
      const checkLenis = setInterval(() => {
        if (window.__lenis) {
          window.removeEventListener('scroll', onScrollNative);
          window.__lenis.on('scroll', (e) => {
            renderGallery(typeof e.scroll === 'number' ? e.scroll : window.scrollY);
          });
          clearInterval(checkLenis);
        }
      }, 150);
      setTimeout(() => clearInterval(checkLenis), 3000);
    }

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    window.addEventListener(
      'resize',
      () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          updateMetrics();
          renderGallery(getCurrentScroll());
        }, 100);
      },
      { passive: true }
    );

    updateMetrics();
    renderGallery(getCurrentScroll());

    window.addEventListener(
      'load',
      () => {
        updateMetrics();
        renderGallery(getCurrentScroll());
      },
      { once: true }
    );
  });
}
