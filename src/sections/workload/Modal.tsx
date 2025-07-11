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
import { DeliverableStatus, MappedWorkloadItem, WorkloadApiItem, statusMap, Employee, statusOptions, statusStringToNumberMap } from '@/types/workload';
import { fetchAvailableEmployees, fetchWorkloadDetailsById, showConfirmationDialog, showValidationError, updateWorkloadAssignment, validateAssignment, updateEmployeeWorkloadStatus } from '@/lib/api/fetchWorkloads';
import Swal from 'sweetalert2';
import { useAuth } from '@/context/AuthContext';


export interface EditModalProps {
    open: boolean;
    onClose: () => void;
    eventData: MappedWorkloadItem | null;
    onUpdateSuccess?: () => void;
}

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
    const { user, loading: authLoading } = useAuth();
    const isEmployee = user?.user_role === 'Editor' || user?.user_role === 'Photographer';

    useEffect(() => {
        if (!open || !eventData) return;

        const loadData = async () => {
            try {
                setFetching(true);
                setError(null);

                const [details, availableEmployees] = await Promise.all([
                    fetchWorkloadDetailsById(eventData.id),
                    fetchAvailableEmployees(eventData.id)
                ]);
                
                // Set initial state from API response
                setBookingDetails(details);
                setLink(details.link || '');
                setCompletionDate(
                    details.expected_completion_date ? dayjs(details.expected_completion_date) : null
                );

                const numericStatus = statusStringToNumberMap[details.booking_workload_status] || 0;
                setSelectedStatus(numericStatus);

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
    }, [open, eventData, authLoading]);

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

        const selectedEmployeeIds = employees
            .filter(e => e.selected)
            .map(e => e.id);

        // Validate assignment
        const validationError = validateAssignment(selectedStatus, selectedEmployeeIds);
        if (validationError) {
            await showValidationError(validationError);
            return;
        }

        try {
            // Confirmation dialog
            const confirmed = await showConfirmationDialog();
            if (!confirmed) return;

            setLoading(true);
            setError(null);

            // For employees: update their own status
            if (isEmployee) {
                await updateEmployeeWorkloadStatus(eventData.id, {
                    workload_status: selectedStatus
                });
            } else {
                await updateWorkloadAssignment(eventData.id, {
                    expected_completion_date: completionDate?.format('YYYY-MM-DD') || null,
                    deliverable_status: selectedStatus,
                    link: link || '',
                    user_id: selectedEmployeeIds
                });
            }

            onUpdateSuccess?.();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (error) {
            Swal.fire({
                icon: 'error',
                text: error,
                background: '#ffebee',
                color: 'error.main'
            });
        }
    }, [error]);

    if (!open || !eventData || !bookingDetails) return null;

    return (
        <ModalContainer>
            <CloseWrapper onClick={onClose}>
                <Image width={18} height={18} src={icons.closeIcon} alt="close icon" />
            </CloseWrapper>

            {fetching ? (
                <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '50vh'
                }}>
                    <CircularProgress color="inherit" />
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
                        <Box className="client-info">
                            <Image width={25} height={25} src={icons.packageIcon} alt="profile icon" />
                            <Typography component="span">{eventData.package_name}</Typography>
                        </Box>
                        <Box className="client-info">
                            <Image width={25} height={25} src={icons.clockIcon} alt="profile icon" />
                            <Typography component="span">{eventData.ceremony_time}</Typography>
                        </Box>
                        <Box className="client-info">
                            <Image width={25} height={25} src={icons.locationIcon} alt="profile icon" />
                            <Typography component="span">{eventData.booking_address}</Typography>
                        </Box>
                        
                    </Details>

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

                    <AssignedWrapper>

                        {!isEmployee ? (
                            <>
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
                            </>
                        ) : (
                            <>
                                <Box className="label">Assigned To:</Box>
                                <Box sx={{ marginTop: '10px' }}>
                                    {employees.map((employee) => (
                                        employee.selected && (
                                            <Box key={employee.id}>
                                            <Typography 
                                                component="span" 
                                                sx={{
                                                    fontFamily: 'Nunito Sans',
                                                    fontWeight: '500', 
                                                    fontSize: '16px',
                                                    color: '#000000'
                                                }}
                                            >
                                                {employee.full_name}</Typography>
                                            </Box>
                                        )
                                    ))}
                                </Box>
                            </>
                        )}

                        
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
                            label=""
                            required
                            disabled
                        />
                    </ReleaseDateWrapper>

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