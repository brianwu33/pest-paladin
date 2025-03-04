// app/layout.tsx
import type { Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import "./globals.css";
import Header from "./components/Header";
import AppSidebar from "./components/Sidebar";
import { AuthRedirect } from "./components/AuthRedirect";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Pest Paladine",
  description: "Protect Your Lovely Garden",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="flex h-screen">
          {/* Redirect Logic to Ensure Users are in the Right Place */}
          <AuthRedirect />

          <SidebarProvider>
            <div className="flex w-full">
              {/* Sidebar (Only for Signed In Users) */}
              <SignedIn>
                <AppSidebar />
              </SignedIn>

              {/* Main Content */}
              <div className="flex-1 flex flex-col">
                {/* Header should always be visible */}
                <Header />

                {/* Page Content */}
                <main className="flex-1 p-4">{children}</main>
              </div>
            </div>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
