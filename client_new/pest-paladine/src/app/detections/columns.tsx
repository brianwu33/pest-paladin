"use client";

import { ColumnDef } from "@tanstack/react-table";

// Define the structure of Detection Data
export type DetectionData = {
  id: string;
  timestamp: string; // Date + Time
  species: string;
  duration: number; // Duration in seconds/minutes
  cameraName: string;
};

export const columns: ColumnDef<DetectionData>[] = [
  {
    accessorKey: "timestamp",
    header: "Timestamp",
  },
  {
    accessorKey: "species",
    header: "Species",
  },
  {
    accessorKey: "duration",
    header: "Duration (Seconds)",
  },
  {
    accessorKey: "cameraName",
    header: "Camera Name",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex gap-10">
        <button className="text-blue-500 hover:underline">View</button>
        <button className="text-red-500 hover:underline">Delete</button>
      </div>
    ),
  },
];
