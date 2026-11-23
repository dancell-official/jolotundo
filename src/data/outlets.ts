import type { GalleryImageItem } from './galleries';
import type { GallerySpecItem } from '../components/common/HorizontalPreviewGallery.astro';

export interface OutletChapter {
  page: number;
  title: string;
  tag?: string;
}

export interface OutletPlaceRow {
  label: string;
  title: string;
  desc: string;
}

export interface OutletSwitcherCard {
  href: string;
  tag: string;
  title: string;
  desc: string;
  ctaLabel: string;
}

export interface OutletConfig {
  id: 'river-breeze' | 'jolotundo-cafe';
  seo: {
    title: string;
    description: string;
    keywords: string;
    breadcrumbName: string;
    path: string;
    schemaType: 'Restaurant' | 'CafeOrCoffeeShop';
    schemaName: string;
    schemaDescription: string;
    servesCuisine: string[];
    priceRange: string;
    opens: string;
    closes: string;
  };
  waDefaultMessage: string;
  hero: {
    sectionId: string;
    parallaxLayerId: string;
    imageSrc: string;
    imageAlt: string;
    kicker: string;
    headline: string;
    subtitle: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    locationBadge: string;
    capacityText: string;
    hoursText: string;
    entryText: string;
  };
  place: {
    headlineText: string;
    subtitle: string;
    rows: OutletPlaceRow[];
  };
  menu: {
    kicker: string;
    headline: string;
    description: string;
    pdfHref: string;
    pdfDownloadName: string;
    quickNewTabHref: string;
    flipbookUrl: string;
    toolbarTitle: string;
    modalEyebrow: string;
    modalAriaLabel: string;
    iframeTitle: string;
    modalIframeTitle: string;
    tipsDesktop: string;
    tipsMobile: string;
    waCtaLabel: string;
    chapters: OutletChapter[];
    showFloatingExitBtn: boolean;
    showMobileOverlayTriggers: boolean;
  };
  gallery: {
    sectionId: string;
    viewportId: string;
    windowId: string;
    trackId: string;
    progressBarId: string;
    topLeftText: string;
    topRightDesktopText: string;
    title: string;
    subtitle: string;
    specs: [GallerySpecItem, GallerySpecItem, GallerySpecItem];
    ctaLabel: string;
    images: GalleryImageItem[];
  };
  guidanceBanner: {
    kicker: string;
    headline: string;
    htmlBody: string;
    ctaLabel: string;
    noteText: string;
  };
  switcherCards: [OutletSwitcherCard, OutletSwitcherCard];
}

export const OUTLETS: Record<'river-breeze' | 'jolotundo-cafe', OutletConfig> = {
  'river-breeze': {
    id: 'river-breeze',
    seo: {
      title: 'River Breeze Resto — Kuliner Tepi Sungai Jolotundo',
      description:
        'Kuliner tepi sungai alami di River Breeze Cafe & Resto Jolotundo Bajulan, Nganjuk. Tersedia menu Nusantara, gurami, steak & kopi.',
      keywords:
        'jolotundo, river breeze jolotundo, river breeze resto nganjuk, kuliner tepi sungai bajulan, resto jolotundo',
      breadcrumbName: 'River Breeze Cafe & Resto',
      path: '/fasilitas/river-breeze/',
      schemaType: 'Restaurant',
      schemaName: 'River Breeze Cafe & Resto',
      schemaDescription:
        'Kuliner tepi sungai alami di Jolotundo Glamping & Edupark, Bajulan, Nganjuk. Menyajikan hidangan Nusantara, gurami, steak, dan kopi.',
      servesCuisine: ['Indonesian', 'Seafood', 'Steakhouse', 'Coffee'],
      priceRange: 'Rp 20.000 - Rp 150.000',
      opens: '09:00',
      closes: '22:00',
    },
    waDefaultMessage:
      'Halo Admin Jolotundo, saya ingin reservasi meja / paket dining di River Breeze Cafe & Resto.',
    hero: {
      sectionId: 'river-hero',
      parallaxLayerId: 'river-hero-parallax-layer',
      imageSrc: '/images/resto/riverbreeze/breeze6.avif',
      imageAlt: 'River Breeze Cafe & Resto Tepi Sungai Jolotundo',
      kicker: '— RIVERSIDE DINING & LOUNGE',
      headline: 'River Breeze.',
      subtitle:
        'Santap istimewa di atas dek kayu alami, tepat di bibir aliran sungai jernih berbatu lereng Wilis.',
      primaryCtaLabel: 'Reservasi Meja',
      secondaryCtaLabel: 'Buka Menu',
      locationBadge: 'SEMPADAN SUNGAI BAJULAN',
      capacityText: '150 KURSI TAMU',
      hoursText: '08.00 — 22.00 WIB',
      entryText: 'FREE HTM',
    },
    place: {
      headlineText:
        'Aliran air jernih, panggung dek kayu alami, dan semilir kabut lereng Wilis yang tak pernah reda.',
      subtitle:
        'Suara gemericik air alami mengalir tepat di bawah lantai dek kayu, menghadirkan ketenangan yang menemani setiap suapan hidangan hangat dan seduhan kopi Anda.',
      rows: [
        {
          label: 'SETTING',
          title: 'Riverside Wooden Deck',
          desc: 'Panggung kayu ulin alami tepat di atas sempadan aliran sungai berbatu lereng Wilis.',
        },
        {
          label: 'KAPASITAS',
          title: '150 Kursi Tamu',
          desc: 'Kombinasi area terbuka tepi sungai (alfresco dining) dan paviliun semi-indoor beratap.',
        },
        {
          label: 'JAM BUKA',
          title: '08.00 — 22.00 WIB',
          desc: 'Buka setiap hari untuk umum & tamu menginap, tanpa tiket masuk (Free HTM).',
        },
        {
          label: 'SUASANA',
          title: 'Gemericik Air · Udara 18–22°C',
          desc: 'Hembusan kabut pinus alami berpadu lantunan live acoustic santai di akhir pekan.',
        },
        {
          label: 'MENU',
          title: 'Kuliner Nusantara & Kopi Wilis',
          desc: 'Rawon Iga rempah, Gurame Bakar Madu hutan, dan racikan kopi robusta Bajulan.',
        },
        {
          label: 'ATURAN',
          title: 'Makanan Luar Mulai 19.00 WIB',
          desc: 'Bebas membawa makanan dari luar atau alat BBQ sendiri setelah pukul 7 malam.',
        },
        {
          label: 'RESERVASI',
          title: 'Direct WhatsApp Concierge',
          desc: 'Pemesanan meja rombongan, live cooking BBQ, atau katering prasmanan.',
        },
      ],
    },
    menu: {
      kicker: '— BUKU MENU RESTO',
      headline: 'Buku Menu Resmi River Breeze.',
      description:
        'Disajikan dengan format buku menu terbuka dua halaman layaknya membuka buku menu fisik di atas meja kayu River Breeze. Jelajahi 15 halaman kuliner Nusantara, olahan gurami, steak, aneka snack, hingga racikan kopi lereng Wilis.',
      pdfHref: '/docs/menu-river-breeze.pdf',
      pdfDownloadName: 'Menu-River-Breeze-Jolotundo.pdf',
      quickNewTabHref: '/docs/menu-river-breeze.pdf',
      flipbookUrl: 'https://heyzine.com/flip-book/c71bd63935.html',
      toolbarTitle: 'RIVER BREEZE MENU',
      modalEyebrow: 'RIVER BREEZE // 3D FLIPBOOK MENU',
      modalAriaLabel: 'Buku Menu River Breeze Layar Penuh',
      iframeTitle: 'Buku Menu River Breeze Heyzine Flipbook',
      modalIframeTitle: 'Buku Menu River Breeze Fullscreen Viewer',
      tipsDesktop:
        'Tarik sudut kertas dengan mouse/sentuhan jari untuk membalik, atau klik tombol panah di dalam buku.',
      tipsMobile:
        'Geser sudut kertas, atau gunakan tombol Sebelumnya / Berikutnya di bawah buku menu.',
      waCtaLabel: 'Pesan Meja / Pre-Order via WhatsApp',
      chapters: [
        { page: 1, title: 'Cover Menu', tag: 'RIVER BREEZE' },
        { page: 2, title: 'Panduan Pemesanan', tag: 'ORDERING GUIDE' },
        { page: 3, title: 'Ayam & Bebek', tag: 'MAIN COURSE' },
        { page: 4, title: 'Nasi Goreng & Mie', tag: 'MAIN COURSE' },
        { page: 5, title: 'Seafood & Gurami', tag: 'MAIN COURSE' },
        { page: 6, title: 'Soup & Meatball', tag: 'MAIN COURSE' },
        { page: 7, title: 'Western Steak', tag: 'MAIN COURSE' },
        { page: 8, title: 'Snack & Gorengan', tag: 'CRUNCH BITES' },
        { page: 9, title: 'Chinese Snack & Dimsum', tag: 'DIMSUM' },
        { page: 10, title: 'Bapao & Onde-Onde', tag: 'DESSERT SNACK' },
        { page: 11, title: 'Dessert & Cheesecake', tag: 'SWEET BITES' },
        { page: 12, title: 'Kids Drink & Salad', tag: 'KIDS & FRUIT' },
        { page: 13, title: 'Minuman Nusantara', tag: 'TRADISIONAL' },
        { page: 14, title: 'Aneka Jus & Teh', tag: 'FRESH JUICE' },
        { page: 15, title: 'Specialty Coffee', tag: 'COFFEE BAR' },
      ],
      showFloatingExitBtn: true,
      showMobileOverlayTriggers: true,
    },
    gallery: {
      sectionId: 'river-preview-gallery',
      viewportId: 'river-gallery-sticky-viewport',
      windowId: 'river-slider-window',
      trackId: 'river-slider-track',
      progressBarId: 'river-progress-bar',
      topLeftText: 'PREVIEW GALLERY // SUASANA & PANORAMA RESTO',
      topRightDesktopText: 'Scroll ke bawah untuk eksplorasi visual suasana resto',
      title: 'River Breeze Cafe & Resto',
      subtitle: 'Riverside Deck · Bajulan Loceret',
      specs: [
        { value: '150 Kursi', label: 'KAPASITAS' },
        { value: '08.00–22.00', label: 'OPERASIONAL' },
        { value: 'Tepi Air', label: 'SUASANA' },
      ],
      ctaLabel: 'Reservasi Meja',
      images: [
        { src: '/images/resto/riverbreeze/breeze6.avif', caption: 'Fasad River Breeze Tepi Sungai', subtitle: 'Panggung Dek Kayu Ulin di Atas Aliran Air Alami' },
        { src: '/images/resto/riverbreeze/breeze1.avif', caption: 'Gemericik Sungai Wilis Jernih', subtitle: 'Kesejukan Mata Air Alami & Bebatuan Kali Asri' },
        { src: '/images/resto/riverbreeze/breeze2.avif', caption: 'Area Alfresco Dining Tepi Air', subtitle: 'Sensasi Santap di Bawah Teduhnya Kanopi Pinus' },
        { src: '/images/resto/riverbreeze/breeze3.avif', caption: 'Kesejukan Udara Pegunungan', subtitle: 'Hawa Bersih 18–22°C Tanpa Kebisingan Kota' },
        { src: '/images/resto/riverbreeze/breeze4.avif', caption: 'Meja Kayu Santai Keluarga', subtitle: 'Tempat Berkumpul Nyaman Bersama Orang Terdekat' },
        { src: '/images/resto/riverbreeze/breeze5.avif', caption: 'Panorama Sempadan Sungai', subtitle: 'Sudut Estetik Berlatar Rindangnya Pepohonan' },
        { src: '/images/resto/riverbreeze/breeze7.avif', caption: 'Kuliner Khas & Minuman Segar', subtitle: 'Hidangan Lezat Nusantara & Racikan Kopi Pilihan' },
        { src: '/images/resto/riverbreeze/breeze8.avif', caption: 'Ruang Duduk Rombongan Luas', subtitle: 'Kapasitas 150 Kursi Tamu Terbuka & Beratap' },
        { src: '/images/resto/riverbreeze/breeze9.avif', caption: 'Pendar Senja Hutan Wilis', subtitle: 'Pencahayaan Warm Ambient Romantis Tepi Sungai' },
        { src: '/images/resto/riverbreeze/breeze10.avif', caption: 'Malam Syahdu di Pinggir Kali', subtitle: 'Lampu Gantung Temaram & Kesejukan Malam Hari' },
        { src: '/images/resto/riverbreeze/breeze11.avif', caption: 'Lantunan Musik Santai Akhir Pekan', subtitle: 'Suasana Hangat Menemani Obrolan Panjang' },
        { src: '/images/resto/riverbreeze/breeze12.avif', caption: 'Paviliun Kayu Semi-Indoor', subtitle: 'Perlindungan Nyaman Saat Kabut Turun' },
        { src: '/images/resto/riverbreeze/breeze13.avif', caption: 'Keasrian Alami Bajulan', subtitle: 'Ekowisata Berkelanjutan Lereng Gunung Wilis' },
      ],
    },
    guidanceBanner: {
      kicker: '[ KEBIJAKAN RESMI // ATURAN MAKANAN DARI LUAR ]',
      headline: 'Ketentuan Membawa Makanan & Alat BBQ Pribadi',
      htmlBody:
        'Demi kenyamanan dan standar operasional area resto, pengunjung diperbolehkan membawa makanan dari luar serta membawa peralatan BBQ pribadi mulai pukul <strong>19.00 WIB (jam 7 malam)</strong>. Sebelum pukul 19.00 WIB, seluruh pesanan hidangan utama dan minuman dapat dipesan langsung melalui kasir River Breeze Cafe & Resto.',
      ctaLabel: 'Order Paket BBQ Siap Masak ↗',
      noteText: 'Tersedia Sewa Alat Panggangan & Arang',
    },
    switcherCards: [
      {
        href: '/fasilitas/jolotundo-cafe/',
        tag: '[ OUTLET 02 // NEXT ]',
        title: 'Jolotundo Cafe',
        desc: 'Open-air coffee bar & area bersantap teduh di bawah kanopi pinus dengan sajian kopi & latte, hidangan hangat, bapao, hingga camilan Nusantara. Buka mulai pukul 07.00 WIB.',
        ctaLabel: 'Buka Halaman Jolotundo Cafe',
      },
      {
        href: '/akomodasi/',
        tag: '[ OVERVIEW // 7 TIPE MENGINAP ]',
        title: 'Akomodasi & Glamping',
        desc: 'Lengkapi momen kuliner Anda dengan bermalam di 7 pilihan glamping tematik, river camp tepi air, hingga camping ground berbalut kabut lereng Wilis.',
        ctaLabel: 'Eksplorasi Akomodasi',
      },
    ],
  },
  'jolotundo-cafe': {
    id: 'jolotundo-cafe',
    seo: {
      title: 'Jolotundo Cafe — Open-Air Coffee Bar Hutan Pinus',
      description:
        'Jolotundo Cafe di tengah hutan pinus Bajulan, Nganjuk. Nikmati racikan kopi & latte, hidangan hangat, bapao, snack & dessert.',
      keywords:
        'jolotundo, jolotundo cafe, cafe hutan pinus nganjuk, kopi bajulan nganjuk, wisata kuliner jolotundo',
      breadcrumbName: 'Jolotundo Cafe',
      path: '/fasilitas/jolotundo-cafe/',
      schemaType: 'CafeOrCoffeeShop',
      schemaName: 'Jolotundo Cafe',
      schemaDescription:
        'Open-air coffee bar & kuliner hutan pinus di Jolotundo Glamping & Edupark, Bajulan, Nganjuk.',
      servesCuisine: ['Indonesian', 'Coffee', 'Asian Snacks'],
      priceRange: 'Rp 15.000 - Rp 75.000',
      opens: '07:00',
      closes: '22:00',
    },
    waDefaultMessage:
      'Halo Admin Jolotundo, saya ingin memesan meja / menu di Jolotundo Cafe.',
    hero: {
      sectionId: 'cafe-hero',
      parallaxLayerId: 'cafe-hero-parallax-layer',
      imageSrc: '/images/resto/jolocafe/jolo1.avif',
      imageAlt: 'Jolotundo Cafe Open-Air Coffee Bar Hutan Pinus',
      kicker: '— OPEN-AIR COFFEE BAR & PINE DINING',
      headline: 'Jolotundo Cafe.',
      subtitle:
        'Racikan kopi hangat, aneka hidangan Nusantara, dan area duduk open-air yang menyatu langsung dengan rimbun hutan pinus.',
      primaryCtaLabel: 'Reservasi / Order',
      secondaryCtaLabel: 'Buka Menu',
      locationBadge: 'KANOPI PINUS BAJULAN',
      capacityText: '200 KURSI TAMU',
      hoursText: '07.00 — 22.00 WIB',
      entryText: 'FREE HTM',
    },
    place: {
      headlineText:
        'Racikan kopi hangat, sajian kuliner favorit, dan area duduk open-air di bawah rindang hutan pinus.',
      subtitle:
        'Kafe terbuka bernuansa modern-alami dengan bar kopi barista, kanopi tenda teduh, dan deretan meja kayu di tengah pepohonan pinus — tempat sempurna bersantai menikmati hidangan hangat di sejuknya lereng Wilis.',
      rows: [
        {
          label: 'SETTING',
          title: 'Open-Air Pine Forest Cafe',
          desc: 'Bar kopi semi-outdoor beratap kaca, area duduk tenda kanopi teduh, dan barisan meja kayu terbuka langsung di bawah pohon pinus.',
        },
        {
          label: 'KAPASITAS',
          title: '200 Kursi Tamu',
          desc: 'Kombinasi meja bar tinggi menghadap lembah pinus, meja piknik kayu keluarga, dan area duduk kanopi yang nyaman untuk rombongan.',
        },
        {
          label: 'JAM BUKA',
          title: '07.00 — 22.00 WIB',
          desc: 'Buka setiap hari melayani sarapan pagi sejuk berkabut, santap siang keluarga, hingga nongkrong santai di malam hari.',
        },
        {
          label: 'SUASANA',
          title: 'Sejuk Pegunungan (18°–22°C)',
          desc: 'Udara murni pegunungan di bawah rindang kanopi pepohonan dengan pendar lampu gantung hangat saat senja tiba.',
        },
        {
          label: 'MENU UTAMA',
          title: 'Kopi, Hidangan Hangat & Snack',
          desc: 'Racikan kopi & latte, ayam & nasi, bakso & mie hangat, Nusantara & Chinese snack, aneka bapao, dessert, hingga minuman anak.',
        },
        {
          label: 'PEMESANAN',
          title: 'Scan QR Meja & Kasir',
          desc: 'Pemesanan mandiri cepat dan praktis via scan QR di masing-masing meja atau langsung melalui kasir bar utama.',
        },
        {
          label: 'PEMBAYARAN',
          title: 'Cashless QRIS & Tunai',
          desc: 'Mendukung seluruh aplikasi dompet digital & mobile banking QRIS (BCA, Mandiri, BRI, GoPay, OVO, ShopeePay) serta tunai.',
        },
      ],
    },
    menu: {
      kicker: '— BUKU MENU CAFE',
      headline: 'Buku Menu Resmi Jolotundo Cafe.',
      description:
        'Disajikan dengan format buku menu 3D interaktif yang praktis dijelajahi. Temukan 10 halaman pilihan menu mulai dari hidangan ayam & nasi, bakso & mie hangat, Nusantara & Chinese snack, aneka bapao, dessert, racikan kopi & latte, hingga jus & minuman anak.',
      pdfHref: '/docs/menu-jolotundo-cafe.pdf',
      pdfDownloadName: 'Menu-Jolotundo-Cafe.pdf',
      quickNewTabHref: 'https://heyzine.com/flip-book/642f8c2f3f.html',
      flipbookUrl: 'https://heyzine.com/flip-book/642f8c2f3f.html',
      toolbarTitle: 'JOLOTUNDO CAFE MENU',
      modalEyebrow: 'JOLOTUNDO CAFE // 3D FLIPBOOK MENU',
      modalAriaLabel: 'Buku Menu Jolotundo Cafe Layar Penuh',
      iframeTitle: 'Buku Menu Jolotundo Cafe Heyzine Flipbook',
      modalIframeTitle: 'Buku Menu Jolotundo Cafe Fullscreen Viewer',
      tipsDesktop:
        'Tarik sudut kertas dengan sentuhan mouse/jari untuk membalik halaman layaknya buku asli.',
      tipsMobile:
        "Gunakan tombol 'Layar Penuh' atau tombol panah bawah untuk membaca dengan leluasa.",
      waCtaLabel: 'Order Menu / Info via WhatsApp',
      chapters: [
        { page: 1, title: 'Cover Menu' },
        { page: 2, title: 'Panduan Order' },
        { page: 3, title: 'Ayam & Nasi' },
        { page: 4, title: 'Bakso & Mie' },
        { page: 5, title: 'Nusantara Snack' },
        { page: 6, title: 'Chinese Snack' },
        { page: 7, title: 'Aneka Bapao' },
        { page: 8, title: 'Menu Dessert' },
        { page: 9, title: 'Kopi & Latte' },
        { page: 10, title: 'Jus & Minuman Anak' },
      ],
      showFloatingExitBtn: false,
      showMobileOverlayTriggers: false,
    },
    gallery: {
      sectionId: 'cafe-preview-gallery',
      viewportId: 'cafe-gallery-sticky-viewport',
      windowId: 'cafe-slider-window',
      trackId: 'cafe-slider-track',
      progressBarId: 'cafe-progress-bar',
      topLeftText: 'PREVIEW GALLERY // COFFEE BAR & OPEN-AIR AREA',
      topRightDesktopText: 'Scroll ke bawah untuk eksplorasi visual suasana cafe',
      title: 'Jolotundo Cafe',
      subtitle: 'Open-Air Coffee Bar · Bajulan Loceret',
      specs: [
        { value: '200 Kursi', label: 'KAPASITAS' },
        { value: '07.00–22.00', label: 'OPERASIONAL' },
        { value: 'Hutan Pinus', label: 'SUASANA' },
      ],
      ctaLabel: 'Reservasi / Order',
      images: [
        { src: '/images/resto/jolocafe/jolo1.avif', caption: 'Barista Counter & Coffee Bar', subtitle: 'BAR KOPI SEMI-OUTDOOR BERATAP KACA DI TENGAH PINUS' },
        { src: '/images/resto/jolocafe/jolo2.avif', caption: 'Pine View Bar Seating', subtitle: 'DERETAN KURSI BAR MENGHADAP LEMBAH & TENDA PINUS' },
        { src: '/images/resto/jolocafe/jolo3.avif', caption: 'Area Duduk Kanopi Teduh', subtitle: 'SANTAI NYAMAN DI BAWAH KANOPI OUTDOOR YANG SEJUK' },
        { src: '/images/resto/jolocafe/jolo4.avif', caption: 'Open-Air Pine Garden', subtitle: 'MEJA PIKNIK KAYU TERBUKA DI BAWAH RINDANG POHON' },
      ],
    },
    guidanceBanner: {
      kicker: '[ PANDUAN PENGUNJUNG // KENYAMANAN BERSANTAP ]',
      headline: 'Sistem Pemesanan Cepat & Fleksibilitas Tempat Duduk',
      htmlBody:
        'Pengunjung bebas memilih tempat duduk di area coffee bar semi-outdoor, bawah kanopi tenda teduh, hingga meja piknik terbuka di bawah pohon pinus. Untuk efisiensi, silakan lakukan pemesanan mandiri melalui <strong>Scan QR Barcode</strong> yang tersedia di atas meja Anda atau langsung melalui kasir bar utama. Pesanan hangat akan segera diantarkan oleh waiter ke meja Anda.',
      ctaLabel: 'Order / Pre-Order Rombongan ↗',
      noteText: 'Tersedia Menu Sarapan, Kopi & Hidangan Rombongan',
    },
    switcherCards: [
      {
        href: '/fasilitas/river-breeze/',
        tag: '[ OUTLET 01 // RIVERSIDE ]',
        title: 'River Breeze Cafe & Resto',
        desc: 'Santap istimewa di atas panggung dek kayu alami tepat di bibir aliran sungai jernih berbatu lereng Wilis. Menyajikan aneka olahan gurami bakar, steak, dan hidangan Nusantara.',
        ctaLabel: 'Buka Halaman River Breeze',
      },
      {
        href: '/akomodasi/',
        tag: '[ OVERVIEW // 7 TIPE MENGINAP ]',
        title: 'Akomodasi & Glamping',
        desc: 'Lengkapi momen bersantap Anda dengan bermalam di 7 pilihan glamping tematik, river camp tepi air, hingga camping ground berbalut kabut lereng Wilis.',
        ctaLabel: 'Eksplorasi Akomodasi',
      },
    ],
  },
};
