import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditListing() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
  const [success, setSuccess] = useState("");

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
            data.message ||
              "Unable to load property."
          );
        }

        const property = data.property;

        setFormData({
          title: property.title || "",
          description:
            property.description || "",
          address:
            property.address || "",
          city:
            property.city || "",
          type:
            property.type || "sale",
          propertyType:
            property.propertyType || "house",
          price:
            property.price || "",
          bedrooms:
            property.bedrooms || "",
          bathrooms:
            property.bathrooms || "",
          area:
            property.area || "",
        });

        setImages(
          Array.isArray(property.images)
            ? property.images
            : []
        );
      } catch (error) {
        console.error(
          "Fetch property error:",
          error
        );

        setError(
          error.message ||
            "Unable to load property."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

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

  /* ================= CLOUDINARY UPLOAD ================= */

  const handleImageUpload = async (event) => {
    const files = Array.from(
      event.target.files || []
    );

    if (!files.length) {
      return;
    }

    setImageError("");

    if (images.length + files.length > 6) {
      setImageError(
        "You can have maximum 6 images."
      );
      return;
    }

    try {
      setUploadingImages(true);

      const uploadedImages = [];

      for (const file of files) {
        /* ================= FILE TYPE ================= */

        if (!file.type.startsWith("image/")) {
          setImageError(
            `${file.name} is not a valid image.`
          );
          continue;
        }

        /* ================= FILE SIZE ================= */

        if (file.size > 5 * 1024 * 1024) {
          setImageError(
            `${file.name} is larger than 5MB.`
          );
          continue;
        }

        /* ================= CLOUDINARY DATA ================= */

        const uploadData = new FormData();

        uploadData.append(
          "file",
          file
        );

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

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error?.message ||
              "Cloudinary upload failed."
          );
        }

        if (data.secure_url) {
          uploadedImages.push(
            data.secure_url
          );
        }
      }

      setImages((previousImages) => [
        ...previousImages,
        ...uploadedImages,
      ]);
    } catch (error) {
      console.error(
        "Image upload error:",
        error
      );

      setImageError(
        error.message ||
          "Unable to upload image."
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
        (_, index) =>
          index !== indexToRemove
      )
    );

    setImageError("");
  };

  /* ================= SAVE PROPERTY ================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

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

    if (uploadingImages) {
      setError(
        "Please wait until image uploads finish."
      );
      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem(
          "access_token"
        );

      if (!token) {
        setError(
          "Please sign in to edit this property."
        );
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/property/update/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            title:
              formData.title.trim(),

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
              Number(
                formData.bedrooms
              ) || 0,

            bathrooms:
              Number(
                formData.bathrooms
              ) || 0,

            area:
              Number(
                formData.area
              ) || 0,

            images:
              images,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update property."
        );
      }

      setSuccess(
        "Property updated successfully."
      );

      setTimeout(() => {
        navigate("/properties");
      }, 1000);
    } catch (error) {
      console.error(
        "Update property error:",
        error
      );

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
  to="/properties"
  className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-emerald-700 hover:shadow-md"
>
  Back to properties
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
              Edit property
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500">
              Update your property information,
              replace images or add new photos.
            </p>

          </div>

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

          {/* ================= FORM CARD ================= */}

          <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">

            <form
              onSubmit={handleSubmit}
              className="px-7 py-8 sm:px-10 sm:py-10"
            >

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
                    value={
                      formData.description
                    }
                    onChange={handleChange}
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
                      value={
                        formData.address
                      }
                      onChange={handleChange}
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
                      value={
                        formData.city
                      }
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />

                  </div>

                </div>

                {/* ================= TYPE ================= */}

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
                      value={
                        formData.type
                      }
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
                      value={
                        formData.propertyType
                      }
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
                      value={
                        formData.price
                      }
                      onChange={handleChange}
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
                      value={
                        formData.area
                      }
                      onChange={handleChange}
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
                      value={
                        formData.bedrooms
                      }
                      onChange={handleChange}
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
                      value={
                        formData.bathrooms
                      }
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />

                  </div>

                </div>

                {/* ================= IMAGES ================= */}

                <div className="border-t border-gray-100 pt-8">

                  <div className="flex items-center justify-between">

                    <div>

                      <label className="text-sm font-semibold text-gray-800">
                        Property images
                      </label>

                      <p className="mt-1 text-xs text-gray-500">
                        Add, remove or replace your property photos.
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

                    {images.map(
                      (image, index) => (
                        <div
                          key={`${image}-${index}`}
                          className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 bg-gray-100"
                        >

                          <img
                            src={image}
                            alt={`Property ${index + 1}`}
                            className="h-full w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveImage(
                                index
                              )
                            }
                            className="absolute right-2 top-2 rounded-full bg-black/75 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600"
                          >
                            Remove
                          </button>

                          {index === 0 && (
                            <span className="absolute bottom-2 left-2 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-900 shadow-sm">
                              Main image
                            </span>
                          )}

                        </div>
                      )
                    )}

                    {/* ADD IMAGE */}

                    {images.length < 6 && (
                      <button
                        type="button"
                        onClick={() =>
                          fileRef.current?.click()
                        }
                        disabled={
                          uploadingImages
                        }
                        className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-500 transition hover:border-emerald-400 hover:bg-emerald-50 disabled:opacity-60"
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

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={
                      handleImageUpload
                    }
                    className="hidden"
                  />

                </div>

              </div>

              {/* ================= ACTIONS ================= */}

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-7 sm:flex-row sm:justify-end">

                <Link
                  to="/properties"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    uploadingImages
                  }
                  className="inline-flex items-center justify-center rounded-xl bg-gray-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploadingImages
                    ? "Uploading images..."
                    : saving
                    ? "Saving changes..."
                    : "Save changes"}
                </button>

              </div>

            </form>

          </div>

        </div>

      </section>

    </main>
  );
}