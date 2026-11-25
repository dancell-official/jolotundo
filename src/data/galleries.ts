export interface GalleryImageItem {
  src: string;
  caption: string;
  subtitle: string;
}

export interface GalleryMetaEntry {
  caption: string;
  subtitle: string;
  order: number;
}

export type GalleryMetaMap = Record<string, GalleryMetaEntry>;

/** Build sorted gallery image entries statically so builds never rely on node:fs or process.cwd(). */
export function buildGalleryImages(
  baseFolder: string,
  metaMap: GalleryMetaMap,
  defaultSubtitle: string
): GalleryImageItem[] {
  return Object.entries(metaMap)
    .sort(([fileA, metaA], [fileB, metaB]) => metaA.order - metaB.order || fileA.localeCompare(fileB))
    .map(([file, meta]) => ({
      src: encodeURI(`${baseFolder}/${file}`),
      caption: meta.caption || file.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').toUpperCase(),
      subtitle: meta.subtitle || defaultSubtitle,
    }));
}

export function calcGalleryScrollHeightVh(
  imageCount: number,
  maxVh = 340,
  stepPerImage = 12
): number {
  return Math.max(220, Math.min(maxVh, 180 + imageCount * stepPerImage));
}

// =============================================================================
// 1. ACCOMMODATION GALLERIES
// =============================================================================
const deluxeMetaMap: GalleryMetaMap = {
  'front2.avif': { caption: 'Tampak Depan & Lanskap', subtitle: 'Keasrian Alami Pepohonan', order: 1 },
  '1000396148.avif': { caption: 'Kabin Deluxe Jolotundo', subtitle: 'Unit Eksklusif & Privat', order: 2 },
  'bed.avif': { caption: 'King Size Master Bed', subtitle: 'Kenyamanan Istirahat Maksimal', order: 3 },
  'room.avif': { caption: 'Interior Kamar & Smart TV', subtitle: 'Fasilitas Hiburan Lengkap & AC', order: 4 },
  'ruang-kerja.avif': { caption: 'Meja Kerja & Coffee Corner', subtitle: 'Workation Nyaman di Alam', order: 5 },
  'teras-baru-landscape.avif': { caption: 'Panorama Teras Tepi Air', subtitle: 'Balkon Menghadap Lanskap Asri', order: 6 },
  'teras-baru.avif': { caption: 'Balkon Kayu Luas', subtitle: 'Area Bersantai & Menikmati Udara', order: 7 },
  'teras.avif': { caption: 'Teras Santai Kabin', subtitle: 'Suasana Teduh & Tenang', order: 8 },
  'toilet.avif': { caption: 'Kamar Mandi Modern', subtitle: 'Water Heater & Shower Bersih', order: 9 },
  'toilet2.avif': { caption: 'Fasilitas Kamar Mandi', subtitle: 'Amenities Lengkap & Nyaman', order: 10 },
};

const riverMetaMap: GalleryMetaMap = {
  'front.avif': { caption: 'Fasad Tenda River Camp', subtitle: 'Safari Tent Eksklusif Tepi Sungai', order: 1 },
  'depan-pagi.avif': { caption: 'Pagi Hari di Tepi Sungai', subtitle: 'Kesejukan Udara & Kabut Pagi', order: 2 },
  'river.avif': { caption: 'Panorama Aliran Sungai', subtitle: 'Bebatuan Alami & Gemericik Air', order: 3 },
  'river-view.avif': { caption: 'Pemandangan Sungai Alami', subtitle: 'Dek Kayu Menghadap Aliran Air', order: 4 },
  'samping.avif': { caption: 'Area Dek Kayu Samping', subtitle: 'Panggung Kayu Elevated Terlindung', order: 5 },
  'atas.avif': { caption: 'Perspektif Lanskap Atas', subtitle: 'Deretan Tenda di Bawah Kanopi Pinus', order: 6 },
  'upside.avif': { caption: 'Sudut Pandang Elevasi', subtitle: 'Keasrian Alami Rimba Jolotundo', order: 7 },
  'Bed River.avif': { caption: 'Double Bed & Kasur Nyaman', subtitle: 'Istirahat Tenang Berteman Alunan Air', order: 8 },
  'cafe-view.avif': { caption: 'Akses Dekat Cafe & Kuliner', subtitle: 'Kemudahan Menikmati Makanan Hangat', order: 9 },
  'night.avif': { caption: 'Suasana Senja & Malam Hari', subtitle: 'Pencahayaan Hangat Dek Tepi Sungai', order: 10 },
  'river1.avif': { caption: 'Eksplorasi Dek Tepi Sungai', subtitle: 'Pengalaman Bermalam Alami', order: 11 },
  'river2.avif': { caption: 'Keheningan Alam Wilis', subtitle: 'Ketenangan Gemericik Air Pegunungan', order: 12 },
};

const koreanMetaMap: GalleryMetaMap = {
  'korean1.avif': { caption: 'Fasad Utama Korean Glamping', subtitle: 'Desain Hangat, Estetik & Fotogenik', order: 1 },
  'tenda.avif': { caption: 'Tenda Glamping Minimalis', subtitle: 'Gaya Modern Scandinavian Korea', order: 2 },
  'tenda2.avif': { caption: 'Tampak Depan & Kanopi', subtitle: 'Area Teras Terlindung Asri', order: 3 },
  'side-view.avif': { caption: 'Pemandangan Samping Tenda', subtitle: 'Suasana Tenang di Bawah Pinus', order: 4 },
  'street.avif': { caption: 'Jalur Setapak Glamping', subtitle: 'Akses Rapi & Nyaman Menuju Unit', order: 5 },
  'bed.avif': { caption: 'Matras & Bedding Nyaman', subtitle: 'Istirahat Hangat Berbalut Selimut', order: 6 },
  'kursi-bersantai.avif': { caption: 'Kursi Santai Lipat Aesthetic', subtitle: 'Perlengkapan Santai Outdoor', order: 7 },
  'tempat-bersantai.avif': { caption: 'Area Piknik & Meja Santai', subtitle: 'Spot Nyaman Menikmati Sore', order: 8 },
  'tempat-bersantai2.avif': { caption: 'Meja BBQ & Kumpul Santai', subtitle: 'Kebersamaan Pasangan & Teman', order: 9 },
  'tempat-bersantai3.avif': { caption: 'Sudut Santai Bawah Pinus', subtitle: 'Kesejukan Udara Lereng Wilis', order: 10 },
  'tempat-bersantai4.avif': { caption: 'Suasana Santai Terbuka', subtitle: 'Panorama Hijau Pegunungan', order: 11 },
  'tempat-bersantai5.avif': { caption: 'Area Kumpul Eksklusif', subtitle: 'Ruang Cerita di Alam Bebas', order: 12 },
  'tenda3.avif': { caption: 'Perspektif Tenda Asri', subtitle: 'Keindahan Lanskap Glamping', order: 13 },
  'tenda4.avif': { caption: 'Detail Tenda & Kanopi', subtitle: 'Konstruksi Kokoh & Elegan', order: 14 },
};

const superiorMetaMap: GalleryMetaMap = {
  'superior.avif': { caption: 'Fasad Utama Superior Camp', subtitle: 'Kabin Kayu Modern Berpendingin AC', order: 1 },
  'outside.avif': { caption: 'Lanskap Luar & Fasad Depan', subtitle: 'Keasrian Alami di Bawah Pinus', order: 2 },
  'teras.avif': { caption: 'Teras Santai Depan Kabin', subtitle: 'Balkon Menghadap Pepohonan', order: 3 },
  'superior-bed.avif': { caption: 'Double Size Bed Nyaman', subtitle: 'Kenyamanan Istirahat Maksimal', order: 4 },
  'ac.avif': { caption: 'Air Conditioner (AC)', subtitle: 'Suhu Ruangan Sejuk & Menenangkan', order: 5 },
  'fasilitas.avif': { caption: 'Meja TV, Tea Maker & Amenities', subtitle: 'Fasilitas Kamar Lengkap & Bersih', order: 6 },
  'stop-kontak.avif': { caption: 'Stop Kontak & Sambungan Listrik', subtitle: 'Dukungan Daya & Pengisian Gawai', order: 7 },
};

const groundMetaMap: GalleryMetaMap = {
  'ground.avif': { caption: 'Hamparan Berkemah Jolotundo', subtitle: 'Area Terbuka Luas di Bawah Pinus', order: 1 },
  'ground2.avif': { caption: 'Lanskap Tenda Berkemah', subtitle: 'Nuansa Alami & Sejuk Lereng Wilis', order: 2 },
  'ground4.avif': { caption: 'Kavling Mandiri Luas', subtitle: 'Esensi Berkemah Murni di Alam Bebas', order: 3 },
  'ground-night.avif': { caption: 'Suasana Malam Camping Ground', subtitle: 'Lampu Tenda Hangat di Bawah Bintang', order: 4 },
  'ground-night2.avif': { caption: 'Panorama Malam Lereng Wilis', subtitle: 'Ketenangan & Syahdunya Malam Hutan', order: 5 },
};

const indianMetaMap: GalleryMetaMap = {
  'indian1.avif': { caption: 'Fasad Utama Indian Camp', subtitle: 'Nuansa Etnik Unik di Hutan Pinus', order: 1 },
  'indian2.avif': { caption: 'Tenda Indian & Area Kanopi', subtitle: 'Petualangan Hangat di Tengah Alam', order: 2 },
  'indian3.avif': { caption: 'Kesejukan Kanopi Pinus', subtitle: 'Udara Bersih Pegunungan Wilis', order: 3 },
  'indian4.avif': { caption: 'Tenda Kerucut Etnik & Santai', subtitle: 'Kenyamanan Berkemah Eksklusif', order: 4 },
  'indian5.avif': { caption: 'Area Bersantai & Piknik', subtitle: 'Fasilitas Lengkap Bersama Sahabat & Keluarga', order: 5 },
};

const pinusMetaMap: GalleryMetaMap = {
  'pinus1.avif': { caption: 'Panggung Kayu di Bawah Pinus', subtitle: 'Keteduhan Alami Hutan Pinus Bajulan', order: 1 },
  'pinus2.avif': { caption: 'Tenda Panggung Elevated', subtitle: 'Terbebas dari Lembap Tanah Hutan', order: 2 },
  'pinus3.avif': { caption: 'Tepi Aliran Sungai Kecil', subtitle: 'Sensasi Suasana Pinus Camp Plus', order: 3 },
  'pinus4.avif': { caption: 'Deretan Tenda Hutan Pinus', subtitle: 'Keasrian & Privasi Alami Bersantai', order: 4 },
  'pinus5.avif': { caption: 'Area Santai Kayu', subtitle: 'Menghirup Segarnya Udara Wilis', order: 5 },
  'pinus6.avif': { caption: 'Pagi Hari di Bawah Pinus', subtitle: 'Sinar Mentari Pagi Menembus Pepohonan', order: 6 },
  'pinus7.avif': { caption: 'Jalur Setapak Asri', subtitle: 'Akses Nyaman Antara Tenda & Fasilitas', order: 7 },
  'pinus8.avif': { caption: 'Tenda Panggung Tepi Sungai', subtitle: 'Alunan Tenang Air Mengalir Sepanjang Hari', order: 8 },
  'pinus9.avif': { caption: 'Perspektif Kanopi Rimba', subtitle: 'Kesejukan Asli Ketinggian 650 MDPL', order: 9 },
  'pinus10.avif': { caption: 'Suasana Teduh & Santai', subtitle: 'Tempat Sempurna Healing Bersama Teman', order: 10 },
  'pinus11.avif': { caption: 'Tenda Bersih Siap Huni', subtitle: 'Layanan Bongkar Pasang Tanpa Repot', order: 11 },
  'pinus12.avif': { caption: 'Area Santai Depan Tenda', subtitle: 'Piknik Santai Menikmati Kopi & Camilan', order: 12 },
  'pinus13.avif': { caption: 'Nuansa Alam Terjaga', subtitle: 'Ekosistem Hijau & Udara Terbuka', order: 13 },
  'pinus14.avif': { caption: 'Kehangatan Senja Hutan', subtitle: 'Cahaya Lembut Menjelang Sore Hari', order: 14 },
  'pinus15.avif': { caption: 'Malam Hari di Hutan Pinus', subtitle: 'Ketenangan Suasana Berkemah Autentik', order: 15 },
};

const campGalleriesByFolder: Record<string, GalleryImageItem[]> = {
  deluxe: buildGalleryImages('/images/accommodations/deluxe', deluxeMetaMap, 'Deluxe Camp Jolotundo'),
  river: buildGalleryImages('/images/accommodations/rivercamp', riverMetaMap, 'River Camp Jolotundo'),
  korean: buildGalleryImages('/images/accommodations/koreanglamping', koreanMetaMap, 'Korean Glamping Jolotundo'),
  superior: buildGalleryImages('/images/accommodations/superior', superiorMetaMap, 'Superior Camp Jolotundo'),
  ground: buildGalleryImages('/images/accommodations/ground', groundMetaMap, 'Camping Ground Jolotundo'),
  indian: buildGalleryImages('/images/accommodations/indian', indianMetaMap, 'Indian Camp Jolotundo'),
  pinus: buildGalleryImages('/images/accommodations/pinuscamp', pinusMetaMap, 'Pinus Camp Jolotundo'),
};

export function getCampGalleryImages(camp: {
  id: string;
  name: string;
  setting: string;
  image: string;
  editorialImage?: string;
}): GalleryImageItem[] {
  const id = camp.id;
  if (id === 'deluxe-camp' || id === 'deluxe' || id.includes('delux')) return campGalleriesByFolder.deluxe;
  if (id === 'river-camp' || id === 'rivercamp' || id.includes('river')) return campGalleriesByFolder.river;
  if (id === 'korean-glamping' || id === 'koreanglamping' || id.includes('korean')) return campGalleriesByFolder.korean;
  if (id === 'indian-camp' || id === 'indian' || id.includes('indian')) return campGalleriesByFolder.indian;
  if (id === 'superior-camp' || id === 'superior' || id.includes('superior')) return campGalleriesByFolder.superior;
  if (id === 'pinus-camp' || id === 'pinus-camp-plus' || id.includes('pinus')) return campGalleriesByFolder.pinus;
  if (id === 'camping-ground' || id === 'ground' || id.includes('ground')) return campGalleriesByFolder.ground;

  return [
    { src: camp.editorialImage || camp.image, caption: camp.name, subtitle: camp.setting },
    { src: '/images/accommodations/deluxe/front2.avif', caption: 'Kabin & Tenda Kayu', subtitle: 'Arsitektur Alami Pegunungan' },
    { src: '/images/accommodations/rivercamp/river1.avif', caption: 'Aliran Sungai Alami', subtitle: 'Kesejukan Air Lereng Wilis' },
    { src: '/images/grill/paket-grill-big.jpg', caption: 'Paket Barbeque Grill', subtitle: 'Pesta Panggang Daging Segar' },
    { src: '/images/upgrade/paket-c-campfire-choice.jpg', caption: 'Api Unggun Malam Hari', subtitle: 'Kehangatan di Tengah Dingin' },
  ];
}

// =============================================================================
// 2. WAHANA / ACTIVITY GALLERIES
// =============================================================================
const activityFolderMap: Record<string, string> = {
  'atv-adventure': 'atv',
  atv: 'atv',
  'jeep-offroad': 'jeep',
  jeep: 'jeep',
  'wisata-berkuda': 'horse',
  'horse-riding': 'horse',
  horse: 'horse',
  'mini-zoo': 'zoo',
  'mini-zoo-edupark': 'zoo',
  zoo: 'zoo',
  'forest-spa': 'spa',
  spa: 'spa',
  'outbound-gathering': 'outbond',
  outbound: 'outbond',
  outbond: 'outbond',
};

const activityMetaMap: Record<string, GalleryMetaMap> = {
  atv: {
    'atv1.avif': { caption: 'Aksi Lintasan Sungai', subtitle: 'Sensasi Cipratan Air Alami', order: 1 },
    'atv2.avif': { caption: 'Menembus Rute Bebatuan', subtitle: 'Tantangan Jalur Offroad Kali', order: 2 },
    'atv3.avif': { caption: 'Konvoi Jalur Pinus', subtitle: 'Manuver di Bawah Naungan Pohon', order: 3 },
    'atv4.avif': { caption: 'Adrenalin Quad Bike', subtitle: 'Kendali Penuh di Medan Menantang', order: 4 },
    'atv5.avif': { caption: 'Tanjakan Tanah Basah', subtitle: 'Torsi Kuat Mesin ATV Prima', order: 5 },
    'atv6.avif': { caption: 'Kanopi Purba Bajulan', subtitle: 'Kesejukan Udara ±650 MDPL', order: 6 },
    'atv7.avif': { caption: 'Arung Arus Dangkal', subtitle: 'Keseruan Basah di Sungai Berbatu', order: 7 },
    'atv8.avif': { caption: 'Jalur Berkelok Hutan', subtitle: 'Sensasi Petualangan Alami', order: 8 },
    'atv9.avif': { caption: 'Offroad Seru Bersama', subtitle: 'Kekompakan Mengarungi Jalur', order: 9 },
    'atv10.avif': { caption: 'Eksplorasi Lereng Wilis', subtitle: 'Panorama Rimba Asri Jolotundo', order: 10 },
    'atv11.avif': { caption: 'Aksi Penuh Semangat', subtitle: 'Momen Adrenalin Tak Terlupakan', order: 11 },
    'atv.avif': { caption: 'Unit Quad Bike Prima', subtitle: 'Perawatan Rutin & Standar Keamanan', order: 12 },
  },
  jeep: {
    'jeep4.avif': { caption: 'Aksi 4x4 Offroad Ekstrem', subtitle: 'Menembus Rute Bebatuan Cadas', order: 1 },
    'jeep.avif': { caption: 'Armada 4x4 Tangguh', subtitle: 'Mobil Overland Berpenggerak Ganda', order: 2 },
    'jeep1.avif': { caption: 'Tanjakan Terjal Lereng', subtitle: 'Skill Driver Berpengalaman', order: 3 },
    'jeep3.avif': { caption: 'Ekspedisi Rimba Wilis', subtitle: 'Kawasan Alami Hutan Tropis', order: 4 },
    'jeep5.avif': { caption: 'Lintas Batuan Purba', subtitle: 'Sensasi Goyangan Offroad Asli', order: 5 },
    'jeep6.avif': { caption: 'Rute Air Terjun Ngleyangan', subtitle: 'Petualangan Menembus Percikan Air', order: 6 },
    'jeep7.avif': { caption: 'Sensasi Overland Seru', subtitle: 'Pemberhentian Spot Foto Eksotis', order: 7 },
    'jeep8.avif': { caption: 'Panorama Lembah Bajulan', subtitle: 'Ketinggian Sejuk Puncak Wilis', order: 8 },
    'jeep9.avif': { caption: 'Konvoi Offroad Berkesan', subtitle: 'Kebersamaan Rombongan & Keluarga', order: 9 },
  },
  horse: {
    'horse1.avif': { caption: 'Tunggang Kuda Lereng Wilis', subtitle: 'Pengalaman Berkuda di Alam Asri', order: 1 },
    'horse2.avif': { caption: 'Jalur Teduh Kanopi Pinus', subtitle: 'Langkah Santai Menikmati Udara Sejuk', order: 2 },
    'horse3.avif': { caption: 'Pawang Pendamping Berpengalaman', subtitle: 'Keamanan & Kenyamanan Terjamin', order: 3 },
    'horse4.avif': { caption: 'Ketenangan Semilir Angin', subtitle: 'Aktivitas Menenangkan & Meditatif', order: 4 },
    'horse5.avif': { caption: 'Wisata Ramah Keluarga', subtitle: 'Cocok untuk Anak & Pemula', order: 5 },
  },
  zoo: {
    'zoo1.avif': { caption: 'Penangkaran Rusa Totol', subtitle: 'Satwa Jinak di Lereng Gunung Wilis', order: 1 },
    'zoo2.avif': { caption: 'Interaksi & Feeding Rusa', subtitle: 'Beri Pakan Wortel Segar Secara Langsung', order: 2 },
    'zoo3.avif': { caption: 'Rusa di Kawasan Rimba Pinus', subtitle: 'Habitat Terbuka Dekat Area Glamping', order: 3 },
    'zoo-domba.avif': { caption: 'Zona Edukasi Domba Dorper', subtitle: 'Papan Informasi & Area Padang Rumput Pinus', order: 4 },
    'zoo-kandang2.avif': { caption: 'Kompleks Kandang Kayu Edupark', subtitle: 'Sarana Terawat di Tengah Hutan Pinus', order: 5 },
    'zoo-kandang3.avif': { caption: 'Koridor Kandang & Area Satwa', subtitle: 'Lingkungan Bersih, Sejuk & Ramah Anak', order: 6 },
  },
  spa: {
    'spa1.jpg': { caption: 'Ruang Treatment Utama', subtitle: 'Suite Bersih & Tenang Berbalut Kayu Jati', order: 1 },
    'spa2.jpg': { caption: 'Area Refleksi & Foot Spa', subtitle: 'Kursi Santai Ergonomis & Rendaman Herbal', order: 2 },
    'spa3.jpg': { caption: 'Kamar Privat Massage & Lulur', subtitle: 'Layanan Khusus Tamu Deluxe dengan Rempah Hangat', order: 3 },
    'spa4.jpg': { caption: 'Sudut Aromaterapi & Teh Herbal', subtitle: 'Minyak Esensial Wilis & Penyegar Tubuh Alami', order: 4 },
  },
  outbond: {
    'outbond1.avif': { caption: 'Sinergi & Team Building', subtitle: 'Membangun Kekompakan Kelompok', order: 1 },
    'outbond2.avif': { caption: 'Dinamika Kelompok & Fun Games', subtitle: 'Tawa & Semangat Kolaborasi', order: 2 },
    'outbond3.avif': { caption: 'Arena Lapangan Pinus Luas', subtitle: 'Kapasitas Ratusan Peserta', order: 3 },
    'outbond4.avif': { caption: 'Aktivitas Luar Ruang Terbuka', subtitle: 'Udara Bersih Pegunungan Wilis', order: 4 },
    'outbond5.avif': { caption: 'Tantangan Kerjasama Regu', subtitle: 'Fasilitator & Trainer Profesional', order: 5 },
    'outbond6.avif': { caption: 'Leadership & Ice Breaking', subtitle: 'Mencairkan Suasana & Eratkan Komunikasi', order: 6 },
    'outbond7.avif': { caption: 'Gathering Korporat & BUMN', subtitle: 'Paket Lengkap All-Inclusive', order: 7 },
    'outbond8.avif': { caption: 'Momen Kebersamaan Berkesan', subtitle: 'Energi Positif untuk Tim Anda', order: 8 },
  },
};

export function getActivityGalleryImages(
  activityId: string,
  fallbackGallery: GalleryImageItem[] = []
): GalleryImageItem[] {
  const folder = activityFolderMap[activityId];
  const metaMap = folder ? activityMetaMap[folder] : undefined;
  if (!folder || !metaMap) return fallbackGallery;
  const images = buildGalleryImages(`/images/activities/${folder}`, metaMap, 'Jolotundo Edupark');
  return images.length > 0 ? images : fallbackGallery;
}

// =============================================================================
// 3. EVENT & VENUE GALLERIES
// =============================================================================
const eventFolderMap: Record<string, string> = {
  wedding: 'wedding',
  'wedding-outdoor': 'wedding',
  prewed: 'prewed',
  'aula-hall': 'hall',
  hall: 'hall',
  'glass-hall-mice': 'hall',
  'gathering-outbound': 'gathering',
  gathering: 'gathering',
};

const weddingMetaMap: GalleryMetaMap = {
  'wedding11.avif': { caption: 'Ijab Qobul & Janji Suci', subtitle: 'Momen Sakral di Bawah Kanopi Pinus', order: 1 },
  'wedding1.avif': { caption: 'Lorong Masuk Rustic Alami', subtitle: 'Dekorasi Kayu & Bunga Liar Lereng Wilis', order: 2 },
  'wedding2.avif': { caption: 'Prosesi Pengantin Intimate', subtitle: 'Kehangatan Keluarga Tanpa Kebisingan Kota', order: 3 },
  'wedding3.avif': { caption: 'Dekorasi Floral & Kanopi', subtitle: 'Sentuhan Elegan Berpadu Alami', order: 4 },
  'wedding4.avif': { caption: 'Siluet Asri Nuansa Pinus', subtitle: 'Pencahayaan Alami Pegunungan ±650 MDPL', order: 5 },
  'wedding5.avif': { caption: 'Resepsi Outdoor Asri', subtitle: 'Hamparan Rumput Hijau Luas Terawat', order: 6 },
  'wedding6.avif': { caption: 'Sesi Pemotretan Pengantin', subtitle: 'Momen Romantis Abadi Bersama Pasangan', order: 7 },
  'wedding7.avif': { caption: 'Sudut Temaram Romantis', subtitle: 'Pendar Lampu Hangat Nuansa Senja', order: 8 },
  'wedding8.avif': { caption: 'Potret Bahagia Kedua Mempelai', subtitle: 'Senyum Hangat di Pelukan Alam Wilis', order: 9 },
  'wedding9.avif': { caption: 'Lorong Pepohonan Magis', subtitle: 'Keanggunan Busana Berlatar Rimba', order: 10 },
  'wedding10.avif': { caption: 'Petualangan Cinta Romantis', subtitle: 'Konsep Prewedding Unik & Berkesan', order: 11 },
  'wedding12.avif': { caption: 'Pesta Romantis Hutan Pinus', subtitle: 'Kenangan Abadi Pernikahan Impian', order: 12 },
};

const eventMetaMap: Record<string, GalleryMetaMap> = {
  wedding: weddingMetaMap,
  prewed: weddingMetaMap,
  hall: {
    'hall2.avif': { caption: 'Fasad Glasshouse Hall Modern', subtitle: 'Arsitektur Kaca 360° Menghadap Hutan Pinus', order: 1 },
    'hall1.avif': { caption: 'Interior Sejuk Full AC', subtitle: 'Tata Ruang Fleksibel Seminar & Rapat Kerja', order: 2 },
    'hall3.avif': { caption: 'Suasana Hangat Rapat Dinas', subtitle: 'Kapasitas 60–120 Tamu Nyaman & Privat', order: 3 },
    'hall4.avif': { caption: 'Panorama 360° Sudut Kaca', subtitle: 'Ketenangan Alami Pendorong Ide Strategis', order: 4 },
  },
  gathering: {
    'gathering2.avif': { caption: 'Keseruan Dinamika Outbound', subtitle: 'Membangun Kekompakan & Sinergi Tim', order: 1 },
    'gathering1.avif': { caption: 'Ice Breaking & Fun Games', subtitle: 'Tawa Ceria & Mencairkan Batas Tim', order: 2 },
    'gathering3.avif': { caption: 'Arena Lapangan Pinus Luas', subtitle: 'Hamparan Rumput Hijau Terawat Kapasitas Besar', order: 3 },
    'gathering4.avif': { caption: 'Yel-Yel & Semangat Kebersamaan', subtitle: 'Energi Positif Dipandu Trainer Profesional', order: 4 },
    'gathering5.avif': { caption: 'Foto Bersama Rombongan', subtitle: 'Kenangan Berkesan Komunitas & Korporat', order: 5 },
  },
};

export function getEventGalleryImages(
  venueId: string,
  fallbackGallery: GalleryImageItem[] = []
): GalleryImageItem[] {
  const folder = eventFolderMap[venueId];
  const metaMap = folder ? eventMetaMap[folder] : undefined;
  if (!folder || !metaMap) return fallbackGallery;
  const images = buildGalleryImages(`/images/event/${folder}`, metaMap, 'Jolotundo Glamping & Culture');
  return images.length > 0 ? images : fallbackGallery;
}
