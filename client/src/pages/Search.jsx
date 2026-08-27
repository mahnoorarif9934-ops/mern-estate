
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function Search() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All types");
  const [sort, setSort] = useState("Recommended");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH REAL PROPERTIES ================= */

  useEffect(() => {
    let ignore = false;

    const loadProperties = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/property`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load properties."
          );
        }

        if (!ignore) {
          setProperties(data.properties || []);
        }
      } catch (error) {
        console.error("Search properties error:", error);

        if (!ignore) {
          setError(
            error.message ||
              "Something went wrong while loading properties."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadProperties();

    return () => {
      ignore = true;
    };
  }, []);

  /* ================= FILTER + SORT ================= */

  const filteredProperties = useMemo(() => {
    let result = properties.filter((property) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        property.title?.toLowerCase().includes(searchText) ||
        property.city?.toLowerCase().includes(searchText) ||
        property.address?.toLowerCase().includes(searchText);

      const propertyType =
        property.propertyType?.toLowerCase();

      const matchesType =
        type === "All types" ||
        propertyType === type.toLowerCase();

      return matchesSearch && matchesType;
    });

    if (sort === "Price: Low to High") {
      result = [...result].sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sort === "Price: High to Low") {
      result = [...result].sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    if (sort === "Newest") {
      result = [...result].sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );
    }

    return result;
  }, [properties, search, type, sort]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f7]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600" />

          <p className="mt-4 text-sm text-gray-500">
            Loading properties...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8f7]">

      {/* ================= HEADER ================= */}

      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-[78px] max-w-[1280px] items-center justify-between px-6 lg:px-10">

          <Link
            to="/"
            className="text-2xl font-bold tracking-[-0.04em] text-gray-950"
          >
            estate
            <span className="text-emerald-600">.</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">

            <Link
              to="/"
              className="text-sm font-semibold text-gray-700 transition hover:text-emerald-600"
            >
              Home
            </Link>

            <Link
              to="/search"
              className="text-sm font-semibold text-emerald-600"
            >
              Properties
            </Link>

            <Link
              to="/sign-in"
              className="text-sm font-semibold text-gray-700 transition hover:text-emerald-600"
            >
              Sign in
            </Link>

            <Link
              to="/sign-up"
              className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Get started
            </Link>

          </nav>
        </div>
      </header>

      {/* ================= PAGE CONTENT ================= */}

      <section className="px-6 py-14 lg:px-10">
        <div className="mx-auto max-w-[1280px]">

          {/* ================= HEADING ================= */}

          <div className="max-w-2xl">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Browse properties
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-gray-950 sm:text-5xl">
              Find a place you'll love.
            </h1>

            <p className="mt-5 text-[15px] leading-7 text-gray-500">
              Explore available homes, apartments
              and villas from our real property listings.
            </p>

          </div>

          {/* ================= ERROR ================= */}

          {error && (
            <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* ================= FILTER BAR ================= */}

          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">

            <div className="grid gap-3 md:grid-cols-[1fr_200px_200px]">

              {/* SEARCH */}

              <div className="flex items-center rounded-xl bg-gray-50 px-4 py-3">

                <span className="mr-3 text-gray-400">
                  🔎
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search by location or property name..."
                  className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />

              </div>

              {/* PROPERTY TYPE */}

              <select
                value={type}
                onChange={(event) =>
                  setType(event.target.value)
                }
                className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800 outline-none"
              >
                <option>All types</option>
                <option>House</option>
                <option>Apartment</option>
                <option>Villa</option>
              </select>

              {/* SORT */}

              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value)
                }
                className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800 outline-none"
              >
                <option>Recommended</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>

            </div>
          </div>

          {/* ================= RESULTS HEADER ================= */}

          <div className="mt-12 flex items-center justify-between">

            <div>
              <p className="text-sm font-semibold text-gray-900">
                {filteredProperties.length}{" "}
                {filteredProperties.length === 1
                  ? "property"
                  : "properties"}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Showing available properties
              </p>
            </div>

          </div>

          {/* ================= PROPERTY GRID ================= */}

          {filteredProperties.length > 0 && (
            <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {filteredProperties.map((property) => {

                const image =
                  property.images?.[0] || "";

                return (
                  <Link
                    key={property._id}
                    to={`/properties/${property._id}`}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-900/10"
                  >

                    {/* IMAGE */}

                    <div className="relative h-[270px] overflow-hidden bg-gray-100">

                      {image ? (
                        <img
                          src={image}
                          alt={property.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-5xl">
                          🏠
                        </div>
                      )}

                      <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold capitalize text-gray-800 backdrop-blur">
                        {property.propertyType || "Property"}
                      </div>

                    </div>

                    {/* CARD CONTENT */}

                    <div className="p-5">

                      <p className="text-xl font-semibold tracking-tight text-gray-950">
                        ${Number(
                          property.price || 0
                        ).toLocaleString()}
                        {property.type === "rent" && (
                          <span className="ml-1 text-xs font-medium text-gray-500">
                            / month
                          </span>
                        )}
                      </p>

                      <h2 className="mt-2 line-clamp-1 text-lg font-semibold text-gray-900">
                        {property.title}
                      </h2>

                      <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                        📍 {property.address},{" "}
                        {property.city}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4">

                        <span className="text-xs font-medium text-gray-500">
                          🛏 {property.bedrooms || 0} beds
                        </span>

                        <span className="text-xs font-medium text-gray-500">
                          🚿 {property.bathrooms || 0} baths
                        </span>

                        {property.area > 0 && (
                          <span className="text-xs font-medium text-gray-500">
                            📐 {property.area} sq ft
                          </span>
                        )}

                      </div>

                    </div>

                  </Link>
                );
              })}

            </div>
          )}

          {/* ================= EMPTY STATE ================= */}

          {filteredProperties.length === 0 && (
            <div className="mt-10 rounded-2xl border border-gray-200 bg-white py-20 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                🏠
              </div>

              <h2 className="mt-5 text-xl font-semibold text-gray-900">
                No properties found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Try changing your search or property type.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setType("All types");
                  setSort("Recommended");
                }}
                className="mt-6 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Clear filters
              </button>

            </div>
          )}

        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-gray-200 bg-white px-6 py-8 lg:px-10">

        <div className="mx-auto flex max-w-[1280px] items-center justify-between">

          <Link
            to="/"
            className="text-lg font-bold text-gray-950"
          >
            estate
            <span className="text-emerald-600">.</span>
          </Link>

          <p className="text-xs text-gray-400">
            © 2026 Estate. All rights reserved.
          </p>

        </div>

      </footer>

    </main>
  );
}
