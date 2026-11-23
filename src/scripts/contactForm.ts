import { onReady } from './domReady';

const GENERAL_WA_NUMBER = '6282229500998';
const OUTBOUND_WA_NUMBER = '6282249829998';

/** Auto-routes contact enquiry submissions to the appropriate WhatsApp concierge number. */
export function initContactForm(): void {
  onReady(() => {
    const form = document.getElementById('contact-enquiry-form') as HTMLFormElement | null;
    const categorySelect = document.getElementById('form-category') as HTMLSelectElement | null;
    const btnLabel = document.getElementById('btn-label-text');
    if (!form || !categorySelect) return;

    function updateButtonDestination() {
      if (!categorySelect || !btnLabel) return;
      const isOutbound = categorySelect.value === 'outbound';
      btnLabel.textContent = isOutbound
        ? 'Hubungi WhatsApp Khusus Outbound (0822 4982 9998)'
        : 'Hubungi WhatsApp Umum (0822 2950 0998)';
    }

    categorySelect.addEventListener('change', updateButtonDestination);
    updateButtonDestination();

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const catValue = categorySelect.value;
      const isOutbound = catValue === 'outbound';
      const targetNumber = isOutbound ? OUTBOUND_WA_NUMBER : GENERAL_WA_NUMBER;

      const catText =
        categorySelect.options[categorySelect.selectedIndex]?.text || 'Reservasi Kawasan';
      const dateVal =
        (document.getElementById('form-date') as HTMLInputElement | null)?.value.trim() ||
        'Fleksibel / Belum Ditentukan';
      const guestsVal =
        (document.getElementById('form-guests') as HTMLInputElement | null)?.value.trim() || '-';
      const nameVal =
        (document.getElementById('form-name') as HTMLInputElement | null)?.value.trim() ||
        'Tamu Jolotundo';
      const notesVal =
        (document.getElementById('form-notes') as HTMLTextAreaElement | null)?.value.trim() || '-';

      const waMessage = `Halo Admin ${isOutbound ? 'Outbound & Gathering Dan Group' : 'Jolotundo Glamping'}, saya ingin konsultasi:

• Kategori: ${catText}
• Rencana Tanggal: ${dateVal}
• Jumlah Tamu: ${guestsVal}
• Nama / Instansi: ${nameVal}
• Catatan: ${notesVal}

Mohon informasi jadwal ketersediaan dan penawarannya. Terima kasih!`;

      const targetUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(waMessage)}`;
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    });
  });
}
