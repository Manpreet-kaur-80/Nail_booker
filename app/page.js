import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-rose-50">
      <Navbar />

      <section className="max-w-6xl mx-auto px-5 pt-12 pb-10">
        <div className="bg-white rounded-3xl shadow-sm border border-rose-100 p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-rose-700">
            Beautiful Nails, Easy Booking 💅
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl">
            Browse services, choose a time slot, and request an appointment in minutes.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/services"
              className="text-center bg-white text-rose-700 px-6 py-3 rounded-xl font-semibold border border-rose-300 hover:bg-rose-50 transition"
            >
              View Services
            </Link>

            <Link
              href="/book"
              className="text-center bg-rose-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-rose-700 transition"
            >
              Book Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
