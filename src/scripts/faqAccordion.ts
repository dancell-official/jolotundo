import { onReady } from './domReady';

/** Expand/collapse FAQ accordion items with animated +/- indicator. */
export function initFaqAccordion(): void {
  onReady(() => {
    const triggers = document.querySelectorAll<HTMLElement>('.faq-trigger');
    if (!triggers.length) return;

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.faq-item');
        if (!item) return;

        const answerWrapper = item.querySelector<HTMLElement>('.faq-answer-wrapper');
        const vBar = item.querySelector<HTMLElement>('.faq-v-bar');
        const iconBox = item.querySelector<HTMLElement>('.faq-icon-box');
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
          trigger.setAttribute('aria-expanded', 'false');
          if (answerWrapper) {
            answerWrapper.style.maxHeight = '0px';
            answerWrapper.style.opacity = '0';
          }
          if (vBar) {
            vBar.classList.remove('scale-y-0', 'rotate-90', 'opacity-0');
            vBar.classList.add('scale-y-100', 'rotate-0', 'opacity-100');
          }
          if (iconBox) {
            iconBox.classList.remove('rotate-180');
            iconBox.classList.add('rotate-0');
          }
        } else {
          trigger.setAttribute('aria-expanded', 'true');
          if (answerWrapper) {
            answerWrapper.style.maxHeight = `${answerWrapper.scrollHeight + 50}px`;
            answerWrapper.style.opacity = '1';
          }
          if (vBar) {
            vBar.classList.remove('scale-y-100', 'rotate-0', 'opacity-100');
            vBar.classList.add('scale-y-0', 'rotate-90', 'opacity-0');
          }
          if (iconBox) {
            iconBox.classList.remove('rotate-0');
            iconBox.classList.add('rotate-180');
          }
        }
      });
    });
  });
}
