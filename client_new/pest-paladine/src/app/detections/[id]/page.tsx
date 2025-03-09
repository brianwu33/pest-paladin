"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { MetricCard } from "../../components/MetricCard";
import { VisualCard } from "../../components/VisualCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Import ShadCN Textarea for notes
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
  const [note, setNote] = useState(""); // State for user note

  useEffect(() => {
    if (!detectionId) {
      setLoading(false);
      setError("No detection ID provided.");
      return;
    }

    const fetchDetectionDetail = async () => {
      try {
        const token = await getToken(); // ✅ Get auth token
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/detections/${detectionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ Use token in headers
            },
          }
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

        {/* 🔹 Visuals & Notes Section (Side by Side) */}
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

          <VisualCard
            title="Notes"
            description=""
          >
            <Textarea
              className="w-full p-4 border rounded-md h-full"
              placeholder="Add any notes or observations about this detection..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </VisualCard>

          {/* Notes Section (Now on the right side) */}
          {/* <div className="flex flex-col">
            <h2 className="text-xl font-bold tracking-tight mb-4">Notes</h2>
            <Textarea
              className="w-full p-4 border rounded-md h-full"
              placeholder="Add any notes or observations about this detection..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
}
