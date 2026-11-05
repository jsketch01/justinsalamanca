(() => {
  if (window.__lightbox) return; window.__lightbox = true;
  const srcOf = el => el.tagName === 'IMAGE-SLOT' ? (el._img && el._img.currentSrc || el._img && el._img.src || '') : (el.currentSrc || el.src || '');
  const ok = el => !el.closest('header, nav, footer, a') && srcOf(el);
  const mark = () => document.querySelectorAll('image-slot, img').forEach(el => { if (ok(el)) el.style.cursor = 'zoom-in'; });
  const btnStyle = { display: 'inline-flex', alignItems: 'center', gap: '6px', minHeight: '40px', padding: '0 14px', border: '0', borderRadius: '999px', background: '#1A1A1A', color: '#F1F0EB', font: "500 14px 'Bricolage Grotesque', sans-serif", cursor: 'pointer', boxShadow: '0 6px 16px rgba(0,0,0,0.25)' };
  const markEmbeds = () => document.querySelectorAll('iframe[src*="figma.com"]').forEach(fr => {
    const box = fr.parentElement; if (!box || box.__lbBtn) return; box.__lbBtn = true;
    const b = document.createElement('button'); b.type = 'button'; b.textContent = '⤢ Expand'; b.setAttribute('aria-label', 'Expand prototype');
    Object.assign(b.style, btnStyle, { position: 'absolute', top: '12px', right: '12px', zIndex: '2' });
    b.addEventListener('click', e => { e.stopPropagation(); openEmbed(fr); });
    box.appendChild(b);
  });
  const openEmbed = fr => {
    const r = fr.getBoundingClientRect(), ar = r.width / r.height;
    ov = document.createElement('div');
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Expanded prototype');
    Object.assign(ov.style, { position: 'fixed', inset: '0', zIndex: '1000', background: 'rgba(20,20,19,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px clamp(12px, 3vw, 40px) clamp(12px, 3vw, 40px)', boxSizing: 'border-box', opacity: '0', transition: 'opacity 0.18s ease' });
    const f = document.createElement('iframe');
    f.src = fr.src; f.title = fr.title || 'Prototype'; f.allowFullscreen = true;
    Object.assign(f.style, { border: '0', display: 'block', aspectRatio: String(ar), width: 'min(100%, calc((100vh - 104px) * ' + ar + '))', maxHeight: '100%', borderRadius: '8px', background: '#F1F0EB' });
    const c = document.createElement('button'); c.type = 'button'; c.textContent = '✕ Close'; c.setAttribute('aria-label', 'Close');
    Object.assign(c.style, btnStyle, { position: 'absolute', top: '12px', right: '12px', background: '#F1F0EB', color: '#1A1A1A' });
    c.addEventListener('click', close);
    ov.addEventListener('click', e => { if (e.target === ov) close(); });
    ov.append(f, c); document.body.appendChild(ov); document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => { ov.style.opacity = '1'; });
  };
  new MutationObserver(() => { mark(); markEmbeds(); }).observe(document.documentElement, { childList: true, subtree: true });
  setInterval(() => { mark(); markEmbeds(); }, 1500);
  let ov = null;
  const close = () => { if (!ov) return; ov.style.opacity = '0'; const o = ov; ov = null; setTimeout(() => o.remove(), 180); document.body.style.overflow = ''; };
  const open = (src, alt) => {
    ov = document.createElement('div');
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Expanded image');
    Object.assign(ov.style, { position: 'fixed', inset: '0', zIndex: '1000', background: 'rgba(20,20,19,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px, 4vw, 56px)', boxSizing: 'border-box', cursor: 'zoom-out', opacity: '0', transition: 'opacity 0.18s ease' });
    const img = document.createElement('img');
    img.src = src; img.alt = alt || '';
    Object.assign(img.style, { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 24px 60px rgba(0,0,0,0.5)', transform: 'scale(0.97)', transition: 'transform 0.18s ease' });
    const hint = document.createElement('div');
    hint.textContent = 'Tap anywhere or press Esc to close';
    Object.assign(hint.style, { position: 'absolute', left: '0', right: '0', bottom: '16px', textAlign: 'center', font: "400 13px 'Pixelify Sans', sans-serif", letterSpacing: '0.08em', color: '#E8E6E0' });
    ov.append(img, hint); document.body.appendChild(ov); document.body.style.overflow = 'hidden';
    ov.addEventListener('click', close);
    requestAnimationFrame(() => { ov.style.opacity = '1'; img.style.transform = 'scale(1)'; });
  };
  document.addEventListener('click', e => {
    if (ov) return;
    const el = e.composedPath().find(n => n.tagName === 'IMAGE-SLOT' || (n.tagName === 'IMG' && !(n.getRootNode() instanceof ShadowRoot)));
    if (!el || !ok(el)) return;
    e.preventDefault(); e.stopPropagation();
    open(srcOf(el), el.getAttribute('alt') || el.getAttribute('placeholder'));
  }, true);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
