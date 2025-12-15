"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SlotPicker from "../components/SlotPicker";

import { services } from "../data/services";

import { auth, db } from "../data/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { Formik } from "formik";
import * as Yup from "yup";

// constants
const WORK_START = "10:00";
const WORK_END = "18:00";
const SLOT_MINUTES = 30;
const GST_RATE = 0.05;

const BookingSchema = Yup.object().shape({
  serviceId: Yup.string().required("Service is required"),
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  date: Yup.string().required("Date is required"),
  time: Yup.string().required("Please select an available slot"),
});

// helpers
function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
function fromMinutes(total) {
  const h = String(Math.floor(total / 60)).padStart(2, "0");
  const m = String(total % 60).padStart(2, "0");
  return `${h}:${m}`;
}
function formatLabel(hhmm) {
  const [hStr, mStr] = hhmm.split(":");
  let h = Number(hStr);
  const m = Number(mStr);
  const ampm = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  if (h > 12) h -= 12;
  return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
}

// prevents “Submitting…” hanging forever on Vercel
function withTimeout(promise, ms = 12000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error("Request timed out. Check Firebase config/rules/domain.")
          ),
        ms
      )
    ),
  ]);
}

export default function BookClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const presetServiceId = sp.get("service") || "";

  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookedTimes, setBookedTimes] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setCheckingAuth(false);
      if (!u) router.push("/login");
    });
    return () => unsub();
  }, [router]);

  // Load booked slots for the selectedDate
  useEffect(() => {
    async function loadBooked() {
      if (!selectedDate) {
        setBookedTimes([]);
        return;
      }

      setLoadingSlots(true);
      try {
        const q = query(
          collection(db, "bookedSlots"),
          where("date", "==", selectedDate)
        );

        const snap = await withTimeout(getDocs(q), 12000);

        const times = snap.docs
          .map((d) => d.data()?.time)
          .filter(Boolean);

        setBookedTimes(times);
      } catch (e) {
        console.error("LOAD SLOTS ERROR:", e);
        alert(e?.message || "Failed to load available slots.");
      } finally {
        setLoadingSlots(false);
      }
    }

    loadBooked();
  }, [selectedDate]);

  const slots = useMemo(() => {
    const start = toMinutes(WORK_START);
    const end = toMinutes(WORK_END);

    const list = [];
    for (let t = start; t < end; t += SLOT_MINUTES) {
      const value = fromMinutes(t);
      list.push({
        value,
        label: formatLabel(value),
        isBooked: bookedTimes.includes(value),
      });
    }
    return list;
  }, [bookedTimes]);

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-rose-50 flex items-center justify-center">
        <p className="text-gray-600 font-semibold">Checking login...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-rose-50">
      <Navbar />

      <section className="max-w-3xl mx-auto px-5 pt-10 pb-12">
        <h1 className="text-3xl font-extrabold text-rose-700">Book</h1>
        <p className="text-gray-600 mt-2">
          Select a service, choose a date, then pick an available slot.
        </p>

        <Formik
          initialValues={{
            serviceId: presetServiceId,
            name: "",
            date: "",
            time: "",
          }}
          validationSchema={BookingSchema}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            setSubmitting(true);

            try {
              console.log("SUBMIT START:", values);

              //  must be logged in
              if (!user) {
                alert("Please login first.");
                router.push("/login");
                return;
              }

              const chosen = services.find((s) => s.id === values.serviceId);
              const serviceName = chosen?.name || "Unknown Service";
              const subtotal = Number(chosen?.price || 0);
              const gst = Number((subtotal * GST_RATE).toFixed(2));
              const total = Number((subtotal + gst).toFixed(2));

              //  Prevent duplicates
              const dupeQ = query(
                collection(db, "bookedSlots"),
                where("date", "==", values.date),
                where("time", "==", values.time)
              );

              const dupeSnap = await withTimeout(getDocs(dupeQ), 12000);

              if (!dupeSnap.empty) {
                alert("That slot is already booked. Please choose another one.");
                return;
              }

              
              // Save booked slot
              console.log("Writing bookedSlots...");
              const slotRef = await withTimeout(
                addDoc(collection(db, "bookedSlots"), {
                  date: values.date,
                  time: values.time,
                  createdAt: serverTimestamp(),
                }),
                12000
              );
              console.log("bookedSlots saved:", slotRef.id);

              // Save booking
              console.log("Writing booking...");
              const bookingRef = await withTimeout(
                addDoc(collection(db, "bookings"), {
                  userId: user.uid,
                  email: user.email,

                  serviceId: values.serviceId,
                  service: serviceName,

                  subtotal,
                  gst,
                  total,

                  name: values.name,
                  date: values.date,
                  time: values.time,

                  status: "Pending",
                  createdAt: serverTimestamp(),
                }),
                12000
              );
              console.log("booking saved:", bookingRef.id);

              alert(`Booking submitted ✅ Total: $${total.toFixed(2)}`);

              resetForm();
              setSelectedDate("");
              setBookedTimes((prev) => [...prev, values.time]);
            } catch (err) {
              console.error("BOOKING ERROR:", err);

              const msg = String(err?.message || "");

              if (msg.includes("permission") || msg.includes("insufficient")) {
                alert(
                  "Booking failed: Firestore permission denied. Check Firestore Rules."
                );
              } else if (msg.includes("unauthorized-domain")) {
                alert(
                  "Booking failed: unauthorized domain. Add your Vercel domain in Firebase Auth settings."
                );
              } else if (msg.toLowerCase().includes("timed out")) {
                alert(
                  "Booking failed: timed out. Check Vercel env vars + Firebase config."
                );
              } else {
                alert(err?.message || "Booking failed. Check console for details.");
              }
            } finally {
              setSubmitting(false);
              console.log("SUBMIT END");
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          }) => {
            const chosen = services.find((s) => s.id === values.serviceId);
            const subtotal = Number(chosen?.price || 0);
            const gst = Number((subtotal * GST_RATE).toFixed(2));
            const total = Number((subtotal + gst).toFixed(2));

            return (
              <form
                onSubmit={handleSubmit}
                className="mt-6 bg-white rounded-2xl shadow-sm border border-rose-100 p-6 space-y-4"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Service
                  </label>

                  <select
                    name="serviceId"
                    value={values.serviceId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="">Select a service...</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — ${s.price}
                      </option>
                    ))}
                  </select>

                  {touched.serviceId && errors.serviceId && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.serviceId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Your Name
                  </label>
                  <input
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Full name"
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                  {touched.name && errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={values.date}
                    onChange={(e) => {
                      handleChange(e);
                      const newDate = e.target.value;
                      setSelectedDate(newDate);
                      setFieldValue("time", "");
                    }}
                    onBlur={handleBlur}
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                  {touched.date && errors.date && (
                    <p className="text-sm text-red-600 mt-1">{errors.date}</p>
                  )}
                </div>

                <SlotPicker
                  slots={slots}
                  selected={values.time}
                  loading={loadingSlots}
                  disabled={!values.date}
                  onSelect={(val) => setFieldValue("time", val)}
                />
                {touched.time && errors.time && (
                  <p className="text-sm text-red-600 mt-1">{errors.time}</p>
                )}

                <div className="border rounded-xl p-4 bg-rose-50/40">
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700 mt-1">
                    <span>GST (5%)</span>
                    <span className="font-semibold">${gst.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-gray-200 my-2" />
                  <div className="flex justify-between text-base">
                    <span className="font-extrabold text-gray-900">Total</span>
                    <span className="font-extrabold text-rose-700">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || loadingSlots}
                  className="w-full bg-rose-600 text-white py-2 rounded-lg font-semibold hover:bg-rose-700 transition disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting..." : "Submit Booking"}
                </button>
              </form>
            );
          }}
        </Formik>
      </section>

      <Footer />
    </main>
  );
}
