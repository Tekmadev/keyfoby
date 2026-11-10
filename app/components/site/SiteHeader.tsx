import { IconSprite, Ic } from "./Icons";
import { EMAIL, MAILTO, PHONE, TEL, IMG } from "./links";

// Shared by the homepage, the legal pages and the 404. Plain <a> links (not
// next/link): every page is a static file, and a full load keeps the small
// behaviour script simple.
export default function SiteHeader({ home = false }: { home?: boolean }) {
  const h = (id: string) => (home ? `#${id}` : `/#${id}`);
  return (
    <>
      <IconSprite />
      <a className="skip" href="#main">Skip to content</a>

      <header className="header">
        <div className="wrap header__in">
          <a className="brand" href={home ? "#top" : "/"} aria-label="KeyFoby, home">
            <img src={`${IMG}/kf-mark.svg`} width={28} height={28} alt="" />
            <span>KeyFoby</span>
          </a>
          <nav className="nav" aria-label="Main">
            <ul>
              <li><a href={h("how")}>How it works</a></li>
              <li><a href={h("services")}>Services</a></li>
              <li><a href={h("area")}>Area</a></li>
              <li><a href={h("faq")}>FAQ</a></li>
              <li><a href={h("quote")}>Get a quote</a></li>
            </ul>
          </nav>
          <div className="header__right">
            <span className="mono header__247">24/7 emergencies</span>
            <a className="btn btn--ghost header__call" href={TEL} data-track="call" data-track-loc="header"><Ic name="phone" /><span className="num">{PHONE}</span></a>
          </div>
          <button className="menu-btn" id="menu-btn" type="button" aria-expanded="false" aria-controls="sheet" aria-label="Menu">
            <Ic name="menu" className="ic--24 i-open" />
            <Ic name="x" className="ic--24 i-close" />
          </button>
        </div>
        <div className="sheet" id="sheet" hidden>
          <nav aria-label="Mobile">
            <ul>
              <li><a className="sheet__link" href={h("keys")}>Which key? <Ic name="arrow" /></a></li>
              <li><a className="sheet__link" href={h("how")}>How it works <Ic name="arrow" /></a></li>
              <li><a className="sheet__link" href={h("services")}>Services <Ic name="arrow" /></a></li>
              <li><a className="sheet__link" href={h("area")}>Service area <Ic name="arrow" /></a></li>
              <li><a className="sheet__link" href={h("faq")}>FAQ <Ic name="arrow" /></a></li>
              <li><a className="sheet__link" href={h("quote")}>Get a quote <Ic name="arrow" /></a></li>
            </ul>
          </nav>
          <div className="sheet__foot">
            <p className="mono">Open 24/7 for emergencies · Hamilton, ON</p>
            <a className="link link--target" href={MAILTO}>{EMAIL}</a>
          </div>
        </div>
      </header>

      <aside className="fastpath-wrap" aria-label="Emergency call">
        <a className="fastpath" href={TEL} data-track="call" data-track-loc="strip">
          <span className="fastpath__q">Locked out right now?</span>
          <span className="fastpath__a">Call, 24/7 <Ic name="arrow" /></span>
        </a>
      </aside>
    </>
  );
}
