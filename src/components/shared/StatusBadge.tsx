import React from "react";

interface StatusBadgeProps {
  status:
    | "Pending"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled"
    | "In Stock"
    | "Low Stock"
    | "Out of Stock";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const badgeStyles = {
    Pending: "bg-yellow-50 text-amber-600 border-yellow-200/60",
    Processing: "bg-blue-50 text-blue-600 border-blue-100",
    Shipped: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Cancelled: "bg-rose-50 text-rose-600 border-rose-100",
    "In Stock": "bg-emerald-50 text-emerald-600 border-emerald-100",
    "Low Stock": "bg-amber-50 text-amber-600 border-amber-150",
    "Out of Stock": "bg-rose-50 text-rose-600 border-rose-100",
  };

  const defaultStyle = "bg-[#f5f5f5] text-[#757575] border-gray-150";
  const selectedStyle = badgeStyles[status] || defaultStyle;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-[9.5px] tracking-wider uppercase font-sans font-bold rounded-full border ${selectedStyle}`}
    >
      <span className="w-1 h-1 rounded-full bg-current mr-1.5 animate-pulse" />
      {status}
    </span>
  );
};

export default StatusBadge;
