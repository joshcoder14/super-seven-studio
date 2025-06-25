'use client';
import { Box, styled } from "@mui/material";
import { max } from "@/types/breakpoints";
import "../../app/globals.css";

export const Heading = styled(Box)`
    width: 100%;
    height: auto;
    margin-bottom: 37px;
    
    h1 {
        font-family: Nunito Sans;
        font-weight: 700;
        font-size: 32px;
        line-height: 100%;
        letter-spacing: -0.11px;
        color: #202224;
        text-align: center;
        padding: 0px;
        margin: 0 0 15px 0;

        ${max.sm} {
            font-size: 20px;
        }
    }

    p {
        font-family: Nunito Sans;
        font-weight: 500;
        font-size: 18px;
        line-height: 100%;
        letter-spacing: -0.06px;
        color: #202224;
        text-align: center;
        opacity: 0.8;
        padding: 0px;
        margin: 0px;
    }
`

export const FormWrapper = styled(Box)`
    width: 100%;
    height: auto;

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 15px;

        .label {
            width: 100%;
            display: flex;
            justify-content: space-between;

            label {
                font-family: Nunito Sans;
                font-weight: 500;
                font-size: 18px;
                line-height: 100%;
                letter-spacing: -0.06px;
                color: #202224;
                opacity: 0.8;
            }

            a {
                font-family: Nunito Sans;
                font-weight: 500;
                font-size: 18px;
                line-height: 100%;
                letter-spacing: -0.06px;
                text-align: right;
                color: #202224;
                opacity: 0.6;
            }
        }

        input[type="email"], input[type="password"], input[type="text"] {
            font-family: Nunito Sans;
            font-weight: 500;
            font-size: 18px;
            line-height: 100%;
            letter-spacing: -0.06px;
            color: #A6A6A6;
            border-radius: 8px;
            padding: 16px;
            background: #F1F4F9;
            border: 1px solid #D8D8D8;
            width: 100%;
            height: 50px;
            appearance: none;

            &:focus, &:active, &:hover, &:focus-visible {
                background: #F1F4F9;
                border: 1px solid #D8D8D8;
                outline: none;
            }

            &:-webkit-autofill, &:-internal-autofill-selected {
                background-color: #F1F4F9 !important;
            }

        }

        span.error {
            font-family: Nunito Sans;
            font-weight: 500;
            font-size: 18px;
            line-height: 100%;
            letter-spacing: -0.06px;
            color: #FF0000;
            text-align: center;
            opacity: 0.8;
            margin-top: 10px;
        }
    }
`;

export const LoginWrapper = styled(Box)`
    width: 100%;
    height: 100%;

    form {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 30px;

        .remember {
            display: flex;
            align-items: center;
            gap: 12px;

            input {
                width: 24px;
                height: 24px;
                border-radius: 6px;
                border: 0.6px solid #A3A3A3;
                appearance: none;
                cursor: pointer;
                position: relative;

                &:checked {
                    background-color: transparent;  
                    border-color: #A3A3A3;
                    
                    &::after {
                        content: '\f00c';
                        font-family: 'Font Awesome 6 Free';
                        font-weight: 900;
                        position: absolute;
                        font-size: 14px;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                }
            }

            label {
                font-family: Nunito Sans;
                font-weight: 500;
                font-size: 18px;
                line-height: 100%;
                letter-spacing: -0.06px;
                color: #202224;
                opacity: 0.6;
            }
        }

        button {
            display: flex;
            justify-content: center;
            align-items: center;
            max-width: 418px;
            width: 100%;
            height: 56px;
            border-radius: 8px;
            background: #2BB673;
            font-family: Nunito Sans;
            font-weight: 700;
            font-size: 20px;
            line-height: 100%;
            letter-spacing: -0.07px;
            text-align: center;
            color: #FFFFFF;
            margin-top: 0px;
            margin-bottom: 18px;
            margin-left: auto;
            margin-right: auto;
            appearance: none;
            border: none;
            cursor: pointer;
        }
    }

    .sign-up {
        width: 100%;
        height: auto;

        p {
            font-family: Nunito Sans;
            font-weight: 500;
            font-size: 18px;
            line-height: 100%;
            letter-spacing: -0.06px;
            opacity: 0.65;
            text-align: center;

            a {
                font-family: Nunito Sans;
                font-weight: 600;
                font-size: 18px;
                line-height: 100%;
                letter-spacing: -0.06px;
                text-align: right;
                text-decoration: underline;
                text-decoration-style: solid;
                text-underline-offset: 3px;
                text-decoration-thickness: 0%;
                color: #2BB673;
            }
        }
    }
`

export const LoginContainer = styled(Box)`
    max-width: 630px;
    width: 100%;
    height: auto;
    // min-height: 735px;
    border-radius: 24px;
    background: #FFFFFF;
    border: 0.3px solid #B9B9B9;
    padding: 60px;
    padding-top: 20px;
    zoom: 0.8;

    @media (max-width: 600px) {
        padding: 30px 30px 40px 30px;
        margin: 20px;
    }

    .logo {
        display: flex;
        justify-content: center;
    }
`

export const Login = styled('section')`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    padding: 0;
    margin: 0;
    background: #2BB673;
    z-index: 3;
`;