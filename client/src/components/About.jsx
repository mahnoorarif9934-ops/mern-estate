import Feature from "./Feature";

export default function About() {
  return (
    <section
      id="about"
      className="bg-[#f5f7f5] px-6 py-24 lg:px-10"
    >
      <div className="mx-auto grid max-w-[1280px] items-center gap-16 lg:grid-cols-2">

        <div className="relative">

          <img
            src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=90"
            alt="Elegant home interior"
            className="h-[540px] w-full rounded-[28px] object-cover"
          />

          <div className="absolute -bottom-6 right-6 rounded-2xl bg-gray-950 px-6 py-5 text-white shadow-xl sm:right-10">
            <p className="text-3xl font-semibold">15+</p>

            <p className="mt-1 text-xs text-white/60">
              Years of experience
            </p>
          </div>

        </div>

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
            About Estate
          </p>

          <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em] text-gray-900 lg:text-5xl">
            More than a property.
            <span className="block text-gray-400">
              It is your future.
            </span>
          </h2>

          <p className="mt-7 text-[15px] leading-7 text-gray-500">
            We believe finding a home should feel exciting, not complicated.
            Our platform brings together beautiful properties, trusted
            information and a simple experience.
          </p>

          <div className="mt-9 grid gap-6 sm:grid-cols-2">

            <Feature
              number="01"
              title="Curated homes"
              text="Beautiful properties selected with quality in mind."
            />

            <Feature
              number="02"
              title="Trusted listings"
              text="Clear and reliable information for every property."
            />

            <Feature
              number="03"
              title="Smart search"
              text="Find exactly what matches your lifestyle and budget."
            />

            <Feature
              number="04"
              title="Expert support"
              text="Get help whenever you need it throughout your journey."
            />

          </div>

        </div>

      </div>
    </section>
  );
}