// PackageCardComponent.tsx
'use client';

import React from 'react';
import { PackageCard, PackageTitle, PackageDetails, PackagePrice } from './styles';
import Image from 'next/image';
import { icons } from '@/icons';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText 
} from '@mui/material';
import { formatCurrency } from '@/utils/billing';

export interface DetailsListProps {
    details: string;
}

interface PackageCardProps {
    packageItem: {
        id: number;
        package_name: string;
        package_details: string;
        package_details_list?: DetailsListProps[];
        package_price: string;
    };
}

export function PackageCardComponent({ packageItem }: PackageCardProps) {
    // Handle both string-based details and object-based details list
    const renderDetails = () => {
        // If we have a details list array
        if (packageItem.package_details_list && packageItem.package_details_list.length > 0) {
            return (
                <List>
                    {packageItem.package_details_list.map((item, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={item.details} />
                        </ListItem>
                    ))}
                </List>
            );
        }
        
        // If we have a string with details
        if (packageItem.package_details) {
            return (
                <Typography component="p">
                    {packageItem.package_details}
                </Typography>
            );
        }
        
        // Fallback if no details are available
        return (
            <Typography component="p" sx={{ display: 'none' }}>
                No details provided
            </Typography>
        );
    };

    return (
        <PackageCard>
            <Box sx={{ width: '100%' }}>
                <PackageTitle>
                    <Image src={icons.packageIconBlack} alt="Package" width={35} height={35} />
                    <Typography component="h2">
                        {packageItem.package_name}
                    </Typography>
                </PackageTitle>
                <PackageDetails>
                    {renderDetails()}
                </PackageDetails>
            </Box>
            <PackagePrice>
                <Typography component="p">
                    {formatCurrency(packageItem.package_price)}
                </Typography>
            </PackagePrice>
        </PackageCard>
    );
}