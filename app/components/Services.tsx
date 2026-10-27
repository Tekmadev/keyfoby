import { businessData } from "@/lib/business-data";

const serviceAreaDetails = businessData.serviceArea.map((city) => ({
  city,
  detail: city === "Hamilton" ? "Home base" : "Mobile service",
}));

export default function Services() {
  const services = [
    {
      title: businessData.services.car.title,
      description: businessData.services.car.description,
      features: businessData.services.car.features,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="services"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header - SEO Enhanced */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Car Key &amp; Key Fob Services in Hamilton
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-4">
            A mobile car key service based in Hamilton. We cut and program
            keys at your car and handle car lockouts, across Hamilton and
            nearby cities. Car keys only: no house or business locks.
          </p>

          <div className="text-base text-slate-500 dark:text-slate-400 max-w-3xl mx-auto">
            <p>
              Most makes &amp; models · Transponder keys · Smart keys ·
              Emergency lockouts · Licensed &amp; insured
            </p>
          </div>
        </div>

        {/* Services grid */}
        <div className="grid lg:grid-cols-1 gap-8 lg:gap-12 max-w-3xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features list */}
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-slate-700 dark:text-slate-300"
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        {/* Service Areas */}
        <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-3">
            Areas We Serve
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-center mb-8 max-w-2xl mx-auto">
            KeyFoby is based in Hamilton and comes to you across these cities.
            We work at your car, so there is no need to tow it.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {serviceAreaDetails.map(({ city, detail }) => (
              <div
                key={city}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200"
              >
                <p className="font-semibold text-slate-900 dark:text-white text-sm">
                  {city}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
