"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

export function CameraPairingModal({ onClose }: { onClose: () => void }) {
  const [cameras, setCameras] = useState<{ camera_id: string; camera_name: string }[]>([]);
  const [cameraID, setCameraID] = useState("");
  const [cameraName, setCameraName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCameras();
  }, []);

  /**
   * 🔹 Fetch Paired Cameras (GET `/api/cameras`)
   * ✅ Authenticated via HttpOnly cookies
   */
  const fetchCameras = async () => {
    try {
      setError("");
      const response = await axios.get("/api/cameras", { withCredentials: true });
      setCameras(response.data.cameras); // Ensure backend response structure matches
    } catch (error) {
      console.error("Error fetching cameras:", error);
      setError("Failed to fetch paired cameras.");
    }
  };

  /**
   * 🔹 Pair a Camera (POST `/api/cameras/pair`)
   * ✅ Requires valid `cameraID` and `cameraName`
   */
  const pairCamera = async () => {
    if (!cameraID.trim() || !cameraName.trim()) {
      setError("Camera ID and Name are required.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await axios.post(
        "/api/cameras/pair",
        { cameraID, cameraName },
        { withCredentials: true }
      );
      setCameraID("");
      setCameraName("");
      await fetchCameras(); // Refresh list after pairing
    } catch (error: any) {
      console.error("Error pairing camera:", error);
      setError(error.response?.data?.error || "Failed to pair camera.");
    }
    setLoading(false);
  };

  /**
   * 🔹 Unpair a Camera (DELETE `/api/cameras/unpair/:cameraID`)
   * ✅ Requires valid `cameraID`
   */
  const unpairCamera = async (cameraID: string) => {
    setLoading(true);
    setError("");
    try {
      await axios.delete(`/api/cameras/unpair/${cameraID}`, { withCredentials: true });
      await fetchCameras(); // Refresh list after unpairing
    } catch (error: any) {
      console.error("Error unpairing camera:", error);
      setError(error.response?.data?.error || "Failed to unpair camera.");
    }
    setLoading(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Your Cameras</DialogTitle>
        </DialogHeader>

        {/* 🔴 Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* 🔹 Camera List */}
        <ul className="space-y-3">
          {cameras.length > 0 ? (
            cameras.map((camera) => (
              <li key={camera.camera_id} className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">{camera.camera_name}</span>
                <Button
                  variant="destructive"
                  onClick={() => unpairCamera(camera.camera_id)}
                  disabled={loading}
                >
                  {loading ? "Unpairing..." : "Unpair"}
                </Button>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No paired cameras.</p>
          )}
        </ul>

        {/* 🔹 Pair New Camera */}
        <div className="space-y-3 mt-4">
          <Input placeholder="Camera ID" value={cameraID} onChange={(e) => setCameraID(e.target.value)} />
          <Input placeholder="Camera Name" value={cameraName} onChange={(e) => setCameraName(e.target.value)} />
          <Button onClick={pairCamera} disabled={loading}>
            {loading ? "Pairing..." : "Pair Camera"}
          </Button>
        </div>

        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
