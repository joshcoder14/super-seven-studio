import type { Metadata } from "next";
import "./globals.css";
import { NavLayout } from "./nav-layout";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { AuthProvider } from '@/context/AuthContext';
import { SidebarProvider } from '@/context/SidebarContext';

// config.autoAddCss = false

export const metadata: Metadata = {
  title: "SUPER SEVEN STUDIO",
  description: "Super Seven Studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        
        <AuthProvider>
          <SidebarProvider>
            <NavLayout>{children}</NavLayout>
          </SidebarProvider>
        </AuthProvider>
        
      </body>
    </html>
  );
}
