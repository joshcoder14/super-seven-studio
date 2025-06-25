import { Box, styled} from "@mui/material";

export const Heading = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 40px;
    position: relative;
    background-color: #f7faf5;
    width: 100%;
    padding: 0 30px;
    padding-top: 40px;

    .title{
        font-family: 'Nunito', sans-serif;
        font-size: 32px;
        font-weight: 700;
        color: #202224;
    }
    
    .horizontal-rule{
        border: 1px solid #E0E0E0;
        width: 100%;
    }
`;