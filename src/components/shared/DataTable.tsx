import React from "react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string | number;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = "No administrative data found matching active queries.",
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-hidden border border-[#E8E1D3] rounded-2xl bg-white shadow-xs">
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto border-collapse text-left text-xs font-sans">
          <thead>
            <tr className="bg-[#1F4D3A]/5 border-b border-[#E8E1D3]">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-6 py-4.5 font-bold uppercase tracking-wider text-[#1F4D3A] text-[10px] select-none ${
                    col.className || ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors hover:bg-[#f5f5f5]/50 ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((col, index) => {
                    const content =
                      typeof col.accessor === "function"
                        ? col.accessor(row)
                        : (row[col.accessor] as React.ReactNode);

                    return (
                      <td
                        key={index}
                        className={`px-6 py-4 text-[#2C2C2C] text-xs font-light whitespace-nowrap ${
                          col.className || ""
                        }`}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-[#757575] font-light"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
