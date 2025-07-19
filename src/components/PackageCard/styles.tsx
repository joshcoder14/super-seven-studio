import { Box, styled } from "@mui/material";

export const PackagePrice = styled(Box)`
    width: 100%;
    height: auto;
    background: #2BB673;
    border-radius: 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px 0;

    p {
        padding: 0;
        margin: 0;
        font-family: Nunito Sans;
        font-weight: 600;
        font-size: 35px;
        line-height: 60px;
        letter-spacing: 0px;
        color: #FFFFFF;
    }
`;

export const PackageDetails = styled(Box)`
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0 50px;
    padding-bottom: 30px;

    p {
        font-family: Nunito Sans;
        font-weight: 400;
        font-size: 18px;
        line-height: 24px;
        color: rgba(32, 34, 36, 0.6);
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;

        li {
            padding: 0;
            padding-left: 20px;
            margin-left: 10px;

            &:before {
                content: "";
                position: absolute;
                top: 7px;
                left: 0;
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background: rgba(32, 34, 36, 0.6);
                margin-right: 10px;
            }

            > div {
                margin: 0;

                span {
                    font-family: Nunito Sans;
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 24px;
                    color: rgba(32, 34, 36, 0.6);
                }
            }
        }
    }
`;

export const PackageTitle = styled(Box)`
    width: 100%;
    height: auto;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 20px;
    padding: 0 50px;
    padding-bottom: 20px;

    img {
        width: 35px;
        height: 35px;
        object-fit: contain;
    }

    h2 {
        font-family: Nunito Sans;
        font-weight: 600;
        font-size: 30px;
        line-height: 32px;
        color: #202224;
    }
`;

export const PackageCard = styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    max-width: 362px;
    width: 100%;
    height: auto;
    min-height: 250px;
    background: #FFFFFF;
    border: 0.3px solid #D5D5D5;
    border-radius: 12px 12px 24px 24px;
    padding-top: 30px;
`;