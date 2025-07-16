'use client'

import React from 'react';
import { Box, Button, styled, Typography } from '@mui/material';
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
    ArrowRight, 
    SlideContent 
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

export const AnimatedBox = styled(Box)<{ delay: number }>`
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp 0.5s ease-out forwards;
  animation-delay: ${props => props.delay}s;

  @keyframes fadeUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

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
                                <SlideContent className="image-container">
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
                                            <AnimatedBox className="date-now" delay={0.3}>
                                                <Typography component="p">{image.date}</Typography>
                                            </AnimatedBox>
                                        </Box>
                                        <AnimatedBox delay={0.6}>
                                            <Typography component="h1">{image.title}</Typography>
                                        </AnimatedBox>
                                        <AnimatedBox delay={0.9}>
                                            <Typography component="p">{image.description}</Typography>
                                        </AnimatedBox>
                                        <AnimatedBox delay={1.2}>
                                            <Button className="btn btn-primary">View Events</Button>
                                        </AnimatedBox>

                                    </BoxContent>
                                </SlideContent>
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