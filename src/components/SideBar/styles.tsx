import { Box, styled} from "@mui/material";

export const SideBarContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%; 
    background-color: #ffffff;
    border-right: 2px solid #E0E0E0;
    font-family: 'Nunito', sans-serif;
    color: #000000;
    font-weight: 600;
    
    @media (max-width: 768px) {
        .side-bar-container{
            display: none;
        }
    }

    .menu-items-container{
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding-bottom: 40px;
        width: auto;
        min-width: 205px;
        transition: min-width 0.5s ease-in-out;

        .menu-item {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 15px 17px;
            border-radius: 10px;
            cursor: pointer;
            margin: 0 30px;
            position: relative;
            transition: background-color 0.2s ease-in-out;

            p {
                font-family: Nunito Sans;
                font-weight: 500;
                font-size: 14px;
                line-height: 100%;
                letter-spacing: 0.3px;
                color: #000000;
                transition: all 0.2s ease-in-out;
            }

            svg{
                width: 25px;
                height: 25px;
            }

            &:hover {
                background-color: #2BB673;
                transition: background-color 0.2s ease-in-out;

                svg {
                    path {
                        fill: #FFFFFF;
                    }
                }

                p {
                    color: #FFFFFF;
                }
            }

            &.active {
                &::before {
                    content: "";
                    position: absolute;
                    background-color: #155D3A;
                    width: 20px;
                    height: 100%;
                    border-radius: 4px;
                    left: -45px;
                }

                svg {
                    path {
                        fill: #FFFFFF;
                    }
                }

                p {
                    color: #FFFFFF;
                }
            }
        }
        
        .active{
            background-color: #2BB673;
            transition: background-color 0.2s ease-in-out;
        }
    }
    .bottom-menu-items-container{
        display: flex;
        flex-direction: column;
        gap: 5px;

        .bottom-menu-item{
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 15px 17px;
            border-radius: 10px;
            cursor: pointer;
            margin: 0 30px;
            position: relative;
            transition: background-color 0.2s ease-in-out;

            svg{
                width: 25px;
                height: 25px;
            }

            p {
                font-family: Nunito Sans;
                font-weight: 600;
                font-size: 14px;
                line-height: 100%;
                letter-spacing: 0.3px;
                color: #000000;
            }

            &:hover {
                background-color: #2BB673;
                transition: background-color 0.2s ease-in-out;

                svg {
                    path {
                        fill: #FFFFFF;
                    }
                }

                p {
                    color: #FFFFFF;
                }
            }

            &.active{
                background-color: #2BB673;

                &::before {
                    content: "";
                    position: absolute;
                    background-color: #155D3A;
                    width: 20px;
                    height: 100%;
                    border-radius: 4px;
                    left: -55px;
                }
                svg {
                    path {
                        fill: #FFFFFF;
                    }
                }

                a {
                    color: #FFFFFF;
                }
            }

            .active{
                background-color: #2BB673;
                transition: background-color 0.2s ease-in-out;
            }
        }
    }

    .side-bar-horizontal-rule{
        border: 1px solid #E0E0E0;
        padding: 0;
        margin: 15px 0;
    }
    
    .logo-container{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 30px;

        img {
            height: auto;
            transition: width 0.5s ease-in-out;
        }
    }

    &.minimized {
        .logo-container {

            img:first-of-type {
                transition: width 0.5s ease-in-out;
            }

            img:last-of-type {
                transition: width 0.5s ease-in-out;
                display: none;
            }
        }

        .menu-items-container {
            min-width: 0px;
            transition: min-width 0.5s ease-in-out;
            .menu-item {
                width: fit-content;

                p {
                    transition: all 0.2s ease-in-out;
                    display: none;
                }
            }
        }
    }
`