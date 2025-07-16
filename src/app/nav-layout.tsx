import React from "react";
import { type ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { Box } from "@mui/material";
import Preloader from "@/components/Preloader";

interface LayoutProps {
  children: ReactNode;
}

  export function NavLayout({ children }: LayoutProps): React.JSX.Element {
    return (
      <Box 
        style={{ 
          display: "flex",
          width: "100%", 
          height: "100%", 
          background: "#f7faf5"
        }}>
          
        <AuthProvider>
          <Preloader/>
          {children}
        </AuthProvider>
      </Box>
    );
  }
  