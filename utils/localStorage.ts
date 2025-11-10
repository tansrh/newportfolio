// utils/localStorage.ts

/**
 * Stores a value in localStorage under the given key. Value is stringified if not a string.
 * @param key - The key under which to store the value
 * @param value - The value to store (any type)
 */
export function setLocalStorage(key: string, value: any): void {
  if (typeof window === 'undefined') return;
  try {
    const toStore = typeof value === 'string' ? value : JSON.stringify(value);
    window.localStorage.setItem(key, toStore);
  } catch (err) {
    // Optionally handle error
    console.error('Error setting localStorage:', err);
  }
}

/**
 * Retrieves a value from localStorage by key. Attempts to parse JSON, falls back to string.
 * @param key - The key to retrieve
 * @returns The parsed value, or null if not found
 */
export function getLocalStorage<T = any>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(key);
    if (value === null) return null;
    try {
      return JSON.parse(value);
    } catch {
      return value as unknown as T;
    }
  } catch (err) {
    console.error('Error getting localStorage:', err);
    return null;
  }
}
