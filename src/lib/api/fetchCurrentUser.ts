// src/services/userService.ts
import Swal from 'sweetalert2';
import { User } from '@/types/user';

export async function updateUserProfile(formData: FormData): Promise<User>  {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('No access token found');
        }

        const response = await fetch('/api/users/update', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            },
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to update profile');
        }

        return result.data || result;
    } catch (error) {
        console.error('Update error:', error);
        await Swal.fire({
            title: 'Error!',
            text: error instanceof Error ? error.message : 'An unexpected error occurred',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        throw error;
    }
}

export async function updatePassword(password: string, confirmPassword: string): Promise<void> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        throw new Error('No access token found');
    }

    const response = await fetch('/api/users/update-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            password,
            confirm_password: confirmPassword
        }),
    });

    if (!response.ok) {
        let errorMessage = 'Failed to update password';
        
        try {
            // Try to parse JSON error first
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            // Fallback to text if not JSON
            const text = await response.text();
            errorMessage = text || errorMessage;
        }

        throw new Error(errorMessage);
    }
    
    // Update token after password change
    const data = await response.json();
    if (data.token) {
        localStorage.setItem('access_token', data.token);
    }
}
