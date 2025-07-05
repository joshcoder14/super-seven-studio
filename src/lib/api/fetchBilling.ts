import { Billing, FetchBillingsParams } from '@/types/billing';

export const fetchBillings = async ({ 
  start_year, 
  end_year 
}: FetchBillingsParams): Promise<Billing[]> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) throw new Error('No access token found');

        const fetchBillingsUrl = `/api/billings/?search[value]=&start_year=${start_year}&end_year=${end_year}`;
        const response = await fetch(fetchBillingsUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.status && result.data) {
            return result.data.data;
        }
        throw new Error(result.message || 'Failed to fetch billing data');
    } catch (error) {
        console.error('Error fetching billing data:', error);
        throw error;
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

