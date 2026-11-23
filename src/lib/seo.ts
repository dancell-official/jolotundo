export interface BrandSeoInfo {
  fullName: string;
  subHeadline: string;
  whatsapp: string;
  email: string;
  group: string;
  social: {
    instagram: string;
    tiktok: string;
    youtube: string;
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface DiningVenueSchemaInput {
  type: 'Restaurant' | 'CafeOrCoffeeShop';
  name: string;
  description: string;
  path: string;
  telephone: string;
  servesCuisine: string[];
  priceRange: string;
  hasMenuPath: string;
  opens: string;
  closes: string;
}

const DEFAULT_SITE = 'https://jolotundoglamping.com';

const SHARED_POSTAL_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'Dusun Plakat, Desa Bajulan',
  addressLocality: 'Kec. Loceret',
  addressRegion: 'Kab. Nganjuk, Jawa Timur',
  postalCode: '64471',
  addressCountry: 'ID',
} as const;

const SHARED_GEO = {
  '@type': 'GeoCoordinates',
  latitude: -7.738389,
  longitude: 111.825667,
} as const;

export function getSiteBase(site?: URL | string | null): string {
  const raw = site ? site.toString() : DEFAULT_SITE;
  return raw.replace(/\/$/, '');
}

export function normalizeCanonicalPath(p: string): string {
  if (!p || p === '/') return '/';
  const withLeading = p.startsWith('/') ? p : `/${p}`;
  return /\.[a-z0-9]+$/i.test(withLeading) ? withLeading : `${withLeading.replace(/\/+$/, '')}/`;
}

export function resolveSafeOgImageUrl(siteBase: string, image: string): {
  safeOgPath: string;
  ogImageURL: string;
  isDefaultOgImage: boolean;
  ogImageType: 'image/png' | 'image/webp' | 'image/jpeg';
} {
  // Social crawlers (WhatsApp, IG, FB, X) reliably render JPEG/PNG; fallback to /og-image.jpg if an AVIF path is passed
  const safeOgPath = /\.(jpe?g|png|webp)$/i.test(image) ? image : '/og-image.jpg';
  const ogImageURL = safeOgPath.startsWith('http') ? safeOgPath : `${siteBase}${safeOgPath}`;
  const isDefaultOgImage = safeOgPath === '/og-image.jpg';
  const ogImageType = /\.png$/i.test(safeOgPath)
    ? 'image/png'
    : /\.webp$/i.test(safeOgPath)
    ? 'image/webp'
    : 'image/jpeg';

  return { safeOgPath, ogImageURL, isDefaultOgImage, ogImageType };
}

export function buildBaseSchemas(siteBase: string, brand: BrandSeoInfo): Array<Record<string, unknown>> {
  return [
    {
      '@context': 'https://schema.org',
      '@type': ['Campground', 'TouristAttraction'],
      '@id': `${siteBase}/#organization`,
      name: brand.fullName,
      alternateName: 'Jolotundo',
      description: brand.subHeadline,
      url: siteBase,
      image: `${siteBase}/og-image.jpg`,
      logo: `${siteBase}/og-image.jpg`,
      hasMap: 'https://maps.google.com/?q=-7.738389,111.825667',
      sameAs: [brand.social.instagram, brand.social.tiktok, brand.social.youtube],
      telephone: `+${brand.whatsapp}`,
      email: brand.email,
      priceRange: 'Rp 150.000 - Rp 1.200.000',
      isAccessibleForFree: true,
      address: { ...SHARED_POSTAL_ADDRESS },
      geo: { ...SHARED_GEO },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          opens: '09:00',
          closes: '20:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Friday', 'Saturday', 'Sunday'],
          opens: '09:00',
          closes: '22:00',
        },
      ],
      parentOrganization: {
        '@type': 'Organization',
        name: brand.group,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteBase}/#website`,
      url: siteBase,
      name: brand.fullName,
      alternateName: 'Jolotundo',
      inLanguage: 'id-ID',
      publisher: {
        '@id': `${siteBase}/#organization`,
      },
    },
  ];
}

export function buildBreadcrumbSchema(siteBase: string, items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.path === '/' ? `${siteBase}/` : `${siteBase}${normalizeCanonicalPath(item.path)}`,
    })),
  };
}

export function buildAccommodationSchema(
  siteBase: string,
  camp: {
    id: string;
    name: string;
    priceRawWeekday: number | string;
    priceRawWeekend: number | string;
    pricingTiers?: unknown[];
  },
  seoDesc: string
): Record<string, unknown> {
  const url = `${siteBase}/akomodasi/${camp.id}/`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${camp.name} — Jolotundo Glamping & Edupark`,
    description: seoDesc,
    image: `${siteBase}/og-image.jpg`,
    url,
    brand: {
      '@type': 'Brand',
      name: 'Jolotundo Glamping & Edupark',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'IDR',
      lowPrice: camp.priceRawWeekday,
      highPrice: camp.priceRawWeekend,
      offerCount: camp.pricingTiers ? camp.pricingTiers.length : 2,
      availability: 'https://schema.org/InStock',
      url,
    },
  };
}

export function buildDiningVenueSchema(
  siteBase: string,
  venue: DiningVenueSchemaInput
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': venue.type,
    name: venue.name,
    description: venue.description,
    url: `${siteBase}${normalizeCanonicalPath(venue.path)}`,
    image: `${siteBase}/og-image.jpg`,
    telephone: venue.telephone,
    servesCuisine: venue.servesCuisine,
    priceRange: venue.priceRange,
    hasMenu: `${siteBase}${venue.hasMenuPath}`,
    address: { ...SHARED_POSTAL_ADDRESS },
    geo: { ...SHARED_GEO },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: venue.opens,
        closes: venue.closes,
      },
    ],
  };
}

export function buildFaqSchema(faqs: Array<{ question: string; answer: string }>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
