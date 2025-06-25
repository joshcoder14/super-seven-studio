import { Box, styled } from "@mui/material";

export const BookingWrapper = styled(Box)`
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 50px;
    background: #FFFFFF;
    border: 0.3px solid #E0E0E0;
    border-radius: 14px;

    form {
        display: flex;
        flex-direction: row;
        gap: 20px;

        .form-group {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 10px;

            label {
                color: #ADADAD;
            }

            input[type="text"],
            input[type="email"],
            input[type="password"] {
                width: 100%;
                height: 46px;
                background: #F7FAF5;
                border: 0.6px solid #D5D5D5;
                border-radius: 4px;
                padding: 0 15px;
                font-weight: 400;
                font-size: 14px;
                line-height: 100%;
                letter-spacing: 0px;
                color: #202224;
            }

            fieldset {
                border: 0.6px solid #D5D5D5;
            }

            .dropdown-list {
                width: 100%;
                height: 120px;
                overflow: auto;
                scrollbar-width: thin;
                scrollbar-color: #D5D5D5 #FAFBFD;
                display: flex;
                flex-direction: column;
                border-radius: 4px;
                border: 0.6px solid #D5D5D5;
                background: #F7FAF5;
                margin-top: -10px;

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

                    .checkbox {
                        width: 100%;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        gap: 10px;

                        input[type="checkbox"] {
                            display: none;
                        }

                        label {
                            position: relative;
                            padding-left: 30px;
                            cursor: pointer;
                            user-select: none;
                            font-family: Nunito Sans;
                            font-weight: 400;
                            font-size: 14px;
                            line-height: 100%;
                            letter-spacing: 0px;
                            color: #202224;
                        }

                        label::before {
                        content: '';
                            position: absolute;
                            left: 0;
                            top: -4px;
                            width: 20px;
                            height: 20px;
                            background-color: white;
                            border: 1px solid #000;
                            border-radius: 2px;
                            box-sizing: border-box;
                            transition: all 0.2s ease;
                        }

                        input[type="checkbox"]:checked + label::after {
                            content: '';
                            position: absolute;
                            left: 7px;
                            top: -1px;
                            width: 4px;
                            height: 10px;
                            border: solid black;
                            border-width: 0 2px 2px 0;
                            transform: rotate(45deg);
                        }
                    }
                }

                .row + .row {
                    border-top: 1px solid #ccc;
                }
            }
        }
    }
`;

export const AddBookingContainer = styled(Box)`
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    gap: 30px;
    padding: 0 30px;
`;

export const BigCalendar = styled(Box)`
    flex: 1;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    border: 0.3px solid #E0E0E0;
    height: 100%;
    overflow: auto;
    
    @media (max-width: 768px) {
        margin-left: 0;
        margin-top: 20px;
        height: auto;
    }
`;

export const EventDetails = styled(Box)`
    width: 100%;
    background: #F7FAF5;
    border: 0.6px solid #D5D5D5;
    border-radius: 10px;
    padding: 16px 26px 26px 26px;
    margin-top: 15px;
    margin-bottom: 15px;

    ul {
        list-style: disc;
        position: relative;

            &:before {
                content: "";
                position: absolute;
                top: 10px;
                left: 0;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background:rgb(230, 6, 6);
            }

        li {
            display: flex;
            flex-direction: column;
            gap: 0px;
            padding-left: 25px;
            padding-top: 2px;

            .label {
                font-family: Nunito Sans;
                font-weight: 700;
                font-size: 14px;
                line-height: 26px;
                letter-spacing: 0px;
                color: #202224;
            }

            .date,
            .package-type,
            .venue {
                font-family: Nunito Sans;
                font-weight: 500;
                font-size: 12px;
                line-height: 26px;
                letter-spacing: 0px;
                color: #202224;
            }
        }
    }
`;

export const EventHeading = styled('h2')`
    font-family: Nunito Sans;
    font-weight: 700;
    font-size: 14px;
    line-height: 100%;
    letter-spacing: 0px;
    color: #202224;
`;

export const StatusFilter = styled(Box)`
    width: 100%;
    background: #F7FAF5;
    border: 0.6px solid #D5D5D5;
    border-radius: 10px;
    padding: 16px 26px;
    margin-top: 20px;
    margin-bottom: 20px;
    border-bottom: 0.6px solid #D5D5D5;

    .status {

        label {
            font-family: Nunito Sans;
            font-weight: 700;
            font-size: 14px;
            line-height: 100%;
            letter-spacing: 0px;
            color: #202224;
        }
    }

    .dropdown-checkbox {
        display: none;
        flex-direction: column;
        gap: 10px;
        padding-top: 10px;
        border-top: 0.6px solid #D5D5D5;
        margin-top: 15px;

        &.open {
            display: flex;
        }

        .checkbox-container {
            input[type="checkbox"] {
                &:checked {
                    border: 2px solid #000000 !important;
                }
            }

            svg {
                path {
                    fill: #000000;
                }
            }

            label {
                font-family: Nunito Sans;
                font-weight: 500;
                font-size: 14px;
                line-height: 100%;
                letter-spacing: 0px;
                color: #202224;
            }
        }
    }
`;

export const CalendarWrapper = styled(Box)`
    width: 100%;

    > .MuiSvgIcon-root {
        background: #2BB673;
    }
`;

export const AddBooking = styled(Box)`
    width: 100%;

    .add-booking-link {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 40px;
        background: #2BB673;
        border-radius: 8px;
        padding: 12px 16px;
        color: #fff;
        font-weight: 600;
        font-size: 14px;
        line-height: 100%;

        svg {
            path {
                fill: #fff;
            }
        }
    }
`;

export const LeftContent = styled(Box)`
    max-width: 350px;
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    border: 0.3px solid #E0E0E0;
    border-radius: 14px;
    padding: 24px;

    .horizontal-rule {
        margin: 15px 0;
    }
`;

export const BookingContent = styled(Box)`
    width: 100%;
    padding: 0 30px;
    display: flex;
    flex-direction: row;
    gap: 20px;
`;

export const BookingContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 40px;
    position: relative;
    background-color: #f7faf5;
    height: 100%;
    // margin-top: 70px;
`;