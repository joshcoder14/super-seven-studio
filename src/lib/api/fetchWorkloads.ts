import Swal from 'sweetalert2';
import { paths } from '@/paths';
import { icons } from '@/icons';
import { 
  ApiWorkloadResponse, 
  MappedWorkloadItem, 
  WorkloadApiItem, 
  statusMap,
  WorkloadAvatar,
  Employee,
  ApiResponse,
  DeliverableStatus
} from '@/types/workload';

export async function fetchWorkloads(
  searchTerm: string = '',
  filterValue: string = 'all',
  router: any
): Promise<MappedWorkloadItem[]> {
  try {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('No access token found');

    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    const params = new URLSearchParams({
      'search[value]': searchTerm || ''
    });

    if (filterValue !== 'all') {
      params.set('filters[deliverable_status]', filterValue);
    } else {
      params.set('filters[deliverable_status]', 'false');
    }

    const response = await fetch(`/api/workload?${params.toString()}`, {
      headers,
      credentials: 'include'
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to fetch workloads');
    }

    const result: ApiWorkloadResponse = responseData;
    
    if (!result.data || !Array.isArray(result.data.data)) {
      throw new Error('Invalid data format received from API');
    }

    return result.data.data.map((item: WorkloadApiItem) => {
      const avatars: WorkloadAvatar[] = [];
      const count = item.assigned_count || 0;
      
      // Create avatars based on assigned_count
      for (let i = 0; i < count; i++) {
        const employee = item.assigned_employees[i];
        
        if (employee) {
          avatars.push({
            id: employee.id,
            name: employee.full_name,
            avatar: employee.avatar || icons.profileIcon
          });
        } else {
          // Placeholder for missing employee data
          avatars.push({
            id: null,
            name: 'Unknown Employee',
            avatar: icons.profileIcon
          });
        }
      }

      return {
        id: item.id.toString(),
        eventName: item.event_name,
        client: item.customer_name?.trim() || 'Unknown Client',
        bookingDate: item.booking_date,
        assigned: avatars,
        releaseDate: item.expected_completion_date,
        ceremony_time: item.ceremony_time,
        package_name: item.package_name,
        status: statusMap[item.deliverable_status || 0],
        deliverableStatus: item.deliverable_status || 0,
        booking_workload_status: item.booking_workload_status,
        booking_address: item.booking_address,
        link: item.link || ''
      };
    });

  } catch (error) {
    console.error('Error fetching workloads:', error);
    
    await Swal.fire({
      title: 'Error!',
      text: error instanceof Error ? error.message : 'An unexpected error occurred',
      icon: 'error',
      confirmButtonText: 'OK'
    });

    if (error instanceof Error && (error.message === 'No access token found' || error.message.includes('401'))) {
      router.push(paths.login);
    }

    return [];
  }
}

export const fetchAvailableEmployees = async (workloadId: string): Promise<Employee[]> => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('No access token found');

    const response = await fetch(`/api/workload/${workloadId}/employees`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) throw new Error('Failed to fetch available employees');

    const data: ApiResponse<Employee[]> = await response.json();
    if (!data.status) throw new Error(data.message);

    return data.data;
};

export const fetchWorkloadDetailsById = async (workloadId: string): Promise<WorkloadApiItem> => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) throw new Error('No access token found');

  const response = await fetch(`/api/workload/${workloadId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
  });

  if (!response.ok) throw new Error('Failed to fetch booking details');

  const data: ApiResponse<WorkloadApiItem> = await response.json();
  if (!data.status) throw new Error(data.message);

  return data.data;
};

export async function fetchEmployeeWorkloads(
  searchTerm: string = '',
  filterValue: string = 'all',
  router: any
): Promise<MappedWorkloadItem[]> {
  try {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('No access token found');

    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    const params = new URLSearchParams({
      'search[value]': searchTerm || ''
    });

    if (filterValue !== 'all') {
      params.set('filters[deliverable_status]', filterValue);
    }

    const response = await fetch(`/api/employee/workloads?${params.toString()}`, {
      headers,
      credentials: 'include'
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to fetch employee workloads');
    }

    // CORRECTED: Access the right data path based on your API response
    const apiData = responseData.data?.data;
    if (!Array.isArray(apiData)) {
      console.error('Invalid employee workload data format:', responseData);
      throw new Error('Invalid data format received from employee workload API');
    }

    return apiData.map((item: WorkloadApiItem) => {
      const avatars: WorkloadAvatar[] = [];
      const assignedEmployees = item.assigned_employees || [];
      
      // Map all assigned employees
      for (const employee of assignedEmployees) {
        avatars.push({
          id: employee.id,
          name: employee.full_name,
          avatar: employee.avatar || icons.profileIcon
        });
      }

      return {
        id: item.id.toString(),
        eventName: item.event_name,
        client: item.customer_name?.trim() || 'Unknown Client',
        bookingDate: item.booking_date,
        assigned: avatars,
        releaseDate: item.expected_completion_date,
        ceremony_time: item.ceremony_time,
        package_name: item.package_name,
        status: statusMap[item.deliverable_status || 0],
        deliverableStatus: item.deliverable_status || 0,
        booking_workload_status: item.booking_workload_status,
        booking_address: item.booking_address,
        link: item.link || ''
      };
    });

  } catch (error) {
    console.error('Error fetching employee workloads:', error);
    
    await Swal.fire({
      title: 'Error!',
      text: error instanceof Error ? error.message : 'An unexpected error occurred',
      icon: 'error',
      confirmButtonText: 'OK'
    });

    if (error instanceof Error && (error.message === 'No access token found' || error.message.includes('401'))) {
      router.push(paths.login);
    }

    return [];
  }
}

export const updateWorkloadAssignment = async (
  workloadId: string,
  payload: {
    expected_completion_date: string | null;
    deliverable_status: DeliverableStatus;
    link: string;
    user_id: number[];
  }
): Promise<void> => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) throw new Error('No access token found');

  const form = new FormData();
  
  if (payload.expected_completion_date) {
    form.append('expected_completion_date', payload.expected_completion_date);
  }
  
  form.append('deliverable_status', payload.deliverable_status.toString());
  form.append('link', payload.link || '');
  
  payload.user_id.forEach((id, index) => {
    form.append(`user_id[${index}]`, id.toString());
  });

  const response = await fetch(`/api/workload/${workloadId}/assign`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    body: form
  });

  const responseData = await response.json();

  if (!response.ok || responseData.status !== true) {
    throw new Error(responseData.message || 'Failed to update workload');
  }
};

export const validateAssignment = (
  status: DeliverableStatus,
  employees: number[]
): string | null => {
  if (status === 0 && employees.length > 0) {
    return 'Cannot assign employees when status is Unassigned';
  }
  
  if (status !== 0 && employees.length === 0) {
    return 'Please assign at least one employee for this status';
  }
  
  return null;
};

export const showConfirmationDialog = async (): Promise<boolean> => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You are about to update this workload item.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#2BB673',
    cancelButtonColor: '#AAAAAA',
    confirmButtonText: 'Yes, update it!',
    cancelButtonText: 'Cancel'
  });
  
  return result.isConfirmed;
};

export const showValidationError = async (message: string): Promise<void> => {
  await Swal.fire({
    title: 'Validation Error',
    text: message,
    icon: 'error',
    confirmButtonColor: '#2BB673',
  });
};