'use client';
import React, { useRef, useEffect, useState, useCallback } from "react";
import { Box, Button, styled, TextField } from "@mui/material";
import Image from "next/image";
import { CloseWrapper } from "@/sections/workload/styles";
import { FormHeading } from '@/components/Heading/FormHeading';
import { icons } from '@/icons';
import { createPackage, createAddon, updatePackage, updateAddon } from '@/lib/api/fetchPackage';
import Swal from "sweetalert2";
import { fadeInRight, fadeOutRight } from "@/utils/animate";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    modalType: 'package' | 'addon';
    onSuccess: () => void;
    item?: any;
}

const StyledModalContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$closing',
})<{ $closing?: boolean }>(({ theme, $closing }) => ({
  animation: `${$closing ? fadeOutRight : fadeInRight} 0.3s forwards`,
  position: 'absolute',
  top: '0px',
  right: 0,
  maxWidth: '560px',
  width: '100%',
  height: 'auto',
  backgroundColor: '#FFFFFF',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  paddingBottom: '30px',
  zIndex: 1,
  border: '0.3px solid #E0E0E0',
  borderRadius: '4px',
}));

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
    const [shouldRender, setShouldRender] = useState(false);
    const [closing, setClosing] = useState(false);
    const isMounted = useRef(true);
    const isClosing = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const isEditing = !!item;

    useEffect(() => {
        return () => {
            isMounted.current = false;
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    useEffect(() => {
        if (open) {
            setShouldRender(true);
            setClosing(false);
        } else if (shouldRender) {
            setClosing(true);
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [open]);

    const handleClose = useCallback(() => {
        if (isClosing.current) return;
        isClosing.current = true;
        
        setClosing(true);
        onClose();
        timeoutRef.current = setTimeout(() => {
            if (isMounted.current) {
                setShouldRender(false);
                onClose();
            }
        }, 300);
    }, [onClose]);

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && open) {
                handleClose();
            }
        };

        if (open) {
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [open, handleClose]);

    useEffect(() => {
        if (open) {
            if (isEditing && item) {
                let initialPrice = '';
                if (modalType === 'package') {
                    initialPrice = item.package_price || '';
                } else {
                    initialPrice = item.add_on_price || '';
                }

                // Format initial price with commas
                if (initialPrice) {
                    const numericValue = parseFloat(initialPrice);
                    if (!isNaN(numericValue)) {
                        initialPrice = numericValue.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        });
                    }
                }

                setFormData({
                    name: modalType === 'package' ? item.package_name : item.add_on_name,
                    price: initialPrice,
                    details: modalType === 'package' ? item.package_details : item.add_on_details
                });
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
            // Allow only numbers, commas, and a single decimal point with max 2 decimal places
            const regex = /^[0-9,]*(\.[0-9]{0,2})?$/;
            
            if (value === '' || regex.test(value)) {
                // Remove all commas to check the numeric value
                const rawValue = value.replace(/,/g, '');
                
                // Format with commas as thousand separators
                if (rawValue.includes('.')) {
                    const parts = rawValue.split('.');
                    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    // Ensure we only keep 2 decimal places
                    parts[1] = parts[1].slice(0, 2);
                    setFormData(prev => ({ ...prev, [name]: parts.join('.') }));
                } else if (rawValue) {
                    setFormData(prev => ({ 
                        ...prev, 
                        [name]: rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',') 
                    }));
                } else {
                    setFormData(prev => ({ ...prev, [name]: '' }));
                }
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
            // Remove commas before validation
            const priceWithoutCommas = formData.price.replace(/,/g, '');
            const priceRegex = /^\d+(\.\d{1,2})?$/;
            
            if (!priceRegex.test(priceWithoutCommas)) {
                newErrors.price = 'Invalid price format (e.g., 5,000.00)';
                isValid = false;
            } else {
                const priceValue = parseFloat(priceWithoutCommas);
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

        const confirmation = await Swal.fire({
            title: 'Are you sure?',
            text: `You're about to ${isEditing ? 'update' : 'create'} a ${modalType}.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2BB673',
            cancelButtonColor: '#AAAAAA',
            confirmButtonText: 'Yes, proceed!',
            cancelButtonText: 'Cancel',
        });

        if (!confirmation.isConfirmed) {
            return;
        }

        try {
            setIsSubmitting(true);
            
            // Remove commas and format price
            let formattedPrice = formData.price.replace(/,/g, '');
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
                if (modalType === 'package') {
                    await updatePackage(item.id, data);
                } else {
                    await updateAddon(item.id, data);
                }
            } else {
                if (modalType === 'package') {
                    await createPackage(data);
                } else {
                    await createAddon(data);
                }
            }

            onClose();
            onSuccess();
            handleClose();
        
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

    useEffect(() => {
        if (submitError) {
            Swal.fire({
            icon: 'error',
            text: submitError,
            background: '#ffebee',
            color: 'error.main'
            });
        }
    }, [submitError]);

    const currentContent = content[modalType];

    if (!shouldRender) return null;

    return (
        <StyledModalContainer
            ref={modalRef}
            $closing={closing}
        >
            <CloseWrapper onClick={handleClose}>
                <Image width={18} height={18} src={icons.closeIcon} alt="close icon" />
            </CloseWrapper>
            <Box sx={{ padding: '40px', width: '100%' }}>
                <FormHeading title={currentContent.title}/>
                <Box sx={{ width: '100%', paddingTop: '30px' }}>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
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
                                        pattern: '[0-9,]*\\.?[0-9]{0,2}'
                                    }}
                                    error={!!errors.price}
                                    helperText={errors.price || 'Format: 5,000.00'}
                                    placeholder="0.00"
                                />
                            </Box>
                            
                            <Box className="form-group" sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <label className="form-label">{currentContent.detailsLabel}</label>
                                <TextField
                                    name="details"
                                    value={formData.details}
                                    onChange={handleChange}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    error={!!errors.details}
                                    helperText={errors.details}
                                />
                            </Box>
                            
                            <Box className="action-btn" sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleClose}
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
      </StyledModalContainer>
    );
}