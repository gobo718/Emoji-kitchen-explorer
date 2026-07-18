/* Billy Labs shared device storage gateway — v1 */
(() => {
  const memory = new Map();
  const storage = (() => {
    try {
      const test = '__billy_storage_test__';
      localStorage.setItem(test, '1');
      localStorage.removeItem(test);
      return localStorage;
    } catch {
      return null;
    }
  })();

  const rawGet = key => storage ? storage.getItem(key) : (memory.has(key) ? memory.get(key) : null);
  const rawSet = (key, value) => {
    if (storage) storage.setItem(key, value);
    else memory.set(key, value);
  };
  const rawRemove = key => {
    if (storage) storage.removeItem(key);
    else memory.delete(key);
  };

  const api = {
    version: 1,
    get(key, fallback = null) {
      try {
        const value = rawGet(key);
        return value === null ? fallback : JSON.parse(value);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        rawSet(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.warn(`BillyStorage could not save ${key}.`, error);
        return false;
      }
    },
    remove(key) {
      try {
        rawRemove(key);
        return true;
      } catch (error) {
        console.warn(`BillyStorage could not remove ${key}.`, error);
        return false;
      }
    },
    has(key) {
      try { return rawGet(key) !== null; }
      catch { return false; }
    }
  };

  window.BillyStorage = api;
})();
