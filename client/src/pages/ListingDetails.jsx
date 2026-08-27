import { Link, useParams } from "react-router-dom";

const properties = [
  {
    id: 1,
    title: "Modern Villa with Garden",
    location: "Islamabad, Pakistan",
    price: "$485,000",
    type: "Villa",
    beds: 4,
    baths: 3,
    area: "2,450 sq ft",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=90",
    description:
      "A beautifully designed modern villa offering spacious living areas, elegant interiors and a peaceful garden. This property is ideal for families looking for comfort, privacy and contemporary living.",
    features: [
      "Private garden",
      "Modern kitchen",
      "Large living room",
      "Covered parking",
      "Master bedroom",
      "Natural lighting",
    ],
  },

  {
    id: 2,
    title: "Contemporary Family Home",
    location: "Lahore, Pakistan",
    price: "$365,000",
    type: "House",
    beds: 3,
    baths: 2,
    area: "1,850 sq ft",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=90",
    description:
      "A contemporary family home with a practical layout, comfortable bedrooms and beautifully finished living spaces.",
    features: [
      "Modern kitchen",
      "Family lounge",
      "Private parking",
      "Spacious bedrooms",
      "Bright interiors",
      "Quiet neighborhood",
    ],
  },

  {
    id: 3,
    title: "Luxury City Apartment",
    location: "Islamabad, Pakistan",
    price: "$295,000",
    type: "Apartment",
    beds: 2,
    baths: 2,
    area: "1,250 sq ft",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=90",
    description:
      "A stylish city apartment designed for modern urban living with comfortable interiors and convenient access to nearby facilities.",
    features: [
      "City view",
      "Modern kitchen",
      "Secure building",
      "Elevator access",
      "Balcony",
      "Dedicated parking",
    ],
  },

  {
    id: 4,
    title: "Elegant Modern Residence",
    location: "Rawalpindi, Pakistan",
    price: "$410,000",
    type: "House",
    beds: 4,
    baths: 3,
    area: "2,100 sq ft",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2200&q=90",
    description:
      "An elegant modern residence featuring spacious rooms, contemporary finishes and a comfortable family-oriented layout.",
    features: [
      "Four bedrooms",
      "Modern bathrooms",
      "Large kitchen",
      "Parking area",
      "Family lounge",
      "Outdoor space",
    ],
  },

  {
    id: 5,
    title: "Premium Garden Villa",
    location: "Lahore, Pakistan",
    price: "$590,000",
    type: "Villa",
    beds: 5,
    baths: 4,
    area: "3,100 sq ft",
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=2200&q=90",
    description:
      "A premium villa combining generous living spaces, elegant architecture and a beautiful private garden.",
    features: [
      "Private garden",
      "Five bedrooms",
      "Premium kitchen",
      "Large terrace",
      "Covered parking",
      "Guest room",
    ],
  },

  {
    id: 6,
    title: "Minimal Downtown Apartment",
    location: "Karachi, Pakistan",
    price: "$245,000",
    type: "Apartment",
    beds: 2,
    baths: 2,
    area: "1,100 sq ft",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=90",
    description:
      "A minimal and comfortable apartment located in a convenient downtown area, perfect for modern city living.",
    features: [
      "Downtown location",
      "Modern interior",
      "Two bedrooms",
      "Secure entrance",
      "Balcony",
      "Parking",
    ],
  },
];

export default function ListingDetails() {
  const { id } = useParams();

  const property = properties.find(
    (item) => item.id === Number(id)
  );

  if (!property) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f7] px-6">

        <div className="text-center">

          <h1 className="text-3xl font-semibold text-gray-900">
            Property not found
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            The property you're looking for doesn't exist.
          </p>

          <Link
            to="/search"
            className="mt-7 inline-flex rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Back to properties
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">

      {/* ================= NAVBAR ================= */}
      <header className="border-b border-gray-100 bg-white">

        <div className="mx-auto flex h-[82px] max-w-[1280px] items-center justify-between px-6 lg:px-10">

          <Link
            to="/"
            className="text-2xl font-bold tracking-[-0.04em] text-gray-950"
          >
            estate<span className="text-emerald-600">.</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">

            <Link
              to="/"
              className="text-sm font-semibold text-gray-700 transition hover:text-emerald-600"
            >
              Home
            </Link>

            <Link
              to="/search"
              className="text-sm font-semibold text-emerald-600"
            >
              Properties
            </Link>

            <Link
              to="/sign-in"
              className="text-sm font-semibold text-gray-700 transition hover:text-emerald-600"
            >
              Sign in
            </Link>

            <Link
              to="/sign-up"
              className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Get started
            </Link>

          </nav>

        </div>

      </header>

      {/* ================= PAGE ================= */}
      <section className="bg-[#f7f8f7] px-6 py-10 lg:px-10">

        <div className="mx-auto max-w-[1280px]">

          {/* Back */}
          <Link
            to="/search"
            className="inline-flex items-center text-sm font-semibold text-gray-500 transition hover:text-emerald-600"
          >
            ← Back to properties
          </Link>

          {/* ================= IMAGE ================= */}
          <div className="mt-7 overflow-hidden rounded-[28px] bg-gray-100">

            <img
              src={property.image}
              alt={property.title}
              className="h-[420px] w-full object-cover sm:h-[520px] lg:h-[600px]"
            />

          </div>

          {/* ================= CONTENT ================= */}
          <div className="grid gap-10 py-12 lg:grid-cols-[1fr_380px]">

            {/* LEFT */}
            <div>

              <div className="flex flex-wrap items-center gap-3">

                <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  {property.type}
                </span>

                <span className="text-sm text-gray-500">
                  Property #{property.id}
                </span>

              </div>

              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-gray-950 sm:text-5xl">
                {property.title}
              </h1>

              <p className="mt-4 text-sm text-gray-500">
                📍 {property.location}
              </p>

              {/* Price */}
              <p className="mt-7 text-3xl font-semibold tracking-tight text-gray-950">
                {property.price}
              </p>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-3 rounded-2xl border border-gray-200 bg-white">

                <div className="border-r border-gray-200 px-4 py-5 text-center">

                  <p className="text-lg font-semibold text-gray-900">
                    {property.beds}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Bedrooms
                  </p>

                </div>

                <div className="border-r border-gray-200 px-4 py-5 text-center">

                  <p className="text-lg font-semibold text-gray-900">
                    {property.baths}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Bathrooms
                  </p>

                </div>

                <div className="px-4 py-5 text-center">

                  <p className="text-lg font-semibold text-gray-900">
                    {property.area}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Area
                  </p>

                </div>

              </div>

              {/* Description */}
              <div className="mt-12">

                <h2 className="text-2xl font-semibold tracking-tight text-gray-950">
                  About this property
                </h2>

                <p className="mt-5 max-w-3xl text-[15px] leading-8 text-gray-500">
                  {property.description}
                </p>

              </div>

              {/* Features */}
              <div className="mt-12">

                <h2 className="text-2xl font-semibold tracking-tight text-gray-950">
                  Property features
                </h2>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">

                  {property.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-4"
                    >

                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-700">
                        ✓
                      </span>

                      <span className="text-sm font-medium text-gray-700">
                        {feature}
                      </span>

                    </div>
                  ))}

                </div>

              </div>

            </div>

            {/* ================= AGENT CARD ================= */}
            <aside>

              <div className="sticky top-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Property agent
                </p>

                <div className="mt-6 flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-lg font-semibold text-emerald-700">
                    EA
                  </div>

                  <div>

                    <h3 className="font-semibold text-gray-900">
                      Estate Advisor
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Property specialist
                    </p>

                  </div>

                </div>

                <div className="mt-7 space-y-3">

                  <button
                    type="button"
                    className="w-full rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Contact agent
                  </button>

                  <button
                    type="button"
                    className="w-full rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-800 transition hover:border-emerald-500 hover:text-emerald-600"
                  >
                    Schedule a viewing
                  </button>

                </div>

                <p className="mt-5 text-center text-xs leading-5 text-gray-400">
                  Our property team will help you with questions and viewing
                  arrangements.
                </p>

              </div>

            </aside>

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-gray-100 bg-white px-6 py-8 lg:px-10">

        <div className="mx-auto flex max-w-[1280px] items-center justify-between">

          <Link
            to="/"
            className="text-lg font-bold text-gray-950"
          >
            estate<span className="text-emerald-600">.</span>
          </Link>

          <p className="text-xs text-gray-400">
            © 2026 Estate. All rights reserved.
          </p>

        </div>

      </footer>

    </main>
  );
}