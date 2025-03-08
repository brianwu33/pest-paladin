"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

// Load API Base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/cameras";

export function CameraPairingModal({ onClose }: { onClose: () => void }) {
  const { getToken } = useAuth(); // ✅ Get token from Clerk
  const [cameras, setCameras] = useState<
    { camera_id: string; camera_name: string }[]
  >([]);
  const [cameraID, setCameraID] = useState("");
  const [cameraName, setCameraName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCameras();
  }, []);

  /**
   * 🔹 Fetch Paired Cameras (GET `${API_BASE_URL}`)
   * ✅ Authenticated via JWT in Authorization header
   */
  const fetchCameras = async () => {
    try {
      setError("");
      console.log("API Request:", API_BASE_URL);
      const token = await getToken(); // ✅ Get auth token

      const response = await axios.get(`${API_BASE_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Use token in headers
        },
      });

      setCameras(response.data.cameras);
    } catch (error) {
      console.error("Error fetching cameras:", error);
      setError("Failed to fetch paired cameras.");
    }
  };

  /**
   * 🔹 Pair a Camera (POST `${API_BASE_URL}/pair`)
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
      const token = await getToken(); // ✅ Get auth token

      await axios.post(
        `${API_BASE_URL}/pair`,
        { cameraID, cameraName },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Use token in headers
          },
        }
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
   * 🔹 Unpair a Camera (DELETE `${API_BASE_URL}/unpair/:cameraID`)
   * ✅ Requires valid `cameraID`
   */
  const unpairCamera = async (cameraID: string) => {
    setLoading(true);
    setError("");

    try {
      const token = await getToken(); // ✅ Get auth token

      await axios.delete(`${API_BASE_URL}/unpair/${cameraID}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Use token in headers
        },
      });

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
              <li
                key={camera.camera_id}
                className="flex justify-between items-center border-b pb-2"
              >
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
          <Input
            placeholder="Camera ID"
            value={cameraID}
            onChange={(e) => setCameraID(e.target.value)}
          />
          <Input
            placeholder="Camera Name"
            value={cameraName}
            onChange={(e) => setCameraName(e.target.value)}
          />
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
