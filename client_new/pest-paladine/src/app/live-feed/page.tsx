// app/live-feed/page.tsx
// export default function LiveFeedPage() {
//     return (
//       <div className="p-8">
//         <h1 className="text-3xl font-bold">Live Feed</h1>
//         <p>This is the Live Feed page.</p>
//       </div>
//     );
// }

"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader, PauseCircle, RefreshCw, VolumeX } from "lucide-react";

const cameras = [
  { id: "1", name: "Backyard Cam", streamUrl: "/streams/backyard" },
  { id: "2", name: "Front Yard Cam", streamUrl: "/streams/front-yard" },
  { id: "3", name: "Driveway Cam", streamUrl: "/streams/driveway" },
];

export default function LiveStreamingPage() {
  const [selectedCamera, setSelectedCamera] = useState(cameras[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCameraChange = (id: string) => {
    const camera = cameras.find((cam) => cam.id === id);
    if (camera) {
      setSelectedCamera(camera);
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1000); // Simulate loading delay
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

        {/* Camera Status Indicator */}
        <span
          className={`text-sm font-semibold px-3 py-1 rounded-md ${
            isLoading ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"
          }`}
        >
          {isLoading ? "Loading..." : "Online"}
        </span>
      </div>

      {/* Video Stream Container */}
      <div className="relative w-full max-w-6xl h-[600px] bg-black rounded-lg overflow-hidden flex justify-center items-center">
        {isLoading ? (
          <Loader className="w-12 h-12 animate-spin text-gray-500" />
        ) : (
          <video
            src={selectedCamera.streamUrl} // Replace with actual streaming source
            controls
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Stream Controls */}
      <div className="mt-4 flex gap-4">
        <Button variant="outline">
          <PauseCircle className="w-5 h-5 mr-2" /> Pause
        </Button>
        <Button variant="outline">
          <VolumeX className="w-5 h-5 mr-2" /> Mute
        </Button>
        <Button variant="outline" onClick={() => setIsLoading(true)}>
          <RefreshCw className="w-5 h-5 mr-2" /> Refresh
        </Button>
      </div>
    </div>
  );
}
