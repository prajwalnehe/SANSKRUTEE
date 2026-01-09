/**
 * Cache utility with IndexedDB support (localStorage fallback)
 * Handles cache permission and data storage
 */

const PERMISSION_KEY = 'cache_permission';
const DB_NAME = 'ProductCacheDB';
const DB_VERSION = 1;
const STORE_NAME = 'products';

let db = null;

/**
 * Initialize IndexedDB
 * @returns {Promise<IDBDatabase>}
 */
const initIndexedDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.warn('IndexedDB not available, falling back to localStorage');
      resolve(null);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
  });
};

/**
 * Check if user has granted cache permission
 * @returns {boolean}
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
 * @returns {string|null} - 'accepted', 'rejected', or null
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
 * @param {string} permission - 'accepted' or 'rejected'
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
 * @returns {boolean}
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
 * Get cached products from IndexedDB or localStorage
 * @param {string} cacheKey - The cache key
 * @returns {Promise<Array|null>}
 */
export const getCachedProducts = async (cacheKey) => {
  if (!hasCachePermission()) {
    return Promise.resolve(null);
  }

  try {
    // Try IndexedDB first
    const database = await initIndexedDB();
    if (database) {
      return new Promise((resolve) => {
        const transaction = database.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(cacheKey);

        request.onsuccess = () => {
          const result = request.result;
          if (result && result.data && result.timestamp) {
            const now = Date.now();
            const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour
            if (now - result.timestamp < CACHE_EXPIRY) {
              console.log(`✅ Loaded from IndexedDB cache: ${cacheKey}`);
              resolve(result.data);
            } else {
              // Expired, delete it
              deleteCachedProducts(cacheKey);
              resolve(null);
            }
          } else {
            resolve(null);
          }
        };

        request.onerror = () => {
          // Fallback to localStorage
          try {
            const cached = localStorage.getItem(cacheKey);
            if (!cached) {
              resolve(null);
              return;
            }

            const { data, timestamp } = JSON.parse(cached);
            const now = Date.now();
            const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour

            if (now - timestamp < CACHE_EXPIRY) {
              console.log(`✅ Loaded from localStorage cache: ${cacheKey}`);
              resolve(data);
            } else {
              localStorage.removeItem(cacheKey);
              resolve(null);
            }
          } catch (e) {
            resolve(null);
          }
        };
      });
    }

    // Fallback to localStorage (synchronous)
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return Promise.resolve(null);

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour

    if (now - timestamp < CACHE_EXPIRY) {
      console.log(`✅ Loaded from localStorage cache: ${cacheKey}`);
      return Promise.resolve(data);
    } else {
      localStorage.removeItem(cacheKey);
      return Promise.resolve(null);
    }
  } catch (error) {
    console.error('Error reading cache:', error);
    return Promise.resolve(null);
  }
};

/**
 * Set cached products in IndexedDB or localStorage
 * @param {string} cacheKey - The cache key
 * @param {Array} products - Products array to cache
 */
export const setCachedProducts = async (cacheKey, products) => {
  if (!hasCachePermission()) {
    return;
  }

  try {
    const cacheData = {
      key: cacheKey,
      data: products,
      timestamp: Date.now()
    };

    // Try IndexedDB first
    const database = await initIndexedDB();
    if (database) {
      return new Promise((resolve) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(cacheData);

        request.onsuccess = () => {
          console.log(`💾 Cached in IndexedDB: ${cacheKey}`);
          resolve();
        };

        request.onerror = () => {
          // Fallback to localStorage
          try {
            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
            console.log(`💾 Cached in localStorage: ${cacheKey}`);
          } catch (e) {
            console.error('Error caching in localStorage:', e);
          }
          resolve();
        };
      });
    }

    // Fallback to localStorage
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log(`💾 Cached in localStorage: ${cacheKey}`);
  } catch (error) {
    console.error('Error saving cache:', error);
  }
};

/**
 * Delete cached products
 * @param {string} cacheKey - The cache key
 */
export const deleteCachedProducts = async (cacheKey) => {
  try {
    const database = await initIndexedDB();
    if (database) {
      return new Promise((resolve) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(cacheKey);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          localStorage.removeItem(cacheKey);
          resolve();
        };
      });
    }

    localStorage.removeItem(cacheKey);
  } catch (error) {
    console.error('Error deleting cache:', error);
  }
};

/**
 * Clear all product caches
 */
export const clearAllCaches = async () => {
  try {
    // Clear IndexedDB
    const database = await initIndexedDB();
    if (database) {
      return new Promise((resolve) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => {
          console.log('🗑️ Cleared IndexedDB cache');
        };

        request.onerror = () => {
          console.log('Error clearing IndexedDB');
        };

        // Also clear localStorage
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.includes('_cache') || key.includes('cache_')) {
            localStorage.removeItem(key);
          }
        });
        console.log('🗑️ Cleared localStorage cache');
        resolve();
      });
    }

    // Clear localStorage
    const keys = Object.keys(localStorage);
    let cleared = 0;
    keys.forEach(key => {
      if (key.includes('_cache') || key.includes('cache_')) {
        localStorage.removeItem(key);
        cleared++;
      }
    });
    console.log(`🗑️ Cleared ${cleared} localStorage cache entries`);
  } catch (error) {
    console.error('Error clearing caches:', error);
  }
};

/**
 * Manual cache clearing utility
 * Can be called from browser console: window.clearProductCache()
 */
export const clearProductCache = async () => {
  await clearAllCaches();
  console.log('✅ All product caches cleared successfully');
  return true;
};

// Make it available globally for manual clearing
if (typeof window !== 'undefined') {
  window.clearProductCache = clearProductCache;
  console.log('💡 Tip: You can clear cache manually by calling window.clearProductCache()');
}
