import { Box, styled } from "@mui/material";

export const ActionButton = styled(Box)`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    padding: 0px 40px;

    .btn {
        width: auto;
        height: auto;
        padding: 10px 15px;
        border-radius: 6px;
        font-family: Nunito Sans;
        font-weight: 500;
        font-size: 14px;
        line-height: 27px;
        letter-spacing: 0px;
        text-wrap: nowrap;
        color: #FFFFFF;
        cursor: pointer;
        appearance: none;
        box-shadow: none;
        border: none;

        &.cancel {
            background-color: #ADADAD;
        }

        &.update {
            background-color: #2BB673;
        }
    }
`;

export const LinkAttached = styled(Box)`
    width: 100%;
    height: auto;
    padding: 0 40px;
    padding-bottom: 30px;
    display: flex;
    flex-direction: column;

    .label {
        font-family: Nunito Sans;
        font-weight: 500;
        font-size: 14px;
        line-height: 100%;
        letter-spacing: 0px;
        color: #ADADAD;
    }

    input[type="text"] {
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
        font-family: Nunito Sans;
        font-weight: 400;
        font-size: 14px;
        line-height: 100%;
        letter-spacing: 0px;
        color: #202224;
    }
`;

export const StatusWrapper = styled(Box)`
    width: 100%;
    height: auto;
    padding: 40px;
    padding-bottom: 30px;
    display: flex;
    flex-direction: column;

    .label {
        font-family: Nunito Sans;
        font-weight: 500;
        font-size: 14px;
        line-height: 100%;
        letter-spacing: 0px;
        color: #ADADAD;
    }

    .status-to {
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
        height: 150px;
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

export const ReleaseDateWrapper = styled(Box)`
    
    width: 100%;
    height: auto;
    padding: 0 40px;
    padding-bottom: 30px;
    display: flex;
    flex-direction: column;

    .label {
        font-family: Nunito Sans;
        font-weight: 500;
        font-size: 14px;
        line-height: 100%;
        letter-spacing: 0px;
        color: #ADADAD;
    }

    

        .form-group {
            .date-picker {

                .Mui-disabled {
                    background-color: #f5f5f5;
                    
                height: 48px;
                }
            }
        }

    .release {
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

        span {
            font-family: Nunito Sans;
            font-weight: 400;
            font-size: 14px;
            line-height: 100%;
            letter-spacing: 0px;
            color: #202224;
            text-wrap: nowrap;
        }

        input[type="date"] {
            font-family: Nunito Sans;
            font-weight: 400;
            font-size: 14px;
            line-height: 100%;
            letter-spacing: 0px;
            color: #202224;
            background-color: transparent;
            border: none;
        }

        input[type="date"]::-webkit-calendar-picker-indicator {
            filter: brightness(0);
            width: 20px;
            height: 20px;
            cursor: pointer;
            border: none;
        }

    }
`;

export const AssignedWrapper = styled(Box)`
    width: 100%;
    height: auto;
    padding: 0 40px 40px;
    display: flex;
    flex-direction: column;

    .label {
        font-family: Nunito Sans;
        font-weight: 500;
        font-size: 14px;
        line-height: 100%;
        letter-spacing: 0px;
        color: #ADADAD;
    }

    .assigned-to {
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

        span {
            font-family: Nunito Sans;
            font-weight: 400;
            font-size: 14px;
            line-height: 100%;
            letter-spacing: 0px;
            color: #202224;
            text-wrap: nowrap;
        }

        img {
            transform: rotate(0deg);
            transition: transform 0.3s ease-in-out;
        }

        img.rotated {
            transform: rotate(180deg);
            transition: transform 0.3s ease-in-out;
        }
    }

    .dropdown-list {
        width: 100%;
        height: 105px;
        overflow: auto;
        scrollbar-width: thin;
        scrollbar-color: #D5D5D5 #FAFBFD;
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding: 15px 20px;
        border-radius: 4px;
        border: 0.6px solid #D5D5D5;
        background: #F7FAF5;

        .row {
            width: 100%;

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
    }
`;

export const Details = styled(Box)`
    width: 100%;
    height: auto;
    padding: 30px 50px;
    border-top: 0.3px solid #E0E0E0;
    border-bottom: 0.3px solid #E0E0E0;

    &.view-details {
        background-color: #FFFFFF;
        border: none;
        border-radius: 14px;
        padding: 40px 75px;
        border: 0.3px solid #E0E0E0;

        > div .client-info {
            align-items: center;

            div {
                font-family: Nunito Sans;
                font-weight: 500;
                font-size: 18px;
                line-height: 100%;
                letter-spacing: 0px;
                color: #828282;
            }

            span {
                &.release-date,
                &.status {
                    color: #202224;
                }
            }
        }

        .event-info {
            display: flex;
            justify-content: space-between;
            gap: 20px;

            .right-info {
                display: flex;
                flex-direction: column;
                width: 100%;
                max-width: 600px;
                min-width: 600px;
                margin-top: -40px;

                .client-info {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    align-items: flex-start;

                    span {
                        &.status {
                            padding: 7px 9px;
                            border-radius: 6px;
                            font-weight: 600 !important;
                            font-size: 14px !important;

                            &.unassigned {
                                background: rgba(0, 0, 0, 0.222);
                                color: #404040;
                            }

                            &.scheduled {
                                background: rgba(239, 56, 38, 0.2);
                                color: #EF3826;
                            }

                            &.uploaded {
                                background: #4c007b40;
                                color: #283475;
                            }

                            &.for-edit,
                            &.for.edit,
                            &.editing {
                                background-color: rgba(55, 73, 166, 0.2);
                                color: #3749A6;
                            }

                            &.for-release,
                            &.for.release  {
                                background-color: rgba(255, 123, 0, 0.2);
                                color: #FF7B00;
                            }

                            &.completed {
                                background-color: rgba(0, 182, 155, 0.2);
                                color: #00B69B;
                            }
                        }
                    }

                    a {
                        text-decoration: underline;
                        text-underline-offset: 5px;
                    }
                }
            }
        }
    }

    .event-head {
        display: flex;
        flex-direction: row;

        .event-icon {
            width: 18px;
            height: 18px;
            background: #D17321;
            border-radius: 50%;
            margin-right: 20px;
            margin-top: 7px;
        }

        .event-name {
            display: flex;
            flex-direction: column;
            gap: 15px;

            h2 {
                font-family: Nunito Sans;
                font-weight: 700;
                font-size: 29px;
                line-height: 100%;
                letter-spacing: 0px;
                color: #202224;
            }

            .event-date {
                font-family: Nunito Sans;
                font-weight: 500;
                font-size: 18.05px;
                line-height: 100%;
                letter-spacing: 0px;
                color: #828282;
            }
        }
    }
    
    .client-info {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 20px;

        img {
            margin-right: 20px;
            width: 25px;
            height: 25px;
            object-fit: contain;
        }

        span {
            font-family: Nunito Sans;
            font-weight: 500;
            font-size: 18.05px;
            line-height: 100%;
            letter-spacing: 0px;
            color: #828282;
        }
    }
`;

export const CloseWrapper = styled(Box)`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding: 30px;
    
    border-bottom: 0.3px solid #E0E0E0;

    img {
        width: 18px;
        height: 18px;
        object-fit: contain;
        cursor: pointer;
    }
`;

export const ModalContainer = styled(Box)`
    position: absolute;
    top: 0px;
    right: 0;
    max-width: 560px;
    width: 100%;
    height: auto;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding-bottom: 30px;
    z-index: 1;
    border: 0.3px solid #E0E0E0;
    border-radius: 4px;
`;

export const AddButton = styled(Box)`
    width: auto;
    height: auto;
    cursor: pointer;

    img {
        width: 20px;
        height: 20px;
        object-fit: contain;
    }
`;

export const FilterArea = styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    gap: 30px;
`;

export const WorkloadWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 0px;
    width: 100%;
    height: 100%;
    padding: 0 30px;
`;

export const WorkloadContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 40px;
    position: relative;
    background-color: #f7faf5;
    height: 100%;
    // padding-top: 70px;
`;