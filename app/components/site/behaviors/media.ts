import { byId, on, qs, qsa, reducedMotion, runAll, type Cleanup } from "./dom";

type NetInfo = { saveData?: boolean };
const saveData = () => !!(navigator as Navigator & { connection?: NetInfo }).connection?.saveData;

/** One-time section reveal (motion allowed only). */
export function initReveal(): Cleanup | void {
  const els = qsa("[data-reveal]");
  if (!els.length || reducedMotion().matches || !("IntersectionObserver" in window)) return;
  const root = document.documentElement;
  root.classList.add("reveal-on");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -6% 0px" });
  els.forEach((el) => io.observe(el));
  return () => { io.disconnect(); root.classList.remove("reveal-on"); };
}

/** Below-the-fold images start loading ~800px before they scroll into view (Save-Data respected). */
export function initLazyImages(): Cleanup | void {
  if (!("IntersectionObserver" in window) || saveData()) return;
  const io = new IntersectionObserver((es) => {
    es.forEach((en) => { if (en.isIntersecting) { (en.target as HTMLImageElement).loading = "eager"; io.unobserve(en.target); } });
  }, { rootMargin: "800px 0px" });
  qsa<HTMLImageElement>('img[loading="lazy"]').forEach((im) => io.observe(im));
  return () => io.disconnect();
}

/** Hero loop (the car's blinking lights): after load, motion allowed, no Save-Data. The still stays if anything fails. */
export function initHeroLoop(): Cleanup | void {
  const v = qs<HTMLVideoElement>(".hero__media video");
  const pauseBtn = byId<HTMLButtonElement>("hero-pause");
  if (!v || !pauseBtn) return;
  const cleanups: (Cleanup | void)[] = [];
  let idle = 0, timer = 0;
  /* WCAG 2.2.2: the loop runs longer than 5 s, so it gets a pause control */
  cleanups.push(on(pauseBtn, "click", () => {
    const paused = !v.paused;
    if (paused) v.pause();
    else v.play()?.catch(() => {});
    pauseBtn.setAttribute("aria-pressed", String(paused));
  }));
  const start = () => {
    if (v.querySelector("source")) return;
    v.muted = true;
    ([["webm", "video/webm"], ["mp4", "video/mp4"]] as const).forEach(([k, type]) => {
      const src = document.createElement("source");
      src.src = v.getAttribute(`data-${k}`) || "";
      src.type = type;
      v.appendChild(src);
    });
    v.addEventListener("playing", () => { v.classList.add("is-playing"); pauseBtn.hidden = false; }, { once: true });
    v.addEventListener("error", () => { v.remove(); pauseBtn.hidden = true; }, true);
    v.load();
    try { v.play()?.catch(() => {}); } catch { /* ignore */ }
  };
  const begin = () => {
    if (reducedMotion().matches || saveData()) return;
    if ("requestIdleCallback" in window) idle = window.requestIdleCallback(start, { timeout: 2000 });
    else timer = globalThis.setTimeout(start, 200) as unknown as number;
  };
  if (document.readyState === "complete") begin();
  else cleanups.push(on(window, "load", begin, { once: true }));
  cleanups.push(() => {
    if (idle && "cancelIdleCallback" in window) window.cancelIdleCallback(idle);
    window.clearTimeout(timer);
  });
  return runAll(cleanups);
}

/** Live Google reviews (Elfsight, as in the approved mock): loaded only when the slot nears the viewport. */
const ELFSIGHT_APP = "elfsight-app-8e58cda1-9372-4ac0-954e-927b5ca5d3a7";
export function initReviews(): Cleanup | void {
  const mount = byId("reviews-widget");
  if (!mount || !("IntersectionObserver" in window)) return;
  let mo: MutationObserver | null = null;
  const io = new IntersectionObserver((es) => {
    if (!es.some((e) => e.isIntersecting)) return;
    io.disconnect();
    if (qs(`.${ELFSIGHT_APP}`, mount)) return;
    const app = document.createElement("div");
    app.className = ELFSIGHT_APP;
    app.setAttribute("data-elfsight-app-lazy", "");
    mount.prepend(app); /* before the skeleton rows, so the last row keeps its :last-child style */
    mo = new MutationObserver(() => {
      if (app.childElementCount > 0) { mount.classList.add("is-live"); mo?.disconnect(); }
    });
    mo.observe(app, { childList: true });
    if (!document.querySelector('script[src*="static.elfsight.com/platform/platform.js"]')) {
      const s = document.createElement("script");
      s.src = "https://static.elfsight.com/platform/platform.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, { rootMargin: "400px 0px" });
  io.observe(mount);
  return () => { io.disconnect(); mo?.disconnect(); };
}
