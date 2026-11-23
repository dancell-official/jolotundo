import { onReady } from './domReady';

/** Heyzine 3D interactive menu flipbook viewer, chapter jumps, mobile guard & fullscreen modal. */
export function initHeyzineMenuBook(rootId = 'daftar-menu'): void {
  onReady(() => {
    const root = document.getElementById(rootId);
    const heyzineFrame = document.getElementById('heyzine-menu-frame') as HTMLIFrameElement | null;
    if (!root || !heyzineFrame) return;

    const flipbookUrl = root.dataset.flipbookUrl;
    if (!flipbookUrl) return;

    const totalBookPages = Math.max(1, parseInt(root.dataset.totalPages || '10', 10));
    let chapterTitles: string[] = [];
    try {
      chapterTitles = JSON.parse(root.dataset.chapters || '[]');
    } catch {
      chapterTitles = [];
    }

    const fullscreenBtn = document.getElementById('heyzine-fullscreen-btn');
    const chapterJumpBtns = document.querySelectorAll<HTMLElement>('.chapter-jump-btn');
    const mobilePrevBtn = document.getElementById('mobile-prev-page-btn');
    const mobileNextBtn = document.getElementById('mobile-next-page-btn');
    const mobilePageIndicator = document.getElementById('mobile-page-indicator');

    let currentBookPage = 1;

    function updateActivePage(pageNum: number) {
      currentBookPage = Math.max(1, Math.min(totalBookPages, pageNum));
      if (heyzineFrame) {
        heyzineFrame.src = `${flipbookUrl}#page/${currentBookPage}`;
      }
      if (mobilePageIndicator) {
        mobilePageIndicator.textContent = `Hal ${String(currentBookPage).padStart(2, '0')}`;
      }

      chapterJumpBtns.forEach((b) => {
        const p = parseInt(b.getAttribute('data-jump-page') || '1', 10);
        if (p === currentBookPage) {
          b.classList.add('bg-[#141110]', 'text-white', 'border-[#141110]');
          b.classList.remove('bg-white', 'text-[#141110]/80');
        } else {
          b.classList.remove('bg-[#141110]', 'text-white', 'border-[#141110]');
          b.classList.add('bg-white', 'text-[#141110]/80');
        }
      });
    }

    mobilePrevBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      updateActivePage(currentBookPage - 1);
    });

    mobileNextBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      updateActivePage(currentBookPage + 1);
    });

    chapterJumpBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const pageNum = parseInt(btn.getAttribute('data-jump-page') || '1', 10);
        updateActivePage(pageNum);
        root.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    const fullscreenModal = document.getElementById('menu-fullscreen-modal');
    const modalHeyzineFrame = document.getElementById(
      'modal-heyzine-frame'
    ) as HTMLIFrameElement | null;
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalFloatingExitBtn = document.getElementById('modal-floating-exit-btn');
    const modalPrevBtn = document.getElementById('modal-prev-btn');
    const modalNextBtn = document.getElementById('modal-next-btn');
    const modalPageNum = document.getElementById('modal-page-num');
    const modalChapterTitle = document.getElementById('modal-chapter-title');

    function updateModalState(pageNum: number) {
      if (modalPageNum) {
        modalPageNum.textContent = `Hal ${String(pageNum).padStart(2, '0')}`;
      }
      if (modalChapterTitle) {
        modalChapterTitle.textContent = chapterTitles[pageNum - 1] || 'Buku Menu';
      }
    }

    function openFullscreenModal() {
      if (!fullscreenModal || !modalHeyzineFrame) return;

      modalHeyzineFrame.src = `${flipbookUrl}#page/${currentBookPage}`;
      updateModalState(currentBookPage);

      fullscreenModal.classList.remove('hidden');
      fullscreenModal.classList.add('flex');

      document.body.style.overflow = 'hidden';
      if (window.__lenis) window.__lenis.stop();

      try {
        if (fullscreenModal.requestFullscreen) {
          fullscreenModal.requestFullscreen().catch(() => {});
        } else if (fullscreenModal.webkitRequestFullscreen) {
          fullscreenModal.webkitRequestFullscreen();
        }
      } catch {
        // Native fullscreen is optional; fixed viewport modal remains active
      }
    }

    function closeFullscreenModal() {
      if (!fullscreenModal) return;

      try {
        if (document.fullscreenElement || document.webkitFullscreenElement) {
          if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
          else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        }
      } catch {
        // Ignore exit error
      }

      fullscreenModal.classList.remove('flex');
      fullscreenModal.classList.add('hidden');

      if (modalHeyzineFrame) {
        modalHeyzineFrame.src = '';
      }

      document.body.style.overflow = '';
      if (window.__lenis) window.__lenis.start();

      updateActivePage(currentBookPage);
    }

    modalCloseBtn?.addEventListener('click', closeFullscreenModal);
    modalFloatingExitBtn?.addEventListener('click', closeFullscreenModal);

    modalPrevBtn?.addEventListener('click', () => {
      if (currentBookPage > 1) {
        currentBookPage--;
        if (modalHeyzineFrame) {
          modalHeyzineFrame.src = `${flipbookUrl}#page/${currentBookPage}`;
        }
        updateModalState(currentBookPage);
      }
    });

    modalNextBtn?.addEventListener('click', () => {
      if (currentBookPage < totalBookPages) {
        currentBookPage++;
        if (modalHeyzineFrame) {
          modalHeyzineFrame.src = `${flipbookUrl}#page/${currentBookPage}`;
        }
        updateModalState(currentBookPage);
      }
    });

    window.addEventListener('keydown', (e) => {
      if (
        e.key === 'Escape' &&
        fullscreenModal &&
        !fullscreenModal.classList.contains('hidden')
      ) {
        closeFullscreenModal();
      }
    });

    document.addEventListener('fullscreenchange', () => {
      if (
        !document.fullscreenElement &&
        fullscreenModal &&
        !fullscreenModal.classList.contains('hidden')
      ) {
        closeFullscreenModal();
      }
    });
    document.addEventListener('webkitfullscreenchange', () => {
      if (
        !document.webkitFullscreenElement &&
        fullscreenModal &&
        !fullscreenModal.classList.contains('hidden')
      ) {
        closeFullscreenModal();
      }
    });

    const mobileGuard = document.getElementById('mobile-scroll-guard');
    const mobileToggleTouchBtn = document.getElementById('mobile-toggle-touch-btn');
    const mobileTouchLabel = document.getElementById('mobile-touch-label');
    const mobileOverlayFsBtn = document.getElementById('mobile-overlay-fs-trigger');

    let isDirectTouch = false;

    mobileToggleTouchBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      isDirectTouch = !isDirectTouch;
      if (isDirectTouch) {
        mobileGuard?.classList.remove('pointer-events-auto');
        mobileGuard?.classList.add('pointer-events-none');
        if (mobileTouchLabel) mobileTouchLabel.textContent = '🔒 Kunci Gulir';
        mobileToggleTouchBtn.classList.add(
          'pointer-events-auto',
          'bg-[#d8c39e]',
          'text-[#141110]'
        );
        mobileToggleTouchBtn.classList.remove('bg-black/80', 'text-white/90');
      } else {
        mobileGuard?.classList.remove('pointer-events-none');
        mobileGuard?.classList.add('pointer-events-auto');
        if (mobileTouchLabel) mobileTouchLabel.textContent = '👆 Buka Sentuh Buku';
        mobileToggleTouchBtn.classList.remove('bg-[#d8c39e]', 'text-[#141110]');
        mobileToggleTouchBtn.classList.add('bg-black/80', 'text-white/90');
      }
    });

    mobileOverlayFsBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      openFullscreenModal();
    });

    fullscreenBtn?.addEventListener('click', openFullscreenModal);
  });
}
