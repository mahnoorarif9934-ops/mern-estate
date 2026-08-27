import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    type: "sale",
    propertyType: "house",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    images: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* ================= FETCH PROPERTY ================= */

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/property/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load property."
          );
        }

        const property = data.property;

        setFormData({
          title: property.title || "",
          description: property.description || "",
          address: property.address || "",
          city: property.city || "",
          type: property.type || "sale",
          propertyType: property.propertyType || "house",
          price: property.price ?? "",
          bedrooms: property.bedrooms ?? "",
          bathrooms: property.bathrooms ?? "",
          area: property.area ?? "",
          images: Array.isArray(property.images)
            ? property.images.join("\n")
            : "",
        });
      } catch (error) {
        console.error("Fetch property error:", error);

        setError(
          error.message || "Unable to load property."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ================= UPDATE PROPERTY ================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Please sign in to edit this property.");
        return;
      }

      if (
        !formData.title.trim() ||
        !formData.description.trim() ||
        !formData.address.trim() ||
        !formData.city.trim() ||
        !formData.price
      ) {
        setError(
          "Please fill in all required property fields."
        );
        return;
      }

      const images = formData.images
        .split("\n")
        .map((image) => image.trim())
        .filter(Boolean)
        .slice(0, 6);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/property/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title.trim(),
            description: formData.description.trim(),
            address: formData.address.trim(),
            city: formData.city.trim(),
            type: formData.type,
            propertyType: formData.propertyType,
            price: Number(formData.price),
            bedrooms: Number(formData.bedrooms),
            bathrooms: Number(formData.bathrooms),
            area: Number(formData.area),
            images,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update property."
        );
      }

      navigate(`/properties/${id}`);
    } catch (error) {
      console.error("Update property error:", error);

      setError(
        error.message ||
          "Something went wrong while updating property."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f7]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600" />

          <p className="mt-4 text-sm text-gray-500">
            Loading property...
          </p>
        </div>
      </main>
    );
  }

  /* ================= LOAD ERROR ================= */

  if (error && !formData.title) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f7] px-6">
        <div className="w-full max-w-md rounded-[28px] border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl font-bold text-red-600">
            !
          </div>

          <h1 className="mt-5 text-2xl font-semibold text-gray-950">
            Unable to edit property
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {error}
          </p>

          <Link
            to="/properties"
            className="mt-6 inline-flex rounded-xl bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Back to properties
          </Link>
        </div>
      </main>
    );
  }

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
            to={`/properties/${id}`}
            className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Cancel
          </Link>
        </div>
      </header>

      {/* ================= CONTENT ================= */}

      <section className="px-6 py-12 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[900px]">
          {/* ================= HEADING ================= */}

          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
              Property management
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-gray-950 sm:text-5xl">
              Edit property
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500">
              Update your property information and save
              the latest changes.
            </p>
          </div>

          {/* ================= ERROR ================= */}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* ================= FORM ================= */}

          <form
            onSubmit={handleSubmit}
            className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
          >
            {/* TITLE */}

            <div>
              <label className="text-sm font-semibold text-gray-900">
                Property title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Modern family villa"
                required
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
              />
            </div>

            {/* DESCRIPTION */}

            <div className="mt-6">
              <label className="text-sm font-semibold text-gray-900">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the property..."
                rows={6}
                required
                className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm leading-6 outline-none transition focus:border-emerald-500 focus:bg-white"
              />
            </div>

            {/* ADDRESS + CITY */}

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-gray-900">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="DHA Phase 5"
                  required
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Lahore"
                  required
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            {/* TYPE */}

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-gray-900">
                  Listing type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none focus:border-emerald-500"
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900">
                  Property type
                </label>

                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none focus:border-emerald-500"
                >
                  <option value="house">House</option>
                  <option value="apartment">
                    Apartment
                  </option>
                  <option value="villa">Villa</option>
                </select>
              </div>
            </div>

            {/* PRICE + BEDROOMS + BATHROOMS */}

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="lg:col-span-2">
                <label className="text-sm font-semibold text-gray-900">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="250000"
                  min="0"
                  required
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900">
                  Bedrooms
                </label>

                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  min="0"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900">
                  Bathrooms
                </label>

                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min="0"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* AREA */}

            <div className="mt-6">
              <label className="text-sm font-semibold text-gray-900">
                Area (sq ft)
              </label>

              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="2500"
                min="0"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            {/* IMAGES */}

            <div className="mt-6">
              <label className="text-sm font-semibold text-gray-900">
                Property images
              </label>

              <p className="mt-1 text-xs text-gray-400">
                Add one image URL per line. Maximum 6 images.
              </p>

              <textarea
                name="images"
                value={formData.images}
                onChange={handleChange}
                rows={5}
                placeholder="https://example.com/image.jpg"
                className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
              />
            </div>

            {/* BUTTONS */}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
              <Link
                to={`/properties/${id}`}
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving changes..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}