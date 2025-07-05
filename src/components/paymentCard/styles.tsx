import { Box, styled } from "@mui/material";

export const PaymentMethod = styled(Box)`
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;

    .label {
        font-family: Nunito Sans;
        font-weight: 500;
        font-size: 14px;
        line-height: 100%;
        letter-spacing: 0px;
        color: #828282;
    }

    .payment-to {
        width: 100%;
        height: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        border-radius: 4px;
        border: 0.6px solid #D5D5D5;
        background: #F7FAF5;
        cursor: pointer;
        margin-top: 10px;

        img {
            transition: all 0.2s ease-in-out;
        }
        img.rotated {
            transform: rotate(180deg);
            transition: all 0.2s ease-in-out;
        }

        span {
            font-family: Nunito Sans;
            font-weight: 400;
            font-size: 14px;
            line-height: 100%;
            letter-spacing: 0px;
            color: #202224;
            text-wrap: nowrap;
        }
    }

    .dropdown-list {
        width: 100%;
        height: 91px;
        overflow: auto;
        scrollbar-width: thin;
        scrollbar-color: #D5D5D5 #FAFBFD;
        display: flex;
        flex-direction: column;
        border-radius: 4px;
        border: 0.6px solid #D5D5D5;
        background: #F7FAF5;

        .row {
            padding: 15px 20px;
            cursor: pointer;

            &:hover {
                background-color: #D5D5D5;
            }

            span {
                font-family: Nunito Sans;
                font-weight: 400;
                font-size: 14px;
                line-height: 100%;
                letter-spacing: 0px;
                color: #202224;
            }
        }

        .row + .row {
            border-top: 1px solid #ccc;
        }
    }
`;

export const PaymentCard = styled(Box)`
    max-width: 400px;
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    border: 0.3px solid #B9B9B9;
    border-radius: 8px;
    padding: 50px;

    .heading-component {
        padding: 0;
        padding-bottom: 30px;

        h2 {
            font-family: Nunito Sans;
            font-weight: 700;
            font-size: 18px;
            color: #2BB673;
        }
    }

    form {
        .row {
            display: flex;
            flex-direction: column;
            gap: 30px;

            .form-group {
                label {
                    font-family: Nunito Sans;
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 100%;
                    letter-spacing: 0px;
                    color: #828282;
                }

                input[type="text"] {
                    width: 100%;
                    height: 30px;
                    background: #F7FAF5;
                    border-radius: 4px;
                    padding: 10px 15px;
                }
            }
        }

        .action-btn {
            width: 100%;
            height: auto;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            gap: 20px;
            padding-top: 30px;

            .btn {
                appearance: none;
                border: none;
                border-radius: 6px;
                width: fit-content;
                height: fit-content;
                font-weight: 500;
                font-size: 14px;
                line-height: 27px;
                letter-spacing: 0px;
                text-transform: capitalize;
                color: #FFFFFF;
                padding: 10px 15px;
                cursor: pointer;

                &.cancel {
                    background: #AAAAAA;
                }

                &.pay {
                    background: #2BB673;
                }

                &.disabled {
                    background: #AAAAAA;
                    opacity: 0.5;

                    &:hover {
                        cursor: not-allowed;
                    }
                }
            }
        }
    }
`;

export const PaymentCardContainer = styled(Box)`
    width: 100%;
    height: auto;
`;