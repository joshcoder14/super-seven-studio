'use client';

import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { FormContainer } from '../settings/styles';
import { FormHeading } from '../../components/Heading/FormHeading';
import { FilterBy } from '@/components/Filter';
import { User } from '@/types/user';
import {
  sanitizeInput,
  sanitizeEmail,
  sanitizePhone,
  validateName,
  validateEmail,
  validatePhone,
} from '@/utils/validation';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import Swal from 'sweetalert2';
import { FormSection, FormField } from '@/types/field';

interface RegisterAccountProps {
  account?: User | null;
  onBackClick: () => void;
  isEditMode?: boolean;
  onSuccess?: () => void;
  existingOwners?: User[];
}

export function RegisterAccount({ 
  account, 
  onBackClick, 
  isEditMode = false,
  onSuccess,
  existingOwners = []
}: RegisterAccountProps): React.JSX.Element {
    const ownerExists = existingOwners.some(owner => owner.user_type === '3');
    
    const [formData, setFormData] = useState({
        firstName: account?.first_name || '',
        middleName: account?.mid_name || '',
        lastName: account?.last_name || '',
        email: account?.email || '',
        contactNumber: account?.contact_no || '',
        address: account?.address || '',
        status: account?.status === 'active' ? '1' : account?.status ? '1' : '0',
        userType: account?.user_type?.toString() || '4',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    const statusOptions = [
        { value: '1', label: 'Active' },
        { value: '0', label: 'Inactive' }
    ];

    const userTypeOptions = [
        { value: '4', label: 'Secretary' },
        { value: '5', label: 'Photographer' },
        { value: '6', label: 'Editor' },
        ...(!ownerExists ? [{ value: '3', label: 'Owner' }] : [])
    ];

    const formSections: FormSection[] = [
        {
            id: "name_section",
            columnCount: 3,
            fields: [
                {
                    id: "firstName",
                    name: "firstName",
                    label: 'First Name',
                    type: "text",
                    required: true
                },
                {
                    id: "middleName",
                    name: "middleName",
                    label: 'Middle Name',
                    type: "text"
                },
                {
                    id: "lastName",
                    name: "lastName",
                    label: 'Last Name',
                    type: "text",
                    required: true
                }
            ]
        },
        {
            id: "contact_section",
            columnCount: 2,
            fields: [
                {
                    id: "email",
                    name: "email",
                    label: 'Email Address',
                    type: "email",
                    required: true
                },
                {
                    id: "contactNumber",
                    name: "contactNumber",
                    label: 'Contact Number',
                    type: "text",
                    required: true,
                    maxChar: 11
                }
            ]
        },
        {
            id: "address_section",
            columnCount: 1,
            fields: [
                {
                    id: "address",
                    name: "address",
                    label: 'Address',
                    type: "text",
                    required: true
                }
            ]
        }
    ];

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        // Name validations
        const firstNameError = validateName('First name', formData.firstName);
        if (firstNameError) newErrors.firstName = firstNameError;
        
        const lastNameError = validateName('Last name', formData.lastName);
        if (lastNameError) newErrors.lastName = lastNameError;
        
        if (formData.middleName) {
            const middleNameError = validateName('Middle name', formData.middleName);
            if (middleNameError) newErrors.middleName = middleNameError;
        }
        
        // Email validation
        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;
        
        // Phone validation
        const phoneError = validatePhone(formData.contactNumber);
        if (phoneError) newErrors.contactNumber = phoneError;
        
        // Address validation
        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }
        
        // Owner validation rules
        if (!isEditMode && formData.userType === '3' && ownerExists) {
            newErrors.userType = 'An owner already exists. Only one owner account is allowed.';
        }

        if (isEditMode && account?.user_type === '3' && formData.userType !== '3') {
            newErrors.userType = 'Cannot change owner role. Please delete and recreate the account.';
        }

        if (isEditMode && account?.user_type !== '3' && formData.userType === '3' && ownerExists) {
            newErrors.userType = 'An owner already exists. Cannot change this account to owner.';
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

    const getCookieValue = (name: string): string | null => {
        if (typeof document === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            const cookieValue = parts.pop()?.split(';').shift();
            return cookieValue ? decodeURIComponent(cookieValue) : null;
        }
        return null;
    };

    const ensureCsrfToken = async (): Promise<string> => {
        const existingToken = getCookieValue('XSRF-TOKEN');
        if (existingToken) return existingToken;

        try {
            const response = await fetch(`/api/sanctum/csrf-cookie`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Accept': 'application/json' }
            });

            if (!response.ok) throw new Error(`CSRF fetch failed with status ${response.status}`);
            await new Promise(resolve => setTimeout(resolve, 100));

            const csrfToken = getCookieValue('XSRF-TOKEN');
            if (!csrfToken) throw new Error('XSRF-TOKEN cookie not found');
            return csrfToken;
        } catch (error) {
            console.error('CSRF Token Error:', error);
            throw new Error('Failed to obtain CSRF token');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const csrfToken = await ensureCsrfToken();
            const accessToken = localStorage.getItem('access_token');

            if (!accessToken) {
                throw new Error('Authentication required. Please login again.');
            }

            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': csrfToken,
                'Authorization': `Bearer ${accessToken}`
            };

            const payload = {
                first_name: sanitizeInput(formData.firstName.trim()),
                mid_name: sanitizeInput(formData.middleName.trim()),
                last_name: sanitizeInput(formData.lastName.trim()),
                email: sanitizeEmail(formData.email.trim()),
                contact_no: formData.contactNumber || '',
                address: sanitizeInput(formData.address.trim()),
                user_type: formData.userType,
                status: formData.status === '1',
            };

            const url = isEditMode && account 
                ? `/api/employees/${account.id}` 
                : '/api/employees/add';
            
            const method = 'POST';

            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Operation failed');
            }

            if (isEditMode) {
                // For edit mode - show success and redirect to accounts page
                await Swal.fire({
                    title: 'Success!',
                    text: 'Account updated successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                });
                window.location.href = paths.accounts;
            } else {
                // For create mode - show password and options
                const defaultPassword = `${formData.firstName.trim()}${formData.lastName.trim().toLowerCase()}12345`;
                
                const { isConfirmed } = await Swal.fire({
                    title: 'Account Created Successfully!',
                    html: `
                        <div>
                            <p>Account was created successfully!</p>
                            <p><strong>Temporary Password:</strong> ${defaultPassword}</p>
                            <p>Please instruct the user to change this password after first login.</p>
                        </div>
                    `,
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'Add another account',
                    cancelButtonText: 'Go to accounts page',
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                });

                if (!isConfirmed) {
                    router.push(paths.accounts);
                } else {
                    setFormData({
                        firstName: '',
                        middleName: '',
                        lastName: '',
                        email: '',
                        contactNumber: '',
                        address: '',
                        status: '1',
                        userType: '4',
                    });
                }
            }

            if (onSuccess) onSuccess();
            
        } catch (err) {
            console.error('Operation error:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            await Swal.fire({
                title: 'Error!',
                text: err instanceof Error ? err.message : 'An unknown error occurred',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#d33',
            });
        } finally {
            setLoading(false);
        }
    };

    const renderFormField = (field: FormField) => {
        return (
            <Box className="form-group" key={field.id}>
                <label className="form-label">{field.label}</label>
                <TextField 
                    name={field.name}
                    type={field.type}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleInputChange}
                    variant="outlined" 
                    size="small" 
                    fullWidth 
                    required={field.required}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]}
                    inputProps={{
                        maxLength: field.maxChar
                    }}
                />
            </Box>
        );
    };

    return (
        <FormContainer className="register-account">
            <Box className="wrapper">
                <FormHeading title={isEditMode ? "Edit Account" : "Add Account"}/>

                {ownerExists && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        {isEditMode 
                            ? "Note: Editing an owner account. You cannot change the user type."
                            : "Note: An owner account already exists. You can only create non-owner accounts."}
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    {formSections.map(section => (
                        <Box className={`row col-${section.columnCount}`} key={section.id}>
                            {section.fields.map(field => renderFormField(field))}
                        </Box>
                    ))}

                    <Box className="row col-1">
                        {isEditMode ? (
                            <FilterBy
                                options={statusOptions}
                                selectedValue={formData.status}
                                onFilterChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                                label="Status"
                            />
                        ) : (
                            <FilterBy
                                options={userTypeOptions}
                                selectedValue={formData.userType}
                                onFilterChange={(value) => setFormData(prev => ({ ...prev, userType: value }))}
                                label="User Type"
                                disabled={ownerExists && formData.userType === '3'}
                            />
                        )}
                    </Box>

                    {errors.userType && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {errors.userType}
                        </Alert>
                    )}

                    <Box className="row col-1 right">
                        <Button 
                            variant="outlined" 
                            className="btn cancel"
                            onClick={onBackClick}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="contained" 
                            className="btn register"
                            type="submit"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                            {isEditMode ? "Update" : "Register"}
                        </Button>
                    </Box>
                </form>
            </Box>
        </FormContainer>
    );
}