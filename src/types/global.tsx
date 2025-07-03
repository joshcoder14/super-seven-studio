import { Dayjs } from 'dayjs';

export interface BookingEvent {
  id: number;
  eventTitle: string;
  customerName: string;
  start: Date;
  end: Date;
  venue: string;
  packageType: string;
  ceremony_time: string;
  status: 'pending' | 'unavailable' | 'approved';
  resource?: string;
}

export interface StatusFilters {
  pending: boolean;
  unavailable: boolean;
  booked: boolean;
}

export interface ApiBooking {
  id: number;
  booking_date: {
    iso: string;
    formatted: string;
    day: number;
    month: number;
    year: number;
    time: string;
  };
  event_name: string;
  customer_name: string;
  ceremony_time: string;
  booking_address: string;
  booking_status: string;
  package: string;
}

export interface UnavailableDate {
  id: number;
  date: string;
}

export interface CreateBookingData {
  first_name: string;
  last_name: string;
  email: string;
  contact_no: string;
  address: string;
  booking_address: string;
  event_name: string;
  booking_date: string;
  formatted_booking_date: string;
  ceremony_time: string;
  package_id: number;
  addon_id: number[];
}


export interface BookingFormData {
  bookingDate: Dayjs | null;
  formattedBookingDate: string;
  eventName: string;
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  contactNumber: string;
  bookingAddress: string;
  ceremonyTime: Dayjs;
}