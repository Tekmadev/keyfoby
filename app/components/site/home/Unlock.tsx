import { Ic } from "../Icons";
import { IMG, PHONE, TEL } from "../links";

/** "Does your fob still do this?": the car's own lights, two photo frames crossfaded. */
export default function Unlock() {
  return (
    <section className="section sig" id="unlock" aria-labelledby="sig-h" data-state="locked">
      <div className="wrap">
        <div className="sig__head" data-reveal>
          <h2 className="h2 display" id="sig-h">Does your fob still do this?</h2>
          <p className="sig__note" id="sig-desc">On most cars, one press of unlock flashes the lights and the fob&apos;s light blinks. <strong>If yours has stopped, or you&apos;re down to one key, we program or replace it at your car.</strong></p>
        </div>

        <div className="sig__grid">
          <div className="sig__fobcol">
            <div className="fob" id="fob">
              <span className="fob__loop" aria-hidden="true"></span>
              <div className="fob__body">
                <span className="fob__led" aria-hidden="true"></span>
                <button className="fob__btn fob__btn--lock" id="fob-lock" type="button" aria-label="Lock" aria-describedby="sig-desc"><Ic name="lock" /></button>
                <button className="fob__btn fob__btn--unlock" id="fob-unlock" type="button" aria-label="Unlock" aria-describedby="sig-desc"><Ic name="unlock" /></button>
                <span className="fob__grip" aria-hidden="true"></span>
              </div>
            </div>
          </div>

          <div className="sig__scene-wrap">
            <div className="sig__scene" id="sig-scene">
              <img className="sig__off" src={`${IMG}/sig-off-960.webp`} srcSet={`${IMG}/sig-off-960.webp 960w, ${IMG}/sig-off-1600.webp 1600w`} sizes="(min-width: 1024px) 1200px, (min-width: 768px) 100vw, 480px" width={1600} height={893} alt="" loading="lazy" decoding="async" />
              <img className="sig__on" src={`${IMG}/sig-on-960.webp`} srcSet={`${IMG}/sig-on-960.webp 960w, ${IMG}/sig-on-1600.webp 1600w`} sizes="(min-width: 1024px) 1200px, (min-width: 768px) 100vw, 480px" width={1600} height={893} alt="" loading="lazy" decoding="async" />
              <span className="ticks" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
              <p className="sig__line display">That&apos;s what a programmed key feels like. <span>Call to get yours.</span></p>
              <p className="sig__rec mono" aria-hidden="true"><span className="dot"></span><span data-clock>24/7</span></p>
            </div>
          </div>

          <div className="sig__side">
            <p className="sig__status mono" role="status" aria-live="polite"><span className="dot" aria-hidden="true"></span><span id="sig-status-text">Locked</span></p>
            <div className="sig__cell">
              <div className="sig__hintbox">
                <p className="sig__hint">Press <strong>unlock</strong> on the fob.</p>
                <p className="sig__keys">Keyboard: <kbd>Tab</kbd> to it, then <kbd>Space</kbd> or <kbd>Enter</kbd></p>
              </div>
              <div className="sig__cta">
                <a className="btn btn--primary btn--lg" href={TEL} data-track="call" data-track-loc="unlock"><Ic name="phone" /><span className="w-call">Call </span><span className="num">{PHONE}</span></a>
                <a className="textlink" href="#keys"><Ic name="key" /><span>Pick your key and send it on WhatsApp</span></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
