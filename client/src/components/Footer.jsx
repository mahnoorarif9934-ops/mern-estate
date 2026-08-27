export default function Footer() {
  return (
    <footer className="bg-gray-950 px-6 py-14 text-white lg:px-10">
      <div className="mx-auto max-w-[1280px]">

        <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-10 md:flex-row">

          <div>
            <a
              href="/"
              className="text-2xl font-bold tracking-[-0.04em]"
            >
              estate<span className="text-emerald-400">.</span>
            </a>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/50">
              A modern real-estate platform built to make finding your next
              place simple and beautiful.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-14 sm:grid-cols-3">

            <div>
              <p className="text-sm font-semibold">Explore</p>

              <div className="mt-4 space-y-3 text-sm text-white/50">
                <p>Properties</p>
                <p>Locations</p>
                <p>Agents</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold">Company</p>

              <div className="mt-4 space-y-3 text-sm text-white/50">
                <p>About us</p>
                <p>Services</p>
                <p>Contact</p>
              </div>
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold">Follow</p>

              <div className="mt-4 space-y-3 text-sm text-white/50">
                <p>Instagram</p>
                <p>Facebook</p>
                <p>LinkedIn</p>
              </div>
            </div>

          </div>

        </div>

        <div className="flex flex-col justify-between gap-3 pt-7 text-xs text-white/40 sm:flex-row">
          <p>© 2026 Estate. All rights reserved.</p>

          <p>Privacy · Terms</p>
        </div>

      </div>
    </footer>
  );
}