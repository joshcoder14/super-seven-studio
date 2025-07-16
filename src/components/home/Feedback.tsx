'use client';

import React, { useEffect, useState } from 'react';
import { FeedbackPostWrapper, Heading, FeedbackContent, FeedbackList, PostCard } from './styles';
import { Typography, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteRight } from '@fortawesome/free-solid-svg-icons';
import { fetchFeedbacks } from '@/lib/api/fetchFeedback';
import { MappedFeedbackItem } from '@/types/feedback';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import Preloader from '../Preloader';

export function FeedbackPost() {
  const [postedFeedbacks, setPostedFeedbacks] = useState<MappedFeedbackItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const loadFeedbacks = async () => {
            try {
                setLoading(true);
                // Fetch only posted feedbacks (filterValue '1' corresponds to posted)
                const { data } = await fetchFeedbacks('', '1', 1, 10, router);
                setPostedFeedbacks(data);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load feedbacks';
                setError(errorMessage);
                console.error('Error loading feedbacks:', err);
                
                await Swal.fire({
                    title: 'Error!',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            } finally {
                setLoading(false);
            }
        };

        loadFeedbacks();
    }, [router]);

    if (loading) {
        return (
            <FeedbackPostWrapper>
                <Preloader/>
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
                    <Swiper
                        modules={[Navigation, Autoplay, EffectFade]}
                        navigation
                        autoplay={{ delay: 5000 }}
                        effect="fade"
                        fadeEffect={{ crossFade: true }}
                        slidesPerView={3}
                        spaceBetween={30}
                    >
                        {postedFeedbacks.length > 0 ? (
                            postedFeedbacks.map((feedback) => (
                                <SwiperSlide key={feedback.id}>
                                    <PostCard>
                                        <Box className="quote-icon">
                                            <FontAwesomeIcon icon={faQuoteRight} />
                                        </Box>
                                        <Box className="feedback-details">
                                            <Typography component="span">
                                                {feedback.feedback_detail || 'No feedback text available'}
                                            </Typography>
                                        </Box>
                                        <Box className="event-name">
                                            <Typography component="span">{feedback.event_name}</Typography>
                                        </Box>
                                    </PostCard>
                                </SwiperSlide>
                            ))

                        ) : (
                            <Typography>No posted feedbacks available</Typography>
                        )}
                    </Swiper>
                </FeedbackList>
            </FeedbackContent>
        </FeedbackPostWrapper>
    );
}
