'use client';
import React, { useRef, useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import Image from "next/image";
import { ModalContainer, CloseWrapper } from "@/sections/workload/styles";
import { FormHeading } from '@/components/Heading/FormHeading';
import { icons } from '@/icons';
import { createPackage, createAddon, updatePackage, updateAddon } from '@/lib/api/fetchPackage';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    modalType: 'package' | 'addon';
    onSuccess: () => void;
    item?: any;
}

export function ModalComponent({ 
    open, 
    onClose, 
    modalType, 
    onSuccess,
    item = null
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        details: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        price: '',
        details: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    
    // Derive editing state from item presence
    const isEditing = !!item;

    // Handle click outside and escape key
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && 
                !modalRef.current.contains(event.target as Node) &&
                open) {
                onClose();
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && open) {
                onClose();
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [open, onClose]);

    // Prefill form when editing
    useEffect(() => {
        if (open) {
            if (isEditing && item) {
                if (modalType === 'package') {
                    setFormData({
                        name: item.package_name,
                        price: item.package_price,
                        details: item.package_details
                    });
                } else {
                    setFormData({
                        name: item.add_on_name,
                        price: item.add_on_price,
                        details: item.add_on_details
                    });
                }
            } else {
                setFormData({ name: '', price: '', details: '' });
            }
            setErrors({ name: '', price: '', details: '' });
            setSubmitError(null);
        }
    }, [open, item, modalType, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        if (name === 'price') {
            const regex = /^[0-9]*\.?[0-9]*$/;
            if (value === '' || regex.test(value)) {
                setFormData(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { name: '', price: '', details: '' };

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!formData.price) {
            newErrors.price = 'Price is required';
            isValid = false;
        } else {
            const priceRegex = /^\d+(\.\d{1,2})?$/;
            if (!priceRegex.test(formData.price)) {
                newErrors.price = 'Invalid price format (e.g., 5000.00)';
                isValid = false;
            } else {
                const priceValue = parseFloat(formData.price);
                if (isNaN(priceValue)) {
                    newErrors.price = 'Invalid price value';
                    isValid = false;
                } else if (priceValue <= 0) {
                    newErrors.price = 'Price must be greater than 0';
                    isValid = false;
                }
            }
        }

        if (!formData.details.trim()) {
            newErrors.details = 'Details are required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        
        if (!validateForm()) return;

        try {
            setIsSubmitting(true);
            
            // Format price
            let formattedPrice = formData.price;
            if (!formattedPrice.includes('.')) {
                formattedPrice += '.00';
            } else {
                const [whole, decimal] = formattedPrice.split('.');
                if (decimal.length === 1) formattedPrice += '0';
            }
            
            const data = {
                name: formData.name,
                price: formattedPrice,
                details: formData.details
            };

            if (isEditing && item) {
                // Update existing item
                if (modalType === 'package') {
                    await updatePackage(item.id, data);
                } else {
                    await updateAddon(item.id, data);
                }
            } else {
                // Create new item
                if (modalType === 'package') {
                    await createPackage(data);
                } else {
                    await createAddon(data);
                }
            }

            onClose();
            onSuccess();
        
        } catch (err) {
            console.error('Submission error:', err);
            
            if (err instanceof Error) {
                setSubmitError(err.message);
            } else {
                setSubmitError('Failed to submit form');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Content configuration
    const content = {
        package: {
            title: isEditing ? 'Edit Package' : 'Add Package',
            nameLabel: 'Package Name',
            priceLabel: 'Package Price',
            detailsLabel: 'Package Details'
        },
        addon: {
            title: isEditing ? 'Edit Add-on' : 'Add Add-on',
            nameLabel: 'Add-on Name',
            priceLabel: 'Add-on Price',
            detailsLabel: 'Add-on Details'
        }
    };

    const currentContent = content[modalType];

    return (
        <ModalContainer ref={modalRef}>
            <CloseWrapper onClick={onClose}>
            <Image width={18} height={18} src={icons.closeIcon} alt="close icon" />
            </CloseWrapper>
            <Box sx={{ padding: '40px', width: '100%' }}>
                <FormHeading title={currentContent.title}/>
                <Box sx={{ width: '100%', paddingTop: '30px' }}>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                            {/* Name Field */}
                            <Box className="form-group" sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <label className="form-label">{currentContent.nameLabel}</label>
                                <TextField
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name}
                                />
                            </Box>
                            
                            {/* Price Field */}
                            <Box className="form-group" sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <label className="form-label">{currentContent.priceLabel}</label>
                                <TextField
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    fullWidth
                                    type="text"
                                    inputProps={{
                                    inputMode: 'decimal',
                                    pattern: '[0-9]*\\.?[0-9]*'
                                    }}
                                    error={!!errors.price}
                                    helperText={errors.price || 'Format: 5000.00'}
                                    placeholder="0.00"
                                />
                            </Box>
                            
                            {/* Details Field */}
                            <Box className="form-group" sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <label className="form-label">{currentContent.detailsLabel}</label>
                                <TextField
                                    name="details"
                                    value={formData.details}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.details}
                                    helperText={errors.details}
                                />
                            </Box>
                            
                            {/* Error Message */}
                            {submitError && (
                                <Box sx={{ color: 'error.main', textAlign: 'center' }}>
                                    {submitError}
                                </Box>
                            )}
                            
                            <Box className="action-btn" sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    sx={{
                                    color: '#FFFFFF',
                                    padding: '10px 15px',
                                    fontSize: '14px',
                                    fontWeight: '500 !important',
                                    appearance: 'none',
                                    border: 'none',
                                    backgroundColor: '#AAAAAA',
                                    textTransform: 'capitalize',
                                    '&:hover': {
                                        backgroundColor: '#5d5d5d'
                                    },
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting}
                                    sx={{
                                    color: '#FFFFFF',
                                    backgroundColor: '#2BB673',
                                    padding: '10px 15px',
                                    fontSize: '14px',
                                    fontWeight: '500 !important',
                                    textTransform: 'capitalize',
                                    '&:hover': {
                                        backgroundColor: '#155D3A'
                                    },
                                    '&:disabled': {
                                        backgroundColor: '#cccccc'
                                    }
                                    }}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save'}
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </Box>
            </Box>
      </ModalContainer>
    );
}