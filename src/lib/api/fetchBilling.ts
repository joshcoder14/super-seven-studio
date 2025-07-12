import { Billing, FetchBillingsParams } from '@/types/billing';

export const fetchBillings = async ({ 
  start_year, 
  end_year,
  page = 1,
  perPage = 10
}: FetchBillingsParams): Promise<{ data: Billing[]; total: number }> => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) throw new Error('No access token found');

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const isClient = user?.user_role === 'Client';

  // Build base URL without pagination parameters
  const baseUrl = isClient 
    ? '/api/customer/billings'
    : '/api/billings/';

  const queryParams = new URLSearchParams({
    'search[value]': '',
    'start_year': String(start_year),
    'end_year': String(end_year)
  });

  // Add pagination ONLY for admin users
  if (!isClient) {
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(perPage));
  }

  const url = `${baseUrl}?${queryParams.toString()}`;
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  
  if (!result.status || !result.data) {
    throw new Error(result.message || 'Failed to fetch billing data');
  }

  // Handle client vs admin response differences
  if (isClient) {
    // Client receives flat array - implement client-side pagination
    const allBillings: Billing[] = result.data;
    const startIndex = (page - 1) * perPage;
    const paginatedData = allBillings.slice(startIndex, startIndex + perPage);
    
    return {
      data: paginatedData,
      total: allBillings.length
    };
  } else {
    // Admin receives paginated response
    return {
      data: result.data.data,
      total: result.data.meta.total
    };
  }
};

export const fetchBillingDetails = async (id: string): Promise<Billing> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) throw new Error('No access token found');

        const fetchBillingDetailsUrl = `/api/billings/${id}`;

        const response = await fetch(fetchBillingDetailsUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.status && result.data) {
            return result.data;
        }
        throw new Error(result.message || 'Failed to fetch billing details');
    } catch (error) {
        console.error('Error fetching billing details:', error);
        throw error;
    }
};

export async function addPayment(
    billingId: string,
    amount: string,
    paymentMethod: string,
    remarks: string
): Promise<void> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('No access token found');

    const formData = new FormData();
    formData.append('amount', amount);
    formData.append('payment_method', paymentMethod);
    formData.append('remarks', remarks);

    const response = await fetch(`/api/billings/${billingId}/add-payment`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment failed');
    }

    return response.json();
}

