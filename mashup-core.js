/* Billy Labs shared mashup identity and local progress foundation — v1.8.0 */
(() => {
  const STORAGE_VERSION_KEY = "billy-storage-schema";
  const CURRENT_STORAGE_VERSION = 2;

  function canonicalMashupId(left, right) {
    return [String(left || ""), String(right || "")].sort().join("|");
  }

  function legacyKeyToCanonical(key) {
    if (typeof key !== "string") return null;
    const parts = key.split("|");
    if (parts.length === 2) return canonicalMashupId(parts[0], parts[1]);
    if (parts.length === 3 && /^\d{8}$/.test(parts[2])) {
      return canonicalMashupId(parts[0], parts[1]);
    }
    return null;
  }

  function readArray(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function migrateKeyArray(storageKey) {
    const oldValues = readArray(storageKey);
    const migrated = [...new Set(oldValues.map(legacyKeyToCanonical).filter(Boolean))];
    if (JSON.stringify(oldValues) !== JSON.stringify(migrated)) {
      localStorage.setItem(storageKey, JSON.stringify(migrated));
    }
    return migrated;
  }

  function migrateLocalProgress() {
    const seen = migrateKeyArray("ek-seen");
    const favorites = migrateKeyArray("ek-favorites");
    localStorage.setItem(STORAGE_VERSION_KEY, String(CURRENT_STORAGE_VERSION));
    return { seen, favorites, version: CURRENT_STORAGE_VERSION };
  }

  function readSet(storageKey) {
    return new Set(migrateKeyArray(storageKey));
  }

  function writeSet(storageKey, values) {
    localStorage.setItem(storageKey, JSON.stringify([...new Set(values)]));
  }

  window.BILLY_MASHUPS = Object.freeze({
    version: 1,
    storageSchemaVersion: CURRENT_STORAGE_VERSION,
    canonicalMashupId,
    legacyKeyToCanonical,
    migrateLocalProgress,
    readSet,
    writeSet
  });

  migrateLocalProgress();
})();
