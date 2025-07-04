'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { HomeContainer } from '@/sections/adminHome/styles';
import { HeadingComponent } from '@/components/Heading';
import { SearchBox } from '@/components/Search';
import { ActionButton, ButtonEdit, ButtonChangePassword } from '@/sections/settings/styles';
import { AddAccount } from '@/sections/accounts/styles';
import { PackageContent } from './styles';
import { Box } from '@mui/material';
import { fetchPackages, fetchAddons, deletePackage, deleteAddon } from '@/lib/api/fetchPackage';
import DataTable from './DataTable'
import { ModalComponent } from '@/components/Modal';
import Swal from 'sweetalert2'; 

export function PackageHome(): React.JSX.Element {
    const [activeTab, setActiveTab] = useState<'package' | 'add-ons'>('package');
    const [searchTerm, setSearchTerm] = useState('');
    const [packageData, setPackageData] = useState<any[]>([]);
    const [addonsData, setAddonsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'package' | 'addon'>('package');
    const [currentItem, setCurrentItem] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (activeTab === 'package') {
                const data = await fetchPackages(searchTerm);
                setPackageData(data.data.data);
            } else {
                const data = await fetchAddons(searchTerm);
                setAddonsData(data.data.data);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            
            if (err instanceof Error) {
                setError(err.message);
            } else if (typeof err === 'string') {
                setError(err);
            } else {
                setError('Failed to fetch data');
            }
        } finally {
            setLoading(false);
        }
    }, [activeTab, searchTerm]);

    useEffect(() => {
        fetchData();
    }, [activeTab, fetchData]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    useEffect(() => {
        setSearchTerm('');
    }, [activeTab]);

    const handleOpenModal = (item: any = null) => {
        setCurrentItem(item);
        setModalType(activeTab === 'package' ? 'package' : 'addon');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); 
    };

    const handleSuccess = () => {
        fetchData();
    };

    // Handle delete functionality
    const handleDelete = async (item: any) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete this ${activeTab === 'package' ? 'package' : 'add-on'}. This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#AAAAAA',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'custom-swal-popup',
                confirmButton: 'custom-swal-confirm',
                cancelButton: 'custom-swal-cancel'
            }
        });

        if (result.isConfirmed) {
            try {
                setIsDeleting(true);
                
                if (activeTab === 'package') {
                    await deletePackage(item.id);
                } else {
                    await deleteAddon(item.id);
                }
                
                // Show success message
                Swal.fire({
                    title: 'Deleted!',
                    text: `The ${activeTab === 'package' ? 'package' : 'add-on'} has been deleted.`,
                    icon: 'success',
                    confirmButtonColor: '#2BB673',
                    customClass: {
                        popup: 'custom-swal-popup'
                    }
                });
                
                // Refresh data after successful deletion
                fetchData();
            } catch (err) {
                console.error('Delete error:', err);
                Swal.fire({
                    title: 'Error!',
                    text: `Failed to delete ${activeTab === 'package' ? 'package' : 'add-on'}. Please try again.`,
                    icon: 'error',
                    confirmButtonColor: '#2BB673',
                    customClass: {
                        popup: 'custom-swal-popup'
                    }
                });
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const tableConfig = {
        package: {
            headers: ['Package Name', 'Price', 'Details', 'Action'],
            data: packageData,
            noDataText: 'No packages found',
            type: 'package' as const
        },
        'add-ons': {
            headers: ['Add-on Name', 'Price', 'Details', 'Action'],
            data: addonsData,
            noDataText: 'No add-ons found',
            type: 'addon' as const
        }
    };

    return (
        <HomeContainer>
            <HeadingComponent />
            <PackageContent>
                <ActionButton>
                    <ButtonEdit 
                        className={`btn ${activeTab === 'package' ? 'active' : ''}`}
                        onClick={() => setActiveTab('package')}
                    >
                        Package
                    </ButtonEdit>

                    <ButtonChangePassword 
                        className={`btn ${activeTab === 'add-ons' ? 'active' : ''}`}
                        onClick={() => setActiveTab('add-ons')}
                    >
                        Add-ons
                    </ButtonChangePassword>

                    <AddAccount 
                        sx={{ marginLeft: '25px' }}
                        onClick={() => handleOpenModal()}
                    >
                        {activeTab === 'package' ? 'Add Package' : 'Add Add-on'}
                    </AddAccount>
                </ActionButton>
                <SearchBox 
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                />
            </PackageContent>
            
            <Box sx={{ padding: '0 30px' }}>
                {error ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                        Error: {error}
                    </Box>
                ) : (
                    <DataTable
                        {...tableConfig[activeTab]}
                        loading={loading || isDeleting}
                        onEdit={handleOpenModal}
                        onDelete={handleDelete}
                    />
                )}
            </Box>

            {isModalOpen && (
                <ModalComponent 
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    modalType={modalType}
                    onSuccess={handleSuccess}
                    item={currentItem}
                />
            )}
        </HomeContainer>
    );
}