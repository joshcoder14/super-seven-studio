import { Box, styled } from "@mui/material";

export const BoxWrapper = styled(Box)`
    width: 100%;
    
    p {
        margin: 10px 0;
        padding: 0;
    }

    .error-code {
        font-family: "Nunito Sans", sans-serif;
        display: block;
        font-weight: 700;
        font-size: 100px;
        color:  #0c2035af;
    }

    .error-message {
        font-family: "Nunito Sans", sans-serif;
        font-size: 32px;
        font-weight: 600;
        color:  #0C2035;
    }

    .help-text {
        font-family: "Nunito Sans", sans-serif;
        font-size: 20px;
        color:  #0C2035;
        margin-bottom: 16px;
    }

    .page-404-btn {
        display: flex;
        align-items: center;
        justify-content: center;

        .primary-btn {
            font-family: "Nunito Sans", sans-serif;
            font-weight: 700;
            font-size: 16px;
            line-height: 17px;
            text-decoration: none;
            padding: 16px 20px;
            background: #2BB673;
            color: #FFFFFF;
            border-radius: 4px;
            margin-top: 20px;
            transition: 1s;

            &:hover {
                background: #155D3A;
                cursor: pointer;
                transition: 0.5s;
            }
        }
    }

`;

export const NotFoundContainer = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    // min-height: 100vh;
    text-align: center;
    background: #0f21c218;
`;