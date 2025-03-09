"use client";

import { useState, useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader, PauseCircle, RefreshCw, VolumeX } from "lucide-react";

const cameras = [
  { id: "1", name: "Garden", streamUrl: "ws://localhost:8765" },
];

export default function LiveStreamingPage() {
  const [selectedCamera, setSelectedCamera] = useState(cameras[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const handleCameraChange = (id: string) => {
    const camera = cameras.find((cam) => cam.id === id);
    if (camera) {
      setSelectedCamera(camera);
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1000); // Simulate loading delay
    }
  };

  // Establish WebSocket Connection
  useEffect(() => {
    // Close any existing WebSocket connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    // Connect to WebSocket
    const ws = new WebSocket(selectedCamera.streamUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log(`WebSocket connected to ${selectedCamera.streamUrl}`);
    };

    ws.onmessage = (event) => {
      const imgSrc = `data:image/jpeg;base64,${event.data}`;
      setImageSrc(imgSrc);
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    return () => {
      ws.close();
    };
  }, [selectedCamera]);

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
          <img src={imageSrc || ""} alt="Live Stream" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Stream Controls */}
      <div className="mt-4 flex gap-4">
        <Button variant="outline" onClick={() => wsRef.current?.close()}>
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

