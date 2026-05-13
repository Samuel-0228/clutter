import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Save an item to AsyncStorage as JSON.
 * Errors are caught and re-thrown so callers can handle them if needed.
 */
export async function saveItem<T>(key: string, value: T): Promise<void> {
  try {
    const raw = JSON.stringify(value);
    await AsyncStorage.setItem(key, raw);
  } catch (error) {
    console.error("saveItem error", key, error);
    throw error;
  }
}

/**
 * Read an item from AsyncStorage and parse JSON.
 * Returns `fallback` when the key is missing or parsing fails.
 */
export async function readItem<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;

    try {
      return JSON.parse(raw) as T;
    } catch (err) {
      console.error("readItem JSON parse error", key, err);
      return fallback;
    }
  } catch (error) {
    console.error("readItem AsyncStorage error", key, error);
    return fallback;
  }
}

/** Remove a single key from storage. */
export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("removeItem error", key, error);
    throw error;
  }
}

/** Clear all AsyncStorage keys. Use with caution. */
export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error("clearAll error", error);
    throw error;
  }
}
