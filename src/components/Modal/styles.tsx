import { Box, styled } from "@mui/material";

export const EventButton = styled(Box)`
    width: 100%;
    height: auto;
    display: flex;
    justify-content: flex-end !important;
    align-items: center;
    gap: 10px;

    .btn {
        width: fit-content;
        height: fit-content;
        padding: 12px 24px !important;
        color: #FFFFFF;
        font-weight: 600;
        font-size: 14px;
        line-height: 100%;
        border-radius: 8px;
        cursor: pointer;
        appearance: none;
        border: none;
        box-shadow: none;

        &.submit {
            background-color: #2BB673 !important;

            &:hover {
                background-color: #155D3A !important;
            }
        }
    }
`;
export const EventInput = styled(Box)`
    width: 100%;
    height: auto;
    padding-top: 28px;

    #outlined-textarea {
        font-family: Nunito Sans;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
    }
`;
export const EventInfo = styled(Box)`
    width: 100%;
    height: auto;
    border-top: 1px solid #E0E0E0;
    padding-top: 18px;
    margin-top: 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    p {
        font-family: Nunito Sans;
        font-weight: 600;
        font-size: 18px;
        line-height: 24px;
        color: #202224;
        padding: 0;
        margin: 0;
    }

    span {
        font-family: Nunito Sans;
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
        color: #202224;
        padding: 0;
        margin: 0;
    }
`;
export const EventName = styled(Box)`
    width: 100%;
    height: auto;
`;
export const EventIcon = styled(Box)`
    background: #2BB673 !important;
    width: 14px !important;
`;
export const EventHead = styled(Box)`
    width: 100%;
    height: auto;
`;

export const ModalContainer = styled(Box)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #0000002e;
    box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12);
    z-index: 12;
    padding: 24px;
    overflow-y: auto;

    .details {
        max-width: 400px;
    }
`;