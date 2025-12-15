"use client";

export default function SlotPicker({ slots, selected, onSelect, loading }) {
  if (!selected) selected = "";

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700">
        Available Slots
      </label>

      {loading ? (
        <div className="mt-2 text-sm text-gray-500">Loading slots...</div>
      ) : (
        <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {slots.map((s) => {
            const disabled = s.isBooked;
            const active = selected === s.value;

            return (
              <button
                key={s.value}
                type="button"
                disabled={disabled}
                onClick={() => onSelect(s.value)}
                className={[
                  "px-3 py-2 rounded-lg text-sm font-semibold border transition",
                  active
                    ? "bg-rose-600 text-white border-rose-600"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-rose-50",
                  disabled ? "opacity-50 cursor-not-allowed line-through" : "",
                ].join(" ")}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        Booked slots are disabled.
      </p>
    </div>
  );
}
