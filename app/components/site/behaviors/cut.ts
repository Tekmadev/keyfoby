import { clamp, on, qs, qsa, reducedMotion, runAll, type Cleanup } from "./dom";

/* =========================================================
   HOW IT WORKS: the blade is cut as you scroll. Pins only while
   the whole figure fits; static (fully cut) otherwise or with
   reduced motion. The step buttons work by keyboard either way.
   ========================================================= */
export function initCut(): Cleanup | void {
  const d = document, root = d.documentElement;
  const sec = qs<HTMLElement>(".process");
  if (!sec) return;
  const reduce = reducedMotion();
  const header = qs<HTMLElement>(".header")!;
  const bar = qs<HTMLElement>(".actionbar")!;
  const probe = qs<HTMLElement>(".vh-probe")!;
  const sticky = qs<HTMLElement>(".process__sticky", sec)!;
  const top = qs<HTMLElement>(".process__top", sec)!;
  const cutbox = qs<HTMLElement>(".cutbox", sec)!;
  const svg = qs<SVGSVGElement>(".blade", sec)!;
  const view = qs<HTMLElement>(".blade-view", sec)!;
  const pan = qs<HTMLElement>(".blade-pan", sec)!;
  const clipRemain = svg.querySelector("#cr")!;
  const clipDone = svg.querySelector("#cd")!;
  const cutter = svg.querySelector(".cutter")!;
  const wheel = svg.querySelector(".c-wheel")!;
  const codes = Array.from(svg.querySelectorAll(".b-code"));
  const brackets = Array.from(svg.querySelectorAll(".b-br-on"));
  const readout = qs<HTMLElement>("[data-readout]", sec)!;
  const steps = qsa<HTMLElement>(".step", sec);
  const buttons = qsa<HTMLButtonElement>(".step__num", sec);
  const cleanups: (Cleanup | void)[] = [];

  const LAND = 110, X0 = 184, X1 = 1100, R = 31, LIFT = 24;
  const CUTS = [[229.2, 24], [387.5, 48], [545.8, 16], [704.2, 40], [862.5, 32], [1020.8, 56]];
  const SEGS = [[150, 466.7], [466.7, 783.3], [783.3, 1100]];
  const P_START = 0.06, P_SPAN = 0.84;
  const profileY = (x: number) => {
    for (const [c, dd] of CUTS) {
      const off = Math.abs(x - c);
      if (off <= 8) return LAND + dd;
      if (off < 8 + dd) return LAND + dd - (off - 8);
    }
    return LAND;
  };
  let animated = false, lift = 0, lastQ = -1, ticking = false;
  let picked: number | undefined;
  let vw = 0, sw = 0; /* measured in layout(), never inside render() */
  const measure = () => { vw = view.clientWidth; sw = pan.offsetWidth; };

  function render(q: number, focusIndex?: number) {
    const x = X0 + (X1 - X0) * q;
    const lifted = q <= 0 || q >= 1 ? LIFT : 0;
    const cx = q <= 0 ? 150 : x;
    clipRemain.setAttribute("transform", `translate(${cx.toFixed(1)} 0)`);
    clipDone.setAttribute("transform", `translate(${cx.toFixed(1)} 0)`);
    cutter.setAttribute("transform", `translate(${x.toFixed(1)} ${(profileY(x) - R - lifted).toFixed(1)})`);
    wheel.setAttribute("transform", `rotate(${(q * 1440).toFixed(1)})`);
    let cutCount = 0;
    CUTS.forEach((cd, i) => {
      const done = q > 0 && x >= cd[0] + 8 + cd[1] - 0.5;
      if (done) cutCount++;
      codes[i].classList.toggle("is-cut", done);
    });
    readout.textContent = String(cutCount);
    let open = -1;
    steps.forEach((step, i) => {
      const [a, b] = SEGS[i];
      let state = q > 0 && x >= b - 1 ? "done" : q > 0 && (x > a + 2 || i === 0) ? "current" : "todo";
      if (typeof focusIndex === "number") state = focusIndex === i ? "current" : state === "todo" ? "todo" : "done";
      step.dataset.state = state;
      if (state === "current") open = i;
      brackets[i].classList.toggle("is-current", state === "current");
      qs<HTMLElement>(".step__num", step)?.setAttribute("aria-current", state === "current" ? "step" : "false");
    });
    if (open < 0) open = steps.every((st) => st.dataset.state === "done") ? 2 : 0;
    steps.forEach((step, i) => step.classList.toggle("is-open", i === open));
    if (sw > vw + 1) {
      const tx = clamp(vw / 2 - (x / 1200) * sw, vw - sw, 0);
      pan.style.transform = `translate3d(${tx.toFixed(1)}px,0,0)`;
    } else {
      pan.style.transform = "";
    }
  }
  const stickyTop = () => header.offsetHeight - lift;
  const progress = () => {
    const r = sec.getBoundingClientRect();
    const total = sec.offsetHeight - sticky.offsetHeight;
    return total > 0 ? clamp((stickyTop() - r.top) / total, 0, 1) : 1;
  };
  const update = () => {
    ticking = false;
    const q = clamp((progress() - P_START) / P_SPAN, 0, 1);
    if (Math.abs(q - lastQ) > 0.0005) { lastQ = q; render(q); }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  const barHeight = () => (getComputedStyle(bar).display === "none" ? 0 : bar.offsetHeight);
  function setStatic() {
    animated = false; lift = 0;
    root.classList.remove("cut-anim");
    sticky.style.removeProperty("--lift"); sticky.style.removeProperty("--panel-h"); sticky.style.removeProperty("--stage-pad");
    window.removeEventListener("scroll", onScroll);
    measure();
    render(1, picked);
  }
  /* mode from stable sizes only (width, small viewport height); pin only when the panel holds it all */
  function layout() {
    if (reduce.matches) { setStatic(); return; }
    root.classList.add("cut-anim");
    sticky.style.setProperty("--lift", "0px");
    sticky.style.setProperty("--stage-pad", "0px");
    measure();
    render(0);
    const avail = probe.offsetHeight - header.offsetHeight - barHeight();
    const topH = top.offsetHeight;
    const boxH = cutbox.offsetHeight + 8;
    /* short phones get a tighter margin so the figure still pins */
    const PAD = avail < 600 ? 12 : 24;
    if (topH + boxH + PAD <= avail) lift = 0;
    else if (boxH + 2 * PAD <= avail) lift = topH + 16;
    else { setStatic(); return; }
    const hidden = Math.max(0, lift - topH);
    const free = avail - Math.max(0, topH - lift) - boxH;
    sticky.style.setProperty("--lift", `${lift}px`);
    sticky.style.setProperty("--panel-h", `${avail + lift}px`);
    sticky.style.setProperty("--stage-pad", `${hidden + Math.max(PAD, Math.round(free / 2))}px`);
    animated = true;
    window.removeEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    lastQ = -1; update();
  }
  buttons.forEach((btn, i) => {
    cleanups.push(on(btn, "click", () => {
      if (!animated) { picked = i; render(1, i); return; }
      const q = (SEGS[i][1] - 4 - X0) / (X1 - X0);
      const p = P_START + q * P_SPAN;
      const total = sec.offsetHeight - sticky.offsetHeight;
      const y = window.scrollY + sec.getBoundingClientRect().top - stickyTop() + p * total;
      window.scrollTo({ top: Math.round(y), behavior: reduce.matches ? "auto" : "smooth" });
    }));
  });
  let lastW = window.innerWidth, lastH = probe.offsetHeight;
  let alive = true;
  layout();
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(() => { if (alive) { lastQ = -1; layout(); } });
  cleanups.push(on(window, "resize", () => {
    const w = window.innerWidth, h = probe.offsetHeight;
    if (w === lastW && h === lastH) { measure(); if (animated) { lastQ = -1; update(); } return; }
    lastW = w; lastH = h; layout();
  }));
  const onPref = () => layout();
  reduce.addEventListener?.("change", onPref);
  cleanups.push(
    () => reduce.removeEventListener?.("change", onPref),
    () => { alive = false; window.removeEventListener("scroll", onScroll); root.classList.remove("cut-anim"); },
  );
  return runAll(cleanups);
}
