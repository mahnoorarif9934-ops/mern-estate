import { Link } from "react-router-dom";

export default function Navbar({ transparent = false }) {
  return (
    <header
      className={`absolute left-0 top-0 z-[999] w-full ${
        transparent ? "bg-transparent" : "bg-white"
      }`}
    >
      <div className="mx-auto flex h-[82px] max-w-[1280px] items-center justify-between px-6 lg:px-10">

        {/* ================= LOGO ================= */}
        <Link
          to="/"
          className="group text-2xl font-bold tracking-[-0.04em] !text-white transition-colors duration-200 hover:!text-emerald-400"
        >
          estate
          <span className="!text-emerald-400 transition-colors duration-200 group-hover:!text-emerald-300">
            .
          </span>
        </Link>

        {/* ================= NAVIGATION ================= */}
        <nav className="hidden items-center gap-8 md:flex">

          {/* HOME */}
          <Link
            to="/"
            className="!text-white text-sm font-semibold transition-colors duration-200 hover:!text-emerald-400"
          >
            Home
          </Link>

          {/* PROPERTIES */}
          <Link
            to="/search"
            className="!text-white text-sm font-semibold transition-colors duration-200 hover:!text-emerald-400"
          >
            Properties
          </Link>

          {/* ABOUT */}
          <a
            href="/#about"
            className="!text-white text-sm font-semibold transition-colors duration-200 hover:!text-emerald-400"
          >
            About
          </a>

          {/* SERVICES */}
          <a
            href="/#services"
            className="!text-white text-sm font-semibold transition-colors duration-200 hover:!text-emerald-400"
          >
            Services
          </a>

        </nav>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-3">

          {/* SIGN IN */}
          <Link
            to="/sign-in"
            className="!text-white text-sm font-semibold transition-colors duration-200 hover:!text-emerald-400"
          >
            Sign in
          </Link>

          {/* GET STARTED */}
          <Link
            to="/sign-up"
            className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold !text-white shadow-lg transition duration-300 hover:bg-emerald-700"
          >
            Get started
          </Link>

        </div>

      </div>
    </header>
  );
}