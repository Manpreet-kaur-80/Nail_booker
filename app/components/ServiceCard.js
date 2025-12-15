import Link from "next/link";

export default function ServiceCard({ service }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{service.desc}</p>
        </div>
        <div className="text-right">
          <div className="text-rose-700 font-extrabold">${service.price}</div>
          <div className="text-xs text-gray-500">{service.duration}</div>
          <div className="text-xs text-gray-500">stay time = {service.staytime}</div>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <Link
          href={`/book?service=${encodeURIComponent(service.id)}`}
          className="flex-1 text-center bg-rose-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-rose-700 transition"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
