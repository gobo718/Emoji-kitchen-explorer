/* Billy Labs cloud API client — v2
   Disabled until an API base URL is configured. No data leaves the browser
   merely because this script is loaded. */
(() => {
  const normalizeBase = value => String(value || '').trim().replace(/\/+$/, '');
  let apiBase = normalizeBase(window.BILLY_CLOUD_API_BASE || '');

  const request = async (path, init = {}) => {
    if (!apiBase) throw new Error('Billy Labs cloud API is not configured');
    const response = await fetch(`${apiBase}${path}`, {
      ...init,
      headers: {'content-type': 'application/json', ...(init.headers || {})}
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `Cloud request failed (${response.status})`);
    return payload;
  };

  const unique = values => [...new Set((values || []).filter(value => typeof value === 'string' && value))];

  window.BillyCloudApi = Object.freeze({
    version: 2,
    isConfigured: () => !!apiBase,
    getBaseUrl: () => apiBase,
    configure: value => { apiBase = normalizeBase(value); return apiBase; },
    health: () => request('/api/health', {method: 'GET'}),
    getFavorites: userId => request(`/api/users/${encodeURIComponent(userId)}/favorites`, {method: 'GET'}),
    putFavorites: (userId, favorites) => request(`/api/users/${encodeURIComponent(userId)}/favorites`, {
      method: 'PUT', body: JSON.stringify({favorites: unique(favorites)})
    }),
    getProgress: userId => request(`/api/users/${encodeURIComponent(userId)}/progress`, {method: 'GET'}),
    putProgress: (userId, progress) => request(`/api/users/${encodeURIComponent(userId)}/progress`, {
      method: 'PUT',
      body: JSON.stringify({seen: unique(progress?.seen), favorites: unique(progress?.favorites)})
    })
  });
})();
