export interface FetchReportParams {
    start_year: number;
    end_year: number;
    page?: number;
    perPage?: number;
}

export interface ReportData {
    id: number;
    booking_date: string;
    event_name: string;
    customer_name: string;
    total_amount: string;
}

export interface ReportResponse {
    data: ReportData[];
    links: {
        previous: string;
        next: string;
    };
    meta: {
        current_page: number;
        per_page: number;
        last_page: number;
        count: number;
        total: number;
    };
}