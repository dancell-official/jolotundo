import { onReady } from './domReady';

export interface ValueSlideSpec {
  label: string;
  value: string;
}

export interface ValueSlide {
  name: string;
  title: string;
  desc: string;
  specs?: ValueSlideSpec[];
}

/** Mission ruler intersection animation & auto-advancing values parallax slider. */
export function initVisiMisiInteractions(): void {
  onReady(() => {
    const wrapper = document.getElementById('mission-timeline-wrapper');
    if (wrapper) {
      const missionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              wrapper.classList.add('is-animated');
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -40px 0px',
        }
      );
      missionObserver.observe(wrapper);
    }

    const section = document.getElementById('our-values-parallax-slider');
    if (!section) return;

    let valuesSlides: ValueSlide[] = [];
    try {
      valuesSlides = JSON.parse(section.dataset.slides || '[]');
    } catch {
      return;
    }

    const parallaxLayer = document.getElementById('values-parallax-image-container');
    const slideImages = document.querySelectorAll<HTMLElement>('.values-bg-slide');
    const progressFill = document.getElementById('values-progress-fill');
    const pgBtns = document.querySelectorAll<HTMLElement>('.values-pg-btn');
    const prevBtn = document.getElementById('values-prev-btn');
    const nextBtn = document.getElementById('values-next-btn');
    const titleEl = document.getElementById('values-slide-title');
    const descEl = document.getElementById('values-slide-desc');
    const counterEl = document.getElementById('values-counter-current');
    const spec0El = document.getElementById('values-spec-0');
    const spec1El = document.getElementById('values-spec-1');
    const spec2El = document.getElementById('values-spec-2');

    if (!slideImages.length || !valuesSlides.length) return;

    let currentIndex = 0;
    const totalSlides = valuesSlides.length;
    const SLIDE_DURATION = 6000;
    let slideStartTime = performance.now();
    let isIntersecting = false;

    function updateValuesParallax() {
      if (!parallaxLayer || !section) return;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const totalTravel = rect.height + windowHeight;
        const enterProgress = Math.max(
          0,
          Math.min(1, (windowHeight - rect.top) / totalTravel)
        );
        const translateY = (enterProgress * 120 - 60).toFixed(1);
        parallaxLayer.style.transform = `translate3d(0, ${translateY}px, 0)`;
      }
    }

    function setSlide(newIndex: number) {
      currentIndex = (newIndex + totalSlides) % totalSlides;
      slideStartTime = performance.now();

      slideImages.forEach((img, idx) => {
        if (idx === currentIndex) {
          img.classList.remove('opacity-0');
          img.classList.add('opacity-100');
        } else {
          img.classList.remove('opacity-100');
          img.classList.add('opacity-0');
        }
      });

      const activeData = valuesSlides[currentIndex];
      if (titleEl && descEl) {
        titleEl.style.opacity = '0';
        descEl.style.opacity = '0';
        setTimeout(() => {
          titleEl.textContent = activeData.title;
          descEl.textContent = activeData.desc;
          titleEl.style.opacity = '1';
          descEl.style.opacity = '1';
        }, 180);
      }

      if (spec0El && spec1El && spec2El && activeData.specs && activeData.specs.length >= 3) {
        spec0El.textContent = activeData.specs[0].value;
        spec1El.textContent = activeData.specs[1].value;
        spec2El.textContent = activeData.specs[2].value;
      }

      if (counterEl) {
        counterEl.textContent = `0${currentIndex + 1}`;
      }

      pgBtns.forEach((btn, idx) => {
        btn.className =
          idx === currentIndex
            ? 'values-pg-btn px-1.5 py-0.5 transition-all duration-200 cursor-pointer text-white font-bold text-sm border-b border-white'
            : 'values-pg-btn px-1.5 py-0.5 transition-all duration-200 cursor-pointer text-white/40 hover:text-white/80 border-b border-transparent';
      });

      if (progressFill) {
        progressFill.style.transform = 'translateX(-100%)';
      }
    }

    function loop(currentTime: number) {
      if (isIntersecting) {
        const elapsed = currentTime - slideStartTime;
        const progress = Math.max(0, Math.min(1, elapsed / SLIDE_DURATION));

        if (progressFill) {
          const translateX = (progress - 1) * 100;
          progressFill.style.transform = `translateX(${translateX.toFixed(2)}%)`;
        }

        if (progress >= 1) {
          setSlide(currentIndex + 1);
        }
      }

      requestAnimationFrame(loop);
    }

    pgBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetIdx = parseInt(btn.getAttribute('data-pg-index') || '0', 10);
        setSlide(targetIdx);
      });
    });

    prevBtn?.addEventListener('click', () => setSlide(currentIndex - 1));
    nextBtn?.addEventListener('click', () => setSlide(currentIndex + 1));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const wasIntersecting = isIntersecting;
          isIntersecting = entry.isIntersecting;
          if (isIntersecting && !wasIntersecting) {
            updateValuesParallax();
          }
        });
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(section);

    window.addEventListener(
      'scroll',
      () => {
        if (isIntersecting) {
          requestAnimationFrame(updateValuesParallax);
        }
      },
      { passive: true }
    );

    setSlide(0);
    requestAnimationFrame(loop);
  });
}
