// Favorites management (localStorage for now, can be moved to API later)

const FAVORITES_KEY = 'lemauvaiscoin_favorites';

export function getFavorites(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addFavorite(adId: number): void {
  const favorites = getFavorites();
  if (!favorites.includes(adId)) {
    favorites.push(adId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
}

export function removeFavorite(adId: number): void {
  const favorites = getFavorites();
  const updated = favorites.filter((id) => id !== adId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
}

export function isFavorite(adId: number): boolean {
  return getFavorites().includes(adId);
}

export function toggleFavorite(adId: number): boolean {
  if (isFavorite(adId)) {
    removeFavorite(adId);
    return false;
  } else {
    addFavorite(adId);
    return true;
  }
}
