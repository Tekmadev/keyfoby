import { businessData } from "@/lib/business-data";
import { Ic } from "../Icons";
import { IMG, KEYS, PHONE, TEL, WA_DEFAULT, REVIEWS_URL, waLink } from "../links";

const { reviews, stats, serviceArea } = businessData;

/** Hero + key picker. Without JS the tiles are links to #key-* and :target opens the panel. */
export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="h1">
      <div className="hero__stage">
        <div className="hero__media">
          <div className="stage">
            <img
              src={`${IMG}/hero-night-sodium.webp`}
              srcSet={`${IMG}/hero-night-sodium-960.webp 960w, ${IMG}/hero-night-sodium.webp 1920w`}
              sizes="(min-width: 1024px) 125vw, (min-width: 768px) 130vw, 160vw"
              width={1920}
              height={1072}
              alt="A dark sedan in a wet parking lot at night, its front lights on under a sodium streetlight."
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
            <video muted playsInline loop preload="none" aria-hidden="true" tabIndex={-1} data-webm={`${IMG}/hero-loop-sodium.webm`} data-mp4={`${IMG}/hero-loop-sodium.mp4`}></video>
            <span className="shade" aria-hidden="true"></span>
          </div>
        </div>
        <button className="hero__pause" id="hero-pause" type="button" aria-pressed="false" aria-label="Pause background video" hidden><Ic name="pause" className="i-pause" /><Ic name="play" className="i-play" /></button>

        <div className="hero__copy">
          <div className="wrap">
            <div className="hero__inner">
              <p className="status"><span className="status__dot" aria-hidden="true"></span><span data-clock>24/7</span><span className="st-place"><span className="sep" aria-hidden="true">·</span>Hamilton</span><span className="sep" aria-hidden="true">·</span>Emergency line open</p>
              <h1 className="h1 display" id="h1"><span className="h1__a">Car key locksmith in&nbsp;Hamilton.</span> <span className="h1__b"><span className="nw">Locked out?</span> <span className="nw">We come to you, 24/7.</span></span></h1>
              <p className="hero__intro">KeyFoby is a mobile car key locksmith: we cut and program keys and fobs at your car, across Hamilton and nearby towns. <span className="more">Prices are quoted on the phone by year, make, model and key type.</span></p>
              <div className="hero__actions">
                <a className="btn btn--primary" href={TEL} data-track="call" data-track-loc="hero"><Ic name="phone" /><span className="w-call">Call </span><span className="num">{PHONE}</span></a>
                <a className="btn btn--quiet" href={WA_DEFAULT} target="_blank" rel="noopener" data-wa data-track="whatsapp" data-track-loc="hero"><Ic name="msg" /><span className="lbl">WhatsApp</span></a>
              </div>
              <p className="hero__note"><Ic name="moon" /><span>After-hours emergency calls include a surcharge, told on the phone before we head out.</span></p>
            </div>
          </div>
        </div>

        <div className="rail">
          <div className="wrap">
            <div className="picker" id="keys">
              <div className="picker__head">
                <h2 className="picker__q" id="pick-q">Which key <span className="nw">do you have?</span></h2>
                <p className="picker__how mono" id="pick-hint"><span data-n="1"><b>Tap <i className="ow">your </i>key</b></span><span className="arr" aria-hidden="true">→</span><span data-n="2">Add <i className="ow">your </i>car</span><span className="arr" aria-hidden="true">→</span><span data-n="3">Send on WhatsApp</span></p>
              </div>
              <div className="tiles" id="tiles">
                {KEYS.map((k, i) => (
                  <a key={k.key} className="tile" href={`#key-${k.key}`} data-key={k.key} data-track="picker_select" aria-label={k.aria}>
                    <span className="tile__media"><img src={`${IMG}/k-${k.key}-240.webp`} srcSet={`${IMG}/k-${k.key}-240.webp 240w, ${IMG}/k-${k.key}-480.webp 480w`} sizes="(min-width: 1024px) 92px, 20vw" width={640} height={860} alt="" decoding="async" fetchPriority="low" /></span>
                    <span className="tile__text"><span className="tile__idx mono" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><span className="tile__name">{k.short}<span className="lg"> key</span></span><span className="tile__hint">{k.hint}</span></span>
                    <span className="tile__tick" aria-hidden="true"><Ic name="check" /></span>
                  </a>
                ))}
              </div>
              <a className="textlink picker__unsure" href={TEL} data-track="call" data-track-loc="picker-unsure"><Ic name="phone" /><span>Not sure which key? Call and describe it</span></a>
              <p className="sr-only" id="pick-live" aria-live="polite"></p>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="panel" id="panel">
          {KEYS.map((k) => (
            <section key={k.key} className="pk" id={`key-${k.key}`} data-key={k.key} aria-labelledby={`pk-${k.key}-h`}>
              <div className="well" aria-hidden="true"><span className="ticks"><i></i><i></i><i></i><i></i></span><img className="pk__img" src={`${IMG}/k-${k.key}-480.webp`} srcSet={`${IMG}/k-${k.key}-240.webp 240w, ${IMG}/k-${k.key}-480.webp 480w`} sizes="(min-width: 1024px) 168px, (min-width: 768px) 132px, 80px" width={640} height={860} alt="" decoding="async" fetchPriority="low" /></div>
              <div className="pk__head">
                <p className="pk__label mono"><span className="dot" aria-hidden="true"></span>{k.start}</p>
                <h3 className="pk__name display" id={`pk-${k.key}-h`}>{k.label}</h3>
                <p className="pk__desc">{k.desc}</p>
              </div>
              <div className="need"><p className="need__l mono">What we need</p><p className="need__t">We&apos;ll ask for the year, make and model. All keys lost? Also your <b>VIN, proof of ownership and photo ID</b>.</p></div>
              <p className="pk__nojs"><a className="btn btn--primary" href={waLink(`Hi KeyFoby, I need a price for a ${k.label.toLowerCase()}.`)} target="_blank" rel="noopener" data-track="picker_send"><Ic name="msg" />Send on WhatsApp</a></p>
            </section>
          ))}

          <div className="act" id="act" hidden>
            <fieldset className="seg seg--have">
              <legend>Do you still have a working key? <span className="opt">(optional)</span></legend>
              <div className="seg__opts">
                <input type="radio" id="pk-have-spare" name="pk-have" value="spare" />
                <label htmlFor="pk-have-spare">Yes, I need a spare</label>
                <input type="radio" id="pk-have-lost" name="pk-have" value="lost" />
                <label htmlFor="pk-have-lost">No, all keys lost</label>
              </div>
            </fieldset>
            <fieldset className="act__car">
              <legend className="mono">Add your car (optional). It gets you a price faster.</legend>
              <div className="field"><label htmlFor="pk-year">Year</label><input className="input" id="pk-year" inputMode="numeric" maxLength={4} autoComplete="off" placeholder="e.g. 2019" /></div>
              <div className="field"><label htmlFor="pk-mm">Make &amp; model</label><input className="input" id="pk-mm" autoComplete="off" placeholder="e.g. Honda Civic" /></div>
              <div className="field f-town">
                <label htmlFor="pk-town">Where&apos;s the car?</label>
                <select className="input" id="pk-town" defaultValue="">
                  <option value="">Choose a town</option>
                  {serviceArea.map((t) => <option key={t} value={t}>{t}</option>)}
                  <option value="other">Somewhere else</option>
                </select>
              </div>
              <div className="field f-other" id="pk-other-wrap" hidden>
                <label htmlFor="pk-other">Which town?</label>
                <input className="input" id="pk-other" autoComplete="address-level2" aria-describedby="pk-other-h" />
                <p className="hint" id="pk-other-h">We cover the 10 towns in this list. Anywhere else, call to check first.</p>
              </div>
            </fieldset>
            <div className="preview">
              <p className="preview__l mono" id="pk-msg-l">Your message</p>
              <p className="preview__t" id="pk-msg">Hi KeyFoby, I need a price for a car key.</p>
            </div>
            <p className="act__lost" id="pk-lost" hidden><Ic name="info" /><span>All keys lost: have your <b>VIN, proof of ownership and photo ID</b> ready. We&apos;ll ask for them before we make the key.</span></p>
            <div className="act__send">
              <a className="btn btn--primary btn--lg" id="pk-send" href={WA_DEFAULT} target="_blank" rel="noopener" aria-describedby="pk-msg-l pk-msg" data-track="picker_send"><Ic name="msg" />Send on WhatsApp</a>
              <a className="textlink" href={TEL} data-track="call" data-track-loc="picker"><Ic name="phone" /><span>or call <span className="num">{PHONE}</span></span></a>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__credits">
        <ul className="wrap mono">
          <li><a href={REVIEWS_URL} target="_blank" rel="noopener">{reviews.rating} on {reviews.source} · {reviews.countLabel} reviews <Ic name="out" className="ic--14" /></a></li>
          <li>{stats.keysMade} keys made</li>
          <li>3-month warranty</li>
          <li>Car keys only</li>
        </ul>
      </div>
    </section>
  );
}
