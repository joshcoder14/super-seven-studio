import { Box, styled } from "@mui/material";

export const PreloadWrapper = styled(Box)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(1px);
    z-index: 9999;
    pointer-events: none;
`;