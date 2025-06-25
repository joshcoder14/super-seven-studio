'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BookingContainer, BookingContent, LeftContent,
  AddBooking, BigCalendar, StatusFilter,
  EventHeading, EventDetails
} from './styles';
import { HeadingComponent } from '@/components/Heading';
import AddBookingComponent from './AddBooking';
import { Box } from '@mui/material';
import CheckboxComponent from '@/components/checkbox';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface BookingEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  venue: string;
  packageType: string;
  status: 'confirmed' | 'pending' | 'unavailable';
  resource?: any;
}

interface StatusFilters {
  booking: boolean;
  pending: boolean;
  unavailable: boolean;
}

export function BookingComponent(): React.JSX.Element {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [showAddBooking, setShowAddBooking] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const [events, setEvents] = useState<BookingEvent[]>([
    {
      id: 1,
      title: "Mikha's Debut",
      start: new Date(),
      end: new Date(new Date().setHours(new Date().getHours() + 2)),
      venue: "Henan Resort",
      packageType: "Package B",
      status: "confirmed"
    },
    {
      id: 2,
      title: "Wedding Anniversary",
      start: new Date(new Date().setDate(new Date().getDate() + 1)),
      end: new Date(new Date().setDate(new Date().getDate() + 1.5)),
      venue: "Garden Oasis",
      packageType: "Package A",
      status: "pending"
    }
  ]);

  const [statusFilters, setStatusFilters] = useState<StatusFilters>({
    booking: true,
    pending: true,
    unavailable: true
  });

  const handleAddEvent = useCallback((newEvent: BookingEvent) => {
    setEvents(prev => [...prev, newEvent]);
  }, []);

  const handleDateDisable = (date: Date) => {
    const isDisabled = disabledDates.some(d =>
      d.getDate() === date.getDate() &&
      d.getMonth() === date.getMonth() &&
      d.getFullYear() === date.getFullYear()
    );

    if (isDisabled) return;

    Swal.fire({
      title: 'Disable Date?',
      text: "Would you like to disable this day for bookings?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, disable it',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        setDisabledDates([...disabledDates, date]);
        Swal.fire('Date Disabled!', 'This date has been marked as unavailable.', 'success');
      }
    });
  };

  const dayPropGetter = useCallback((date: Date) => {
    const isDisabled = disabledDates.some(d =>
      d.getDate() === date.getDate() &&
      d.getMonth() === date.getMonth() &&
      d.getFullYear() === date.getFullYear()
    );

    return {
      className: isDisabled ? 'disabled-day' : '',
      style: {
        backgroundColor: isDisabled ? '#f5f5f5' : '',
        color: isDisabled ? '#ccc' : '',
        cursor: isDisabled ? 'not-allowed' : 'pointer'
      }
    };
  }, [disabledDates]);

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

  const handleStatusFilterChange = (name: keyof StatusFilters) => {
    setStatusFilters(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const filteredEvents = events.filter(event => {
    if (statusFilters.booking && event.status === "confirmed") return true;
    if (statusFilters.pending && event.status === "pending") return true;
    if (statusFilters.unavailable && event.status === "unavailable") return true;
    return false;
  });

  const eventStyleGetter = (event: BookingEvent) => {
    let backgroundColor = '#3174ad';
    if (event.packageType === "Package A") backgroundColor = '#ff9f89';
    if (event.packageType === "Package B") backgroundColor = '#a4bdfc';
    if (event.packageType === "Package C") backgroundColor = '#7ae7bf';

    let borderColor = '#3174ad';
    if (event.status === "pending") borderColor = '#ffb347';
    if (event.status === "unavailable") borderColor = '#d3d3d3';

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        color: '#fff',
        border: '0px',
      }
    };
  };

  const nearestEvent = events
    .filter(event => event.start > new Date())
    .sort((a, b) => a.start.getTime() - b.start.getTime())[0];

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
                onClick={() => setShowAddBooking(true)}
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
                ref={selectRef}
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                sx={{ cursor: 'pointer', position: 'relative' }}
              >
                <label htmlFor="statusFilter">Status</label>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{
                    position: 'absolute',
                    right: '0px',
                    top: '10px',
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
                <CheckboxComponent id='booking' name='booking' label='Booking' checked={statusFilters.booking} onChange={() => handleStatusFilterChange('booking')} />
                <CheckboxComponent id='pending' name='pending' label='Pending' checked={statusFilters.pending} onChange={() => handleStatusFilterChange('pending')} />
                <CheckboxComponent id='unavailable' name='unavailable' label='Unavailable' checked={statusFilters.unavailable} onChange={() => handleStatusFilterChange('unavailable')} />
              </Box>
            </StatusFilter>

            <Box className="upcoming-event" sx={{ borderTop: '1px solid #E0E0E0', paddingTop: '20px' }}>
              <EventHeading>Upcoming Event</EventHeading>
              <EventDetails sx={{ borderRadius: '22px' }}>
                {nearestEvent ? (
                  <ul>
                    <li key={nearestEvent.id}>
                      <span className="label">{nearestEvent.title}</span>
                      <span className="date">{format(nearestEvent.start, 'MMMM d, h:mm a')}</span>
                      <span className="package-type">{nearestEvent.packageType}</span>
                      <span className="venue">{nearestEvent.venue}</span>
                    </li>
                  </ul>
                ) : (
                  <div className="no-events">No upcoming events scheduled</div>
                )}
              </EventDetails>
            </Box>
          </LeftContent>

          <BigCalendar>
            <Calendar
              localizer={localizer}
              events={filteredEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              views={['month', 'week', 'day', 'agenda']}
              view={currentView}
              date={currentDate}
              onView={view => setCurrentView(view as typeof currentView)}
              onNavigate={date => setCurrentDate(date)}
              selectable
              dayPropGetter={dayPropGetter}
              onSelectSlot={({ start }) => {
                const isDisabled = disabledDates.some(d =>
                  d.getDate() === start.getDate() &&
                  d.getMonth() === start.getMonth() &&
                  d.getFullYear() === start.getFullYear()
                );
                if (isDisabled) {
                  Swal.fire('Date Unavailable', 'This date has been disabled for bookings', 'warning');
                  return;
                }
                handleDateDisable(start);
              }}
              onSelectEvent={(event: BookingEvent) => {
                Swal.fire({
                  title: `Delete "${event.title}"?`,
                  text: "You won't be able to revert this!",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Yes, delete it!',
                  cancelButtonText: 'No, keep it',
                  reverseButtons: true
                }).then(result => {
                  if (result.isConfirmed) {
                    setEvents(events.filter(e => e.id !== event.id));
                    Swal.fire('Deleted!', 'Your event has been deleted.', 'success');
                  }
                });
              }}
              eventPropGetter={eventStyleGetter}
              components={{
                event: ({ event }) => <div><strong>{event.title}</strong></div>
              }}
            />
          </BigCalendar>
        </BookingContent>
      )}

      {showAddBooking && (
        <AddBookingComponent />
      )}
    </BookingContainer>
  );
}
