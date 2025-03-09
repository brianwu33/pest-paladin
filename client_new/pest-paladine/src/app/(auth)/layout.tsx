import { SignedIn } from "@clerk/nextjs";
import Header from "./Header";
import AppSidebar from "./Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <SignedIn>
      <SidebarProvider>
        <div className="flex w-full h-screen">
          {/* Sidebar */}
          <AppSidebar aria-label="Sidebar Navigation"/>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <Header aria-label="Header Navigation"/>
            
            {/* Page Content */}
            <main className="flex-1 p-4">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </SignedIn>
  );
}