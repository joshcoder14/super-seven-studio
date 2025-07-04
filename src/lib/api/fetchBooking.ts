import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { BookingEvent, UnavailableDate, BookingFormData } from '@/types/global';
import { PackageProps, AddOnsProps } from '@/types/field';

// Configure dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Helper function to normalize dates to Philippine time (Asia/Manila)
export const normalizeToPHDate = (date: Date): Date => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
};

// Fetch bookings data
export const fetchBookings = async (month: number, year: number): Promise<BookingEvent[]> => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(
    `/api/bookings?month=${month}&year=${year}&filters[booked]=true&filters[pending]=true&filters[approved]=true`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }

  const data = await response.json();
  
  if (data.status && data.data?.data) {
    return data.data.data.map((booking: any) => {
      const startDate = new Date(booking.booking_date.iso);
      const endDate = new Date(startDate);
      endDate.setHours(23, 59, 59);
      
      return {
        id: booking.id,
        eventTitle: booking.event_name,
        customerName: booking.customer_name,
        start: startDate,
        end: endDate,
        venue: booking.booking_address,
        packageType: booking.package,
        ceremony_time: booking.ceremony_time,
        status: booking.booking_status.toLowerCase() as 'pending' | 'unavailable' | 'approved'
      };
    });
  }

  return [];
};

// Fetch unavailable dates
export const fetchUnavailableDateRecords = async (month: number, year: number): Promise<UnavailableDate[]> => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('No access token found');
  }

  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };

  const response = await fetch(`/api/unavailable-dates?month=${month}&year=${year}`, { headers });

  if (!response.ok) throw new Error('Failed to fetch unavailable dates');

  const data = await response.json();
  
  return data.data?.map((d: any) => ({
    ...d,
    date: normalizeToPHDate(new Date(d.date))
  })) || [];
};

// Mark date as unavailable
export const markDateAsUnavailable = async (date: Date): Promise<UnavailableDate> => {
  const phDate = normalizeToPHDate(date);
  const isoString = dayjs(phDate).tz('Asia/Manila').format();

  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch('/api/unavailable-dates/mark', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      date: isoString
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to mark date as unavailable');
  }

  if (!data.status) {
    throw new Error(data.message || 'Date could not be disabled');
  }

  return { 
    ...data.data, 
    date: normalizeToPHDate(new Date(data.data.date)) 
  };
};

// Unmark date as available
export const unmarkDateAsAvailable = async (id: number): Promise<void> => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`/api/unavailable-dates/${id}/unmark`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to unmark date as available');
  }
};

// Booking actions
export const approveBooking = async (id: number): Promise<void> => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`/api/bookings/${id}/approve`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to approve booking');
  }
};

export const rejectBooking = async (id: number): Promise<void> => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`/api/bookings/${id}/reject`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to reject booking');
  }
};

export const cancelBooking = async (id: number): Promise<void> => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`/api/bookings/${id}/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to cancel booking');
  }
};

export const rescheduleBooking = async (
  id: number, 
  date: dayjs.Dayjs, 
  time: dayjs.Dayjs
): Promise<void> => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('No access token found');
  }

  const phDate = date.format('YYYY-MM-DD');
  const timeString = time.format('HH:mm');
  const dateTimeString = `${phDate}T${timeString}:00`;

  const response = await fetch(`/api/bookings/${id}/reschedule`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      booking_date: dateTimeString,
      ceremony_time: timeString
    })
  });

  if (!response.ok) {
    throw new Error('Failed to reschedule booking');
  }

  const data = await response.json();

  if (!data.status) {
    throw new Error(data.message || 'Failed to reschedule booking');
  }
};

// Add Booking
export const fetchApprovedBookings = async (): Promise<Date[]> => {
  try {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('Authentication required');

    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    const response = await fetch('/api/bookings/approved', { headers });
    if (!response.ok) throw new Error('Failed to fetch approved bookings');
    const data = await response.json();

    const approvedBookingDates = data.data.map((booking: any) => {
      const utcDate = new Date(booking.booking_date.iso);
      const phDate = new Date(utcDate.getTime() + (8 * 60 * 60 * 1000));
      return phDate;
    });
    return approvedBookingDates;
  } catch (err) {
    console.error('Error fetching approved bookings:', err);
    throw err;
  }
};

export const fetchUnavailableDatesForMonth = async (month: number, year: number): Promise<Date[]> => {
  try {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return [];

    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    const response = await fetch(`/api/unavailable-dates?month=${month}&year=${year}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch unavailable dates');
    const data = await response.json();

    const newUnavailableDates = data.data.map((item: any) => new Date(item.date))
      .filter((date: Date) => !isNaN(date.getTime()));

    return newUnavailableDates;
  } catch (err) {
    console.error(`Error fetching unavailable dates for month ${month}, year ${year}:`, err);
    throw err;
  }
};

export const fetchPackagesAddOnsData = async (): Promise<{
  packages: PackageProps[];
  addOns: AddOnsProps[];
}> => {
  try {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('Authentication required');

    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    const [packagesResponse, addOnsResponse] = await Promise.all([
      fetch('/api/bookings/packages', { headers }),
      fetch('/api/addons', { headers })
    ]);

    if (!packagesResponse.ok) throw new Error('Failed to fetch packages');
    if (!addOnsResponse.ok) throw new Error('Failed to fetch add-ons');

    const packagesData = await packagesResponse.json();
    const addOnsData = await addOnsResponse.json();

    const transformedPackages = packagesData.data.map((pkg: any) => ({
      id: pkg.id,
      packageName: pkg.package_name
    }));

    const transformedAddOns = addOnsData.data.data.map((addOn: any) => ({
      id: addOn.id,
      addOnName: addOn.add_on_name,
      addOnDetails: addOn.add_on_details,
      addOnPrice: addOn.add_on_price
    }));

    return {
      packages: transformedPackages,
      addOns: transformedAddOns
    };
  } catch (err) {
    console.error('Error fetching packages and add-ons:', err);
    throw err;
  }
};

export const submitBooking = async (
  formData: BookingFormData,
  selectedPackage: string,
  selectedAddOns: number[],
  packages: PackageProps[]
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('Authentication required');

    const selectedPkg = packages.find(pkg => pkg.packageName === selectedPackage);
    if (!selectedPkg) throw new Error('Please select a valid package');

    const form = new FormData();

    form.append('first_name', formData.firstName);
    form.append('last_name', formData.lastName);
    form.append('email', formData.email);
    form.append('contact_no', formData.contactNumber);
    form.append('address', formData.address);
    form.append('booking_address', formData.bookingAddress);
    form.append('event_name', formData.eventName);
    form.append('booking_date', formData.bookingDate?.format('YYYY-MM-DD') || '');
    form.append('formatted_booking_date', formData.formattedBookingDate || '');
    form.append('ceremony_time', formData.ceremonyTime.format('HH:mm'));
    form.append('package_id', String(selectedPkg.id));

    selectedAddOns.forEach((addonId, index) => {
      form.append(`addon_id[${index}]`, String(addonId));
    });

    const response = await fetch('/api/bookings/add', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: form,
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.errors) {
        const result: Record<string, string> = {};
        Object.entries(data.errors).forEach(([key, value]) => {
          result[key] = Array.isArray(value) ? value.join(' ') : String(value);
          if (key === 'booking_date') {
            result['bookingDate'] = result[key];
          }
        });
        throw { message: data.message || 'Booking faileds', errors: result };
      }
      throw new Error(data.message || 'Booking faileds');
    }

    return data;
  } catch (err) {
    console.error('Error submitting booking:', err);
    throw err;
  }
};

export const fetchInitialBookingData = async (): Promise<{
  approvedDates: Date[];
  packages: PackageProps[];
  addOns: AddOnsProps[];
  initialUnavailableDates: Date[];
}> => {
  try {
    const now = new Date();
    const initialMonth = now.getMonth() + 1;
    const initialYear = now.getFullYear();
    
    // Calculate previous and next months
    let prevMonth = initialMonth - 1;
    let prevYear = initialYear;
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear -= 1;
    }
    
    let nextMonth = initialMonth + 1;
    let nextYear = initialYear;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }
    
    const [approvedDates, packagesData, initialUnavailableDates] = await Promise.all([
      fetchApprovedBookings(),
      fetchPackagesAddOnsData(),
      Promise.all([
        fetchUnavailableDatesForMonth(prevMonth, prevYear),
        fetchUnavailableDatesForMonth(initialMonth, initialYear),
        fetchUnavailableDatesForMonth(nextMonth, nextYear)
      ]).then(results => results.flat())
    ]);

    return {
      approvedDates,
      ...packagesData,
      initialUnavailableDates
    };
  } catch (err) {
    console.error('Error fetching initial booking data:', err);
    throw err;
  }
};

// Update Booking
export const fetchBookingPackages = async (): Promise<PackageProps[]> => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) throw new Error('Authentication required');

  const response = await fetch('/api/bookings/packages', {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (!response.ok) throw new Error('Failed to fetch packages');

  const data = await response.json();
  return data.data?.map((pkg: any) => ({
    id: pkg.id,
    packageName: pkg.package_name || 'Unknown Package'
  })) || [];
};

export const fetchAddOns = async (): Promise<AddOnsProps[]> => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) throw new Error('Authentication required');

  const response = await fetch('/api/addons', {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (!response.ok) throw new Error('Failed to fetch add-ons');

  const data = await response.json();
  return data.data?.data?.map((addOn: any) => ({
    id: addOn.id,
    addOnName: addOn.add_on_name || 'Unknown Add-on',
    addOnDetails: addOn.add_on_details || '',
    addOnPrice: addOn.add_on_price || 0
  })) || [];
};

export const fetchBookingDetails = async (bookingId: string) => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) throw new Error('Authentication required');

  const response = await fetch(`/api/bookings/${bookingId}`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (!response.ok) throw new Error('Failed to fetch booking data');

  return await response.json();
};

export const updateBooking = async (
  bookingId: string,
  bookingData: {
    booking_date: string;
    package_id: number;
    event_name: string;
    booking_address: string;
    addon_id: number[];
    ceremony_time: string
  }
) => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) throw new Error('Authentication required');

  const formData = new FormData();
  formData.append("booking_date", bookingData.booking_date);
  formData.append("package_id", bookingData.package_id.toString());
  formData.append("event_name", bookingData.event_name);
  formData.append("booking_address", bookingData.booking_address);
  formData.append("ceremony_time", bookingData.ceremony_time);
  
  bookingData.addon_id.forEach((id, index) => {
    formData.append(`addon_id[${index}]`, id.toString());
  });

  const response = await fetch(`/api/bookings/${bookingId}/update`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    body: formData
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to update booking');
  }

  return await response.json();
};