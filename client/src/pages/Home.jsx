import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [type, setType] = useState("All types");
  const [price, setPrice] = useState("Any price");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (location.trim()) {
      params.set("location", location.trim());
    }

    if (type !== "All types") {
      params.set("type", type);
    }

    if (price !== "Any price") {
      params.set("price", price);
    }

    const query = params.toString();

    navigate(query ? `/search?${query}` : "/search");
  };

  return (
    <main className="min-h-screen bg-white">

      {/* ================= NAVBAR ================= */}
      <Navbar transparent />

      {/* ================= HERO ================= */}
      <section className="relative min-h-[760px] overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=90"
          alt="Modern luxury home"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-black/10" />

        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-[1280px] items-center px-6 pb-16 pt-32 lg:px-10">

          <div className="max-w-[760px]">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Find a place you'll love
            </p>

            <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-[-0.055em] text-white sm:text-6xl lg:text-[76px]">
              Your next chapter
              <br />
              starts here.
            </h1>

            <p className="mt-7 max-w-[590px] text-[15px] leading-7 text-white/80 sm:text-base">
              Discover beautiful homes, apartments and villas in locations
              you'll love. Find the right property for the way you want to
              live.
            </p>

            {/* ================= SEARCH BOX ================= */}
            <div className="mt-10 max-w-[900px] rounded-2xl bg-white p-3 shadow-2xl shadow-black/25">

              <div className="grid gap-2 lg:grid-cols-[1.2fr_1fr_1fr_auto]">

                {/* Location */}
                <div className="rounded-xl bg-gray-50 px-4 py-3.5 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20">

                  <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                    Location
                  </label>

                  <input
                    type="text"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="City or location"
                    className="mt-1 w-full bg-transparent text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                  />

                </div>

                {/* Property Type */}
                <div className="rounded-xl bg-gray-50 px-4 py-3.5 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20">

                  <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                    Property type
                  </label>

                  <select
                    value={type}
                    onChange={(event) => setType(event.target.value)}
                    className="mt-1 w-full bg-transparent text-sm font-medium text-gray-900 outline-none"
                  >
                    <option>All types</option>
                    <option>House</option>
                    <option>Apartment</option>
                    <option>Villa</option>
                  </select>

                </div>

                {/* Price */}
                <div className="rounded-xl bg-gray-50 px-4 py-3.5 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20">

                  <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                    Price
                  </label>

                  <select
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    className="mt-1 w-full bg-transparent text-sm font-medium text-gray-900 outline-none"
                  >
                    <option>Any price</option>
                    <option>Under $500k</option>
                    <option>$500k - $1M</option>
                    <option>$1M - $2M</option>
                    <option>$2M+</option>
                  </select>

                </div>

                {/* Search Button */}
                <button
                  type="button"
                  onClick={handleSearch}
                  className="min-h-[58px] rounded-xl bg-emerald-600 px-7 text-sm font-semibold text-white transition duration-300 hover:bg-emerald-700"
                >
                  Search properties
                </button>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= TRUST BAR ================= */}
      <section className="border-b border-gray-100 bg-white">

        <div className="mx-auto grid max-w-[1280px] divide-y divide-gray-100 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-10">

          <div className="px-5 py-7 text-center sm:text-left">
            <p className="text-2xl font-semibold tracking-tight text-gray-900">
              2,400+
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Properties listed
            </p>
          </div>

          <div className="px-5 py-7 text-center sm:text-left">
            <p className="text-2xl font-semibold tracking-tight text-gray-900">
              850+
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Happy clients
            </p>
          </div>

          <div className="px-5 py-7 text-center sm:text-left">
            <p className="text-2xl font-semibold tracking-tight text-gray-900">
              12+
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Cities covered
            </p>
          </div>

        </div>

      </section>

      {/* ================= ABOUT ================= */}
      <section
        id="about"
        className="bg-white px-6 py-24 lg:px-10"
      >

        <div className="mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-2">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              About estate
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-gray-900 lg:text-5xl">
              A better way to find where you belong.
            </h2>

            <p className="mt-6 max-w-xl text-[15px] leading-8 text-gray-500">
              We make property discovery simple, transparent and enjoyable.
              From your first search to your final viewing, everything is
              designed around helping you find a place that feels right.
            </p>

            {/* UPDATED BUTTON */}
            <Link
              to="/search"
              className="mt-8 inline-flex rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-emerald-700"
            >
              Explore properties
            </Link>

          </div>

          <div className="overflow-hidden rounded-[28px]">

            <img
              src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85"
              alt="Elegant modern interior"
              className="h-[460px] w-full object-cover"
            />

          </div>

        </div>

      </section>

      {/* ================= SERVICES ================= */}
      <section
        id="services"
        className="bg-[#f7f8f7] px-6 py-24 lg:px-10"
      >

        <div className="mx-auto max-w-[1280px]">

          <div className="max-w-2xl">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Our services
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-gray-900">
              Everything you need to move forward.
            </h2>

          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl border border-gray-100 bg-white p-7">

              <span className="text-xs font-semibold text-emerald-600">
                01
              </span>

              <h3 className="mt-8 text-xl font-semibold text-gray-900">
                Find your property
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                Search through carefully selected homes, apartments and
                villas.
              </p>

            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-7">

              <span className="text-xs font-semibold text-emerald-600">
                02
              </span>

              <h3 className="mt-8 text-xl font-semibold text-gray-900">
                Book a viewing
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                Connect with property professionals and schedule a viewing.
              </p>

            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-7">

              <span className="text-xs font-semibold text-emerald-600">
                03
              </span>

              <h3 className="mt-8 text-xl font-semibold text-gray-900">
                Make it yours
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                Get the guidance you need to confidently move into your next
                home.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}
      <section className="bg-gray-950 px-6 py-24 lg:px-10">

        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-8 md:flex-row md:items-center">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Ready when you are
            </p>

            <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-white lg:text-5xl">
              Your next home could be closer than you think.
            </h2>

          </div>

          <Link
            to="/search"
            className="whitespace-nowrap rounded-full bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white transition duration-300 hover:bg-emerald-700"
          >
            Browse properties →
          </Link>

        </div>

      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white px-6 py-10 lg:px-10">

        <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <Link
            to="/"
            className="text-xl font-bold tracking-[-0.04em] text-gray-900"
          >
            estate<span className="text-emerald-600">.</span>
          </Link>

          <p className="text-xs text-gray-400">
            © 2026 Estate. All rights reserved.
          </p>

        </div>

      </footer>

    </main>
  );
}