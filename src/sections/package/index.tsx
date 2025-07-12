'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { HomeContainer } from '@/sections/adminHome/styles';
import { HeadingComponent } from '@/components/Heading';
import { SearchBox } from '@/components/Search';
import { PackageCardComponent } from '@/components/PackageCard';
import { ActionButton, LeftButton, RightButton } from '@/sections/settings/styles';
import { AddAccount } from '@/sections/accounts/styles';
import { PackageContent, PackageWrapper } from './styles';
import { Box, CircularProgress, Typography } from '@mui/material';
import { fetchPackages, fetchAddons, deletePackage, deleteAddon } from '@/lib/api/fetchPackage';
import DataTable from './DataTable';
import { ModalComponent } from '@/components/Modal';
import Swal from 'sweetalert2'; 
import { useAuth } from '@/context/AuthContext';
import { CustomTablePagination } from '@/components/TablePagination';

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
    
    // Pagination states
    const [packagePage, setPackagePage] = useState(1);
    const [packageRowsPerPage, setPackageRowsPerPage] = useState(10);
    const [packageTotal, setPackageTotal] = useState(0);
    // const [packageLastPage, setPackageLastPage] = useState(1);
    
    const [addonsPage, setAddonsPage] = useState(1);
    const [addonsRowsPerPage, setAddonsRowsPerPage] = useState(10);
    const [addonsTotal, setAddonsTotal] = useState(0);
    // const [addonsLastPage, setAddonsLastPage] = useState(1);

    const { user } = useAuth();
    const isClient = user?.user_role === 'Client';

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (activeTab === 'package') {
                const response = await fetchPackages(
                    searchTerm, 
                    packagePage, 
                    packageRowsPerPage
                );
                
                const data = isClient 
                    ? Array.isArray(response?.data) ? response.data : []
                    : Array.isArray(response?.data?.data) ? response.data.data : [];
                    
                setPackageData(data);
                
                if (!isClient && response?.data?.meta) {
                    setPackageTotal(response.data.meta.total);
                    // setPackageLastPage(response.data.meta.last_page);
                }
            } else {
                const response = await fetchAddons(
                    searchTerm, 
                    addonsPage, 
                    addonsRowsPerPage
                );
                
                const data = isClient 
                    ? Array.isArray(response?.data) ? response.data : []
                    : Array.isArray(response?.data?.data) ? response.data.data : [];
                    
                setAddonsData(data);
                
                if (!isClient && response?.data?.meta) {
                    setAddonsTotal(response.data.meta.total);
                    // setAddonsLastPage(response.data.meta.last_page);
                }
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, [
        activeTab, 
        searchTerm, 
        isClient,
        packagePage,
        packageRowsPerPage,
        addonsPage,
        addonsRowsPerPage
    ]);

    useEffect(() => {
        fetchData();
    }, [
        activeTab, 
        fetchData,
        packagePage,
        packageRowsPerPage,
        addonsPage,
        addonsRowsPerPage
    ]);

    // Reset to first page when filters change
    useEffect(() => {
        setPackagePage(1);
        setAddonsPage(1);
    }, [searchTerm, activeTab]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

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

    const handleDelete = async (item: any) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete this ${activeTab === 'package' ? 'package' : 'add-on'}.`,
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

        if (!result.isConfirmed) return;

        try {
            setIsDeleting(true);
            activeTab === 'package' 
                ? await deletePackage(item.id) 
                : await deleteAddon(item.id);
            
            Swal.fire({
                title: 'Deleted!',
                text: `The ${activeTab === 'package' ? 'package' : 'add-on'} has been deleted.`,
                icon: 'success',
                confirmButtonColor: '#2BB673',
                customClass: { popup: 'custom-swal-popup' }
            });
            
            fetchData();
        } catch (err) {
            console.error('Delete error:', err);
            Swal.fire({
                title: 'Error!',
                text: `Failed to delete ${activeTab === 'package' ? 'package' : 'add-on'}.`,
                icon: 'error',
                confirmButtonColor: '#2BB673',
                customClass: { popup: 'custom-swal-popup' }
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handlePackagePageChange = (
        event: React.MouseEvent<HTMLButtonElement> | null, 
        newPage: number
    ) => {
        setPackagePage(newPage + 1);
    };

    const handlePackageRowsPerPageChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setPackageRowsPerPage(newRowsPerPage);
        setPackagePage(1);
    };

    const handleAddonsPageChange = (
        event: React.MouseEvent<HTMLButtonElement> | null, 
        newPage: number
    ) => {
        setAddonsPage(newPage + 1);
    };

    const handleAddonsRowsPerPageChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setAddonsRowsPerPage(newRowsPerPage);
        setAddonsPage(1);
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

    // Get the current data to display based on active tab and user type
    const getCurrentData = () => {
        if (isClient) {
            return activeTab === 'package' ? packageData : addonsData;
        }
        return activeTab === 'package' ? packageData : addonsData;
    };

    const currentData = getCurrentData();

    return (
        <HomeContainer>
            <HeadingComponent />
            <PackageContent>
                <ActionButton>
                    <LeftButton 
                        className={`btn ${activeTab === 'package' ? 'active' : ''}`}
                        onClick={() => setActiveTab('package')}
                    >
                        Package
                    </LeftButton>
                    <RightButton 
                        className={`btn ${activeTab === 'add-ons' ? 'active' : ''}`}
                        onClick={() => setActiveTab('add-ons')}
                    >
                        Add-ons
                    </RightButton>
                    {!isClient && (
                        <AddAccount 
                            sx={{ marginLeft: '25px' }}
                            onClick={() => handleOpenModal()}
                        >
                            {activeTab === 'package' ? 'Add Package' : 'Add Add-on'}
                        </AddAccount>
                    )}
                </ActionButton>
                
                {!isClient && (
                    <SearchBox 
                        searchTerm={searchTerm}
                        onSearchChange={handleSearchChange}
                    />
                )}
            </PackageContent>
            
            {!isClient ? (
                <Box sx={{ marginBottom: '150px' }}>
                    {error ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                            Error: {error}
                        </Box>
                    ) : (
                        <>
                            <DataTable
                                {...tableConfig[activeTab]}
                                loading={loading || isDeleting}
                                onEdit={handleOpenModal}
                                onDelete={handleDelete}
                            />
                            
                            {/* Pagination for package tab */}
                            {activeTab === 'package' && !isClient && (
                                <CustomTablePagination
                                    count={packageTotal}
                                    rowsPerPage={packageRowsPerPage}
                                    page={packagePage - 1}
                                    onPageChange={handlePackagePageChange}
                                    onRowsPerPageChange={handlePackageRowsPerPageChange}
                                />
                            )}
                            
                            {/* Pagination for addons tab */}
                            {activeTab === 'add-ons' && !isClient && (
                                <CustomTablePagination
                                    count={addonsTotal}
                                    rowsPerPage={addonsRowsPerPage}
                                    page={addonsPage - 1}
                                    onPageChange={handleAddonsPageChange}
                                    onRowsPerPageChange={handleAddonsRowsPerPageChange}
                                />
                            )}
                        </>
                    )}
                </Box>
            ) : (
                <PackageWrapper>
                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                            <Typography color="error">Error: {error}</Typography>
                        </Box>
                    ) : currentData.length === 0 ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                            <Typography variant="body1">
                                No {activeTab === 'package' ? 'packages' : 'add-ons'} available
                            </Typography>
                        </Box>
                    ) : (
                        currentData.map((item) => {
                            const isPackage = activeTab === 'package';
                            return (
                                <PackageCardComponent 
                                    key={item.id} 
                                    packageItem={{
                                        id: item.id,
                                        package_name: isPackage ? item.package_name : item.add_on_name,
                                        package_details: isPackage ? item.package_details : item.add_on_details,
                                        package_details_list: isPackage 
                                            ? item.package_details_list 
                                            : undefined,
                                        package_price: isPackage ? item.package_price : item.add_on_price
                                    }} 
                                />
                            );
                        })
                    )}
                </PackageWrapper>
            )}

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