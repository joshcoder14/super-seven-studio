import type { Metadata } from "next";
import "./globals.css";
import { NavLayout } from "./nav-layout";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { AuthProvider } from '@/context/AuthContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { LoadingProvider } from '@/context/LoadingContext';

// config.autoAddCss = false

// export const metadata: Metadata = {
//   title: "SUPER SEVEN STUDIO",
//   description: "Super Seven Studio",
// };

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
            <LoadingProvider>
              <NavLayout>{children}</NavLayout>
            </LoadingProvider>
          </SidebarProvider>
        </AuthProvider>
        
      </body>
    </html>
  );
}
