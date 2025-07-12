import { Box, styled} from "@mui/material";

export const ArrowRight = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 41px;
    height: 41px;
    border-radius: 50%;
    opacity: 0.73;
    background: #F4F4F4;

    img {
        width: 12px;
        height: auto;
        object-fit: contain;
    }
`;

export const ArrowLeft = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 41px;
    height: 41px;
    border-radius: 50%;
    opacity: 0.73;
    background: #F4F4F4;

    img {
        width: 12px;
        height: auto;
        object-fit: contain;
    }
`;

export const ArrowButton = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0 24px;
`;

export const BoxWithShadow = styled(Box)`
    position: absolute;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.85) 34.38%, rgba(255, 255, 255, 0.95) 100%);
    backdrop-filter: blur(4px);
    width: 100%;
    height: 25%;
    bottom: 0;
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 17px 20px;
    border-radius: 0px 0px 19px 19px;

    h2 {
        font-family: Nunito Sans;
        font-weight: 700;
        font-size: 18px;
        line-height: 20px;
        letter-spacing: 0px;
        color: #202224;
    }

    .btn {
        font-family: Nunito Sans;
        font-weight: 500;
        font-size: 14px;
        line-height: 28px;
        letter-spacing: 1px;
        text-transform: capitalize;
        color: #FFFFFF;
        width: fit-content;
        height: auto;
        padding: 8px 23px;
        border-radius: 11px;
        background: #2BB673;
    }
`;

export const BoxContent = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: absolute;
    top: 15%;
    left: 10%;

    .date-now {
        font-family: Nunito Sans;
        font-weight: 500;
        font-size: 16px;
        line-height: 30px;
        color: #FFFFFF;
    }

    h1 {
        max-width: 555px;
        width: 100%;
        font-family: Nunito Sans;
        font-weight: 900;
        font-size: 37px;
        line-height: 48px;
        letter-spacing: 0px;
        color: #FFFFFF;
    }

    p {
        font-family: Nunito Sans;
        font-weight: 500;
        font-size: 16px;
        line-height: 30px;
        letter-spacing: 0px;
        color: #FFFFFF;
        opacity: 0.8;
    }

    .btn {
        font-family: Nunito Sans;
        font-weight: 500;
        font-size: 14px;
        line-height: 28px;
        letter-spacing: 1px;
        text-transform: capitalize;
        color: #FFFFFF;
        width: fit-content;
        height: auto;
        padding: 8px 23px;
        border-radius: 11px;
        background: #2BB673;
        margin-top: 22px;
    }
`;

export const HomeContentContainer = styled(Box)`
    display: flex;
    margin-bottom: 150px;
    background-color: #f7faf5;
`;

export const ImageContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 40px;

    @media (max-width: 1024px) {
        flex-direction: column;
        gap: 20px;
    }
`;

export const TopImageContainer = styled(Box)`
    display: flex;
    width: 100%;
    max-height: 430px;
    min-height: 430px;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
    border-radius: 19px;

    @media (max-width: 1024px) {
        min-height: unset;
        max-height: unset;
    }

    img{
        width: 100%;
    }
`;

export const BottomImageContainer = styled(Box)`
    display: flex;
    flex-direction: row;
    gap: 30px;
    width: 100%;
    height: 100%;
    min-height: 496px;
    max-height: 498px;
    justify-content: center;
    align-items: center;

    @media (max-width: 1024px) {
        min-height: unset;
        max-height: unset;
        flex-direction: column;
        gap: 20px;
    }
`;

export const BottomImageContent = styled(Box)`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    position: relative;
    border-radius: 19px;

    @media (max-width: 1024px) {
        min-height: 300px;
    }

    img{
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 19px;
    }
`;
