import { Box, styled} from "@mui/material";

export const Heading = styled(Box)`
    display: flex;
    flex-direction: column;
    position: relative;
    background-color: #f7faf5;
    width: 100%;
    padding: 0 30px;

    .title{
        font-family: 'Nunito', sans-serif;
        font-size: 32px;
        font-weight: 700;
        color: #202224;
        border-bottom: 1px solid #E0E0E0;
        margin: 0;
        padding: 30px 0;
    }
    
    .horizontal-rule{
        border: 1px solid #E0E0E0;
        width: 100%;
    }
`;