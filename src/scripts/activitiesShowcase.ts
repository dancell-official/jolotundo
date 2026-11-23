import { onReady } from './domReady';
import { initWordReveal } from './wordReveal';

/** Activities showcase controller: intro reveal, drag/swipe auto-carousel, & Lenis parallax. */
export function initActivitiesShowcase(): void {
  initWordReveal({
    headingId: 'activities-intro-heading',
    wordSelector: '.activity-reveal-word',
    startFactor: 0.85,
    endFactor: 0.35,
    minOpacity: 0.18,
    rootMargin: '150px 0px',
  });

  onReady(() => {
    const carousel = document.getElementById('activities-carousel');
    if (carousel) {
      const slides = carousel.querySelectorAll<HTMLElement>('.activity-slide');
      const bgSlides = carousel.querySelectorAll<HTMLElement>(
        '#carousel-parallax-stack .carousel-bg-slide'
      );
      const totalSlides = slides.length;

      if (totalSlides > 0) {
        const SLIDE_DURATION = 5500;
        let currentIndex = 0;
        let autoSlideTimer: ReturnType<typeof setTimeout> | undefined;
        let isHovered = false;
        let isIntersecting = false;

        function goToSlide(targetIdx: number) {
          currentIndex = (targetIdx + totalSlides) % totalSlides;

          slides.forEach((slide, i) => {
            if (i === currentIndex) {
              slide.classList.remove('opacity-0', 'z-0', 'pointer-events-none');
              slide.classList.add('opacity-100', 'z-10', 'pointer-events-auto');
            } else {
              slide.classList.remove('opacity-100', 'z-10', 'pointer-events-auto');
              slide.classList.add('opacity-0', 'z-0', 'pointer-events-none');
            }
          });

          bgSlides.forEach((bgSlide, i) => {
            if (i === currentIndex) {
              bgSlide.classList.remove('opacity-0', 'z-0');
              bgSlide.classList.add('opacity-100', 'z-10');
            } else {
              bgSlide.classList.remove('opacity-100', 'z-10');
              bgSlide.classList.add('opacity-0', 'z-0');
            }
          });

          slides.forEach((slide) => {
            const fills = slide.querySelectorAll<HTMLElement>('.carousel-progress-fill');
            fills.forEach((fill, i) => {
              if (i < currentIndex) {
                fill.style.transition = 'none';
                fill.style.width = '100%';
              } else if (i === currentIndex) {
                fill.style.transition = 'none';
                fill.style.width = '0%';
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    if (!isHovered && isIntersecting) {
                      fill.style.transition = `width ${SLIDE_DURATION}ms linear`;
                      fill.style.width = '100%';
                    }
                  });
                });
              } else {
                fill.style.transition = 'none';
                fill.style.width = '0%';
              }
            });
          });

          clearTimeout(autoSlideTimer);
          if (!isHovered && isIntersecting) {
            autoSlideTimer = setTimeout(() => {
              goToSlide(currentIndex + 1);
            }, SLIDE_DURATION);
          }
        }

        carousel.addEventListener('click', (e) => {
          const targetEl = e.target as HTMLElement | null;
          const segBtn = targetEl?.closest('.carousel-segment-btn');
          if (segBtn) {
            e.preventDefault();
            e.stopPropagation();
            const target = parseInt(segBtn.getAttribute('data-target-index') || '0', 10);
            goToSlide(target);
          }
        });

        carousel.addEventListener('mouseenter', () => {
          isHovered = true;
          clearTimeout(autoSlideTimer);
          slides.forEach((slide) => {
            const fills = slide.querySelectorAll<HTMLElement>('.carousel-progress-fill');
            const activeFill = fills[currentIndex];
            if (activeFill) {
              const computedWidth = window.getComputedStyle(activeFill).width;
              activeFill.style.transition = 'none';
              activeFill.style.width = computedWidth;
            }
          });
        });

        carousel.addEventListener('mouseleave', () => {
          isHovered = false;
          goToSlide(currentIndex);
        });

        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;
        let isDragging = false;
        let hasDragged = false;

        carousel.addEventListener('mousedown', (e) => {
          const targetEl = e.target as HTMLElement | null;
          if (targetEl?.closest('a') || targetEl?.closest('button')) return;

          isDragging = true;
          hasDragged = false;
          startX = e.clientX;
          currentX = e.clientX;
          isHovered = true;
          clearTimeout(autoSlideTimer);
        });

        window.addEventListener('mousemove', (e) => {
          if (!isDragging) return;
          currentX = e.clientX;
          if (Math.abs(currentX - startX) > 8) {
            hasDragged = true;
          }
        });

        window.addEventListener('mouseup', () => {
          if (!isDragging) return;
          isDragging = false;
          isHovered = false;

          const diff = currentX - startX;
          if (hasDragged && Math.abs(diff) > 40) {
            goToSlide(diff < 0 ? currentIndex + 1 : currentIndex - 1);
          } else {
            goToSlide(currentIndex);
          }
        });

        carousel.addEventListener(
          'touchstart',
          (e) => {
            startX = e.changedTouches[0].clientX;
            startY = e.changedTouches[0].clientY;
            currentX = startX;
            currentY = startY;
            isHovered = true;
            clearTimeout(autoSlideTimer);
          },
          { passive: true }
        );

        carousel.addEventListener(
          'touchmove',
          (e) => {
            currentX = e.changedTouches[0].clientX;
            currentY = e.changedTouches[0].clientY;
          },
          { passive: true }
        );

        carousel.addEventListener(
          'touchend',
          () => {
            isHovered = false;
            const diffX = currentX - startX;
            const diffY = currentY - startY;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
              goToSlide(diffX < 0 ? currentIndex + 1 : currentIndex - 1);
            } else {
              goToSlide(currentIndex);
            }
          },
          { passive: true }
        );

        const carouselObs = new IntersectionObserver(
          (entries) => {
            isIntersecting = entries[0]?.isIntersecting ?? false;
            if (isIntersecting) {
              goToSlide(currentIndex);
            } else {
              clearTimeout(autoSlideTimer);
              slides.forEach((slide) => {
                const fills = slide.querySelectorAll<HTMLElement>('.carousel-progress-fill');
                const activeFill = fills[currentIndex];
                if (activeFill) {
                  activeFill.style.transition = 'none';
                }
              });
            }
          },
          { rootMargin: '100px 0px' }
        );

        carouselObs.observe(carousel);
        goToSlide(0);
      }

      const parallaxStack = document.getElementById('carousel-parallax-stack');
      if (parallaxStack) {
        let isVisible = false;
        let isTicking = false;
        const getTravelDistance = () => (window.innerWidth < 1024 ? 40 : 65);

        const updateParallax = () => {
          const rect = carousel.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          if (rect.top <= windowHeight && rect.bottom >= 0) {
            const totalTravel = rect.height + windowHeight;
            const enterProgress = (windowHeight - rect.top) / totalTravel;
            const progress = Math.max(0, Math.min(1, enterProgress));
            const maxDist = getTravelDistance();
            const parallaxY = ((progress - 0.5) * 2 * maxDist).toFixed(1);
            parallaxStack.style.transform = `translate3d(0, ${parallaxY}px, 0)`;
          }
          isTicking = false;
        };

        const onScroll = () => {
          if (!isTicking && isVisible) {
            requestAnimationFrame(updateParallax);
            isTicking = true;
          }
        };

        if ('IntersectionObserver' in window) {
          const obs = new IntersectionObserver(
            (entries) => {
              isVisible = entries[0]?.isIntersecting ?? false;
              if (isVisible) updateParallax();
            },
            { rootMargin: '120px 0px' }
          );
          obs.observe(carousel);
        } else {
          isVisible = true;
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener(
          'resize',
          () => {
            if (isVisible) updateParallax();
          },
          { passive: true }
        );

        if (window.__lenis) {
          window.__lenis.on('scroll', onScroll);
        } else {
          window.addEventListener('load', () => {
            if (window.__lenis) window.__lenis.on('scroll', onScroll);
          });
        }

        updateParallax();
      }
    }
  });
}
