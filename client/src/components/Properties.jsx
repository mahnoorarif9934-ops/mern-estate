import { Link } from "react-router-dom";
import PropertyCard from "./PropertyCard";

const properties = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    title: "Modern Family Residence",
    location: "Austin, Texas",
    price: "$785,000",
    beds: 4,
    baths: 3,
    area: "2,450",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85",
    title: "Luxury Glass House",
    location: "Miami, Florida",
    price: "$1,250,000",
    beds: 5,
    baths: 4,
    area: "3,120",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
    title: "Minimal City Apartment",
    location: "New York, USA",
    price: "$920,000",
    beds: 3,
    baths: 2,
    area: "1,850",
  },
];

export default function Properties() {
  return (
    <section
      id="properties"
      className="bg-white px-6 py-24 lg:px-10"
    >
      <div className="mx-auto max-w-[1280px]">

        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Featured collection
            </p>

            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-gray-900 lg:text-5xl">
              Homes worth coming home to.
            </h2>

            <p className="mt-4 max-w-[540px] text-[15px] leading-7 text-gray-500">
              Explore our hand-picked selection of beautiful properties,
              carefully chosen for quality, location and lifestyle.
            </p>
          </div>

          <Link
            to="/search"
            className="w-fit rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-800 transition hover:border-emerald-600 hover:text-emerald-600"
          >
            Explore all properties →
          </Link>

        </div>

        <div className="mt-14 grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">

          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))}

        </div>

      </div>
    </section>
  );
}