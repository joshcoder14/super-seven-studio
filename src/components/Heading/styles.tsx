import { Box, styled} from "@mui/material";

export const Heading = styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: relative;
    background-color: #f7faf5;
    width: 100%;
    padding: 30px 0;
    border-bottom: 1px solid #E0E0E0;

    .title{
        font-family: 'Nunito', sans-serif;
        font-size: 32px;
        font-weight: 700;
        color: #202224;
        margin: 0;
    }

    button {
        appearance: none;
        border: none;
        box-shadow: none;
        background-color: transparent;
        font-family: 'Nunito', sans-serif;
        font-size: 16px;
        font-weight: 500;
        color: #FFFFFF;
        cursor: pointer;
        text-transform: capitalize;
        background-color: #2BB673;
        padding: 10px 20px;
        border-radius: 6px;

        &:hover {
            background-color: #155D3A;
        }
    }
`;