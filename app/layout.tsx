import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { Navbar } from "@/components/Navbar/NavBar";
import { AlertProvider } from "@/components/global/AlertDialog";
import { ConfirmDialog } from "@/components/global/ConfirmDialog";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "ARIT SERVICE",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AlertProvider>
            <ConfirmDialog>
              <SidebarProvider>
                <AppSidebar />
                <main className="w-screen flex flex-col overflow-hidden">
                  <Navbar />
                  <div className="flex-grow">{children}</div>
                </main>
              </SidebarProvider>
            </ConfirmDialog>
          </AlertProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
