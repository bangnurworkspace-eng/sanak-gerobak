/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const STUDIO_IMAGE_ASSETS = {
  heroPremium: '/assets/images/hero_gerobak_premium_1793275251800.jpg',
  coffeeCart: '/assets/images/gerobak_coffee_cart_1793275252747.jpg',
  streetFood: '/assets/images/gerobak_street_food_1793275253637.jpg',
  minimalistKiosk: '/assets/images/gerobak_minimalist_kiosk_1793275672764.jpg',
  containerBooth: '/assets/images/gerobak_booth_container_1793275253367.jpg',
  bakeryPastry: '/assets/images/gerobak_bakery_pastry_1793275936957.jpg',
  customAngular: '/assets/images/gerobak_custom_angular_1793275937077.jpg',
  localCulinary: '/assets/images/bontang_local_culinary_1793275672214.jpg',
} as const;

const LEGACY_FILENAME_MAP: Record<string, string> = {
  'hero_gerobak_bontang_1793275251642.jpg': STUDIO_IMAGE_ASSETS.heroPremium,
  'gerobak_bakery_pastry_1793275254248.jpg': STUDIO_IMAGE_ASSETS.bakeryPastry,
  'gerobak_boba_tea_1793275672520.jpg': STUDIO_IMAGE_ASSETS.minimalistKiosk,
};

/**
 * Normalizes legacy `/src/assets/images/...` or mismatched image filenames
 * stored in Firestore or configuration into valid production `/assets/images/...` URLs.
 */
export function resolveImageUrl(
  url: string | undefined | null,
  fallback: string = STUDIO_IMAGE_ASSETS.coffeeCart
): string {
  const clean = (url || '').trim();
  if (!clean) return fallback;

  if (clean.startsWith('data:') || clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }

  const filename = clean.split('/').pop() || '';
  if (filename && LEGACY_FILENAME_MAP[filename]) {
    return LEGACY_FILENAME_MAP[filename];
  }

  if (clean.startsWith('/src/assets/images/')) {
    return clean.replace('/src/assets/images/', '/assets/images/');
  }

  return clean;
}
