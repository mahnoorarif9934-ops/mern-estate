import Header from "./Header";
import SearchBox from "./SearchBox";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[780px] overflow-hidden"
    >
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=90"
          alt="Luxury modern home"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />

        <div className="absolute inset-0 bg-black/10" />
      </div>

      <Header />

      <div className="relative z-10 mx-auto flex min-h-[780px] max-w-[1280px] items-center px-6 pb-20 pt-32 lg:px-10">

        <div className="max-w-[850px]">

          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-emerald-400" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Premium real estate
            </span>
          </div>

          <h1 className="max-w-[800px] text-[52px] font-semibold leading-[1.04] tracking-[-0.045em] text-white sm:text-[68px] lg:text-[78px]">
            Find a home that
            <span className="block text-emerald-300">
              feels like yours.
            </span>
          </h1>

          <p className="mt-7 max-w-[620px] text-[17px] leading-8 text-white/75">
            Discover exceptional homes, apartments and investment
            properties in the places you love. Your next chapter starts here.
          </p>

          <SearchBox />

          <div className="mt-8 flex items-center gap-8 text-white">

            <div>
              <p className="text-2xl font-semibold">12k+</p>
              <p className="mt-1 text-xs text-white/60">
                Properties
              </p>
            </div>

            <div className="h-9 w-px bg-white/20" />

            <div>
              <p className="text-2xl font-semibold">8k+</p>
              <p className="mt-1 text-xs text-white/60">
                Happy clients
              </p>
            </div>

            <div className="h-9 w-px bg-white/20" />

            <div>
              <p className="text-2xl font-semibold">50+</p>
              <p className="mt-1 text-xs text-white/60">
                Locations
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}