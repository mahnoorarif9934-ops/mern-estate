function SearchIcon({ type }) {
  if (type === "location") {
    return (
      <svg
        className="h-4 w-4 text-emerald-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21s7-6.1 7-12a7 7 0 10-14 0c0 5.9 7 12 7 12z"
        />
        <circle cx="12" cy="9" r="2.2" />
      </svg>
    );
  }

  if (type === "home") {
    return (
      <svg
        className="h-4 w-4 text-emerald-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10.5L12 3l9 7.5"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 9.5V21h14V9.5M9 21v-6h6v6"
        />
      </svg>
    );
  }

  return (
    <svg
      className="h-4 w-4 text-emerald-600"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v18M17 7H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H7"
      />
    </svg>
  );
}

function SearchField({ label, value, icon }) {
  return (
    <div className="border-b border-gray-100 px-5 py-3 lg:border-b-0 lg:border-r">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
        {label}
      </p>

      <div className="mt-1 flex items-center gap-2">
        <SearchIcon type={icon} />

        <span className="text-sm font-medium text-gray-800">
          {value}
        </span>
      </div>
    </div>
  );
}

export default function SearchBox() {
  return (
    <div className="mt-10 rounded-2xl bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.16)]">
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr_auto]">

        <SearchField
          label="Location"
          value="Where are you looking?"
          icon="location"
        />

        <SearchField
          label="Property type"
          value="All property types"
          icon="home"
        />

        <SearchField
          label="Price range"
          value="Any price"
          icon="price"
        />

        <button className="mt-2 rounded-xl bg-emerald-600 px-8 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700 lg:mt-0">
          Search
        </button>

      </div>
    </div>
  );
}