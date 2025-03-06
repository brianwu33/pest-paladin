"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { getAuthHeaders } from "@/hooks/useAuthHeaders";
import { MetricCard } from "../../components/MetricCard";
import { VisualCard } from "../../components/VisualCard";
import { Button } from "@/components/ui/button";
import {
  CameraIcon,
  CalendarIcon,
  PawPrintIcon,
  PercentIcon,
} from "lucide-react";

export default function DetectionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const detectionId = params.id;
  const timestamp = searchParams.get("timestamp");
  const species = searchParams.get("species");
  const cameraName = searchParams.get("camera_name");

  const [detection, setDetection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!detectionId) {
      setLoading(false);
      setError("No detection ID provided.");
      return;
    }

    const fetchDetectionDetail = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/detections/${detectionId}`,
          { headers: getAuthHeaders() }
        );
        setDetection(response.data);
      } catch (error) {
        console.error("Error fetching detection details:", error);
        setError("Failed to load additional detection data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetectionDetail();
  }, [detectionId]);

  useEffect(() => {
    if (detection && detection.image_url) {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Ensure CORS is handled for external images
      img.src = detection.image_url;

      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Get bounding box dimensions from API response
        const { x_min, y_min, x_max, y_max } = detection;
        const cropWidth = x_max - x_min;
        const cropHeight = y_max - y_min;

        // Set canvas size based on crop dimensions
        canvas.width = cropWidth;
        canvas.height = cropHeight;

        // Draw the cropped image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          img,
          x_min, y_min, cropWidth, cropHeight, // Crop from source
          0, 0, cropWidth, cropHeight // Draw at full size
        );
      };
    }
  }, [detection]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!detection) return null;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        {/* 🔙 Back Button */}
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          ← Back
        </Button>

        <h1 className="mb-8 text-3xl font-bold tracking-tight">Detection Details</h1>

        {/* 🔹 Metrics Section */}
        <h2 className="mb-6 text-xl font-bold tracking-tight">Metrics</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={CalendarIcon} title="Timestamp" value={new Date(timestamp!).toLocaleString()} />
          <MetricCard icon={PawPrintIcon} title="Species" value={species!} />
          <MetricCard icon={CameraIcon} title="Camera Name" value={cameraName!} />
          <MetricCard icon={PercentIcon} title="Confidence" value={`${(detection.confidence * 100).toFixed(2)}%`} />
        </div>

        {/* 🔹 Visuals Section */}
        <h2 className="mb-6 mt-12 text-xl font-bold tracking-tight">Visuals</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Full Detection Image */}
          <VisualCard title="Detection Image" description="Original image captured by the camera.">
            <img src={detection.image_url} alt="Detection Image" className="w-full h-full rounded-md object-contain" />
          </VisualCard>

          {/* Cropped Zoom-in View (Canvas) */}
          <VisualCard title="Zoom-in View" description="Close-up of the detected species.">
            <canvas ref={canvasRef} className="rounded-md w-full h-auto"></canvas>
          </VisualCard>
        </div>
      </div>
    </div>
  );
}
