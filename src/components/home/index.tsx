'use client'

import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { 
    HomeContentContainer, 
    ImageContainer, 
    TopImageContainer, 
    BottomImageContainer,
    BottomImageContent, 
    BoxContent, 
    BoxWithShadow, 
    ArrowButton, 
    ArrowLeft, 
    ArrowRight 
} from './styles';
import { icons } from '@/icons';
import Image from 'next/image';
import { bottomImages, swiperImage } from './MapImages';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';

export function HomeContent(): React.JSX.Element {
    return (
        <HomeContentContainer className="admin-home-content-container">
            <ImageContainer className="admin-image-container">

                <TopImageContainer className="top-image-container">
                    <Swiper
                        style={{ width: '100%', height: '430px' }}
                        modules={[Navigation, Autoplay, EffectFade]}
                        spaceBetween={50}
                        slidesPerView={1}
                        loop={true}
                        effect={'fade'}
                        speed={1000}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        navigation={{
                            nextEl: '.arrow-right',
                            prevEl: '.arrow-left',
                        }}
                    >
                        {swiperImage.map((image, index) => (
                            <SwiperSlide key={index}>
                                <Box className="image-container" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Image 
                                        width={1650} 
                                        height={100} 
                                        src={image.src} 
                                        alt="Event Cover Image" 
                                        unoptimized={true} 
                                        style={{
                                            transition: 'opacity 0.5s ease-in-out'
                                        }}
                                    />
                                    <BoxContent>
                                        <Box className="date-now">
                                            <Typography component="p">{image.date}</Typography>
                                        </Box>
                                        <Typography component="h1">{image.title}</Typography>
                                        <Typography component="p">{image.description}</Typography>
                                        <Button className="btn btn-primary">View Events</Button>
                                    </BoxContent>
                                </Box>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    
                    
                    <ArrowButton>
                        <ArrowLeft className="arrow-left">
                            <Image width={20} height={20} src={icons.angleLeft} alt="angle left" />
                        </ArrowLeft>
                        <ArrowRight className="arrow-right">
                            <Image width={20} height={20} src={icons.angleRight} alt="angle right" />
                        </ArrowRight>
                    </ArrowButton>
                    
                </TopImageContainer>

                <BottomImageContainer className="bottom-image-container">
                    
                    {bottomImages.map((image, index) => (
                        <BottomImageContent className="bottom-image-content" key={index}>
                            <Image 
                                width={530} 
                                height={496} 
                                src={image.src} 
                                alt={image.title} 
                                unoptimized={true}
                                key={index}
                            />
                            <BoxWithShadow>
                                <Typography component="h2">{image.title}</Typography>
                                <Button className="btn btn-primary">View More</Button>
                            </BoxWithShadow>
                        </BottomImageContent>
                    ))}
                    
                </BottomImageContainer>
            </ImageContainer>
        </HomeContentContainer>
    );
}