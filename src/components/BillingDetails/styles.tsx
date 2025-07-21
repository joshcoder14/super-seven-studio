import { Box, styled } from "@mui/material";

export const AssessmentDetails = styled(Box)`
    width: 100%;
    height: auto;
    padding-top: 15px;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 10px;

    .detail {
        width: 100%;
        height: auto;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        padding: 0 30px;

        .label {
            p {
                font-family: 'Nunito Sans', sans-serif;
                font-size: 16px;
                font-weight: 600;
                color: #828282;
                margin: 0;
                padding: 0;
            }
        }

        .data {
            p {
                font-family: 'Nunito Sans', sans-serif;
                font-size: 18px;
                font-weight: 600;
                line-height: 100%;
                letter-spacing: 0px;
                color: #202224;
                margin: 0;
                padding: 0;
            }
        }

        &:last-of-type {
            border-top: 1px solid #2BB673;
            padding-top: 20px;
            margin-top: 10px;
        }
    }
`;

export const Assessment = styled(Box)`
    width: 100%;
    height: auto;
    padding: 40px 30px;
    border-top: 1px solid #E0E0E0;

    .heading-component {
        padding: 0 30px;

        h1 {
            font-size: 18px;
            color: #2BB673;
        }
    }
`;

export const Details = styled(Box)`
    width: 100%;
    height: auto;
    padding: 20px 60px 40px 60px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;

    .detail {
        display: flex;
        flex-direction: column;

        .label {
            p {
                font-family: 'Nunito Sans', sans-serif;
                font-size: 16px;
                font-weight: 500;
                color: #828282;
                margin: 0;
                padding: 0;
            }
        }

        .data {
            p {
                font-family: 'Nunito Sans', sans-serif;
                font-size: 18px;
                font-weight: 600;
                line-height: 100%;
                letter-spacing: 0px;
                color: #202224;
                margin: 0;
                padding: 0;
            }
        }
    }
`;

export const DetailsContent = styled(Box)`
    width: 100%;
    height: auto;

    .heading-component {
        padding: 40px 60px 0 60px;

        h1 {
            font-family: Nunito Sans;
            font-weight: 700;
            font-size: 21px;
            color: #2BB673;
        }
    }
`;

export const BillingCard = styled(Box)`
    max-width: 500px;
    width: 100%;
    height: auto;
    background: #FFFFFF;
    border: 0.3px solid #B9B9B9;
    border-radius: 8px;
`;

export const BillingDetails = styled(Box)`
    width: 100%;
    height: auto;
    padding-top: 40px;
    padding-left: 30px;
    display: flex;
    gap: 30px;
`;