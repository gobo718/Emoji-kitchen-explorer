/* Billy Labs cloud API client — v5 */
(() => {
  const normalizeBase = value => String(value || '').trim().replace(/\/+$/, '');
  let storedBase = '';
  try { storedBase = localStorage.getItem('billy-cloud-api-base') || ''; } catch {}
  let apiBase = normalizeBase(storedBase || window.BILLY_CLOUD_API_BASE || '');
  const request = async (path, init = {}) => {
    if (!apiBase) throw new Error('Billy Labs cloud API is not configured');
    const response = await fetch(`${apiBase}${path}`, {...init, headers:{'content-type':'application/json',...(init.headers||{})}});
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `Cloud request failed (${response.status})`);
    return payload;
  };
  const unique = values => [...new Set((values || []).filter(value => typeof value === 'string' && value))];
  const userPath = (userId, resource) => `/api/users/${encodeURIComponent(userId)}/${resource}`;
  window.BillyCloudApi = Object.freeze({
    version:5, isConfigured:()=>!!apiBase, getBaseUrl:()=>apiBase, configure:value=>{apiBase=normalizeBase(value);window.BILLY_CLOUD_API_BASE=apiBase;return apiBase;},
    health:()=>request('/api/health',{method:'GET'}),
    registerDevice:(deviceId, metadata={})=>request('/api/devices/register',{method:'POST',body:JSON.stringify({deviceId,metadata})}),
    getDevice:deviceId=>request(`/api/devices/${encodeURIComponent(deviceId)}`,{method:'GET'}),
    getFavorites:userId=>request(userPath(userId,'favorites'),{method:'GET'}),
    putFavorites:(userId,favorites)=>request(userPath(userId,'favorites'),{method:'PUT',body:JSON.stringify({favorites:unique(favorites)})}),
    getProgress:userId=>request(userPath(userId,'progress'),{method:'GET'}),
    putProgress:(userId,progress)=>request(userPath(userId,'progress'),{method:'PUT',body:JSON.stringify({seen:unique(progress?.seen),favorites:unique(progress?.favorites)})}),
    getPublishedBlurblet:mashupId=>request(`/api/blurblets/${encodeURIComponent(mashupId)}`,{method:'GET'}),
    publishBlurblet:(mashupId,text,publishKey)=>request(`/api/curator/blurblets/${encodeURIComponent(mashupId)}`,{method:'PUT',headers:{'x-curator-key':String(publishKey||'')},body:JSON.stringify({text:String(text||'')})})
  });
})();
