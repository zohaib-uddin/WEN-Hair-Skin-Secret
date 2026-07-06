import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}) => {
  if (totalPages <= 1) return null;

  const startItem = itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : null;
  const endItem =
    itemsPerPage && totalItems
      ? Math.min(currentPage * itemsPerPage, totalItems)
      : null;

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-[#e5e5e5] px-6 bg-white font-sans text-xs">
      {startItem && endItem && totalItems ? (
        <span className="text-[#757575] font-light select-none">
          Showing{" "}
          <span className="font-semibold text-[#2C2C2C]">{startItem}</span> to{" "}
          <span className="font-semibold text-[#2C2C2C]">{endItem}</span> of{" "}
          <span className="font-semibold text-[#2C2C2C]">{totalItems}</span>{" "}
          entries
        </span>
      ) : (
        <div className="hidden sm:block" />
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-[#e5e5e5] hover:border-[#1F4D3A] rounded-xl text-[#757575] hover:text-[#1F4D3A] disabled:opacity-40 disabled:hover:border-gray-250 disabled:hover:text-[#757575] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9.5 h-9.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              currentPage === page
                ? "bg-[#1F4D3A] hover:bg-[#153427] border-[#1F4D3A] text-[#F7F2EA]"
                : "bg-white border-[#e5e5e5] hover:border-[#1F4D3A] text-[#2C2C2C]"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-[#e5e5e5] hover:border-[#1F4D3A] rounded-xl text-[#757575] hover:text-[#1F4D3A] disabled:opacity-40 disabled:hover:border-gray-250 disabled:hover:text-[#757575] transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
