import type { CSSProperties, ReactNode } from "react";
import { Ic } from "../Icons";
import { TEL } from "../links";

const ROWS: { name: string; desc: string; need: ReactNode; keyRow?: boolean }[] = [
  { name: "Car key replacement & duplication", desc: "A new key cut and programmed for your car, or a spare made from the key you have.", need: <span className="tag">The key, for a spare</span> },
  { name: "Key fob programming", desc: "A new or replacement remote programmed so lock, unlock and trunk work again.", need: <span className="svc__none">Nothing else</span> },
  {
    name: "All keys lost",
    desc: "No key left at all. We make a new one at the car.",
    keyRow: true,
    need: <><span className="tag">VIN</span><span className="tag">Proof of ownership</span><span className="tag">Photo ID</span><span className="svc__note mono"><Ic name="info" />Bring all three</span></>,
  },
  { name: "Transponder & smart key programming", desc: "Chip keys and push-to-start smart keys, programmed to your car.", need: <span className="svc__none">Nothing else</span> },
  { name: "Key fob shell replacement", desc: "Cracked or worn case? Your fob's insides move into a new shell.", need: <span className="tag">The fob</span> },
  { name: "Emergency car lockouts", desc: "Keys locked inside, 24/7. We come to the car and get you back in.", need: <span className="svc__none">Nothing else</span> },
  { name: "Broken key extraction", desc: "Key snapped in the door or ignition? We take the broken piece out.", need: <span className="svc__none">Nothing else</span> },
];

export default function Services() {
  return (
    <section className="section section--rule" id="services" aria-labelledby="svc-h">
      <div className="wrap">
        <div className="svc__top" data-reveal>
          <p className="eyebrow mono">Services</p>
          <h2 className="display svc__title" id="svc-h" style={{ marginTop: "var(--s-4)" }}>Car keys. Nothing else.</h2>
          <p className="lede">Every job is done at your car, wherever it&apos;s parked in our service area. <strong>Prices are quoted on the phone.</strong> For every job we need your car&apos;s year, make and model.</p>
        </div>
        <div className="svc__thead mono" aria-hidden="true"><span>Service</span><span>What it is</span><span>What we need <em>· plus year, make, model</em></span></div>
        <ol className="svc__list">
          {ROWS.map((r, i) => {
            const NeedTag = r.keyRow ? "div" : "p";
            return (
              <li key={r.name} className={`svc__row${r.keyRow ? " svc__row--key" : ""}`} data-reveal style={{ "--i": i } as CSSProperties}>
                <h3 className="svc__name">{r.name}</h3>
                <p className="svc__desc">{r.desc}</p>
                <NeedTag className="svc__need"><span className="svc__need-label mono">We also need</span>{r.need}</NeedTag>
              </li>
            );
          })}
        </ol>
        <div className="svc__foot">
          <p>No house, business or safe locks. Car keys only.</p>
          <div className="acts">
            <a className="link link--target" href="#keys">Pick your key and send it</a>
            <a className="btn btn--primary" href={TEL} data-track="call" data-track-loc="services"><Ic name="phone" />Call for a price</a>
          </div>
        </div>
      </div>
    </section>
  );
}
