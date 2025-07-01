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

// In fetchCurrentUser.ts
export async function updatePassword(password: string, confirmPassword: string): Promise<void> {
    const formData = new FormData();
    formData.append("password", password);
    formData.append("confirm_password", confirmPassword);

    const response = await fetch('/api/users/update-password', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password');
    }
}
