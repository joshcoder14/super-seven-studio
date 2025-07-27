'use client';
import React, { useRef, useEffect, useState, useCallback } from "react";
import { Box, Button, styled, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { CloseWrapper } from "@/sections/workload/styles";
import { FormHeading } from '@/components/Heading/FormHeading';
import { icons } from '@/icons';
import { createPackage, createAddon, updatePackage, updateAddon } from '@/lib/api/fetchPackage';
import Swal from "sweetalert2";
import { fadeInRight, fadeOutRight } from "@/utils/animate";

// Allowed image file types
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

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

export function PackageModalComponent({ 
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
        details: '',
        image: null as File | null,
        removeImage: false,
        imagePreview: ''
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

    // Cleanup effects
    useEffect(() => {
        return () => {
            isMounted.current = false;
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (formData.imagePreview && formData.imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(formData.imagePreview);
            }
        };
    }, [formData.imagePreview]);

    // Animation handling
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
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        setClosing(true);
        onClose();
        timeoutRef.current = setTimeout(() => {
            if (isMounted.current) {
                setShouldRender(false);
                onClose();
            }
        }, 300);
    }, [onClose]);

    // Escape key handler
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && open) {
                handleClose();
            }
        };

        if (open) document.addEventListener('keydown', handleEscapeKey);
        return () => document.removeEventListener('keydown', handleEscapeKey);
    }, [open, handleClose]);

    // Initialize form data
    useEffect(() => {
        if (open) {
            if (isEditing && item) {
                let initialPrice = modalType === 'package' 
                    ? item.package_price || '' 
                    : item.add_on_price || '';

                // Format price
                if (initialPrice) {
                    const numericValue = parseFloat(initialPrice);
                    if (!isNaN(numericValue)) {
                        initialPrice = numericValue.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        });
                    }
                }

                // Handle image path
                let imagePreview = '';
                if (modalType === 'package' && item.image_path) {
                    imagePreview = item.image_path.startsWith('http') 
                        ? item.image_path 
                        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/${item.image_path}`;
                }

                setFormData({
                    name: modalType === 'package' ? item.package_name : item.add_on_name,
                    price: initialPrice,
                    details: modalType === 'package' ? item.package_details : item.add_on_details,
                    image: null,
                    removeImage: false,
                    imagePreview: imagePreview
                });
            } else {
                setFormData({ 
                    name: '', 
                    price: '', 
                    details: '', 
                    image: null,
                    removeImage: false,
                    imagePreview: '' 
                });
            }
            setErrors({ name: '', price: '', details: '' });
            setSubmitError(null);
        }
    }, [open, item, modalType, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        if (name === 'price') {
            const regex = /^[0-9,]*(\.[0-9]{0,2})?$/;
            if (value === '' || regex.test(value)) {
                const rawValue = value.replace(/,/g, '');
                if (rawValue.includes('.')) {
                    const parts = rawValue.split('.');
                    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubmitError(null);
        
        if (!e.target.files || !e.target.files[0]) {
            return;
        }

        const file = e.target.files[0];
        
        // Reset file input to allow re-uploading the same file
        e.target.value = '';
        
        // Validate file type only
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            setSubmitError('Only JPEG, PNG, GIF, or WebP images are allowed');
            return;
        }

        // Clean up previous preview if it exists
        if (formData.imagePreview && formData.imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(formData.imagePreview);
        }
        
        setFormData(prev => ({
            ...prev,
            image: file,
            removeImage: false,
            imagePreview: URL.createObjectURL(file)
        }));
    };

    const handleRemoveImage = () => {
        if (formData.imagePreview && formData.imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(formData.imagePreview);
        }
        setFormData(prev => ({
            ...prev,
            image: null,
            removeImage: true,
            imagePreview: ''
        }));
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
            
            const formattedPrice = formData.price.replace(/,/g, '');
            const data = {
                name: formData.name,
                price: formattedPrice.includes('.') ? formattedPrice : `${formattedPrice}.00`,
                details: formData.details,
                ...(modalType === 'package' && {
                    image: formData.image,
                    removeImage: formData.removeImage
                })
            };

            if (isEditing && item) {
                await (modalType === 'package' 
                    ? updatePackage(item.id, data) 
                    : updateAddon(item.id, data));
            } else {
                await (modalType === 'package' 
                    ? createPackage(data) 
                    : createAddon(data));
            }

            onSuccess();
            handleClose();
            
        } catch (err) {
            console.error('Submission error:', err);
            
            const errorMessage = err instanceof Error 
                ? err.message 
                : 'An unknown error occurred';
                
            setSubmitError(errorMessage);
            
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
                confirmButtonColor: '#2BB673',
            });
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
                            
                            {modalType === 'package' && (
                                <Box className="form-group" sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <label className="form-label">Package Image</label>
                                    
                                    {formData.imagePreview ? (
                                        <Box sx={{ position: 'relative', width: '100%', mb: 2 }}>
                                            <img 
                                                src={formData.imagePreview}
                                                alt="Package preview"
                                                style={{ 
                                                    width: '100%', 
                                                    height: '200px',
                                                    objectFit: 'cover', 
                                                    borderRadius: '4px' 
                                                }}
                                            />
                                            <Button 
                                                onClick={handleRemoveImage}
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                sx={{ 
                                                    position: 'absolute', 
                                                    top: 8, 
                                                    right: 8,
                                                    minWidth: 'auto',
                                                    padding: '8px',
                                                    backgroundColor: '#E0E0E0',
                                                }}
                                            >
                                                <Image width={16} height={16} src={icons.closeIcon} alt="remove" />
                                            </Button>
                                        </Box>
                                    ) : (
                                        <>
                                            <TextField
                                                type="file"
                                                inputProps={{
                                                    accept: ALLOWED_FILE_TYPES.join(',')
                                                }}
                                                onChange={handleImageChange}
                                                fullWidth
                                            />
                                            <Typography variant="caption" color="textSecondary">
                                                Allowed: JPEG, PNG, GIF, WebP
                                            </Typography>
                                        </>
                                    )}
                                    
                                    {isEditing && formData.imagePreview && !formData.image && (
                                        <Typography variant="caption" color="textSecondary">
                                            Current image will be kept unless you upload a new one or remove it
                                        </Typography>
                                    )}
                                </Box>
                            )}
                            
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