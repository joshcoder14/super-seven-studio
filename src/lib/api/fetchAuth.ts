import { AuthPayload, AuthResponse } from '@/types/user';
import { ensureCsrfToken } from '@/utils/crfToken';

export const authenticateUser = async (
  payload: AuthPayload, 
  isLogin: boolean
): Promise<AuthResponse> => {

  const accessToken = localStorage.getItem('access_token');
  if (accessToken) throw new Error('User is already authenticated');

  const csrfToken = await ensureCsrfToken();

  const endpoint = isLogin ? '/api/login' : '/api/register';

  const response = await fetch(endpoint, {
    method: 'POST',
    credentials: 'include', // Important for cookies
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'X-XSRF-TOKEN': csrfToken,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Authentication failed');
  }

  return response.json();
};