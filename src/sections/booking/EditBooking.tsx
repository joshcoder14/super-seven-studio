'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AddBookingContainer, BookingWrapper } from './styles';
import { FormHeading } from '@/components/Heading/FormHeading';
import { HeadingComponent } from '@/components/Heading';
import { Box, Typography, Button, CircularProgress, Alert, TextField } from '@mui/material';
import { format } from 'date-fns';
import { icons } from '@/icons';
import Image from 'next/image';
import Swal from 'sweetalert2';
import dayjs, { Dayjs } from 'dayjs';
import CustomDatePicker from '@/components/datepicker';
import CustomTimePicker from '@/components/TimePicker';
import { paths } from '@/paths';
import {
  fetchBookingPackages,
  fetchAddOns,
  fetchBookingDetails,
  updateBooking
} from '@/lib/api/fetchBooking';
import { AddOnsProps, PackageProps } from '@/types/field';
import Preloader from '@/components/Preloader';

interface EditBookingProps {
  bookingId: string;
  onCancel: () => void;
}

export default function EditBookingComponent({ bookingId, onCancel }: EditBookingProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const formatBookingDate = (date: Date | string | null | { iso: string }) => {
    if (!date) return "";
    
    let parsedDate: Date;
    
    if (typeof date === 'object' && 'iso' in date) {
      parsedDate = new Date(date.iso);
    } else if (date instanceof Date) {
      parsedDate = date;
    } else {
      parsedDate = new Date(date);
    }
    
    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid date provided to formatBookingDate:', date);
      return "";
    }
    
    return format(parsedDate, "MMMM d, yyyy (eeee)");
  };

  const [state, setState] = useState({
    isPackageDropdownOpen: false,
    selectedPackage: "",
    selectedPackageId: null as number | null,
    packages: [] as PackageProps[],
    addOns: [] as AddOnsProps[],
    selectedAddOns: [] as number[],
    loading: {
      packages: true,
      addOns: true,
      submitting: false,
      initialData: true
    },
    error: {
      packages: null as string | null,
      addOns: null as string | null,
      form: null as string | null,
      initialData: null as string | null
    },
    formData: {
      bookingDate: null as Dayjs | null,
      formattedBookingDate: "",
      eventName: "",
      bookingAddress: "",
      ceremonyTime: dayjs(),
    },
    errors: {} as Record<string, string>
  });

  const fetchInitialData = async () => {
    try {
      const [packages, addOns, booking] = await Promise.all([
        fetchBookingPackages(),
        fetchAddOns(),
        fetchBookingDetails(bookingId)
      ]);

      const matchedPackage = packages.find(
        (pkg) => pkg.packageName === booking.data.package
      );

      setState(prev => ({
        ...prev,
        packages,
        addOns,
        selectedPackage: booking.data.package || '',
        selectedPackageId: matchedPackage?.id || null,
        selectedAddOns: booking.data.add_ons?.map((addon: any) => addon.id) || [],
        formData: {
          bookingDate: booking.data.booking_date ? dayjs(booking.data.booking_date.iso) : null,
          formattedBookingDate: booking.data.booking_date ? formatBookingDate(booking.data.booking_date) : "",
          eventName: booking.data.event_name || "",
          bookingAddress: booking.data.booking_address || "",
          ceremonyTime: booking.data.ceremony_time ? dayjs(booking.data.ceremony_time, 'HH:mm') : dayjs()
        },
        loading: {
          ...prev.loading,
          packages: false,
          addOns: false,
          initialData: false
        }
      }));

    } catch (err) {
      console.error('Error fetching initial data:', err);
      setState(prev => ({
        ...prev,
        loading: {
          ...prev.loading,
          packages: false,
          addOns: false,
          initialData: false
        },
        error: {
          ...prev.error,
          initialData: err instanceof Error ? err.message : 'Failed to load data'
        }
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: name === 'contactNumber' ? value.replace(/\D/g, '') : value
      },
      errors: {
        ...prev.errors,
        [name]: ''
      }
    }));
  };

  const handlePackageSelect = (packageName: string, packageId: number) => {
    setState(prev => ({
      ...prev,
      selectedPackage: packageName,
      selectedPackageId: packageId,
      isPackageDropdownOpen: false,
      errors: {
        ...prev.errors,
        package_id: ''
      }
    }));
  };

  const handleAddOnToggle = (addOnId: number) => {
    setState(prev => {
      const newSelectedAddOns = prev.selectedAddOns.includes(addOnId)
        ? prev.selectedAddOns.filter(id => id !== addOnId)
        : [...prev.selectedAddOns, addOnId];
      
      return {
        ...prev,
        selectedAddOns: newSelectedAddOns
      };
    });
  };

  const handleTimeChange = (newTime: Dayjs | null) => {
    if (newTime) {
      setState(prev => ({
        ...prev,
        formData: {
          ...prev.formData,
          ceremonyTime: newTime
        }
      }));
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setState(prev => ({
        ...prev,
        formData: {
          ...prev.formData,
          bookingDate: date,
          formattedBookingDate: formatBookingDate(date.toDate())
        }
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!state.formData.bookingDate) {
      newErrors.booking_date = 'Booking date is required';
    }
    
    if (!state.formData.eventName.trim()) {
      newErrors.event_name = 'Event name is required';
    }
    
    if (!state.formData.bookingAddress.trim()) {
      newErrors.booking_address = 'Booking address is required';
    }
    
    if (!state.selectedPackage) {
      newErrors.package_id = 'Please select a package';
    }

    setState(prev => ({ ...prev, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ 
      ...prev, 
      error: { ...prev.error, form: null },
      errors: {} 
    }));
    
    if (!validateForm()) return;

    setState(prev => ({ ...prev, loading: { ...prev.loading, submitting: true } }));

    try {
      const selectedPackage = state.packages.find(pkg => pkg.packageName === state.selectedPackage);
      if (!selectedPackage) throw new Error('Please select a valid package');

      await updateBooking(bookingId, {
        booking_date: state.formData.bookingDate?.format('YYYY-MM-DD') || '',
        package_id: selectedPackage.id,
        event_name: state.formData.eventName,
        booking_address: state.formData.bookingAddress,
        addon_id: state.selectedAddOns,
        ceremony_time: state.formData.ceremonyTime.format('HH:mm')
      });

      await Swal.fire({
        title: 'Success!',
        text: 'Booking updated successfully!',
        icon: 'success',
        customClass: {
          container: 'swal-z-index'
        }
      });

      router.push(paths.booking);

    } catch (err) {
      console.error('Error updating booking:', err);
      setState(prev => ({
        ...prev,
        error: {
          ...prev.error,
          form: err instanceof Error ? err.message : 'Failed to update booking'
        },
        loading: {
          ...prev.loading,
          submitting: false
        }
      }));
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [bookingId]);

  if (state.loading.initialData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (state.error.initialData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Alert severity="error">
          {state.error.initialData}
          <Button onClick={() => router.push('/booking')} sx={{ ml: 2 }}>
            Back to Bookings
          </Button>
        </Alert>
      </Box>
    );
  }

  if (loading) return <Preloader />;

  return (
    <AddBookingContainer>
      <HeadingComponent />
      <BookingWrapper>
        <FormHeading title="Edit Booking"/>
        
        {state.error.form && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {state.error.form}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: '20px', flexDirection: 'column', width: '60%' }}>
            {/* Booking Date */}
            <Box sx={{ display: 'flex', gap: '20px' }}>
              <Box className="form-group booking-date">
                <label className="form-label">Booking Date</label>
                <CustomDatePicker
                  value={state.formData.bookingDate}
                  onChange={handleDateChange}
                  label=""
                  error={state.errors.booking_date || ''}
                />
                {state.errors.booking_date && (
                  <Typography color="error" variant="caption">
                    {state.errors.booking_date}
                  </Typography>
                )}
              </Box>
              {/* Ceremony Time */}
              <Box className="form-group">
                <label className="form-label">Ceremony Time</label>
                <CustomTimePicker
                  value={state.formData.ceremonyTime}
                  onChange={handleTimeChange}
                  label=""
                />
              </Box>
            </Box>
                
            {/* Event Name */}
            <Box className="form-group">
              <label className="form-label">Event Name</label>
              <TextField
                name="eventName"
                value={state.formData.eventName}
                onChange={handleInputChange}
                fullWidth
                error={!!state.errors.event_name}
                helperText={state.errors.event_name}
              />
            </Box>

            {/* Booking Address */}
            <Box className="form-group">
                <label className="form-label">Reception:</label>
                <TextField
                  name="bookingAddress"
                  value={state.formData.bookingAddress}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!state.errors.booking_address}
                  helperText={state.errors.booking_address}
                />
            </Box>
            
            <Box sx={{ display: 'flex', gap: '20px' }}>
              {/* Package Selection */}
              <Box className="form-group">
                <label className="form-label">Package</label>
                {state.loading.packages ? (
                  <CircularProgress size={20} />
                ) : state.error.packages ? (
                  <Alert severity="error">{state.error.packages}</Alert>
                ) : (
                  <>
                    <Box 
                      className="package-dropdown"
                      onClick={() => setState(prev => ({ ...prev, isPackageDropdownOpen: !prev.isPackageDropdownOpen }))}
                      sx={{
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        border: state.errors.package_id ? '1px solid #d32f2f' : '1px solid #ccc',
                        borderRadius: '4px'
                      }}
                    >
                      <Typography component="span">
                        {state.selectedPackage || "Select a package"}
                      </Typography>
                      <Image
                        width={12}
                        height={7}
                        src={icons.angleDown}
                        alt="dropdown"
                        style={{
                          transform: state.isPackageDropdownOpen ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.2s ease'
                        }}
                      />
                    </Box>

                    {state.errors.package_id && (
                      <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                        {state.errors.package_id}
                      </Typography>
                    )}

                    {state.isPackageDropdownOpen && (
                      <Box 
                        className="dropdown-options"
                        sx={{
                          backgroundColor: '#F7FAF5',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          marginTop: '-10px',
                          width: '100%',
                          maxHeight: '200px',
                          overflowY: 'auto',
                        }}
                      >
                        {state.packages.map((pkg) => (
                          <Box
                            key={pkg.id}
                            onClick={() => handlePackageSelect(pkg.packageName, pkg.id)}
                            sx={{
                              padding: '8px 12px',
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: '#f5f5f5'
                              }
                            }}
                          >
                            <Typography>{pkg.packageName}</Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </>
                )}
              </Box>

              {/* Add-Ons */}
              <Box className="form-group">
                <label className="form-label">Add-Ons</label>
                {state.loading.addOns ? (
                  <CircularProgress size={20} />
                ) : state.error.addOns ? (
                  <Alert severity="error">{state.error.addOns}</Alert>
                ) : (
                  <Box 
                    className="addon-list dropdown-list"
                    sx={{ 
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      padding: '8px',
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}
                  >
                    {state.addOns.length > 0 ? (
                      state.addOns.map((addOn) => (
                        <Box 
                          key={addOn.id}
                          className="addon-item row" 
                          sx={{ 
                            display: 'flex',
                            alignItems: 'flex-start',
                            padding: '8px 0',
                            borderBottom: '1px solid #eee',
                            '&:last-child': {
                              borderBottom: 'none'
                            }
                          }}
                        >
                          <input
                            type="checkbox"
                            id={`addon-${addOn.id}`}
                            checked={state.selectedAddOns.includes(addOn.id)}
                            onChange={() => handleAddOnToggle(addOn.id)}
                            style={{ 
                              marginRight: '12px',
                              width: '18px',
                              height: '18px'
                            }}
                          />
                          <label htmlFor={`addon-${addOn.id}`} style={{ flex: 1 }}>
                            <Typography fontWeight="600" textTransform="capitalize">
                              {addOn.addOnName}
                            </Typography>
                          </label>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No add-ons available
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={onCancel}
                sx={{
                  color: '#FFFFFF',
                  borderColor: '#AAAAAA',
                  backgroundColor: '#AAAAAA',
                  '&:hover': {
                    backgroundColor: '#898989',
                    color: 'white'
                  },
                  padding: '10px 15px',
                  fontSize: '14px',
                  fontWeight: '500 !important'
                }}
              >
                Cancel
              </Button>

              <Button 
                variant="contained" 
                type="submit"
                disabled={state.loading.submitting}
                startIcon={state.loading.submitting ? <CircularProgress size={20} /> : null}
                sx={{
                  backgroundColor: '#2BB673',
                  '&:hover': {
                    backgroundColor: '#155D3A'
                  },
                  padding: '10px 15px',
                  fontSize: '14px',
                  fontWeight: '500 !important'
                }}
              >
                {state.loading.submitting ? 'Updating...' : 'Update Booking'}
              </Button>
            </Box>
          </Box>
        </form>
      </BookingWrapper>
    </AddBookingContainer>
  );
}