import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // ================= FETCH PROPERTY =================

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/property/${encodeURIComponent(id)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load property."
          );
        }

        setProperty(data.property || data);
        setActiveImage(0);
      } catch (error) {
        console.error("Fetch property error:", error);

        setError(
          error.message || "Unable to load property."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  // ================= DELETE PROPERTY =================

  const handleDeleteProperty = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        setError(
          "Please sign in to delete this property."
        );
        setDeleting(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/property/delete/${encodeURIComponent(id)}`,
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

      navigate("/properties");
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
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f7] px-6">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600" />

          <p className="mt-5 text-sm font-medium text-gray-500">
            Loading property...
          </p>
        </div>
      </main>
    );
  }

  // ================= ERROR =================

  if (error || !property) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f7] px-6">
        <div className="w-full max-w-md rounded-[28px] border border-gray-200 bg-white p-9 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl font-bold text-red-600">
            !
          </div>

          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-gray-950">
            Property not found
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            {error ||
              "This property may have been removed or is no longer available."}
          </p>

          <Link
            to="/properties"
            className="mt-7 inline-flex rounded-xl bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Back to properties
          </Link>
        </div>
      </main>
    );
  }

  // ================= IMAGES =================

  const images =
    Array.isArray(property.images) &&
    property.images.length > 0
      ? property.images
      : [];

  const mainImage = images[activeImage] || "";

  // ================= PRICE =================

  const numericPrice = Number(property.price) || 0;

  const formattedPrice =
    property.type === "rent"
      ? `$${numericPrice.toLocaleString()} / month`
      : `$${numericPrice.toLocaleString()}`;

  // ================= OWNER =================

  const owner = property.userRef || property.user || null;

  // ================= IMAGE CONTROLS =================

  const showPreviousImage = () => {
    if (images.length <= 1) return;

    setActiveImage((current) =>
      current === 0
        ? images.length - 1
        : current - 1
    );
  };

  const showNextImage = () => {
    if (images.length <= 1) return;

    setActiveImage((current) =>
      current === images.length - 1
        ? 0
        : current + 1
    );
  };

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
            <span className="text-emerald-600">.</span>
          </Link>

          <Link
            to="/properties"
            className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
          >
            ← Back to properties
          </Link>

        </div>
      </header>

      {/* ================= CONTENT ================= */}

      <section className="px-6 py-10 lg:px-10 lg:py-14">
        <div className="mx-auto max-w-[1200px]">

          {/* ================= BREADCRUMB ================= */}

          <div className="mb-7 flex items-center gap-2 text-sm text-gray-500">
            <Link
              to="/properties"
              className="transition hover:text-emerald-600"
            >
              Properties
            </Link>

            <span>/</span>

            <span className="max-w-[260px] truncate text-gray-900">
              {property.title}
            </span>
          </div>

          {/* ================= IMAGE GALLERY ================= */}

          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">

            {/* MAIN IMAGE */}

            <div className="relative h-[360px] overflow-hidden rounded-[28px] bg-gray-100 sm:h-[480px] lg:h-[560px]">

              {mainImage ? (
                <img
                  src={mainImage}
                  alt={property.title || "Property"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-7xl">
                  🏠
                </div>
              )}

              {/* SALE / RENT */}

              <span className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-xs font-bold capitalize text-gray-900 shadow-sm backdrop-blur">
                For {property.type || "sale"}
              </span>

              {/* IMAGE COUNTER */}

              {images.length > 0 && (
                <span className="absolute bottom-5 right-5 rounded-full bg-black/60 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
                  {activeImage + 1} / {images.length}
                </span>
              )}

              {/* PREVIOUS */}

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={showPreviousImage}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-gray-900 shadow-md transition hover:bg-white"
                >
                  ←
                </button>
              )}

              {/* NEXT */}

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={showNextImage}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-gray-900 shadow-md transition hover:bg-white"
                >
                  →
                </button>
              )}

            </div>

            {/* THUMBNAILS */}

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">

              {images.length > 0 ? (
                images.slice(0, 6).map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`relative h-[110px] overflow-hidden rounded-2xl border-2 transition lg:h-[85px] ${
                      activeImage === index
                        ? "border-emerald-500"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Property image ${index + 1}`}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />

                    {activeImage === index && (
                      <div className="absolute inset-0 bg-emerald-500/10" />
                    )}
                  </button>
                ))
              ) : (
                <div className="col-span-2 flex min-h-[220px] items-center justify-center rounded-2xl bg-gray-100 text-5xl lg:col-span-1">
                  🏠
                </div>
              )}

            </div>
          </div>

          {/* ================= MAIN INFORMATION ================= */}

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">

            {/* LEFT CONTENT */}

            <div>

              {/* TITLE */}

              <div className="border-b border-gray-200 pb-8">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
                      {property.propertyType || "Property"}
                    </p>

                    <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-gray-950 sm:text-4xl lg:text-5xl">
                      {property.title}
                    </h1>

                    <p className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                      <span>📍</span>

                      <span>
                        {property.address || "Address not available"}
                        {property.city
                          ? `, ${property.city}`
                          : ""}
                      </span>
                    </p>

                  </div>

                  <div className="shrink-0">
                    <p className="text-2xl font-bold tracking-tight text-gray-950">
                      {formattedPrice}
                    </p>
                  </div>

                </div>
              </div>

              {/* PROPERTY DETAILS */}

              <div className="border-b border-gray-200 py-8">

                <h2 className="text-xl font-semibold tracking-tight text-gray-950">
                  Property details
                </h2>

                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">

                  {/* BEDROOMS */}

                  <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                    <div className="text-xl">🛏</div>

                    <p className="mt-3 text-lg font-bold text-gray-950">
                      {property.bedrooms || 0}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Bedrooms
                    </p>
                  </div>

                  {/* BATHROOMS */}

                  <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                    <div className="text-xl">🛁</div>

                    <p className="mt-3 text-lg font-bold text-gray-950">
                      {property.bathrooms || 0}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Bathrooms
                    </p>
                  </div>

                  {/* AREA */}

                  <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                    <div className="text-xl">📐</div>

                    <p className="mt-3 text-lg font-bold text-gray-950">
                      {property.area || 0}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Sq Ft
                    </p>
                  </div>

                  {/* TYPE */}

                  <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                    <div className="text-xl">🏠</div>

                    <p className="mt-3 text-lg font-bold capitalize text-gray-950">
                      {property.propertyType || "House"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Type
                    </p>
                  </div>

                </div>
              </div>

              {/* DESCRIPTION */}

              <div className="py-8">

                <h2 className="text-xl font-semibold tracking-tight text-gray-950">
                  About this property
                </h2>

                <p className="mt-5 whitespace-pre-line text-sm leading-8 text-gray-600">
                  {property.description ||
                    "No description available for this property."}
                </p>

              </div>

            </div>

            {/* ================= SIDEBAR ================= */}

            <aside>

              <div className="sticky top-6 rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">

                {/* PRICE */}

                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                  Listed price
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
                  {formattedPrice}
                </p>

                {/* LOCATION */}

                <div className="mt-7 rounded-2xl bg-gray-50 p-5">

                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                    Location
                  </p>

                  <p className="mt-2 text-sm font-semibold text-gray-900">
                    {property.address || "Address not available"}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {property.city || "City not available"}
                  </p>

                </div>

                {/* OWNER */}

                {owner && typeof owner === "object" && (
                  <div className="mt-4 rounded-2xl bg-gray-50 p-5">

                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                      Listed by
                    </p>

                    <div className="mt-3 flex items-center gap-3">

                      {owner.photo ? (
                        <img
                          src={owner.photo}
                          alt="Property owner"
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                          {owner.username
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </div>
                      )}

                      <div>

                        <p className="text-sm font-semibold text-gray-900">
                          {owner.username || "Property owner"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Property owner
                        </p>

                      </div>

                    </div>
                  </div>
                )}

                {/* ACTIONS */}

                <div className="mt-6 grid gap-3">

                  {/* EDIT */}

                  <Link
                    to={`/properties/edit/${property._id}`}
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md"
                  >
                    Edit property
                  </Link>

                  {/* DELETE */}

                  <button
                    type="button"
                    onClick={handleDeleteProperty}
                    disabled={deleting}
                    className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deleting
                      ? "Deleting property..."
                      : "Delete property"}
                  </button>

                  {/* BACK */}

                  <button
                    type="button"
                    onClick={() => navigate("/properties")}
                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Back to properties
                  </button>

                </div>

              </div>

            </aside>

          </div>
        </div>
      </section>
    </main>
  );
}