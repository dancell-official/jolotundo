import { onReady } from './domReady';

/** Interactive 2D masterplan viewport (pan, zoom, pinch, filter, search, and zone callout). */
export function initMasterplan2DMap(): void {
  onReady(() => {
    const viewport = document.getElementById('map-pan-zoom-viewport');
    const svgMap = document.getElementById('interactive-svg-map');
    const highlightGroup = document.getElementById('map-highlight-group');
    const highlightOuter = document.getElementById('map-highlight-ring-outer');
    const highlightInner = document.getElementById('map-highlight-ring-inner');

    const callout = document.getElementById('map-floating-callout');
    const calloutBadge = document.getElementById('callout-badge');
    const calloutSub = document.getElementById('callout-sub');
    const calloutTitle = document.getElementById('callout-title');
    const calloutDesc = document.getElementById('callout-desc');
    const calloutLink = document.getElementById('callout-link');
    const calloutLinkText = document.getElementById('callout-link-text');
    const calloutCloseBtn = document.getElementById('callout-close-btn');

    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const zoomResetBtn = document.getElementById('zoom-reset-btn');
    const zoomIndicator = document.getElementById('zoom-level-indicator');
    const canvasZoomIn = document.getElementById('canvas-zoom-in');
    const canvasZoomOut = document.getElementById('canvas-zoom-out');
    const canvasZoomReset = document.getElementById('canvas-zoom-reset');

    const searchInput = document.getElementById('map-search-input') as HTMLInputElement | null;
    const searchBtn = document.getElementById('map-search-btn');
    const filterBtns = document.querySelectorAll<HTMLElement>('.map-filter-btn');
    const zones = document.querySelectorAll<HTMLElement>('.map-interactive-zone');
    const quickBtns = document.querySelectorAll<HTMLElement>('.quick-zone-btn');

    const titleEl = document.getElementById('inspector-title');
    const subEl = document.getElementById('inspector-sub');
    const descEl = document.getElementById('inspector-desc');
    const linkEl = document.getElementById('inspector-link');
    const linkLabelEl = document.getElementById('inspector-link-label');
    const badgeEl = document.getElementById('inspector-badge');

    if (!viewport || !svgMap) return;
    const mapViewport = viewport;
    const mapSvg = svgMap;

    const MAP_W = 1200;
    const MAP_H = 1650;
    const PAD_X = 24;
    const PAD_Y = 28;
    const TOTAL_W = MAP_W + PAD_X * 2;
    const TOTAL_H = MAP_H + PAD_Y * 2;
    const MAP_ASPECT = TOTAL_W / TOTAL_H;
    const MIN_ZOOM = 0.85;
    const MAX_ZOOM = 3.5;

    let zoom = 1.0;
    let baseVw = TOTAL_W;
    let baseVh = TOTAL_H;
    let baseVx = -PAD_X;
    let baseVy = -PAD_Y;
    let vx = baseVx;
    let vy = baseVy;
    let vw = TOTAL_W;
    let vh = TOTAL_H;

    let activeAnchorX: number | null = null;
    let activeAnchorY: number | null = null;

    function getViewportRatio(): number {
      const rect = mapViewport.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return rect.width / rect.height;
      }
      return MAP_ASPECT;
    }

    function calculateBaseBounds() {
      const vRatio = getViewportRatio();
      if (vRatio >= MAP_ASPECT) {
        baseVh = TOTAL_H;
        baseVw = TOTAL_H * vRatio;
        baseVx = (MAP_W - baseVw) / 2;
        baseVy = -PAD_Y;
      } else {
        baseVw = TOTAL_W;
        baseVh = TOTAL_W / vRatio;
        baseVx = -PAD_X;
        baseVy = (MAP_H - baseVh) / 2;
      }
    }

    function clampViewBox() {
      calculateBaseBounds();
      vw = baseVw / zoom;
      vh = baseVh / zoom;

      const marginX = Math.max(0, (baseVw - MAP_W) / 2);
      const marginY = Math.max(0, (baseVh - MAP_H) / 2);

      const minVx = -marginX - PAD_X - 120;
      const maxVx = Math.max(minVx, MAP_W + marginX + PAD_X + 120 - vw);
      const minVy = -marginY - PAD_Y - 80;
      const maxVy = Math.max(minVy, MAP_H + marginY + PAD_Y + 80 - vh);

      if (zoom <= 1.01) {
        vx = baseVx;
        vy = baseVy;
      } else {
        vx = Math.max(minVx, Math.min(maxVx, vx));
        vy = Math.max(minVy, Math.min(maxVy, vy));
      }
    }

    function updateCalloutPosition() {
      if (!callout || activeAnchorX === null || activeAnchorY === null) return;
      if (callout.classList.contains('hidden')) return;

      const rect = mapViewport.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const relX = (activeAnchorX - vx) / vw;
      const relY = (activeAnchorY - vy) / vh;

      const pixelX = Math.max(155, Math.min(rect.width - 155, relX * rect.width));
      const pixelY = Math.max(185, Math.min(rect.height - 24, relY * rect.height));

      callout.style.left = `${pixelX.toFixed(1)}px`;
      callout.style.top = `${pixelY.toFixed(1)}px`;
    }

    function applyViewBox() {
      clampViewBox();
      mapSvg.setAttribute(
        'viewBox',
        `${vx.toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`
      );
      if (zoomIndicator) {
        zoomIndicator.textContent = `${Math.round(zoom * 100)}%`;
      }
      updateCalloutPosition();
    }

    function zoomToPoint(newZoom: number, focusSvgX?: number, focusSvgY?: number) {
      calculateBaseBounds();
      const clampedZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
      const cx = focusSvgX !== undefined ? focusSvgX : vx + vw / 2;
      const cy = focusSvgY !== undefined ? focusSvgY : vy + vh / 2;

      const relX = (cx - vx) / vw;
      const relY = (cy - vy) / vh;

      zoom = clampedZoom;
      vw = baseVw / zoom;
      vh = baseVh / zoom;

      vx = cx - relX * vw;
      vy = cy - relY * vh;

      applyViewBox();
    }

    function centerOnSvgPoint(targetX: number, targetY: number, targetZoom?: number) {
      calculateBaseBounds();
      if (targetZoom && targetZoom > zoom) {
        zoom = Math.min(MAX_ZOOM, targetZoom);
      }
      vw = baseVw / zoom;
      vh = baseVh / zoom;
      vx = targetX - vw / 2;
      vy = targetY - vh / 2;
      applyViewBox();
    }

    function handleZoomIn() {
      zoomToPoint(zoom + 0.35, activeAnchorX ?? vx + vw / 2, activeAnchorY ?? vy + vh / 2);
    }
    function handleZoomOut() {
      zoomToPoint(zoom - 0.35, activeAnchorX ?? vx + vw / 2, activeAnchorY ?? vy + vh / 2);
    }
    function handleZoomReset() {
      calculateBaseBounds();
      zoom = 1.0;
      vx = baseVx;
      vy = baseVy;
      applyViewBox();
    }

    zoomInBtn?.addEventListener('click', handleZoomIn);
    canvasZoomIn?.addEventListener('click', handleZoomIn);
    zoomOutBtn?.addEventListener('click', handleZoomOut);
    canvasZoomOut?.addEventListener('click', handleZoomOut);
    zoomResetBtn?.addEventListener('click', handleZoomReset);
    canvasZoomReset?.addEventListener('click', handleZoomReset);

    let isPinching = false;

    mapViewport.addEventListener('mouseenter', () => {
      if (window.__lenis) {
        window.__lenis.stop();
      }
    });

    mapViewport.addEventListener('mouseleave', () => {
      if (window.__lenis && !isPinching) {
        window.__lenis.start();
      }
    });

    window.addEventListener('blur', () => {
      if (window.__lenis) window.__lenis.start();
    });

    mapViewport.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        e.stopPropagation();

        const rect = mapViewport.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const mouseRelX = (e.clientX - rect.left) / rect.width;
        const mouseRelY = (e.clientY - rect.top) / rect.height;
        const focusX = vx + mouseRelX * vw;
        const focusY = vy + mouseRelY * vh;

        const delta = e.deltaY < 0 ? 0.32 : -0.32;
        zoomToPoint(zoom + delta, focusX, focusY);
      },
      { passive: false }
    );

    let isMouseDragging = false;
    let dragMoved = false;
    let startClientX = 0;
    let startClientY = 0;
    let startVx = 0;
    let startVy = 0;

    mapViewport.addEventListener('mousedown', (e) => {
      const target = e.target as Node | null;
      if (callout && target && callout.contains(target)) return;
      isMouseDragging = true;
      dragMoved = false;
      startClientX = e.clientX;
      startClientY = e.clientY;
      startVx = vx;
      startVy = vy;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isMouseDragging) return;
      const dx = e.clientX - startClientX;
      const dy = e.clientY - startClientY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        dragMoved = true;
      }

      const rect = mapViewport.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      if (zoom <= 1.01 && dragMoved) {
        calculateBaseBounds();
        zoom = 1.35;
        vw = baseVw / zoom;
        vh = baseVh / zoom;
        startVx = (MAP_W - vw) / 2;
        startVy = (MAP_H - vh) / 2;
      }

      const svgDx = (dx / rect.width) * vw;
      const svgDy = (dy / rect.height) * vh;

      vx = startVx - svgDx;
      vy = startVy - svgDy;
      applyViewBox();
    });

    window.addEventListener('mouseup', () => {
      isMouseDragging = false;
    });

    const gestureOverlay = document.getElementById('mobile-gesture-overlay');
    let overlayTimeout: ReturnType<typeof setTimeout> | null = null;

    function showGestureHint() {
      if (!gestureOverlay) return;
      gestureOverlay.classList.remove('opacity-0');
      gestureOverlay.classList.add('opacity-100');
      if (overlayTimeout) clearTimeout(overlayTimeout);
      overlayTimeout = setTimeout(() => {
        gestureOverlay.classList.remove('opacity-100');
        gestureOverlay.classList.add('opacity-0');
      }, 1200);
    }

    let initialTouchDistance: number | null = null;
    let initialTouchZoom = zoom;
    let touchStartMidX = 0;
    let touchStartMidY = 0;
    let touchFocusSvgX = 0;
    let touchFocusSvgY = 0;
    let lastTapTime = 0;
    let singleTouchMoved = false;

    mapViewport.addEventListener(
      'touchstart',
      (e) => {
        const target = e.target as Node | null;
        if (callout && target && callout.contains(target)) return;

        if (e.touches.length === 2) {
          isPinching = true;
          const t0 = e.touches[0];
          const t1 = e.touches[1];

          initialTouchDistance = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
          initialTouchZoom = zoom;

          const rect = mapViewport.getBoundingClientRect();
          touchStartMidX = (t0.clientX + t1.clientX) / 2;
          touchStartMidY = (t0.clientY + t1.clientY) / 2;
          startVx = vx;
          startVy = vy;

          const relX = (touchStartMidX - rect.left) / rect.width;
          const relY = (touchStartMidY - rect.top) / rect.height;
          touchFocusSvgX = vx + relX * vw;
          touchFocusSvgY = vy + relY * vh;

          if (window.__lenis) window.__lenis.stop();
          e.preventDefault();
        } else if (e.touches.length === 1) {
          isPinching = false;
          initialTouchDistance = null;
          singleTouchMoved = false;
        }
      },
      { passive: false }
    );

    mapViewport.addEventListener(
      'touchmove',
      (e) => {
        if (e.touches.length === 2 && isPinching && initialTouchDistance) {
          e.preventDefault();
          e.stopPropagation();

          const t0 = e.touches[0];
          const t1 = e.touches[1];
          const currentDistance = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
          const rect = mapViewport.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;

          const scale = currentDistance / initialTouchDistance;
          const targetZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, initialTouchZoom * scale));

          const currentMidX = (t0.clientX + t1.clientX) / 2;
          const currentMidY = (t0.clientY + t1.clientY) / 2;
          const dx = currentMidX - touchStartMidX;
          const dy = currentMidY - touchStartMidY;

          zoom = targetZoom;
          vw = baseVw / zoom;
          vh = baseVh / zoom;

          const relX = (touchStartMidX - rect.left) / rect.width;
          const relY = (touchStartMidY - rect.top) / rect.height;

          vx = touchFocusSvgX - relX * vw - (dx / rect.width) * vw;
          vy = touchFocusSvgY - relY * vh - (dy / rect.height) * vh;

          applyViewBox();
        } else if (e.touches.length === 1) {
          if (!singleTouchMoved) {
            singleTouchMoved = true;
            showGestureHint();
          }
        }
      },
      { passive: false }
    );

    mapViewport.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) {
        isPinching = false;
        initialTouchDistance = null;
        if (window.__lenis) window.__lenis.start();
      }

      if (e.changedTouches.length === 1 && e.touches.length === 0) {
        const now = Date.now();
        if (now - lastTapTime < 300) {
          const touch = e.changedTouches[0];
          const rect = mapViewport.getBoundingClientRect();
          const mouseRelX = (touch.clientX - rect.left) / rect.width;
          const mouseRelY = (touch.clientY - rect.top) / rect.height;
          const focusX = vx + mouseRelX * vw;
          const focusY = vy + mouseRelY * vh;

          if (zoom > 1.8) {
            handleZoomReset();
          } else {
            zoomToPoint(zoom + 0.8, focusX, focusY);
          }
        }
        lastTapTime = now;
      }
    });

    mapViewport.addEventListener('touchcancel', () => {
      isPinching = false;
      initialTouchDistance = null;
      if (window.__lenis) window.__lenis.start();
    });

    calloutCloseBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      callout?.classList.add('hidden');
      highlightGroup?.classList.add('hidden');
      activeAnchorX = null;
      activeAnchorY = null;
    });

    function selectZoneElement(el: HTMLElement, autoZoomIn = false) {
      const title = el.getAttribute('data-zone-title') || 'Zona Jolotundo';
      const sub = el.getAttribute('data-zone-sub') || 'KAWASAN UTAMA';
      const desc = el.getAttribute('data-zone-desc') || '';
      const link = el.getAttribute('data-zone-link') || '/akomodasi/';
      const cat = (el.getAttribute('data-zone-category') || 'ZONA').toUpperCase();

      const actionLabel = link.includes('wahana')
        ? 'Lihat Detail Wahana'
        : link.includes('event')
        ? 'Lihat Detail Venue & Event'
        : 'Lihat Detail & Reservasi';

      if (titleEl) titleEl.textContent = title;
      if (subEl) subEl.textContent = sub;
      if (descEl) descEl.textContent = desc;
      if (badgeEl) badgeEl.textContent = cat;
      if (linkEl) linkEl.setAttribute('href', link);
      if (linkLabelEl) linkLabelEl.textContent = actionLabel;

      let ax = parseFloat(el.getAttribute('data-anchor-x') || '');
      let ay = parseFloat(el.getAttribute('data-anchor-y') || '');

      if (isNaN(ax) || isNaN(ay)) {
        const transformAttr = el.getAttribute('transform') || '';
        const match = transformAttr.match(/translate\(([-0-9.]+),\s*([-0-9.]+)\)/);
        if (match) {
          ax = parseFloat(match[1]);
          ay = parseFloat(match[2]);
        } else {
          ax = 600;
          ay = 820;
        }
      }

      activeAnchorX = ax;
      activeAnchorY = ay;

      if (highlightGroup && highlightOuter && highlightInner) {
        highlightOuter.setAttribute('cx', String(ax));
        highlightOuter.setAttribute('cy', String(ay));
        highlightInner.setAttribute('cx', String(ax));
        highlightInner.setAttribute('cy', String(ay));
        highlightGroup.classList.remove('hidden');
      }

      if (callout) {
        if (calloutBadge) calloutBadge.textContent = cat;
        if (calloutSub) calloutSub.textContent = sub;
        if (calloutTitle) calloutTitle.textContent = title;
        if (calloutDesc) calloutDesc.textContent = desc;
        if (calloutLink) calloutLink.setAttribute('href', link);
        if (calloutLinkText) calloutLinkText.textContent = actionLabel;
        callout.classList.remove('hidden');
      }

      if (autoZoomIn) {
        centerOnSvgPoint(ax, ay, Math.max(zoom, 1.85));
      } else {
        updateCalloutPosition();
      }
    }

    zones.forEach((zone) => {
      zone.addEventListener('click', (e) => {
        e.stopPropagation();
        if (dragMoved) return;
        selectZoneElement(zone, false);
      });
    });

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        filterBtns.forEach((b) => {
          b.className =
            'map-filter-btn px-3.5 py-2 text-xs font-mono-tag uppercase tracking-wider bg-transparent text-[#141110] border border-[#141110]/25 hover:border-[#141110] cursor-pointer transition-all';
        });
        btn.className =
          'map-filter-btn active px-3.5 py-2 text-xs font-mono-tag uppercase tracking-wider bg-[#141110] text-[#f4efe6] border border-[#141110] font-bold cursor-pointer transition-all';

        zones.forEach((z) => {
          const zCat = z.getAttribute('data-zone-category');
          if (filter === 'all' || zCat === filter) {
            z.classList.remove('is-dimmed');
            z.classList.add('is-highlighted');
          } else {
            z.classList.add('is-dimmed');
            z.classList.remove('is-highlighted');
          }
        });
      });
    });

    quickBtns.forEach((qBtn) => {
      qBtn.addEventListener('click', () => {
        const query = qBtn.getAttribute('data-quick-zone') || '';
        const target = Array.from(zones).find((z) =>
          (z.getAttribute('data-zone-title') || '').toLowerCase().includes(query.toLowerCase())
        );
        if (target) {
          selectZoneElement(target, true);
        }
      });
    });

    function handleSearch() {
      if (!searchInput) return;
      const raw = searchInput.value.trim();
      if (!raw) return;

      const numMatch = raw.match(/^\d+$/);
      if (numMatch) {
        const numInt = parseInt(raw, 10);
        const plotEl = document.getElementById(`tent-plot-${numInt}`);
        if (plotEl) {
          selectZoneElement(plotEl, true);
          return;
        }
      }

      const found = Array.from(zones).find((z) =>
        (z.getAttribute('data-zone-title') || '').toLowerCase().includes(raw.toLowerCase())
      );
      if (found) {
        selectZoneElement(found, true);
      }
    }

    searchBtn?.addEventListener('click', handleSearch);
    searchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSearch();
    });

    function handleResize() {
      calculateBaseBounds();
      applyViewBox();
    }

    window.addEventListener('resize', handleResize);

    calculateBaseBounds();
    applyViewBox();
  });
}
