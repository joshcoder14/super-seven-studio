import { Box, styled } from "@mui/material";

export const TransactionWrapper = styled(Box)`
    width: 100%;
    height: auto;
    padding: 0 30px;
    margin-bottom: 30px;
`;

export const BillingDetails = styled(Box)`
    width: 100%;
    height: auto;
    padding-top: 40px;
    padding-left: 30px;
    display: flex;
    gap: 30px;

    .assessments.client {
        max-width: 500px;
        width: 100%;
        height: auto;
        background: #FFFFFF;
        border: 0.3px solid #B9B9B9;
        border-radius: 8px;
    }
`;

export const BillingPaymentContainer = styled(Box)`
    width: 100%;
    height: auto;
`;

export const YearSelector = styled(Box)`
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
`;