'use client';

import React, { useState } from 'react';
import { AddBookingContainer, BookingWrapper } from './styles';
import { FormHeading } from '../../components/Heading/FormHeading';
import { FormSection, FormField } from '@/types/field';
import { Box, TextField, Typography } from '@mui/material';
import { icons } from '@/icons';
import Image from 'next/image';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import { PackageProps, AddOnsProps } from '@/types/field'

export default function AddBookingComponent() {
    const [isPackageDropdownOpen, setIsPackageDropdownOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState("");
    const [isAddOnDropdownOpen, setIsAddOnDropdownOpen] = useState(false);
    
    const bookingForm: FormSection[] = [
        {
            id: "booking-date",
            columnCount: 1,
            fields: [
                {
                    id: "booking-date",
                    name: "booking-date",
                    label: "Booking Date",
                    type: "text",
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
                    name: "event-name",
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
                    name: "first-name",
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
                    name: "last-name",
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
                    name: "contact-number",
                    label: "Contact Number",
                    type: "text",
                    required: true,
                    maxChar: 11
                }
            ]
        }
    ]

    const addOns: AddOnsProps[] = [
        {
            id: "1",
            addOnName: "Addon A",
            addOnDetails: "This is the details of addon a",
            addOnPrice: "1600.00"
        },
        {
            id: "2",
            addOnName: "Addon B",
            addOnDetails: "Addon B details",
            addOnPrice: "500.00"
        },
        {
            id: "3",
            addOnName: "Addon C",
            addOnDetails: "Addon C details",
            addOnPrice: "800.00"
        }
    ]

    const packageOption = [
        {
            id: "1",
            package_name: "Package A"
        },
        {
            id: "2",
            package_name: "Package B"
        },
        {
            id: "3",
            package_name: "Package C"
        }
    ]

    const handleStatusClick = () => {
        setIsPackageDropdownOpen(prev => !prev);
    };

    const handlePackageSelect = (status: string) => {
        setSelectedPackage(status);
        setIsPackageDropdownOpen(false);
    };

    const handleAddOnsClick = () => {
        setIsAddOnDropdownOpen(prev => !prev);
    };

    const renderFormField = (field: FormField) => {
        return (
            <Box 
                className="form-group" 
                key={field.id}
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '10px', 
                    width: '100%'
                }}
            >
                <label className="form-label">{field.label}</label>
                <TextField 
                    name={field.name}
                    type={field.type}
                    // value={formData[field.name as keyof typeof formData]}
                    // onChange={handleInputChange}
                    variant="outlined" 
                    size="small" 
                    fullWidth 
                    required={field.required}
                    // error={!!errors[field.name]}
                    // helperText={errors[field.name]}
                    // inputProps={{
                    //     maxLength: field.maxChar
                    // }}
                />
            </Box>
        );
    };

    return (
        <AddBookingContainer>
            <BookingWrapper>
                <FormHeading title="Add New Booking"/>
                <form action="">
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
                    <Box sx={{ display: 'flex', gap: '20px', flexDirection: 'column', width: '50%'  }}>
                        <Box className="form-group">
                            <Box className="label">
                                Package:
                            </Box>
                            <Box className="package dropdown" onClick={handleStatusClick}>
                                <Typography component="span">{selectedPackage}</Typography>
                                <Image
                                    width={12}
                                    height={7}
                                    src={icons.angleDown}
                                    alt="angle down"
                                    className={isPackageDropdownOpen ? 'rotated' : ''}
                                />
                                
                                <input type="hidden" id='package' name="package" />
                            </Box>

                            {isPackageDropdownOpen && (
                                <Box className="dropdown-list">
                                    {packageOption.map((status) => (
                                        <Box
                                            className="row status-option"
                                            key={status.id}
                                            onClick={() => handlePackageSelect(status.package_name)}
                                        >
                                            <Typography component="span">{status.package_name}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            )}

                        </Box>
                        
                        {/* Event start time */}
                        <Box className="form-group">
                            <label className="form-label">Event Start Time</label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['TimePicker']}>
                                    <TimePicker />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Box>

                        <Box className="form-group">
                            {/* Booking Address */}
                            <label className="form-label">Booking Address</label>
                            <TextField variant="outlined" size="small" fullWidth className="form-control" />
                        </Box>

                        <Box className="form-group">
                            <Box className="label">
                                Add-Ons:
                            </Box>
                            <Box 
                                className="dropdown-list" 
                                sx={{ 
                                    height: 'auto !important',  
                                    marginTop: '0px !important' 
                                }}
                            >
                                {addOns.map((addons) => (
                                    <Box className="row" key={addons.id} sx={{ border: 'none !important', padding: '20px !important' }}>
                                        <Box className="checkbox">
                                            <input
                                                type="checkbox"
                                                id={`employee-${addons.id + 1}`}
                                                name="employee"
                                                value={addons.addOnName}
                                            />
                                            <label htmlFor={`employee-${addons.id + 1}`}>
                                                {addons.addOnName}
                                            </label>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </form>
            </BookingWrapper>
        </AddBookingContainer>
    )
}