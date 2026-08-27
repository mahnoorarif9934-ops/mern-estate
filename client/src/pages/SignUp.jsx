import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
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

    const username = formData.username.trim();
    const email = formData.email.trim();
    const password = formData.password;

    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to create account.");
        return;
      }

      navigate("/sign-in");

    } catch (error) {
      console.error("Signup request failed:", error);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
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
              Already have an account?
            </span>

            <Link
              to="/sign-in"
              className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition duration-200 hover:border-emerald-500 hover:text-emerald-600"
            >
              Sign in
            </Link>

          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <section className="px-6 py-12 lg:px-10 lg:py-20">

        <div className="mx-auto grid max-w-[1100px] overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm lg:grid-cols-2">

          {/* ================= LEFT IMAGE ================= */}
          <div className="relative hidden min-h-[680px] overflow-hidden lg:block">

            <img
              src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=90"
              alt="Modern luxury house"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute bottom-0 left-0 right-0 p-10">

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Find your place
              </p>

              <h2 className="mt-4 max-w-md text-4xl font-semibold leading-tight tracking-[-0.04em] text-white">
                Your next home starts with one simple step.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/80">
                Create your account and start exploring beautiful properties
                selected for the way you want to live.
              </p>

            </div>
          </div>

          {/* ================= FORM ================= */}
          <div className="flex items-center px-7 py-10 sm:px-12 lg:px-14">

            <div className="w-full max-w-[430px]">

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Get started
              </p>

              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-gray-950">
                Create your account
              </h1>

              <p className="mt-4 text-sm leading-6 text-gray-500">
                Join estate and discover your next perfect property.
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

                {/* Username */}
                <div>

                  <label
                    htmlFor="username"
                    className="text-sm font-semibold text-gray-800"
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
                    autoComplete="username"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />

                </div>

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

                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-800"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                      className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-gray-400 transition hover:text-emerald-600"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      title={
                        showPassword ? "Hide password" : "Show password"
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
                  {loading ? "Creating account..." : "Create account"}
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
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-700 transition duration-200 hover:border-gray-300 hover:bg-gray-50"
              >

                <span className="text-base font-bold text-gray-900">
                  G
                </span>

                Continue with Google

              </button>

              {/* ================= SIGN IN ================= */}
              <p className="mt-8 text-center text-sm text-gray-500">

                Already have an account?{" "}

                <Link
                  to="/sign-in"
                  className="font-semibold text-emerald-600 transition hover:text-emerald-700"
                >
                  Sign in
                </Link>

              </p>

              {/* ================= TERMS ================= */}
              <p className="mt-6 text-center text-[11px] leading-5 text-gray-400">
                By creating an account, you agree to our terms and privacy
                policy.
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