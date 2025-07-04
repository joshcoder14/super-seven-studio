import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const requireAuth = (req: NextRequest) => {
    const authToken = req.cookies.get('authToken')?.value
    if (!authToken) {
        return new Response('Unauthorized', { status: 401 })
    }
    return null
}

export const fetchUser = async (token: string): Promise<any> => {
    const response = await fetch('/api/user', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }
    
    return response.json();
};