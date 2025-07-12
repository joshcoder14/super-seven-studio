import { Box, styled } from "@mui/material";

export const HomeContainer = styled(Box)`
    overflow: auto;
    scrollbar-width: none;
    display: flex;
    flex-direction: column;
    gap: 40px;
    position: relative;
    background-color: #f7faf5;
    height: 100%;
    overflow-y: scroll;
    scrollbar-width: none;
`;