/**
 * Cache utility with IndexedDB support (localStorage fallback)
 * Handles product data caching with user consent
 */

const PERMISSION_KEY = 'cache_permission';
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds
const DB_NAME = 'ProductCacheDB';
const DB_VERSION = 1;
const STORE_NAME = 'products';

let db = null;

/**
 * Initialize IndexedDB
 */
const initDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    if (!window.indexedDB) {
      console.log('IndexedDB not supported, using localStorage fallback');
      resolve(null);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB error:', request.error);
      resolve(null); // Fallback to localStorage
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = database.createObjectStore(STORE_NAME, { keyPath: 'key' });
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

/**
 * Check if user has granted cache permission
 */
export const hasCachePermission = () => {
  try {
    const permission = localStorage.getItem(PERMISSION_KEY);
    return permission === 'accepted';
  } catch (error) {
    return false;
  }
};

/**
 * Get cache permission status
 */
export const getCachePermission = () => {
  try {
    return localStorage.getItem(PERMISSION_KEY);
  } catch (error) {
    return null;
  }
};

/**
 * Set cache permission
 */
export const setCachePermission = (permission) => {
  try {
    localStorage.setItem(PERMISSION_KEY, permission);
    localStorage.setItem('cache_permission_timestamp', Date.now().toString());
    
    if (permission === 'rejected') {
      clearAllCaches();
    }
  } catch (error) {
    console.error('Error setting cache permission:', error);
  }
};

/**
 * Check if permission dialog should be shown
 */
export const shouldShowPermissionDialog = () => {
  try {
    const permission = localStorage.getItem(PERMISSION_KEY);
    return !permission; // Show if no permission is set
  } catch (error) {
    return false;
  }
};

/**
 * Store data in IndexedDB
 */
const storeInIndexedDB = async (key, data) => {
  try {
    const database = await initDB();
    if (!database) return false;

    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const cacheData = {
      key,
      data,
      timestamp: Date.now()
    };

    await store.put(cacheData);
    return true;
  } catch (error) {
    console.error('Error storing in IndexedDB:', error);
    return false;
  }
};

/**
 * Get data from IndexedDB
 */
const getFromIndexedDB = async (key) => {
  try {
    const database = await initDB();
    if (!database) return null;

    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);

    return new Promise((resolve) => {
      request.onsuccess = () => {
        const result = request.result;
        if (!result) {
          resolve(null);
          return;
        }

        const now = Date.now();
        if (now - result.timestamp < CACHE_EXPIRY) {
          resolve(result.data);
        } else {
          // Expired, delete it
          const deleteTransaction = database.transaction([STORE_NAME], 'readwrite');
          const deleteStore = deleteTransaction.objectStore(STORE_NAME);
          deleteStore.delete(key);
          resolve(null);
        }
      };

      request.onerror = () => {
        resolve(null);
      };
    });
  } catch (error) {
    console.error('Error getting from IndexedDB:', error);
    return null;
  }
};

/**
 * Store data in localStorage (fallback)
 */
const storeInLocalStorage = (key, data) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
    return true;
  } catch (error) {
    console.error('Error storing in localStorage:', error);
    return false;
  }
};

/**
 * Get data from localStorage (fallback)
 */
const getFromLocalStorage = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();

    if (now - timestamp < CACHE_EXPIRY) {
      return data;
    } else {
      localStorage.removeItem(key);
      return null;
    }
  } catch (error) {
    return null;
  }
};

/**
 * Get cached products
 */
export const getCachedProducts = async (cacheKey) => {
  if (!hasCachePermission()) {
    return null;
  }

  // Try IndexedDB first
  const indexedData = await getFromIndexedDB(cacheKey);
  if (indexedData) {
    console.log(`✅ Loaded from IndexedDB cache: ${cacheKey}`);
    return indexedData;
  }

  // Fallback to localStorage
  const localData = getFromLocalStorage(cacheKey);
  if (localData) {
    console.log(`✅ Loaded from localStorage cache: ${cacheKey}`);
    return localData;
  }

  return null;
};

/**
 * Set cached products
 */
export const setCachedProducts = async (cacheKey, products) => {
  if (!hasCachePermission()) {
    return;
  }

  // Try IndexedDB first
  const indexedSuccess = await storeInIndexedDB(cacheKey, products);
  if (indexedSuccess) {
    console.log(`💾 Cached in IndexedDB: ${cacheKey}`);
    return;
  }

  // Fallback to localStorage
  const localSuccess = storeInLocalStorage(cacheKey, products);
  if (localSuccess) {
    console.log(`💾 Cached in localStorage: ${cacheKey}`);
  }
};

/**
 * Clear all caches
 */
export const clearAllCaches = async () => {
  try {
    // Clear IndexedDB
    if (window.indexedDB) {
      const database = await initDB();
      if (database) {
        const transaction = database.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        await store.clear();
      }
    }

    // Clear localStorage caches
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('_cache') || key.includes('cache_')) {
        localStorage.removeItem(key);
      }
    });

    console.log('🗑️ All caches cleared');
  } catch (error) {
    console.error('Error clearing caches:', error);
  }
};

/**
 * Clear specific cache
 */
export const clearCache = async (cacheKey) => {
  try {
    // Clear from IndexedDB
    if (window.indexedDB) {
      const database = await initDB();
      if (database) {
        const transaction = database.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        await store.delete(cacheKey);
      }
    }

    // Clear from localStorage
    localStorage.removeItem(cacheKey);
    console.log(`🗑️ Cache cleared: ${cacheKey}`);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Manual cache clearing utility (can be called from browser console)
 * Usage: window.clearProductCache()
 */
if (typeof window !== 'undefined') {
  window.clearProductCache = async () => {
    await clearAllCaches();
    alert('All product caches cleared successfully!');
  };
}
