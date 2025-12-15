"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StatusBadge from "../components/StatusBadge";

import { auth, db } from "../data/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export default function MyBookingsPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // must be logged in //
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/login");
        return;
      }
      setUser(u);
    });
    return () => unsub();
  }, [router]);

  // load ONLY for user's bookings //
  useEffect(() => {
    async function loadMyBookings() {
      if (!user) return;

      setLoading(true);
      try {
        const q = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid)
        );

        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setBookings(data);
      } catch (err) {
        console.error("MY BOOKINGS ERROR:", err);
        alert("Failed to load your bookings.");
      } finally {
        setLoading(false);
      }
    }

    loadMyBookings();
  }, [user]);

  return (
    <main className="min-h-screen bg-rose-50">
      <Navbar />

      <section className="max-w-5xl mx-auto px-5 pt-10 pb-12">
        <h1 className="text-3xl font-extrabold text-rose-700">
          My Bookings
        </h1>
        <p className="text-gray-600 mt-2">
          View all your booking requests and their status.
        </p>

        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden">
          <div className="px-5 py-4 border-b bg-rose-50">
            <h2 className="font-bold text-gray-900">
              Your Bookings ({bookings.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-6 text-gray-600">Loading...</div>
          ) : bookings.length === 0 ? (
            <div className="p-6 text-gray-600">
              You have no bookings yet.
            </div>
          ) : (
            <div className="divide-y">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-bold text-gray-900">{b.service}</p>
                    <p className="text-sm text-gray-600">
                      {b.date} • {b.time}
                    </p>
                  </div>

                  <StatusBadge status={b.status || "Pending"} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
