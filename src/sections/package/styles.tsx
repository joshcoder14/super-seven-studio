import { Box, styled } from "@mui/material";

export const PackageWrapper = styled(Box)`
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 24px;
    margin-bottom: 150px;
`;

export const PackageContent = styled(Box)`
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    gap: 30px;
`;