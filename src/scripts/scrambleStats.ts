import { onReady } from './domReady';

const SCRAMBLE_CHARS = '0123456789#%*+=-';

/** Decryption-style number scramble on enter and hover for manifesto stat cards. */
export function initScrambleStats(): void {
  onReady(() => {
    const statElements = document.querySelectorAll<HTMLElement>('.scramble-stat');
    if (statElements.length === 0) return;

    const timers = new WeakMap<HTMLElement, ReturnType<typeof setInterval>>();

    function scramble(el: HTMLElement, duration = 750) {
      const target = el.dataset.scramble || el.textContent || '';
      if (!target) return;

      const length = target.length;
      const fps = 30;
      const totalFrames = Math.max(12, Math.round((duration / 1000) * fps));
      let frame = 0;

      const activeTimer = timers.get(el);
      if (activeTimer) {
        clearInterval(activeTimer);
      }

      const timer = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;

        let result = '';
        for (let i = 0; i < length; i++) {
          const charThreshold = (i + 1) / (length + 0.4);
          result +=
            progress >= charThreshold
              ? target[i]
              : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }

        el.textContent = result;

        if (frame >= totalFrames) {
          clearInterval(timer);
          timers.delete(el);
          el.textContent = target;
        }
      }, 1000 / fps);

      timers.set(el, timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            scramble(el, 800);
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    statElements.forEach((el) => {
      observer.observe(el);

      const parentCard = el.closest<HTMLElement>('.stat-card');
      if (parentCard) {
        parentCard.addEventListener('mouseenter', () => {
          scramble(el, 480);
        });
      }
    });
  });
}
