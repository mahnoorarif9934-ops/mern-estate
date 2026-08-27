import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CreateProperty() {
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);

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
  });

  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ================= INPUT CHANGE =================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ================= SELECT IMAGES =================

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    if (files.length > 6) {
      setError("You can upload a maximum of 6 images.");
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Each image must be less than 5MB.");
        return;
      }
    }

    setImages(files);
    setImageUrls([]);
    setError("");
    setSuccess("");
  };

  // ================= CLOUDINARY UPLOAD =================

  const uploadImages = async () => {
    if (!images.length) {
      return [];
    }

    setUploading(true);

    try {
      const uploadedUrls = [];

      for (const image of images) {
        const data = new FormData();

        data.append("file", image);
        data.append("upload_preset", "mern-estate");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/mern-estate-project/image/upload",
          {
            method: "POST",
            body: data,
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.error?.message ||
              "Cloudinary image upload failed."
          );
        }

        if (!result.secure_url) {
          throw new Error(
            "Cloudinary did not return an image URL."
          );
        }

        uploadedUrls.push(result.secure_url);
      }

      setImageUrls(uploadedUrls);

      return uploadedUrls;
    } catch (err) {
      console.error("Image upload error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Image upload failed.";

      setError(message);

      return null;
    } finally {
      setUploading(false);
    }
  };

  // ================= CREATE PROPERTY =================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!currentUser) {
      setError(
        "Please sign in before creating a property."
      );
      return;
    }

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.price ||
      !formData.propertyType
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      setError(
        "Your session has expired. Please sign in again."
      );
      return;
    }

    try {
      setLoading(true);

      // 1. Upload images
      const uploadedImages = await uploadImages();

      if (!uploadedImages || uploadedImages.length === 0) {
        setError(
          "Please upload at least one property image."
        );
        return;
      }

      // 2. Create property in backend
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/property/create`,
        {
          method: "POST",

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
            bedrooms: Number(formData.bedrooms) || 0,
            bathrooms: Number(formData.bathrooms) || 0,
            area: Number(formData.area) || 0,
            images: uploadedImages,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to create property."
        );
      }

      setSuccess(
        "Property created successfully!"
      );

      // Reset form
      setFormData({
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
      });

      setImages([]);
      setImageUrls([]);

      // Go to properties page
      setTimeout(() => {
        navigate("/properties");
      }, 1000);
    } catch (err) {
      console.error(
        "Create property error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= NOT LOGGED IN =================

  if (!currentUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f7] px-6">
        <div className="w-full max-w-md rounded-[24px] border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-2xl">
            🔐
          </div>

          <h1 className="mt-6 text-2xl font-semibold text-gray-950">
            Sign in required
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Please sign in before creating a property.
          </p>

          <Link
            to="/sign-in"
            className="mt-7 inline-flex rounded-full bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  // ================= PAGE =================

  return (
    <main className="min-h-screen bg-[#f7f8f7]">

      {/* HEADER */}

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
            to="/profile"
            className="rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Back to profile
          </Link>

        </div>
      </header>

      {/* CONTENT */}

      <section className="px-6 py-12 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1000px]">

          {/* HEADING */}

          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Property management
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-gray-950 sm:text-5xl">
              Add a property
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500">
              Create a professional property listing
              and publish it to your estate marketplace.
            </p>
          </div>

          {/* FORM CARD */}

          <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">

            <form
              onSubmit={handleSubmit}
              className="p-7 sm:p-10 lg:p-12"
            >

              {/* ERROR */}

              {error && (
                <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* SUCCESS */}

              {success && (
                <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {success}
                </div>
              )}

              {/* PROPERTY INFORMATION */}

              <div>
                <h2 className="text-xl font-semibold text-gray-950">
                  Property information
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Add the basic details of your property.
                </p>
              </div>

              <div className="mt-7 grid gap-6 sm:grid-cols-2">

                {/* TITLE */}

                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-gray-800">
                    Property title
                  </label>

                  <input
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Modern family villa"
                    required
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                {/* ADDRESS */}

                <div>
                  <label className="text-sm font-semibold text-gray-800">
                    Address
                  </label>

                  <input
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="DHA Phase 5"
                    required
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                {/* CITY */}

                <div>
                  <label className="text-sm font-semibold text-gray-800">
                    City
                  </label>

                  <input
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Lahore"
                    required
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                {/* PRICE */}

                <div>
                  <label className="text-sm font-semibold text-gray-800">
                    Price
                  </label>

                  <input
                    name="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="25000000"
                    required
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                {/* LISTING TYPE */}

                <div>
                  <label className="text-sm font-semibold text-gray-800">
                    Listing type
                  </label>

                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="sale">
                      For Sale
                    </option>

                    <option value="rent">
                      For Rent
                    </option>
                  </select>
                </div>

                {/* PROPERTY TYPE */}

                <div>
                  <label className="text-sm font-semibold text-gray-800">
                    Property type
                  </label>

                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="house">
                      House
                    </option>

                    <option value="apartment">
                      Apartment
                    </option>

                    <option value="villa">
                      Villa
                    </option>
                  </select>
                </div>

                {/* BEDROOMS */}

                <div>
                  <label className="text-sm font-semibold text-gray-800">
                    Bedrooms
                  </label>

                  <input
                    name="bedrooms"
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    placeholder="3"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                {/* BATHROOMS */}

                <div>
                  <label className="text-sm font-semibold text-gray-800">
                    Bathrooms
                  </label>

                  <input
                    name="bathrooms"
                    type="number"
                    min="0"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    placeholder="2"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                {/* AREA */}

                <div>
                  <label className="text-sm font-semibold text-gray-800">
                    Area (sq ft)
                  </label>

                  <input
                    name="area"
                    type="number"
                    min="0"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="2500"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                {/* DESCRIPTION */}

                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-gray-800">
                    Description
                  </label>

                  <textarea
                    name="description"
                    rows="6"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the property, amenities, neighborhood and other important details..."
                    required
                    className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm leading-6 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

              </div>

              {/* IMAGES */}

              <div className="mt-10 border-t border-gray-100 pt-8">

                <h2 className="text-xl font-semibold text-gray-950">
                  Property images
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Upload up to 6 high-quality images.
                  Maximum 5MB per image.
                </p>

                <label
                  htmlFor="propertyImages"
                  className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center transition hover:border-emerald-400 hover:bg-emerald-50/40"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                    📷
                  </div>

                  <p className="mt-4 text-sm font-semibold text-gray-900">
                    Choose property images
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG or WEBP
                  </p>

                  <input
                    id="propertyImages"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {/* SELECTED FILES */}

                {images.length > 0 && (
                  <div className="mt-5 rounded-xl bg-gray-50 p-4">

                    <p className="text-sm font-semibold text-gray-900">
                      {images.length} image
                      {images.length > 1 ? "s" : ""}
                      {" "}selected
                    </p>

                    <div className="mt-2 space-y-1">

                      {images.map((image, index) => (
                        <p
                          key={`${image.name}-${index}`}
                          className="truncate text-xs text-gray-500"
                        >
                          {image.name}
                        </p>
                      ))}

                    </div>
                  </div>
                )}

                {/* UPLOAD SUCCESS */}

                {imageUrls.length > 0 && (
                  <p className="mt-4 text-sm font-medium text-emerald-600">
                    Images uploaded successfully.
                  </p>
                )}

              </div>

              {/* ACTIONS */}

              <div className="mt-10 flex flex-col-reverse gap-3 border-t border-gray-100 pt-7 sm:flex-row sm:justify-end">

                <Link
                  to="/profile"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="inline-flex items-center justify-center rounded-xl bg-gray-950 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploading
                    ? "Uploading images..."
                    : loading
                    ? "Creating property..."
                    : "Create property"}
                </button>

              </div>

            </form>

          </div>

        </div>
      </section>

      {/* FOOTER */}

      <footer className="border-t border-gray-200 bg-white px-6 py-10">

        <div className="mx-auto flex max-w-[1000px] justify-between gap-4">

          <Link
            to="/"
            className="text-xl font-bold tracking-[-0.04em] text-gray-900"
          >
            estate
            <span className="text-emerald-600">
              .
            </span>
          </Link>

          <p className="text-xs text-gray-400">
            © 2026 Estate. All rights reserved.
          </p>

        </div>

      </footer>

    </main>
  );
}
