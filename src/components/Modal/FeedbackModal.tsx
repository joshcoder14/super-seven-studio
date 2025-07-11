'use client';

import React from 'react';
import { ModalContainer, EventHead, EventIcon, EventName, EventInfo, EventInput, EventButton } from './styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import {
  Details, CloseButton
} from '@/sections/booking/styles';
import { Typography, Button, CircularProgress, TextField  } from '@mui/material';
import { BookingEvent } from '@/types/booking';
import { format } from 'date-fns';

type FeedbackModalProps = {
  isOpen: boolean;
  onClose: () => void;
  bookingEvent: BookingEvent;
  onSubmit: (feedback: string) => void;
  isLoading?: boolean;
};

export function FeedbackModalComponent({ 
    isOpen, 
    onClose,  
    bookingEvent, 
    onSubmit,
    isLoading = false 
}: FeedbackModalProps): React.JSX.Element | null {
    const [feedback, setFeedback] = React.useState('');

    if (!isOpen) {
        return null;
    }

    const handleSubmit = () => {
        onSubmit(feedback);
    };
    
    return (
    <ModalContainer>
      <Details className="details">
        <CloseButton onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </CloseButton>
        <EventHead className='event-head'>
          <EventIcon className="event-icon"/>
          <EventName className="event-name">
            <Typography component="h2" className="title">{bookingEvent.event_name}</Typography>
            <Typography component="span" className="event-date">
              {format(bookingEvent.start, 'EEEE, MMMM d')}
            </Typography>
          </EventName>
        </EventHead>
        <EventInfo className="event-info">
          <Typography component='p'>Give Feedback</Typography>
          <Typography component='span'>How was your experience? Let us know your thoughts!</Typography>
        </EventInfo>
        <EventInput className="feedback-input">
          <TextField
            id="outlined-textarea"
            multiline
            rows={5}
            variant="outlined"
            fullWidth
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            sx={{
              backgroundColor: '#F7FAF5'
            }}
          />
        </EventInput>
        <EventButton className='action-btn'>
          <Button 
            variant="outlined" 
            className="cancel btn"
            onClick={onClose}
            disabled={isLoading}
            sx={{ 
              backgroundColor: '#979797',
              color: '#fff',
              borderColor: '#979797',
              '&:hover': {
                backgroundColor: '#757575',
                borderColor: '#757575',
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            className="submit btn"
            onClick={handleSubmit}
            disabled={isLoading || feedback.trim() === ''}
            sx={{ 
              backgroundColor: '#ffc300',
              color: '#fff',
              borderColor: '#EFC026',
              '&:hover': {
                backgroundColor: '#ddb225',
                borderColor: '#cda41f',
              }
            }}
          >
            {isLoading ? <CircularProgress size={20} /> : 'Submit'}
          </Button>
        </EventButton>
      </Details>
    </ModalContainer>
  );
}