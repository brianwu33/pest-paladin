"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getAuthHeaders } from "@/hooks/useAuthHeaders";

export type Detection = {
  detection_id: string;
  timestamp: string;
  species: string;
  camera_name: string;
};

export function useDetectionColumns() {
  const router = useRouter();

  const handleView = (detection: Detection) => {
    console.log("Viewing detection:", detection); // Debugging log
    router.push(
      `/detections/${detection.detection_id}?timestamp=${encodeURIComponent(
        detection.timestamp
      )}&species=${encodeURIComponent(
        detection.species
      )}&camera_name=${encodeURIComponent(detection.camera_name)}`
    );
  };

  const handleDelete = async (detection: Detection) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this detection?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/detections/${detection.detection_id}`,
        { headers: getAuthHeaders() }
      );
      toast.success("Detection deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting detection:", error);
      toast.error("Failed to delete detection");
    }
  };

  const columns: ColumnDef<Detection>[] = [
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: ({ row }) => new Date(row.getValue("timestamp")).toLocaleString(),
    },
    {
      accessorKey: "species",
      header: "Species",
    },
    {
      accessorKey: "camera_name",
      header: "Camera Name",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const detection = row.original;

        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleView(detection)}>
              View
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(detection)}>
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return columns;
}
