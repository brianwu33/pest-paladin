"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const cameras = [
  { id: "550e8400-e29b-41d4-a716-446655440000", name: "Main Camera", streamUrl: "http://localhost:3003/video_feed" },
];
/*
const cameras = [
  { id: "550e8400-e29b-41d4-a716-446655440000", name: "Main Camera", streamUrl: "http://localhost:3003/video_feed" }, // for 
];
*/
export default function LiveStreamingPage() {
  const [selectedCamera, setSelectedCamera] = useState(cameras[0]);

  const handleCameraChange = (id: string) => {
    const camera = cameras.find((cam) => cam.id === id);
    if (camera) {
      setSelectedCamera(camera);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl py-10">
      <h1 className="text-2xl font-bold mb-6">Live Streaming</h1>

      {/* Camera Selection */}
      <div className="mb-4 flex items-center gap-4">
        <Select onValueChange={handleCameraChange} defaultValue={selectedCamera.id}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select Camera" />
          </SelectTrigger>
          <SelectContent>
            {cameras.map((camera) => (
              <SelectItem key={camera.id} value={camera.id}>
                {camera.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Video Stream Container */}
      <div className="relative w-full max-w-6xl h-[600px] bg-black rounded-lg overflow-hidden flex justify-center items-center">
        <img src={selectedCamera.streamUrl} alt="Live Stream" className="w-full h-full object-cover" />
      </div>

      {/* Stream Controls */}
      <div className="mt-4 flex gap-4">
        <Button variant="outline" onClick={() => setSelectedCamera({ ...selectedCamera, streamUrl: `${selectedCamera.streamUrl}?t=${Date.now()}` })}>
          <RefreshCw className="w-5 h-5 mr-2" /> Refresh Stream
        </Button>
      </div>
    </div>
  );
}
