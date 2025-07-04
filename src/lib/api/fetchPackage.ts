export const fetchPackages = async (searchTerm: string = ''): Promise<any> => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('Authentication required');

    const url = `/api/packages?search[value]=${encodeURIComponent(searchTerm)}`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch packages: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
};

export const fetchAddons = async (searchTerm: string = ''): Promise<any> => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('Authentication required');

    const url = `/api/addons?search[value]=${encodeURIComponent(searchTerm)}`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch addons: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
};

// Add functions
export const createPackage = async (data: { name: string; price: string; details: string }) => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('Authentication required');

    const response = await fetch('/api/packages/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            package_name: data.name,
            package_price: data.price,
            package_details: data.details
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create package');
    }

  return response.json();
};

export const createAddon = async (data: { name: string; price: string; details: string }) => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('Authentication required');

    const response = await fetch('/api/addons/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            add_on_name: data.name,
            add_on_price: data.price,
            add_on_details: data.details
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create add-on');
    }

    return response.json();
};

// Update functions
export const updatePackage = async (id: number, data: { name: string; price: string; details: string }) => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('Authentication required');

    const formData = new FormData();
    formData.append("package_name", data.name);
    formData.append("package_price", data.price);
    formData.append("package_details", data.details);

    const response = await fetch(`/api/packages/${id}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update package');
    }

    return response.json();
};

export const updateAddon = async (id: number, data: { name: string; price: string; details: string }) => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('Authentication required');

    const formData = new FormData();
    formData.append("add_on_name", data.name);
    formData.append("add_on_price", data.price);
    formData.append("add_on_details", data.details);

    const response = await fetch(`/api/addons/${id}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update add-on');
    }

    return response.json();
};

// Delete functions
export const deletePackage = async (id: number) => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('Authentication required');

    const response = await fetch(`/api/packages/${id}/delete`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete package');
    }

    return response.json();
};

export const deleteAddon = async (id: number) => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('Authentication required');

    const response = await fetch(`/api/addons/${id}/delete`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete add-on');
    }

    return response.json();
};