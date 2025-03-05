"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { getAuthHeaders } from "@/hooks/useAuthHeaders";
import { MetricCard } from "../../components/MetricCard";
import { VisualCard } from "../../components/VisualCard";
import { Button } from "@/components/ui/button";

export default function DetectionDetailPage() {
  const router = useRouter();
  const params = useParams(); // ✅ Fix: Get detection_id from URL path
  const searchParams = useSearchParams();
  console.log("params", params);

  const detectionId = params.id; // ✅ Correct way to retrieve path params
  const timestamp = searchParams.get("timestamp");
  const species = searchParams.get("species");
  const cameraName = searchParams.get("camera_name");

  const [detection, setDetection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Detection ID:", detectionId); // Debugging log
  
    if (!detectionId) {
      setLoading(false);
      setError("No detection ID provided.");
      return;
    }
  
    const fetchAdditionalDetectionData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/detections/${detectionId}`,
          { headers: getAuthHeaders() }
        );
        console.log("API Response:", response.data); // Debugging log
        setDetection(response.data);
      } catch (error) {
        console.error("Error fetching detection details:", error);
        setError("Failed to load additional detection data.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchAdditionalDetectionData();
  }, [detectionId]);
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!detection) return null;

  // Bounding Box Overlay Styles
  const boundingBoxStyle: React.CSSProperties = {
    position: "absolute" as "absolute", // Explicitly cast
    left: `${detection.x_min * 100}%`,
    top: `${detection.y_min * 100}%`,
    width: `${(detection.x_max - detection.x_min) * 100}%`,
    height: `${(detection.y_max - detection.y_min) * 100}%`,
    border: "2px solid red",
    boxShadow: "0 0 10px red",
    backgroundColor: "rgba(255, 0, 0, 0.2)",
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* 🔙 Back Button */}
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        ← Back
      </Button>

      <h1 className="text-3xl font-bold tracking-tight">Detection Details</h1>

      {/* 🔹 Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Timestamp" value={new Date(timestamp!).toLocaleString()} />
        <MetricCard title="Species" value={species!} />
        <MetricCard title="Camera Name" value={cameraName!} />
        <MetricCard title="Confidence" value={`${(detection.confidence * 100).toFixed(2)}%`} />
      </div>

      {/* 🔹 Visuals Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Full Detection Image with Bounding Box Overlay */}
        <VisualCard title="Detection Image">
          <div className="relative inline-block">
            <img src={detection.image_url} alt="Detection Image" className="w-full rounded-md" />
            {/* Bounding Box Overlay */}
            <div style={boundingBoxStyle} />
          </div>
        </VisualCard>

        {/* Zoom-in View (Cropped) */}
        <VisualCard title="Zoom-in View">
          <div
            className="overflow-hidden rounded-md"
            style={{
              position: "relative",
              width: "100%",
              height: "auto",
              aspectRatio: "1 / 1",
            }}
          >
            <img
              src={detection.image_url}
              alt="Zoom-in Detection"
              className="absolute"
              style={{
                objectFit: "cover",
                position: "absolute",
                left: `${-detection.x_min * 100}%`,
                top: `${-detection.y_min * 100}%`,
                width: `${(detection.x_max - detection.x_min) * 100}%`,
                height: `${(detection.y_max - detection.y_min) * 100}%`,
              }}
            />
          </div>
        </VisualCard>
      </div>
    </div>
  );
}
