import { businessData } from "@/lib/business-data";
import { Ic } from "./Icons";
import { EMAIL, MAILTO, PHONE, TEL, WA_DEFAULT, IMG } from "./links";
import SiteBehaviors from "./SiteBehaviors";

const CUT_PATH =
  "M0,2 L62.5,2 L85,17.4 L95,17.4 L117.5,2 L206,2 L245,32.9 L255,32.9 L294,2 L388,2 L405,12.3 L415,12.3 L432,2 L531.5,2 L565,27.7 L575,27.7 L608.5,2 L697,2 L725,22.6 L735,22.6 L763,2 L840.5,2 L885,38 L895,38 L939.5,2 L1000,2";

function townList() {
  const [home, ...rest] = businessData.serviceArea;
  return `${home} (home base), ${rest.slice(0, -1).join(", ")} and ${rest[rest.length - 1]}.`;
}

// Big-number footer, the sticky Call/WhatsApp bar (phones and tablets) and
// the one small client component that wires up every behaviour on the page.
export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <>
      <footer className="footer">
        <div className="wrap">
          <div className="footer__cta">
            <p className="footer__eyebrow mono"><span className="status__dot" aria-hidden="true"></span>Call or WhatsApp · open 24/7 for emergencies</p>
            <div className="footer__num">
              <a className="footer__phone" href={TEL} data-track="call" data-track-loc="footer-big" aria-label={`Call ${PHONE}`}>{PHONE}</a>
              <div className="cutline" aria-hidden="true">
                <svg viewBox="0 0 1000 40" preserveAspectRatio="none" focusable="false">
                  <path className="g" vectorEffect="non-scaling-stroke" d={CUT_PATH} />
                  <path className="c" vectorEffect="non-scaling-stroke" d={CUT_PATH} />
                </svg>
                <span className="cutline__code mono">Cut 3-6-2-5-4-7</span>
              </div>
            </div>
            <div className="footer__acts">
              <a className="textlink" href={WA_DEFAULT} target="_blank" rel="noopener" data-wa data-track="whatsapp" data-track-loc="footer"><Ic name="msg" /><span>Message us on WhatsApp</span></a>
              <p className="status"><span data-clock>24/7</span><span className="sep" aria-hidden="true">·</span>Hamilton<span className="sep" aria-hidden="true">·</span>Emergency line open</p>
            </div>
          </div>
          <div className="footer__grid">
            <div className="footer__col">
              <p className="mono">Contact</p>
              <div className="footer__brand"><img src={`${IMG}/kf-mark.svg`} width={24} height={24} alt="" loading="lazy" decoding="async" /><span>KeyFoby</span></div>
              <p className="m">Mobile car key locksmith, based in Hamilton, ON.</p>
              <a href={TEL} data-track="call" data-track-loc="footer-col">{PHONE}</a>
              <a href={MAILTO}>{EMAIL}</a>
              <a href={WA_DEFAULT} target="_blank" rel="noopener" data-wa data-track="whatsapp" data-track-loc="footer-col">WhatsApp</a>
            </div>
            <div className="footer__col">
              <p className="mono">Hours</p>
              <p>Open 24/7 for emergencies. Most jobs are booked during the day.</p>
              <p className="m">{businessData.hours.afterHours}</p>
            </div>
            <div className="footer__col">
              <p className="mono">Area</p>
              <p>{townList()}</p>
              <p className="m">A mobile service: we work at your car.</p>
            </div>
            <div className="footer__col">
              <p className="mono">Legal</p>
              <nav className="footer__legal" aria-label="Legal">
                <a href="/privacy-policy">Privacy</a>
                <a href="/terms-of-service">Terms</a>
                <a href="/warranty">Warranty</a>
              </nav>
            </div>
          </div>
          <div className="footer__base">
            <span>&copy; {year} KeyFoby. Car keys only.</span>
            <span>Developed by Tekmadev</span>
          </div>
        </div>
      </footer>

      <nav className="actionbar" aria-label="Call or message">
        <a className="btn btn--primary" href={TEL} data-track="call" data-track-loc="bar"><Ic name="phone" /><span>Call</span><span className="num">{PHONE}</span></a>
        <a className="btn btn--quiet" id="bar-wa" href={WA_DEFAULT} target="_blank" rel="noopener" data-wa data-track="whatsapp" data-track-loc="bar"><Ic name="msg" /><span className="lbl">WhatsApp<span className="kt" hidden></span></span><span className="pick-dot" aria-hidden="true" hidden></span></a>
      </nav>
      <div className="vh-probe" aria-hidden="true"></div>
      <SiteBehaviors />
    </>
  );
}
