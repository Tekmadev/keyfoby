import { Fragment, type CSSProperties } from "react";
import { businessData } from "@/lib/business-data";
import { Ic } from "../Icons";
import { IMG, PHONE, TEL } from "../links";

const NUM = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

/** Service area: poster-scale town list over the wet-road plate. Towns from business-data. */
export default function Area() {
  const towns = businessData.serviceArea;
  return (
    <section className="section area" id="area" aria-labelledby="area-h">
      <div className="area__bg" aria-hidden="true"><img src={`${IMG}/area-road-1200.webp`} srcSet={`${IMG}/area-road-1200.webp 1200w, ${IMG}/area-road-2400.webp 2400w`} sizes="100vw" width={2400} height={1018} alt="" loading="lazy" decoding="async" /></div>
      <div className="wrap">
        <div className="area__type display" data-reveal>
          <h2 className="h2" id="area-h">We drive to you.</h2>{" "}
          <ol className="towns" aria-label="Towns we serve">
            {towns.map((t, i) => (
              // the space between items is a line-break opportunity, as in the mock's HTML
              <Fragment key={t}>
                {i > 0 && " "}
                <li className="town"><span className="town__i" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>{t}{i === 0 && <span className="town__tag">Home base</span>}</li>
              </Fragment>
            ))}
          </ol>
        </div>
        <div className="area__foot" data-reveal style={{ "--i": 1 } as CSSProperties}>
          <p className="lede">Mobile service, based in Hamilton. Tell us where the car is and we come to it, in any of these {NUM[towns.length] ?? towns.length} towns.</p>
          <a className="textlink" href={TEL} data-track="call" data-track-loc="area"><Ic name="phone" /><span>Tell us where the car is: <span className="num">{PHONE}</span></span></a>
        </div>
      </div>
    </section>
  );
}
