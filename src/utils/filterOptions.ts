export const accountFilterOptions = [
  { value: '3', label: 'Owner' },
  { value: '4', label: 'Secretary' },
  { value: '5', label: 'Photographer' },
  { value: '6', label: 'Editor' },
  { value: '1', label: 'Clients' },
] as const;

export const workloadFilterOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: '0', label: 'Unassigned' },
  { value: '1', label: 'Scheduled' },
  { value: '2', label: 'Uploaded' },
  { value: '3', label: 'For Edit' },
  { value: '4', label: 'Editing' },
  { value: '5', label: 'For Release' },
  { value: '6', label: 'Completed' },
];

export const feedBackFilterOptions = [
  { value: '0', label: 'All' },
  { value: '1', label: 'Posted' },
  { value: '2', label: 'Unposted' },
  { value: '3', label: 'Pending' },
] as const;

export type AccountFilterOption = typeof accountFilterOptions[number];
export type WorkloadFilterOption = typeof workloadFilterOptions[number];
export type FeedBackFilterOption = typeof feedBackFilterOptions[number];
