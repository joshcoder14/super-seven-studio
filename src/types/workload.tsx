export type DeliverableStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface WorkloadEmployee {
  id: number;
  full_name: string;
  workload_status: string;
  date_assigned: string;
  date_uploaded: string | null;
  avatar?: string;
}

export interface WorkloadApiItem {
  id: number;
  booking_date: string;
  event_name: string;
  customer_name: string;
  booking_address: string;
  expected_completion_date: string;
  completion_date: string;
  booking_workload_status: string;
  link: string;
  assigned_count?: number;
  assigned_employees: WorkloadEmployee[];
  deliverable_status?: DeliverableStatus;
}

export interface ApiWorkloadResponse {
  status: boolean;
  message: string;
  data: {
    data: WorkloadApiItem[];
    links: { previous: string; next: string };
    meta: any;
  };
}

export interface WorkloadAvatar {
  id: number | null;
  name: string;
  avatar: string;
}

export interface MappedWorkloadItem {
  id: string;
  eventName: string;
  client: string;
  bookingDate: string;
  assigned: WorkloadAvatar[];
  releaseDate: string;
  status: string;
  deliverableStatus: DeliverableStatus;
  booking_workload_status: string;
  link: string;
}

export const statusMap: Record<DeliverableStatus, string> = {
  0: 'Unassigned',
  1: 'Scheduled',
  2: 'Uploaded',
  3: 'For Edit',
  4: 'Editing',
  5: 'For Release',
  6: 'Completed'
};

export interface Employee {
  id: number;
  full_name: string;
  user_role: string;
  selected?: boolean;
}

export interface StatusOption {
  id: number;
  name: string;
  value: DeliverableStatus;
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export const statusOptions: StatusOption[] = [
  { id: 1, name: 'Unassigned', value: 0 },
  { id: 2, name: 'Scheduled', value: 1 },
  { id: 3, name: 'Uploaded', value: 2 },
  { id: 4, name: 'For Edit', value: 3 },
  { id: 5, name: 'Editing', value: 4 },
  { id: 6, name: 'For Release', value: 5 },
  { id: 7, name: 'Completed', value: 6 }
];