"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { DataTablePagination } from "./pagination";
import { getAuthHeaders } from "@/hooks/useAuthHeaders";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/detections";

export default function DetectionsPage() {
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Number of detections per page

  // Fetch paginated detections
  const fetchDetections = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${API_BASE_URL}?page=${page}&limit=${pageSize}`,
        {
          headers: getAuthHeaders(),
        }
      );

      setDetections(response.data.detections);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (err) {
      console.error("Error fetching detections:", err);
      setError("Failed to load detections.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDetections(currentPage);
  }, []);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold">Detections</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-4">
        <DataTable columns={columns} data={detections} />
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => fetchDetections(page)}
        />
      </div>
    </div>
  );
}
