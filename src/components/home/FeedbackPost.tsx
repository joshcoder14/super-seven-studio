'use client';

import React, { useEffect, useState } from 'react';
import { FeedbackPostWrapper, Heading, FeedbackContent, FeedbackList, PostCard } from './styles';
import { Typography, Box, CircularProgress } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteRight } from '@fortawesome/free-solid-svg-icons';
import { fetchPostedFeedbacks } from '@/lib/api/fetchFeedback';
import { PostedFeedback } from '@/types/feedback';
import { useLoading } from '@/context/LoadingContext';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import { useAuth } from '@/context/AuthContext';

export function FeedbackPost() {
    const { showLoader, hideLoader } = useLoading();
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [postedFeedbacks, setPostedFeedbacks] = useState<PostedFeedback[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { isLoggingOut } = useAuth();

    useEffect(() => {
        const loadFeedbacks = async () => {
            showLoader();
            try {
                const feedbacks = await fetchPostedFeedbacks(isLoggingOut);
                setPostedFeedbacks(feedbacks);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load feedbacks');
            } finally {
                setIsInitialLoad(false);
                hideLoader();
            }
        };

        // Simulate initial load (you can remove this if you want immediate API call)
        const timer = setTimeout(() => {
            loadFeedbacks();
        }, 300);

        return () => clearTimeout(timer);
    }, [showLoader, hideLoader]);
    if (isInitialLoad) {
        return (
            <FeedbackPostWrapper>
                <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                    <CircularProgress />
                </Box>
            </FeedbackPostWrapper>
        );
    }

    if (error) {
        return (
            <FeedbackPostWrapper>
                <Typography color="error">{error}</Typography>
            </FeedbackPostWrapper>
        );
    }

    return (
        <FeedbackPostWrapper>
            <Heading>
                What our <Typography component="span">Clients say?</Typography>
            </Heading>
            <FeedbackContent>
                <FeedbackList>
                    {postedFeedbacks.length > 0 ? (
                        <Swiper
                            modules={[Pagination, Autoplay]}
                            spaceBetween={30}
                            slidesPerView={1}
                            loop={true}
                            speed={2000}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                            }}
                            pagination={{
                                clickable: true,
                            }}
                            breakpoints={{
                                320: {
                                    slidesPerView: 1,
                                    spaceBetween: 20
                                },
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 30
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 40
                                }
                            }}
                        >
                            {postedFeedbacks.map((feedback) => (
                                <SwiperSlide key={feedback.id}>
                                    <PostCard>
                                        <Box className="quote-icon">
                                            <FontAwesomeIcon icon={faQuoteRight} />
                                        </Box>
                                        <Box className="feedback-details">
                                            <Typography component="p">
                                                {feedback.feedback_detail}
                                            </Typography>
                                        </Box>
                                        <Box className="event-name">
                                            <Typography component="span">{feedback.event_name}</Typography>
                                        </Box>
                                    </PostCard>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                            No feedbacks available yet
                        </Typography>
                    )}
                </FeedbackList>
            </FeedbackContent>
        </FeedbackPostWrapper>
    );
}