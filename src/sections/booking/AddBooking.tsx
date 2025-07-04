'use client';

import React, { useState, useEffect } from 'react';
import { AddBookingContainer, BookingWrapper } from './styles';
import { FormHeading } from '@/components/Heading/FormHeading';
import { FormSection, FormField } from '@/types/field';
import { Box, TextField, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { icons } from '@/icons';
import Image from 'next/image';
import { paths } from '@/paths';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import dayjs, { Dayjs } from 'dayjs';
import { PackageProps, AddOnsProps } from '@/types/field';
import {
  fetchInitialBookingData,
  fetchUnavailableDatesForMonth,
  submitBooking,
} from '@/lib/api/fetchBooking';
import CustomDatePicker from '@/components/datepicker';
import CustomTimePicker from '@/components/TimePicker';
import {
  sanitizeInput,
  sanitizeEmail,
  sanitizePhone,
  validateName,
  validateEmail,
  validatePhone,
} from '@/utils/validation';

interface AddBookingComponentProps {
  onCancel: () => void;
}

export default function AddBookingComponent({ onCancel }: AddBookingComponentProps) {
  const [state, setState] = useState({
    isPackageDropdownOpen: false,
    selectedPackage: "",
    packages: [] as PackageProps[],
    addOns: [] as AddOnsProps[],
    selectedAddOns: [] as number[],
    disabledDates: [] as Date[],
    loading: {
      packages: true,
      addOns: true,
      submitting: false,
      disabledDates: true
    },
    error: {
      packages: null as string | null,
      addOns: null as string | null,
      disabledDates: null as string | null,
      form: null as string | null
    },
    formData: {
      bookingDate: null as Dayjs | null,
      formattedBookingDate: "",
      eventName: "",
      firstName: "",
      lastName: "",
      address: "",
      email: "",
      contactNumber: "",
      bookingAddress: "",
      ceremonyTime: dayjs() as Dayjs,
    },
    errors: {} as Record<string, string>
  });

   // Show SweetAlert for form errors
  useEffect(() => {
    if (state.error.form) {
      Swal.fire({
        title: 'Error!',
        text: state.error.form,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2BB673',
      }).then(() => {
        setState(prev => ({ ...prev, error: { ...prev.error, form: null } }));
      });
    }
  }, [state.error.form]);

  // Show SweetAlert for package loading errors
  useEffect(() => {
    if (state.error.packages) {
      Swal.fire({
        title: 'Loading Error',
        text: state.error.packages,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2BB673',
      });
    }
  }, [state.error.packages]);

  // Show SweetAlert for add-ons loading errors
  useEffect(() => {
    if (state.error.addOns) {
      Swal.fire({
        title: 'Loading Error',
        text: state.error.addOns,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2BB673',
      });
    }
  }, [state.error.addOns]);

  // Show SweetAlert for disabled dates loading errors
  useEffect(() => {
    if (state.error.disabledDates) {
      Swal.fire({
        title: 'Warning',
        text: `Couldn't load all date restrictions: ${state.error.disabledDates}`,
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2BB673',
      });
    }
  }, [state.error.disabledDates]);

  const formatBookingDate = (date: Date) => {
    return format(date, "MMMM d, yyyy (eeee)");
  };

  const shouldDisableDate = (date: Dayjs) => {
    const jsDate = new Date(date.year(), date.month(), date.date());
    
    return state.disabledDates.some(disabledDate => {
      const disabledDateObj = new Date(disabledDate);
      const disabledDateNormalized = new Date(disabledDateObj.getFullYear(), disabledDateObj.getMonth(), disabledDateObj.getDate());
      
      return disabledDateNormalized.getTime() === jsDate.getTime();
    });
  };

  const validateDate = (date: Dayjs | null): boolean => {
    if (!date) return false;
    
    const jsDate = new Date(date.year(), date.month(), date.date());
    
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 30);
    minDate.setHours(0, 0, 0, 0);
    
    if (jsDate.getTime() < minDate.getTime()) return false;
    
    return !state.disabledDates.some(disabledDate => {
      const disabledDateObj = new Date(disabledDate);
      const disabledDateLocal = new Date(
        disabledDateObj.getFullYear(),
        disabledDateObj.getMonth(),
        disabledDateObj.getDate()
      );
      return disabledDateLocal.getTime() === jsDate.getTime();
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const { approvedDates, packages, addOns, initialUnavailableDates } = await fetchInitialBookingData();
        
        setState(prev => ({
          ...prev,
          disabledDates: [...approvedDates, ...initialUnavailableDates],
          packages,
          addOns,
          loading: { 
            ...prev.loading, 
            packages: false,
            addOns: false,
            disabledDates: false
          }
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          error: {
            ...prev.error,
            disabledDates: err instanceof Error ? err.message : 'Failed to load disabled dates',
            packages: err instanceof Error ? err.message : 'Failed to load packages',
            addOns: err instanceof Error ? err.message : 'Failed to load add-ons'
          },
          loading: {
            ...prev.loading,
            packages: false,
            addOns: false,
            disabledDates: false
          }
        }));
      }
    };

    loadData();
  }, []);

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      const jsDate = date.toDate();
      const isValid = validateDate(date);
      
      setState(prev => ({
        ...prev,
        formData: {
          ...prev.formData,
          bookingDate: date,
          formattedBookingDate: formatBookingDate(jsDate)
        },
        errors: {
          ...prev.errors,
          booking_date: isValid ? "" : "Date is unavailable or must be at least 30 days from today",
          bookingDate: isValid ? "" : "Date is unavailable or must be at least 30 days from today"
        }
      }));
    }
  };

  const handleMonthChange = (date: Dayjs) => {
    const month = date.month() + 1;
    const year = date.year();
    fetchUnavailableDatesForMonth(month, year)
      .then(newDates => {
        setState(prev => {
          const existingDates = new Set(prev.disabledDates.map(d => 
            new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
          ));
          
          const uniqueNewDates = newDates.filter((date: Date) => {
            const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return !existingDates.has(normalizedDate.getTime());
          });
          
          return {
            ...prev,
            disabledDates: [...prev.disabledDates, ...uniqueNewDates]
          };
        });
      })
      .catch(err => {
        console.error('Error fetching unavailable dates:', err);
      });
  };

  const bookingForm: FormSection[] = [
    {
      id: "booking-date",
      columnCount: 1,
      fields: [
        {
          id: "booking-date",
          name: "bookingDate",
          label: "Booking Date",
          type: "custom-date",
          required: true
        }
      ]
    },
    {
      id: "event-name",
      columnCount: 1,
      fields: [
        {
          id: "event-name",
          name: "eventName",
          label: "Event Name",
          type: "text",
          required: true
        }
      ]
    },
    {
      id: "first-name",
      columnCount: 1,
      fields: [
        {
          id: "first-name",
          name: "firstName",
          label: "First Name",
          type: "text",
          required: true
        }
      ]
    },
    {
      id: "last-name",
      columnCount: 1,
      fields: [
        {
          id: "last-name",
          name: "lastName",
          label: "Last Name",
          type: "text",
          required: true
        }
      ]
    },
    {
      id: "address",
      columnCount: 1,
      fields: [
        {
          id: "address",
          name: "address",
          label: "Address",
          type: "text",
          required: true
        }
      ]
    },
    {
      id: "email",
      columnCount: 1,
      fields: [
        {
          id: "email",
          name: "email",
          label: "Email Address",
          type: "email",
          required: true
        }
      ]
    },
    {
      id: "contact-number",
      columnCount: 1,
      fields: [
        {
          id: "contact-number",
          name: "contactNumber",
          label: "Contact Number",
          type: "text",
          required: true,
          maxChar: 11
        }
      ]
    }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const { formData } = state;

    // Sanitize all input fields
    const sanitizedData = {
      firstName: sanitizeInput(formData.firstName),
      lastName: sanitizeInput(formData.lastName),
      email: sanitizeEmail(formData.email),
      contactNumber: sanitizePhone(formData.contactNumber),
      address: sanitizeInput(formData.address),
      bookingAddress: sanitizeInput(formData.bookingAddress),
      eventName: sanitizeInput(formData.eventName)
    };

    // Validate booking date
    if (!formData.bookingDate) {
      newErrors.booking_date = 'Booking date is required';
      newErrors.bookingDate = 'Booking date is required';
    } else if (!validateDate(formData.bookingDate)) {
      newErrors.booking_date = 'Date is unavailable or must be at least 30 days from today';
      newErrors.bookingDate = 'Date is unavailable or must be at least 30 days from today';
    }

    // Validate first name
    const firstNameError = validateName('First name', formData.firstName);
    if (firstNameError) newErrors.first_name = firstNameError;

    // Validate last name
    const lastNameError = validateName('Last name', formData.lastName);
    if (lastNameError) newErrors.last_name = lastNameError;

    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    // Validate contact number
    const phoneError = validatePhone(formData.contactNumber);
    if (phoneError) newErrors.contact_no = phoneError;

    // Validate other required fields
    if (!sanitizedData.eventName.trim()) newErrors.event_name = 'Event name is required';
    if (!sanitizedData.address.trim()) newErrors.address = 'Address is required';
    if (!sanitizedData.bookingAddress.trim()) newErrors.booking_address = 'Booking address is required';
    if (!state.selectedPackage) newErrors.package_id = 'Please select a package';

    // Update state with sanitized data and errors
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        ...sanitizedData
      },
      errors: newErrors
    }));

    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Filter out numbers for first and last name fields
    let filteredValue = value;
    if (name === 'firstName' || name === 'lastName') {
      filteredValue = value.replace(/[0-9]/g, '');
    } else if (name === 'contactNumber') {
      filteredValue = value.replace(/\D/g, '');
    }

    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: name === 'contactNumber' ? value.replace(/\D/g, '') : value
      },
      errors: {
        ...prev.errors,
        [name]: '',
        [name === 'firstName' ? 'first_name' : 
         name === 'lastName' ? 'last_name' :
         name === 'contactNumber' ? 'contact_no' :
         name === 'eventName' ? 'event_name' :
         name === 'bookingAddress' ? 'booking_address' : name]: ''
      }
    }));
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

  const handlePackageSelect = (packageName: string) => {
    setState(prev => ({
      ...prev,
      selectedPackage: packageName,
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
      const data = await submitBooking(
        state.formData,
        state.selectedPackage,
        state.selectedAddOns,
        state.packages
      );

      await Swal.fire({
        title: 'Success!',
        text: 'Booking created successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      
      window.location.href = paths.booking;
    } catch (err: any) {
      console.error('Booking error:', err);
      setState(prev => ({
        ...prev,
        error: {
          ...prev.error,
          form: err instanceof Error ? err.message : 'Booking failed'
        },
        errors: err.errors || {},
        loading: {
          ...prev.loading,
          submitting: false
        }
      }));
    } finally {
      setState(prev => ({
        ...prev,
        loading: {
          ...prev.loading,
          submitting: false
        }
      }));
    }
  };

  const renderFormField = (field: FormField) => {
    if (field.type === "custom-date") {
      return (
        <CustomDatePicker
          key={field.id}
          value={state.formData.bookingDate}
          onChange={handleDateChange}
          onMonthChange={handleMonthChange}
          label="Booking Date"
          required
          error={state.errors.bookingDate || state.errors.booking_date}
          minDate={dayjs().add(30, 'day')}
          shouldDisableDate={shouldDisableDate}
        />
      );
    }

    const backendFieldName = 
      field.name === 'firstName' ? 'first_name' :
      field.name === 'lastName' ? 'last_name' :
      field.name === 'contactNumber' ? 'contact_no' :
      field.name === 'eventName' ? 'event_name' :
      field.name === 'bookingAddress' ? 'booking_address' : field.name;

    return (
      <Box className="form-group" key={field.id}>
        <label className="form-label">{field.label}</label>
        <TextField 
          name={field.name}
          type={field.type}
          value={state.formData[field.name as keyof typeof state.formData]}
          onChange={handleInputChange}
          variant="outlined" 
          size="small" 
          fullWidth 
          required={field.required}
          error={!!state.errors[field.name] || !!state.errors[backendFieldName]}
          helperText={state.errors[field.name] || state.errors[backendFieldName]}
          inputProps={{
            maxLength: field.maxChar
          }}
        />
      </Box>
    );
  };

  const handleCancel = () => {
    onCancel();
  }

  return (
    <AddBookingContainer>
      <BookingWrapper>
        <FormHeading title="Add New Booking"/>

        {state.error.disabledDates && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Couldn't load all date restrictions: {state.error.disabledDates}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: '20px', flexDirection: 'column', width: '50%' }}>
            {bookingForm.map(section => (
              <Box 
                className={`row col-${section.columnCount}`} 
                key={section.id}
                sx={{ display: 'flex', gap: '20px', width: '100%' }}
              >
                {section.fields.map(field => renderFormField(field))}
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: '20px', flexDirection: 'column', width: '50%' }}>
            <Box className="form-group">
              <label className="form-label">Package:</label>
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
                          onClick={() => handlePackageSelect(pkg.packageName)}
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

            <CustomTimePicker 
              value={state.formData.ceremonyTime}
              onChange={handleTimeChange}
              label="Ceremony Time"
            />

            <Box className="form-group">
              <label className="form-label">Booking Address:</label>
              <TextField
                name="bookingAddress"
                value={state.formData.bookingAddress}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                fullWidth
                required
                error={!!state.errors.bookingAddress || !!state.errors.booking_address}
                helperText={state.errors.bookingAddress || state.errors.booking_address}
              />
            </Box>

            <Box className="form-group">
              <label className="form-label">Add-Ons:</label>
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

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleCancel}
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
                {state.loading.submitting ? 'Submitting...' : 'Submit Booking'}
              </Button>
            </Box>
          </Box>
        </form>
      </BookingWrapper>
    </AddBookingContainer>
  );
}