export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 text-center">
        {/* Brand */}
        <h3 className="text-lg font-semibold  text-rose-700 mb-2">
          Nail-Bookr
        </h3>

        <p className="text-sm  text-gray-500 mb-4">
          Professional nail services in Calgary
        </p>

        {/* Copyright */}
        <p className="text-xs text-gray-400">
          @ {new Date().getFullYear()} Nail-Bookr — Calgary. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
