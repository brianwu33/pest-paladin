"use client";

import { useEffect, useState } from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { BellIcon, CameraIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CameraPairingModal } from "./CameraPairingModal";

/**
 * Function to format the date/time
 */
function getFormattedDateTime() {
  const now = new Date();
  return now.toLocaleString(undefined, {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Header() {
  const { isSignedIn } = useUser();
  const [currentDateTime, setCurrentDateTime] = useState(
    getFormattedDateTime()
  );

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(getFormattedDateTime());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  // State to toggle the camera pairing modal
  const [showCameraModal, setShowCameraModal] = useState(false);

  return (
    <header className="flex justify-between items-center p-4 h-24 bg-white shadow-sm">
      {/* Left Side: Sidebar Trigger + Welcome Message */}
      <div className="flex items-center gap-4">
        <SignedIn>
          <SidebarTrigger className="p-2 rounded-md hover:bg-gray-200 transition w-12 h-12 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-700" />
          </SidebarTrigger>

          <div>
            <p className="font-semibold">Welcome Back!</p>
            <p className="text-sm text-gray-600">{currentDateTime}</p>
          </div>
        </SignedIn>

        <SignedOut>
          <Link href="/" className="font-bold text-lg">
            Pest Paladine
          </Link>
        </SignedOut>
      </div>

      {/* Right Side: Notification Button + Profile + Camera Pairing */}
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>

        <SignedIn>
          {/* Camera Pairing Button */}
          <button
            type="button"
            className="p-2 rounded-full hover:bg-gray-100 transition"
            onClick={() => setShowCameraModal(true)}
            aria-label="Manage Cameras"
          >
            <CameraIcon className="h-8 w-8 text-gray-600" />
          </button>

          {/* Notification Button */}
          {/* <button
            type="button"
            className="p-1 rounded-full hover:bg-gray-100 relative"
            aria-label="Notifications"
          >
            <BellIcon className="h-8 w-8 text-gray-600" />
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full" />
          </button> */}

          <UserButton appearance={{ elements: { avatarBox: "w-10 h-10" } }} />
        </SignedIn>
      </div>

      {/* Camera Pairing Modal */}
      {showCameraModal && <CameraPairingModal onClose={() => setShowCameraModal(false)} />}
    </header>
  );
}
