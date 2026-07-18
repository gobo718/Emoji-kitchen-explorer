/* Billy Labs sync manager — v1
   Local-first orchestration. Sync remains disabled until explicitly configured. */
(() => {
  const STATES = Object.freeze({LOCAL:'local', PENDING:'pending', SYNCING:'syncing', SYNCED:'synced', CONFLICT:'conflict', ERROR:'error'});
  const registry = new Map();
  const statuses = new Map();
  let config = {enabled:false, userId:''};
  const snapshot = name => ({name, ...(statuses.get(name) || {state:STATES.LOCAL, lastSyncedAt:null, error:null})});
  const setStatus = (name, patch) => { statuses.set(name, {...snapshot(name), ...patch, name}); return snapshot(name); };
  const requireReady = name => {
    const adapter = registry.get(name);
    if (!adapter) throw new Error(`Unknown sync repository: ${name}`);
    if (!config.enabled) throw new Error('Billy Labs cloud sync is disabled');
    if (!config.userId) throw new Error('Billy Labs cloud sync has no user ID');
    return adapter;
  };
  const sync = async (name, direction='both') => {
    const adapter = requireReady(name);
    setStatus(name,{state:STATES.SYNCING,error:null});
    try {
      let result = null;
      if (direction === 'pull' || direction === 'both') result = await adapter.pull(config.userId);
      if (direction === 'push' || direction === 'both') result = await adapter.push(config.userId);
      setStatus(name,{state:STATES.SYNCED,lastSyncedAt:new Date().toISOString(),error:null});
      return result;
    } catch (error) {
      setStatus(name,{state:STATES.ERROR,error:error?.message || String(error)});
      throw error;
    }
  };
  window.BillySyncManager = Object.freeze({
    version:1, states:STATES,
    configure: next => { config={...config,...(next||{}),enabled:!!next?.enabled,userId:String(next?.userId||config.userId||'')}; return {...config}; },
    getConfig: () => ({...config}),
    register: (name, adapter) => { if (!name || !adapter?.pull || !adapter?.push) throw new Error('Sync adapter requires name, pull, and push'); registry.set(name,adapter); if(!statuses.has(name)) statuses.set(name,{state:STATES.LOCAL,lastSyncedAt:null,error:null}); return snapshot(name); },
    list: () => [...registry.keys()].map(snapshot),
    getStatus: snapshot,
    markPending: name => setStatus(name,{state:STATES.PENDING,error:null}),
    markConflict: (name, message='Sync conflict') => setStatus(name,{state:STATES.CONFLICT,error:message}),
    sync,
    pull: name => sync(name,'pull'),
    push: name => sync(name,'push')
  });
})();
