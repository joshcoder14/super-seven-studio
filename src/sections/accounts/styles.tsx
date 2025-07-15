import { Box, styled } from "@mui/material";

export const AddAccountWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 40px;
    position: relative;
    background-color: #f7faf5;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    scrollbar-width: none;
    padding: 0 30px;
`;

export const IconButton = styled(Box)`
    display: inline-block;
    width: 35px;
    height: 35px;
    border-radius: 8px;
    object-fit: contain;
    padding: 8px;
    background: #FAFBFD;
    border: 0.6px solid #D5D5D5;
    padding-left: 9px;
    margin-right: 10px;
    cursor: pointer;
    
    &:hover {
        background-color: #D5D5D5;
    }
`;

export const SearchBox = styled(Box)`
    max-width: 253px;
    width: 100%;
    margin-left: auto;
    position: relative;

    input[type="text"] {
        width: 100%;
        height: 40px;
        border: 0.6px solid #D5D5D5;
        background: #FFFFFF;
        padding: 10px 10px 10px 44px;
        border-radius: 19px;
        font-weight: 400;
        font-size: 14px;
        line-height: 100%;
        color: #202224;

        &::placeholder {
            font-weight: 400;
            font-size: 14px;
            color: #202224;
            opacity: 0.5;
        }

        &:focus-visible {
            outline: none;
            border: 0.6px solid #D5D5D5;
        }
    }

    svg {
        position: absolute;
        left: 15px;
        top: 9px;

        path {
            fill: #dbdbdb;
        }
    }
`;

export const AddAccount = styled(Box)`
    width: fit-content;
    height: auto;
    padding: 10px 15px;
    font-weight: 500;
    font-size: 14px;
    line-height: 27px;
    letter-spacing: 0px;
    color: #FFFFFF;
    background-color: #2BB673;
    cursor: pointer;
    border: none;
    border-radius: 6px;
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: #155D3A;
        transition: all 0.2s ease-in-out;
    }
`;

export const FilterBy = styled(Box)`
    display: flex;
    flex-direction: row;

    label, select {
        border: 0.6px solid #D5D5D5;
        background: #F9F9FB;
        padding: 20px 30px;
        font-family: Nunito Sans;
        font-weight: 700;
        font-size: 14px;
        line-height: 100%;
        letter-spacing: 0px;
        color: #202224;
    }

    label {
        border-radius: 10px 0px 0px 10px;
    }

    select {
        appearance: none;
        border-left: none;
        border-radius: 0px 10px 10px 0px;
        width: 100%;
        cursor: pointer;
        padding: 20px 30px;

        &:focus-visible {
            outline: none;
            border: 0.6px solid #D5D5D5;
        }
    }
`;

export const TopArea = styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    gap: 30px;
`;

export const AccountWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 0px;
    max-width: 1640px;
    width: 100%;
    height: 100%;
    margin-bottom: 150px;

    .account-table {
        scrollbar-width: thin;
        scrollbar-color: #D5D5D5 #FAFBFD;
    }

    .table-pagination {
        .MuiTablePagination-toolbar {
            padding-top: 20px;
            padding-bottom: 40px;
            .MuiTablePagination-spacer {
                display: none;
            }

            p {
                font-family: 'Nunito Sans', sans-serif;
                font-weight: 500;
                font-size: 14px;
                line-height: 100%;
                letter-spacing: 0px;
                color: #202224;
            }

            .MuiTablePagination-select {
                .MuiSelect-standard {
                    background: #fff;
                    padding: 10px 25px 10px 5px;
                    border: 0.3px solid rgb(213, 213, 213);
                    border-radius: 5px;
                }
            }

            .MuiTablePagination-actions {
                margin-left: auto;

                button {
                    appearance: none;
                    outline: none;
                    border: 0.6px solid #D5D5D5;
                    background: #FAFBFD;
                    padding: 3px 10px;

                    &.Mui-disabled {
                        opacity: 0.5;
                        pointer-events: none;
                    }
                }

                #pagination-prev-button {
                    border-radius: 8px 0px 0px 8px;
                    border-right: none;
                }

                #pagination-next-button {
                    border-radius: 0px 8px 8px 0px;
                }
            }
        }
    }
`;

export const AccountContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 40px;
    position: relative;
    background-color: #f7faf5;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    scrollbar-width: none;
    padding: 0 30px;
`;