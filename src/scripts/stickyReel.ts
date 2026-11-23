import { onReady } from './domReady';

export interface StickyReelOptions {
  sectionId: string;
  reelId: string;
  cardSelector: string;
  quoteWrapperSelector: string;
  indicatorBtnSelector: string;
  indicatorClassPrefix: string;
  parallaxLayerSelector: string;
}

/** Shared vertical-reel & split-story scroll controller (used by FacilitiesSticky & GrillStickyScroll). */
export function initStickySplitReel({
  sectionId,
  reelId,
  cardSelector,
  quoteWrapperSelector,
  indicatorBtnSelector,
  indicatorClassPrefix,
  parallaxLayerSelector,
}: StickyReelOptions): void {
  onReady(() => {
    const section = document.getElementById(sectionId);
    const reel = document.getElementById(reelId);
    const cards = document.querySelectorAll<HTMLElement>(cardSelector);
    const indicatorBtns = document.querySelectorAll<HTMLElement>(indicatorBtnSelector);
    const parallaxLayers = document.querySelectorAll<HTMLElement>(parallaxLayerSelector);
    if (!section || !reel || !cards.length) return;

    let activeIndex = 0;

    function setActiveIndex(idx: number) {
      if (idx === activeIndex || !reel) return;
      activeIndex = idx;

      reel.style.transform = `translateY(-${idx * 100}%)`;

      cards.forEach((card, i) => {
        const quoteWrapper = card.querySelector<HTMLElement>(quoteWrapperSelector);
        if (i === idx) {
          card.classList.remove('opacity-25', 'cursor-pointer');
          card.classList.add('opacity-100');
          if (quoteWrapper) {
            quoteWrapper.classList.remove('border-transparent');
            quoteWrapper.classList.add('border-[#141110]');
          }
        } else {
          card.classList.remove('opacity-100');
          card.classList.add('opacity-25', 'cursor-pointer');
          if (quoteWrapper) {
            quoteWrapper.classList.remove('border-[#141110]');
            quoteWrapper.classList.add('border-transparent');
          }
        }
      });

      indicatorBtns.forEach((btn, i) => {
        btn.className =
          i === idx
            ? `${indicatorClassPrefix} font-mono-tag text-xs tracking-wider transition-all duration-300 cursor-pointer font-bold text-[#141110] border-b-2 border-[#141110] pb-0.5`
            : `${indicatorClassPrefix} font-mono-tag text-xs tracking-wider transition-all duration-300 cursor-pointer text-[#141110]/35 hover:text-[#141110]`;
      });
    }

    function onScroll() {
      const windowHeight = window.innerHeight;
      const viewportCenter = windowHeight * 0.45;
      const focalLine = windowHeight * 0.4;
      let closestIdx = activeIndex;
      let minDistance = Infinity;

      cards.forEach((card, idx) => {
        const cRect = card.getBoundingClientRect();
        const cardCenter = cRect.top + cRect.height * 0.45;
        const dist = Math.abs(cardCenter - focalLine);

        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }

        if (Math.abs(idx - activeIndex) <= 1) {
          const layer = parallaxLayers[idx];
          if (layer && cRect.bottom >= -windowHeight * 0.5 && cRect.top <= windowHeight * 1.5) {
            const diff = cardCenter - viewportCenter;
            const clampedY = Math.max(-60, Math.min(60, -diff * 0.1));
            layer.style.transform = `translate3d(0, ${clampedY.toFixed(1)}px, 0)`;
          }
        }
      });

      if (closestIdx !== activeIndex) {
        setActiveIndex(closestIdx);
      }
    }

    let isTicking = false;
    let isIntersecting = false;

    function handleScroll() {
      if (!isTicking && isIntersecting) {
        requestAnimationFrame(() => {
          onScroll();
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
            onScroll();
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
        resizeTimer = setTimeout(() => {
          onScroll();
        }, 150);
      },
      { passive: true }
    );

    function scrollToCard(idx: number) {
      const targetCard = cards[idx];
      if (!targetCard) return;

      const lenis = window.__lenis;
      if (lenis) {
        lenis.scrollTo(targetCard, { offset: -140, duration: 1 });
      } else {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    cards.forEach((card, i) => {
      card.addEventListener('click', (e) => {
        if (i !== activeIndex) {
          const target = e.target as HTMLElement | null;
          if (!target?.closest('a')) {
            scrollToCard(i);
          }
        }
      });
    });

    indicatorBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetIdx = parseInt(btn.getAttribute('data-target-index') || '0', 10);
        scrollToCard(targetIdx);
      });
    });

    onScroll();
  });
}
