import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ServiceCard from "../components/ServiceCard";
import { services } from "../data/services";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-rose-50">
      <Navbar />

      <section className="max-w-6xl mx-auto px-5 pt-10 pb-6">
        <h1 className="text-3xl font-extrabold text-rose-700">
          Our Services 💅
        </h1>
        <p className="text-gray-600 mt-2">
          Browse all nail services along with price and duration like how long it takes to be done.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-5 pb-12 grid gap-5 md:grid-cols-2">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </section>

      <Footer />
    </main>
  );
}
