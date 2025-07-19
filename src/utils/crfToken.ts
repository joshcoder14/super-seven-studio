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