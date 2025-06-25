'use client';

import React, { useState } from 'react';
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
import { Box, Typography } from '@mui/material';
import { icons } from '@/icons';
import Image from 'next/image';

type EditModalProps = {
  open: boolean;
  onClose: () => void;
  eventData: any;
};

export default function EditModal({ open, onClose, eventData }: EditModalProps) {
    if (!open || !eventData) return null;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");

    const assignedTo = [
        {
            id: 1,
            name: 'Mark Parañas',
            role: 'Photographer'
        },
        {
            id: 2,
            name: 'Sheena Daogdog',
            role: 'Editor'
        },
        {
            id: 3,
            name: 'Nikka Namocatcat',
            role: 'Videographer'
        }
    ]

    const statusOption = [
        {
            id: 1,
            name: 'Pending'
        },
        {
            id: 2,
            name: 'Ongoing'
        },
        {
            id: 3,
            name: 'Completed'
        }
    ]

    const handleAssignedClick = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const handleStatusClick = () => {
        setIsStatusDropdownOpen(prev => !prev);
    };

    const handleStatusSelect = (status: string) => {
        setSelectedStatus(status);
        setIsStatusDropdownOpen(false);
    };
    
    return (
        <ModalContainer>
            <CloseWrapper onClick={onClose}>
                <Image width={18} height={18} src={icons.closeIcon} alt="close icon" />
            </CloseWrapper>
            <Details>
                <Box className="event-head">
                    <Box className="event-icon"/>
                    <Box className="event-name">
                        <h2 className="title">Charlie's Birthday</h2>
                        <Typography component="span" className="event-date">Monday, December 29</Typography>
                    </Box>
                </Box>
                <Box className="client-info">
                    <Image width={25} height={25} src={icons.eventProfile} alt="profile icon" />
                    <Typography component="span">Smile Services</Typography>
                </Box>
                <Box className="client-info">
                    <Image width={25} height={25} src={icons.packageIcon} alt="package icon" />
                    <Typography component="span">Package B</Typography>
                </Box>
                <Box className="client-info">
                    <Image width={25} height={25} src={icons.clockIcon} alt="clock icon" />
                    <Typography component="span">7:00AM - 7:00PM</Typography>
                </Box>
                <Box className="client-info">
                    <Image width={25} height={25} src={icons.locationIcon} alt="location icon" />
                    <Typography component="span">Henan Resort, Panglao</Typography>
                </Box>
            </Details>
            <AssignedWrapper>
                <Box className="label">
                    Assigned To:
                </Box>
                {/* Select Employee */}
                <Box className="assigned-to" onClick={handleAssignedClick}>
                    <Typography component="span">Assigned To</Typography>
                    <Image
                        width={12}
                        height={7}
                        src={icons.angleDown}
                        alt="angle down"
                        className={isDropdownOpen ? 'rotated' : ''}
                    />
                </Box>
                {/* Select Employee */}
                {isDropdownOpen && (
                    <Box className="dropdown-list">
                        {assignedTo.map((employee) => (
                            <Box className="row" key={employee.id}>
                                <Box className="checkbox">
                                    <input
                                        type="checkbox"
                                        id={`employee-${employee.id + 1}`}
                                        name="employee"
                                        value={employee.name}
                                    />
                                    <label htmlFor={`employee-${employee.id + 1}`}>
                                        {employee.name}
                                        <span> ({employee.role})</span>
                                    </label>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </AssignedWrapper>

            <ReleaseDateWrapper>
                <Box className="label">
                    Release Date:
                </Box>
                <Box className="release">
                    <label htmlFor="release-date">Release Date</label>
                    <input type="date" name="release-date" id="release-date" />
                </Box>
            </ReleaseDateWrapper>

            <StatusWrapper>
                <Box className="label">
                    Status:
                </Box>
                <Box className="status-to" onClick={handleStatusClick}>
                    <Typography component="span">{selectedStatus}</Typography>
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
                        {statusOption.map((status) => (
                        <Box
                            className="row status-option"
                            key={status.id}
                            onClick={() => handleStatusSelect(status.name)}
                        >
                            <Typography component="span">{status.name}</Typography>
                        </Box>
                        ))}
                    </Box>
                )}

            </StatusWrapper>

            <LinkAttached>
                <Box className="label">
                    Link Attached:
                </Box>
                <input type="text" name="link-attached" id="link-attached" placeholder="Link Attached" />
            </LinkAttached>

            <ActionButton>
                <button className="btn cancel" onClick={onClose}>Cancel</button>
                <button className="btn update">Update</button>
            </ActionButton>
        </ModalContainer>
    );
}

