"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { MetricCard } from "@/components/MetricCard";
import { VisualCard } from "@/components/VisualCard";
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
  const { getToken } = useAuth(); // ✅ Get token from Clerk

  const [detection, setDetection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRead, setIsRead] = useState(false); // ✅ Track read status

  // 🔹 Fetch Detection Details
  useEffect(() => {
    if (!detectionId) {
      setLoading(false);
      setError("No detection ID provided.");
      return;
    }

    const fetchDetectionDetail = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/detections/${detectionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDetection(response.data);
        setIsRead(response.data.read); // ✅ Store read status
      } catch (error) {
        console.error("Error fetching detection details:", error);
        setError("Failed to load additional detection data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetectionDetail();
  }, [detectionId]);

  // 🔹 Mark as Read (On Page Load)
  useEffect(() => {
    const markAsRead = async () => {
      try {
        const token = await getToken();
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/detections/${detectionId}/read`,
          { read: true },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        console.error("Error marking detection as read:", error);
      }
    };

    if (detectionId && !isRead) {
      markAsRead();
    }
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!detection) return null;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        {/* 🔙 Back Button */}
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          ← Back
        </Button>

        <h1 className="mb-8 text-3xl font-bold tracking-tight">
          Detection Details
        </h1>

        {/* 🔹 Metrics Section */}
        <h2 className="mb-6 text-xl font-bold tracking-tight">Metrics</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={CalendarIcon}
            title="Timestamp"
            value={new Date(timestamp!).toLocaleString()}
          />
          <MetricCard icon={PawPrintIcon} title="Species" value={species!} />
          <MetricCard
            icon={CameraIcon}
            title="Camera Name"
            value={cameraName!}
          />
          <MetricCard
            icon={PercentIcon}
            title="Confidence"
            value={`${(detection.confidence * 100).toFixed(2)}%`}
          />
        </div>

        {/* 🔹 Visuals Section (Original & Cropped Images Side by Side) */}
        <h2 className="mb-6 mt-12 text-xl font-bold tracking-tight">
          Detection Analysis
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Full Detection Image */}
          <VisualCard
            title="Detection Image"
            description="Original image captured by the camera."
          >
            <img
              src={detection.image_url}
              alt="Detection Image"
              className="w-full h-full rounded-md object-contain"
            />
          </VisualCard>

          {/* Cropped Image */}
          <VisualCard
            title="Cropped Detection"
            description="Cropped section of the original image focusing on the detected object."
          >
            <img
              src={detection.cropped_image_url}
              alt="Cropped Detection Image"
              className="w-full h-full rounded-md object-contain"
            />
          </VisualCard>
        </div>
      </div>
    </div>
  );
}
