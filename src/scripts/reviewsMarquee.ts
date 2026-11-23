import { onReady } from './domReady';

/** Interactive dual-row draggable & auto-scrolling Google Reviews marquee (pauses off-screen). */
export function initReviewsMarquee(): void {
  onReady(() => {
    const section = document.getElementById('ulasan');
    const track1 = document.getElementById('marquee-track-1');
    const track2 = document.getElementById('marquee-track-2');
    if (!section || !track1 || !track2) return;

    function setupTrack(track: HTMLElement, baseSpeed: number, initialOffsetRatio = 0) {
      let currentX = 0;
      let isDragging = false;
      let isHovered = false;
      let isVisible = true;
      let startX = 0;
      let dragStartX = 0;
      let animationFrameId: number | null = null;

      let unitWidth = track.scrollWidth > 0 ? track.scrollWidth / 3 : 1500;

      function updateDimensions() {
        if (track.scrollWidth > 0) {
          unitWidth = track.scrollWidth / 3;
        }
      }

      if (initialOffsetRatio !== 0) {
        currentX = -unitWidth * initialOffsetRatio;
      }

      function loop() {
        if (!isVisible) {
          animationFrameId = null;
          return;
        }

        if (!isDragging && !isHovered) {
          currentX += baseSpeed;
        }

        if (baseSpeed < 0) {
          if (currentX <= -unitWidth) currentX += unitWidth;
          if (currentX > 0) currentX -= unitWidth;
        } else {
          if (currentX >= 0) currentX -= unitWidth;
          if (currentX < -unitWidth) currentX += unitWidth;
        }

        track.style.transform = `translate3d(${currentX.toFixed(1)}px, 0, 0)`;
        animationFrameId = requestAnimationFrame(loop);
      }

      function startLoop() {
        if (!animationFrameId && isVisible) {
          animationFrameId = requestAnimationFrame(loop);
        }
      }

      function stopLoop() {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }

      const wrapper = track.parentElement;

      wrapper?.addEventListener('mouseenter', () => {
        isHovered = true;
      });

      wrapper?.addEventListener('mouseleave', () => {
        isHovered = false;
        if (isDragging) {
          isDragging = false;
          if (wrapper) wrapper.style.cursor = 'grab';
        }
      });

      track.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        isHovered = true;
        startX = e.clientX;
        dragStartX = currentX;
        if (wrapper) wrapper.style.cursor = 'grabbing';
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const delta = e.clientX - startX;
        currentX = dragStartX + delta;
      });

      window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        if (wrapper) wrapper.style.cursor = 'grab';
        if (!wrapper?.matches(':hover')) {
          isHovered = false;
        }
      });

      track.addEventListener(
        'touchstart',
        (e) => {
          if (e.touches.length === 1) {
            isDragging = true;
            isHovered = true;
            startX = e.touches[0].clientX;
            dragStartX = currentX;
          }
        },
        { passive: true }
      );

      track.addEventListener(
        'touchmove',
        (e) => {
          if (!isDragging || e.touches.length !== 1) return;
          const delta = e.touches[0].clientX - startX;
          currentX = dragStartX + delta;
        },
        { passive: true }
      );

      track.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        setTimeout(() => {
          isHovered = false;
        }, 400);
      });

      track.addEventListener('touchcancel', () => {
        isDragging = false;
        isHovered = false;
      });

      return {
        updateDimensions,
        setVisible: (visible: boolean) => {
          isVisible = visible;
          if (visible) startLoop();
          else stopLoop();
        },
      };
    }

    const controller1 = setupTrack(track1, -0.65, 0);
    const controller2 = setupTrack(track2, 0.65, 0.5);

    setTimeout(() => {
      controller1.updateDimensions();
      controller2.updateDimensions();
    }, 100);

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    window.addEventListener(
      'resize',
      () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          controller1.updateDimensions();
          controller2.updateDimensions();
        }, 150);
      },
      { passive: true }
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting;
          controller1.setVisible(isIntersecting);
          controller2.setVisible(isIntersecting);
        });
      },
      {
        root: null,
        threshold: 0,
        rootMargin: '200px 0px',
      }
    );

    observer.observe(section);
  });
}
