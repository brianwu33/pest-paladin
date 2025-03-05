"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { getAuthHeaders } from "@/hooks/useAuthHeaders";

export default function DetectionDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [detection, setDetection] = useState<any>(null);
  const [loading, setLoading] = useState(false); // TODO: Change this back to true
  const [error, setError] = useState("");

  const detectionId = searchParams.get("detection_id");
  const timestamp = searchParams.get("timestamp");
  const species = searchParams.get("species");
  const cameraName = searchParams.get("camera_name");

//   useEffect(() => {
//     const fetchDetectionDetail = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/detections/${detectionId}`,
//           { headers: getAuthHeaders() }
//         );
//         setDetection(response.data);
//       } catch (error) {
//         console.error("Error fetching detection details:", error);
//         setError("Failed to load detection details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (detectionId) {
//       fetchDetectionDetail();
//     }
//   }, [detectionId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold">Detection Details</h1>
      <p><strong>Timestamp:</strong> {timestamp}</p>
      <p><strong>Species:</strong> {species}</p>
      <p><strong>Camera Name:</strong> {cameraName}</p>
      {/* {detection && (
        <>
          <p><strong>Confidence:</strong> {detection.confidence}</p>
          <p><strong>Bounding Box:</strong> ({detection.x_min}, {detection.y_min}) → ({detection.x_max}, {detection.y_max})</p>
          <img src={detection.image_url} alt="Detection Image" className="mt-4 max-w-md" />
        </>
      )} */}
    </div>
  );
}
