import { ReportResponse, FetchReportParams } from '@/types/reports';

export const fetchReports = async ({ 
    start_year, 
    end_year,
    page = 1,
    perPage = 10
}: FetchReportParams): Promise<ReportResponse> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) throw new Error('No access token found');

        const url = `/api/report/transactions?transaction_start=${start_year}&transaction_end=${end_year}&page=${page}&per_page=${perPage}`;
        const response = await fetch(url,
            {
                headers: {
                'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.status && result.data) {
            return result.data;
        }
        throw new Error(result.message || 'Failed to fetch report data');
    } catch (error) {
        console.error('Error fetching report data:', error);
        throw error;
    }
};

export const fetchBookingData = async (year: number) => {
    try {

        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) throw new Error('No access token found');

        const url = `/api/report/bookings?booking_year=${year}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error('Failed to fetch booking data');
        }
        
        return data.data;
    } catch (error) {
        console.error('Error fetching booking data:', error);
        throw error;
    }
};

export const fetchPackageData = async (year: number, month?: number) => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) throw new Error('No access token found');

        let url = `/api/report/packages?package_year=${year}`;
        if (month) {
            url += `&package_month=${month}`;
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error('Failed to fetch package data');
        }
        
        return data.data;
    } catch (error) {
        console.error('Error fetching package data:', error);
        throw error;
    }
};
