export default function StatusBadge({ status }) {
  const base = "px-2 py-1 rounded-full text-xs font-semibold border";
  const map = {
    Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Accepted: "bg-green-50 text-green-700 border-green-200",
    Declined: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`${base} ${map[status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
      {status}
    </span>
  );
}
