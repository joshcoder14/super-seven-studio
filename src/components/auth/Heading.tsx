import React from 'react';
import { Heading } from "./styles";
import { Box, Typography } from "@mui/material";

export interface HeadingProps {
    title: string;
    subText: string;
}

export default function HeadingComponent({title, subText}: HeadingProps): React.JSX.Element {
    return (
        <Heading className="heading">
            <Typography component="h1" className="title">
                {title}
            </Typography>
            <Typography component="p">
                {subText}
            </Typography>
        </Heading>
    )
}
