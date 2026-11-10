import type { CSSProperties } from "react";
import { businessData } from "@/lib/business-data";
import { Ic } from "../Icons";
import { REVIEWS_URL } from "../links";

const { reviews, stats } = businessData;
const YEARS: Record<string, string> = { "1": "One year", "2": "Two years", "3": "Three years", "4": "Four years", "5": "Five years" };

/** Proof band: every number comes from business-data (client-confirmed). The reviews slot is Elfsight's
 *  Google reviews widget (as in the mock), loaded only when the slot nears the viewport. */
export default function Proof() {
  return (
    <section className="section proof" id="proof" aria-labelledby="proof-h">
      <div className="wrap">
        <div className="proof__top">
          <h2 className="h2 display" id="proof-h" data-reveal>{`${YEARS[stats.yearsInBusiness] ?? `${stats.yearsInBusiness} years`} on Hamilton roads.`}</h2>
          <ul className="checks" data-reveal style={{ "--i": 1 } as CSSProperties}>
            <li><Ic name="shield" /><span>Licensed &amp; insured <small>(details on request)</small></span></li>
            <li><Ic name="check" /><span>{stats.satisfaction} satisfaction guarantee</span></li>
          </ul>
        </div>
        <dl className="stats" data-reveal style={{ "--i": 2 } as CSSProperties}>
          <div className="stat"><dt className="stat__l">Rated on {reviews.source}</dt><dd><span className="stat__n" aria-hidden="true">{reviews.rating}</span><span className="sr-only">{reviews.rating} out of 5 on {reviews.source}</span><a className="stat__a" href={REVIEWS_URL} target="_blank" rel="noopener">{reviews.countLabel} reviews <Ic name="out" className="ic--14" /></a></dd></div>
          <div className="stat"><dt className="stat__l">Keys made</dt><dd><span className="stat__n" aria-hidden="true">{stats.keysMade}</span><span className="sr-only">More than {stats.keysMade.replace(/\+$/, "")} keys made</span></dd></div>
          <div className="stat"><dt className="stat__l">Warranty</dt><dd><span className="stat__n" aria-hidden="true">3<small>months</small></span><span className="sr-only">3-month warranty</span></dd></div>
        </dl>
        <div className="proof__media proof__media--solo">
          <figure className="reviews" data-reveal>
            <figcaption className="reviews__bar">
              <span className="mono">Live Google reviews</span>
              <a className="link link--target" href={REVIEWS_URL} target="_blank" rel="noopener">Read them on Google <Ic name="out" className="ic--14" /></a>
            </figcaption>
            <div className="reviews__mount" id="reviews-widget" data-widget="elfsight-google-reviews">
              <div className="skel" aria-hidden="true"><span className="skel__av"></span><span className="skel__bar skel__bar--a"></span><span className="skel__bar skel__bar--b"></span><span className="skel__bar skel__bar--c"></span></div>
              <div className="skel" aria-hidden="true"><span className="skel__av"></span><span className="skel__bar skel__bar--a"></span><span className="skel__bar skel__bar--b"></span><span className="skel__bar skel__bar--c" style={{ width: "54%" }}></span></div>
              <div className="skel" aria-hidden="true"><span className="skel__av"></span><span className="skel__bar skel__bar--a" style={{ width: "28%" }}></span><span className="skel__bar skel__bar--b" style={{ width: "86%" }}></span><span className="skel__bar skel__bar--c" style={{ width: "72%" }}></span></div>
            </div>
          </figure>
          {/* The mock's photo box ("hands programming a key", client shoot) comes back here as a real
              photo once it is shot (DESIGN.md §1: real photos only). Until then the reviews take the
              full width: drop the "proof__media--solo" class when the photo is added. */}
        </div>
      </div>
    </section>
  );
}
