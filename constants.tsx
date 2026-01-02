
import React from 'react';

export const GENDER_OPTIONS = ["Wanita", "Pria", "Anak-anak", "Non-biner"];
export const AGE_OPTIONS = ["Balita", "Anak-anak", "Remaja", "Dewasa Muda", "Dewasa", "Paruh Baya", "Lansia"];
export const ETHNICITY_OPTIONS = ["Asia Tenggara", "Asia Timur", "Kaukasia", "Afrika", "Hispanik", "Timur Tengah", "Asia Selatan", "Campuran"];
export const HAIR_OPTIONS = ["Pendek", "Sedang", "Panjang", "Keriting", "Lurus", "Wavy", "Botak", "Kuncir Kuda", "Buzz Cut", "Hijab", "Turban"];
export const EXPRESSION_OPTIONS = ["Senyum Ramah", "Percaya Diri", "Netral/Profesional", "Spontan/Tertawa", "Serius/Fashion", "Menikmati (Mata Tertutup)", "Fokus", "Terkejut Senang"];

export const PRODUCT_CATEGORIES = [
  // Fashion & Accessories
  "Kaos (T-Shirt)", "Hoodie/Sweater", "Jaket/Outer", "Gaun (Dress)", "Celana Jeans", "Sepatu Sneakers", "Sepatu Formal", "Tas Tangan", "Ransel", "Jam Tangan", "Kacamata", "Perhiasan (Kalung/Cincin)", "Topi",
  // Electronics & Gadgets
  "Smartphone", "Laptop", "Headphone", "Earbuds/TWS", "Kamera", "Smartwatch", "Tablet", "Speaker Portable",
  // Beauty & Personal Care
  "Botol Skincare/Serum", "Lipstik/Gincu", "Palet Makeup", "Botol Parfum", "Shampo/Sabun", "Lilin Aromaterapi",
  // Food & Culinary
  "Burger/Sandwich", "Sushi/Jepang", "Pizza", "Steak/Daging", "Ramen/Mie", "Salad Bowl", "Kue/Pastry", "Donat", "Nasi Goreng",
  // Beverages
  "Kopi/Latte", "Teh/Matcha", "Minuman Kaleng", "Jus Buah", "Botol Air Mineral", "Minuman Boba", "Cocktail/Mocktail",
  // Home & Decor
  "Mug/Gelas", "Vas Bunga", "Buku Catatan", "Lampu Meja", "Bantal Sofa", "Tanaman Hias",
  // Sports & Hobbies
  "Dumbbell/Alat Gym", "Matras Yoga", "Raket", "Bola", "Botol Minum Olahraga", "Sepeda",
  // Toys & Kids
  "Boneka", "Mobil-mobilan", "Blok Bangunan", "Buku Mewarnai"
];

export const INTERACTION_TYPE = [
  "Memakai/Mengenakan",
  "Memegang Secara Alami",
  "Menunjukkan ke Kamera",
  "Menggunakan/Mengoperasikan",
  "Mengkonsumsi (Makan/Minum)",
  "Menyesap/Mencicipi",
  "Membuka Kemasan (Unboxing)",
  "Mencoba/Testing",
  "Berpose di Samping",
  "Menatap Produk",
  "Hanya Sebagai Latar Belakang"
];

export const POSE_OPTIONS = [
  "Berdiri Tegak",
  "Duduk Santai",
  "Berjalan",
  "Dekat Wajah",
  "Flatlay dengan Tangan",
  "Candid/Spontan",
  "Headshot (Fokus Wajah)",
  "Action Shot",
  "Close-up Tangan"
];

export const ENVIRONMENT_OPTIONS = [
  "Studio Bersih (Putih)",
  "Studio Minimalis Krem",
  "Kafe Modern",
  "Urban/Jalanan Kota",
  "Taman/Outdoor",
  "Interior Mewah",
  "Kantor Modern",
  "Tepi Pantai",
  "Dapur Estetik",
  "Gym/Pusat Kebugaran",
  "Restoran/Dining Area",
  "Kamar Tidur Nyaman"
];

export const LIGHTING_OPTIONS = ["Cahaya Alami", "Softbox Studio", "Golden Hour", "Sinematik", "Terang (High-key)", "Hangat/Moody", "Neon/Futuristik"];
export const STYLE_OPTIONS = ["Minimalis", "Mewah", "Lifestyle", "Editorial", "Katalog", "Vintage", "Hyper-Realistic"];

export const ASPECT_RATIOS: { label: string; value: string }[] = [
  { label: "1:1 (Persegi)", value: "1:1" },
  { label: "4:5 (Instagram)", value: "3:4" },
  { label: "9:16 (Story/TikTok)", value: "9:16" },
  { label: "16:9 (Banner)", value: "16:9" },
];

export const RESOLUTION_OPTIONS: { label: string; value: string }[] = [
  { label: "Standar (1K)", value: "1K" },
  { label: "Definisi Tinggi (2K)", value: "2K" },
  { label: "Profesional (4K)", value: "4K" },
];
