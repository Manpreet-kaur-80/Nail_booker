import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const GALLERY = [
  { src: "/nails1.jpeg", alt: "French tips with die Blood Color." },
  { src: "/nails2.jpeg", alt: "Marble Art" },
  { src: "/nails3.jpeg", alt: "3-D Flowers with Blooming Design" },
  { src: "/nails4.jpeg", alt: "Black Date Inspo" },
  { src: "/nails5.jpeg", alt: "Ombre with Golden chrome." },
  { src: "/nails6.jpeg", alt: "Mixed Tips" },
  { src: "/nails7.jpeg", alt: "Pearl Art" },
  { src: "/nails8.jpeg", alt: "Summer with Lemon-Yellow" },
];

export default function AboutPage() {
  const name = "";
  const title = "NailsByRay";
  const bio =
    "Hi! I’m Manpreet Kaur (Professional Nail Tech) — I specialize in clean, long-lasting nail sets with a focus on hygiene, detail, and client comfort. Bring your inspo and I’ll help you pick the perfect shape, length, and design.";
  const highlights = [
    "Gel Manicure • Extensions • Nail Art",
    "Sanitized tools + clean setup",
    "Friendly consultation for every client",
  ];

  const addressLines = [
    "Calgary, AB",
    "Near Rundle LRT",
    "Canada",
  ];

  const googleMapsQuery = encodeURIComponent(addressLines.join(", "));

  return (
    <main className="min-h-screen bg-rose-50">
      <Navbar />

      {/* Main */}
      <section className="max-w-6xl mx-auto px-5 pt-10 pb-8">
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-rose-700">
                About {name}
              </h1>
              <p className="text-gray-600 mt-2">{title}</p>
              <p className="text-gray-700 mt-4 leading-relaxed">{bio}</p>

              <ul className="mt-5 space-y-2">
                {highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-gray-700">
                    <span className="mt-1 h-2 w-2 rounded-full bg-rose-500" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Address Card */}
            <div className="w-full  bg-rose-50 rounded-2xl border border-rose-100 p-5">
              <h2 className="font-bold text-gray-900">Location</h2>
              <p className="text-sm text-gray-600 mt-1">
                Address / studio info
              </p>

              <div className="mt-4 space-y-1 text-gray-800">
                {addressLines.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </div>

              <a
                className="mt-4 inline-flex w-full justify-center bg-rose-600 text-white py-2 rounded-lg font-semibold hover:bg-rose-700 transition"
                href={`https://www.google.com/maps/search/?api=1&query=${googleMapsQuery}`}
                target="_blank"
                rel="no-referrer"
              >
                Open in Google Maps
              </a>

              <p className="text-xs text-gray-500 mt-3">
                It is in NE Calgary.“Exact address will be shared after booking”.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Work */}
      <section className="max-w-6xl mx-auto px-5 pb-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-rose-700">
              My Work & Some Inspo Pics For You
            </h2>
            <p className="text-gray-600 mt-2">
              A few fancy sets styles.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {GALLERY.map((img) => (
            <div
              key={img.src}
              className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden"
            >
              <div className="relative w-full aspect-square">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-900">
                  {img.alt}
                </p>
                <p className="text-xs text-gray-500">
                  Custom design & Clean finishing
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
