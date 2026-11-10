import type { CSSProperties, ReactNode } from "react";
import { Ic } from "../Icons";
import { HOME_FAQ } from "../faq";
import { PHONE, TEL } from "../links";

/** Answer text exactly as in business-data; the phone number inside it becomes a tel: link. */
function withPhoneLink(text: string): ReactNode {
  const parts = text.split(PHONE);
  return parts.map((part, i) => (
    <span key={i}>
      {part}
      {i < parts.length - 1 && <a href={TEL} data-track="call" data-track-loc="faq-answer">{PHONE}</a>}
    </span>
  ));
}

export default function Faq() {
  return (
    <section className="section" id="faq" aria-labelledby="faq-h">
      <div className="wrap faq__grid">
        <div className="faq__side" data-reveal>
          <h2 className="h2 display" id="faq-h">Before you call.</h2>
          <p className="lede">Still unsure? Pick your key and <a className="link" href="#keys">send it on WhatsApp</a>, or call <a className="link" href={TEL} data-track="call" data-track-loc="faq">{PHONE}</a>.</p>
        </div>
        <div className="faq__list" data-reveal style={{ "--i": 1 } as CSSProperties}>
          {HOME_FAQ.map((f, i) => (
            <details key={f.question} className="faq__item" open={i === 0}>
              <summary>{f.question}<Ic name="plus" className="ic--24" /></summary>
              <p className="faq__a">{withPhoneLink(f.answer)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
