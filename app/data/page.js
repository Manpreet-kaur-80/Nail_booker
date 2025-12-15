import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ServiceCard from "../components/ServiceCard";
import { services } from "./data/services";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-rose-50">
      <Navbar />

      <section className="max-w-6xl mx-auto px-5 pt-10 pb-6">
        <h1 className="text-3xl font-extrabold text-rose-700">Services</h1>
        <p className="text-gray-600 mt-2">
          All services include price and duration.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-5 pb-12 grid gap-5 md:grid-cols-2">
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </section>

      <Footer />
    </main>
  );
}
