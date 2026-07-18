/* Billy Labs repository layer — v2
   Page controllers use these domain repositories instead of storage keys.
   Storage implementation remains local-first behind BillyStorage. */
(() => {
  if (!window.BillyStorage) throw new Error('billy-repositories.js requires billy-storage.js');

  const storage = window.BillyStorage;
  const settingKeys = Object.freeze({
    collectionHideEmptySlots: 'billy.collection.hideEmptySlots'
  });
  const resolveSettingKey = key => settingKeys[key] || `billy.setting.${key}`;
  const settings = {
    keys: settingKeys,
    get: (key, fallback = null) => storage.get(resolveSettingKey(key), fallback),
    set: (key, value) => storage.set(resolveSettingKey(key), value),
    remove: key => storage.remove(resolveSettingKey(key))
  };

  const explorer = {
    stateKey: 'ek-explorer-state',
    pageKey: 'ek-last-page',
    getState: (fallback = null) => storage.get('ek-explorer-state', fallback),
    saveState: state => storage.set('ek-explorer-state', state),
    getLastPage: (fallback = 0) => storage.get('ek-last-page', fallback),
    setLastPage: page => storage.set('ek-last-page', page)
  };

  const profile = {
    votesKey: 'billy.profile.votes',
    getVotes: () => storage.get('billy.profile.votes', {}),
    saveVotes: votes => storage.set('billy.profile.votes', votes || {})
  };

  const cloud = window.BillyCloudApi || null;

  const progress = {
    markSeen: (left, right) => window.BillyProgress?.markSeen(left, right),
    hasSeen: (left, right) => !!window.BillyProgress?.hasSeen(left, right),
    toggleFavorite: (left, right) => window.BillyProgress?.toggleFavorite(left, right),
    isFavorite: (left, right) => !!window.BillyProgress?.isFavorite(left, right),
    getSeen: () => window.BillyProgress?.getSeen() || new Set(),
    getFavorites: () => window.BillyProgress?.getFavorites() || new Set(),
    snapshot: () => window.BillyProgress?.snapshot() || {seen: [], favorites: []},
    cloud: Object.freeze({
      isConfigured: () => !!cloud?.isConfigured?.(),
      fetchFavorites: userId => cloud?.getFavorites(userId),
      pushFavorites: userId => cloud?.putFavorites(userId, [...(window.BillyProgress?.getFavorites() || [])]),
      pullFavorites: async userId => {
        if (!cloud) throw new Error('Billy Labs cloud API is unavailable');
        const result = await cloud.getFavorites(userId);
        window.BillyProgress?.replaceFavorites?.(result.favorites || []);
        return result;
      }
    })
  };

  const collections = {
    list: () => window.BillyCollections?.list() || [],
    find: id => window.BillyCollections?.find(id) || null,
    save: rows => window.BillyCollections?.save(rows) ?? false,
    blank: (...args) => window.BillyCollections?.blank(...args) || null
  };

  const curator = {
    list: () => window.BillyCuratorData?.list() || {},
    listPublished: () => window.BillyCuratorData?.listPublished() || {},
    get: id => window.BillyCuratorData?.get(id) || null,
    getDraft: id => window.BillyCuratorData?.getDraft(id) || null,
    save: (id, entry) => window.BillyCuratorData?.save(id, entry),
    remove: id => window.BillyCuratorData?.remove(id),
    publishBlurblet: id => window.BillyCuratorData?.publishBlurblet(id),
    downloadPublishedScript: () => window.BillyCuratorData?.downloadPublishedScript()
  };

  window.BillyRepositories = Object.freeze({
    version: 2,
    settings: Object.freeze(settings),
    explorer: Object.freeze(explorer),
    profile: Object.freeze(profile),
    progress: Object.freeze(progress),
    collections: Object.freeze(collections),
    curator: Object.freeze(curator)
  });
})();
