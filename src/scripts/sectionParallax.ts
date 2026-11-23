import { onReady } from './domReady';

/** Footer background translate3d parallax + mobile back-to-top Lenis button. */
export function initFooterParallax(): void {
  onReady(() => {
    const footer = document.getElementById('kontak');
    const bgImage = document.getElementById('cta-parallax-image');
    const backToTopBtn = document.getElementById('footer-back-to-top');
    if (!footer || !bgImage) return;

    let isTicking = false;
    let isIntersecting = false;

    function updateParallax() {
      if (!footer || !bgImage) return;
      const rect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const totalTravel = rect.height + windowHeight;
        const enterProgress = Math.max(0, Math.min(1, (windowHeight - rect.top) / totalTravel));
        const parallaxY = (enterProgress * 160 - 80).toFixed(1);
        bgImage.style.transform = `translate3d(0, ${parallaxY}px, 0)`;
      }
      isTicking = false;
    }

    function onScroll() {
      if (!isTicking && isIntersecting) {
        requestAnimationFrame(updateParallax);
        isTicking = true;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting) {
            updateParallax();
          }
        });
      },
      {
        root: null,
        threshold: 0,
        rootMargin: '300px 0px',
      }
    );

    observer.observe(footer);
    window.addEventListener('scroll', onScroll, { passive: true });

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    window.addEventListener(
      'resize',
      () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateParallax, 150);
      },
      { passive: true }
    );

    backToTopBtn?.addEventListener('click', () => {
      const lenis = window.__lenis;
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.5 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

/** Counter-movement translate3d parallax for `#rental-gear` section image layer. */
export function initRentalGearParallax(): void {
  onReady(() => {
    const section = document.getElementById('rental-gear');
    const parallaxLayer = document.getElementById('rental-gear-parallax');
    if (!section || !parallaxLayer) return;

    let isTicking = false;
    let isIntersecting = false;

    function updateParallax() {
      if (!section || !parallaxLayer) return;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.bottom >= -100 && rect.top <= windowHeight + 100) {
        const sectionCenter = rect.top + rect.height * 0.45;
        const viewportCenter = windowHeight * 0.5;
        const diff = sectionCenter - viewportCenter;
        const clampedY = Math.max(-70, Math.min(70, -diff * 0.12));
        parallaxLayer.style.transform = `translate3d(0, ${clampedY.toFixed(1)}px, 0)`;
      }
    }

    function handleScroll() {
      if (!isTicking && isIntersecting) {
        requestAnimationFrame(() => {
          updateParallax();
          isTicking = false;
        });
        isTicking = true;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting) {
            updateParallax();
          }
        });
      },
      {
        root: null,
        threshold: 0,
        rootMargin: '250px 0px',
      }
    );

    observer.observe(section);
    window.addEventListener('scroll', handleScroll, { passive: true });

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    window.addEventListener(
      'resize',
      () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateParallax, 100);
      },
      { passive: true }
    );

    updateParallax();
  });
}

/** Smooth sub-pixel vertical image parallax across `.sector-image-card` elements. */
export function initSectorCardParallax(): void {
  onReady(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.sector-image-card'));
    if (!cards.length) return;

    const getTravelDistance = () => (window.innerWidth < 1024 ? 48 : 88);

    const updateAll = () => {
      const windowHeight = window.innerHeight;
      const maxDist = getTravelDistance();

      cards.forEach((card) => {
        const layer = card.querySelector<HTMLElement>('.sector-parallax-layer');
        if (!layer) return;

        const rect = card.getBoundingClientRect();
        if (rect.top <= windowHeight && rect.bottom >= 0) {
          const totalTravel = rect.height + windowHeight;
          const enterProgress = (windowHeight - rect.top) / totalTravel;
          const progress = Math.max(0, Math.min(1, enterProgress));
          const translateY = ((progress - 0.5) * 2 * maxDist).toFixed(1);
          layer.style.transform = `translate3d(0, ${translateY}px, 0)`;
        }
      });
    };

    let isTicking = false;
    const onScroll = () => {
      if (!isTicking) {
        requestAnimationFrame(() => {
          updateAll();
          isTicking = false;
        });
        isTicking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    if (window.__lenis) {
      window.__lenis.on('scroll', onScroll);
    }

    updateAll();
  });
}
