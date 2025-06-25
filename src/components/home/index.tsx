'use client'

import React from 'react';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import { HomeContentContainer, ImageContainer, TopImageContainer, BottomImageContainer,BottomImageContent, BoxContent, BoxWithShadow, ArrowButton, ArrowLeft, ArrowRight } from './styles';


const topImage ='assets/adminHome/top-image.png';
const arrowleft = 'assets/icons/angle-left-solid.svg';
const arrowRight = 'assets/icons/angle-right-solid.svg';

const bottomImages = [
    {
        src: 'assets/adminHome/wedding.png',
        title: 'Kai and Patrick Wedding',
        link: '/package'
    },
    {
        src: 'assets/adminHome/solo-beach.png',
        title: 'Harold and Lonie Prenup',
        link: '/package'
    },
    {
        src: 'assets/adminHome/group-beach.png',
        title: 'Jose Marie’s Birthday',
        link: '/package'
    }
]

export function HomeContent(): React.JSX.Element {
    return (
        <HomeContentContainer className="admin-home-content-container">
            <ImageContainer className="admin-image-container">

                <TopImageContainer className="top-image-container">
                    <img src={topImage} alt="" />
                    <BoxContent>
                        <Box className="date-now">
                            Today, January 2
                        </Box>
                        <Typography component="h1">Crafting Superb Moments with SuperSeven Studio</Typography>
                        <Typography component="p">A lot of different packages to choose from and affordable!</Typography>
                        <Link href="/package" className="btn btn-primary">View Packages</Link>
                    </BoxContent>
                    <ArrowButton>
                        <ArrowLeft>
                            <img src={arrowleft} alt="arrow left" />
                        </ArrowLeft>
                        <ArrowRight>
                            <img src={arrowRight} alt="arrow right" />
                        </ArrowRight>
                    </ArrowButton>
                </TopImageContainer>

                <BottomImageContainer className="bottom-image-container">
                    
                    {bottomImages.map((image, index) => (
                        <BottomImageContent className="bottom-image-content" key={index}>
                            <img src={image.src} alt=""  key={index}/>
                            <BoxWithShadow>
                                <Typography component="h2">{image.title}</Typography>
                                <Link href={image.link} className="btn btn-primary">View More</Link>
                            </BoxWithShadow>
                        </BottomImageContent>
                    ))}
                    
                </BottomImageContainer>
            </ImageContainer>
        </HomeContentContainer>
    );
}