import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ContactPage() {
  const phoneNumber ="4039998884";

  const instagramUrl =
    "https://www.instagram.com/uk_nail_s_calgary?igsh=eTk3MGZ0d2pqYjVp&utm_source=qr";

  const facebookUrl =
    "https://www.facebook.com/share/1N2yBs7FPM/?mibextid=wwXIfr";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white px-6 py-16 text-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Contact</h1>

          <p className="text-lg text-gray-600 mb-10">
            For bookings, questions, or nail inspiration — feel free to reach out.
          </p>

          {/* Contact Cards */}
          <div className="grid gap-6 sm:grid-cols-4">
            {/* Phone */}
            <div className="border rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-2">Phone</p>
              <a
                href={`tel:${phoneNumber}`}
                className="text-xl font-semibold text-pink-600 hover:underline"
              >
                {phoneNumber}
              </a>
              <p className="text-xs text-gray-400 mt-2">Call or text. Forgive for not getting instant reply here.  </p>
            </div>

            {/* Instagram */}
            <div className="border rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-2">Instagram</p>
              <a
                href={instagramUrl}
                target="_blank"
                rel="no-opener no-referrer"
                className="text-xl font-semibold text-pink-600 hover:underline "
              >
                @uk_nail_s
                _calgary
              </a>
              <p className="text-xs text-gray-400 mt-2">
                DM for bookings & inspo
              </p>
            </div>

            {/* Facebook */}
            <div className="border rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-2">Facebook</p>
              <a
                href={facebookUrl}
                target="_blank"
                rel="no-opener no-referrer"
                className="text-xl font-semibold text-pink-600 hover:underline"
              >
                Nails_in_
                Calgary
              </a>
              <p className="text-xs text-gray-400 mt-2">
                Message on Facebook
              </p>
            </div>

            {/* Location */}
            <div className="border rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-2">Location</p>
              <p className="text-xl font-semibold">Visit In-person</p>
              <p className="text-xs text-gray-400 mt-2">
                Near Rundle LRT
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
