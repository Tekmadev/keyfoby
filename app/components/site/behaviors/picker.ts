import { trackSiteEvent } from "@/lib/analytics";
import { WA_BASE as WA } from "../links";
import { byId, on, qs, qsa, reducedMotion, runAll, type Cleanup } from "./dom";

/* =========================================================
   KEY PICKER: tap a key, it flies into the specimen slot, the
   panel builds a WhatsApp message. Two taps to a chat. The pick
   carries into the sticky bar, every WhatsApp link and the quote
   form (never overwriting what the visitor typed there).
   ========================================================= */
const KEYS: Record<string, { name: string; label: string }> = {
  blade: { name: "blade key", label: "Blade key" },
  remote: { name: "remote key", label: "Remote key" },
  flip: { name: "flip key", label: "Flip key" },
  smart: { name: "smart key", label: "Smart key" },
};

type ImgWithRect = HTMLImageElement & { __rect?: DOMRect };

/** Makes whose name has a space or hyphen: "Land Rover Range Rover" is Land Rover + Range Rover, not Land + Rover Range Rover. */
const MULTI_WORD_MAKES = ["land rover", "alfa romeo", "aston martin", "rolls-royce", "rolls royce", "mercedes-benz", "mercedes benz"];
/** "Honda Civic" -> ["Honda", "Civic"]; one word -> [word, ""]. */
export function splitMakeModel(mm: string): [string, string] {
  const low = mm.toLowerCase();
  for (const m of MULTI_WORD_MAKES) {
    if (low === m) return [mm, ""];
    if (low.startsWith(m + " ")) return [mm.slice(0, m.length), mm.slice(m.length + 1).trim()];
  }
  const sp = mm.indexOf(" ");
  return sp > 0 ? [mm.slice(0, sp), mm.slice(sp + 1)] : [mm, ""];
}

export function initPicker(): Cleanup | void {
  const d = document;
  const group = byId("tiles");
  const panel = byId("panel");
  const act = byId("act");
  const send = byId<HTMLAnchorElement>("pk-send");
  if (!group || !panel || !act || !send) return;
  const reduce = reducedMotion();
  const header = qs<HTMLElement>(".header")!;
  const bar = qs<HTMLElement>(".actionbar")!;
  const tiles = qsa<HTMLElement>(".tile", group);
  const pks = qsa<HTMLElement>(".pk", panel);
  const sendRow = send.parentElement as HTMLElement;
  const msgEl = byId("pk-msg")!;
  const live = byId("pick-live")!;
  const yearEl = byId<HTMLInputElement>("pk-year")!;
  const mmEl = byId<HTMLInputElement>("pk-mm")!;
  const townEl = byId<HTMLSelectElement>("pk-town")!;
  const otherWrap = byId("pk-other-wrap")!;
  const otherEl = byId<HTMLInputElement>("pk-other")!;
  const lostNote = byId("pk-lost")!;
  const waLinks = qsa<HTMLAnchorElement>("[data-wa]");
  const barWa = byId<HTMLAnchorElement>("bar-wa");
  const barKt = barWa ? qs<HTMLElement>(".kt", barWa) : null;
  const barDot = barWa ? qs<HTMLElement>(".pick-dot", barWa) : null;
  let current: string | null = null;
  let flight: Animation | null = null;
  const cleanups: (Cleanup | void)[] = [];

  /* upgrade the no-JS links (:target) to a WAI-ARIA radio group */
  group.setAttribute("role", "radiogroup");
  group.setAttribute("aria-labelledby", "pick-q");
  group.setAttribute("aria-describedby", "pick-hint");
  pks.forEach((p) => {
    if (!p.dataset.panel) p.dataset.panel = p.id;
    p.removeAttribute("id");
    p.hidden = true;
  });
  tiles.forEach((t, i) => {
    /* radios, not links: drop the href so nothing announces "link" or offers "open in new tab" */
    if (t.hasAttribute("href")) { t.dataset.href = t.getAttribute("href") || ""; t.removeAttribute("href"); }
    t.setAttribute("role", "radio");
    t.setAttribute("aria-checked", "false");
    t.setAttribute("aria-controls", "panel");
    t.tabIndex = i === 0 ? 0 : -1;
  });

  const haveVal = () => qs<HTMLInputElement>('input[name="pk-have"]:checked', act)?.value || "";
  const tidy = (s: string) => s.trim().replace(/\s+/g, " ").replace(/[.,;:!\s]+$/, "");
  const yearVal = () => { const y = yearEl.value.trim(); return /^\d{4}$/.test(y) ? y : ""; };
  function message() {
    const k = current ? KEYS[current] : null;
    const key = k ? k.name : "car key";
    const y = yearVal(), mm = tidy(mmEl.value);
    const car = y && mm ? `${y} ${mm}` : mm || (y ? `${y} car` : "");
    const forCar = car ? ` for my ${car}` : "";
    const have = haveVal();
    let m: string;
    if (have === "lost") m = `Hi KeyFoby, I've lost all my keys and need a price for a ${key}${forCar}.`;
    else if (have === "spare") m = `Hi KeyFoby, I need a price for a spare ${key}${forCar}.`;
    else m = `Hi KeyFoby, I need a price for a ${key}${forCar}.`;
    const town = townEl.value;
    if (town === "other") {
      const t = tidy(otherEl.value);
      m += t ? ` The car is in ${t}.` : " The car is in another town (I'll tell you where).";
    } else if (town) m += ` The car is in ${town}.`;
    return m;
  }

  /* ---- carry the pick into the quote form ---- */
  const F = {
    key: byId<HTMLSelectElement>("f-key"), year: byId<HTMLInputElement>("f-year"), make: byId<HTMLInputElement>("f-make"),
    model: byId<HTMLInputElement>("f-model"), town: byId<HTMLSelectElement>("f-town"), other: byId<HTMLInputElement>("f-other"),
    otherWrap: byId("f-other-wrap"),
  };
  const igPush = byId<HTMLInputElement>("ig-push");
  const igKey = byId<HTMLInputElement>("ig-key");
  const igNote = byId("f-ign-note");
  // The key type tells us the ignition for almost every car: a smart key goes with push-to-start,
  // keys with a metal blade (blade, remote, flip) turn in the ignition. A few cars are exceptions
  // (twist-knob smart keys, flip key + push start), so it is a default the person can change.
  const IGN: Record<string, "key" | "push"> = { smart: "push", blade: "key", remote: "key", flip: "key" };
  let igAuto = false, igUser = false, haveUser = false;
  const tag = (id: string, onState: boolean) => { const t = qs<HTMLElement>(`[data-carried-for="${id}"]`); if (t) t.hidden = !onState; };
  const carryTo = (el: HTMLInputElement | HTMLSelectElement | null, val: string) => {
    if (!el || el.dataset.user) return;
    el.value = val;
    tag(el.id, !!val);
  };
  const ignNote = () => {
    if (!igNote || !F.key) return;
    const want = IGN[F.key.value];
    const got = igPush?.checked ? "push" : igKey?.checked ? "key" : "";
    let text = "";
    if (want && got && got !== want) text = "That's unusual for this key, and that's fine: some cars are different. We'll confirm on the call.";
    else if (want && igAuto && !igUser) text = "Filled in from your key type. Change it if your car is different.";
    igNote.textContent = text;
    igNote.hidden = !text;
  };
  // A new key type always re-sets the ignition to match it (the person can still change it after).
  const syncIgnition = () => {
    if (!igPush || !igKey || !F.key) return;
    const want = IGN[F.key.value];
    if (want) { igPush.checked = want === "push"; igKey.checked = want === "key"; igAuto = true; igUser = false; }
    else if (igAuto) { igPush.checked = false; igKey.checked = false; igAuto = false; }
    ignNote();
  };
  const syncOther = () => { if (F.otherWrap && F.town) F.otherWrap.hidden = F.town.value !== "other"; };
  function carry() {
    if (!F.key || !current) return;
    if (!F.key.dataset.user) { F.key.value = current; tag("f-key", true); syncIgnition(); }
    carryTo(F.year, yearVal());
    const [make, model] = splitMakeModel(tidy(mmEl.value));
    carryTo(F.make, make);
    carryTo(F.model, model);
    carryTo(F.town, townEl.value);
    syncOther();
    carryTo(F.other, townEl.value === "other" ? tidy(otherEl.value) : "");
    if (!haveUser) {
      const hv = haveVal();
      qsa<HTMLInputElement>('#quote-form input[name="have"]').forEach((r) => { r.checked = r.value === hv; });
      tag("f-have", !!hv);
    }
  }
  [F.year, F.make, F.model, F.other].forEach((el) => {
    if (el) cleanups.push(on(el, "input", () => { el.dataset.user = "1"; tag(el.id, false); }));
  });
  if (F.town) cleanups.push(on(F.town, "change", () => { F.town!.dataset.user = "1"; tag("f-town", false); syncOther(); }));
  if (F.key) cleanups.push(on(F.key, "change", () => { F.key!.dataset.user = "1"; tag("f-key", false); syncIgnition(); }));
  qsa<HTMLInputElement>('#quote-form input[name="ignition"]').forEach((r) => cleanups.push(on(r, "change", () => { igUser = true; ignNote(); })));
  qsa<HTMLInputElement>('#quote-form input[name="have"]').forEach((r) => cleanups.push(on(r, "change", () => { haveUser = true; tag("f-have", false); })));

  function refresh() {
    if (!current) return;
    const m = message();
    const url = `${WA}?text=${encodeURIComponent(m)}`;
    send!.href = url;
    msgEl.textContent = m;
    waLinks.forEach((a) => { a.href = url; });
    /* the sticky bar shows which key its WhatsApp will ask about */
    const k = KEYS[current];
    if (barKt && barDot && barWa) {
      barKt.textContent = k.label; barKt.hidden = false; barDot.hidden = false;
      barWa.setAttribute("aria-label", `WhatsApp: price for a ${k.name}`);
    }
    lostNote.hidden = haveVal() !== "lost";
    otherWrap.hidden = townEl.value !== "other";
    carry();
  }

  /* ---- phones: tuck the sticky bar away while the panel's own Send and "or call" are on screen ---- */
  let actSeen = false;
  const setTuck = () => {
    const tuck = actSeen && !act.hidden && window.innerWidth < 1024;
    bar.classList.toggle("is-tucked", tuck);
    bar.inert = tuck;
  };
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => { es.forEach((en) => { actSeen = en.isIntersecting; }); setTuck(); }, { rootMargin: "0px 0px -120px 0px" });
    io.observe(act);
    cleanups.push(() => io.disconnect());
  }
  cleanups.push(on(window, "resize", setTuck));
  const viewBottom = () => {
    if (window.innerWidth >= 1024) return window.innerHeight - 24;
    return window.innerHeight - (bar.classList.contains("is-tucked") ? 12 : bar.offsetHeight + 12);
  };
  /* backstop: when the message preview grows while typing, keep Send and "or call" in view */
  function keepSendInView() {
    if (window.innerWidth >= 1024 || act!.hidden) return;
    let need = sendRow.getBoundingClientRect().bottom - viewBottom();
    if (need <= 0) return;
    const a = d.activeElement;
    if (a && act!.contains(a)) need = Math.min(need, a.getBoundingClientRect().top - header.offsetHeight - 12);
    if (need > 0) window.scrollBy(0, need);
  }

  /* FLIP: a ghost of the chosen key flies from its tile into the specimen slot (page coordinates) */
  function fly(fromImg: ImgWithRect | null, toImg: HTMLImageElement | null) {
    if (flight) { flight.cancel(); flight = null; }
    if (reduce.matches || !fromImg || !toImg || !toImg.animate) return;
    const a = fromImg.__rect, b = toImg.getBoundingClientRect();
    if (!a || !a.width || !b.width) return;
    const ghost = toImg.cloneNode(false) as HTMLImageElement;
    ghost.className = "ghost";
    ghost.setAttribute("aria-hidden", "true");
    ghost.style.left = `${b.left + window.scrollX}px`;
    ghost.style.top = `${b.top + window.scrollY}px`;
    ghost.style.width = `${b.width}px`;
    ghost.style.height = `${b.height}px`;
    d.body.appendChild(ghost);
    toImg.style.opacity = "0";
    const dx = a.left - b.left, dy = a.top - b.top, s = a.width / b.width;
    const f = ghost.animate([
      { transform: `translate(${dx}px,${dy}px) scale(${s})`, opacity: 0.9 },
      { transform: `translate(${dx * 0.35}px,${dy * 0.35 - 12}px) scale(${s + (1 - s) * 0.6}) rotate(-4deg)`, opacity: 1, offset: 0.55 },
      { transform: "none", opacity: 1 },
    ], { duration: 480, easing: "cubic-bezier(.2,.8,.2,1)" });
    flight = f;
    const done = () => { toImg.style.opacity = ""; ghost.remove(); };
    f.onfinish = () => { done(); if (flight === f) flight = null; };
    f.oncancel = done;
  }

  function select(tile: HTMLElement, opts: { focus?: boolean; scroll?: boolean; silent?: boolean } = {}) {
    const key = tile.getAttribute("data-key") || "";
    const same = key === current;
    const fromImg = qs<ImgWithRect>(".tile__media img", tile);
    if (fromImg) fromImg.__rect = fromImg.getBoundingClientRect();
    const wasOpen = panel!.classList.contains("is-open");
    current = key;
    d.documentElement.dataset.pick = key;
    tiles.forEach((t) => {
      const sel = t === tile;
      t.classList.toggle("is-selected", sel);
      t.setAttribute("aria-checked", sel ? "true" : "false");
      t.tabIndex = sel ? 0 : -1;
    });
    group!.classList.add("has-choice");
    let target: HTMLElement | null = null;
    pks.forEach((p) => {
      const isIt = p.dataset.panel === `key-${key}`;
      p.hidden = !isIt;
      if (isIt) target = p;
    });
    panel!.classList.add("is-open");
    act!.hidden = false;
    if (!wasOpen && !reduce.matches) {
      panel!.classList.remove("is-entering"); void panel!.offsetWidth; panel!.classList.add("is-entering");
    }
    refresh();
    if (!same) {
      live.textContent = `${KEYS[key].label} selected. Add your car if you like, then send it on WhatsApp.`;
      if (!opts.silent) trackSiteEvent("picker_select", { key_type: key });
    }
    if (opts.focus) tile.focus();
    if (opts.scroll) {
      const mobile = window.innerWidth < 1024;
      if (mobile) { actSeen = true; setTuck(); }
      /* the smallest scroll that shows Send and "or call"; on phones never past the key's name */
      let need = mobile
        ? act!.getBoundingClientRect().top + sendRow.offsetHeight - viewBottom() + 24
        : sendRow.getBoundingClientRect().bottom - viewBottom() + 8;
      const tgt = target as HTMLElement | null;
      if (mobile && tgt) {
        const name = qs<HTMLElement>(".pk__name", tgt);
        if (name) need = Math.min(need, name.getBoundingClientRect().top - header.offsetHeight - 8);
      }
      if (need > 0) window.scrollBy({ top: need, behavior: reduce.matches ? "auto" : "smooth" });
    }
    const tgt = target as HTMLElement | null;
    if (!same && tgt) fly(fromImg, qs<HTMLImageElement>(".pk__img", tgt));
  }

  cleanups.push(on(group, "click", (e) => {
    const t = (e.target as Element).closest<HTMLElement>(".tile");
    if (!t) return;
    e.preventDefault();
    select(t, { scroll: true });
  }));
  /* WAI-ARIA radio group: arrows move focus and select; Space/Enter select */
  cleanups.push(on(group, "keydown", (e) => {
    const i = tiles.indexOf(d.activeElement as HTMLElement);
    if (i < 0) return;
    let n: number | null = null;
    switch (e.key) {
      case "ArrowRight": case "ArrowDown": n = (i + 1) % tiles.length; break;
      case "ArrowLeft": case "ArrowUp": n = (i - 1 + tiles.length) % tiles.length; break;
      case "Home": n = 0; break;
      case "End": n = tiles.length - 1; break;
      case " ": case "Spacebar": case "Enter": e.preventDefault(); select(tiles[i]); return;
      default: return;
    }
    e.preventDefault();
    select(tiles[n], { focus: true });
  }));
  const onEdit = () => { refresh(); keepSendInView(); };
  cleanups.push(
    on(yearEl, "input", () => { yearEl.value = yearEl.value.replace(/\D/g, "").slice(0, 4); onEdit(); }),
    on(mmEl, "input", onEdit),
    on(otherEl, "input", onEdit),
    on(townEl, "change", onEdit),
    on(send, "click", () => trackSiteEvent("picker_send", { key_type: current || undefined, has_working_key: haveVal() || undefined })),
  );
  qsa<HTMLInputElement>('input[name="pk-have"]', act).forEach((r) => cleanups.push(on(r, "change", onEdit)));

  const fromHash = (location.hash || "").match(/^#key-(blade|remote|flip|smart)$/);
  if (fromHash) { const t0 = qs<HTMLElement>(`[data-key="${fromHash[1]}"]`, group); if (t0) select(t0, { silent: true }); }

  return runAll([...cleanups, () => { if (flight) flight.cancel(); }]);
}
