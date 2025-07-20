'use client'
import React from "react";
import { 
    TopBarContainer, 
    TopbarUserContainer, 
    TopbarNameContainer, 
    TopBarUserImage, 
    TopbarUserName, 
    TopbarUserRole 
} from "./styles";
import CircularProgress from '@mui/material/CircularProgress';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { Box } from "@mui/material";
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from "@/context/SidebarContext";

export function TopBar(): React.JSX.Element {
    const { user, isAuthenticated, loading } = useAuth();
    const { toggleSidebar } = useSidebar();
    
    if (loading) {
        return (
        <TopBarContainer>
            <Box className="menu-icon-container" onClick={toggleSidebar}>
                <MenuIcon/>
            </Box>
            <Box display="flex" justifyContent="flex-end" width="100%" pr={2}>
                <CircularProgress size={24} />
            </Box>
        </TopBarContainer>
        );
    }

    return (
        <TopBarContainer>
        <Box className="menu-icon-container" onClick={toggleSidebar}>
            <MenuIcon/>
        </Box>
        <TopbarUserContainer className="user-container">
            <TopBarUserImage>
            <AccountCircleIcon/>
            </TopBarUserImage>
            
            <TopbarNameContainer>
                {isAuthenticated && user?.full_name && (
                    <TopbarUserName>
                        {user.full_name}
                    </TopbarUserName>
                )}
                
                {isAuthenticated && user?.user_role && (
                    <TopbarUserRole>
                        {user.user_role}
                    </TopbarUserRole>
                )}
            </TopbarNameContainer>
        </TopbarUserContainer>
        </TopBarContainer>
    );
}