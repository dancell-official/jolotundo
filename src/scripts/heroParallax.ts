import { onReady } from './domReady';

export interface HeroLayerParallaxOptions {
  sectionId: string;
  layerId: string;
  speed?: number;
  bufferPx?: number;
  viewportMultiplier?: number;
}

/** Dual-layer sinking parallax for Home Hero, synced with Lenis when available. */
export function initHomeHeroParallax(): void {
  onReady(() => {
    const heroSection = document.getElementById('hero-section');
    const heroBg = document.getElementById('hero-parallax-bg');
    const heroContent = document.getElementById('hero-content');
    if (!heroSection) return;

    let heroHeight = heroSection.offsetHeight || 800;
    let isHeroVisible = true;
    let isTicking = false;

    const checkMobile = () => window.innerWidth < 768;
    let isMobile = checkMobile();

    window.addEventListener(
      'resize',
      () => {
        heroHeight = heroSection.offsetHeight || 800;
        const prevMobile = isMobile;
        isMobile = checkMobile();
        if (isMobile && !prevMobile && heroContent) {
          heroContent.style.transform = '';
          heroContent.style.opacity = '';
        }
      },
      { passive: true }
    );

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          isHeroVisible = entries[0]?.isIntersecting ?? true;
        },
        { rootMargin: '100px 0px' }
      );
      obs.observe(heroSection);
    }

    function renderParallax() {
      const scrollY = window.scrollY;
      if (scrollY <= heroHeight * 1.25) {
        if (isMobile) {
          // Mobile: animate background only to avoid text layer re-rasterization
          if (heroBg) {
            heroBg.style.transform = `translate3d(0, ${(scrollY * 0.18).toFixed(1)}px, 0)`;
          }
        } else {
          if (heroBg) {
            heroBg.style.transform = `translate3d(0, ${(scrollY * 0.35).toFixed(1)}px, 0)`;
          }
          if (heroContent) {
            const progress = Math.min(1, scrollY / (heroHeight * 0.75));
            heroContent.style.transform = `translate3d(0, ${(scrollY * 0.22).toFixed(1)}px, 0)`;
            heroContent.style.opacity = Math.max(0, 1 - progress).toFixed(2);
          }
        }
      }
      isTicking = false;
    }

    function onScroll() {
      if (!isTicking && isHeroVisible) {
        requestAnimationFrame(renderParallax);
        isTicking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    if (window.__lenis) {
      window.__lenis.on('scroll', onScroll);
    } else {
      window.addEventListener('load', () => {
        if (window.__lenis) window.__lenis.on('scroll', onScroll);
      });
    }

    renderParallax();
  });
}

/** Single-layer GPU translate3d hero parallax used across interior/detail pages. */
export function initHeroLayerParallax({
  sectionId,
  layerId,
  speed = 0.32,
  bufferPx = 50,
  viewportMultiplier,
}: HeroLayerParallaxOptions): void {
  onReady(() => {
    const heroSection = document.getElementById(sectionId);
    const parallaxLayer = document.getElementById(layerId);
    if (!heroSection || !parallaxLayer) return;

    let isTicking = false;

    function updateParallax() {
      if (!heroSection || !parallaxLayer) return;
      const scrollY = window.scrollY;
      const limit = viewportMultiplier
        ? window.innerHeight * viewportMultiplier
        : heroSection.offsetHeight + bufferPx;

      if (scrollY <= limit) {
        const translateY = scrollY * speed;
        parallaxLayer.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
      }
    }

    function handleScroll() {
      if (!isTicking) {
        requestAnimationFrame(() => {
          updateParallax();
          isTicking = false;
        });
        isTicking = true;
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateParallax();
  });
}
