import type { CSSProperties } from "react";
import { businessData } from "@/lib/business-data";
import { Ic } from "../Icons";
import { PHONE, TEL, WA_DEFAULT, WA_PHOTO } from "../links";

/**
 * Quote form for planned jobs, sent as JSON to /api/lead (api/lead.ts) by the
 * behaviour script. Server-rendered so every label is in the HTML; without
 * JavaScript the Send button stays disabled (nothing can be sent in a URL) and
 * a notice points to Call / WhatsApp instead.
 */
export default function Quote() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
  return (
    <section className="section quote" id="quote" aria-labelledby="quote-h">
      <div className="wrap quote__grid">
        <div data-reveal>
          <h2 className="h2 display" id="quote-h">Planned job?<br />Get a quote.</h2>
          <p className="lede">A spare key, a fob that died, a second-hand car that came with one key. Send the details and we call you back with a price.</p>
          <ol className="qsteps">
            <li>Send your key and car.</li>
            <li>Get the price on the phone.</li>
            <li>Cut and programmed at your car.</li>
          </ol>
          <div className="callout"><p>Locked out right now? Don&apos;t wait on a form. Call <a href={TEL} data-track="call" data-track-loc="quote-callout">{PHONE}</a>.</p></div>
        </div>

        <div className="form-wrap" data-reveal style={{ "--i": 1 } as CSSProperties}>
          <form className="form" id="quote-form" method="post" noValidate data-sitekey={siteKey}>
            <p className="form__nojs"><Ic name="info" /><span>Sending this form needs JavaScript. Call <a href={TEL} data-track="call" data-track-loc="form-nojs">{PHONE}</a> or <a href={WA_DEFAULT} target="_blank" rel="noopener" data-wa data-track="whatsapp" data-track-loc="form-nojs">message us on WhatsApp</a> instead.</span></p>
            <div className="field">
              <label htmlFor="f-key">Key type <span className="opt">(optional)</span><span className="carried" data-carried-for="f-key" hidden>From your pick</span></label>
              <select className="input" id="f-key" name="keyType" defaultValue="">
                <option value="">Not sure</option>
                <option value="blade">Blade key (no buttons)</option>
                <option value="remote">Remote key (buttons on the head)</option>
                <option value="flip">Flip key (folding blade)</option>
                <option value="smart">Smart key (push-to-start)</option>
              </select>
            </div>
            <fieldset className="seg">
              <legend>Do you still have a working key? <span className="opt">(optional)</span><span className="carried" data-carried-for="f-have" hidden>From your pick</span></legend>
              <div className="seg__opts">
                <input type="radio" id="f-have-spare" name="have" value="spare" />
                <label htmlFor="f-have-spare">Yes, I need a spare</label>
                <input type="radio" id="f-have-lost" name="have" value="lost" />
                <label htmlFor="f-have-lost">No, all keys lost</label>
              </div>
            </fieldset>
            <div className="form__row form__row--3">
              <div className="field">
                <label htmlFor="f-year">Year<span className="carried" data-carried-for="f-year" hidden>From your pick</span></label>
                <input className="input" id="f-year" name="year" inputMode="numeric" maxLength={4} autoComplete="off" placeholder="e.g. 2018" aria-describedby="e-year" required />
                <p className="err" id="e-year" aria-live="polite"></p>
              </div>
              <div className="field">
                <label htmlFor="f-make">Make<span className="carried" data-carried-for="f-make" hidden>From your pick</span></label>
                <input className="input" id="f-make" name="make" maxLength={40} autoComplete="off" placeholder="e.g. Honda" aria-describedby="e-make" required />
                <p className="err" id="e-make" aria-live="polite"></p>
              </div>
              <div className="field">
                <label htmlFor="f-model">Model<span className="carried" data-carried-for="f-model" hidden>From your pick</span></label>
                <input className="input" id="f-model" name="model" maxLength={60} autoComplete="off" placeholder="e.g. Civic" aria-describedby="e-model" required />
                <p className="err" id="e-model" aria-live="polite"></p>
              </div>
            </div>
            <div className="form__row form__row--2">
              <div className="field">
                <label htmlFor="f-town">Where&apos;s the car? <span className="opt">(optional)</span><span className="carried" data-carried-for="f-town" hidden>From your pick</span></label>
                <select className="input" id="f-town" name="town" defaultValue="" aria-describedby="e-town">
                  <option value="">Choose a town</option>
                  {businessData.serviceArea.map((t) => <option key={t} value={t}>{t}</option>)}
                  <option value="other">Somewhere else</option>
                </select>
                <p className="err" id="e-town" aria-live="polite"></p>
              </div>
              <div className="field" id="f-other-wrap" hidden>
                <label htmlFor="f-other">Which town?<span className="carried" data-carried-for="f-other" hidden>From your pick</span></label>
                <input className="input" id="f-other" name="otherTown" maxLength={80} autoComplete="address-level2" aria-describedby="f-other-h e-other" />
                <p className="hint" id="f-other-h">We cover the 10 towns in this list. Anywhere else, call to check first.</p>
                <p className="err" id="e-other" aria-live="polite"></p>
              </div>
            </div>
            <fieldset className="seg">
              <legend>Ignition type <span className="opt">(optional)</span></legend>
              <div className="seg__opts">
                <input type="radio" id="ig-key" name="ignition" value="key" />
                <label htmlFor="ig-key"><Ic name="key" />Turn key</label>
                <input type="radio" id="ig-push" name="ignition" value="push" />
                <label htmlFor="ig-push"><Ic name="power" />Push-to-start</label>
              </div>
              <p className="hint" id="f-ign-note" aria-live="polite" hidden></p>
            </fieldset>
            <div className="field">
              <span className="label-like" id="photo-l">Photo of your key <span className="opt">(optional)</span></span>
              <a className="file__ui" href={WA_PHOTO} target="_blank" rel="noopener" aria-describedby="photo-l" data-wa-photo data-track="whatsapp" data-track-loc="form-photo">
                <span className="file__icon"><Ic name="msg" /></span>
                <span><strong>Have a photo of your key? Send it on WhatsApp</strong><br /><span className="hint">Front and back of the key or fob helps us quote.</span></span>
              </a>
            </div>
            <div className="field">
              <label htmlFor="f-details">Anything else? <span className="opt">(optional)</span></label>
              <textarea className="input" id="f-details" name="details" rows={3} maxLength={1000} autoComplete="off" aria-describedby="f-details-h e-details"></textarea>
              <p className="hint" id="f-details-h">For example, the buttons on the fob. Please don&apos;t include sensitive information.</p>
              <p className="err" id="e-details" aria-live="polite"></p>
            </div>
            <div className="form__row form__row--2">
              <div className="field">
                <label htmlFor="f-name">Name</label>
                <input className="input" id="f-name" name="name" maxLength={80} autoComplete="name" aria-describedby="e-name" required />
                <p className="err" id="e-name" aria-live="polite"></p>
              </div>
              <div className="field">
                <label htmlFor="f-phone">Phone</label>
                <input className="input" id="f-phone" name="phone" type="tel" inputMode="tel" maxLength={40} autoComplete="tel" aria-describedby="e-phone" required />
                <p className="err" id="e-phone" aria-live="polite"></p>
              </div>
            </div>
            <div className="field">
              <label htmlFor="f-email">Email <span className="opt">(optional, for a confirmation)</span></label>
              <input className="input" id="f-email" name="email" type="email" inputMode="email" maxLength={254} autoComplete="email" aria-describedby="f-email-h e-email" />
              <p className="hint" id="f-email-h">We&apos;ll email you your reference number. We still call or text you with the price.</p>
              <p className="err" id="e-email" aria-live="polite"></p>
            </div>
            <div className="hp" aria-hidden="true">
              <label htmlFor="f-website">Leave this field empty</label>
              <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>
            <div className="check-wrap">
              <label className="check" htmlFor="f-consent">
                <input type="checkbox" id="f-consent" name="consent" aria-describedby="e-consent" required />
                <span>Yes, KeyFoby ((905) 467-6860, keyfoby@gmail.com, 40 Courtland Ave, Hamilton, ON L9B 1X6) may contact me by phone, text or email about this quote. I can withdraw consent at any time.</span>
              </label>
              <p className="err" id="e-consent" aria-live="polite"></p>
            </div>
            <div className="ts-wrap" id="ts-wrap" hidden>
              <div className="ts-box" id="ts-box"></div>
            </div>
            <p className="form__note" id="form-note" hidden><Ic name="info" /><span>Online quote requests are switched off right now. Call <a href={TEL} data-track="call" data-track-loc="form-note">{PHONE}</a> or <a href={WA_DEFAULT} target="_blank" rel="noopener" data-wa data-track="whatsapp" data-track-loc="form-note">message us on WhatsApp</a> and we&apos;ll quote you there.</span></p>
            <div className="form__alert" id="form-alert" role="alert" hidden></div>
            <div className="form__submit">
              <button className="btn btn--primary btn--lg" type="submit" disabled data-track="form_submit">Send for a quote <Ic name="arrow" /></button>
              <p className="hint">How we handle your details: <a className="link link--target" href="/privacy-policy">Privacy policy</a></p>
            </div>
          </form>
          <div className="form__ok" id="form-ok" role="status" aria-live="polite" tabIndex={-1}>
            <strong>Got it. Thanks.</strong>
            <p id="form-ok-ref" hidden>Your reference is <span className="ref" id="form-ok-ref-v"></span>.</p>
            <p id="form-ok-mail" hidden>We&apos;ve emailed you a confirmation. If it&apos;s not in your inbox, check your spam folder.</p>
            <p>We&apos;ll call you back with a price. If you&apos;re locked out, call <a className="link" href={TEL} data-track="call" data-track-loc="form-ok">{PHONE}</a> now.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
