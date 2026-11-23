import { onReady } from './domReady';

export interface CatalogGridOptions {
  gridId: string;
  onlyToggleBelowDesktop?: boolean;
  closeOnOutsideClick?: boolean;
}

/** Category filter + mobile touch / intersection reveal controller for catalog grids. */
export function initCatalogGrid({
  gridId,
  onlyToggleBelowDesktop = false,
  closeOnOutsideClick = false,
}: CatalogGridOptions): void {
  onReady(() => {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll<HTMLElement>('.camp-card'));
    const filterBtns = Array.from(document.querySelectorAll<HTMLElement>('.category-filter-btn'));

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selectedCat = btn.getAttribute('data-category');

        filterBtns.forEach((b) => {
          b.classList.remove('font-bold', 'text-[#141110]', 'border-[#141110]');
          b.classList.add('text-[#141110]/45', 'border-transparent');
        });
        btn.classList.add('font-bold', 'text-[#141110]', 'border-[#141110]');
        btn.classList.remove('text-[#141110]/45', 'border-transparent');

        cards.forEach((card) => {
          const cardCat = card.getAttribute('data-category');
          if (selectedCat === 'all' || cardCat === selectedCat) {
            card.style.display = '';
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.96)';
            setTimeout(() => {
              if (card.style.opacity === '0') {
                card.style.display = 'none';
              }
            }, 250);
          }
        });
      });
    });

    const isMobile =
      window.matchMedia('(max-width: 1023px)').matches || 'ontouchstart' in window;

    if (isMobile && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const card = entry.target;
            if (entry.isIntersecting) {
              card.classList.add('is-active');
            } else {
              card.classList.remove('is-active');
            }
          });
        },
        {
          root: null,
          rootMargin: '-8% 0px -12% 0px',
          threshold: 0.18,
        }
      );

      cards.forEach((card) => observer.observe(card));
    }

    cards.forEach((card) => {
      card.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', (e) => e.stopPropagation());
      });

      card.addEventListener('click', (e) => {
        if (onlyToggleBelowDesktop && window.innerWidth >= 1024) {
          return;
        }

        const target = e.target as HTMLElement | null;
        if (target && target.closest && (target.closest('a') || target.closest('button'))) {
          return;
        }

        const isCurrentlyActive = card.classList.contains('is-active');
        cards.forEach((c) => c.classList.remove('is-active'));
        if (!isCurrentlyActive) {
          card.classList.add('is-active');
        }
      });
    });

    if (closeOnOutsideClick) {
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement | null;
        if (target && target.closest && !target.closest(`#${gridId}`)) {
          cards.forEach((c) => c.classList.remove('is-active'));
        }
      });
    }
  });
}
