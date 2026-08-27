export default function Feature({ number, title, text }) {
  return (
    <div className="border-t border-gray-200 pt-5">
      <span className="text-xs font-semibold text-emerald-600">
        {number}
      </span>

      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-gray-500">
        {text}
      </p>
    </div>
  );
}