'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BookingContainer, BookingContent, LeftContent,
  AddBooking, BigCalendar, StatusFilter,
  EventHeading, EventDetails, Details, CloseButton
} from './styles';
import { HeadingComponent } from '@/components/Heading';
import AddBookingComponent from './AddBooking';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import CheckboxComponent from '@/components/checkbox';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { icons } from '@/icons';
import type { BookingEvent, StatusFilters, UnavailableDate } from '@/types/global';
import CustomDatePicker from '@/components/datepicker';
import CustomTimePicker from '@/components/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import {
  fetchBookings,
  fetchUnavailableDateRecords,
  markDateAsUnavailable,
  unmarkDateAsAvailable,
  approveBooking,
  rejectBooking,
  cancelBooking,
  rescheduleBooking,
  normalizeToPHDate
} from '@/lib/api/fetchBooking';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export function BookingComponent(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<BookingEvent[]>([]);
  const [unavailableDates, setUnavailableDates] = useState<UnavailableDate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<BookingEvent | null>(null);
  const [isSelectOpen, setIsSelectOpen] = useState(true);
  const [rescheduleDate, setRescheduleDate] = useState<Dayjs | null>(null);
  const [rescheduleTime, setRescheduleTime] = useState<Dayjs | null>(null);
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [timeError, setTimeError] = useState<string | undefined>(undefined);

  const showAddBooking = searchParams.get('add') === 'true';
  const [statusFilters, setStatusFilters] = useState<StatusFilters>({
    booked: true,
    pending: true,
    unavailable: true,
  });

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      
      const [bookings, unavailable] = await Promise.all([
        fetchBookings(month, year),
        fetchUnavailableDateRecords(month, year)
      ]);
      
      setEvents(bookings);
      setUnavailableDates(unavailable);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle add booking click
  const handleAddBookingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('add', 'true');
    router.push(`/booking?${newSearchParams.toString()}`);
  };

  const handleCancelBooking = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('add');
    router.push(`/booking?${newSearchParams.toString()}`);
  };

  // Calendar day styling
  const dayPropGetter = useCallback((date: Date) => {
    const normalizedDate = normalizeToPHDate(date);

    const hasApprovedEvent = events.some(event => 
      event.status === 'approved' &&
      normalizeToPHDate(new Date(event.start)).getTime() === normalizedDate.getTime()
    );

    const isManuallyDisabled = unavailableDates.some(d => 
      normalizeToPHDate(new Date(d.date)).getTime() === normalizedDate.getTime()
    );

    const isDisabled = hasApprovedEvent || isManuallyDisabled;

    return {
      className: isDisabled ? 'disabled-day' : '',
      style: {
        backgroundColor: isDisabled ? '#f5f5f5' : '',
        color: isDisabled ? '#ccc' : '',
        cursor: isDisabled ? 'not-allowed' : 'pointer'
      }
    };
  }, [unavailableDates, events]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current && !selectRef.current.contains(event.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsSelectOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle status filter change
  const handleStatusFilterChange = (name: keyof StatusFilters) => {
    setStatusFilters(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Handle event click
  const handleEventClick = (event: BookingEvent) => {
    setSelectedEvent(event);
  };

  // Handle date selection (mark/unmark unavailable)
  const handleDateSelect = async (start: Date) => {
    const normalizedStart = normalizeToPHDate(start);
    const unavailableDate = unavailableDates.find(d => 
      normalizeToPHDate(new Date(d.date)).getTime() === normalizedStart.getTime()
    );

    if (unavailableDate) {
      const result = await Swal.fire({
        title: 'Enable Date?',
        text: 'This date is currently marked as unavailable. Would you like to make it available for bookings?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, enable it',
        cancelButtonText: 'Cancel',
        reverseButtons: true
      });

      if (result.isConfirmed) {
        try {
          await unmarkDateAsAvailable(unavailableDate.id);
          await fetchData();
          Swal.fire('Date Enabled!', 'This date is now available for bookings.', 'success');
        } catch (err) {
          Swal.fire('Error', err instanceof Error ? err.message : 'Failed to enable date', 'error');
        }
      }
      return;
    }

    const hasBooking = events.some(event => 
      normalizeToPHDate(new Date(event.start)).getTime() === normalizedStart.getTime()
    );

    if (hasBooking) {
      Swal.fire(
        'Date Unavailable',
        'This date already has a booking (approved or pending). Please resolve the booking first.',
        'warning'
      );
      return;
    }

    const result = await Swal.fire({
      title: 'Disable Date?',
      text: 'Would you like to disable this date for bookings?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, disable it',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await markDateAsUnavailable(normalizedStart);
        await fetchData();
        Swal.fire('Date Disabled!', 'This date has been marked as unavailable.', 'success');
      } catch (err) {
        Swal.fire('Error', err instanceof Error ? err.message : 'Failed to disable date', 'error');
      }
    }
  };

  // Handle booking actions
  const handleAction = async (action: 'reschedule' | 'reject' | 'approve' | 'update' | 'cancel') => {
    if (!selectedEvent) return;

    if (action === 'reschedule') {
      setShowRescheduleForm(true);
      setRescheduleDate(dayjs(selectedEvent.start));
      setRescheduleTime(dayjs(selectedEvent.ceremony_time, 'HH:mm'));
      return;
    }

    if (action === 'update') {
      router.push(`/booking/${selectedEvent.id}/edit`);
      return;
    }

    // Check if there are other pending bookings for the same date
    const otherPendingBookings = events.filter(event => 
      event.id !== selectedEvent.id &&
      event.status === 'pending' &&
      normalizeToPHDate(new Date(event.start)).getTime() === normalizeToPHDate(selectedEvent.start).getTime()
    );

    let confirmationMessage = '';
    if (action === 'approve') {
      if (otherPendingBookings.length > 0) {
        confirmationMessage = "This will automatically reject other pending bookings for the same date.";
      } else {
        confirmationMessage = "Are you sure you want to approve this booking?";
      }
    } else {
      confirmationMessage = `Are you sure you want to ${action} this booking? This action cannot be undone.`;
    }

    const confirmation = await Swal.fire({
      title: `Are you sure you want to ${action} this booking?`,
      text: confirmationMessage,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Proceed`,
      cancelButtonText: 'Cancel',
      customClass: {
        container: 'swal-z-index'
      }
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    setIsLoading(true);
    try {
      switch(action) {
        case 'approve':
          await approveBooking(selectedEvent.id);

          const otherPendingBookings = events.filter(event => 
            event.id !== selectedEvent.id &&
            event.status === 'pending' &&
            normalizeToPHDate(new Date(event.start)).getTime() === normalizeToPHDate(selectedEvent.start).getTime()
          );

          await Promise.all(otherPendingBookings.map(booking => 
            rejectBooking(booking.id)
          ));

          setEvents(prevEvents => 
            prevEvents.map(event => {
              if (event.id === selectedEvent.id) {
                return { ...event, status: 'approved' };
              }
              if (otherPendingBookings.some(b => b.id === event.id)) {
                return { ...event, status: 'unavailable' };
              }
              return event;
            })
          );

          await fetchData();
          Swal.fire('Approved!', 'The booking has been approved and other pending bookings for this date have been rejected.', 'success');
          break;

        case 'reject':
          await rejectBooking(selectedEvent.id);
          setEvents(prevEvents => 
            prevEvents.map(event => 
              event.id === selectedEvent.id 
                ? { ...event, status: 'unavailable' } 
                : event
            )
          );
          await fetchData();
          Swal.fire('Rejected!', 'The booking has been rejected.', 'success');
          break;
        
        case 'cancel':
          await cancelBooking(selectedEvent.id);
          await fetchData();
          Swal.fire({
            title: 'Cancelled!',
            text: 'The booking has been cancelled.',
            icon: 'success',
            customClass: {
              container: 'swal-z-index'
            }
          });
          break;
      }
    } catch (err) {
      Swal.fire('Error', err instanceof Error ? err.message : 'An unknown error occurred', 'error');
      console.error('Error handling action:', err);
    } finally {
      setIsLoading(false);
      setSelectedEvent(null);
    }
  };

  // Handle reschedule submission
  const handleRescheduleSubmit = async () => {
    if (!selectedEvent || !rescheduleDate || !rescheduleTime || !rescheduleTime.isValid()) {
      Swal.fire({
        title: 'Error',
        text: 'Please select a valid date and time',
        icon: 'error',
        customClass: {
          container: 'swal-z-index'
        }
      });
      return;
    }
    // Check if the new date is the same as the original date
  const originalDate = dayjs(selectedEvent.start);
  if (rescheduleDate.isSame(originalDate, 'day')) {
    Swal.fire({
      title: 'Same Date',
      text: 'Please select a different date for rescheduling',
      icon: 'warning',
      customClass: {
        container: 'swal-z-index'
      }
    });
    return;
  }

    setIsLoading(true);
    try {
      await rescheduleBooking(selectedEvent.id, rescheduleDate, rescheduleTime);
      await fetchData();
      Swal.fire({
        title: 'Success!',
        text: 'Booking has been rescheduled',
        icon: 'success',
        customClass: {
          container: 'swal-z-index'
        }
      });
      setShowRescheduleForm(false);
      setSelectedEvent(null);
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err instanceof Error ? err.message : 'Failed to reschedule booking',
        icon: 'error',
        customClass: {
          container: 'swal-z-index'
        }
      });
      console.error('Error rescheduling booking:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Custom event component
  const CustomEvent = ({ event }: { event: BookingEvent }) => {
    const getEventStyle = () => {
      const baseStyle = {
        color: 'white',
        padding: '5px',
        borderRadius: '4px',
        fontSize: '12px',
        height: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      };

      switch(event.status) {
        case 'approved':
          return { ...baseStyle, backgroundColor: '#979797' };
        case 'pending':
          return { ...baseStyle, backgroundColor: '#FFA500' };
        case 'unavailable':
          return { ...baseStyle, backgroundColor: '#CCCCCC' };
        default:
          return { ...baseStyle, backgroundColor: '#FF7B00' };
      }
    };

    return (
      <div style={getEventStyle()}>
        {event.eventTitle}
      </div>
    );
  };

  // Filter events based on status filters
  const filteredEvents = events.filter(event => {
    return (
      (statusFilters.pending && event.status === "pending") ||
      (statusFilters.unavailable && event.status === "unavailable") ||
      (statusFilters.booked && event.status === "approved")
    );
  });

  // Get nearest upcoming event
  const nearestEvent = events
    .filter(event => event.status === 'approved' && event.start > new Date())
    .sort((a, b) => a.start.getTime() - b.start.getTime())[0];

  // Get disabled dates for date picker
  const disabledDates = [
    ...events
      .filter(event => event.status === 'approved')
      .map(event => dayjs(normalizeToPHDate(new Date(event.start)))),
    ...unavailableDates.map(d => dayjs(normalizeToPHDate(new Date(d.date))))
  ];

  return (
    <BookingContainer>
      <HeadingComponent />

      {!showAddBooking && (
        <BookingContent>
          <LeftContent>
            <AddBooking sx={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '20px' }}>
              <Box
                component="button"
                className="add-booking-link"
                onClick={(e) => handleAddBookingClick(e)}
                sx={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  color: 'inherit',
                  cursor: 'pointer',
                }}
              >
                <FontAwesomeIcon icon={faPlus} style={{ fontSize: 14, pointerEvents: 'none', marginRight: 5 }} />
                Add New Booking
              </Box>
            </AddBooking>

            <StatusFilter>
              <Box
                className="status"
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                sx={{ cursor: 'pointer', position: 'relative' }}
              >
                <label htmlFor="statusFilter">Status</label>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{
                    position: 'absolute',
                    right: '25px',
                    top: '27px',
                    transform: isSelectOpen ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%) rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    pointerEvents: 'none',
                    color: '#202224'
                  }}
                />
              </Box>
              <Box
                id="status-filter-dropdown"
                className={`dropdown-checkbox ${isSelectOpen ? 'open' : ''}`}
                ref={dropdownRef}
                sx={{ display: isSelectOpen ? 'block' : 'none' }}
              >
                <CheckboxComponent id='approved' name='approved' label='Approved' checked={statusFilters.booked} onChange={() => handleStatusFilterChange('booked')} />
                <CheckboxComponent id='pending' name='pending' label='Pending' checked={statusFilters.pending} onChange={() => handleStatusFilterChange('pending')} />
              </Box>
            </StatusFilter>

            <Box className="upcoming-event" sx={{ borderTop: '1px solid #E0E0E0', paddingTop: '20px' }}>
              <EventHeading>Upcoming Event</EventHeading>
              <EventDetails sx={{ borderRadius: '22px' }}>
                {isLoading ? (
                  <div className="no-events">Loading events...</div>
                ) : error ? (
                  <div className="no-events">Error loading events</div>
                ) : nearestEvent ? (
                  <ul>
                    <li key={nearestEvent.id}>
                      <span className="label">{nearestEvent.eventTitle}</span>
                      <span className="date">{format(nearestEvent.start, 'MMMM d yyyy')} {nearestEvent.ceremony_time}</span>
                      <span className="package-type">{nearestEvent.packageType}</span>
                      <span className="venue">{nearestEvent.venue}</span>
                    </li>
                  </ul>
                ) : (
                  <div className="no-events">No upcoming approved events scheduled</div>
                )}
              </EventDetails>
            </Box>
          </LeftContent>

          <BigCalendar>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                Loading calendar...
              </div>
            ) : error ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'red' }}>
                Error loading calendar data
              </div>
            ) : (
              <Calendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 750 }}
                views={['month', 'week', 'day', 'agenda']}
                view={currentView}
                date={currentDate}
                onView={view => setCurrentView(view as typeof currentView)}
                onNavigate={date => setCurrentDate(date)}
                selectable
                dayPropGetter={dayPropGetter}
                onSelectSlot={({ start }) => handleDateSelect(start)}
                onSelectEvent={handleEventClick}
                components={{
                  event: CustomEvent
                }}
              />
            )}
          </BigCalendar>
        </BookingContent>
      )}

      {selectedEvent && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: '#0000002e',
          boxShadow: 3,
          zIndex: 12,
          p: 3,
          overflowY: 'auto'
        }}>
          <Details>
            <CloseButton onClick={() => setSelectedEvent(null)}>
              <FontAwesomeIcon icon={faXmark} />
            </CloseButton>
            
            {showRescheduleForm ? (
              <Box className="reschedule-form">
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Reschedule Booking
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <CustomDatePicker
                    label="New Booking Date"
                    value={rescheduleDate}
                    onChange={setRescheduleDate}
                    shouldDisableDate={(date) => {
                      return disabledDates.some(d => d.isSame(date, 'day'));
                    }}
                  />
                </Box>

                <Box className="time-picker" sx={{ mb: 3 }}>
                  <CustomTimePicker
                    label="New Ceremony Time"
                    value={rescheduleTime}
                    onChange={(newTime) => {
                      setRescheduleTime(newTime);
                      setTimeError(newTime && !newTime.isValid() ? "Invalid time format" : undefined);
                    }}
                    error={timeError}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setShowRescheduleForm(false)}
                    disabled={isLoading}
                    sx={{ 
                      flex: 1,
                      backgroundColor: '#979797',
                      color: '#fff',
                      borderColor: '#979797',
                      appearance: 'none',
                      '&:hover': {
                        backgroundColor: '#757575',
                        color: '#fff',
                        borderColor: '#757575',
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleRescheduleSubmit}
                    disabled={
                      isLoading || 
                      !rescheduleDate || 
                      !rescheduleTime || 
                      !rescheduleTime.isValid() ||
                      !!timeError
                    }
                    sx={{ 
                      flex: 1,
                      backgroundColor: '#EFC026',
                      color: '#fff',
                      borderColor: '#EFC026',
                      appearance: 'none',
                      '&:hover': {
                        backgroundColor: '#cda41f',
                        color: '#fff',
                        borderColor: '#cda41f',
                      }
                    }}
                  >
                    {isLoading ? <CircularProgress size={20} /> : 'Reschedule'}
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Box 
                  className={`event-head ${selectedEvent.status === 'approved' ? 'approved' : ''}`}
                >
                  <Box className="event-icon"/>
                  <Box className="event-name">
                    <h2 className="title">{selectedEvent.eventTitle}</h2>
                    <Typography component="span" className="event-date">
                      {format(selectedEvent.start, 'EEEE, MMMM d')}
                    </Typography>
                  </Box>
                </Box>
                <Box className="event-info">
                  <Box className="left-info">
                    <Box className="client-info">
                      <Image width={20} height={20} src={icons.eventProfile} alt="profile icon" />
                      <Typography component="span">{selectedEvent.customerName}</Typography>
                    </Box>
                    <Box className="client-info">
                      <Image width={20} height={20} src={icons.packageIcon} alt="package icon" />
                      <Typography component="span">{selectedEvent.packageType}</Typography>
                    </Box>
                    <Box className="client-info">
                      <Image width={20} height={20} src={icons.clockIcon} alt="clock icon" />
                      <Typography component="span">
                        {selectedEvent.ceremony_time}
                      </Typography>
                    </Box>
                    <Box className="client-info">
                      <Image width={20} height={20} src={icons.locationIcon} alt="location icon" />
                      <Typography component="span">{selectedEvent.venue}</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box className={`action-btn ${selectedEvent.status === 'approved' ? 'approved' : ''}`}>
                  <Button 
                    className="btn reschedule" 
                    onClick={() => handleAction('reschedule')}
                    disabled={isLoading}
                  >
                    Reschedule
                  </Button>
                  {selectedEvent.status === 'approved' ? (
                    <>
                      <Button 
                        className="btn cancel" 
                        onClick={() => handleAction('cancel')}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="btn update" 
                        onClick={() => handleAction('update')}
                        disabled={isLoading}
                      >
                        Update
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        className="btn reject" 
                        onClick={() => handleAction('reject')}
                        disabled={isLoading}
                      >
                        Reject
                      </Button>
                      <Button 
                        className="btn approve" 
                        onClick={() => handleAction('approve')}
                        disabled={isLoading}
                      >
                        Approve
                      </Button>
                    </>
                  )}
                </Box>
              </>
            )}
          </Details>
        </Box>
      )}

      {showAddBooking && (
        <AddBookingComponent 
          onCancel={handleCancelBooking}
        />
      )}
    </BookingContainer>
  );
}