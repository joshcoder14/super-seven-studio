import { Box, styled } from "@mui/material";

export const PackageWrapper = styled(Box)`
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 24px;
    padding: 0 30px;
    margin-bottom: 150px;
`;

export const PackageContent = styled(Box)`
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    gap: 30px;
    padding-right: 30px;
`;