'use client';

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import { FormContainer } from './styles';
import { FormHeading } from '../../components/Heading/FormHeading';
import { useAuth } from '@/context/AuthContext';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import {
  sanitizeInput,
  sanitizeEmail,
  sanitizePhone,
  validateName,
  validateEmail,
  validatePhone,
} from '@/utils/validation';
import { updateUserProfile } from '@/lib/api/fetchCurrentUser';

export function EditProfile(): React.JSX.Element {
    const { user, loading: authLoading, updateUser } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        address: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.first_name || '',
                middleName: user.mid_name || '',
                lastName: user.last_name || '',
                email: user.email || '',
                contactNumber: user.contact_no || '',
                address: user.address || '',
            });
        }
    }, [user]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        const firstNameError = validateName('First name', formData.firstName);
        if (firstNameError) newErrors.firstName = firstNameError;
        
        const lastNameError = validateName('Last name', formData.lastName);
        if (lastNameError) newErrors.lastName = lastNameError;
        
        if (formData.middleName) {
            const middleNameError = validateName('Middle name', formData.middleName);
            if (middleNameError) newErrors.middleName = middleNameError;
        }
        
        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;
        
        const phoneError = validatePhone(formData.contactNumber);
        if (phoneError) newErrors.contactNumber = phoneError;
        
        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let sanitizedValue = value;
        
        if (name === 'email') {
            sanitizedValue = sanitizeEmail(value);
        } else if (name === 'contactNumber') {
            sanitizedValue = sanitizePhone(value);
        } else {
            sanitizedValue = sanitizeInput(value);
        }
        
        setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
        
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let error: string | null = null;

        if (name === 'firstName') {
            error = validateName('First name', value);
        } else if (name === 'middleName' && value) {
            error = validateName('Middle name', value);
        } else if (name === 'lastName') {
            error = validateName('Last name', value);
        } else if (name === 'email') {
            error = validateEmail(value);
        } else if (name === 'contactNumber') {
            error = validatePhone(value);
        } else if (name === 'address' && !value.trim()) {
            error = 'Address is required';
        }

        if (error) {
            setErrors(prev => ({ ...prev, [name]: error as string }));
        } else if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("first_name", formData.firstName);
            formDataToSend.append("mid_name", formData.middleName);
            formDataToSend.append("last_name", formData.lastName);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("contact_no", formData.contactNumber);
            formDataToSend.append("address", formData.address);

            const updatedUser = await updateUserProfile(formDataToSend);
            
            updateUser(updatedUser);
            
            await Swal.fire({
                title: 'Success!',
                text: 'Profile updated successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            
            router.push(paths.home);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Your changes will not be saved',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, discard changes',
            cancelButtonText: 'No, keep editing'
        }).then((result) => {
            if (result.isConfirmed) {
                router.push(paths.home);
            }
        });
    };

    if (authLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return <div>User not found.</div>;
    }

    return (
        <FormContainer>
            <Box className="wrapper">
                <FormHeading title="Edit Profile"/>

                <form onSubmit={handleSubmit}>
                    <Box className="row col-3">
                        <Box className="form-group">
                            <label className="form-label">First Name</label>
                            <TextField
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                variant="outlined"
                                size="small"
                                fullWidth
                                className="form-control"
                                required
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                            />
                        </Box>
                        <Box className="form-group">
                            <label className="form-label">Middle Name</label>
                            <TextField
                                name="middleName"
                                value={formData.middleName}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                variant="outlined"
                                size="small"
                                fullWidth
                                className="form-control"
                                error={!!errors.middleName}
                                helperText={errors.middleName}
                            />
                        </Box>
                        <Box className="form-group">
                            <label className="form-label">Last Name</label>
                            <TextField
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                variant="outlined"
                                size="small"
                                fullWidth
                                className="form-control"
                                required
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                            />
                        </Box>
                    </Box>

                    <Box className="row col-2">
                        <Box className="form-group">
                            <label className="form-label">Email Address</label>
                            <TextField
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                variant="outlined"
                                size="small"
                                fullWidth
                                className="form-control"
                                required
                                disabled
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Box>
                        <Box className="form-group">
                            <label className="form-label">Contact Number</label>
                            <TextField
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                variant="outlined"
                                size="small"
                                fullWidth
                                className="form-control"
                                error={!!errors.contactNumber}
                                helperText={errors.contactNumber}
                            />
                        </Box>
                    </Box>

                    <Box className="row col-1">
                        <Box className="form-group">
                            <label className="form-label">Address</label>
                            <TextField
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                variant="outlined"
                                size="small"
                                fullWidth
                                className="form-control"
                                required
                                error={!!errors.address}
                                helperText={errors.address}
                            />
                        </Box>
                    </Box>

                    <Box className="row col-1 right">
                        <Button
                            variant="outlined"
                            className="btn cancel"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            className="btn update"
                            disabled={isSubmitting}
                            endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                        >
                            {isSubmitting ? 'Updating...' : 'Update'}
                        </Button>
                    </Box>
                </form>
            </Box>
        </FormContainer>
    );
}