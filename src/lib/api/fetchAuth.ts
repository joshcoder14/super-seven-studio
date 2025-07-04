import { paths } from '@/paths';
import { AuthPayload, AuthResponse } from '@/types/user';

const getCookieValue = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(';')[0]);
  return null;
};

export const ensureCsrfToken = async (): Promise<string> => {
  const existingToken = getCookieValue('XSRF-TOKEN');
  if (existingToken) return existingToken;

  const response = await fetch(`/api/sanctum/csrf-cookie`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Accept': 'application/json' }
  });

  if (!response.ok) throw new Error('Failed to obtain CSRF token');
  
  const csrfToken = getCookieValue('XSRF-TOKEN');
  if (!csrfToken) throw new Error('XSRF-TOKEN cookie not found');
  return csrfToken;
};

export const authenticateUser = async (
  payload: AuthPayload, 
  isLogin: boolean
): Promise<AuthResponse> => {  // Return full AuthResponse instead of just access_token
  const csrfToken = await ensureCsrfToken();
  const endpoint = isLogin ? '/api/login' : '/api/register';

  const response = await fetch(endpoint, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-XSRF-TOKEN': csrfToken,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json() as AuthResponse;
  if (!response.ok) throw new Error(data.message || 'Authentication failed');
  return data; // Return full response object
};