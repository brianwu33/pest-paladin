"use client";

import { useEffect } from "react";
import useAuthToken from "@/hooks/useAuthToken";

export default function AuthHandler() {
    useAuthToken();

  return null; // Doesn't render anything
}
