import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { GroupProvider } from "@/contexts/GroupContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Goalsaver - Community Save-Up Platform",
  description: "Save together with your community to reach common goals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <NotificationProvider>
            <GroupProvider>
              {children}
              <Toaster position="top-right" />
            </GroupProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
