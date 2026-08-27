import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      dispatch(signInStart());

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.message || "Invalid email or password.";

        dispatch(signInFailure(errorMessage));
        setError(errorMessage);
        return;
      }

      localStorage.setItem("access_token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      dispatch(signInSuccess(data.user));

      navigate("/profile");
    } catch (error) {
      console.error("Signin request failed:", error);

      const errorMessage =
        "Unable to connect to the server. Please make sure the backend is running.";

      dispatch(signInFailure(errorMessage));
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8f7]">

      {/* ================= HEADER ================= */}
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-[78px] max-w-[1280px] items-center justify-between px-6 lg:px-10">

          <Link
            to="/"
            className="text-2xl font-bold tracking-[-0.04em] text-gray-950"
          >
            estate<span className="text-emerald-600">.</span>
          </Link>

          <div className="flex items-center gap-3">

            <span className="hidden text-sm text-gray-500 sm:block">
              Don't have an account?
            </span>

            <Link
              to="/sign-up"
              className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition duration-200 hover:border-emerald-500 hover:text-emerald-600"
            >
              Create account
            </Link>

          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <section className="px-6 py-12 lg:px-10 lg:py-20">

        <div className="mx-auto grid max-w-[1100px] overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm lg:grid-cols-2">

          {/* ================= LEFT FORM ================= */}
          <div className="flex items-center px-7 py-10 sm:px-12 lg:px-14">

            <div className="w-full max-w-[430px]">

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Welcome back
              </p>

              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-gray-950">
                Sign in to estate.
              </h1>

              <p className="mt-4 text-sm leading-6 text-gray-500">
                Access your saved properties and continue your property
                journey.
              </p>

              {/* ================= ERROR ================= */}
              {error && (
                <div
                  role="alert"
                  className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                >
                  {error}
                </div>
              )}

              {/* ================= FORM ================= */}
              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-800"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-gray-800"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setError(
                          "Password reset will be available soon."
                        );
                      }}
                      className="text-xs font-semibold text-emerald-600 transition hover:text-emerald-700"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                      className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-gray-400 transition hover:text-emerald-600"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      title={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition duration-300 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>

              </form>

              {/* ================= DIVIDER ================= */}
              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200" />

                <span className="text-xs text-gray-400">
                  OR
                </span>

                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* ================= GOOGLE ================= */}
              <button
                type="button"
                onClick={() => {
                  setError(
                    "Google sign in will be connected in a later step."
                  );
                }}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-700 transition duration-200 hover:border-gray-300 hover:bg-gray-50"
              >
                <span className="text-base font-bold text-gray-900">
                  G
                </span>

                Continue with Google
              </button>

              {/* ================= SIGN UP ================= */}
              <p className="mt-8 text-center text-sm text-gray-500">
                Don't have an account?{" "}

                <Link
                  to="/sign-up"
                  className="font-semibold text-emerald-600 transition hover:text-emerald-700"
                >
                  Create account
                </Link>
              </p>

            </div>
          </div>

          {/* ================= RIGHT IMAGE ================= */}
          <div className="relative hidden min-h-[680px] overflow-hidden lg:block">

            <img
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=90"
              alt="Luxury modern interior"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/35" />

            <div className="absolute bottom-0 left-0 right-0 p-10">

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Your property journey
              </p>

              <h2 className="mt-4 max-w-md text-4xl font-semibold leading-tight tracking-[-0.04em] text-white">
                Come back to the places that feel like home.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/80">
                Save your favorite properties, explore new listings and find
                the place that's right for you.
              </p>

            </div>
          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="px-6 pb-8">
        <div className="mx-auto max-w-[1100px] text-center">
          <p className="text-xs text-gray-400">
            © 2026 Estate. All rights reserved.
          </p>
        </div>
      </footer>

    </main>
  );
}
