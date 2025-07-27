export interface ApiResponse {
    status: boolean;
    message: string;
    data: Package[];
}

export interface Package {
    id: number;
    package_name: string;
    package_details: string;
    package_price: string;
    image_name: string | null;
    image_path: string | null;
    status: number;
}