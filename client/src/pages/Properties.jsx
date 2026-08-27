import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ================= FETCH PROPERTIES =================

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
        console.error("Fetch properties error:", error);

        if (!ignore) {
          setError(
            error.message || "Unable to load properties."
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

  // ================= DELETE PROPERTY =================

  const handleDeleteProperty = async () => {
    if (!deleteId) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        setError(
          "Please sign in to delete a property."
        );

        setDeleteId(null);
        setDeleting(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/property/delete/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete property."
        );
      }

      // Remove property from UI immediately

      setProperties((previousProperties) =>
        previousProperties.filter(
          (property) => property._id !== deleteId
        )
      );

      // Close modal

      setDeleteId(null);
    } catch (error) {
      console.error(
        "Delete property error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while deleting property."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f7]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600" />

          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading properties...
          </p>
        </div>
      </main>
    );
  }

  // ================= PAGE =================

  return (
    <main className="min-h-screen bg-[#f7f8f7]">

      {/* ================= HEADER ================= */}

      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-[82px] max-w-[1280px] items-center justify-between px-6 lg:px-10">

          <Link
            to="/"
            className="text-2xl font-bold tracking-[-0.04em] text-gray-950"
          >
            estate
            <span className="text-emerald-600">
              .
            </span>
          </Link>

          <Link
            to="/property/create"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-emerald-600 hover:shadow-md"
          >
            Add property
          </Link>

        </div>
      </header>

      {/* ================= CONTENT ================= */}

      <section className="px-6 py-12 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1200px]">

          {/* ================= HEADING ================= */}

          <div className="mb-10">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Estate listings
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-gray-950 sm:text-5xl">
              Explore properties
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500">
              Discover beautiful properties available
              for sale and rent.
            </p>

          </div>

          {/* ================= ERROR ================= */}

          {error && (
            <div className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-red-100 bg-red-50 px-5 py-4">

              <p className="text-sm font-medium text-red-600">
                {error}
              </p>

            </div>
          )}

          {/* ================= EMPTY STATE ================= */}

          {!error && properties.length === 0 && (
            <div className="rounded-[28px] border border-dashed border-gray-300 bg-white px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                🏠
              </div>

              <h2 className="mt-5 text-xl font-semibold text-gray-950">
                No properties yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                There are no property listings yet.
                Create your first property to get started.
              </p>

              <Link
                to="/property/create"
                className="mt-6 inline-flex rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Create property
              </Link>

            </div>
          )}

          {/* ================= PROPERTY GRID ================= */}

          {properties.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {properties.map((property) => {

                const image =
                  property.images?.[0] || "";

                const formattedPrice =
                  property.type === "rent"
                    ? `$${Number(
                        property.price
                      ).toLocaleString()} / month`
                    : `$${Number(
                        property.price
                      ).toLocaleString()}`;

                return (
                  <article
                    key={property._id}
                    className="group overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >

                    {/* ================= IMAGE ================= */}

                    <div className="relative h-[230px] overflow-hidden bg-gray-100">

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

                      {/* SALE / RENT BADGE */}

                      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold capitalize text-gray-900 shadow-sm backdrop-blur">
                        For {property.type}
                      </span>

                      {/* PROPERTY TYPE */}

                      {property.propertyType && (
                        <span className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium capitalize text-white backdrop-blur">
                          {property.propertyType}
                        </span>
                      )}

                    </div>

                    {/* ================= CONTENT ================= */}

                    <div className="p-6">

                      {/* PRICE */}

                      <p className="text-xl font-bold tracking-tight text-gray-950">
                        {formattedPrice}
                      </p>

                      {/* TITLE */}

                      <h2 className="mt-3 line-clamp-1 text-lg font-semibold text-gray-950">
                        {property.title}
                      </h2>

                      {/* LOCATION */}

                      <p className="mt-2 line-clamp-1 text-sm text-gray-500">
                        📍 {property.address},{" "}
                        {property.city}
                      </p>

                      {/* ================= DETAILS ================= */}

                      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-100 pt-5 text-xs font-medium text-gray-500">

                        <span>
                          🛏 {property.bedrooms || 0} beds
                        </span>

                        <span>
                          🛁 {property.bathrooms || 0} baths
                        </span>

                        {property.area > 0 && (
                          <span>
                            📐 {property.area} sq ft
                          </span>
                        )}

                      </div>

                      {/* ================= ACTION BUTTONS ================= */}

                      <div className="mt-6 grid gap-3 border-t border-gray-100 pt-5">

                        {/* VIEW DETAILS */}

                        <Link
                          to={`/properties/${property._id}`}
                          className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                        >
                          View details
                        </Link>

                        {/* EDIT */}

                        <Link
                          to={`/properties/edit/${property._id}`}
                          className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          Edit property
                        </Link>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteId(property._id)
                          }
                          className="inline-flex w-full items-center justify-center rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100"
                        >
                          Delete property
                        </button>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

        </div>
      </section>

      {/* ================= DELETE MODAL ================= */}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-[28px] bg-white p-7 shadow-2xl">

            {/* ICON */}

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
              ⚠️
            </div>

            {/* TEXT */}

            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-gray-950">
              Delete this property?
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              This action will permanently remove
              the property from your listings.
              You won't be able to undo this action.
            </p>

            {/* ACTIONS */}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteProperty}
                disabled={deleting}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting
                  ? "Deleting..."
                  : "Yes, delete property"}
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}

