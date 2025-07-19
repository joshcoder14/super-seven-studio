import Swal from 'sweetalert2';
import { User, UserRole } from '@/types/user'
import { ensureCsrfToken } from '@/utils/crfToken';

const isUserRole = (role: any): role is UserRole => {
  return typeof role === 'string' && ['Owner', 'Secretary', 'Editor', 'Photographer', 'Client'].includes(role);
};

export async function updateUserProfile(formData: FormData): Promise<User>  {
    try {
      const csrfToken = await ensureCsrfToken();
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await fetch('/api/users/update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'X-XSRF-TOKEN': csrfToken
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
  const csrfToken = await ensureCsrfToken();
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch('/api/users/update-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'X-XSRF-TOKEN': csrfToken
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

export const fetchCurrentUser = async (): Promise<User | null> => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) throw new Error('No access token found');

  try {
    const response = await fetch('/api/users/current', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      },
      credentials: 'include'
    });

    if (response.status === 401) {
      console.warn('Unauthorized request: 401');
      return null;
    }

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return null;
    }

    const result = await response.json();

    const user = result?.data;
    if (!user || typeof user !== 'object' || !user.id || !user.email) {
      console.error('Malformed user data received:', result);
      return null;
    }

    // Optionally warn on missing role but still return user
    if (!isUserRole(user.user_role)) {
      console.warn('User has no valid role:', user.user_role);
      user.user_role = undefined;
    }

    return user;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    return null;
  }
};