import { byId, on, qs, reducedMotion, runAll, type Cleanup } from "./dom";

/* PRESS TO UNLOCK: crossfade the car's own lights (two photo frames). */
export function initUnlock(): Cleanup | void {
  const sig = byId("unlock");
  const fob = byId("fob");
  const scene = byId("sig-scene");
  if (!sig || !fob || !scene) return;
  const reduce = reducedMotion();
  const onImg = qs<HTMLImageElement>(".sig__on", scene)!;
  const led = qs<HTMLElement>(".fob__led", fob)!;
  const statusText = byId("sig-status-text")!;
  const unlockBtn = byId<HTMLButtonElement>("fob-unlock")!;
  const lockBtn = byId<HTMLButtonElement>("fob-lock")!;
  let lit = false;
  let anims: Animation[] = [];
  const cleanups: (Cleanup | void)[] = [];

  function settle(kind: "lock" | "unlock") {
    const unlocked = kind === "unlock";
    lit = unlocked;
    sig!.setAttribute("data-state", unlocked ? "unlocked" : "locked");
    scene!.classList.toggle("is-lit", unlocked);
    fob!.classList.toggle("is-lit", unlocked);
    statusText.textContent = unlocked
      ? reduce.matches ? "Unlocked · lights on" : "Unlocked · lights flashed twice"
      : reduce.matches ? "Locked · lights off" : "Locked · lights flashed once";
    if (unlocked) sig!.classList.add("is-revealed");
  }
  const stopAnims = () => { anims.forEach((a) => { try { a.cancel(); } catch { /* ignore */ } }); anims = []; };
  function press(kind: "lock" | "unlock") {
    /* the "on" frame is lazy: make sure it is fetched before the first flash */
    if (onImg.loading === "lazy") onImg.loading = "eager";
    if (reduce.matches || !onImg.animate) { settle(kind); return; }
    stopAnims();
    const from = lit ? 1 : 0;
    scene!.classList.remove("is-lit"); fob!.classList.remove("is-lit");
    const frames: Keyframe[] = kind === "unlock"
      ? [{ opacity: from }, { opacity: 0, offset: 0.06 }, { opacity: 1, offset: 0.14 }, { opacity: 1, offset: 0.32 }, { opacity: 0, offset: 0.42 }, { opacity: 0, offset: 0.54 }, { opacity: 1, offset: 0.62 }, { opacity: 1 }]
      : [{ opacity: from }, { opacity: 0, offset: 0.12 }, { opacity: 1, offset: 0.26 }, { opacity: 1, offset: 0.52 }, { opacity: 0, offset: 0.7 }, { opacity: 0 }];
    const dur = kind === "unlock" ? 1400 : 900;
    const a = onImg.animate(frames, { duration: dur, easing: "linear", fill: "forwards" });
    anims.push(a);
    const ledFrames: Keyframe[] = [{ opacity: 0 }, { opacity: 1, offset: 0.06 }, { opacity: 1, offset: 0.3 }, { opacity: 0, offset: 0.38 }, { opacity: 0, offset: 0.52 }, { opacity: 1, offset: 0.58 }, { opacity: 1, offset: 0.82 }, { opacity: 0 }];
    /* the LED's lit layer is its ::after; WAAPI drives it through pseudoElement */
    try {
      anims.push(led.animate(kind === "unlock" ? ledFrames : [{ opacity: 0 }, { opacity: 1, offset: 0.1 }, { opacity: 1, offset: 0.5 }, { opacity: 0 }], { duration: dur, easing: "linear", pseudoElement: "::after" }));
    } catch { /* ignore */ }
    statusText.textContent = kind === "unlock" ? "Signal sent · unlocking" : "Signal sent · locking";
    a.onfinish = () => { settle(kind); stopAnims(); };
  }
  function holdable(btn: HTMLButtonElement, kind: "lock" | "unlock") {
    cleanups.push(
      on(btn, "click", () => press(kind)),
      on(btn, "keydown", (e) => {
        if (e.key !== " " && e.key !== "Enter") return;
        if (e.repeat) { e.preventDefault(); return; }
        btn.classList.add("is-pressed");
      }),
      on(btn, "keyup", () => btn.classList.remove("is-pressed")),
      on(btn, "blur", () => btn.classList.remove("is-pressed")),
    );
  }
  holdable(unlockBtn, "unlock");
  holdable(lockBtn, "lock");
  const applyMotionPref = () => { if (reduce.matches) { stopAnims(); settle("unlock"); } };
  applyMotionPref();
  reduce.addEventListener?.("change", applyMotionPref);
  cleanups.push(() => reduce.removeEventListener?.("change", applyMotionPref), stopAnims);
  return runAll(cleanups);
}
