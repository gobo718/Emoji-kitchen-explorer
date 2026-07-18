/* Billy Labs cloud configuration — v2.2.9
   Set the public Worker URL here once, or use Curator → Settings to create a configured replacement file. */
(() => {
  const normalize = value => String(value || '').trim().replace(/\/+$/, '');
  const deployedBase = ''; // Example: https://billy-labs-api.your-subdomain.workers.dev
  let browserBase = '';
  try { browserBase = localStorage.getItem('billy-cloud-api-base') || ''; } catch {}
  window.BILLY_CLOUD_API_BASE = normalize(browserBase || window.BILLY_CLOUD_API_BASE || deployedBase);
})();
