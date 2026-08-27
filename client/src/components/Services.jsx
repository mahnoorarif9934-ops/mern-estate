function ServiceCard({ title, text }) {
  return (
    <div className="group rounded-2xl border border-gray-100 p-8 transition duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-xl hover:shadow-gray-100">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600">
        ↗
      </div>

      <h3 className="mt-7 text-xl font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-gray-500">
        {text}
      </p>

      <button className="mt-7 text-sm font-semibold text-gray-900 transition group-hover:text-emerald-600">
        Learn more →
      </button>

    </div>
  );
}

export default function Services() {
  return (
    <section
      id="services"
      className="bg-white px-6 py-24 lg:px-10"
    >
      <div className="mx-auto max-w-[1280px]">

        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
            What we offer
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-gray-900">
            Everything you need
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">

          <ServiceCard
            title="Buy a property"
            text="Discover homes that match your lifestyle, location and budget."
          />

          <ServiceCard
            title="Sell your property"
            text="Showcase your property to buyers looking for their next home."
          />

          <ServiceCard
            title="Property investment"
            text="Explore opportunities designed for long-term value."
          />

        </div>

      </div>
    </section>
  );
}