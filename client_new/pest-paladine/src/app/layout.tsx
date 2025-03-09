// Refactored layout.tsx
import type { Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import "./globals.css";
import { AuthRedirect } from "./AuthRedirect";

export const metadata: Metadata = {
  title: "Pest Paladine",
  description: "Protect Your Lovely Garden",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/logo.svg" />
        </head>
        <body className="flex h-screen items-center justify-center">
          <AuthRedirect />

          {/* Main Content */}
          <div className="w-full mx-auto p-4">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
