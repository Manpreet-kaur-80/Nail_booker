import { Suspense } from "react";
import BookClient from "./BookClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-rose-50 flex items-center justify-center">
          <p className="text-gray-600 font-semibold">Loading booking page...</p>
        </main>
      }
    >
      <BookClient />
    </Suspense>
  );
}
