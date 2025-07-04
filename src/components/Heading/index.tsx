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
  
  // Check if path starts with /accounts
  if (pathname.startsWith(paths.accounts)) {
    return (
      <Heading className="heading">
        <Box className="title">
          {pathTitles[paths.accounts]}
        </Box>
        <Typography component="hr" className='horizontal-rule'/>
      </Heading>
    );
  }

  // Check if path starts with /booking
  if (pathname.startsWith(paths.booking)) {
    return (
      <Heading className="heading">
        <Box className="title">
          {pathTitles[paths.booking]}
        </Box>
        <Typography component="hr" className='horizontal-rule'/>
      </Heading>
    );
  }

  //Check if path starts with /workload
  if (pathname.startsWith(paths.workload)) {
    return (
      <Heading className="heading">
        <Box className="title">
          {pathTitles[paths.workload]}
        </Box>
        <Typography component="hr" className='horizontal-rule'/>
      </Heading>
    );
  }

  // Find the matching path or use the current pathname as fallback
  const currentPath = Object.values(paths).find(path => path === pathname) || paths.home;
  const title = pathTitles[currentPath] || "Home";

  return (
    <Heading className="heading">
      <Box className="title">
        {title}
      </Box>
      <Typography component="hr" className='horizontal-rule'/>
    </Heading>
  );
}