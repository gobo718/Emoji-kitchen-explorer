/* Billy Labs canonical mashup identity — v1 */
(() => {
  const normalizeEmoji = value => String(value || '').normalize('NFC');
  const compare = (a,b) => Array.from(a).map(c=>c.codePointAt(0)).join('-').localeCompare(Array.from(b).map(c=>c.codePointAt(0)).join('-'));
  const canonicalPair = (left,right) => {
    const a=normalizeEmoji(left), b=normalizeEmoji(right);
    return compare(a,b)<=0 ? [a,b] : [b,a];
  };
  const id = (left,right) => canonicalPair(left,right).join('|');
  const buildUrl = (mashup, base='mashup.html') => {
    const left = Array.isArray(mashup) ? mashup[0] : mashup.left;
    const right = Array.isArray(mashup) ? mashup[1] : mashup.right;
    return `${base}?left=${encodeURIComponent(left)}&right=${encodeURIComponent(right)}`;
  };
  const open = mashup => { window.location.href = buildUrl(mashup); };
  window.BillyMashups = {version:1, normalizeEmoji, canonicalPair, id, buildUrl, open};
})();
