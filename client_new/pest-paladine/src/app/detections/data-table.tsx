"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-lg border border-gray-200 shadow-sm">
      <Table className={`w-full text-lg`}>
        {/* Table Header */}
        <TableHeader className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b border-gray-300">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="px-6 py-4 text-left text-gray-700 font-semibold text-lg">
                  {header.isPlaceholder
                    ? null // ✅ FIX: Remove empty placeholders
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        {/* Table Body */}
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-gray-50 transition">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-6 py-5 text-gray-800 text-lg">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              {/* ✅ FIX: Ensure no extra whitespace between TableCell elements */}
              <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                No detections found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
