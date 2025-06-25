import { Box, styled } from "@mui/material";

export const Search = styled(Box)`
    max-width: 253px;
    width: 100%;
    margin-left: auto;
    position: relative;

    input[type="text"] {
        width: 100%;
        height: 40px;
        border: 0.6px solid #D5D5D5;
        background: #FFFFFF;
        padding: 10px 10px 10px 44px;
        border-radius: 19px;
        font-weight: 400;
        font-size: 14px;
        line-height: 100%;
        color: #202224;

        &::placeholder {
            font-weight: 400;
            font-size: 14px;
            color: #202224;
            opacity: 0.5;
        }

        &:focus-visible {
            outline: none;
            border: 0.6px solid #D5D5D5;
        }
    }

    svg {
        position: absolute;
        left: 15px;
        top: 9px;

        path {
            fill: #dbdbdb;
        }
    }
`;