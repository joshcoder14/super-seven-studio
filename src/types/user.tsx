export interface AuthResponse {
    status: boolean;
    message: string;
    data: User;
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export interface User {
    id: string;
    first_name?: string;
    last_name?: string;
    mid_name?: string;
    full_name: string;
    email: string;
    contact_no: string;
    address: string;
    user_type?: string;
    user_role?: string;
    status: 'active' | 'disabled' | string;
    email_verified_at?: string;
}

export interface FormDataProps {
    firstName: string; 
    middleName: string; 
    lastName: string; 
    email: string; 
    contactNumber?: string; 
    address: string; 
    userType: string; 
    status: string ;
}