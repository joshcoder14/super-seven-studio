import React from "react";
import { NavBar } from "@/components/SideBar";
import { TopBar } from "@/components/topbar";
import { type ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

  export function NavLayout({ children }: LayoutProps): React.JSX.Element {
    return (
      <div 
        style={{ 
          display: "flex", 
          height: "auto", 
          minHeight: "100vh" 
        }}>
        
        <div style={{ flexShrink: 1 }}>
          <NavBar />
        </div>
  
        <div style={{ flex: 1, background: "#f7faf5" }}>
          <AuthProvider>
            <TopBar/>
            {children}
          </AuthProvider>
        </div>
      </div>
    );
  }
  