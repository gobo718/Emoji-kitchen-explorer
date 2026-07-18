/* Billy Labs repository layer — v4
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

  const sync = window.BillySyncManager || null;
  const queueProgress = () => {
    if (!sync) return;
    sync.enqueue('progress', window.BillyProgress?.snapshot?.() || {seen:[], favorites:[]});
  };
  const mergeProgress = remote => {
    const local = window.BillyProgress?.snapshot?.() || {seen:[], favorites:[]};
    const merged = {
      seen: [...new Set([...(local.seen || []), ...(remote?.seen || [])])],
      favorites: [...new Set([...(local.favorites || []), ...(remote?.favorites || [])])]
    };
    window.BillyProgress?.replaceSeen?.(merged.seen);
    window.BillyProgress?.replaceFavorites?.(merged.favorites);
    return merged;
  };
  const progress = {
    markSeen: (left, right) => { const result=window.BillyProgress?.markSeen(left, right); queueProgress(); return result; },
    hasSeen: (left, right) => !!window.BillyProgress?.hasSeen(left, right),
    toggleFavorite: (left, right) => { const result=window.BillyProgress?.toggleFavorite(left, right); queueProgress(); return result; },
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
      },
      fetchProgress: userId => cloud?.getProgress(userId),
      pushProgress: (userId, payload) => {
        if (!cloud) throw new Error('Billy Labs cloud API is unavailable');
        return cloud.putProgress(userId, payload || window.BillyProgress?.snapshot?.() || {seen:[], favorites:[]});
      },
      pullProgress: async userId => {
        if (!cloud) throw new Error('Billy Labs cloud API is unavailable');
        const result = await cloud.getProgress(userId);
        return {...result, ...mergeProgress(result)};
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

  if (sync) {
    sync.register('favorites', {pull: progress.cloud.pullFavorites, push: progress.cloud.pushFavorites});
    sync.register('progress', {pull: progress.cloud.pullProgress, push: progress.cloud.pushProgress});
  }

  window.BillyRepositories = Object.freeze({
    version: 4,
    settings: Object.freeze(settings),
    explorer: Object.freeze(explorer),
    profile: Object.freeze(profile),
    progress: Object.freeze(progress),
    collections: Object.freeze(collections),
    curator: Object.freeze(curator)
  });
})();
