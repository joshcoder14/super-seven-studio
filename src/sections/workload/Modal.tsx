'use client';

import React, { useState, useEffect } from 'react';
import CustomDatePicker from '@/components/datepicker';
import dayjs from 'dayjs';
import { 
    ModalContainer, 
    CloseWrapper, 
    Details, 
    AssignedWrapper,
    ReleaseDateWrapper,
    StatusWrapper,
    LinkAttached,
    ActionButton 
} from './styles';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { icons } from '@/icons';
import Image from 'next/image';
import { DeliverableStatus, MappedWorkloadItem, WorkloadApiItem } from '@/types/workload';
import { fetchBookingDetails } from '@/lib/api/fetchBooking';
import { statusMap } from '@/types/workload';

export interface Employee {
    id: number;
    full_name: string;
    user_role: string;
    selected?: boolean;
}

export interface StatusOption {
    id: number;
    name: string;
    value: DeliverableStatus;
}

export interface ApiResponse<T> {
    status: boolean;
    message: string;
    data: T;
}

export interface EditModalProps {
    open: boolean;
    onClose: () => void;
    eventData: MappedWorkloadItem | null;
    onUpdateSuccess?: () => void;
}

const statusOptions: StatusOption[] = [
    { id: 1, name: 'Unassigned', value: 0 },
    { id: 2, name: 'Scheduled', value: 1 },
    { id: 3, name: 'Uploaded', value: 2 },
    { id: 4, name: 'For Edit', value: 3 },
    { id: 5, name: 'Editing', value: 4 },
    { id: 6, name: 'For Release', value: 5 },
    { id: 7, name: 'Completed', value: 6 }
];

const fetchBookingDetailsById = async (bookingId: string): Promise<WorkloadApiItem> => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('No access token found');

    const response = await fetch(`/api/workload/${bookingId}`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) throw new Error('Failed to fetch booking details');

    const data: ApiResponse<WorkloadApiItem> = await response.json();
    if (!data.status) throw new Error(data.message);

    return data.data;
};

const fetchAvailableEmployees = async (workloadId: string): Promise<Employee[]> => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('No access token found');

    const response = await fetch(`/api/workload/${workloadId}/employees`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) throw new Error('Failed to fetch available employees');

    const data: ApiResponse<Employee[]> = await response.json();
    if (!data.status) throw new Error(data.message);

    return data.data;
};

export default function EditModal({ open, onClose, eventData, onUpdateSuccess }: EditModalProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<DeliverableStatus>(0);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [completionDate, setCompletionDate] = useState<dayjs.Dayjs | null>(null);
    const [link, setLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bookingDetails, setBookingDetails] = useState<WorkloadApiItem | null>(null);

    useEffect(() => {
        if (!open || !eventData) return;

        const loadData = async () => {
            try {
                setFetching(true);
                setError(null);

                // Fetch booking details
                const details = await fetchBookingDetailsById(eventData.id);
                setBookingDetails(details);
                
                // Fetch available employees
                const availableEmployees = await fetchAvailableEmployees(eventData.id);
                
                setSelectedStatus(eventData.deliverableStatus);
                setLink(eventData.link || '');
                setCompletionDate(
                    eventData.releaseDate ? dayjs(eventData.releaseDate) : null
                );

                // Mark already assigned employees as selected
                const assignedIds = details.assigned_employees.map(e => e.id);
                setEmployees(
                    availableEmployees.map(emp => ({
                        ...emp,
                        selected: assignedIds.includes(emp.id)
                    }))
                );
            } catch (err) {
                console.error('Error loading data:', err);
                setError(err instanceof Error ? err.message : 'Failed to load data');
            } finally {
                setFetching(false);
            }
        };

        loadData();
    }, [open, eventData]);

    const handleAssignedClick = () => setIsDropdownOpen(prev => !prev);
    const handleStatusClick = () => setIsStatusDropdownOpen(prev => !prev);

    const handleStatusSelect = (status: DeliverableStatus) => {
        setSelectedStatus(status);
        setIsStatusDropdownOpen(false);
    };

    const toggleEmployeeSelection = (id: number) => {
        setEmployees(prevEmployees => 
            prevEmployees.map(emp => 
                emp.id === id ? { ...emp, selected: !emp.selected } : emp
            )
        );
    };

    const handleUpdate = async () => {
        if (!eventData || !bookingDetails) return;

        try {
            setLoading(true);
            setError(null);

            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) throw new Error('No access token found');

            const form = new FormData();
            form.append('expected_completion_date', completionDate?.format('YYYY-MM-DD') || '');
            form.append('deliverable_status', String(selectedStatus));
            form.append('link', link || '');

            // Get selected employee IDs
            const selectedEmployeeIds = employees
                .filter(e => e.selected)
                .map(e => e.id);
            
            selectedEmployeeIds.forEach((id, index) => {
                form.append(`assigned_employees[${index}]`, id.toString());
            });

            const response = await fetch(`/api/workload/${eventData.id}/assign`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                body: form
            });

            const responseData = await response.json();
            console.log('API Response:', responseData);

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to update workload');
            }

            onUpdateSuccess?.();
            onClose();
        } catch (err) {
            console.error('Update error:', err);
            setError(err instanceof Error ? err.message : 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    if (!open || !eventData || !bookingDetails) return null;

    return (
        <ModalContainer>
            <CloseWrapper onClick={onClose}>
                <Image width={18} height={18} src={icons.closeIcon} alt="close icon" />
            </CloseWrapper>
            
            {error && (
                <Box sx={{ 
                    color: 'error.main',
                    backgroundColor: '#ffebee',
                    p: 2,
                    mb: 2,
                    borderRadius: 1
                }}>
                    {error}
                </Box>
            )}

            {fetching ? (
                <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '50vh'
                }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Details>
                        <Box className="event-head">
                            <Box className="event-icon"/>
                            <Box className="event-name">
                                <h2 className="title">{eventData.eventName}</h2>
                                <Typography component="span" className="event-date">
                                    {eventData.bookingDate}
                                </Typography>
                            </Box>
                        </Box>
                        <Box className="client-info">
                            <Image width={25} height={25} src={icons.eventProfile} alt="profile icon" />
                            <Typography component="span">{eventData.client}</Typography>
                        </Box>
                    </Details>

                    <AssignedWrapper>
                        <Box className="label">Assigned To:</Box>
                        <Box 
                            className="assigned-to" 
                            onClick={handleAssignedClick}
                            sx={{
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px 12px',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                        >
                            <Typography component="span">
                                {employees.filter(e => e.selected).length > 0 
                                    ? `${employees.filter(e => e.selected).length} selected` 
                                    : 'Select employees'}
                            </Typography>
                            <Image
                                width={12}
                                height={7}
                                src={icons.angleDown}
                                alt="angle down"
                                className={isDropdownOpen ? 'rotated' : ''}
                            />
                        </Box>
                        
                        {isDropdownOpen && (
                            <Box className="dropdown-list">
                                {employees.map((employee) => (
                                    <Box className="row" key={employee.id}>
                                        <Box className="checkbox">
                                            <input
                                                type="checkbox"
                                                id={`employee-${employee.id}`}
                                                checked={employee.selected || false}
                                                onChange={() => toggleEmployeeSelection(employee.id)}
                                            />
                                            <label htmlFor={`employee-${employee.id}`}>
                                                {employee.full_name}
                                                <span> ({employee.user_role})</span>
                                            </label>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </AssignedWrapper>

                    <ReleaseDateWrapper>
                        <Box className="label">Release Date:</Box>
                        <CustomDatePicker
                            value={completionDate}
                            onChange={setCompletionDate}
                            minDate={dayjs().add(1, 'day')}
                            label="Release Date"
                            required
                        />
                    </ReleaseDateWrapper>

                    <StatusWrapper>
                        <Box className="label">Status:</Box>
                        <Box className="status-to" onClick={handleStatusClick}>
                            <Typography component="span">
                                {statusMap[selectedStatus]}
                            </Typography>
                            <Image
                                width={12}
                                height={7}
                                src={icons.angleDown}
                                alt="angle down"
                                className={isStatusDropdownOpen ? 'rotated' : ''}
                            />
                        </Box>
                        
                        {isStatusDropdownOpen && (
                            <Box className="dropdown-list">
                                {statusOptions.map((status) => (
                                    <Box
                                        className="row status-option"
                                        key={status.id}
                                        onClick={() => handleStatusSelect(status.value)}
                                    >
                                        <Typography component="span">{status.name}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </StatusWrapper>

                    <LinkAttached>
                        <Box className="label">Link Attached:</Box>
                        <input 
                            type="text" 
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            placeholder="Paste Google Drive or Dropbox link" 
                        />
                    </LinkAttached>

                    <ActionButton>
                        <Button 
                            variant="outlined" 
                            onClick={onClose}
                            disabled={loading}
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
                            onClick={handleUpdate}
                            disabled={loading}
                            sx={{
                                backgroundColor: '#2BB673',
                                '&:hover': {
                                    backgroundColor: '#155D3A'
                                },
                                padding: '10px 15px',
                                fontSize: '14px',
                                fontWeight: '500 !important'
                            }}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {loading ? 'Updating...' : 'Update'}
                        </Button>
                    </ActionButton>
                </>
            )}
        </ModalContainer>
    );
}