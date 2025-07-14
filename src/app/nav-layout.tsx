import React from "react";
import { type ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { Box } from "@mui/material";
import NavigationProgress from '@/components/NavigationProgress';

interface LayoutProps {
  children: ReactNode;
}

  export function NavLayout({ children }: LayoutProps): React.JSX.Element {
    return (
      <Box 
        style={{ 
          display: "flex", 
          height: "100%", 
          background: "#f7faf5"
        }}>
          
        <AuthProvider>
          <NavigationProgress />
          {children}
        </AuthProvider>
      </Box>
    );
  }
  