// Animasi kecil, tanpa library; interaksi tetap langsung berfungsi tanpa animasi.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const precisePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const easing = 'cubic-bezier(.22,1,.36,1)';
  const animations = new Set();
  const closing = new WeakMap();
  let pageAnimation;
  let heroObserver;
  let pointerFrame = 0;
  let scrollFrame = 0;
  let activeSurface;

  function animate(element, frames, options = {}) {
    if (!element || reduced.matches || !element.animate) return null;
    const animation = element.animate(frames, { duration: 420, easing, ...options });
    animations.add(animation);
    animation.finished.catch(() => {}).finally(() => animations.delete(animation));
    return animation;
  }
  function scrollState() {
    scrollFrame = 0;
    const available = document.documentElement.scrollHeight - innerHeight;
    const progress = available > 0 ? Math.min(1, Math.max(0, scrollY / available)) : 0;
    document.querySelector('.header').style.setProperty('--scroll-progress', progress);
    document.querySelector('.header').classList.toggle('is-scrolled', scrollY > 16);
  }
  function scheduleScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(scrollState); }
  function resetSurface() {
    if (pointerFrame) cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    if (activeSurface) {
      activeSurface.style.removeProperty('--pointer-x');
      activeSurface.style.removeProperty('--pointer-y');
      activeSurface = null;
    }
  }
  function prepare(root = document) {
    root.querySelectorAll('.division-members, .people-row, .gallery, .values').forEach(group => {
      [...group.children].forEach((element, index) => element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 65}ms`));
    });
    scheduleScroll();
  }
  function enterPage(root) {
    pageAnimation?.cancel();
    resetSurface();
    prepare(root);
    pageAnimation = animate(root, [{ opacity: .35, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 380 });
    root.querySelectorAll('.hero-copy > *, .page-head .container > *').forEach((element, index) => {
      animate(element, [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }], { delay: index * 65, duration: 620, fill: 'backwards' });
    });
    heroObserver?.disconnect();
    const hero = root.querySelector('.hero-art');
    if (hero && 'IntersectionObserver' in window) {
      heroObserver = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('is-in-view', entry.isIntersecting)), { threshold: .05 });
      heroObserver.observe(hero);
    }
  }
  function openDialog(dialog) {
    closing.get(dialog)?.cancel();
    closing.delete(dialog);
    dialog.getAnimations().forEach(animation => animation.cancel());
    animate(dialog, [{ opacity: 0, transform: 'translateY(20px) scale(.97)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 330 });
  }
  async function closeDialog(dialog) {
    if (!dialog.open || closing.has(dialog)) return;
    dialog.getAnimations().forEach(animation => animation.cancel());
    const animation = animate(dialog, [{ opacity: 1, transform: 'translateY(0) scale(1)' }, { opacity: 0, transform: 'translateY(12px) scale(.98)' }], { duration: 160 });
    if (!animation) { dialog.close(); return; }
    closing.set(dialog, animation);
    try { await animation.finished; if (closing.get(dialog) === animation) dialog.close(); }
    catch { /* Popup sudah diganti atau preferensi gerakan berubah. */ }
    finally { if (closing.get(dialog) === animation) closing.delete(dialog); }
  }
  document.addEventListener('pointermove', event => {
    if (reduced.matches || !precisePointer.matches || event.pointerType !== 'mouse') return;
    const surface = event.target.closest('.hero-art, .person-card');
    if (surface !== activeSurface) { resetSurface(); activeSurface = surface; }
    if (!surface || pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      if (!surface.isConnected) return;
      const rect = surface.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
      surface.style.setProperty('--pointer-x', `${x * 5}px`);
      surface.style.setProperty('--pointer-y', `${y * 4}px`);
    });
  }, { passive: true });
  document.addEventListener('pointerout', event => { if (!event.relatedTarget) resetSurface(); }, { passive: true });
  document.addEventListener('pointerdown', event => {
    if (reduced.matches || event.button !== 0) return;
    const button = event.target.closest('.btn, .filter');
    if (!button || button.disabled) return;
    button.querySelectorAll('.touch-ripple').forEach(node => node.remove());
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'touch-ripple'; ripple.setAttribute('aria-hidden', 'true');
    const diameter = Math.max(rect.width, rect.height) * 2;
    Object.assign(ripple.style, { width: `${diameter}px`, height: `${diameter}px`, left: `${event.clientX - rect.left - diameter / 2}px`, top: `${event.clientY - rect.top - diameter / 2}px` });
    button.append(ripple);
    const animation = animate(ripple, [{ opacity: .22, transform: 'scale(0)' }, { opacity: 0, transform: 'scale(1)' }], { duration: 550 });
    if (animation) animation.finished.catch(() => {}).finally(() => ripple.remove()); else ripple.remove();
  }, { passive: true });
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', () => { resetSurface(); scheduleScroll(); }, { passive: true });
  window.addEventListener('blur', resetSurface);
  document.addEventListener('visibilitychange', () => {
    document.documentElement.classList.toggle('motion-paused', document.hidden);
    if (document.hidden) resetSurface();
  });
  reduced.addEventListener('change', () => {
    resetSurface();
    if (reduced.matches) {
      const dialog = document.querySelector('dialog');
      const wasClosing = closing.has(dialog);
      animations.forEach(animation => animation.cancel());
      if (wasClosing) { closing.delete(dialog); dialog.close(); }
    }
  });
  window.IKMMotion = { prepare, enterPage, openDialog, closeDialog };
  scheduleScroll();
})();
