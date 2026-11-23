import { onReady } from './domReady';

/** Expanding floating pill navbar, submenu accordion, outside-click & Lenis anchor routing. */
export function initNavbar(): void {
  onReady(() => {
    const navContainer = document.getElementById('nav-pill-container');
    const navTopRow = document.getElementById('nav-top-row');
    const toggleBtn = document.getElementById('menu-toggle-btn');
    const labelText = document.getElementById('menu-label-text');
    const labelIcon = document.getElementById('menu-label-icon');
    const expandedBody = document.getElementById('nav-expanded-body');
    const scrollContent = document.getElementById('nav-scroll-content');
    const navBackdrop = document.getElementById('nav-backdrop');
    const links = document.querySelectorAll<HTMLAnchorElement>('.menu-row-link');
    const waFloating = document.getElementById('wa-floating-container');
    const waCtaBtn = document.getElementById('nav-wa-cta-btn');

    const fasilitasToggleBtn = document.getElementById('nav-fasilitas-toggle-btn');
    const fasilitasDropdown = document.getElementById('nav-fasilitas-dropdown');
    const fasilitasArrow = document.getElementById('nav-fasilitas-arrow');

    let isMenuOpen = false;
    let openScrollY = 0;
    let isFasilitasOpen = false;

    function setFasilitasDropdown(open: boolean) {
      isFasilitasOpen = open;
      fasilitasToggleBtn?.setAttribute('aria-expanded', String(open));
      if (open) {
        fasilitasDropdown?.classList.remove('grid-rows-[0fr]', 'opacity-0');
        fasilitasDropdown?.classList.add('grid-rows-[1fr]', 'opacity-100');
        fasilitasArrow?.classList.add('rotate-180', 'text-[#d8c39e]');
      } else {
        fasilitasDropdown?.classList.remove('grid-rows-[1fr]', 'opacity-100');
        fasilitasDropdown?.classList.add('grid-rows-[0fr]', 'opacity-0');
        fasilitasArrow?.classList.remove('rotate-180', 'text-[#d8c39e]');
      }
    }

    fasilitasToggleBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setFasilitasDropdown(!isFasilitasOpen);
    });

    function setMenuState(open: boolean) {
      if (isMenuOpen === open) return;
      isMenuOpen = open;
      toggleBtn?.setAttribute('aria-expanded', String(open));

      if (open) {
        openScrollY = window.scrollY;

        expandedBody?.classList.remove('grid-rows-[0fr]', 'opacity-0');
        expandedBody?.classList.add('grid-rows-[1fr]', 'opacity-100');
        navTopRow?.classList.add('border-white/10');
        if (labelText) labelText.innerText = 'CLOSE';
        if (labelIcon) {
          labelIcon.innerText = '✕';
          labelIcon.classList.add('text-[#d8c39e]', 'rotate-90');
        }

        if (navBackdrop) {
          navBackdrop.classList.remove('opacity-0', 'pointer-events-none');
          navBackdrop.classList.add('opacity-100', 'pointer-events-auto');
        }

        if (waFloating) {
          waFloating.style.opacity = '0';
          waFloating.style.visibility = 'hidden';
          waFloating.style.pointerEvents = 'none';
        }
      } else {
        expandedBody?.classList.remove('grid-rows-[1fr]', 'opacity-100');
        expandedBody?.classList.add('grid-rows-[0fr]', 'opacity-0');
        navTopRow?.classList.remove('border-white/10');
        if (labelText) labelText.innerText = 'MENU';
        if (labelIcon) {
          labelIcon.innerText = '↓';
          labelIcon.classList.remove('text-[#d8c39e]', 'rotate-90');
        }

        if (navBackdrop) {
          navBackdrop.classList.remove('opacity-100', 'pointer-events-auto');
          navBackdrop.classList.add('opacity-0', 'pointer-events-none');
        }

        if (waFloating) {
          waFloating.style.opacity = '';
          waFloating.style.visibility = '';
          waFloating.style.pointerEvents = '';
        }

        setFasilitasDropdown(false);
      }
    }

    toggleBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      setMenuState(!isMenuOpen);
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', () => setMenuState(false));
      navBackdrop.addEventListener('pointerdown', () => setMenuState(false));
    }

    window.addEventListener(
      'scroll',
      () => {
        if (isMenuOpen && Math.abs(window.scrollY - openScrollY) > 35) {
          setMenuState(false);
        }
      },
      { passive: true }
    );

    scrollContent?.addEventListener(
      'wheel',
      (e) => {
        e.stopPropagation();
      },
      { passive: true }
    );

    waCtaBtn?.addEventListener('click', () => {
      setMenuState(false);
    });

    function scrollToHashTarget(targetHash: string) {
      const lenis = window.__lenis;
      if (lenis) {
        if (targetHash === '#hero-section' || targetHash === '#' || targetHash === '') {
          lenis.scrollTo(0, { duration: 1.6 });
        } else {
          lenis.scrollTo(targetHash, { offset: -30, duration: 1.6 });
        }
      } else {
        const el = document.querySelector(targetHash);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    }

    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetHref = link.getAttribute('href');
        setMenuState(false);
        if (!targetHref) return;

        const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
        const [linkPath, linkHash] = targetHref.split('#');
        const normalizedLinkPath = (linkPath || '').replace(/\/$/, '') || '/';

        if (linkHash && (normalizedLinkPath === currentPath || normalizedLinkPath === '')) {
          e.preventDefault();
          scrollToHashTarget(`#${linkHash}`);
          return;
        }

        const isHome = currentPath === '/';

        if (targetHref.startsWith('#') || targetHref.startsWith('/#')) {
          if (isHome) {
            e.preventDefault();
            scrollToHashTarget(targetHref.replace('/', ''));
          }
        } else if (isHome && targetHref === '/') {
          e.preventDefault();
          const lenis = window.__lenis;
          if (lenis) lenis.scrollTo(0, { duration: 1.6 });
          else window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    document.addEventListener('click', (e) => {
      const target = e.target as Node | null;
      if (isMenuOpen && navContainer && target && !navContainer.contains(target)) {
        setMenuState(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setMenuState(false);
      }
    });
  });
}
