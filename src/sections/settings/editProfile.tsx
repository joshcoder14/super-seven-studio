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
import { updateUserProfile } from '@/lib/api/fetchUser';
import { UserProfileFormData } from '@/types/user'

export function EditProfile(): React.JSX.Element {
    const { user, loading: authLoading, updateUser } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState<UserProfileFormData>({
        first_name: '',
        mid_name: '',
        last_name: '',
        email: '',
        contact_no: '',
        address: '',
    });
    const [errors, setErrors] = useState<Partial<UserProfileFormData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                mid_name: user.mid_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                contact_no: user.contact_no || '',
                address: user.address || '',
            });
        }
    }, [user]);

    const validateField = (name: keyof UserProfileFormData, value: string): string | null => {
        switch (name) {
        case 'first_name':
        case 'last_name':
            return validateName(`${name === 'first_name' ? 'First' : 'Last'} name`, value);
        case 'mid_name':
            return value ? validateName('Middle name', value) : null;
        case 'email':
            return validateEmail(value);
        case 'contact_no':
            return validatePhone(value);
        case 'address':
            return value.trim() ? null : 'Address is required';
        default:
            return null;
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<UserProfileFormData> = {};
        let isValid = true;

        (Object.keys(formData) as Array<keyof UserProfileFormData>).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let sanitizedValue = value;

        if (name === 'email') {
            sanitizedValue = sanitizeEmail(value);
        } else if (name === 'contact_no') {
            sanitizedValue = sanitizePhone(value);
        } else {
            sanitizedValue = sanitizeInput(value);
        }

        setFormData(prev => ({ ...prev, [name]: sanitizedValue }));

        // Clear error when user types
        if (errors[name as keyof UserProfileFormData]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name as keyof UserProfileFormData];
                return newErrors;
            });
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const error = validateField(name as keyof UserProfileFormData, value);

        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        } else if (errors[name as keyof UserProfileFormData]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name as keyof UserProfileFormData];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const updatedUser = await updateUserProfile(formData);
            updateUser(updatedUser);

            await Swal.fire({
                title: 'Success!',
                text: 'Profile updated successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            
            router.push(paths.home);
        } catch (error) {
            await Swal.fire({
                title: 'Error!',
                text: error instanceof Error ? error.message : 'Failed to update profile',
                icon: 'error',
                confirmButtonText: 'OK'
            });
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

                <form onSubmit={handleSubmit} noValidate>
                    <Box className="row col-3">
                        <Box className="form-group">
                            <label className="form-label">First Name</label>
                            <TextField
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                variant="outlined"
                                size="small"
                                fullWidth
                                className="form-control"
                                required
                                error={!!errors.first_name}
                                helperText={errors.first_name}
                            />
                        </Box>
                        <Box className="form-group">
                            <label className="form-label">Middle Name</label>
                            <TextField
                                name="mid_name"
                                value={formData.mid_name}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                variant="outlined"
                                size="small"
                                fullWidth
                                className="form-control"
                                error={!!errors.mid_name}
                                helperText={errors.mid_name}
                            />
                        </Box>
                        <Box className="form-group">
                            <label className="form-label">Last Name</label>
                            <TextField
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                variant="outlined"
                                size="small"
                                fullWidth
                                className="form-control"
                                required
                                error={!!errors.last_name}
                                helperText={errors.last_name}
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
                                name="contact_no"
                                value={formData.contact_no}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                variant="outlined"
                                size="small"
                                fullWidth
                                className="form-control"
                                error={!!errors.contact_no}
                                helperText={errors.contact_no}
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