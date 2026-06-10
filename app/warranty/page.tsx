import { Metadata } from "next";
import Link from "next/link";
import { businessData } from "@/lib/business-data";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "3-Month Service Warranty | KeyFoby Automotive Locksmith Hamilton",
  description:
    "KeyFoby provides a 3-month warranty on all car key replacement and key fob programming services in Hamilton, Ontario. Learn what's covered.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.keyfoby.com/warranty/",
  },
};

export default function WarrantyPolicy() {
  const lastUpdated = "January 10, 2026";

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-cyan-500 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-block mb-4">
                <span className="text-6xl">🛡️</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Service Warranty Policy
              </h1>
              <p className="text-xl text-blue-100">
                Your protection and our commitment to quality service
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Important Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-r-lg mb-12">
            <div className="flex items-start">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Our Commitment to Quality
                </h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                  At KeyFoby, we stand behind our work. All services come with a
                  comprehensive warranty to ensure your complete satisfaction
                  and peace of mind.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Summary */}
          <div className="mb-12 p-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl border border-blue-200 dark:border-slate-600">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">📋</span>
              Warranty Summary
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-blue-100 dark:border-slate-600">
                <div className="text-3xl mb-3">🕒</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                  Warranty Period
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  <strong className="text-blue-600 dark:text-blue-400">
                    3 months
                  </strong>{" "}
                  from service completion date
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-blue-100 dark:border-slate-600">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                  Immediate Testing
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  All functions tested <strong>on-site</strong> before
                  completion
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-blue-100 dark:border-slate-600">
                <div className="text-3xl mb-3">✅</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                  After Technician Leaves
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  <strong className="text-green-600 dark:text-green-400">
                    Fob not functioning, not starting vehicle, lock/unlock not
                    working
                  </strong>
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-blue-100 dark:border-slate-600">
                <div className="text-3xl mb-3">❌</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                  NOT Covered
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  <strong className="text-red-600 dark:text-red-400">
                    Other issues, damages, vehicle malfunctions, pre-existing
                    problems
                  </strong>
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Warranty Coverage */}
          <section className="mb-12 scroll-mt-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-green-500 mr-3">✅</span>
              What's Covered
            </h2>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-8 border border-green-200 dark:border-green-800">
              <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                KeyFoby provides a <strong>3-month warranty</strong> on all key
                fob services. This warranty covers:
              </p>
              <ul className="space-y-4">
                {[
                  {
                    icon: "🔑",
                    title: "Key Fob Not Working",
                    desc: "If your key fob stops working or doesn't work properly after our service",
                  },
                  {
                    icon: "🔓",
                    title: "Locking and Unlocking",
                    desc: "If the lock, unlock, trunk, or panic buttons don't work",
                  },
                  {
                    icon: "⚡",
                    title: "Car Won't Start",
                    desc: "If your car doesn't start with the key fob provided by KeyFoby.",
                  }
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-2xl mr-4 mt-1">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                        {item.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* What's NOT Covered */}
          <section className="mb-12 scroll-mt-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-red-500 mr-3">❌</span>
              What's NOT Covered
            </h2>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-8 border border-red-200 dark:border-red-800">
              <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                To protect both you and our business, the following are{" "}
                <strong>excluded from warranty coverage</strong>:
              </p>
              <ul className="space-y-4">
                {[
                  {
                    icon: "💧",
                    title: "Water Damage",
                    desc: "If your key fob gets wet or exposed to water or liquids",
                  },
                  {
                    icon: "🔨",
                    title: "Drops or Physical Damage",
                    desc: "If you drop it, crack it, break buttons, or physically damage the key fob",
                  },
                  {
                    icon: "⚠️",
                    title: "Tampering",
                    desc: "If you or someone else tries to take apart, modify, or fix the key fob yourself",
                  },
                  {
                    icon: "🔩",
                    title: "Car Mechanical Problems",
                    desc: "Problems with your car's ignition, door locks, or trunk that are not related to the key fob",
                  },
                  {
                    icon: "🔋",
                    title: "Dead Battery",
                    desc: "When the battery runs out (batteries wear out over time)",
                  },
                  {
                    icon: "🚗",
                    title: "Car Problems",
                    desc: "Issues with your car's computer, electrical system, or other car problems not caused by our work",
                  },
                  {
                    icon: "⏰",
                    title: "Problems You Didn't Test",
                    desc: "Any problems you find after we leave (except if the key stops working completely, won't start your car, or won't lock/unlock). You MUST test everything before we leave.",
                  },
                  {
                    icon: "🏪",
                    title: "Work By Others",
                    desc: "If another locksmith or dealership works on your key fob after we do",
                  },
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-2xl mr-4 mt-1">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                        {item.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Important: Testing & Reporting Requirements */}
          <section className="mb-12 scroll-mt-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-amber-500 mr-3">⚡</span>
              Important: You Must Test Everything!
            </h2>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-8 border border-amber-200 dark:border-amber-800">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                  <span className="bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
                    1
                  </span>
                  On-Site Testing (REQUIRED)
                </h3>
                <p className="text-slate-700 dark:text-slate-300 ml-11 leading-relaxed">
                  Before our technician leaves, you <strong>must test</strong>{" "}
                  all key fob functions with the technician present. This
                  includes:
                </p>
                <ul className="ml-11 mt-4 space-y-2 text-slate-600 dark:text-slate-400">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Vehicle starts with key/fob
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Lock/unlock doors function properly
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Trunk/hatch release works (if applicable)
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Panic button functions
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Remote start works (if applicable)
                  </li>
                </ul>
                <div className="ml-11 mt-6 bg-white dark:bg-slate-800 p-4 rounded-lg border border-amber-300 dark:border-amber-700">
                  <p className="text-sm text-amber-900 dark:text-amber-100 font-medium">
                    <strong>Important:</strong> If you do not test the key fob
                    on-site and discover an issue later, warranty coverage may
                    be subject to inspection and evaluation.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                  <span className="bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
                    2
                  </span>
                  After Technician Leaves
                </h3>
                <p className="text-slate-700 dark:text-slate-300 ml-11 leading-relaxed mb-4">
                  Once the technician has left your location, warranty coverage
                  changes significantly:
                </p>
                <div className="ml-11 space-y-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg border border-green-300 dark:border-green-700">
                    <div className="flex items-start">
                      <span className="text-xl mr-3">✅</span>
                      <div>
                        <p className="font-semibold text-green-900 dark:text-green-100 mb-2">
                          What IS Covered After Technician Leaves:
                        </p>
                        <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                          KeyFoby is ONLY responsible for issues directly
                          related to:
                        </p>
                        <ul className="text-sm text-green-800 dark:text-green-200 space-y-2 ml-4">
                          <li>
                            <strong>✓ Key fob not functioning</strong> (complete
                            failure of the fob)
                          </li>
                          <li>
                            <strong>✓ Fob not starting the vehicle</strong>{" "}
                            (ignition start failure)
                          </li>
                          <li>
                            <strong>
                              ✓ Lock and unlock features not working
                            </strong>{" "}
                            (remote locking system failure)
                          </li>
                        </ul>
                        <p className="text-sm text-green-800 dark:text-green-200 mt-3">
                          These issues must be directly caused by our service
                          and reported immediately.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg border border-red-300 dark:border-red-700">
                    <div className="flex items-start">
                      <span className="text-xl mr-3">❌</span>
                      <div>
                        <p className="font-semibold text-red-900 dark:text-red-100 mb-2">
                          What is NOT Covered After Technician Leaves:
                        </p>
                        <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                          KeyFoby is NOT responsible for any other issues,
                          damages, vehicle malfunctions, pre-existing problems,
                          or concerns that arise after the technician has left,
                          including:
                        </p>
                        <ul className="text-sm text-red-800 dark:text-red-200 space-y-2 ml-4">
                          <li>
                            <strong>✗ Physical damage</strong> (drops, cracks,
                            broken buttons)
                          </li>
                          <li>
                            <strong>✗ Water damage</strong> (exposure to
                            liquids)
                          </li>
                          <li>
                            <strong>✗ Battery issues</strong> (weak or dead
                            battery)
                          </li>
                          <li>
                            <strong>✗ Button problems</strong> (stuck, not
                            responding, or worn out buttons)
                          </li>
                          <li>
                            <strong>✗ Trunk/panic button issues</strong> (if not
                            tested on-site)
                          </li>
                          <li>
                            <strong>✗ Remote start issues</strong> (if not
                            tested on-site)
                          </li>
                          <li>
                            <strong>✗ Car problems</strong> (electrical, parts,
                            or computer issues)
                          </li>
                          <li>
                            <strong>✗ Pre-existing problems</strong> (issues
                            that existed before our service)
                          </li>
                          <li>
                            <strong>✗ Intermittent issues</strong> (problems
                            that come and go)
                          </li>
                          <li>
                            <strong>✗ Range/distance issues</strong> (if not
                            reported during on-site testing)
                          </li>
                          <li>
                            <strong>✗ Any other concerns</strong> not
                            specifically listed as covered above
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-300 dark:border-amber-700">
                    <div className="flex items-start">
                      <span className="text-xl mr-3">⚠️</span>
                      <div>
                        <p className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                          CRITICAL: Test Everything On-Site!
                        </p>
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          This is why on-site testing is mandatory. If you don't
                          test a function with the technician present and it
                          doesn't work later, it will NOT be covered under
                          warranty. Do not let the technician leave until you've
                          tested all functions thoroughly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How to Make a Warranty Claim */}
          <section className="mb-12 scroll-mt-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">📞</span>
              How to Make a Warranty Claim
            </h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
              <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                If you experience any issues covered under warranty, follow
                these steps:
              </p>
              <div className="space-y-6">
                {[
                  {
                    step: "1",
                    title: "Contact Us Immediately",
                    desc: "Call or text us at",
                    contact: businessData.contact.phoneDisplay,
                    subtext:
                      "if you experience key fob functionality issues. Explain the problem clearly.",
                  },
                  {
                    step: "2",
                    title: "Provide Service Details",
                    desc: "Have your service date, invoice number, and description of the issue ready.",
                  },
                  {
                    step: "3",
                    title: "Document the Issue",
                    desc: "If possible, take photos or videos showing what's not working. This helps us figure out the problem.",
                  },
                  {
                    step: "4",
                    title: "Allow Inspection",
                    desc: "We may need to inspect the key fob and/or vehicle to determine if the issue is covered under warranty.",
                  },
                  {
                    step: "5",
                    title: "Resolution",
                    desc: "If covered under warranty, we'll repair or replace at no charge. If not covered (damage/abuse), we'll provide a quote for repair/replacement.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start bg-white dark:bg-slate-800 p-6 rounded-lg border border-blue-200 dark:border-blue-700"
                  >
                    <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                        {item.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {item.desc}{" "}
                        {item.contact && (
                          <a
                            href={`tel:${businessData.contact.phone}`}
                            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                          >
                            {item.contact}
                          </a>
                        )}
                        {item.subtext && ` ${item.subtext}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Proof of Damage Policy */}
          <section className="mb-12 scroll-mt-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-purple-500 mr-3">📸</span>
              Proof & Inspection Requirements
            </h2>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-8 border border-purple-200 dark:border-purple-800">
              <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                To ensure fair warranty claims and prevent fraud, KeyFoby
                reserves the right to:
              </p>
              <ul className="space-y-4">
                {[
                  "Check the key fob and/or car to see what's wrong",
                  "Request photo or video evidence of the issue",
                  "Compare the condition of the key fob at the time of claim vs. service completion",
                  "Deny warranty claims if evidence of physical damage, water damage, or tampering is found",
                  "Charge for inspection if the issue is determined to be caused by customer damage or abuse",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-500 mr-3 mt-1">•</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 bg-white dark:bg-slate-800 p-6 rounded-lg border border-purple-300 dark:border-purple-700">
                <p className="text-sm text-purple-900 dark:text-purple-100">
                  <strong>Note:</strong> We understand that honest issues can
                  arise, and we're committed to resolving them fairly. However,
                  we must protect our business from fraudulent claims. All
                  warranty decisions are made at KeyFoby's sole discretion based
                  on the evidence provided and inspection results.
                </p>
              </div>
            </div>
          </section>

          {/* Mechanical Services Disclaimer */}
          <section className="mb-12 scroll-mt-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-orange-500 mr-3">🔧</span>
              We Only Work On Key Fobs
            </h2>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-8 border border-orange-200 dark:border-orange-800">
              <div className="flex items-start mb-6">
                <span className="text-4xl mr-4">⚠️</span>
                <div>
                  <h3 className="text-xl font-bold text-orange-900 dark:text-orange-100 mb-3">
                    Important: We Only Work On Key Fobs, Not Cars
                  </h3>
                  <p className="text-orange-800 dark:text-orange-200 leading-relaxed">
                    KeyFoby only works on <strong>key fobs</strong>. We do{" "}
                    <strong>NOT</strong> fix cars.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                    What We Fix:
                  </h4>
                  <ul className="space-y-2 ml-4">
                    {[
                      "Your key fob and its buttons",
                      "Locking and unlocking with your key",
                      "Starting your car with the key fob",
                      "Key fob not working or recognized by your car",
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-slate-700 dark:text-slate-300"
                      >
                        <span className="text-green-500 mr-2">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                    What We DON'T Fix:
                  </h4>
                  <ul className="space-y-2 ml-4">
                    {[
                      "Problems with the car's ignition (where you put the key)",
                      "Broken door locks on your car",
                      "Trunk latch not working",
                      "Car battery, alternator, or wiring problems",
                      "Engine won't start (when it's not the key fob's fault)",
                      "Car computer problems",
                      "Brakes, transmission, or other car parts",
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-slate-700 dark:text-slate-300"
                      >
                        <span className="text-red-500 mr-2">✗</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 bg-white dark:bg-slate-800 p-6 rounded-lg border border-orange-300 dark:border-orange-700">
                <p className="text-sm text-orange-900 dark:text-orange-100 font-medium">
                  <strong>If you have car problems:</strong> Please take your
                  car to a mechanic or your dealership. We only work on key
                  fobs, not cars. Car problems are not covered by our warranty.
                </p>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12 scroll-mt-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-slate-500 mr-3">⚖️</span>
              Limitation of Liability
            </h2>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-8 border border-slate-300 dark:border-slate-600">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                KeyFoby's liability under this warranty is limited to the repair
                or replacement of the broken key fob or repair of the service
                provided. In no event shall KeyFoby be liable for:
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Indirect, incidental, or consequential damages",
                  "Lost profits, lost time, or inconvenience",
                  "Towing fees, rental car costs, or transportation expenses",
                  "Damage to vehicle caused by factors outside our control",
                  "Issues arising from customer misuse, abuse, or negligence",
                ].map((item, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="text-slate-500 mr-2 mt-1">•</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                The maximum liability under this warranty shall not exceed the
                amount paid for the original service.
              </p>
            </div>
          </section>

          {/* Contact for Warranty Claims */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-8 text-white">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Questions About Our Warranty?
                </h2>
                <p className="text-blue-100 mb-6 text-lg">
                  We're here to help! Contact us for warranty claims or
                  questions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a
                    href={`tel:${businessData.contact.phone}`}
                    className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 flex items-center space-x-2 hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>{businessData.contact.phoneDisplay}</span>
                  </a>
                  <a
                    href={`mailto:${businessData.contact.email}`}
                    className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 flex items-center space-x-2 hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Email Us</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Related Links */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
              Related Documents
            </h3>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/terms-of-service"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                → Terms of Service
              </Link>
              <Link
                href="/privacy-policy"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                → Privacy Policy
              </Link>
              <Link
                href="/#contact"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                → Contact Us
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
