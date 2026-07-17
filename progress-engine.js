/* Billy Labs progression API foundation — v1.8.0
   Storage is local today; the public API is intentionally storage-agnostic for future accounts. */
(() => {
  const core = window.BILLY_MASHUPS;
  if (!core) throw new Error("mashup-core.js must load before progress-engine.js");

  const SEEN_KEY = "ek-seen";
  const FAVORITES_KEY = "ek-favorites";

  const readSeen = () => core.readSet(SEEN_KEY);
  const readFavorites = () => core.readSet(FAVORITES_KEY);

  window.BILLY_PROGRESS = Object.freeze({
    version: 1,
    getMashupId: core.canonicalMashupId,
    getSeen: readSeen,
    getFavorites: readFavorites,
    isDiscovered(left, right) {
      return readSeen().has(core.canonicalMashupId(left, right));
    },
    isFavorite(left, right) {
      return readFavorites().has(core.canonicalMashupId(left, right));
    },
    discover(left, right) {
      const seen = readSeen();
      const id = core.canonicalMashupId(left, right);
      seen.add(id);
      core.writeSet(SEEN_KEY, seen);
      return id;
    },
    setFavorite(left, right, shouldFavorite) {
      const favorites = readFavorites();
      const id = core.canonicalMashupId(left, right);
      if (shouldFavorite) favorites.add(id); else favorites.delete(id);
      core.writeSet(FAVORITES_KEY, favorites);
      return shouldFavorite;
    }
  });
})();
