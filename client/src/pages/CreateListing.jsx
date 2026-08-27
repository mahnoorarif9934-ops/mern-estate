import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CreateListing() {
  const navigate = useNavigate();

  const fileRef = useRef(null);

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

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageError, setImageError] = useState("");

  /* ================= INPUT CHANGE ================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  /* ================= CLOUDINARY IMAGE UPLOAD ================= */

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    setImageError("");

    /* Maximum 6 images */

    if (images.length + files.length > 6) {
      setImageError("You can upload maximum 6 images.");
      return;
    }

    try {
      setUploadingImages(true);

      const uploadedImages = [];

      for (const file of files) {
        /* Check image type */

        if (!file.type.startsWith("image/")) {
          setImageError(
            `${file.name} is not a valid image file.`
          );
          continue;
        }

        /* Maximum 5MB */

        if (file.size > 5 * 1024 * 1024) {
          setImageError(
            `${file.name} is larger than 5MB.`
          );
          continue;
        }

        /* ================= CLOUDINARY FORM DATA ================= */

        const uploadData = new FormData();

        uploadData.append("file", file);

        uploadData.append(
          "upload_preset",
          "mern-estate"
        );

        /* ================= CLOUDINARY REQUEST ================= */

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/mern-estate-project/image/upload",
          {
            method: "POST",
            body: uploadData,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(
            "Cloudinary error:",
            data
          );

          throw new Error(
            data?.error?.message ||
              "Cloudinary image upload failed."
          );
        }

        /* ================= SECURE URL ================= */

        if (data.secure_url) {
          uploadedImages.push(data.secure_url);
        }
      }

      /* ================= SAVE IMAGE URLS IN STATE ================= */

      setImages((previousImages) => [
        ...previousImages,
        ...uploadedImages,
      ]);

    } catch (error) {
      console.error(
        "Property image upload error:",
        error
      );

      setImageError(
        error.message ||
          "Unable to upload property images."
      );

    } finally {
      setUploadingImages(false);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  };

  /* ================= REMOVE IMAGE ================= */

  const handleRemoveImage = (indexToRemove) => {
    setImages((previousImages) =>
      previousImages.filter(
        (_, index) => index !== indexToRemove
      )
    );

    setImageError("");
  };

  /* ================= CREATE PROPERTY ================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    /* ================= VALIDATION ================= */

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.price
    ) {
      setError(
        "Please fill in all required fields."
      );
      return;
    }

    /* Image upload complete hone ka wait */

    if (uploadingImages) {
      setError(
        "Please wait until all images finish uploading."
      );
      return;
    }

    try {
      setLoading(true);

      /* ================= TOKEN ================= */

      const token =
        localStorage.getItem("access_token");

      if (!token) {
        setError(
          "Please sign in before creating a property."
        );
        return;
      }

      /* ================= CREATE PROPERTY ================= */

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

            description:
              formData.description.trim(),

            address:
              formData.address.trim(),

            city:
              formData.city.trim(),

            type:
              formData.type,

            propertyType:
              formData.propertyType,

            price:
              Number(formData.price),

            bedrooms:
              Number(formData.bedrooms) || 0,

            bathrooms:
              Number(formData.bathrooms) || 0,

            area:
              Number(formData.area) || 0,

            /* IMPORTANT */

            images: images,
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

      /* ================= SUCCESS ================= */

      setSuccess(
        "Property created successfully."
      );

      setTimeout(() => {
        navigate("/properties");
      }, 1000);

    } catch (error) {
      console.error(
        "Create property error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while creating property."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8f7]">

      {/* ================= HEADER ================= */}

      <header className="border-b border-gray-100 bg-white">

        <div className="mx-auto flex h-[82px] max-w-[1280px] items-center justify-between px-6 lg:px-10">

          <Link
            to="/"
            className="text-2xl font-bold tracking-[-0.04em] text-gray-950"
          >
            estate<span className="text-emerald-600">.</span>
          </Link>

          <Link
            to="/profile"
            className="rounded-full bg-gray-300 px-5 py-2.5 text-sm font-semibold text-white transition duration-300 hover:bg-emerald-600"
          >
            Back to profile
          </Link>

        </div>

      </header>

      {/* ================= CONTENT ================= */}

      <section className="px-6 py-12 lg:px-10 lg:py-20">

        <div className="mx-auto max-w-[1000px]">

          {/* ================= HEADING ================= */}

          <div className="mb-10">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Property management
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-gray-950 sm:text-5xl">
              Create a property listing
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500">
              Add your property details, upload beautiful
              property images and publish your listing.
            </p>

          </div>

          {/* ================= CARD ================= */}

          <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">

            {/* CARD HEADER */}

            <div className="border-b border-gray-100 px-7 py-7 sm:px-10">

              <h2 className="text-xl font-semibold text-gray-950">
                Property information
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Enter accurate information about the property.
              </p>

            </div>

            {/* ================= FORM ================= */}

            <form
              onSubmit={handleSubmit}
              className="px-7 py-8 sm:px-10 sm:py-10"
            >

              {/* ================= ERROR ================= */}

              {error && (
                <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* ================= SUCCESS ================= */}

              {success && (
                <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {success}
                </div>
              )}

              <div className="grid gap-6">

                {/* ================= TITLE ================= */}

                <div>

                  <label
                    htmlFor="title"
                    className="text-sm font-semibold text-gray-800"
                  >
                    Property title *
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Modern 3 Bedroom Family House"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />

                </div>

                {/* ================= DESCRIPTION ================= */}

                <div>

                  <label
                    htmlFor="description"
                    className="text-sm font-semibold text-gray-800"
                  >
                    Description *
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the property, its features and surroundings..."
                    className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />

                </div>

                {/* ================= ADDRESS + CITY ================= */}

                <div className="grid gap-6 sm:grid-cols-2">

                  <div>

                    <label
                      htmlFor="address"
                      className="text-sm font-semibold text-gray-800"
                    >
                      Address *
                    </label>

                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main Street"
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />

                  </div>

                  <div>

                    <label
                      htmlFor="city"
                      className="text-sm font-semibold text-gray-800"
                    >
                      City *
                    </label>

                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Lahore"
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />

                  </div>

                </div>

                {/* ================= TYPE + PROPERTY TYPE ================= */}

                <div className="grid gap-6 sm:grid-cols-2">

                  <div>

                    <label
                      htmlFor="type"
                      className="text-sm font-semibold text-gray-800"
                    >
                      Listing type
                    </label>

                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    >
                      <option value="sale">
                        For Sale
                      </option>

                      <option value="rent">
                        For Rent
                      </option>
                    </select>

                  </div>

                  <div>

                    <label
                      htmlFor="propertyType"
                      className="text-sm font-semibold text-gray-800"
                    >
                      Property type
                    </label>

                    <select
                      id="propertyType"
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
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

                      <option value="land">
                        Land
                      </option>

                      <option value="commercial">
                        Commercial
                      </option>

                    </select>

                  </div>

                </div>

                {/* ================= PRICE + AREA ================= */}

                <div className="grid gap-6 sm:grid-cols-2">

                  <div>

                    <label
                      htmlFor="price"
                      className="text-sm font-semibold text-gray-800"
                    >
                      Price *
                    </label>

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="25000000"
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />

                  </div>

                  <div>

                    <label
                      htmlFor="area"
                      className="text-sm font-semibold text-gray-800"
                    >
                      Area (sq ft)
                    </label>

                    <input
                      id="area"
                      name="area"
                      type="number"
                      min="0"
                      value={formData.area}
                      onChange={handleChange}
                      placeholder="1800"
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />

                  </div>

                </div>

                {/* ================= BEDROOMS + BATHROOMS ================= */}

                <div className="grid gap-6 sm:grid-cols-2">

                  <div>

                    <label
                      htmlFor="bedrooms"
                      className="text-sm font-semibold text-gray-800"
                    >
                      Bedrooms
                    </label>

                    <input
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      min="0"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      placeholder="3"
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />

                  </div>

                  <div>

                    <label
                      htmlFor="bathrooms"
                      className="text-sm font-semibold text-gray-800"
                    >
                      Bathrooms
                    </label>

                    <input
                      id="bathrooms"
                      name="bathrooms"
                      type="number"
                      min="0"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      placeholder="2"
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />

                  </div>

                </div>

                {/* ================= PROPERTY IMAGES ================= */}

                <div className="mt-2 border-t border-gray-100 pt-8">

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <label className="text-sm font-semibold text-gray-800">
                        Property images
                      </label>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        Upload up to 6 images. Maximum 5MB per image.
                      </p>

                    </div>

                    <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-500">
                      {images.length}/6
                    </span>

                  </div>

                  {/* IMAGE ERROR */}

                  {imageError && (
                    <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                      {imageError}
                    </div>
                  )}

                  {/* IMAGE GRID */}

                  <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">

                    {images.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 bg-gray-100"
                      >

                        <img
                          src={image}
                          alt={`Property ${index + 1}`}
                          className="h-full w-full object-cover"
                        />

                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveImage(index)
                          }
                          className="absolute right-2 top-2 rounded-full bg-black/75 px-3 py-1.5 text-xs font-semibold text-white opacity-100 transition hover:bg-red-600"
                        >
                          Remove
                        </button>

                        {/* MAIN IMAGE */}

                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-900 shadow-sm">
                            Main image
                          </span>
                        )}

                      </div>
                    ))}

                    {/* ADD IMAGE BUTTON */}

                    {images.length < 6 && (
                      <button
                        type="button"
                        onClick={() =>
                          fileRef.current?.click()
                        }
                        disabled={uploadingImages}
                        className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-500 transition hover:border-emerald-400 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >

                        <span className="text-3xl">
                          {uploadingImages
                            ? "⏳"
                            : "+"}
                        </span>

                        <span className="mt-2 text-sm font-semibold">
                          {uploadingImages
                            ? "Uploading..."
                            : "Add images"}
                        </span>

                        <span className="mt-1 text-xs text-gray-400">
                          JPG, PNG, WEBP
                        </span>

                      </button>
                    )}

                  </div>

                  {/* HIDDEN FILE INPUT */}

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <p className="mt-4 text-xs leading-5 text-gray-400">
                    The first image will be used as the main
                    property image.
                  </p>

                </div>

              </div>

              {/* ================= ACTIONS ================= */}

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-7 sm:flex-row sm:justify-end">

                <Link
                  to="/profile"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    uploadingImages
                  }
                  className="inline-flex items-center justify-center rounded-xl bg-gray-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploadingImages
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

    </main>
  );
}