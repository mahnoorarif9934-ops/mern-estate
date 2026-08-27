import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "../redux/user/userSlice";

export default function Header() {
  const { currentUser } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("access_token");

    dispatch(signOut());

    navigate("/sign-in");
  };

  return (
    <header className="absolute left-0 right-0 top-0 z-50">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="flex h-[88px] items-center justify-between border-b border-white/20">

          {/* LOGO */}
          <Link
            to="/"
            className="text-[26px] font-bold tracking-[-0.04em] text-white"
          >
            estate
            <span className="text-emerald-400">.</span>
          </Link>

          {/* NAVIGATION */}
          <nav className="hidden items-center gap-10 lg:flex">

            <Link
              to="/"
              className="text-[14px] font-medium text-white transition hover:text-emerald-300"
            >
              Home
            </Link>

            <a
              href="/#properties"
              className="text-[14px] font-medium text-white/75 transition hover:text-white"
            >
              Properties
            </a>

            <a
              href="/#about"
              className="text-[14px] font-medium text-white/75 transition hover:text-white"
            >
              About us
            </a>

            <a
              href="/#services"
              className="text-[14px] font-medium text-white/75 transition hover:text-white"
            >
              Services
            </a>

          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">

            {!currentUser ? (
              <>
                <Link
                  to="/sign-in"
                  className="hidden px-4 py-2.5 text-sm font-medium text-white transition hover:text-emerald-300 sm:block"
                >
                  Sign in
                </Link>

                <Link
                  to="/sign-up"
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-emerald-400 hover:text-white"
                >
                  Get started
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/create-listing"
                  className="hidden px-4 py-2.5 text-sm font-medium text-white transition hover:text-emerald-300 sm:block"
                >
                  Create listing
                </Link>

                <Link
                  to="/profile"
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-emerald-400 hover:text-white"
                >
                  Profile
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="hidden rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-red-400 hover:bg-red-500 sm:block"
                >
                  Sign out
                </button>
              </>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}