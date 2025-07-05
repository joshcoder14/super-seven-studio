'use client';

import React from 'react';
import { Box, Typography}  from '@mui/material';
import { BillingCard, DetailsContent, Details, Assessment, AssessmentDetails } from './styles';
import { FormHeading } from '@/components/Heading/FormHeading';
import { Billing, BillingDetailsProps } from '@/types/billing';
import { formatAmount, getAddonNames } from '@/utils/billing';

export function BillingDetailsComponent({ billing }: { billing: Billing }): React.JSX.Element {
  const isPartial = billing.status.toLowerCase() === 'partial';
  return (
    <BillingCard>
      <DetailsContent>
        <FormHeading title="Billing Details :" />

        <Details className="details">
          <DetailItem label="Event Name" value={billing.event_name} />
          <DetailItem label="Package" value={billing.package} />
          <DetailItem label="Client" value={billing.customer_name} />
          <DetailItem label="Add-on" value={getAddonNames(billing.add_ons) || 'None'} />
          <DetailItem label="Status" value={billing.status} />
          <DetailItem label="Booking ID" value={billing.booking_id} />
        </Details>
      </DetailsContent>
      
      <Assessment className="assessments">
        <FormHeading title="Assessment :" />

        {/* Conditionally render based on status */}
        {isPartial ? (
          <AssessmentDetails>
            <DetailItem label="Package Price" value={formatAmount(billing.total_amount)} />
            <DetailItem label="Amount Paid" value={formatAmount(billing.total_amount_paid)} />
            <DetailItem label="Total Balance" value={formatAmount(billing.balance)} />
          </AssessmentDetails>
        ) : (
          <AssessmentDetails>
            <DetailItem label="Package Amount" value={formatAmount(billing.package_amount)} />
            <DetailItem label="Add-on Amount" value={formatAmount(billing.add_on_amount)} />
            <DetailItem label="Discount" value={formatAmount(billing.discount)} />
            <DetailItem label="Total Amount" value={formatAmount(billing.total_amount)} />
          </AssessmentDetails>
        )}
      </Assessment>
    </BillingCard>
  );
}

// Helper component for detail items
const DetailItem = ({ label, value }: { label: string; value: string | number | undefined | null }) => (
  <Box className="detail">
    <Box className="label">
      <Typography component="p">{label}</Typography>
    </Box>
    <Box className="data">
      <Typography component="p">{value || 'N/A'}</Typography>
    </Box>
  </Box>
);