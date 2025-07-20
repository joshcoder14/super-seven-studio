import { AuthPayload, AuthResponse, LoginPayload, RegisterPayload } from '@/types/user';
import { ensureCsrfToken } from '@/utils/crfToken';

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) throw new Error('User is already authenticated');

  const csrfToken = await ensureCsrfToken();

  const response = await fetch('/api/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'X-XSRF-TOKEN': csrfToken,
    },
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      remember: payload.remember
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  return response.json();
};

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) throw new Error('User is already authenticated');

  const formData = new FormData();
  formData.append("first_name", payload.first_name);
  formData.append("mid_name", '');
  formData.append("last_name", payload.last_name);
  formData.append("email", payload.email);
  formData.append("password", payload.password);
  formData.append("confirm_password", payload.confirm_password);
  formData.append("contact_no", payload.contact_no);
  formData.append("address", '');
  formData.append("customer_type", payload.customer_type.toString());

  const response = await fetch('/api/register', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'X-XSRF-TOKEN': await ensureCsrfToken(),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }

  return response.json();
};
