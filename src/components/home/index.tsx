'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Modal,
  styled 
} from '@mui/material';
import { FeedbackPost } from '@/components/home/FeedbackPost';
import { DashboardPackageCard } from '@/components/PackageCard/DashboardPackage';
import { 
  HomeContentContainer, 
  ImageContainer, 
  TopImageContainer, 
  BottomImageContainer,
  BottomImageContent, 
  BoxContent, 
  BoxWithShadow,
  ArrowLeft, 
  ArrowRight, 
  SlideContent,
  AnimatedBox
} from './styles';
import { CloseButton } from '@/sections/booking/styles';
import { icons } from '@/icons';
import Image from 'next/image';
import { regularEvents, bigEvents } from './MapImages';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLoading } from '@/context/LoadingContext';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';

// Type definitions
type EventImage = {
  src: string;
  title: string;
  date?: string;
  description?: string;
  variations: string[];
};

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  padding: '20px 20px 40px',
  borderRadius: '8px',
  maxWidth: '80vw',
  maxHeight: '80vh',
  width: '100%',
  overflow: 'auto',
  position: 'relative',
}));

export default function HomeContent(): React.JSX.Element {
  const { showLoader, hideLoader } = useLoading();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [currentVariations, setCurrentVariations] = useState<string[]>([]);
  const [currentTitle, setCurrentTitle] = useState('');
  
  // Memoized event handlers
  const handleOpenModal = useCallback((variations: string[], title: string) => {
    showLoader();
    setTimeout(() => {
      setCurrentVariations(variations);
      setCurrentTitle(title);
      setOpenModal(true);
      hideLoader();
    }, 200);
  }, [showLoader, hideLoader]);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
      hideLoader();
    }, 300);

    return () => clearTimeout(timer);
  }, [hideLoader]);

  const renderBigEventSlide = (image: EventImage, index: number) => (
    <SwiperSlide key={`big-event-${index}`}>
      <SlideContent className="image-container">
        <Image 
          width={1650} 
          height={100} 
          src={image.src} 
          alt="Event Cover Image" 
          unoptimized 
          style={{ transition: 'opacity 0.5s ease-in-out' }}
          priority={index === 0} // Only prioritize first image
        />
        <BoxContent>
          <Box className="date-now">
            <AnimatedBox 
              className="date-now" 
              delay={0.3}
              key={`${index}-date-${activeIndex}`}
            >
              <Typography component="p">{image.date}</Typography>
            </AnimatedBox>
          </Box>
          <AnimatedBox delay={0.6} key={`${index}-title-${activeIndex}`}>
            <Typography component="h1">{image.title}</Typography>
          </AnimatedBox>
          <AnimatedBox delay={0.9} key={`${index}-desc-${activeIndex}`}>
            <Typography component="p">{image.description}</Typography>
          </AnimatedBox>
          <AnimatedBox delay={1.2} key={`${index}-btn-${activeIndex}`}>
            <Button 
              className="btn btn-primary"
              onClick={() => handleOpenModal(image.variations, image.title)}
            >
              View Events
            </Button>
          </AnimatedBox>
        </BoxContent>
      </SlideContent>
    </SwiperSlide>
  );

  const renderRegularEvent = (image: EventImage, index: number) => (
    <BottomImageContent className="bottom-image-content" key={`regular-event-${index}`}>
      <Image 
        width={530} 
        height={496} 
        src={image.src} 
        alt={image.title} 
        unoptimized
        loading={index > 1 ? 'lazy' : 'eager'} // Lazy load images below the fold
      />
      <BoxWithShadow>
        <Typography component="h2">{image.title}</Typography>
        <Button 
          className="btn btn-primary"
          onClick={() => handleOpenModal(image.variations, image.title)}
        >
          View More
        </Button>
      </BoxWithShadow>
    </BottomImageContent>
  );

  const renderVariationSlide = (image: string, index: number) => (
    <SwiperSlide key={`variation-${index}`}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
      }}>
        <Image 
          width={800} 
          height={500} 
          src={image} 
          alt={`Variation ${index + 1}`} 
          style={{
            objectFit: 'contain',
            maxWidth: '100%',
            maxHeight: '100%'
          }}
          unoptimized
        />
      </Box>
    </SwiperSlide>
  );

  if (isInitialLoad) {
    return (
      <></>
    );
  }

  return (
    <HomeContentContainer className="admin-home-content-container">
      <ImageContainer className="admin-image-container">
        <TopImageContainer className="top-image-container">
          <Swiper
            style={{ width: '100%', height: '430px' }}
            modules={[Navigation, Autoplay, EffectFade]}
            spaceBetween={50}
            slidesPerView={1}
            loop
            effect={'fade'}
            speed={2000}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: '.arrow-right',
              prevEl: '.arrow-left',
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          >
            {bigEvents.map(renderBigEventSlide)}
          </Swiper>
          
          <ArrowLeft className="arrow-left">
            <Image width={20} height={20} src={icons.angleLeft} alt="angle left" />
          </ArrowLeft>
          <ArrowRight className="arrow-right">
            <Image width={20} height={20} src={icons.angleRight} alt="angle right" />
          </ArrowRight>
        </TopImageContainer>
        <BottomImageContainer className="bottom-image-container">
          {regularEvents.map(renderRegularEvent)}
        </BottomImageContainer>

        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ModalContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {currentTitle}
              </Typography>
              <CloseButton onClick={handleCloseModal} aria-label="Close modal">
                <FontAwesomeIcon icon={faXmark} />
              </CloseButton>
            </Box>
            <Swiper
              style={{ width: '100%', height: '500px' }}
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              loop
              speed={1500}
              navigation={{
                nextEl: '.arrow-right-variations',
                prevEl: '.arrow-left-variations',
              }}
            >
              {currentVariations.map(renderVariationSlide)}
            </Swiper>
            <ArrowLeft className="arrow-left-variations">
              <Image width={20} height={20} src={icons.angleLeft} alt="angle left" />
            </ArrowLeft>
            <ArrowRight className="arrow-right-variations">
              <Image width={20} height={20} src={icons.angleRight} alt="angle right" />
            </ArrowRight>
          </ModalContent>
        </Modal>

        <DashboardPackageCard />

        <FeedbackPost />
      </ImageContainer>
    </HomeContentContainer>
  );
}