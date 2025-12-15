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
  orderBy,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";

const ADMIN_EMAIL = "manpreetkaurandhawa@gmail.com";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin-only //
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/login");
        return;
      }

      const email = (u.email || "").trim().toLowerCase();
      if (email !== ADMIN_EMAIL.toLowerCase()) {
        alert("Access denied. Admin only.");
        router.push("/");
        return;
      }

      setUser(u);
    });

    return () => unsub();
  }, [router]);

  // Load bookings //
  const loadBookings = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
      alert("Failed to load bookings. Check console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Approve/Reject (status update) //
  const changeStatus = async (bookingId, newStatus) => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), {
        status: newStatus,
      });

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: newStatus } : b
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status. Check Firestore rules.");
    }
  };

  return (
    <main className="min-h-screen bg-rose-50">
      <Navbar />

      <section className="max-w-6xl mx-auto px-5 pt-10 pb-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-rose-700">
              Admin 
            </h1>
            <p className="text-gray-600 mt-2">
              Approve or reject booking requests.
            </p>
            {user?.email && (
              <p className="text-sm text-gray-500 mt-1">
               Only Admin can access this page. <span className="font-semibold"></span>
              </p>
            )}
          </div>

          <button
            onClick={loadBookings}
            className="bg-white border border-rose-300 text-rose-700 px-4 py-2 rounded-lg font-semibold hover:bg-rose-50 transition"
          >
            Refresh
          </button>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden">
          <div className="px-5 py-4 border-b bg-rose-50">
            <h2 className="font-bold text-gray-900">
              Booking Requests ({bookings.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-6 text-gray-600">Loading...</div>
          ) : bookings.length === 0 ? (
            <div className="p-6 text-gray-600">No bookings yet.</div>
          ) : (
            <div className="divide-y">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900">{b.name}</p>
                    <p className="text-sm text-gray-600">
                      {b.service} • {b.date} • {b.time}
                    </p>
                    <p className="text-xs text-gray-500">{b.email}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={b.status || "Pending"} />
                    <select
                      value={b.status || "Pending"}
                      onChange={(e) => changeStatus(b.id, e.target.value)}
                      className="text-sm rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
                    >
                      <option>Pending</option>
                      <option>Accepted</option>
                      <option>Declined</option>
                    </select>
                  </div>
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
