'use client';

import React from 'react';
import { Box, TextField, Button } from '@mui/material';
import {  FormContainer } from './styles';
import { FormHeading } from '../../components/Heading/FormHeading';

export function EditProfile(): React.JSX.Element {
    return (
        <FormContainer>
            <Box className="wrapper">
                <FormHeading title="Edit Profile"/>

                <form action="">
                    <Box className="row col-3">
                        <Box className="form-group">
                            <label className="form-label">First Name</label>
                            <TextField variant="outlined" size="small" fullWidth className="form-control" />
                        </Box>
                        <Box className="form-group">
                            <label className="form-label">Middle Name</label>
                            <TextField variant="outlined" size="small" fullWidth className="form-control" />
                        </Box>
                        <Box className="form-group">
                            <label className="form-label">Last Name</label>
                            <TextField variant="outlined" size="small" fullWidth className="form-control" />
                        </Box>
                    </Box>

                    <Box className="row col-2">
                        <Box className="form-group">
                            <label className="form-label">Email Address</label>
                            <TextField variant="outlined" size="small" type="email" fullWidth className="form-control" />
                        </Box>
                        <Box className="form-group">
                            <label className="form-label">Contact Number</label>
                            <TextField variant="outlined" size="small" fullWidth className="form-control" />
                        </Box>
                    </Box>

                    <Box className="row col-1">
                        <Box className="form-group">
                            <label className="form-label">Address</label>
                            <TextField variant="outlined" size="small" fullWidth className="form-control" />
                        </Box>
                    </Box>

                    <Box className="row col-1 right">
                        <Button variant="outlined" className="btn cancel">Cancel</Button>
                        <Button variant="contained" className="btn update">Update</Button>
                    </Box>
                </form>
            </Box>
        </FormContainer>
    );
}