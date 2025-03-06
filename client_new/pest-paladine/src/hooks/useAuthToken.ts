// Deprecated

"use client"; // ✅ Ensure it's a client-side hook

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function useAuthToken() {
  const { getToken } = useAuth(); // ✅ `useAuth()` is correctly called inside a hook

  useEffect(() => {
    const fetchToken = async () => {
      const newToken = await getToken();
      if (newToken) {
        Cookies.set("jwt_token", newToken, { secure: true, sameSite: "Strict", expires: 1 / 24 });
      }
    };

    fetchToken();

    // Set up automatic token refresh every 55 minutes
    const interval = setInterval(fetchToken, 55 * 60 * 1000);

    return () => clearInterval(interval); // Cleanup
  }, []);
}
