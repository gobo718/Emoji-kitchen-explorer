/* Billy Labs shared local progress engine — v1 */
(() => {
  const KEYS={seen:'billy-progress-seen-v1',favorites:'billy-progress-favorites-v1'};
  const legacy={seen:'ek-seen',favorites:'ek-favorites'};
  const read=(key,fallback=[])=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}};
  const write=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
  const canonicalizeLegacy = value => {
    const parts=String(value).split('|');
    return parts.length>=2 ? BillyMashups.id(parts[0],parts[1]) : value;
  };
  function migrate(kind){
    const current=new Set(read(KEYS[kind],[]));
    read(legacy[kind],[]).forEach(x=>current.add(canonicalizeLegacy(x)));
    write(KEYS[kind],[...current]);
    return current;
  }
  const seen=migrate('seen'), favorites=migrate('favorites');
  const api={
    version:1,
    markSeen:(l,r)=>{seen.add(BillyMashups.id(l,r));write(KEYS.seen,[...seen]);},
    hasSeen:(l,r)=>seen.has(BillyMashups.id(l,r)),
    toggleFavorite:(l,r)=>{const k=BillyMashups.id(l,r);favorites.has(k)?favorites.delete(k):favorites.add(k);write(KEYS.favorites,[...favorites]);return favorites.has(k)},
    isFavorite:(l,r)=>favorites.has(BillyMashups.id(l,r)),
    snapshot:()=>({seen:[...seen],favorites:[...favorites]})
  };
  window.BillyProgress=api;
})();
