"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { runAll } from "./behaviors/dom";
import { initChrome } from "./behaviors/chrome";
import { initPicker } from "./behaviors/picker";
import { initCut } from "./behaviors/cut";
import { initUnlock } from "./behaviors/unlock";
import { initHeroLoop, initLazyImages, initReveal, initReviews } from "./behaviors/media";
import { initQuoteForm, rememberAttribution } from "./behaviors/quoteForm";

/**
 * The page's only client component. The markup is all server-rendered; this
 * wires the behaviours from the approved mock onto it after hydration (each
 * init is a no-op when its section isn't on the page) and undoes them on
 * unmount.
 */
export default function SiteBehaviors() {
  const pathname = usePathname();
  useEffect(() => {
    const safe = (fn: () => (() => void) | void) => {
      try { return fn(); } catch (e) { console.error(e); return undefined; }
    };
    return runAll([
      safe(rememberAttribution),
      safe(initChrome),
      safe(initPicker),
      safe(initCut),
      safe(initUnlock),
      safe(initReveal),
      safe(initLazyImages),
      safe(initHeroLoop),
      safe(initReviews),
      safe(initQuoteForm),
    ]);
  }, [pathname]);
  return null;
}
