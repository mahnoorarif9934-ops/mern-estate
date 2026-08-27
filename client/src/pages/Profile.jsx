
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { updateUserSuccess } from "../redux/user/userSlice";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser, loading } = useSelector(
    (state) => state.user
  );

  const fileRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // ================= MY PROPERTIES =================

  const [myProperties, setMyProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ================= USER DATA =================

  const username =
    currentUser?.username ||
    currentUser?.name ||
    "User";

  const email =
    currentUser?.email ||
    "No email available";

  const photo =
    currentUser?.photo ||
    currentUser?.profilePicture ||
    currentUser?.avatar ||
    "";

  const firstLetter =
    username.charAt(0).toUpperCase();

  // ================= FETCH MY PROPERTIES =================

  useEffect(() => {
    const loadMyProperties = async () => {
      if (!currentUser) {
        setPropertiesLoading(false);
        setMyProperties([]);
        return;
      }

      try {
        setPropertiesLoading(true);
        setPropertiesError("");

        const token =
          localStorage.getItem("access_token");

        if (!token) {
          setPropertiesError(
            "Please sign in again to view your properties."
          );
          setMyProperties([]);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/property/my-properties`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setPropertiesError(
            data.message ||
              "Unable to load your properties."
          );
          setMyProperties([]);
          return;
        }

        setMyProperties(
          data.properties || []
        );
      } catch (err) {
        console.error(
          "Fetch my properties error:",
          err
        );

        setPropertiesError(
          err instanceof Error
            ? err.message
            : "Unable to load your properties."
        );

        setMyProperties([]);
      } finally {
        setPropertiesLoading(false);
      }
    };

    loadMyProperties();
  }, [currentUser]);

  // ================= IMAGE UPLOAD =================

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadError("");

    // File type check
    if (!file.type.startsWith("image/")) {
      setUploadError(
        "Please select an image file."
      );
      return;
    }

    // File size check - 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUploadError(
        "Image size must be less than 5MB."
      );
      return;
    }

    try {
      setUploading(true);

      // ================= CLOUDINARY =================

      const formData = new FormData();

      formData.append("file", file);

      formData.append(
        "upload_preset",
        "mern-estate"
      );

      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/mern-estate-project/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudinaryData =
        await cloudinaryResponse.json();

      if (!cloudinaryResponse.ok) {
        console.error(
          "Cloudinary error:",
          cloudinaryData
        );

        setUploadError(
          cloudinaryData?.error?.message ||
            "Image upload failed."
        );

        return;
      }

      const imageUrl =
        cloudinaryData.secure_url;

      if (!imageUrl) {
        setUploadError(
          "Cloudinary did not return an image URL."
        );
        return;
      }

      // ================= SAVE PHOTO TO BACKEND =================

      const token =
        localStorage.getItem("access_token");

      if (!token) {
        setUploadError(
          "Your session has expired. Please sign in again."
        );
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/update-photo`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            photo: imageUrl,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setUploadError(
          data.message ||
            "Unable to save profile image."
        );
        return;
      }

      // ================= UPDATE REDUX =================

      const updatedUser =
        data.user || data;

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      dispatch(
        updateUserSuccess(updatedUser)
      );

      setUploadError("");

      console.log(
        "Profile image uploaded successfully:",
        imageUrl
      );
    } catch (err) {
      console.error(
        "Profile image upload error:",
        err
      );

      setUploadError(
        err instanceof Error
          ? err.message
          : "Unable to upload profile image."
      );
    } finally {
      setUploading(false);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  };

  // ================= DELETE PROPERTY =================

  const handleDeleteProperty = async () => {
    if (!deleteId) {
      return;
    }

    try {
      setDeleting(true);
      setPropertiesError("");

      const token =
        localStorage.getItem("access_token");

      if (!token) {
        setPropertiesError(
          "Please sign in again to delete this property."
        );
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
        setPropertiesError(
          data.message ||
            "Unable to delete property."
        );
        return;
      }

      setMyProperties(
        (previousProperties) =>
          previousProperties.filter(
            (property) =>
              property._id !== deleteId
          )
      );

      setDeleteId(null);

      console.log(
        "Property deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete property error:",
        err
      );

      setPropertiesError(
        err instanceof Error
          ? err.message
          : "Something went wrong while deleting property."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ================= NOT LOGGED IN =================

  if (!currentUser && !loading) {
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
            Please sign in to your estate account
            to view your profile.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/sign-in")
            }
            className="mt-7 inline-flex rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-emerald-700"
          >
            Sign in
          </button>

        </div>
      </main>
    );
  }

  // ================= PROFILE =================

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
            to="/"
            className="rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition duration-300 hover:bg-emerald-600 hover:text-white"
          >
            Back home
          </Link>

        </div>

      </header>

      {/* ================= CONTENT ================= */}

      <section className="px-6 py-12 lg:px-10 lg:py-20">

        <div className="mx-auto max-w-[1100px]">

          {/* ================= HEADING ================= */}

          <div className="mb-10">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Account
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-gray-950 sm:text-5xl">
              Your profile
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500">
              Manage your account information and
              keep your estate profile up to date.
            </p>

          </div>

          {/* ================= PROFILE CARD ================= */}

          <div className="grid overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm lg:grid-cols-[320px_1fr]">

            {/* ================= LEFT ================= */}

            <div className="border-b border-gray-200 bg-gray-950 p-8 lg:border-b-0 lg:border-r lg:p-10">

              <div className="flex flex-col items-center text-center">

                {/* PROFILE IMAGE */}

                <div className="relative">

                  {photo ? (
                    <img
                      src={photo}
                      alt={username}
                      className="h-28 w-28 rounded-full border-4 border-white/20 object-cover shadow-xl"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/10 bg-emerald-600 text-4xl font-semibold text-white shadow-xl">
                      {firstLetter}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      fileRef.current?.click()
                    }
                    disabled={uploading}
                    className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-950 bg-emerald-600 text-white shadow-lg transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                    title="Change profile photo"
                  >
                    {uploading ? "..." : "📷"}
                  </button>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                </div>

                <button
                  type="button"
                  onClick={() =>
                    fileRef.current?.click()
                  }
                  disabled={uploading}
                  className="mt-4 text-xs font-semibold text-emerald-300 transition hover:text-emerald-200 disabled:opacity-50"
                >
                  {uploading
                    ? "Uploading..."
                    : "Change profile photo"}
                </button>

                {uploadError && (
                  <p className="mt-3 max-w-[230px] text-xs leading-5 text-red-300">
                    {uploadError}
                  </p>
                )}

                <h2 className="mt-6 text-2xl font-semibold text-white">
                  {username}
                </h2>

                <p className="mt-2 break-all text-sm text-white/60">
                  {email}
                </p>

                <div className="mt-7 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-emerald-300">
                  Estate Member
                </div>

              </div>

            </div>

            {/* ================= RIGHT ================= */}

            <div className="p-7 sm:p-10 lg:p-12">

              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                    Personal information
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-gray-950">
                    Account details
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/profile/edit")
                  }
                  className="rounded-full bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition duration-300 hover:bg-emerald-600"
                >
                  Edit profile
                </button>

              </div>

              {/* DETAILS */}

              <div className="mt-9 grid gap-5 sm:grid-cols-2">

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                    Username
                  </p>

                  <p className="mt-3 break-words text-sm font-semibold text-gray-900">
                    {username}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                    Email address
                  </p>

                  <p className="mt-3 break-words text-sm font-semibold text-gray-900">
                    {email}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                    Account type
                  </p>

                  <p className="mt-3 text-sm font-semibold text-gray-900">
                    Property seeker
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                    Account status
                  </p>

                  <div className="mt-3 flex items-center gap-2">

                    <span className="h-2 w-2 rounded-full bg-emerald-500" />

                    <p className="text-sm font-semibold text-gray-900">
                      Active
                    </p>

                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* ================= MY PROPERTIES ================= */}

          <div className="mt-10 rounded-[28px] border border-gray-200 bg-white p-7 shadow-sm sm:p-10">

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Your listings
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-gray-950">
                  My Properties
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Manage the properties you have
                  listed on Estate.
                </p>

              </div>

              {/* NEW PROPERTY ROUTE */}

              <Link
                to="/property/create"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-emerald-700"
              >
                + Add property
              </Link>

            </div>

            {/* ERROR */}

            {propertiesError && (
              <div className="mt-7 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
                {propertiesError}
              </div>
            )}

            {/* LOADING */}

            {propertiesLoading && (
              <div className="flex flex-col items-center justify-center py-16">

                <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600" />

                <p className="mt-4 text-sm text-gray-500">
                  Loading your properties...
                </p>

              </div>
            )}

            {/* EMPTY */}

            {!propertiesLoading &&
              !propertiesError &&
              myProperties.length === 0 && (
                <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                    🏠
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-gray-950">
                    No properties yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                    You haven't listed any properties
                    yet. Create your first property
                    to get started.
                  </p>

                  <Link
                    to="/property/create"
                    className="mt-6 inline-flex rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-emerald-700"
                  >
                    Create property
                  </Link>

                </div>
              )}

            {/* PROPERTY GRID */}

            {!propertiesLoading &&
              myProperties.length > 0 && (
                <div className="mt-8 grid gap-6 md:grid-cols-2">

                  {myProperties.map((property) => {

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
                        className="overflow-hidden rounded-[22px] border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                      >

                        {/* IMAGE */}

                        <div className="relative h-[220px] overflow-hidden bg-gray-100">

                          {image ? (
                            <img
                              src={image}
                              alt={
                                property.title ||
                                "Property"
                              }
                              className="h-full w-full object-cover transition duration-500 hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-4xl">
                              🏠
                            </div>
                          )}

                          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold capitalize text-gray-900 shadow-sm">
                            For {property.type}
                          </span>

                        </div>

                        {/* CONTENT */}

                        <div className="p-6">

                          <p className="text-xl font-bold text-gray-950">
                            {formattedPrice}
                          </p>

                          <h3 className="mt-2 line-clamp-1 text-lg font-semibold text-gray-950">
                            {property.title}
                          </h3>

                          <p className="mt-2 line-clamp-1 text-sm text-gray-500">
                            {property.address}

                            {property.city
                              ? `, ${property.city}`
                              : ""}
                          </p>

                          {/* DETAILS */}

                          <div className="mt-5 flex flex-wrap gap-4 border-t border-gray-100 pt-5 text-xs font-medium text-gray-500">

                            <span>
                              🛏{" "}
                              {property.bedrooms || 0}{" "}
                              beds
                            </span>

                            <span>
                              🛁{" "}
                              {property.bathrooms || 0}{" "}
                              baths
                            </span>

                            {property.area > 0 && (
                              <span>
                                📐 {property.area} sq ft
                              </span>
                            )}

                          </div>

                          {/* ACTIONS */}

                          <div className="mt-6 grid gap-3 sm:grid-cols-2">

                            <Link
                              to={`/properties/${property._id}`}
                              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                              View details
                            </Link>

                            <Link
                              to={`/properties/edit/${property._id}`}
                              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              Edit
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                setDeleteId(
                                  property._id
                                )
                              }
                              className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100 sm:col-span-2"
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

        </div>

      </section>

      {/* ================= DELETE MODAL ================= */}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-[28px] bg-white p-7 shadow-2xl">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
              ⚠️
            </div>

            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-gray-950">
              Delete this property?
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              This action will permanently remove
              the property from your listings.
              You won't be able to undo this action.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setDeleteId(null)
                }
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

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-gray-200 bg-white px-6 py-10 lg:px-10">

        <div className="mx-auto flex max-w-[1100px] justify-between gap-4">

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
