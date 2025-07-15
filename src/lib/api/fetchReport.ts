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

export const fetchPDFReport = async ({
    booking_year,
    package_year,
    package_month,
    transaction_start,
    transaction_end
}: {
    booking_year: number;
    package_year: number;
    package_month?: number;
    transaction_start: number;
    transaction_end: number;
}) => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) throw new Error('No access token found');

        let url = `/api/generate-report?booking_year=${booking_year}&package_year=${package_year}&transaction_start=${transaction_start}&transaction_end=${transaction_end}`;
        
        if (package_month) {
            url += `&package_month=${package_month}`;
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `report_${new Date().toISOString()}.pdf`);
        
        document.body.appendChild(link);
        link.click();
        
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
        console.error('Error downloading PDF report:', error);
        throw error;
    }
};