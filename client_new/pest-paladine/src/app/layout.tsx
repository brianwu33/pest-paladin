import type { Metadata } from "next";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import "./globals.css";
import Header from "./components/Header";
import AppSidebar from "./components/Sidebar";
import { AuthRedirect } from "./components/AuthRedirect";
import { SidebarProvider } from "@/components/ui/sidebar";

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
        <body className="flex h-screen">
          {/* Redirect Logic */}
          <AuthRedirect />

          <SidebarProvider>
            <div className="flex w-full">
              {/* Sidebar (Only for Signed In Users) */}
              <SignedIn>
                <AppSidebar aria-label="Sidebar Navigation" />
              </SignedIn>

              {/* Main Content */}
              <div className="flex-1 flex flex-col">
                {/* Header (Only for Signed In Users) */}
                <SignedIn>
                  <Header aria-label="Header Navigation" />
                </SignedIn>

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
