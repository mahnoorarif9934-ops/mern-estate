import { Link } from "react-router-dom";

export default function PropertyCard({ property }) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-white">

      <div className="relative overflow-hidden rounded-2xl">

        <Link to={`/listing/${property.id}`}>
          <img
            src={property.image}
            alt={property.title}
            className="h-[280px] w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </Link>

        <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-800">
          For sale
        </div>

        <button
          type="button"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl text-gray-700 backdrop-blur transition hover:bg-white"
          aria-label="Add property to favorites"
        >
          ♡
        </button>

      </div>

      <div className="px-1 pt-5">

        <div className="flex items-start justify-between gap-4">

          <div>
            <Link to={`/listing/${property.id}`}>
              <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-gray-900 transition hover:text-emerald-600">
                {property.title}
              </h3>
            </Link>

            <p className="mt-1.5 text-sm text-gray-500">
              {property.location}
            </p>
          </div>

          <p className="whitespace-nowrap text-[18px] font-semibold text-emerald-600">
            {property.price}
          </p>

        </div>

        <div className="mt-5 flex items-center gap-5 border-t border-gray-100 pt-4 text-xs text-gray-500">
          <span>{property.beds} Beds</span>
          <span>{property.baths} Baths</span>
          <span>{property.area} sq ft</span>
        </div>

      </div>

    </article>
  );
}