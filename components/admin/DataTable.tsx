"use client";

import React from "react";

interface Column<T> {
  header: string;
  renderCell: (item: T, index: number) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T, index: number) => string | number;
  emptyStateMessage?: string;
}

export default function DataTable<T>({
  data,
  columns,
  keyExtractor,
  emptyStateMessage = "No matching records found."
}: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/75 select-none">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400 font-sans ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 font-sans text-xs">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 font-medium">
                  {emptyStateMessage}
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr key={keyExtractor(item, idx)} className="hover:bg-gray-50/50 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`px-6 py-4 whitespace-nowrap text-gray-750 ${col.className || ""}`}>
                      {col.renderCell(item, idx)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
