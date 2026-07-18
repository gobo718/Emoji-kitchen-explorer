/* Billy Labs curator entry repository — v1 */
(() => {
  const KEY = 'billy-curator-entries-v1';
  const list = () => BillyStorage.get(KEY, {});
  const saveAll = entries => BillyStorage.set(KEY, entries || {});
  const get = id => list()[id] || null;
  const save = (id, entry) => {
    const entries = list();
    entries[id] = entry;
    saveAll(entries);
    return entry;
  };
  const remove = id => {
    const entries = list();
    delete entries[id];
    saveAll(entries);
  };
  window.BillyCuratorData = {version:1,key:KEY,list,get,save,saveAll,remove};
})();
