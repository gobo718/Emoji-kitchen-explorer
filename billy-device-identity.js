/* Billy Labs device identity — v1
   Creates a local anonymous device identity. Registration is opt-in and only
   occurs when the cloud API has been explicitly configured. */
(() => {
  if (!window.BillyStorage) throw new Error('billy-device-identity.js requires billy-storage.js');
  const KEY = 'billy.device.identity.v1';
  const storage = window.BillyStorage;
  const now = () => new Date().toISOString();
  const randomId = () => {
    if (globalThis.crypto?.randomUUID) return `dev_${globalThis.crypto.randomUUID()}`;
    const bytes = new Uint8Array(16);
    globalThis.crypto?.getRandomValues?.(bytes);
    const token = bytes.some(Boolean) ? [...bytes].map(x => x.toString(16).padStart(2,'0')).join('') : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
    return `dev_${token}`;
  };
  const normalize = value => value && typeof value === 'object' && typeof value.id === 'string' ? value : null;
  const get = () => normalize(storage.get(KEY, null));
  const ensure = () => {
    const existing = get();
    if (existing) return existing;
    const created = {id: randomId(), createdAt: now(), registeredAt: null, lastRegistrationAt: null};
    storage.set(KEY, created);
    return created;
  };
  const save = identity => { storage.set(KEY, identity); return identity; };
  const mask = id => {
    const text = String(id || '');
    return text.length <= 14 ? text : `${text.slice(0,8)}…${text.slice(-6)}`;
  };
  const register = async () => {
    const identity = ensure();
    if (!window.BillyCloudApi?.isConfigured?.()) throw new Error('Billy Labs cloud API is not configured');
    const result = await window.BillyCloudApi.registerDevice(identity.id, {createdAt: identity.createdAt});
    const updated = {...identity, registeredAt: identity.registeredAt || now(), lastRegistrationAt: now()};
    save(updated);
    return {...result, identity: updated};
  };
  window.BillyDeviceIdentity = Object.freeze({version:1, key:KEY, get, ensure, getId:() => ensure().id, getMaskedId:() => mask(ensure().id), register});
})();
