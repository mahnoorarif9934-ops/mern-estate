import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";

export default function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser, loading } = useSelector(
    (state) => state.user
  );

  const [formData, setFormData] = useState({
    username: currentUser?.username || currentUser?.name || "",
    email: currentUser?.email || "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ================= NOT LOGGED IN =================

  if (!currentUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f7] px-6">
        <div className="w-full max-w-md rounded-[28px] border border-gray-200 bg-white p-10 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-2xl">
            🔐
          </div>

          <h1 className="mt-6 text-2xl font-semibold text-gray-950">
            Sign in required
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Please sign in to edit your profile.
          </p>

          <button
            type="button"
            onClick={() => navigate("/sign-in")}
            className="mt-7 rounded-full bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Sign in
          </button>

        </div>
      </main>
    );
  }

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

  // ================= UPDATE PROFILE =================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.username.trim()) {
      setError("Username is required.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email address is required.");
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    try {
      dispatch(updateUserStart());

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: formData.username.trim(),
            email: formData.email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        dispatch(
          updateUserFailure(
            data.message || "Unable to update profile."
          )
        );

        setError(
          data.message || "Unable to update profile."
        );

        return;
      }

      const updatedUser = data.user || data;

      dispatch(updateUserSuccess(updatedUser));

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setSuccess("Profile updated successfully.");

      setTimeout(() => {
        navigate("/profile");
      }, 800);

    } catch (err) {
      console.error("Update profile error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while updating your profile.";

      dispatch(updateUserFailure(message));
      setError(message);

    }
  };

  // ================= UI =================

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
            to="/profile"
            className="rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition duration-300 hover:bg-emerald-600 hover:text-white"
          >
            Back to profile
          </Link>

        </div>

      </header>

      {/* ================= CONTENT ================= */}

      <section className="px-6 py-12 lg:px-10 lg:py-20">

        <div className="mx-auto max-w-[760px]">

          {/* HEADING */}

          <div className="mb-10">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Account settings
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-gray-950 sm:text-5xl">
              Edit profile
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500">
              Update your account information and keep
              your Estate profile up to date.
            </p>

          </div>

          {/* ================= FORM CARD ================= */}

          <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">

            <div className="p-7 sm:p-10 lg:p-12">

              {/* PROFILE SUMMARY */}

              <div className="flex items-center gap-5 border-b border-gray-100 pb-8">

                {currentUser?.photo ? (
                  <img
                    src={currentUser.photo}
                    alt={formData.username}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-950 text-xl font-semibold text-white">
                    {formData.username
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <div>
                  <h2 className="text-lg font-semibold text-gray-950">
                    {formData.username || "Your account"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Manage your personal information
                  </p>
                </div>

              </div>

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="mt-8"
              >

                {/* USERNAME */}

                <div>

                  <label
                    htmlFor="username"
                    className="text-sm font-semibold text-gray-900"
                  >
                    Username
                  </label>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    className="mt-3 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />

                </div>

                {/* EMAIL */}

                <div className="mt-6">

                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-900"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="mt-3 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />

                </div>

                {/* ERROR */}

                {error && (
                  <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
                    {error}
                  </div>
                )}

                {/* SUCCESS */}

                {success && (
                  <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
                    {success}
                  </div>
                )}

                {/* ACTIONS */}

                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-full bg-gray-950 px-7 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Saving..."
                      : "Save changes"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-gray-200 bg-white px-6 py-10 lg:px-10">

        <div className="mx-auto flex max-w-[1100px] justify-between gap-4">

          <Link
            to="/"
            className="text-xl font-bold tracking-[-0.04em] text-gray-900"
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