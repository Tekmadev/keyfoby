import { trackSiteEvent } from "@/lib/analytics";
import { byId, on, qs, runAll, type Cleanup } from "./dom";

/** Header, menu, clock, sticky bar focus rule and data-track analytics: every page. */
export function initChrome(): Cleanup {
  const d = document;
  const cleanups: (Cleanup | void)[] = [];

  /* ---- live local clock (America/Toronto) ---- */
  const clocks = d.querySelectorAll<HTMLElement>("[data-clock]");
  let fmt: Intl.DateTimeFormat | null = null;
  try {
    fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", hour: "numeric", minute: "2-digit", hour12: true });
  } catch { /* old browser: keep "24/7" */ }
  const tick = () => {
    if (!fmt) return;
    const t = fmt.format(new Date()).replace(/\s*a\.?\s?m\.?/i, " AM").replace(/\s*p\.?\s?m\.?/i, " PM");
    clocks.forEach((c) => { c.textContent = t; });
  };
  tick();
  let timer = 0;
  const loop = () => { timer = window.setTimeout(() => { tick(); loop(); }, 60000 - (Date.now() % 60000) + 40); };
  loop();
  cleanups.push(() => window.clearTimeout(timer));

  /* ---- mobile menu: the rest of the page is inert while the sheet is open ---- */
  const menuBtn = byId<HTMLButtonElement>("menu-btn");
  const sheet = byId("sheet");
  const bar = qs<HTMLElement>(".actionbar");
  if (menuBtn && sheet) {
    const outside = [qs(".skip"), qs("main"), qs(".fastpath-wrap"), qs(".footer")];
    const setMenu = (open: boolean, refocus: boolean) => {
      menuBtn.setAttribute("aria-expanded", String(open));
      sheet.hidden = !open;
      d.body.style.overflow = open ? "hidden" : "";
      outside.forEach((el) => { if (el) el.inert = open; });
      if (open) qs<HTMLElement>("a", sheet)?.focus();
      else if (refocus) menuBtn.focus();
    };
    cleanups.push(
      on(menuBtn, "click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true", true)),
      on(sheet, "click", (e) => { if ((e.target as Element).closest("a")) setMenu(false, false); }),
      on(d, "keydown", (e) => { if (e.key === "Escape" && !sheet.hidden) setMenu(false, true); }),
      () => { if (!sheet.hidden) setMenu(false, false); },
    );
  }

  /* ---- keep keyboard focus clear of the sticky action bar ---- */
  if (bar) {
    cleanups.push(on(d, "focusin", (e) => {
      if (window.innerWidth >= 1024 || bar.contains(e.target as Node) || (sheet && !sheet.hidden)) return;
      const target = e.target as HTMLElement;
      /* keyboard focus only: scrolling during a tap would move the tile out from under the finger */
      let kb = true;
      try { kb = target.matches(":focus-visible"); } catch { /* ignore */ }
      if (!kb) return;
      const cover = bar.classList.contains("is-tucked") ? qs(".act__send") : bar;
      if (!cover || cover.contains(target)) return;
      const r = target.getBoundingClientRect();
      const top = cover.getBoundingClientRect().top;
      if (r.bottom > top - 8) window.scrollBy(0, r.bottom - top + 16);
    }));
  }

  /* ---- analytics for call / WhatsApp links (labels only, never what the visitor typed) ---- */
  cleanups.push(on(d, "click", (e) => {
    const a = (e.target as Element).closest<HTMLElement>("[data-track]");
    if (!a) return;
    const kind = a.dataset.track;
    const loc = a.dataset.trackLoc || undefined;
    if (kind === "call") trackSiteEvent("phone_click", { contact_method: "phone", link_location: loc });
    else if (kind === "whatsapp") trackSiteEvent("whatsapp_click", { contact_method: "whatsapp", link_location: loc, key_type: d.documentElement.dataset.pick });
  }, { capture: true }));

  return runAll(cleanups);
}
