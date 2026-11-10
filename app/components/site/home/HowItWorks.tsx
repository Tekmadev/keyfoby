import { Ic } from "../Icons";
import { PHONE } from "../links";

const PROFILE =
  "M150,110 L197.2,110 L221.2,134 L237.2,134 L261.2,110 L331.5,110 L379.5,158 L395.5,158 L443.5,110 L521.8,110 L537.8,126 L553.8,126 L569.8,110 L656.2,110 L696.2,150 L712.2,150 L752.2,110 L822.5,110 L854.5,142 L870.5,142 L902.5,110 L956.8,110 L1012.8,166 L1028.8,166 L1084.8,110 L1100,110";
const BODY =
  "M96,70 H150 V110 L197.2,110 L221.2,134 L237.2,134 L261.2,110 L331.5,110 L379.5,158 L395.5,158 L443.5,110 L521.8,110 L537.8,126 L553.8,126 L569.8,110 L656.2,110 L696.2,150 L712.2,150 L752.2,110 L822.5,110 L854.5,142 L870.5,142 L902.5,110 L956.8,110 L1012.8,166 L1028.8,166 L1084.8,110 L1100,110 L1184,152 L1184,162 L1130,200 H150 V230 H96 Z";
const NOTCHES = [
  "197.2,110 221.2,134 237.2,134 261.2,110",
  "331.5,110 379.5,158 395.5,158 443.5,110",
  "521.8,110 537.8,126 553.8,126 569.8,110",
  "656.2,110 696.2,150 712.2,150 752.2,110",
  "822.5,110 854.5,142 870.5,142 902.5,110",
  "956.8,110 1012.8,166 1028.8,166 1084.8,110",
];
const CODES: [number, string][] = [[229.2, "3"], [387.5, "6"], [545.8, "2"], [704.2, "5"], [862.5, "4"], [1020.8, "7"]];
const BRACKETS = [
  "M162,262 H454.7 M162,254 V270 M454.7,254 V270",
  "M478.7,262 H771.3 M478.7,254 V270 M771.3,254 V270",
  "M795.3,262 H1088 M795.3,254 V270 M1088,254 V270",
];

/** How it works: the blade is cut as you scroll (static and fully cut without JS or with reduced motion). */
export default function HowItWorks() {
  return (
    <section className="process" id="how" aria-labelledby="how-h">
      <div className="process__track">
        <div className="process__sticky">
          <div className="wrap process__inner">
            <div className="process__top">
              <p className="eyebrow mono">How it works</p>
              <div className="process__head">
                <h2 className="h2 display" id="how-h">Three steps. Then you drive.</h2>
                <p className="lede">Send your key on WhatsApp or call. We quote on the phone, then cut and program the key at your car.</p>
              </div>
            </div>

            <div className="process__stage">
              <div className="cutbox">
                <div className="cutbox__meta mono" aria-hidden="true">
                  <span>Fig. 01 · Blade, side view</span>
                  <span className="readout">Cuts <span data-readout>6</span> / 6</span>
                </div>
                <div className="blade-view">
                  <div className="blade-pan">
                    <svg className="blade" viewBox="0 0 1200 290" role="img" aria-labelledby="blade-t blade-d">
                      <title id="blade-t">A car key blade being cut</title>
                      <desc id="blade-d">Line drawing of a car key blade. A cutting wheel moves along the blade and cuts six notches, two for each of the three steps listed below.</desc>
                      <defs>
                        <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line className="hatch-line" x1="0" y1="0" x2="0" y2="7" /></pattern>
                        <clipPath id="clip-remain"><rect id="cr" x="0" y="-10" width="1300" height="320" transform="translate(1300 0)" /></clipPath>
                        <clipPath id="clip-done"><rect id="cd" x="-1300" y="-10" width="1300" height="320" transform="translate(1300 0)" /></clipPath>
                      </defs>
                      <g aria-hidden="true">
                        {CODES.map(([x]) => <line key={`t${x}`} className="b-tick" x1={x} y1="44" x2={x} y2="104" />)}
                        {CODES.map(([x, c]) => <text key={`c${x}`} className="b-code is-cut" x={x} y="34">{c}</text>)}
                      </g>
                      <path className="b-body" d={BODY} />
                      <path className="b-groove" d="M168,177 H1104 M168,185 H1096" />
                      <g clipPath="url(#clip-remain)">
                        <g className="b-stock">{NOTCHES.map((p) => <polygon key={p} points={p} />)}</g>
                        <g className="b-hatch">{NOTCHES.map((p) => <polygon key={p} points={p} />)}</g>
                        <path className="b-plan" d={PROFILE} />
                        <path className="b-edge" d="M150,110 H1100" />
                      </g>
                      <path className="b-outline" d="M96,70 H150 V110 M1100,110 L1184,152 L1184,162 L1130,200 H150 V230 H96" />
                      <rect className="b-head" x="8" y="30" width="104" height="230" rx="14" />
                      <rect className="b-head-line" x="17" y="39" width="86" height="212" rx="8" />
                      <circle className="b-head-btn" cx="60" cy="112" r="13" />
                      <circle className="b-head-btn" cx="60" cy="178" r="13" />
                      <g clipPath="url(#clip-done)">
                        <path className="b-glow" d={PROFILE} />
                        <path className="b-cut" d={PROFILE} />
                      </g>
                      <g aria-hidden="true">
                        {BRACKETS.map((d) => <path key={d} className="b-br" d={d} />)}
                        <g clipPath="url(#clip-done)">
                          {BRACKETS.map((d) => <path key={d} className="b-br-on" d={d} />)}
                        </g>
                      </g>
                      <g className="cutter" transform="translate(1100 52)" aria-hidden="true">
                        <line className="c-spindle" x1="0" y1="-320" x2="0" y2="-34" />
                        <circle className="c-halo" r="40" />
                        <g className="c-wheel">
                          <circle className="c-teeth" r="31" />
                          <circle className="c-disc" r="28" />
                          <circle className="c-ring" r="15" />
                          <line className="c-spoke" x1="0" y1="-26" x2="0" y2="26" />
                          <circle className="c-hub" r="3.5" />
                        </g>
                      </g>
                    </svg>
                  </div>
                </div>

                <ol className="steps" aria-label="How it works, step by step">
                  <li className="step" data-state="done">
                    <button className="step__num" type="button" data-step="0" aria-describedby="st-1"><span aria-hidden="true">01</span><Ic name="check" className="ck" /><span className="sr-only">Show step 1</span></button>
                    <h3 className="step__title" id="st-1">Send your key and car on WhatsApp, or call</h3>
                    <p className="step__text">Tap your key type above, add the year, make and model, and send. Or call <span className="nw">{PHONE}</span>.</p>
                  </li>
                  <li className="step" data-state="done">
                    <button className="step__num" type="button" data-step="1" aria-describedby="st-2"><span aria-hidden="true">02</span><Ic name="check" className="ck" /><span className="sr-only">Show step 2</span></button>
                    <h3 className="step__title" id="st-2">Get the price on the phone</h3>
                    <p className="step__text">We quote it before we head out, including any after-hours surcharge.</p>
                  </li>
                  <li className="step" data-state="done">
                    <button className="step__num" type="button" data-step="2" aria-describedby="st-3"><span aria-hidden="true">03</span><Ic name="check" className="ck" /><span className="sr-only">Show step 3</span></button>
                    <h3 className="step__title" id="st-3">Cut and programmed at your car</h3>
                    <p className="step__text">We come to where the car is. The work is backed by a 3-month warranty.</p>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
