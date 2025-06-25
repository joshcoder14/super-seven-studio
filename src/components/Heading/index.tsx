'use client';

import React from 'react';
import { Heading } from "./styles";
import { Box, Typography } from "@mui/material";
import { paths } from '@/paths';
import { usePathname } from 'next/navigation';

// Create a mapping between paths and their display titles
const pathTitles: Record<string, string> = {
  [paths.home]: "Dashboard",
  [paths.accounts]: "Accounts",
  [paths.booking]: "Booking",
  [paths.workload]: "Workload",
  [paths.workloadView]: "Workload",
  [paths.package]: "Package",
  [paths.billing]: "Billing",
  [paths.feedback]: "Feedback",
  [paths.reports]: "Reports",
  [paths.settings]: "Settings"
};

export function HeadingComponent(): React.JSX.Element {
  const pathname = usePathname();
  
  // Find the matching path or use the current pathname as fallback
  const currentPath = Object.values(paths).find(path => path === pathname) || paths.home;
  const title = pathTitles[currentPath] || "Home";

  return (
    <Heading>
      <Box className="title">
        {title}
      </Box>
      <Typography component="hr" className='horizontal-rule'/>
    </Heading>
  )
}