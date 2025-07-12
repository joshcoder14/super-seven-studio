import Swal from 'sweetalert2';
import { paths } from '@/paths';
import { 
    MappedFeedbackItem, 
    FeedbackApiItem,
    FeedbackDetailResponse,
    FeedbackApiResponse
} from '@/types/feedback';

export async function fetchFeedbacks(
    searchTerm: string = '',
    filterValue: string = '0',
    page: number = 1,
    perPage: number = 10,
    router: any
): Promise<{ data: MappedFeedbackItem[]; total: number }> {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) throw new Error('No access token found');

        const headers = {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        };

        const params = new URLSearchParams({
            'search[value]': searchTerm || '',
            'page': page.toString(),
            'perPage': perPage.toString()
        });

        if (filterValue === '1') {
            params.set('filters[posted]', 'true');
        } else if (filterValue === '2') {
            params.set('filters[unposted]', 'true');
        } else if (filterValue === '3') {
            params.set('filters[pending]', 'true');
        }

        const response = await fetch(`/api/feedbacks?${params.toString()}`, {
            headers,
            credentials: 'include'
        });

        // Use the dedicated FeedbackApiResponse interface
        const responseData: FeedbackApiResponse = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to fetch feedbacks');
        }

        if (!responseData.data || !Array.isArray(responseData.data.data)) {
            throw new Error('Invalid data format received from API');
        }

        return {
            data: responseData.data.data.map((item: FeedbackApiItem) => ({
                id: item.id.toString(),
                eventName: item.event_name,
                client: item.customer_name?.trim() || 'Unknown Client',
                bookingDate: item.booking_date,
                feedbackDate: item.feedback_date,
                status: item.feedback_status
            })),
            total: responseData.data.meta.total
        };

    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        
        await Swal.fire({
            title: 'Error!',
            text: error instanceof Error ? error.message : 'An unexpected error occurred',
            icon: 'error',
            confirmButtonText: 'OK'
        });

        if (error instanceof Error && (error.message === 'No access token found' || error.message.includes('401'))) {
            router.push(paths.login);
        }

        return { data: [], total: 0 };
    }
}

export async function submitFeedback(
  bookingId: number, 
  feedback_details: string
): Promise<void> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('Authentication required');

    const formData = new FormData();
    formData.append("feedback_details", feedback_details);

    const url = `/api/customer/bookings/${bookingId}/feedback/add`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create feedback');
    }

    return response.json();
}

export async function viewFeedback(bookingId: number): Promise<FeedbackDetailResponse> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('Authentication required');

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const isClient = user?.user_role === 'Client';
  
    const endpoint = isClient
        ? `/api/customer/bookings/${bookingId}/feedback/view`
        : `/api/feedbacks/${bookingId}`;

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        // Handle 404 specifically for "feedback not found"
        if (response.status === 404) {
            throw new Error('Feedback not found');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch feedback');
    }

    return response.json();
}

export async function markAsPosted(feedbackId: number): Promise<void> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('Authentication required');

    const method = 'POST';
    const url = `/api/feedbacks/${feedbackId}/mark-as-posted`;

    const response = await fetch(url, {
        method: method,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to post feedback`);
    }

    return response.json();
}

export async function markAsUnposted(feedbackId: number): Promise<void> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('Authentication required');

    const method = 'POST';
    const url = `/api/feedbacks/${feedbackId}/mark-as-unposted`;

    const response = await fetch(url, {
        method: method,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to unpost feedback');
    }

    return response.json();
}