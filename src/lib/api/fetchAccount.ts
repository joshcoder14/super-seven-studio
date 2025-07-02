import { User, ApiResponse } from '@/types/user';
import { accountFilterOptions } from '@/utils/filterOptions';

const mapApiStatusToFrontend = (apiStatus: string | boolean | null): string => {
  if (apiStatus === null || apiStatus === undefined) return '0';
  if (typeof apiStatus === 'boolean') return apiStatus ? '1' : '0';
  return apiStatus.toString().toLowerCase() === 'active' ? '1' : '0';
};

export async function fetchClients(
  searchTerm: string,
  page: number = 1,
  perPage: number = 10
): Promise<ApiResponse> {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) throw new Error('No access token found');

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };

  const queryParams = new URLSearchParams();
  queryParams.set('search[value]', searchTerm || '');
  queryParams.set('filters[user_type]', '1');
  queryParams.set('page', page.toString());
  queryParams.set('per_page', perPage.toString());

  const response = await fetch(`/api/customers?${queryParams.toString()}`, {
    credentials: 'include',
    headers,
  });

  if (!response.ok) throw new Error('Failed to fetch client data');
  
  const responseData = await response.json();
  
  return {
    ...responseData,
    data: {
      ...responseData.data,
      data: responseData.data?.data?.map((user: any) => ({
        id: user.id,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        mid_name: user.mid_name || '',
        full_name: user.full_name,
        email: user.email,
        contact_no: user.contact_no || user.contact_num || '',
        address: user.address,
        user_role: 'Clients',
        user_type: '1',
        status: user.status === 'active' || user.status === true || user.status === '1' ? '1' : '0',
        source: 'client'
      })) || []
    }
  };
}

export async function fetchEmployees(
  searchTerm: string,
  filterValue: string,
  page: number = 1,
  perPage: number = 10
): Promise<ApiResponse> {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) throw new Error('No access token found');

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };

  const queryParams = new URLSearchParams();
  queryParams.set('search[value]', searchTerm || '');
  queryParams.set('filters[user_type]', filterValue);
  queryParams.set('page', page.toString());
  queryParams.set('per_page', perPage.toString());

  const response = await fetch(`/api/employees?${queryParams.toString()}`, {
    credentials: 'include',
    headers,
  });

  if (!response.ok) throw new Error('Failed to fetch employee data');
  
  const responseData = await response.json();
  
  return {
    ...responseData,
    data: {
      ...responseData.data,
      data: responseData.data?.data?.map((user: any) => ({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        contact_no: user.contact_no,
        address: user.address,
        user_role: accountFilterOptions.find(opt => opt.value === filterValue)?.label || '',
        status: user.status === 'active' ? '1' : '0',
        source: 'employee',
        first_name: user.first_name,
        last_name: user.last_name,
        mid_name: user.mid_name
      })) || []
    }
  };
}

export async function fetchAllUsers(
  searchTerm: string,
  filterValue: string,
  page: number = 1,
  perPage: number = 10
): Promise<ApiResponse> {
  try {
    if (filterValue === '1') {
      return await fetchClients(searchTerm, page, perPage);
    }
    return await fetchEmployees(searchTerm, filterValue, page, perPage);
  } catch (error) {
    console.error('Failed to fetch users', error);
    throw error;
  }
}

// Add and Update Account
export async function ensureCsrfToken(): Promise<string> {
    const getCookieValue = (name: string): string | null => {
        if (typeof document === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            const cookieValue = parts.pop()?.split(';').shift();
            return cookieValue ? decodeURIComponent(cookieValue) : null;
        }
        return null;
    };

    const existingToken = getCookieValue('XSRF-TOKEN');
    if (existingToken) return existingToken;

    try {
        const response = await fetch(`/api/sanctum/csrf-cookie`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error(`CSRF fetch failed with status ${response.status}`);
        await new Promise(resolve => setTimeout(resolve, 100));

        const csrfToken = getCookieValue('XSRF-TOKEN');
        if (!csrfToken) throw new Error('XSRF-TOKEN cookie not found');
        return csrfToken;
    } catch (error) {
        console.error('CSRF Token Error:', error);
        throw new Error('Failed to obtain CSRF token');
    }
}

export async function addEmployee(
    formData: any
): Promise<{ success: boolean; message?: string }> {
    try {
        const csrfToken = await ensureCsrfToken();
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            throw new Error('Authentication required. Please login again.');
        }

        const headers = {
            'Accept': 'application/json',
            'X-XSRF-TOKEN': csrfToken,
            'Authorization': `Bearer ${accessToken}`
        };

        const formDataObj = new FormData();
        formDataObj.append("first_name", formData.firstName.trim());
        formDataObj.append("mid_name", formData.middleName.trim());
        formDataObj.append("last_name", formData.lastName.trim());
        formDataObj.append("email", formData.email.trim());
        formDataObj.append("contact_no", formData.contactNumber || '');
        formDataObj.append("address", formData.address.trim());
        formDataObj.append("user_type", formData.userType);
        formDataObj.append("status", formData.status);

        const response = await fetch('/api/employees/add', {
            method: 'POST',
            headers,
            body: formDataObj,
            credentials: 'include'
        });

        return handleApiResponse(response);
    } catch (error) {
        console.error('Add employee error:', error);
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Failed to add employee' 
        };
    }
}

export async function updateEmployee(
    accountId: string,
    formData: any
): Promise<{ success: boolean; message?: string }> {
    try {
        const csrfToken = await ensureCsrfToken();
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            throw new Error('Authentication required. Please login again.');
        }

        const headers = {
            'Accept': 'application/json',
            'X-XSRF-TOKEN': csrfToken,
            'Authorization': `Bearer ${accessToken}`
        };

        const formDataObj = new FormData();
        formDataObj.append("first_name", formData.firstName.trim());
        formDataObj.append("mid_name", formData.middleName.trim());
        formDataObj.append("last_name", formData.lastName.trim());
        formDataObj.append("email", formData.email.trim());
        formDataObj.append("contact_no", formData.contactNumber || '');
        formDataObj.append("address", formData.address.trim());
        formDataObj.append("user_type", formData.userType);
        formDataObj.append("status", formData.status);

        const response = await fetch(`/api/employees/${accountId}/update`, {
            method: 'POST',
            headers,
            body: formDataObj,
            credentials: 'include'
        });

        return handleApiResponse(response);
    } catch (error) {
        console.error('Update employee error:', error);
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Failed to update employee' 
        };
    }
}

export async function updateClient(
    accountId: string,
    formData: any
): Promise<{ success: boolean; message?: string }> {
    try {
        const csrfToken = await ensureCsrfToken();
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            throw new Error('Authentication required. Please login again.');
        }

        const headers = {
            'Accept': 'application/json',
            'X-XSRF-TOKEN': csrfToken,
            'Authorization': `Bearer ${accessToken}`
        };

        const formDataObj = new FormData();
        formDataObj.append("first_name", formData.firstName.trim());
        formDataObj.append("mid_name", formData.middleName.trim());
        formDataObj.append("last_name", formData.lastName.trim());
        formDataObj.append("email", formData.email.trim());
        formDataObj.append("contact_no", formData.contactNumber || '');
        formDataObj.append("address", formData.address.trim());
        formDataObj.append("status", formData.status);

        const response = await fetch(`/api/customers/${accountId}/update`, {
            method: 'POST',
            headers,
            body: formDataObj,
            credentials: 'include'
        });

        return handleApiResponse(response);
    } catch (error) {
        console.error('Update client error:', error);
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Failed to update client' 
        };
    }
}

// Shared response handler
async function handleApiResponse(response: Response): Promise<{ success: boolean; message?: string }> {
    let data = {};
    const contentType = response.headers.get('content-type');
    
    if (response.status !== 204 && contentType?.includes('application/json')) {
        data = await response.json();
    }

    if (!response.ok) {
        const message = (data as any)?.message || 'Operation failed';
        throw new Error(message);
    }

    return { success: true };
}

// Fetch employee by ID
export async function fetchEmployeeById(id: string): Promise<User> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('No access token found');

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    };

    const response = await fetch(`/api/employees/${id}/view`, {
        credentials: 'include',
        headers
    });

    if (!response.ok) throw new Error('Failed to fetch employee data');

    const responseData = await response.json();
    console.log('API Response:', responseData); // Debug log
    
    // Handle different possible response structures
    const user = responseData.data?.data || responseData.data || responseData;
    
    if (!user || !user.id) {
        console.error('Invalid user data structure:', user);
        throw new Error('User data not found in response');
    }

    return {
        id: user.id,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        mid_name: user.mid_name || '',
        full_name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        email: user.email || '',
        contact_no: user.contact_no || user.contact_num || '',
        address: user.address || '',
        user_role: user.user_role || accountFilterOptions.find(opt => opt.value === user.user_type)?.label || '',
        user_type: user.user_type || user.user_type || '',
        status: user.status === 'active' || user.status === true || user.status === '1' ? '1' : '0',
    };
}


// Fetch client by ID
export async function fetchClientById(id: string): Promise<User> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('No access token found');

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    };

    const response = await fetch(`/api/customers/${id}/view`, {
        credentials: 'include',
        headers
    });

    if (!response.ok) throw new Error('Failed to fetch employee data');

    const responseData = await response.json();
    
    // Handle different possible response structures
    const user = responseData.data?.data || responseData.data || responseData;
    
    if (!user || !user.id) {
        console.error('Invalid user data structure:', user);
        throw new Error('User data not found in response');
    }

    return {
        id: user.id,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        mid_name: user.mid_name || '',
        full_name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        email: user.email || '',
        contact_no: user.contact_no || user.contact_num || '',
        address: user.address || '',
        user_role: user.user_role || accountFilterOptions.find(opt => opt.value === user.user_type)?.label || '',
        user_type: user.user_type || user.user_type || '',
        status: user.status === 'active' || user.status === true || user.status === '1' ? '1' : '0',
    };
}