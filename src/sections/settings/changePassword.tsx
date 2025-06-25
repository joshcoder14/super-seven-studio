'use client';

import React from 'react';
import { Box, TextField } from '@mui/material';
import {  FormContainer } from './styles';
import { FormHeading } from '../../components/Heading/FormHeading';
import VisibilityIcon from '@mui/icons-material/Visibility';

export function ChangePassword(): React.JSX.Element {
    return (
        <FormContainer>
            <Box className="wrapper change-password">
                <FormHeading title="Change Password"/>

                <form action="">
                    <Box className="row">
                        <Box className="form-group">
                            <label htmlFor="new-password" className="form-label">New Password</label>
                            {/* <input type="password" name="new-password" id="new-password" className="form-control" required /> */}
                            <TextField variant="outlined" size="small" type="password" name="new-password" id="new-password" fullWidth className="form-control" />
                            <VisibilityIcon/>
                        </Box>
                    </Box>
                    <Box className="row">
                        <Box className="form-group">
                            <label htmlFor="confirm-password" className="form-label">Confirm New Password</label>
                            {/* <input type="password" name="confirm-password" id="confirm-password" className="form-control" required /> */}
                            <TextField variant="outlined" size="small" type="password" name="confirm-password" id="confirm-password" fullWidth className="form-control" />
                            <VisibilityIcon/>
                        </Box>
                    </Box>
                    <Box className="row">
                        <button className="btn cancel">Cancel</button>
                        <button className="btn update">Update</button>
                    </Box>
                </form>
            </Box>
        </FormContainer>
    );
}