import { Box, styled } from "@mui/material";

export const FilterArea = styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    gap: 30px;
`;

export const FeedbackWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 0px;
    width: 100%;
    height: 100%;
    padding: 0 30px;

    table {
        tbody {
            tr {
                td {
                    span {
                        padding: 5px 6px;
                        border-radius: 4.5px;
                        font-weight: 500;
                        font-size: 12px;
                        line-height: 100%;
                    }

                    &.posted {
                        span {
                            background-color: rgba(0, 182, 155, 0.2);
                            color: #00B69B;
                        }
                    }

                    &.unposted {
                        span {
                            background-color: rgba(239, 56, 38, 0.2);
                            color: #EF3826;
                        }
                    }

                    &.pending {
                        span {
                            background-color: rgba(255, 123, 0, 0.2);
                            color: #FF7B00;
                        }
                    }
                }
            }
        }
    }
`;

export const FeedbackContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 40px;
    position: relative;
    background-color: #f7faf5;
    height: 100%;
`;