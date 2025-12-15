"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { auth } from "../data/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

const ADMIN_EMAIL = "manpreetkaurandhawa@gmail.com";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <nav className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-xl text-rose-700">
          Nail-Bookr 💅
        </Link>

        <div className="flex items-center gap-2 text-sm">
          <Link className="px-3 py-2 rounded-lg hover:bg-rose-50" href="/services">
            Services
          </Link>

          <Link className="px-3 py-2 rounded-lg hover:bg-rose-50" href="/book">
            Book
          </Link>

          <Link className="px-3 py-2 rounded-lg hover:bg-rose-50" href="/about">
            About
          </Link>

          <Link className="px-3 py-2 rounded-lg hover:bg-rose-50" href="/contact">
            Contact
          </Link>

          {/* Logged-in user links */}
          {user && (
            <Link className="px-3 py-2 rounded-lg hover:bg-rose-50" href="/my-bookings">
              My Bookings
            </Link>
          )}

          {/* Auth buttons */}
          {!user ? (
            <>
              <Link className="px-3 py-2 rounded-lg hover:bg-rose-50" href="/signup">
                Sign Up
              </Link>

              <Link
                className="px-3 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                href="/login"
              >
                Login
              </Link>
            </>
          ) : (
            <>
              {/* Admin-only Dashboard */}
              {isAdmin && (
                <Link
                  className="ml-2 px-3 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                  href="/dashboard"
                >
                  Dashboard
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
