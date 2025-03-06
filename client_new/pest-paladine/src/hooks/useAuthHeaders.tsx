// Deprecated
"use client"; // ✅ Ensure it's a client-side hook

import Cookies from "js-cookie";

export const getAuthHeaders = () => {
  const token = Cookies.get("jwt_token");
  console.log("🔹 Token: " + token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};
