(()=>{
  if(document.querySelector('.billy-bottom-nav')) return;
  const style=document.createElement('style');
  style.textContent=`
    body{padding-bottom:88px!important}
    .billy-bottom-nav{position:fixed;z-index:9999;left:50%;bottom:max(10px,env(safe-area-inset-bottom));transform:translateX(-50%);width:min(520px,calc(100% - 22px));display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:8px;border:1px solid rgba(255,255,255,.16);border-radius:22px;background:rgba(10,9,25,.92);box-shadow:0 18px 55px rgba(0,0,0,.55);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
    .billy-bottom-nav a{min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:8px 4px;border-radius:15px;color:#eee8ff;text-decoration:none;font:800 11px/1.15 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.01em}
    .billy-bottom-nav a:hover,.billy-bottom-nav a:focus-visible{background:rgba(255,255,255,.09);outline:none}
    .billy-bottom-nav a[aria-current="page"]{background:linear-gradient(135deg,rgba(139,92,255,.34),rgba(255,104,170,.22));color:#fff}
    .billy-bottom-nav .nav-icon{font-size:1.45rem;line-height:1}
    @media(max-width:420px){.billy-bottom-nav{gap:3px;padding:6px}.billy-bottom-nav a{font-size:10px;padding:8px 2px}.billy-bottom-nav .nav-icon{font-size:1.35rem}}
  `;
  document.head.append(style);
  const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const items=[
    ['studio.html','🎨','Studio'],
    ['blurblets.html','🖼️','Gallery'],
    ['profile.html','👤','Fellow'],
    ['trophy-room.html','🏆','Trophies']
  ];
  const nav=document.createElement('nav');
  nav.className='billy-bottom-nav';
  nav.setAttribute('aria-label','Main navigation');
  nav.innerHTML=items.map(([href,icon,label])=>`<a href="${href}"${current===href?' aria-current="page"':''}><span class="nav-icon" aria-hidden="true">${icon}</span><span>${label}</span></a>`).join('');
  document.body.append(nav);
})();