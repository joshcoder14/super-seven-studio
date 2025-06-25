import {Box, styled} from "@mui/material";
import "@fontsource/nunito-sans";

export const TopBarContainer = styled(Box)`
    // position: fixed;
    z-index: 2;
    width: -webkit-fill-available;
    display: flex;
    align-items: center;
    justify-content: right;
    with: 100%;
    height: 70px;
    background-color: #ffffff;
    border-bottom: 1px solid #E0E0E0;
    color: #000000;

    .menu-icon-container {
        margin-right: auto;
        padding-left: 25px;

        svg {
            width: 35px;
            height: 35px;
            cursor: pointer;
            border: 1px solid #E0E0E0;
            border-radius: 6px;
            background: #2BB673;
            padding-left: 5px;
            padding-right: 5px;

            path {
                fill: #ffffff;
            }
        }
    }
`

export const TopbarUserContainer = styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: right;
    width: 160px;
    margin: 0 24px 0 0;
`
export const TopbarNameContainer = styled(Box)`
    margin-right: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #000000;
    
`
export const TopbarUserName = styled(Box)`
    font-family: Nunito Sans;
    font-weight: 700;
    font-size: 12px;
    line-height: 100%;
    letter-spacing: 0px;
    color: #404040;
    text-wrap: nowrap;
`
export const TopbarUserRole = styled(Box)`
    font-family: Nunito Sans;
    font-weight: 600;
    font-size: 10px;
    line-height: 100%;
    letter-spacing: 0px;
    color: #565656;
    margin-top: 5px;
`
export const TopBarUserImage = styled(Box)`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 0 10px 0 0;
    
    svg{
        width: 40px;
        height: 40px;

        path {
            fill: #2BB673;
        }
    }
`