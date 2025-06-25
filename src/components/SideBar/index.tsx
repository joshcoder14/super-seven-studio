"use client";
import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { SideBarContainer } from './styles'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HouseIcon from '@mui/icons-material/House';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PaymentsIcon from '@mui/icons-material/Payments';
import RateReviewIcon from '@mui/icons-material/RateReview';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import {paths} from '@/paths'
import Link from 'next/link';
import { useRouter, usePathname  } from 'next/navigation';
import Swal from 'sweetalert2';
import { useAuth } from '@/context/AuthContext'

interface MenuItem {
    label: string;
    link: string;
    icon: React.ReactNode;
    type: 'menu' | 'bottom' | 'separator';
}

export function NavBar(): React.JSX.Element {
    const router = useRouter();
    const pathname = usePathname(); // safe for SSR
    const [activeItem, setActiveItem] = useState<string>(pathname);
    const { logout, user } = useAuth()

    useEffect(() => {
        setActiveItem(pathname); // update when pathname changes
    }, [pathname]);

    // const location = window.location.pathname;

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault()

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will be logged out of the system.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!',
            allowOutsideClick: false,
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                try {
                    await logout()
                    return true
                } catch (error) {
                    Swal.showValidationMessage('Logout failed. Please try again.')
                    return false
                }
            }
        })

        if (result.isConfirmed) {
            await Swal.fire({
                title: 'Logged out!',
                text: 'You have been successfully logged out.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            })
        }
    }

    const handleClick = (link: string) => {
        setActiveItem(link);
        router.push(link);
    }

    const allMenuItems: MenuItem[] = [
        {
            label: 'Home',
            link: paths.home,
            icon: <HouseIcon />,
            type: 'menu'
        },
        {
            label: 'Accounts',
            link: paths.accounts,
            icon: <GroupOutlinedIcon />,
            type: 'menu'
        },
        {
            label: 'Booking',
            link: paths.booking,
            icon: <CalendarMonthIcon />,
            type: 'menu'
        },
        {
            label: 'Workload',
            link: paths.workload,
            icon: <ListAltIcon />,
            type: 'menu'
        },
        {
            label: 'Package',
            link: paths.package,
            icon: <CardGiftcardIcon />,
            type: 'menu'
        },
        {
            label: 'Billing',
            link: paths.billing,
            icon: <PaymentsIcon />,
            type: 'menu'
        },
        {
            label: 'Feedback',
            link: paths.feedback,
            icon: <RateReviewIcon />,
            type: 'menu'
        },
        {
            label: 'Reports',
            link: paths.reports,
            icon: <StackedBarChartIcon />,
            type: 'menu'
        },
        {
            type: 'separator',
            label: '',
            link: '#', // Dummy link for separator
            icon: null
        },
        {
            label: 'Settings',
            link: paths.settings,
            icon: <SettingsIcon />,
            type: 'bottom'
        },
        {
            label: 'Logout',
            link: '#',
            icon: <PowerSettingsNewIcon />,
            type: 'bottom'
        },
    ];

    // Filter menu items based on user role
    const filteredMenuItems = allMenuItems.filter((item) => {
        if (item.type === 'separator') return true; // Always show separators
        if (item.label === 'Settings') return true; // Always show settings
        if (item.label === 'Logout') return true; // Always show logout
        // Show Feedback item only for Owner role
        // if (user?.user_role === 'Owner') return item.label === 'Feedback';

        if (user?.user_role === 'Client') return ['Home', 'Booking', 'Package', 'Billing'].includes(item.label);
        // For Photographer and Editor, show only Home, Workload
        if (user?.user_role === 'Photographer' || user?.user_role === 'Editor') return ['Home', 'Workload'].includes(item.label);
        if (user?.user_role === 'Owner') return true;
        // if user is Client, hide the Feedback and show the rest
        if (user?.user_role === 'Client') return !['Feedback'].includes(item.label);

        // For other roles (admin, secretary, etc.), show all items
        return true;
    });

    const favIcon = '/assets/icons/favicon.svg';
    const logo = '/assets/icons/logo.svg';

    return (
        <SideBarContainer className="navbar">
            <Box className="logo-container">
                <img src={favIcon} alt="logo" />
                <img src={logo} alt="logo" />
            </Box>
            <Box className="menu-items-container">
                {filteredMenuItems.map((item, index) => {
                    if (item.type === 'separator') {
                        return <hr key={`separator-${index}`} className='side-bar-horizontal-rule'/>;
                    }
                    
                   const className = `menu-item ${activeItem === item.link ? 'active' : ''}`;

                    if (item.label === 'Logout') {
                        return (
                            <a 
                                href="#"
                                className={className}  
                                key={item.label}
                                onClick={handleLogout}
                            >
                                {item.icon}
                                <p>{item.label}</p>
                            </a>
                        );
                    }
                    
                    return (
                        <Link 
                            href={item.link} 
                            className={className}  
                            key={item.label}
                            onClick={(e) => {
                                e.preventDefault();
                                handleClick(item.link);
                            }}
                        >
                            {item.icon}
                            <p>{item.label}</p>
                        </Link>
                    );
                })}
            </Box>
        </SideBarContainer>
    )
}