import React from 'react';
import { Heading } from "../../sections/settings/styles";
import { Typography } from "@mui/material";

export function FormHeading({title}: {title: string}): React.JSX.Element {
    return (
        <Heading className="heading-component">
            <Typography component="h2">{title}</Typography>
        </Heading>
    )
}
